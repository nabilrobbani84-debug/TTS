import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'puzzles.json');

// In-memory fallback for Vercel/Serverless where FS is read-only
let memoryPuzzles = [];
const IS_VERCEL = process.env.VERCEL === '1';

// Ensure data directory and file exist (Only works locally or on persistent FS)
async function ensureData() {
    if (IS_VERCEL) return;
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }


    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, '[]');
    }
}

// Get all puzzles
app.get('/api/puzzles', async (req, res) => {
    try {
        await ensureData();
        let puzzles = [];
        if (IS_VERCEL) {
             puzzles = memoryPuzzles;
        } else {
             const data = await fs.readFile(DATA_FILE, 'utf-8');
             puzzles = JSON.parse(data);
        }
        // Return only summary info for the list to save bandwidth
        const summary = puzzles.map(p => ({
            id: p.id,
            title: p.title,
            createdAt: p.createdAt,
            wordCount: p.words ? p.words.length : 0
        }));
        res.json(summary);
    } catch (error) {
        console.error('Error reading puzzles:', error);
        res.status(500).json({ error: 'Failed to fetch puzzles' });
    }
});

// Get single puzzle by ID
app.get('/api/puzzles/:id', async (req, res) => {
    try {
        await ensureData();
        let puzzles = [];
        if (IS_VERCEL) {
             puzzles = memoryPuzzles;
        } else {
             const data = await fs.readFile(DATA_FILE, 'utf-8');
             puzzles = JSON.parse(data);
        }
        const puzzle = puzzles.find(p => p.id === req.params.id);
        
        if (!puzzle) {
            return res.status(404).json({ error: 'Puzzle not found' });
        }
        res.json(puzzle);
    } catch (error) {
        console.error('Error fetching puzzle:', error);
        res.status(500).json({ error: 'Failed to fetch puzzle' });
    }
});

// Create new puzzle
app.post('/api/puzzles', async (req, res) => {
    try {
        await ensureData();
        const { title, words, grid, width, height } = req.body;
        
        if (!words || !grid) {
            return res.status(400).json({ error: 'Invalid puzzle data' });
        }

        const newPuzzle = {
            id: Date.now().toString(),
            title: title || `Untitled Puzzle ${new Date().toLocaleDateString()}`,
            words,
            grid, // The generated grid structure
            width,
            height,
            createdAt: new Date().toISOString()
        };

        if (IS_VERCEL) {
            memoryPuzzles.push(newPuzzle);
        } else {
            const data = await fs.readFile(DATA_FILE, 'utf-8');
            const puzzles = JSON.parse(data);
            puzzles.push(newPuzzle);
            await fs.writeFile(DATA_FILE, JSON.stringify(puzzles, null, 2));
        }
        
        res.status(201).json(newPuzzle);
    } catch (error) {
        console.error('Error saving puzzle:', error);
        res.status(500).json({ error: 'Failed to save puzzle' });
    }
});

// For Vercel, we export the app
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

export default app;
