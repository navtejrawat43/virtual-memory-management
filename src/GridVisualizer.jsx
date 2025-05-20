import React, { useEffect, useRef, useState, useMemo } from 'react';

const GridVisualizer = ({ onReferencesUpdate, selectedAlgorithm }) => {
  const canvasRef = useRef(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [pageFaultPages, setPageFaultPages] = useState(new Set());

  const boxSize = 64;
  const virtualWidth = 1024; // 16 cols
  const virtualHeight = 1024; // 16 rows
  const virtualCols = virtualWidth / boxSize; // 16
  const virtualRows = virtualHeight / boxSize; // 16
  const viewCols = 4; // 256 / 64
  const viewRows = 4; // 256 / 64

  // Fixed 24 colors (same as vanilla JS version)
  const fixedColors = [
    'rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(255, 255, 0)',
    'rgb(255, 0, 255)', 'rgb(0, 255, 255)', 'rgb(128, 0, 0)', 'rgb(0, 128, 0)',
    'rgb(0, 0, 128)', 'rgb(128, 128, 0)', 'rgb(128, 0, 128)', 'rgb(0, 128, 128)',
    'rgb(192, 192, 192)', 'rgb(255, 165, 0)', 'rgb(255, 192, 203)', 'rgb(0, 0, 0)',
    'rgb(128, 128, 128)', 'rgb(255, 215, 0)', 'rgb(173, 216, 230)', 'rgb(75, 0, 130)',
    'rgb(240, 230, 140)', 'rgb(34, 139, 34)', 'rgb(210, 105, 30)', 'rgb(245, 222, 179)'
  ];

  const colorToPageNumber = useMemo(() => {
    const map = {};
    fixedColors.forEach((color, index) => {
      map[color] = index;
    });
    return map;
  }, []);

  // Initialize the 16x16 virtual color grid only once
  const [colorGrid, setColorGrid] = useState(() => {
    return Array.from({ length: virtualRows }, () =>
      Array.from({ length: virtualCols }, () => {
        const idx = Math.floor(Math.random() * fixedColors.length);
        return fixedColors[idx];
      })
    );
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawVisibleGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentPages = [];
      for (let row = 0; row < viewRows; row++) {
        for (let col = 0; col < viewCols; col++) {
          const gridRow = row + offsetY;
          const gridCol = col + offsetX;

          if (gridRow >= 0 && gridCol >= 0 && gridRow < virtualRows && gridCol < virtualCols) {
            const color = colorGrid[gridRow][gridCol];
            const pageNumber = colorToPageNumber[color];
            currentPages.push(pageNumber);

            // Draw colored box
            ctx.fillStyle = color;
            ctx.fillRect(col * boxSize, row * boxSize, boxSize, boxSize);

            // White border
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.strokeRect(col * boxSize, row * boxSize, boxSize, boxSize);

            // Page number text
            ctx.fillStyle = 'black';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(pageNumber, col * boxSize + boxSize / 2, row * boxSize + boxSize / 2);

            // Highlight page faults with red border
            if (pageFaultPages.has(pageNumber)) {
              ctx.strokeStyle = 'red';
              ctx.lineWidth = 4;
              ctx.strokeRect(col * boxSize + 1.5, row * boxSize + 1.5, boxSize - 3, boxSize - 3);
              ctx.lineWidth = 1;
            }
          }
        }
      }

      // Update references for simulation
      onReferencesUpdate(currentPages);
    };

    drawVisibleGrid();
  }, [offsetX, offsetY, pageFaultPages, colorGrid, onReferencesUpdate, colorToPageNumber]);

  const scrollView = (dx, dy) => {
    const newX = offsetX + dx;
    const newY = offsetY + dy;

    if (newX >= 0 && newX <= virtualCols - viewCols) {
      setOffsetX(newX);
    }
    if (newY >= 0 && newY <= virtualRows - viewRows) {
      setOffsetY(newY);
    }
  };

  // Optional: Reset the grid with new random colors
  const resetGrid = () => {
    setColorGrid(
      Array.from({ length: virtualRows }, () =>
        Array.from({ length: virtualCols }, () => {
          const idx = Math.floor(Math.random() * fixedColors.length);
          return fixedColors[idx];
        })
      )
    );
    setPageFaultPages(new Set());
    setOffsetX(0);
    setOffsetY(0);
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow mt-4">
      <h2 className="text-xl font-semibold mb-4">Grid Visualizer</h2>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={resetGrid}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Reset Grid
        </button>
      </div>
      <canvas ref={canvasRef} width="256" height="256" className="border w-full"></canvas>
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={() => scrollView(0, -1)}
          disabled={offsetY === 0}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          ⬆️
        </button>
        <button
          onClick={() => scrollView(-1, 0)}
          disabled={offsetX === 0}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          ⬅️
        </button>
        <button
          onClick={() => scrollView(1, 0)}
          disabled={offsetX === virtualCols - viewCols}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          ➡️
        </button>
        <button
          onClick={() => scrollView(0, 1)}
          disabled={offsetY === virtualRows - viewRows}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          ⬇️
        </button>
      </div>
    </div>
  );
};

export default GridVisualizer;