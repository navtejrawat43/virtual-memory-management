import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartVisualizer = ({ results, onAlgorithmSelect }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Destroy existing chart if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create new chart
      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['FIFO', 'LRU', 'Optimal'],
          datasets: [
            {
              label: 'Hits',
              data: [
                results.fifo?.hits || 0,
                results.lru?.hits || 0,
                results.optimal?.hits || 0
              ],
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
            {
              label: 'Faults',
              data: [
                results.fifo?.faults || 0,
                results.lru?.faults || 0,
                results.optimal?.faults || 0
              ],
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Count'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Algorithm'
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            title: {
              display: true,
              text: 'Algorithm Performance Comparison'
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const algo = context.chart.data.labels[context.dataIndex].toLowerCase();
                  const datasetLabel = context.dataset.label;
                  const value = context.parsed.y;
                  const hits = results[algo]?.hits || 0;
                  const faults = results[algo]?.faults || 0;
                  const total = hits + faults;
                  const hitRatio = total > 0 ? ((hits / total) * 100).toFixed(2) : 0;
                  if (context.datasetIndex === 0) {
                    return [
                      `${datasetLabel}: ${value}`,
                      `Faults: ${faults}`,
                      `Hit Ratio: ${hitRatio}%`
                    ];
                  }
                  return `${datasetLabel}: ${value}`;
                }
              }
            }
          },
          onClick: (event, elements) => {
            if (elements.length > 0 && typeof onAlgorithmSelect === 'function') {
              const elementIndex = elements[0].index;
              const algo = chartInstanceRef.current.data.labels[elementIndex].toLowerCase();
              onAlgorithmSelect(algo);
            }
          }
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [results, onAlgorithmSelect]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Performance Comparison</h2>
      <canvas ref={chartRef} className="w-full h-64"></canvas>
    </div>
  );
};

export default ChartVisualizer;