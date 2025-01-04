import React from 'react';
import DataProcessorComponent from './components/DataProcessor.tsx';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React + Rust WebAssembly Demo</h1>
      </header>
      <main>
        <DataProcessorComponent />
      </main>
    </div>
  );
}

export default App;