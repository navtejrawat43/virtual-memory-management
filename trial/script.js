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

let visibleColorGrid = [];
let memory = [];  // Tracks pages in memory
let pageFaults = 0;
let algorithm = 'FIFO';  // Default Algorithm

function drawVisibleGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let pageNumber = 0;
  
  for (let x = 0; x < viewRows; x++) {
    visibleColorGrid[x] = [];
    for (let y = 0; y < viewCols; y++) {
      const gridX = x + offsetX;
      const gridY = y + offsetY;
      
      if (gridY >= 0 && gridX >= 0 && gridY < virtualCols && gridX < virtualRows) {
        const color = colorGrid[gridX][gridY];
        visibleColorGrid[x][y] = color;
        pageNumber = gridX * viewRows + (gridY + 1);

        ctx.fillStyle = color;
        ctx.fillRect(x * boxSize, y * boxSize, boxSize, boxSize);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x * boxSize, y * boxSize, boxSize, boxSize);

        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(pageNumber, x * boxSize + boxSize / 2, y * boxSize + boxSize / 2);
      }
    }
  }
}

function changeAlgorithm() {
  algorithm = document.getElementById('algorithms').value;
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
  pageFaults = 0;  // Reset page faults count on scroll
  handlePageReplacement();
  displayPageTable();  // Ensure page table updates on scroll
}

function handlePageReplacement() {
  const currentPages = [];
  
  for (let x = 0; x < viewRows; x++) {
    for (let y = 0; y < viewCols; y++) {
      const gridX = x + offsetX;
      const gridY = y + offsetY;
      const pageNumber = gridX * viewRows + (gridY + 1);

      currentPages.push(pageNumber);
      if (!memory.includes(pageNumber)) {
        pageFaults++;
        if (algorithm === 'FIFO') {
          if (memory.length >= 16) {
            memory.shift();
          }
          memory.push(pageNumber);
        } else if (algorithm === 'LRU') {
          if (memory.length >= 16) {
            memory.splice(memory.indexOf(pageNumber), 1);  // Remove if exists
            memory.push(pageNumber);
          } else {
            memory.push(pageNumber);
          }
        } else if (algorithm === 'Optimal') {
          if (memory.length < 16) {
            memory.push(pageNumber);
          } else {
            // Optimal algorithm would replace the least-needed page, theoretical.
          }
        }
      }
    }
  }

  // Always update the table for the current pages in memory
  displayPageTable();
}

function displayPageTable() {
  const display = document.getElementById('pageTable');
  let pageTableHTML = '<tr><th>Index</th><th>Page Number</th></tr>';
  
  memory.forEach((page, index) => {
    pageTableHTML += `<tr><td>${index}</td><td>${page}</td></tr>`;
  });

  pageTableHTML += `<tr><td colspan="2">Page Faults: ${pageFaults}</td></tr>`;
  display.innerHTML = pageTableHTML;
}

// Initial draw
drawVisibleGrid();
displayPageTable();
