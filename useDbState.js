import { useEffect, useState, useRef, useCallback } from 'react';
import { getDbInstance } from './utils/indexedDB';
import { subscribe, unsubscribe, notify } from './utils/subscriptions';

// In-memory cache for initial values
const initialValuesCache = new Map();

// Queue to manage DB operations
class OperationQueue {
  constructor() {
    this.queue = Promise.resolve();
  }

  enqueue(operation) {
    return new Promise((resolve, reject) => {
      this.queue = this.queue
        .then(() => operation())
        .then(resolve)
        .catch(reject);
    });
  }
}

const operationQueues = new Map();

const getQueueForKey = (key) => {
  if (!operationQueues.has(key)) {
    operationQueues.set(key, new OperationQueue());
  }
  return operationQueues.get(key);
};

const getDbValue = async (dbName, storeName, key) => {
  const db = await getDbInstance(dbName, storeName);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.get(key);

    request.onsuccess = (event) => {
      const result = event.target.result ? event.target.result.value : undefined;
      if (result !== undefined) {
        initialValuesCache.set(key, result);
      }
      resolve(result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const setDbValue = async (dbName, storeName, key, value) => {
  return getQueueForKey(key).enqueue(async () => {
    const db = await getDbInstance(dbName, storeName);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.put({ id: key, value });

      request.onsuccess = () => {
        initialValuesCache.set(key, value);
        notify(key, value);
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  });
};

// Debounce utility
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * A React hook that provides persistent state management using IndexedDB with automatic synchronization
 * across multiple components and tabs. It includes features like debouncing, in-memory caching, and
 * queued operations for improved performance and reliability.
 *
 * @param {string} key - Unique identifier for the state in IndexedDB
 * @param {*} defaultValue - Initial value to use if no value exists in IndexedDB
 * @param {string} [dbName='userDatabase'] - Name of the IndexedDB database
 * @param {string} [storeName='userData'] - Name of the object store within the database
 * @param {Object} [options] - Configuration options
 * @param {number} [options.debounceTime=100] - Debounce time in milliseconds for DB writes
 * 
 * @returns {[*, Function]} A tuple containing:
 *   - The current state value
 *   - A setter function that accepts either a new value or an updater function
 * 
 * @example
 * // Basic usage
 * const [value, setValue] = useDbState('myKey', 'default');
 * 
 * // With custom database and store names
 * const [value, setValue] = useDbState('myKey', 0, 'customDB', 'customStore');
 * 
 * // With custom options
 * const [value, setValue] = useDbState('myKey', [], undefined, undefined, { debounceTime: 500 });
 * 
 * // Using the setter function
 * setValue(newValue);
 * setValue(prevValue => prevValue + 1);
 */
const useDbState = (
  key, 
  defaultValue, 
  dbName = 'userDatabase', 
  storeName = 'userData',
  options = { debounceTime: 100 }
) => {
  // If a defaultValue is provided and no cached value exists, set it in the cache
  if (defaultValue !== undefined && !initialValuesCache.has(key)) {
    initialValuesCache.set(key, defaultValue);
  }

  // Initialize with cached value if available, otherwise use defaultValue
  const [value, setValueState] = useState(() => initialValuesCache.get(key) ?? defaultValue);
  const didInit = useRef(false);
  const previousValueRef = useRef(value);
  const isSyncing = useRef(false);
  const subscriptionHandlerRef = useRef(null);

  // Memoize the debounced sync function
  const debouncedSync = useCallback(
    debounce((newValue) => {
      setDbValue(dbName, storeName, key, newValue).catch((error) => {
        console.error('Error setting value in IndexedDB:', error);
      });
    }, options.debounceTime),
    [dbName, storeName, key, options.debounceTime]
  );

  // Custom setValue function that manages local and DB state
  const setValue = useCallback((newValue) => {
    const resolvedValue = typeof newValue === 'function' 
      ? newValue(previousValueRef.current) 
      : newValue;

    if (JSON.stringify(resolvedValue) !== JSON.stringify(previousValueRef.current)) {
      previousValueRef.current = resolvedValue;
      initialValuesCache.set(key, resolvedValue); // Update cache immediately
      setValueState(resolvedValue);
      
      if (didInit.current && !isSyncing.current) {
        debouncedSync(resolvedValue);
      }
    }
  }, [debouncedSync, key]);

  // Initial load from IndexedDB and subscription setup
  useEffect(() => {
    let mounted = true;

    if (!didInit.current) {
      isSyncing.current = true;
      
      getDbValue(dbName, storeName, key)
        .then((storedValue) => {
          if (!mounted) return;
          
          if (storedValue !== undefined) {
            previousValueRef.current = storedValue;
            setValueState(storedValue);
          } else if (defaultValue !== undefined) {
            // If no stored value but we have a default, store it
            debouncedSync(defaultValue);
          }
          didInit.current = true;
        })
        .catch((error) => {
          console.error('Error fetching value from IndexedDB:', error);
        })
        .finally(() => {
          if (mounted) {
            isSyncing.current = false;
          }
        });

      // Store the subscription handler in a ref for cleanup
      subscriptionHandlerRef.current = (newValue) => {
        if (!mounted) return;
        
        isSyncing.current = true;
        previousValueRef.current = newValue;
        initialValuesCache.set(key, newValue); // Update cache on subscription updates
        setValueState(newValue);
        isSyncing.current = false;
      };

      // Set up subscription
      subscribe(key, subscriptionHandlerRef.current);
    }

    // Cleanup function
    return () => {
      mounted = false;
      if (subscriptionHandlerRef.current) {
        unsubscribe(key, subscriptionHandlerRef.current);
        subscriptionHandlerRef.current = null;
      }
    };
  }, [dbName, storeName, key, defaultValue, debouncedSync]);

  return [value, setValue];
};

export default useDbState;
