# useDbState

`useDbState` is a custom React hook that allows you to persist state in IndexedDB. It provides an easy-to-use Hook similar to `useState`, but with the added benefit of persistent storage. It uses IndexedDB to store and retrieve state, ensuring that it is always available even after the user closes the browser tab or device.

## Installation

```bash
npm install use-db-state
```

## Usage

```js
import { useDbState, useDbKeyRemover } from 'use-db-state';

function App() {
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

export default App;
```

In this example, `useDbState` is used to create a state variable `myValue` with a setter `setMyValue`. The initial value of `myValue` is an empty string. The state is persisted in IndexedDB, so it will be preserved across page reloads. The useDbKeyRemover hook is used to remove the key `myValue` from the IndexedDB object store when the component unmounts.



## API

### useDbState

`useDbState` takes four arguments:

- `key` (required): A unique key to identify the state in IndexedDB.
- `defaultValue` (required): The default value for the state. This value is used if no value is found in IndexedDB for the given key.
- `dbName` (optional): The name of the IndexedDB database where the state will be stored. If not provided, defaults to `'userDatabase'`.
- `storeName` (optional): The name of the object store within the database where the state will be stored. If not provided, defaults to `'userData'`.

`useDbState` returns an array with two elements:

- The current state value.
- A setter function to update the state. This function has the same API as the setter returned by `useState`.

### useDbKeyRemover

`useDbKeyRemover` takes two arguments:

- `dbName` (optional): The name of the IndexedDB database. If not provided, defaults to `'userDatabase'`.

- `storeName` (optional): The name of the object store within the database. If not provided, defaults to `'userData'`.


`useDbKeyRemover` returns a function that removes the given key from the IndexedDB object store.

- `key` (required): The key to remove from the IndexedDB object store using the returned function.

```js
import useDbState from 'use-db-state';

function App() {
  const [myValue, setMyValue] = useDbState('myValue', '', 'myCustomDatabase', 'myCustomStore');
  const removeMyKey = useDbKeyRemover('myCustomDatabase', 'myCustomStore');

  return (
    <div className="App">
      <h1>My App</h1>
      <div>
        <input type='text' value={myValue} onChange={e => setMyValue(e.target.value)} />
        <button onClick={() => removeMyKey('myValue')}>Remove myValue</button>
      </div>
    </div>
  );
}

export default App;

```
In this example, `useDbState` is used to create a state variable `myValue` with a setter `setMyValue`. The initial value of `myValue` is an empty string. The state is persisted in a custom IndexedDB database named `'myCustomDatabase'`, and within that database, it’s stored in an object store named `'myCustomStore'`. The state will be preserved across page reloads.

## Example 2: Persisting Form Data

```js
import React from 'react'
import useDbState from 'use-db-state';

const MyForm = () => {
    const fields = ['name', 'email', 'phone', 'address', 'subscribe'];

    const initialValues = {
        name: '',
        email: '',
        phone: '',
        address: '',
        subscribe: false,
    };

      const [formValues, setFormValues] = useDbState('formData', initialValues)

    const handleChange = (fieldName, value) => {
        setFormValues({
            ...formValues,
            [fieldName]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formValues);
        setFormValues(initialValues);
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input
                    type="text"
                    value={formValues.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />
            </label>

            <label>
                Email:
                <input
                    type="email"
                    value={formValues.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                />
            </label>

            <label>
                Phone:
                <input
                    type="tel"
                    value={formValues.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                />
            </label>

            <label>
                Address:
                <textarea
                    value={formValues.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                />
            </label>

            <label>
                Subscribe to newsletter:
                <input
                    type="checkbox"
                    checked={formValues.subscribe}
                    onChange={(e) => handleChange('subscribe', e.target.checked)}
                />
            </label>

            <button type="submit">Submit</button>
        </form>
    )
}

export default MyForm

```

## When to Use

Use `useDbState` when you need to persist state across page reloads. It’s particularly useful for things like user preferences or form data that you want to preserve if the user accidentally refreshes or navigates away from the page.

## Advantages of using IndexedDB

`useDbState` uses IndexedDB for data persistence, which has several advantages over localStorage:

1. **Larger Storage Capacity:** IndexedDB can store large amounts of data, ranging from a few megabytes to gigabytes. In contrast, localStorage usually has a storage limit of around 5-10MB per domain.
2. **Complex Data Queries:** IndexedDB supports advanced queries using indexes. localStorage, on the other hand, only supports key-value pairs and does not have built-in support for indexing or complex queries
3. **Asynchronous Operations:** IndexedDB operations are asynchronous, preventing blocking of the main thread.
4. **Structured Data:** IndexedDB can store complex structured data like objects and arrays. localStorage only supports strings.
5. **Durability:** Data in IndexedDB persists even when the browser is closed, or the system crashes.
6. **Scalability:** IndexedDB scales well with large datasets.

These advantages make `useDbState` a powerful tool for managing state in your React applications.


## Limitations

`useDbState` uses `IndexedDB` for storage, which is asynchronous and has certain limitations. It’s not suitable for storing very large amounts of data in a single state variable, and complex data structures may need to be serialized before storage.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request on the GitHub repository.

## License
This project is licensed under the MIT license