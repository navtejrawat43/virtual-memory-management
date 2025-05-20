import { useEffect, useState } from 'react';

// FIFO Algorithm
const fifo = (references, frames) => {
  let memory = [];
  let faults = 0;
  let hits = 0;
  const stats = [];

  for (let page of references) {
    if (typeof page !== 'number' || isNaN(page)) continue; // Skip invalid pages
    if (!memory.includes(page)) {
      if (memory.length >= frames) {
        memory.shift(); // Remove oldest page
      }
      memory.push(page);
      faults++;
      stats.push({ page, memory: [...memory], fault: true });
    } else {
      hits++;
      stats.push({ page, memory: [...memory], fault: false });
    }
  }
  return { faults, hits, stats };
};

// LRU Algorithm
const lru = (references, frames) => {
  let memory = [];
  let faults = 0;
  let hits = 0;
  const stats = [];

  for (let page of references) {
    if (typeof page !== 'number' || isNaN(page)) continue; // Skip invalid pages
    if (!memory.includes(page)) {
      if (memory.length >= frames) {
        memory.shift(); // Remove least recently used
      }
      memory.push(page);
      faults++;
      stats.push({ page, memory: [...memory], fault: true });
    } else {
      // Move page to end (most recently used)
      memory = memory.filter(p => p !== page).concat(page);
      hits++;
      stats.push({ page, memory: [...memory], fault: false });
    }
  }
  return { faults, hits, stats };
};

// Optimal Algorithm
const optimal = (references, frames) => {
  let memory = [];
  let faults = 0;
  let hits = 0;
  const stats = [];

  for (let i = 0; i < references.length; i++) {
    const page = references[i];
    if (typeof page !== 'number' || isNaN(page)) continue; // Skip invalid pages
    if (!memory.includes(page)) {
      if (memory.length >= frames) {
        // Find page that won't be used for longest
        let future = references.slice(i + 1);
        let toRemove = memory.reduce((a, b) => {
          let aIndex = future.indexOf(a);
          let bIndex = future.indexOf(b);
          aIndex = aIndex === -1 ? Infinity : aIndex;
          bIndex = bIndex === -1 ? Infinity : bIndex;
          return aIndex > bIndex ? a : b;
        });
        memory = memory.filter(p => p !== toRemove);
      }
      memory.push(page);
      faults++;
      stats.push({ page, memory: [...memory], fault: true });
    } else {
      hits++;
      stats.push({ page, memory: [...memory], fault: false });
    }
  }
  return { faults, hits, stats };
};

const Simulator = ({ frames, references, onResults }) => {
  const [results, setResults] = useState({});

  useEffect(() => {
    if (frames && references && references.length > 0 && typeof onResults === 'function') {
      const fifoResult = fifo(references, frames);
      const lruResult = lru(references, frames);
      const optimalResult = optimal(references, frames);
      const newResults = {
        fifo: fifoResult,
        lru: lruResult,
        optimal: optimalResult
      };
      setResults(newResults);
      onResults(newResults);
    } else {
      setResults({}); // Reset results if no valid input
      onResults({});
    }
  }, [frames, references, onResults]);

  return null; // No UI, only logic
};

export default Simulator;