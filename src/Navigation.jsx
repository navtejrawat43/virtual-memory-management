import React, { useState } from 'react';

// Simulated large dataset (1000 pages)
const generateDataset = () => {
  return Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    content: `Page ${i + 1} Content`
  }));
};

const Navigation = ({ onPageReference }) => {
  const dataset = generateDataset();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [references, setReferences] = useState([]);

  const handleNext = () => {
    if (currentIndex < dataset.length - 1) {
      const newIndex = currentIndex + 1;
      const newReference = dataset[newIndex].id;
      setCurrentIndex(newIndex);
      setReferences((prevReferences) => {
        const updatedReferences = [...prevReferences, newReference];
        onPageReference(updatedReferences); // Notify parent with updated references
        return updatedReferences;
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newReference = dataset[newIndex].id;
      setCurrentIndex(newIndex);
      setReferences((prevReferences) => {
        const updatedReferences = [...prevReferences, newReference];
        onPageReference(updatedReferences); // Notify parent with updated references
        return updatedReferences;
      });
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Page Navigation</h2>
      <div className="mb-4">
        <p className="text-lg">Current Page: {dataset[currentIndex].id}</p>
        <p className="text-gray-600">{dataset[currentIndex].content}</p>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === dataset.length - 1}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
      <div className="mt-4">
        <p className="text-sm">Page References: [{references.join(', ')}]</p>
      </div>
    </div>
  );
};

export default Navigation;