import React, { useState } from 'react';

const InputForm = ({ onRunSimulation }) => {
  const [frames, setFrames] = useState(3);
  const [references, setReferences] = useState('1,2,3,2,1,4,5');
  const [refLength, setRefLength] = useState(10);
  const [maxPage, setMaxPage] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    const refArray = references.split(',').map(Number).filter(n => !isNaN(n));
    onRunSimulation(frames, refArray);
  };

  const generateRandomReferences = () => {
    const newRefs = Array.from({ length: refLength }, () =>
      Math.floor(Math.random() * maxPage) + 1
    );
    setReferences(newRefs.join(','));
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Simulation Inputs</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Number of Frames:</label>
          <input
            type="number"
            value={frames}
            onChange={(e) => setFrames(Math.max(1, parseInt(e.target.value)))}
            min="1"
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Page References (comma-separated):</label>
          <input
            type="text"
            value={references}
            onChange={(e) => setReferences(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Random Reference Settings:</label>
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm mb-1">Length:</label>
              <input
                type="number"
                value={refLength}
                onChange={(e) => setRefLength(Math.max(1, parseInt(e.target.value)))}
                min="1"
                className="border p-2 w-24 rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Max Page Number:</label>
              <input
                type="number"
                value={maxPage}
                onChange={(e) => setMaxPage(Math.max(1, parseInt(e.target.value)))}
                min="1"
                className="border p-2 w-24 rounded"
              />
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Run Simulation
          </button>
          <button
            type="button"
            onClick={generateRandomReferences}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Generate Random
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;