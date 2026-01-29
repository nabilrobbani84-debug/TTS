
export function generateCrossword(wordsInput) {
  // Sort words by length desc
  const words = wordsInput.filter(w => w.word.trim()).map(w => ({
    ...w,
    word: w.word.toUpperCase().replace(/[^A-Z]/g, '')
  }));
  
  words.sort((a, b) => b.word.length - a.word.length);

  if (words.length === 0) return null;

  let bestGrid = null;
  let bestPlacedCount = -1;

  // Try 20 times to get a good grid
  for (let attempt = 0; attempt < 20; attempt++) {
    const grid = new Map(); // "x,y" -> char
    const placedWords = [];
    
    // Place first word
    const firstWord = words[0];
    placeWord(grid, placedWords, firstWord, 0, 0, 'across');

    // Try to place others
    for (let i = 1; i < words.length; i++) {
      const currentWord = words[i];
      let placed = false;
      
      // Shuffle placed words to try connecting to random spots
      const targets = [...placedWords].sort(() => Math.random() - 0.5);

      for (const target of targets) {
        // Find intersection points
        const intersections = getIntersections(currentWord.word, target.word);
        
        for (const { charIndex, targetIndex } of intersections) {
           // Calculate potential position
           // If target is across, we strive for down at the intersection
           const newDir = target.direction === 'across' ? 'down' : 'across';
           
           let startX = target.x;
           let startY = target.y;

           if (target.direction === 'across') {
              startX += targetIndex;
           } else {
              startY += targetIndex;
           }

           // Now back up to find the start of currentWord
           if (newDir === 'across') {
             startX -= charIndex;
           } else {
             startY -= charIndex;
           }

           if (canPlace(grid, currentWord.word, startX, startY, newDir)) {
             placeWord(grid, placedWords, currentWord, startX, startY, newDir);
             placed = true;
             break;
           }
        }
        if (placed) break;
      }
    }

    if (placedWords.length > bestPlacedCount) {
      bestPlacedCount = placedWords.length;
      bestGrid = { grid, placedWords };
    }
  }

  // Normalize grid
  if (!bestGrid) return null;

  return normalizeGrid(bestGrid);
}

function getIntersections(word1, word2) {
  const matches = [];
  for (let i = 0; i < word1.length; i++) {
    for (let j = 0; j < word2.length; j++) {
      if (word1[i] === word2[j]) {
        matches.push({ charIndex: i, targetIndex: j });
      }
    }
  }
  return matches;
}

function canPlace(grid, word, startX, startY, direction) {
  for (let i = 0; i < word.length; i++) {
    const x = direction === 'across' ? startX + i : startX;
    const y = direction === 'across' ? startY : startY + i;
    const cell = grid.get(`${x},${y}`);

    if (cell && cell !== word[i]) return false;

    // Check adjacencies to ensure we don't form invalid words
    // If cell is empty (newly placed), check perpendicular neighbors
    if (!cell) {
       const p1 = direction === 'across' ? [x, y-1] : [x-1, y];
       const p2 = direction === 'across' ? [x, y+1] : [x+1, y];
       
       // If a perpendicular neighbor exists, check if it makes sense? 
       // Strictly: normal crossword rules say no adjacent words unless they form valid words.
       // Simplify: Don't allow placing adjacent to existing blocks unless it's the intersection point.
       
       if (grid.has(`${p1[0]},${p1[1]}`) || grid.has(`${p2[0]},${p2[1]}`)) {
         return false;
       }
    }

    // Check ends (start-1 and end+1) to make sure we don't extend a word improperly
    if (i === 0) {
       const prevX = direction === 'across' ? x - 1 : x;
       const prevY = direction === 'across' ? y : y - 1;
       if (grid.has(`${prevX},${prevY}`)) return false;
    }
    if (i === word.length - 1) {
       const nextX = direction === 'across' ? x + 1 : x;
       const nextY = direction === 'across' ? y : y + 1;
       if (grid.has(`${nextX},${nextY}`)) return false;
    }
  }
  return true;
}

function placeWord(grid, placedWords, wordObj, x, y, direction) {
  for (let i = 0; i < wordObj.word.length; i++) {
     const cx = direction === 'across' ? x + i : x;
     const cy = direction === 'across' ? y : y + i;
     grid.set(`${cx},${cy}`, wordObj.word[i]);
  }
  placedWords.push({ ...wordObj, x, y, direction });
}

function normalizeGrid({ grid, placedWords }) {
  if (placedWords.length === 0) return null;
  
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  
  placedWords.forEach(w => {
     minX = Math.min(minX, w.x);
     minY = Math.min(minY, w.y);
     if (w.direction === 'across') {
       maxX = Math.max(maxX, w.x + w.word.length - 1);
       maxY = Math.max(maxY, w.y);
     } else {
       maxX = Math.max(maxX, w.x);
       maxY = Math.max(maxY, w.y + w.word.length - 1);
     }
  });

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  
  // Shift words
  const shiftedWords = placedWords.map(w => ({
    ...w,
    x: w.x - minX,
    y: w.y - minY
  }));

  // Rebuild grid with proper coordinates and numbering
  const finalGrid = {}; // "x,y" : { char, clueNum? }
  
  // Assign clue numbers
  shiftedWords.sort((a,b) => (a.y - b.y) || (a.x - b.x));
  
  let currentNum = 1;
  // We need to group by start position to share numbers if a specific cell starts two words
  // Map "x,y" -> number
  const startPosMap = new Map();
  
  shiftedWords.forEach(w => {
    const key = `${w.x},${w.y}`;
    if (!startPosMap.has(key)) {
       startPosMap.set(key, currentNum++);
    }
    w.number = startPosMap.get(key);
  });

  // Fill cells
  shiftedWords.forEach(w => {
    for (let i = 0; i < w.word.length; i++) {
       const cx = w.direction === 'across' ? w.x + i : w.x;
       const cy = w.direction === 'across' ? w.y : w.y + i;
       const key = `${cx},${cy}`;
       if (!finalGrid[key]) {
         finalGrid[key] = { char: w.word[i], x: cx, y: cy };
       }
       if (i === 0) {
         finalGrid[key].number = w.number;
       }
    }
  });

  return { width, height, words: shiftedWords, cells: finalGrid };
}

// ✅ API Configuration
export const API_URL = "/api"; 

export const savePuzzle = async (data) => {
  const response = await fetch(`${API_URL}/save.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getPuzzle = async (id) => {
  const response = await fetch(`${API_URL}/get.php?id=${id}`);
  return response.json();
};

export const getPuzzleList = async () => {
    const response = await fetch(`${API_URL}/list.php`);
    return response.json();
};
