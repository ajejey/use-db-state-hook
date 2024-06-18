const subscriptions = new Map();

export const subscribe = (key, callback) => {
  if (!subscriptions.has(key)) {
    subscriptions.set(key, []);
  }
  subscriptions.get(key).push(callback);
};

export const notify = (key, value) => {
  if (subscriptions.has(key)) {
    for (const callback of subscriptions.get(key)) {
      callback(value);
    }
  }
};