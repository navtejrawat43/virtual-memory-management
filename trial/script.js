const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    const boxSize = 64;
    const virtualWidth = 1024;
    const virtualHeight = 1024;
    const virtualCols = virtualWidth / boxSize;
    const virtualRows = virtualHeight / boxSize;

    const viewCols = canvas.width / boxSize;
    const viewRows = canvas.height / boxSize;

    let offsetX = 0; // in boxes
    let offsetY = 0;

    // Generate random color grid
    const colorGrid = [];
    for (let y = 0; y < virtualRows; y++) {
      colorGrid[y] = [];
      for (let x = 0; x < virtualCols; x++) {
        colorGrid[y][x] = getRandomColor();
      }
    }

    function getRandomColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r}, ${g}, ${b})`;
    }

    let visibleColorGrid =[];
    function drawVisibleGrid() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let pageNumber = 0; // Counter for labeling boxes
    
      for (let x = 0; x < viewRows; x++) {
        visibleColorGrid[x] = [];
        for (let y = 0; y < viewCols; y++) {
          const gridX = x + offsetX;
          const gridY = y + offsetY;
    
          if (gridY >= 0 && gridX >= 0 && gridY < virtualCols && gridX < virtualRows) {
            const color = colorGrid[gridX][gridY];
            visibleColorGrid[x][y] = color;
            pageNumber = gridX*viewRows + (gridY+1);
    
            // Draw box color
            ctx.fillStyle = color;
            ctx.fillRect(x * boxSize, y * boxSize, boxSize, boxSize);
    
            // Optional white border
            ctx.strokeStyle = "white";
            ctx.strokeRect(x * boxSize, y * boxSize, boxSize, boxSize);
    
            // Draw page number in the center
            ctx.fillStyle = "black"; // Or white depending on contrast
            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(pageNumber, x * boxSize + boxSize / 2, y * boxSize + boxSize / 2);
    
            
          }
        }
      }
    }
    

    function scrollView(dx, dy) {
      const newX = offsetX + dx;
      const newY = offsetY + dy;

      if (newX >= 0 && newX <= virtualCols - viewCols) {
        offsetX = newX;
      }
      if (newY >= 0 && newY <= virtualRows - viewRows) {
        offsetY = newY;
      }

      drawVisibleGrid();
      displayPageTable(visibleColorGrid);
    }

    // Initial draw
    drawVisibleGrid();

    function displayPageTable(visibleColorGrid) {
        const display = document.querySelector('.display');
        let pageTableHTML = '<table><th>index</th><th>page Number</th><tr>'
        for(let x=0;x<viewRows;x++) {
          for(let y=0;y<viewCols;y++) {
            const gridX = x + offsetX;
            const gridY = y + offsetY;
            let pageNumber = gridX*viewRows + (gridY+1);
            pageTableHTML += `<td>index</td><td>${pageNumber}</td></tr><tr>`;
          }
        }
        pageTableHTML += '</tr></table>';
        display.innerHTML=pageTableHTML;
    }

    displayPageTable(visibleColorGrid);