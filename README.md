# useDbState

`useDbState` is a custom React hook that allows you to persist state in IndexedDB. It provides an easy-to-use Hook similar to `useState`, but with the added benefit of persistent storage. It uses IndexedDB to store and retrieve state, ensuring that it is always available even after the user closes the browser tab or device.

## Installation

```bash
npm install use-db-state
```

## Usage

```js
import useDbState from 'use-db-state';

function App() {
  const [myValue, setMyValue] = useDbState('myValue', '');

  return (
    <div className="App">
      <h1>My App</h1>
      <div>
        <input type='text' value={myValue} onChange={e => setMyValue(e.target.value)} />
      </div>
    </div>
  );
}

export default App;
```

In this example, `useDbState` is used to create a state variable `myValue` with a setter `setMyValue`. The initial value of `myValue` is an empty string. The state is persisted in IndexedDB, so it will be preserved across page reloads.

## API

`useDbState` takes four arguments:

- `key` (required): A unique key to identify the state in IndexedDB.
- `defaultValue` (required): The default value for the state. This value is used if no value is found in IndexedDB for the given key.
- `dbName` (optional): The name of the IndexedDB database where the state will be stored. If not provided, defaults to `'userDatabase'`.
- `storeName` (optional): The name of the object store within the database where the state will be stored. If not provided, defaults to `'userData'`.

`useDbState` returns an array with two elements:

- The current state value.
- A setter function to update the state. This function has the same API as the setter returned by `useState`.

```js
import useDbState from 'use-db-state';

function App() {
  const [myValue, setMyValue] = useDbState('myValue', '', 'myCustomDatabase', 'myCustomStore');

  return (
    <div className="App">
      <h1>My App</h1>
      <div>
        <input type='text' value={myValue} onChange={e => setMyValue(e.target.value)} />
      </div>
    </div>
  );
}

export default App;

```
In this example, `useDbState` is used to create a state variable `myValue` with a setter `setMyValue`. The initial value of `myValue` is an empty string. The state is persisted in a custom IndexedDB database named `'myCustomDatabase'`, and within that database, it’s stored in an object store named `'myCustomStore'`. The state will be preserved across page reloads.

## When to Use

Use `useDbState` when you need to persist state across page reloads. It’s particularly useful for things like user preferences or form data that you want to preserve if the user accidentally refreshes or navigates away from the page.

## Limitations

`useDbState` uses `IndexedDB` for storage, which is asynchronous and has certain limitations. It’s not suitable for storing very large amounts of data in a single state variable, and complex data structures may need to be serialized before storage.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request on the GitHub repository.

## License
This project is licensed under the MIT license