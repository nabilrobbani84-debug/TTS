
# Crossword Legends - TTS Application

A fullstack Crossword (Teka-Teki Silang) web application built with React (Frontend) and PHP (Backend).

## Features

### 1. Admin / Creator Panel
- **Interactive Form**: Add words and clues dynamically.
- **Smart Generation**: Uses a greedy backtracking algorithm to automatically arrange words into a valid crossword grid, prioritizing intersections.
- **Preview**: Real-time preview of the generated grid.
- **Persistence**: Save puzzles to the backend (JSON storage).

### 2. Player Experience
- **Interactive Grid**: Navigate with keyboard (Arrows) or mouse.
- **Clue List**: Interactive Across and Down clue lists that highlight the active word.
- **Visual Feedback**: Active cell, correct/incorrect indicators (after checking), and completion animations.
- **Progress Tracking**: Validates answers and announces success.

### 3. Sharing
- **Unique URLs**: Each puzzle gets a unique ID sharable via URL.
- **Puzzle Directory**: Home page lists all available puzzles with metadata.

## Tech Stack

- **Frontend**: React, Vite, Tailwind-like CSS (Vanilla CSS variables), React Router.
- **Backend**: Native PHP (no framework required), JSON file storage.
- **Styling**: Glassmorphism aesthetic, responsive design, dark mode by default.

## Installation & Running

### Prerequisites
- Node.js (for frontend)
- PHP (for backend)

### Steps

1. **Start the Backend Server**
   Open a terminal in the root directory:
   ```bash
   php -S localhost:8000 -t backend
   ```

2. **Start the Frontend Application**
   Open a new terminal in the `frontend` directory:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Open in Browser**
   Visit `http://localhost:5173`

## Algorithm Explanation

The puzzle generator (`src/utils/crossword.js`) uses a **probabilistic greedy approach**:

1. **Sorting**: Words are sorted by length (longest first) to establish a "backbone".
2. **Placement**: 
   - The first word is placed in the center.
   - Subsequent words are tested against existing placed words.
   - The algorithm searches for common letters (intersections) between the unplaced word and placed words.
3. **Validation**:
   - Checks if the word fits the grid without overwriting non-matching characters.
   - Ensures no invalid adjacent placements (preserving crossword rules where cells shouldn't touch unless forming a valid crossing).
4. **Optimization**:
   - The generator runs multiple iterations (e.g., 20 attempts) with randomized ordering of subsequent words to find the most compact and interconnected layout.
   - The "best" result (most words placed) is selected.

## Project Structure

```
tts-app/
├── backend/          # PHP API
│   ├── save.php      # Save puzzle endpoint
│   ├── list.php      # List puzzles endpoint
│   ├── get.php       # Get puzzle endpoint
│   └── headers.php   # CORS Setup
├── data/             # JSON Data storage
│   └── puzzles.json
├── frontend/         # React App
│   ├── src/
│   │   ├── components/  # Reusable UI (Grid)
│   │   ├── pages/       # Route Views (Home, Creator, Player)
│   │   ├── utils/       # Logic (Crossword Generator)
│   │   └── index.css    # Global Styles
```

## Credits
Built for Technical Test - Memento Game Studios.
