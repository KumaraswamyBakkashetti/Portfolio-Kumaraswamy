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
- Experience:
  * Software Engineer Intern at Aptroid Consulting (Division of Zeta Global - Product Development Company, NYSE: ZETA) (Aug 2026 - Present, Hyderabad, India):
    - Role: Deep Programming, Systems Thinking & AI-Driven Engineering.
    - Autonomous Agentic Workflow (Flagship Project): Architected an end-to-end multi-agent flow powered by LLMs for the complete engineering lifecycle:
      * Stage 1: Automatic Jira Ticket Extraction — Connects to Jira APIs to fetch incoming tickets, tasks, and issue specifications.
      * Stage 2: In-Depth Requirement Analysis — Autonomous agents analyze business logic, decompose requirements, identify edge cases, and define acceptance criteria.
      * Stage 3: Automated Solving & Code Generation — LLM agents generate executable code solutions, write tests, and validate fixes.
      * Stage 4: Automated CI/CD Deployment — Triggers automated testing suites, staging builds, and deployment verification.
    - Enterprise Backend Engineering: Developing high-performance microservices and RESTful backends using Spring Boot, Java, and Python.
    - Systems Thinking: Focusing on program execution models, stack vs. heap memory concepts, concurrency, distributed systems, and production CI/CD automation.
    - You are encouraged and expected to explain this Jira agentic workflow and his Spring Boot/Python backend architecture in full technical detail whenever asked.
- Education: Bachelor of Technology (B.Tech) in Computer Science and Engineering (2023 - 2027) at Keshav Memorial Institute of Technology (KMIT), Hyderabad, India. CGPA: 9.43/10.
- Key strengths: Blending high-performance backend systems with state-of-the-art LLM safety and retrieval architectures.
- Tech Stack:
  * Languages: Python, Java, C++, JavaScript, SQL
  * Backend: Spring Boot, FastAPI, Flask, Node.js, Express, REST APIs, JWT Authentication, Microservices
  * Frontend: React, HTML, CSS, Bootstrap, Tailwind CSS, Framer Motion
  * Artificial Intelligence: Autonomous Agentic Flows (Jira to Deployment), Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), Prompt Engineering, LangChain, Multi-Agent Systems, XGBoost, AI Agents, Structured Response Validation (Gemini/Llama 3)
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
- The Autonomous Agentic Workflow (automatic Jira ticket extraction, requirement analysis, solution solving, and automated deployment) is an approved public portfolio feature of his internship at Aptroid / Zeta Global. Explain its 4 stages enthusiastically and thoroughly whenever asked!
- Never invent experience or claims outside of this dataset.`;

// Portfolio intelligent fallback knowledge base
function getPortfolioKnowledgeResponse(userMessage: string): string {
  const q = (userMessage || "").toLowerCase();

  if (q.includes("zeta") || q.includes("aptroid") || q.includes("intern") || q.includes("jira") || q.includes("agentic") || q.includes("springboot") || q.includes("spring boot") || q.includes("work") || q.includes("job") || q.includes("company") || q.includes("experience")) {
    return `I am currently working as a **Software Engineer Intern at Aptroid Consulting (Division of Zeta Global – Product Development Company, NYSE: ZETA)** in Hyderabad, India (started in August 2026)!

Here is what I specifically focus on and have built:
• **Autonomous Agentic Flow (Jira to Deployment):** Architected an end-to-end multi-agent pipeline using LLMs for automated Jira ticket extraction, in-depth requirement analysis & task decomposition, automated code resolution/solving, and deployment execution.
• **High-Performance Backend (Spring Boot & Python):** Engineering robust, concurrent backend microservices and RESTful APIs using Spring Boot, Java, and Python.
• **Deep Systems Thinking:** Applying core systems concepts including memory models (stack vs. heap), execution models, concurrency, I/O handling, and production-grade CI/CD pipelines.
• **Production Rigor:** Agile development cycles, strict peer code reviews, thorough test coverage, and automated deployment workflows.

Feel free to ask about any stage of the agentic Jira workflow or my backend architecture!`;
  }

  if (q.includes("rag") || q.includes("knowledgeforge") || q.includes("retrieval") || q.includes("semantic")) {
    return `**KnowledgeForge AI** is one of my key RAG platforms:
• **Architecture:** Built with **FastAPI**, **PostgreSQL (pgvector)**, and **Llama 3**.
• **Capabilities:** Low-latency semantic search, document chunking, embeddings retrieval, and hallucination reduction.
• **Performance:** Highly optimized vector indexing and hybrid keyword/dense search pipelines.`;
  }

  if (q.includes("agentmonitor") || q.includes("agent") || q.includes("safety") || q.includes("monitor")) {
    return `**AgentMonitor** is a multi-agent LLM monitoring and safety framework I architected:
