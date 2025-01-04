// DataProcessor.tsx
import React, { useState, useEffect } from 'react';
import init, { DataProcessor } from '../rust-src/pkg';

interface ProcessedData {
  originalData: number[];
  processedData: number[];
  statistics: {
    sum: number;
    average: number;
    count: number;
  };
}

const DataProcessorComponent: React.FC = () => {
  const [wasmModule, setWasmModule] = useState<typeof import('../rust-src/pkg')>();
  const [inputData, setInputData] = useState<string>('');
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadWasm = async () => {
      try {
        const wasm = await init();
        setWasmModule(wasm);
      } catch (err) {
        setError('Failed to load WASM module');
        console.error(err);
      }
    };

    loadWasm();
  }, []);

  const handleProcessData = () => {
    if (!wasmModule) {
      setError('WASM module not loaded');
      return;
    }

    try {
      // Parse input string to numbers
      const numbers = inputData.split(',').map(n => parseInt(n.trim()));
      
      // Create new processor instance
      const processor = new DataProcessor();
      
      // Process data
      const processed = processor.process_data(numbers);
      
      // Get statistics
      const stats = JSON.parse(processor.get_statistics().toString());
      
      setProcessedData({
        originalData: numbers,
        processedData: processed,
        statistics: stats
      });
      
      setError('');
    } catch (err) {
      setError('Invalid input data. Please enter comma-separated numbers.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Data Processor</h2>
      
      <div className="mb-4">
        <label className="block mb-2">
          Enter numbers (comma-separated):
          <input
            type="text"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="1, 2, 3, 4, 5"
          />
        </label>
        <button
          onClick={handleProcessData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Process Data
        </button>
      </div>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {processedData && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold">Original Data:</h3>
            <p>{processedData.originalData.join(', ')}</p>
          </div>
          
          <div>
            <h3 className="font-bold">Processed Data:</h3>
            <p>{processedData.processedData.join(', ')}</p>
          </div>
          
          <div>
            <h3 className="font-bold">Statistics:</h3>
            <ul>
              <li>Sum: {processedData.statistics.sum}</li>
              <li>Average: {processedData.statistics.average.toFixed(2)}</li>
              <li>Count: {processedData.statistics.count}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataProcessorComponent;
