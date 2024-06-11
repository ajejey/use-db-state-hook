import { useCallback } from 'react';

/**
 * Returns a function that removes a key from an IndexedDB object store.
 *
 * @param {string} dbName - The name of the IndexedDB database. Defaults to 'userDatabase'.
 * @param {string} storeName - The name of the IndexedDB object store. Defaults to 'userData'.
 * @return {function} A function that takes a key and removes it from the object store.
 */
const useDbKeyRemover = (dbName, storeName) => {
  dbName = dbName || 'userDatabase';
  storeName = storeName || 'userData';

  const removeDbKey = useCallback(async (key) => {
    try {
      const request = indexedDB.open(dbName, 1);

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);

        const request = objectStore.delete(key);

        request.onsuccess = () => {
          // console.log('Data removed from IndexedDB.');
        };

        request.onerror = () => {
          console.error('Error removing data from IndexedDB:', request.error);
        };
      };

      request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event.target.error);
      };
    } catch (error) {
      console.error('Error removing data from IndexedDB:', error);
    }
  }, [dbName, storeName]);

  return removeDbKey;
};

export default useDbKeyRemover;