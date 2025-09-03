# useDbState

[![npm version](https://img.shields.io/npm/v/use-db-state.svg)](https://www.npmjs.com/package/use-db-state)
[![npm downloads](https://img.shields.io/npm/dm/use-db-state.svg)](https://www.npmjs.com/package/use-db-state)
[![license](https://img.shields.io/npm/l/use-db-state.svg)](https://github.com/yourusername/use-db-state/blob/main/LICENSE)

> 🚀 A powerful React hook for persistent state management with IndexedDB, featuring global state management, automatic caching, and optimized performance.

`useDbState` is a production-ready React hook that combines the simplicity of `useState` with the persistence of IndexedDB and power of global state management. It's perfect for managing application-wide state, offline-first applications, and sharing state between components.

## 🆕 React 19 Support

**✅ Fully compatible with React 19.x** (including React 19.1.1)

This package supports both React 18 and React 19, ensuring smooth upgrades:
- **React 18.2.0+**: Full compatibility maintained
- **React 19.0.0+**: Fully tested and compatible with all React 19 features
- **No breaking changes**: Seamless upgrade from React 18 to 19
- **Future-proof**: Automatically supports all React 19.x releases

> ## use-db-state@2.0.0 can now be used as a global state!

## ✨ Features

- 🌍 **Global State Management**: Share state seamlessly between components
- 💾 **Persistent Storage**: Data persists through page reloads and browser restarts
- ⚡ **Performance Optimized**: 
  - In-memory caching for fast reads
  - Debounced writes to reduce database operations
  - Queued operations to prevent race conditions
- 🛡️ **Reliable**: Automatic error handling and recovery
- 🔍 **Developer Friendly**: Comprehensive debugging support
- 📱 **Universal**: Works in all modern browsers and React Native

## 🎮 Live Examples

Here are several live examples demonstrating different use cases and features of `useDbState`:

### Basic Counter with Persistence
[View Demo](https://stackblitz.com/edit/vitejs-vite-jnzmby?file=src%2FApp.jsx)
A simple counter example showing how state persists across page refreshes. Perfect for getting started with `useDbState`.

### String State Sharing
[View Demo](https://stackblitz.com/edit/vitejs-vite-auyxlh?file=src%2FApp.jsx)
Demonstrates how two components can share a string state, showing real-time updates between components.

### Optimized Number Updates
[View Demo](https://stackblitz.com/edit/vitejs-vite-rjq6uk?file=src%2FApp.jsx)
Showcases the hook's handling of rapid state changes with numbers, featuring:
- Race condition prevention
- Internal debouncing
- Optimized performance for fast updates

### Array State Management
[View Demo](https://stackblitz.com/edit/vitejs-vite-4rvslg?file=src%2FApp.jsx)
Shows how arrays are handled in shared state:
- Adding elements to array
- Real-time updates across components
- Array manipulation with persistence

### Object State Handling
[View Demo](https://stackblitz.com/edit/vitejs-vite-zrd7jb?file=src%2FApp.jsx)
Demonstrates working with complex object states:
- Object property updates
- Nested object handling
- State synchronization between components

### Image Storage and Sharing
[View Demo](https://stackblitz.com/edit/vitejs-vite-z3hluk?file=src%2FApp.jsx)
Advanced example showing:
- Binary data storage
- Image handling in IndexedDB
- Sharing images between components
- Efficient large data management

Each example is fully interactive and can be edited live on StackBlitz. They serve as both documentation and a playground for learning how to use `useDbState` effectively.

## 📦 Installation

```bash
npm install use-db-state
# or
yarn add use-db-state
# or
pnpm add use-db-state
```

### Requirements

- **React**: 18.2.0+ or 19.0.0+
- **React DOM**: 18.2.0+ or 19.0.0+
- **Browser**: Modern browsers with IndexedDB support

## 🚀 Quick Start

```jsx
import { useDbState } from 'use-db-state';

function Counter() {
  const [count, setCount] = useDbState('counter', 0);
  
  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      Count: {count}
    </button>
  );
}
```

## 📖 Global State Usage

```js
import { useDbState, useDbKeyRemover } from 'use-db-state';

function ComponentOne() {
  const [myValue, setMyValue] = useDbState('myValue', '');
  const removeMyKey = useDbKeyRemover(); 

  const handleChange = (e) => {
    setMyValue(e.target.value);
  };

  return (
    <div className="App">
      <h1>My App</h1>
      <div>
        <input type='text' value={myValue} onChange={handleChange} />
        <button onClick={() => removeMyKey('myValue')}>Remove myValue</button>
      </div>
    </div>
  );
}

function ComponentTwo() {
  const [myValue, setMyValue] = useDbState('myValue'); // You now have access to the myValue state from ComponentOne

  return (
    <div className="App">
      <h1>My App</h1>
      <div>
        <p>myValue: {myValue}</p>
      </div>
    </div>
  );
}
```

In this example, `useDbState` is used to create a global state variable `myValue` that can be accessed and modified from any component. The state is persisted in IndexedDB, so it will be preserved across page reloads. The useDbKeyRemover hook is used to remove the key `myValue` from the IndexedDB object store when needed.

## 📚 API Reference

### useDbState

```typescript
function useDbState<T>(
  key: string,
  defaultValue?: T,
  dbName?: string,
  storeName?: string,
  options?: {
    debounceTime?: number;
  }
): [T, (value: T | ((prev: T) => T)) => void]
```

#### Parameters

- `key` (required): Unique identifier for the state
- `defaultValue`: Initial value if none exists in storage
- `dbName`: Database name (default: 'userDatabase')
- `storeName`: Store name (default: 'userData')
- `options`: Configuration object
  - `debounceTime`: Milliseconds to debounce writes (default: 100)

#### Returns

Returns a tuple containing:
1. Current state value
2. Setter function (accepts new value or updater function)

### useDbKeyRemover

```typescript
function useDbKeyRemover(
  dbName?: string,
  storeName?: string
): (key: string) => Promise<void>
```

## ⚡ Performance Considerations

- **In-Memory Cache**: First reads are cached for instant access
- **Debounced Writes**: Prevents excessive database operations
- **Operation Queue**: Ensures write operations are atomic
- **Cleanup**: Automatic subscription cleanup on unmount

## 🔄 Migration Guide

### Upgrading to React 19

No code changes required! Simply update your React dependencies:

```bash
npm install react@^19.0.0 react-dom@^19.0.0
```

Your existing `useDbState` code will work identically in React 19:

```jsx
// This code works in both React 18 and 19
const [data, setData] = useDbState('myKey', defaultValue);
```


## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

MIT © Ajey Nagarkatti

## 🔍 Keywords

react, hook, indexeddb, state management, persistent storage, cross-tab synchronization, react-hooks, browser storage, offline-first, web storage, react state, database, web development, frontend, javascript

---

<p align="center">Made with ❤️ for the React community</p>