import React, { useState } from 'react';

const AlgorithmInfo = () => {
  const [activeTab, setActiveTab] = useState('fifo');

  const tabs = ['fifo', 'lru', 'optimal'];

  const drawMemoryState = (frames, step, pages, fault) => {
    const frameWidth = 50;
    const frameHeight = 50;
    const spacing = 10;
    const startX = 10;
    const startY = 10;

    return (
      <svg width={frames * (frameWidth + spacing) + 20} height="80">
        {frames.map((_, i) => {
          const x = startX + i * (frameWidth + spacing);
          return (
            <g key={i}>
              <rect
                x={x}
                y={startY}
                width={frameWidth}
                height={frameHeight}
                fill={fault && i === frames.length - 1 ? 'rgba(255, 99, 132, 0.5)' : 'rgba(75, 192, 192, 0.5)'}
                stroke="black"
              />
              {pages[i] && (
                <g>
                  <circle
                    cx={x + frameWidth / 2}
                    cy={startY + frameHeight / 2}
                    r="20"
                    fill="white"
                    stroke="black"
                  />
                  <text
                    x={x + frameWidth / 2}
                    y={startY + frameHeight / 2}
                    textAnchor="middle"
                    dy=".3em"
                    fontSize="16"
                  >
                    {pages[i]}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'fifo':
        return (
          <div>
            <h3 className="text-lg font-medium mb-2">First-In-First-Out (FIFO)</h3>
            <p className="mb-4">
              FIFO replaces the oldest page in memory when a new page needs to be loaded and memory is full. It maintains a queue of pages, removing the first page added when necessary.
            </p>
            <h4 className="text-md font-medium mb-2">Pseudocode:</h4>
            <pre className="bg-gray-100 p-2 rounded mb-4">
              memory = []
              for each page in references:
                  if page not in memory:
                      if memory is full:
                          remove oldest page (first in memory)
                      add page to memory (end of queue)
                      record fault
                  else:
                      record hit
            </pre>
            <h4 className="text-md font-medium mb-2">Example (References: 1,2,3,2,1, Frames: 3):</h4>
            <div className="space-y-2">
              <div>Step 1: Page 1 → {drawMemoryState([0, 1, 2], 1, [1, null, null], true)}</div>
              <div>Step 2: Page 2 → {drawMemoryState([0, 1, 2], 2, [1, 2, null], true)}</div>
              <div>Step 3: Page 3 → {drawMemoryState([0, 1, 2], 3, [1, 2, 3], true)}</div>
              <div>Step 4: Page 2 → {drawMemoryState([0, 1, 2], 4, [1, 2, 3], false)}</div>
            </div>
          </div>
        );
      case 'lru':
        return (
          <div>
            <h3 className="text-lg font-medium mb-2">Least Recently Used (LRU)</h3>
            <p className="mb-4">
              LRU replaces the page that has not been used for the longest time. When a page is accessed, it is moved to the end of the list (most recently used).
            </p>
            <h4 className="text-md font-medium mb-2">Pseudocode:</h4>
            <pre className="bg-gray-100 p-2 rounded mb-4">
              memory = []
              for each page in references:
                  if page not in memory:
                      if memory is full:
                          remove least recently used page (first in memory)
                      add page to memory (end of list)
                      record fault
                  else:
                      move page to end of memory (most recently used)
                      record hit
            </pre>
            <h4 className="text-md font-medium mb-2">Example (References: 1,2,3,2,1, Frames: 3):</h4>
            <div className="space-y-2">
              <div>Step 1: Page 1 → {drawMemoryState([0, 1, 2], 1, [1, null, null], true)}</div>
              <div>Step 2: Page 2 → {drawMemoryState([0, 1, 2], 2, [1, 2, null], true)}</div>
              <div>Step 3: Page 3 → {drawMemoryState([0, 1, 2], 3, [1, 2, 3], true)}</div>
              <div>Step 4: Page 2 → {drawMemoryState([0, 1, 2], 4, [1, 3, 2], false)}</div>
            </div>
          </div>
        );
      case 'optimal':
        return (
          <div>
            <h3 className="text-lg font-medium mb-2">Optimal</h3>
            <p className="mb-4">
              Optimal replaces the page that will not be used for the longest time in the future. It requires knowledge of future references, making it an idealized algorithm for comparison.
            </p>
            <h4 className="text-md font-medium mb-2">Pseudocode:</h4>
            <pre className="bg-gray-100 p-2 rounded mb-4">
              memory = []
              for each page at index i in references:
                  if page not in memory:
                      if memory is full:
                          future = references after index i
                          remove page in memory not used for longest (farthest in future)
                      add page to memory
                      record fault
                  else:
                      record hit
            </pre>
            <h4 className="text-md font-medium mb-2">Example (References: 1,2,3,2,1, Frames: 3):</h4>
            <div className="space-y-2">
              <div>Step 1: Page 1 → {drawMemoryState([0, 1, 2], 1, [1, null, null], true)}</div>
              <div>Step 2: Page 2 → {drawMemoryState([0, 1, 2], 2, [1, 2, null], true)}</div>
              <div>Step 3: Page 3 → {drawMemoryState([0, 1, 2], 3, [1, 2, 3], true)}</div>
              <div>Step 4: Page 2 → {drawMemoryState([0, 1, 2], 4, [1, 2, 3], false)}</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Algorithm Explanations</h2>
      <div className="flex space-x-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            } hover:bg-blue-400 hover:text-white`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      {renderTabContent()}
    </div>
  );
};

export default AlgorithmInfo;