import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Resolve Groq API key (check GROQ_API_KEY first, fallback to GEMINI_API_KEY if it contains a Groq key)
const groqApiKey = process.env.GROQ_API_KEY || (process.env.GEMINI_API_KEY?.startsWith("gsk_") ? process.env.GEMINI_API_KEY : undefined);
const geminiApiKey = process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.startsWith("gsk_") ? process.env.GEMINI_API_KEY : undefined;

let groq: Groq | null = null;
if (groqApiKey) {
  groq = new Groq({ apiKey: groqApiKey });
}

// Initialize Gemini as fallback
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// AI double system instructions
const SYSTEM_INSTRUCTION = `You are the digital replica (AI double) of Kumaraswamy Bakkashetti. Your role is to answer questions from hiring managers, recruiters, and technical peers visiting his portfolio.
Speak in the first person as Kumaraswamy's AI Twin ("I represent Kumaraswamy..."). Be professional, highly technical, articulate, and welcoming. 

Key Information about Kumaraswamy:
- Title: Software Engineer | AI & Backend Systems
- Education: Bachelor of Technology (B.Tech) in Computer Science and Engineering (2023 - 2027) at Keshav Memorial Institute of Technology (KMIT), Hyderabad, India. CGPA: 9.43/10.
- Key strengths: Blending high-performance backend systems with state-of-the-art LLM safety and retrieval architectures.
- Tech Stack:
  * Languages: Python, Java, C++, JavaScript, SQL
  * Backend: FastAPI, Flask, Node.js, Express, REST APIs, JWT Authentication
  * Frontend: React, HTML, CSS, Bootstrap, Tailwind CSS, Framer Motion
  * Artificial Intelligence: Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), Prompt Engineering, LangChain, Multi-Agent Systems, XGBoost, AI Agents, Structured Response Validation (Gemini/Llama 3)
  * Databases: MongoDB, PostgreSQL, SQLite
  * Tools: Docker, Git, Linux, Postman, Render, Vercel
- Selected Projects:
  1. AgentMonitor (Multi-Agent LLM Monitoring & Safety): Architected a modular monitoring/validation framework. Built hallucination detection, schema validation, MongoDB-backed execution logging, and integrated XGBoost for task quality predictions.
  2. TabulaX (Research-level LLM Transformation Classifier): LLM-powered table transformation classifier supporting string, numerical, algorithmic mappings. Generates executable Python transformation functions.
  3. KnowledgeForge AI (RAG Platform): Fast, robust platform for semantic search and embeddings retrieval using FastAPI, PostgreSQL, and Llama 3.
- Achievements:
  * Finalist in Deutsche Börse Group Hackathon: Solo participant, placed in the Top 16 out of ~250 contestants.
  * Finalist in PromptFest: Placed in the top tier out of ~250 prompt engineering specialists.
  * LeetCode: Solved 230+ problems, Contest Rating: 1480.
- Contact:
  * Email: kumaraswamybakkashetti@gmail.com
  * Location: Hyderabad, Telangana, India
  * GitHub, LinkedIn, and LeetCode are linked directly on this web page.

Guidelines:
- Keep answers professional, readable, structured, and informative.
- Use clean formatting (bullet points, bold key terms) to make responses scannable.
- If asked about something not in his resume, politely guide them to contact Kumaraswamy directly via email.
- Never invent experience or claims. Speak truthfully based strictly on this dataset.`;

// API routes
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    // 1. Try Groq first
    if (groq) {
      console.log("Using Groq for AI Twin...");
      const groqMessages = [
        { role: "system", content: SYSTEM_INSTRUCTION }
      ];
      if (history && Array.isArray(history)) {
        for (const h of history) {
          groqMessages.push({
            role: h.role === "model" ? "assistant" : "user",
            content: h.text || h.content || ""
          });
        }
      }
      groqMessages.push({ role: "user", content: message });

      const completion = await groq.chat.completions.create({
        messages: groqMessages as any,
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
      });

      const responseText = completion.choices[0]?.message?.content || "";
      return res.json({ text: responseText });
    }

    // 2. Fallback to Gemini
    if (ai) {
      console.log("Using Gemini for AI Twin...");
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
        history: history ? history.map((h: any) => ({
          role: h.role,
          parts: [{ text: h.text }]
        })) : [],
      });

      const response = await chat.sendMessage({ message });
      return res.json({ text: response.text });
    }

    // 3. No credentials
    return res.status(500).json({ error: "Neither Groq API Key nor Gemini API Key is configured." });
  } catch (err: any) {
    console.error("AI API Error:", err);
    res.status(500).json({ error: err.message || "An error occurred while calling the AI API." });
  }
});

// Vite Middleware/Static handling
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
