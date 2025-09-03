const subscriptions = new Map();

export const subscribe = (key, callback) => {
  if (!subscriptions.has(key)) {
    subscriptions.set(key, new Set());
  }
  subscriptions.get(key).add(callback);
};

export const notify = (key, value) => {
  if (subscriptions.has(key)) {
    subscriptions.get(key).forEach(callback => callback(value));
  }
};

export const unsubscribe = (key, callback) => {
  if (subscriptions.has(key)) {
    subscriptions.get(key).delete(callback);
    if (subscriptions.get(key).size === 0) {
      subscriptions.delete(key);
    }
  }
};