import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Statically serve assets & images from both public and src/assets
app.use('/src/assets', express.static(path.join(__dirname, 'src', 'assets')));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
const DESIGNS_FILE = path.join(DATA_DIR, 'designs.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DESIGNS_FILE)) {
  fs.writeFileSync(DESIGNS_FILE, JSON.stringify([], null, 2), 'utf8');
}

// Helper to read designs
function readDesigns(): any[] {
  try {
    const raw = fs.readFileSync(DESIGNS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading designs:', err);
    return [];
  }
}

// Helper to write designs
function writeDesigns(designs: any[]) {
  try {
    fs.writeFileSync(DESIGNS_FILE, JSON.stringify(designs, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving designs:', err);
  }
}

// Gemini AI Instance (Server-side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Routes

// 1. Get all published designs (or by owner)
app.get('/api/designs', (req: Request, res: Response) => {
  const { ownerId, type, category } = req.query;
  let designs = readDesigns();

  if (ownerId) {
    designs = designs.filter((d) => d.ownerId === ownerId);
  }
  if (type) {
    designs = designs.filter((d) => d.type === type);
  }
  if (category && category !== 'all') {
    designs = designs.filter((d) => d.category === category);
  }

  // Return sorted by most recent
  designs.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  res.json({ success: true, data: designs });
});

// 2. Get single design by ID or slug (public recipient access)
app.get('/api/designs/:id', (req: Request, res: Response) => {
  const targetId = req.params.id;
  const designs = readDesigns();

  // Find by exact id or match slug-id
  const index = designs.findIndex(
    (d) => d.id === targetId || d.slug === targetId || targetId.endsWith(`-${d.id}`)
  );

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Card or poster not found' });
  }

  // Increment views
  designs[index].views = (designs[index].views || 0) + 1;
  writeDesigns(designs);

  res.json({ success: true, data: designs[index] });
});

// 3. Create / Publish a design
app.post('/api/designs', (req: Request, res: Response) => {
  try {
    const newDesign = req.body;
    if (!newDesign || !newDesign.id) {
      return res.status(400).json({ success: false, message: 'Design ID and payload required' });
    }

    const designs = readDesigns();
    const existingIndex = designs.findIndex((d) => d.id === newDesign.id);

    const now = new Date().toISOString();
    const entry = {
      ...newDesign,
      updatedAt: now,
      createdAt: existingIndex >= 0 ? designs[existingIndex].createdAt : now,
      views: existingIndex >= 0 ? designs[existingIndex].views || 0 : 0,
      isPublished: true,
    };

    if (existingIndex >= 0) {
      designs[existingIndex] = entry;
    } else {
      designs.unshift(entry);
    }

    writeDesigns(designs);
    res.json({ success: true, data: entry });
  } catch (err: any) {
    console.error('Error saving design:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

// 4. Delete a design
app.delete('/api/designs/:id', (req: Request, res: Response) => {
  const targetId = req.params.id;
  let designs = readDesigns();
  const initialLength = designs.length;
  designs = designs.filter((d) => d.id !== targetId && d.slug !== targetId);

  if (designs.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Design not found' });
  }

  writeDesigns(designs);
  res.json({ success: true, message: 'Design removed successfully' });
});

// 5. Admin Analytics
app.get('/api/stats', (req: Request, res: Response) => {
  const designs = readDesigns();
  const totalCards = designs.filter((d) => d.type === 'card').length;
  const totalPosters = designs.filter((d) => d.type === 'poster').length;
  const totalViews = designs.reduce((acc, d) => acc + (d.views || 0), 0);
  const categories: Record<string, number> = {};

  designs.forEach((d) => {
    const cat = d.category || 'other';
    categories[cat] = (categories[cat] || 0) + 1;
  });

  res.json({
    success: true,
    data: {
      totalDesigns: designs.length,
      totalCards,
      totalPosters,
      totalViews,
      categories,
    },
  });
});

// 6. Gemini AI Message Generator for Wishes, Proposals, Poems & Greetings
app.post('/api/gemini/generate-wishes', async (req: Request, res: Response) => {
  try {
    const { occasion, recipient, tone, language, customNotes } = req.body;

    const prompt = `Write 3 unique, beautifully crafted message options for a greeting card or poster.
Occasion / Category: ${occasion || 'Celebration'}
Recipient: ${recipient || 'Someone special'}
Tone: ${tone || 'Heartfelt and warm'}
Language: ${language || 'English'}
Additional context / Personal touches: ${customNotes || 'None'}

Please format the response as a JSON array of 3 objects with properties:
- title: Short description of the option (e.g. "Option 1: Poetic & Romantic")
- message: The greeting card message itself (between 2 to 4 sentences, touching and expressive)
- shortQuote: A punchy 1-line headline or tagline suitable for the front of the card.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a master greeting card writer, romantic poet, and copywriter. Produce authentic, emotional, uplifting messages. Return only valid JSON without markdown wrapping.',
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '[]';
    let parsed = [];
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = [
        {
          title: 'Heartfelt Wish',
          message: text,
          shortQuote: 'Wishing you all the joy in the world!',
        },
      ];
    }

    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Gemini error:', error);
    // Provide sensible fallback options if AI API is unavailable
    res.json({
      success: true,
      data: [
        {
          title: 'Heartfelt Expression',
          message: 'May your day be filled with warm smiles, beautiful memories, and boundless happiness.',
          shortQuote: 'Celebrating You Today & Always',
        },
        {
          title: 'Poetic Note',
          message: 'Every moment with you turns into a cherished memory that shines like golden starlight.',
          shortQuote: 'Forever With You',
        },
        {
          title: 'Warm & Joyful',
          message: 'Wishing you the very best on this special day. May every tomorrow bring even brighter dreams!',
          shortQuote: 'Joy, Laughter & Love',
        },
      ],
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WishCraft full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
