import { useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState('');

  const doReload = () => {
    setData('AAAAAAAA');
  }

  return (
    <div className="App">
      <button onClick={() => doReload()}>Refresh</button>
      <p>{data}</p>
    </div>
  );
}

export default App;
