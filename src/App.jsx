import React, { useState } from 'react';
import InputForm from './Inputform';
import Simulator from './Simulator';
import StatsTable from './StatsTables';
import ChartVisualizer from './ChartVisualizer';
import Navigation from './Navigation';
import LookupTable from './LookupTable';
import MemoryVisualizer from './MemoryVisualizer';
import AlgorithmInfo from './AlgorithmInfo';
import GridVisualizer from './GridVisualizer';

const App = () => {
  const [frames, setFrames] = useState(3);
  const [references, setReferences] = useState([]);
  const [results, setResults] = useState({});
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [inputMode, setInputMode] = useState('inputForm'); // 'inputForm', 'navigation', 'grid'

  const handleRunSimulation = (newFrames, newReferences) => {
    setFrames(newFrames);
    setReferences(newReferences);
    setSelectedAlgorithm(null);
    setInputMode('inputForm');
  };

  const handlePageReference = (newReferences) => {
    setReferences([...newReferences]);
    setSelectedAlgorithm(null);
    setInputMode('navigation');
  };

  const handleGridReferences = (newReferences) => {
    setReferences([...newReferences]);
    setSelectedAlgorithm(null);
    setInputMode('grid');
  };

  const handleResults = (newResults) => {
    setResults(newResults);
  };

  const handleAlgorithmSelect = (algo) => {
    setSelectedAlgorithm(algo);
  };

  const handleClearFilter = () => {
    setSelectedAlgorithm(null);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Virtual Memory Simulator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Input Mode:</label>
            <select
              value={inputMode}
              onChange={(e) => setInputMode(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="inputForm">Manual Input</option>
              <option value="navigation">Navigation</option>
              <option value="grid">Grid Visualizer</option>
            </select>
          </div>
          {inputMode === 'inputForm' && <InputForm onRunSimulation={handleRunSimulation} />}
          {inputMode === 'navigation' && <Navigation onPageReference={handlePageReference} />}
          {inputMode === 'grid' && (
            <GridVisualizer
              onReferencesUpdate={handleGridReferences}
              selectedAlgorithm={selectedAlgorithm || 'fifo'}
            />
          )}
        </div>
        <div>
          <AlgorithmInfo />
          <StatsTable results={results} />
          <ChartVisualizer results={results} onAlgorithmSelect={handleAlgorithmSelect} />
          <LookupTable
            results={results}
            selectedAlgorithm={selectedAlgorithm}
            onClearFilter={handleClearFilter}
          />
          <MemoryVisualizer results={results} />
        </div>
      </div>
      <Simulator frames={frames} references={references} onResults={handleResults} />
    </div>
  );
};

export default App;