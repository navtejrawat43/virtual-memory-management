import React from 'react';

const LookupTable = ({ results }) => {
  const algorithms = ['fifo', 'lru', 'optimal'];

  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <h2 className="text-xl font-semibold mb-4">Lookup Table</h2>
      {algorithms.map((algo) => (
        <div key={algo} className="mb-6">
          <h3 className="text-lg font-medium capitalize mb-2">{algo} Algorithm</h3>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left">Step</th>
                <th className="border p-2 text-left">Page Reference</th>
                <th className="border p-2 text-left">Memory State</th>
                <th className="border p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {results[algo]?.stats?.length > 0 ? (
                results[algo].stats.map((step, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{step.page}</td>
                    <td className="border p-2">[ {step.memory.join(', ')} ]</td>
                    <td className="border p-2">{step.fault ? 'Fault' : 'Hit'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border p-2 text-center text-gray-500">
                    No simulation data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default LookupTable;