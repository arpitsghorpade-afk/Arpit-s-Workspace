import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { buildSocraticPrompt } from './src/utils/education.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini Client instance using @google/genai
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (geminiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check and platform diagnostics
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    platform: 'AetherLearn AI',
    version: '1.0.0',
    geminiConfigured: Boolean(geminiApiKey),
    activeModel: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// Socratic AI Personal Tutor Endpoint
app.post('/api/ai/tutor', async (req: Request, res: Response) => {
  try {
    const {
      message,
      grade = 10,
      subject = 'General STEM & AI',
      language = 'en',
      mode = 'socratic_hints',
      history = [],
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    if (!aiClient) {
      // Graceful fallback with helpful developer guidance
      return res.status(503).json({
        error: 'Gemini API Key is not configured. Please check GEMINI_API_KEY in the Secrets panel.',
        fallbackReply: `[Offline Mode Demo]: As your Grade ${grade} AI Tutor for ${subject}, let us break this down! You asked: "${message}". What is the first principle or equation you recall regarding this topic?`,
      });
    }

    const systemInstruction = buildSocraticPrompt({
      grade: Number(grade),
      subject,
      language: language as 'en' | 'hi' | 'mr',
      mode: mode as any,
    });

    // Format contents with conversation context
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      // Include up to last 6 messages for context
      const recent = history.slice(-6);
      for (const h of recent) {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || 'I am ready to help guide you through this concept! What do you observe first?';

    return res.json({
      reply: text,
      modelUsed: 'gemini-3.8-flash',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Gemini AI Tutor Error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate tutor response.',
    });
  }
});

// AI Practice Question Generator Endpoint
app.post('/api/ai/generate-questions', async (req: Request, res: Response) => {
  try {
    const { grade = 10, subject = 'Mathematics', topic = 'Quadratic Equations', count = 3 } = req.body;

    if (!aiClient) {
      return res.status(503).json({
        error: 'Gemini API Key is not configured in environment.',
      });
    }

    const systemInstruction = `You are an educational assessment architect for K-12. Generate ${count} multiple-choice questions for Grade ${grade} on the topic "${topic}" in ${subject}. 
Return valid JSON only adhering to this structure:
{
  "questions": [
    {
      "id": "q1",
      "question": "Clear problem statement",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Detailed pedagogical explanation of why this is correct",
      "hint": "Gentle Socratic hint without revealing the answer"
    }
  ]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate ${count} practice questions for Grade ${grade} students on ${topic} (${subject}).`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{"questions":[]}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Generate Questions Error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate questions.',
    });
  }
});

// AI Project & Skill Passport Review Endpoint
app.post('/api/ai/review-project', async (req: Request, res: Response) => {
  try {
    const { projectTitle, summary, deliverables, grade = 10, subject = 'AI & Robotics' } = req.body;

    if (!aiClient) {
      return res.status(503).json({
        error: 'Gemini API Key is not configured.',
      });
    }

    const prompt = `Review this student capstone project submission for Grade ${grade} in ${subject}:
Project Title: ${projectTitle}
Summary: ${summary}
Deliverables: ${JSON.stringify(deliverables)}

Provide a structured evaluation in JSON:
{
  "strengths": ["string", "string"],
  "improvements": ["string"],
  "recommendedSkillBadge": "string",
  "readinessScore": 95,
  "industryRelevanceFeedback": "string"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const review = JSON.parse(response.text || '{}');
    return res.json(review);
  } catch (error: any) {
    console.error('Project Review Error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to review project.',
    });
  }
});

// Start Express Server with Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AetherLearn AI Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