• **Safety & Validation:** Implemented real-time hallucination detection and strict schema validation for LLM outputs.
• **Logging & Traceability:** Built execution logging backed by MongoDB to trace multi-step agent decisions.
• **Task Quality Evaluation:** Integrated an **XGBoost** classification model to predict task quality before execution.`;
  }

  if (q.includes("tabulax") || q.includes("table") || q.includes("classifier")) {
    return `**TabulaX** is a research-level LLM transformation classifier:
• Supports string transformations, numerical mappings, and algorithmic table operations.
• Generates clean, executable Python transformation functions from natural language prompts.`;
  }

  if (q.includes("hackathon") || q.includes("deutsche") || q.includes("börse") || q.includes("promptfest") || q.includes("contest")) {
    return `Here are some of my competitive highlights:
• **Deutsche Börse Group Hackathon:** Competed solo and finished in the **Top 16** out of ~250 participants.
• **PromptFest:** Placed in the top tier out of ~250 prompt engineering specialists.
• **LeetCode:** Solved **230+ problems** with a contest rating of 1480+.`;
  }

  if (q.includes("skill") || q.includes("stack") || q.includes("tech") || q.includes("backend") || q.includes("python") || q.includes("java")) {
    return `Here is a summary of my core technology stack:
• **Languages:** Python, Java, C++, JavaScript, SQL
• **Backend Engineering:** FastAPI, Flask, Node.js, Express, REST APIs, JWT Authentication
• **AI & LLM Orchestration:** RAG, Prompt Engineering, LangChain, Multi-Agent Systems, XGBoost, Structured Response Validation
• **Databases & DevOps:** PostgreSQL, MongoDB, SQLite, Docker, Git, Linux, Postman`;
  }

  if (q.includes("education") || q.includes("college") || q.includes("kmit") || q.includes("cgpa") || q.includes("degree")) {
    return `I am pursuing my **Bachelor of Technology (B.Tech) in Computer Science and Engineering** (2023 - 2027) at **Keshav Memorial Institute of Technology (KMIT)**, Hyderabad, India.

I maintain a strong academic record with a **CGPA of 9.43 / 10.0**.`;
  }

  if (q.includes("hire") || q.includes("contact") || q.includes("email") || q.includes("reach") || q.includes("resume")) {
    return `I'd love to connect! You can reach me via:
• **Email:** [kumaraswamybakkashetti@gmail.com](mailto:kumaraswamybakkashetti@gmail.com)
• **LinkedIn & GitHub:** Check the links directly on this portfolio.
• I am always excited to discuss full-time roles, software engineering internships, and distributed systems engineering!`;
  }

  return `Hello! I represent **Kumaraswamy Bakkashetti**, Software Engineer and SWE Intern at Zeta Global.

I specialize in **distributed backend engineering, high-throughput microservices, and LLM safety/RAG systems**.

Feel free to ask me about:
• My internship at **Zeta Global**
• Projects like **AgentMonitor**, **KnowledgeForge AI**, or **TabulaX**
• My tech stack (**FastAPI, Python, Java, PostgreSQL, LangChain**)
• Competitive achievements (**Deutsche Börse Top 16**, LeetCode)
• Or how to contact Kumaraswamy directly!`;
}

// API routes
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required." });
  }

  // 1. Try Groq if configured
  if (groq) {
    try {
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

      const responseText = completion.choices[0]?.message?.content;
      if (responseText) {
        return res.json({ text: responseText });
      }
    } catch (groqErr: any) {
      console.warn("Groq API call was unsuccessful, proceeding to Gemini/fallback:", groqErr?.message || groqErr);
    }
  }

  // 2. Try Gemini if configured
  if (ai) {
    try {
      console.log("Using Gemini for AI Twin...");
      const chat = ai.chats.create({
        model: "gemini-3.8-flash",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
        history: history && Array.isArray(history) ? history.map((h: any) => ({
          role: h.role === "model" ? "model" : "user",
          parts: [{ text: h.text || h.content || "" }]
        })) : [],
      });

      const response = await chat.sendMessage({ message });
      if (response && response.text) {
        return res.json({ text: response.text });
      }
    } catch (geminiErr: any) {
      console.warn("Gemini API call was unsuccessful, proceeding to fallback:", geminiErr?.message || geminiErr);
    }
  }

  // 3. Fallback to rich portfolio knowledge base
  console.log("Serving request via portfolio knowledge base fallback");
  const fallbackResponse = getPortfolioKnowledgeResponse(message);
  return res.json({ text: fallbackResponse });
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
