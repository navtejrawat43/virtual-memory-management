import React from 'react';

const StatsTable = ({ results }) => {
  const algorithms = ['fifo', 'lru', 'optimal'];

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Simulation Results</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Algorithm</th>
            <th className="border p-2 text-left">Hits</th>
            <th className="border p-2 text-left">Faults</th>
            <th className="border p-2 text-left">Hit Ratio</th>
          </tr>
        </thead>
        <tbody>
          {algorithms.map((algo) => {
            const { hits = 0, faults = 0 } = results[algo] || {};
            const total = hits + faults;
            const hitRatio = total > 0 ? ((hits / total) * 100).toFixed(2) : 0;
            return (
              <tr key={algo} className="hover:bg-gray-100">
                <td className="border p-2 capitalize">{algo}</td>
                <td className="border p-2">{hits}</td>
                <td className="border p-2">{faults}</td>
                <td className="border p-2">{hitRatio}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StatsTable;