import React, { useState, useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Github, 
  ExternalLink, 
  FileText, 
  Database, 
  Terminal, 
  Check, 
  Copy, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Cpu, 
  Globe, 
  LineChart, 
  Code,
  Quote,
  Table,
  HelpCircle
} from "lucide-react";

interface AiMessageRendererProps {
  text: string;
  isLatest: boolean;
  onAnimationComplete?: () => void;
}

// Global project data for project cards
interface ProjectData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  techStack: string[];
  github?: string;
  demo?: string;
  paper?: string;
}

const PROJECTS_REFS: { [key: string]: ProjectData } = {
  agentmonitor: {
    id: "agentmonitor",
    name: "AgentMonitor",
    tagline: "Multi-Agent LLM Monitoring & Safety Framework",
    description: "An end-to-end monitoring and validation engine that captures model streams, verifies structured responses against rigid JSON schemas, runs real-time semantic drift/hallucination checks, and trains an XGBoost classifier to flag failing execution pathways before completion.",
    techStack: ["Python", "FastAPI", "React", "MongoDB", "Gemini", "Llama 3", "XGBoost", "Render"],
    github: "https://github.com/KumaraswamyBakkashetti/3-1project",
    demo: "https://agentmonitor-lvi7.onrender.com",
  },
  careerpilot: {
    id: "careerpilot",
    name: "CareerPilot",
    tagline: "AI-Powered Career & Resume Optimizer",
    description: "An intelligent platform that parses resumes, analyzes career gaps, and programmatically optimizes professional profiles for targeted technical roles using semantic matching and tailored roadmap generation.",
    techStack: ["Python", "React", "LLMs", "FastAPI", "PostgreSQL", "RAG"],
    github: "https://github.com/KumaraswamyBakkashetti",
  },
  knowledgeforge: {
    id: "knowledgeforge",
    name: "KnowledgeForge AI",
    tagline: "Retrieval-Augmented Knowledge & Semantic Platform",
    description: "A fast, production-ready Retrieval-Augmented Generation (RAG) platform. It processes raw document streams, computes high-density embeddings, stores them with vector indexing in PostgreSQL, and implements modular route handlers for low-latency context retrieval.",
    techStack: ["FastAPI", "PostgreSQL", "Llama 3", "RAG", "Vercel"],
    demo: "https://ai-wiki-alpha.vercel.app",
  },
  tabulax: {
    id: "tabulax",
    name: "TabulaX",
    tagline: "Research Implementation of Multi-Class Table Transformations",
    description: "A research-focused table mapper that uses LLMs as high-level transformation classifiers. It maps dirty columns to target definitions and programmatically outputs complete, interpretable, and reproducible Pandas Python functions to execute the joins and clean anomalies.",
    techStack: ["Python", "LLMs", "Pandas", "NumPy"],
    github: "https://github.com/KumaraswamyBakkashetti/tabulax-project",
    paper: "https://arxiv.org/pdf/2411.17110",
  }
};

// Map keywords to bullet icons
const getIconForBullet = (title: string, desc: string): ReactNode => {
  const t = (title + " " + desc).toLowerCase();
  if (t.includes("security") || t.includes("safe") || t.includes("validation") || t.includes("auth") || t.includes("jwt") || t.includes("hallucination")) {
    return <ShieldCheck className="text-emerald-400" size={16} />;
  }
  if (t.includes("database") || t.includes("mongodb") || t.includes("postgresql") || t.includes("logging") || t.includes("storage")) {
    return <Database className="text-blue-400" size={16} />;
  }
  if (t.includes("performance") || t.includes("speed") || t.includes("latency") || t.includes("fast") || t.includes("stress")) {
    return <Zap className="text-amber-400" size={16} />;
  }
  if (t.includes("api") || t.includes("endpoint") || t.includes("backend") || t.includes("fastapi") || t.includes("middleware")) {
    return <Terminal className="text-cyan-400" size={16} />;
  }
  if (t.includes("research") || t.includes("paper") || t.includes("table") || t.includes("model") || t.includes("llm")) {
    return <Cpu className="text-purple-400" size={16} />;
  }
  return <Sparkles className="text-orange-400" size={16} />;
};

// Tech chips visual settings
const TECH_CHIPS: { [key: string]: { label: string; bg: string; border: string; text: string } } = {
  python: { label: "Python", bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
  react: { label: "React", bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400" },
  docker: { label: "Docker", bg: "bg-sky-500/10", border: "border-sky-500/20", text: "text-sky-400" },
  mongodb: { label: "MongoDB", bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
  fastapi: { label: "FastAPI", bg: "bg-teal-500/10", border: "border-teal-500/20", text: "text-teal-400" },
  "node.js": { label: "Node.js", bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400" },
  nodejs: { label: "Node.js", bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400" },
  llms: { label: "LLMs", bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" },
  llm: { label: "LLMs", bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" },
  rag: { label: "RAG", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20", text: "text-fuchsia-400" },
  langchain: { label: "LangChain", bg: "bg-lime-500/10", border: "border-lime-500/20", text: "text-lime-400" },
};

export default function AiMessageRenderer({ text, isLatest, onAnimationComplete }: AiMessageRendererProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textIndexRef = useRef(0);
  const textRef = useRef(text);

  // Sync reference
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  // Simulate premium typewriter streaming
  useEffect(() => {
    if (!isLatest) {
      setDisplayedText(text);
      setIsTyping(false);
      if (onAnimationComplete) onAnimationComplete();
      return;
    }

    setIsTyping(true);
    setDisplayedText("");
    textIndexRef.current = 0;

    const words = text.split(" ");
    let currentWordIndex = 0;
    
    // Smooth fast word-by-word progressive streaming
    const interval = setInterval(() => {
      if (currentWordIndex >= words.length) {
        clearInterval(interval);
        setDisplayedText(textRef.current);
        setIsTyping(false);
        if (onAnimationComplete) onAnimationComplete();
        return;
      }

      currentWordIndex += Math.max(1, Math.floor(words.length / 90)); // Adapt speed based on text length
      const currentText = words.slice(0, currentWordIndex).join(" ");
      setDisplayedText(currentText);
    }, 16);

    return () => clearInterval(interval);
  }, [text, isLatest]);

  // High fidelity Markdown and layout parsing
  const renderFormattedMessage = () => {
    const rawLines = displayedText.split("\n");
    const parsedElements: React.ReactNode[] = [];
    
    let currentBlockType: "none" | "code" | "list" | "table" | "diagram" = "none";
    let codeLanguage = "";
    let codeLines: string[] = [];
    let listItems: string[] = [];
    let tableLines: string[] = [];
    let diagramLines: string[] = [];

    const flushCodeBlock = (key: string) => {
      const codeText = codeLines.join("\n");
      parsedElements.push(
        <CodeBlockEditor 
          key={key} 
          code={codeText} 
          language={codeLanguage} 
        />
      );
      codeLines = [];
      currentBlockType = "none";
    };

    const flushList = (key: string) => {
      parsedElements.push(
        <motion.div 
          key={key}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 gap-3.5 my-4"
        >
          {listItems.map((item, idx) => (
            <BulletCard key={idx} text={item} />
          ))}
        </motion.div>
      );
      listItems = [];
      currentBlockType = "none";
    };

    const flushTable = (key: string) => {
      parsedElements.push(
        <PremiumTable key={key} lines={tableLines} />
      );
      tableLines = [];
      currentBlockType = "none";
    };

    const flushDiagram = (key: string) => {
      parsedElements.push(
        <ArchitectureDiagram key={key} lines={diagramLines} />
      );
      diagramLines = [];
      currentBlockType = "none";
    };

    // Main parsing loop
    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];
      const trimmed = line.trim();
      const elementKey = `el-${i}`;

      // 1. CODE BLOCKS
      if (trimmed.startsWith("```")) {
        if (currentBlockType === "code") {
          flushCodeBlock(elementKey);
        } else {
          // Close other blocks
          if (currentBlockType === "list") flushList(elementKey + "-list-pre");
          if (currentBlockType === "table") flushTable(elementKey + "-table-pre");
          if (currentBlockType === "diagram") flushDiagram(elementKey + "-diagram-pre");

          currentBlockType = "code";
          codeLanguage = trimmed.slice(3).toLowerCase() || "javascript";
        }
        continue;
      }

      if (currentBlockType === "code") {
        codeLines.push(line);
        continue;
      }

      // 2. DETECT SYSTEM/ARCHITECTURE DIAGRAMS
      const isDiagramLine = 
        trimmed.includes("->") || 
        trimmed.includes("-->") || 
        trimmed.includes("↓") || 
        trimmed.includes("|") && trimmed.includes("-") && trimmed.includes("+") ||
        (trimmed.startsWith("+") && trimmed.endsWith("+")) ||
        (trimmed.startsWith("|") && trimmed.endsWith("|") && !trimmed.includes("||") && trimmed.length > 25);

      if (isDiagramLine && currentBlockType === "none" && trimmed.length > 3) {
        currentBlockType = "diagram";
      }

      if (currentBlockType === "diagram") {
        if (isDiagramLine || trimmed === "") {
          diagramLines.push(line);
          continue;
        } else {
          flushDiagram(elementKey + "-diag");
        }
      }

      // 3. TABLES
      const isTableLine = line.startsWith("|") && line.endsWith("|");
      if (isTableLine) {
        if (currentBlockType !== "table") {
          if (currentBlockType === "list") flushList(elementKey + "-list-pre");
          if (currentBlockType === "diagram") flushDiagram(elementKey + "-diagram-pre");
          currentBlockType = "table";
        }
        tableLines.push(line);
        continue;
      } else if (currentBlockType === "table") {
        flushTable(elementKey + "-table");
      }

      // 4. LISTS
      const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ") || /^\d+\.\s/.test(trimmed);
      if (isBullet) {
        if (currentBlockType !== "list") {
          if (currentBlockType === "diagram") flushDiagram(elementKey + "-diagram-pre");
          currentBlockType = "list";
        }
        // strip bullet sign
        const cleaned = trimmed.replace(/^[-*•]\s+/, "").replace(/^\d+\.\s+/, "");
        listItems.push(cleaned);
        continue;
      } else if (currentBlockType === "list") {
        flushList(elementKey + "-list");
      }

      // 5. HEADINGS (Overview, Technical Architecture, Key Features, Performance, Engineering Insights)
      const isHeading = trimmed.startsWith("#") || 
        trimmed.startsWith("🚀") || 
        trimmed.startsWith("⚙️") || 
        trimmed.startsWith("⚙") || 
        trimmed.startsWith("💡") || 
        trimmed.startsWith("📊") || 
        trimmed.startsWith("🧠");

      if (isHeading) {
        // Render headings inside elegant premium visual cards
        let title = trimmed.replace(/^#+\s*/, "");
        let icon: React.ReactNode = <Sparkles size={18} className="text-orange-400" />;

        if (title.includes("Overview") || title.includes("🚀")) {
          icon = <Globe size={18} className="text-cyan-400" />;
          title = title.replace("🚀", "").trim();
        } else if (title.includes("Architecture") || title.includes("⚙")) {
          icon = <Cpu size={18} className="text-purple-400" />;
          title = title.replace("⚙️", "").replace("⚙", "").trim();
        } else if (title.includes("Features") || title.includes("💡")) {
          icon = <Zap size={18} className="text-amber-400" />;
          title = title.replace("💡", "").trim();
        } else if (title.includes("Performance") || title.includes("📊")) {
          icon = <LineChart size={18} className="text-emerald-400" />;
          title = title.replace("📊", "").trim();
        } else if (title.includes("Insights") || title.includes("🧠")) {
          icon = <Layers size={18} className="text-blue-400" />;
          title = title.replace("🧠", "").trim();
        }

        parsedElements.push(
          <motion.div
            key={elementKey}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 mt-6 mb-3 pt-4 border-t border-neutral-150 dark:border-white/5 first:border-0 first:pt-0"
          >
            <div className="p-1.5 bg-neutral-100 dark:bg-white/5 rounded-lg border border-neutral-200 dark:border-white/5">
              {icon}
            </div>
            <h3 className="font-sans font-bold text-base text-neutral-900 dark:text-white tracking-tight">
              {title}
            </h3>
          </motion.div>
        );
        continue;
      }

      // 6. QUOTES
      if (trimmed.startsWith(">")) {
        const quoteText = trimmed.slice(1).trim();
        parsedElements.push(
          <div key={elementKey} className="my-4 pl-4 border-l-2 border-orange-500 bg-orange-500/5 py-2.5 pr-3 rounded-r-xl flex gap-2">
            <Quote size={16} className="text-orange-400 shrink-0 mt-0.5" />
            <p className="font-sans text-xs sm:text-sm italic text-neutral-700 dark:text-neutral-300">
              <InlineTextFormatter text={quoteText} />
            </p>
          </div>
        );
        continue;
      }

      // 7. MATH BLOCKS
      if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
        const mathText = trimmed.slice(2, -2).trim();
        parsedElements.push(
          <div key={elementKey} className="my-4 p-4 bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5 rounded-2xl flex justify-center items-center font-serif text-lg text-neutral-800 dark:text-neutral-200 italic shadow-inner">
            {mathText}
          </div>
        );
        continue;
      }

      // 8. REGULAR PARAGRAPHS OR BLANK LINES
      if (trimmed === "") {
        continue;
      }

      parsedElements.push(
        <p key={elementKey} className="font-sans text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 my-2.5">
          <InlineTextFormatter text={line} />
        </p>
      );
    }

    // Flush any open blocks
    const finalKey = "el-final";
    if (currentBlockType === "code") flushCodeBlock(finalKey);
    if (currentBlockType === "list") flushList(finalKey);
    if (currentBlockType === "table") flushTable(finalKey);
    if (currentBlockType === "diagram") flushDiagram(finalKey);

    return parsedElements;
  };

  return (
    <div className="relative space-y-1">
      {renderFormattedMessage()}
      {isTyping && (
        <span className="inline-flex items-center ml-1">
          <span className="inline-block w-1.5 h-3.5 bg-orange-500 animate-[ping_1s_infinite] rounded" />
        </span>
      )}
    </div>
  );
}

/* ==========================================================================
   SUB-COMPONENT: INLINE TEXT FORMATTER (Chips, Links, Project Badges)
   ========================================================================== */
interface InlineTextFormatterProps {
  text: string;
}

function InlineTextFormatter({ text }: InlineTextFormatterProps) {
  const parts: React.ReactNode[] = [];
  let index = 0;

  // Regex to detect:
  // 1. Markdown Links [text](url)
  // 2. Bold **text**
  // 3. Italics *text* or _text_
  // 4. Inline code `code`
  // 5. Tech References: Python, React, Docker, MongoDB, FastAPI, Node.js/Nodejs, LLMs/LLM, RAG, LangChain
  // 6. Project References: AgentMonitor, CareerPilot, KnowledgeForge AI, KnowledgeForge, TabulaX
  // 7. Generic URL detection (not in markdown links)
  
  const tokenRegex = /(\[.*?\]\(.*?\))|(\*\*.*?\*\*)|(\*.*?\*)|(`.*?`)|(Python|React|Docker|MongoDB|FastAPI|Node\.js|Nodejs|LLMs|LLM|RAG|LangChain)|(AgentMonitor|CareerPilot|KnowledgeForge\sAI|KnowledgeForge|TabulaX)|(https?:\/\/[^\s]+)/gi;

  const matches = [...text.matchAll(tokenRegex)];

  if (matches.length === 0) {
    return <>{text}</>;
  }

  matches.forEach((match, mIdx) => {
    // Add text preceding the match
    if (match.index! > index) {
      parts.push(text.slice(index, match.index));
    }

    const value = match[0];

    // 1. Markdown Link: [Label](url)
    if (value.startsWith("[") && value.includes("](")) {
      const label = value.slice(1, value.indexOf("]("));
      const url = value.slice(value.indexOf("](") + 2, -1);
      parts.push(
        <a 
          key={`link-${mIdx}`}
          href={url} 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 dark:text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-lg text-xs font-semibold font-sans transition-all duration-200 shadow-sm"
        >
          {label}
          <ExternalLink size={10} />
        </a>
      );
    }
    // 2. Bold: **text**
    else if (value.startsWith("**") && value.endsWith("**")) {
      const inner = value.slice(2, -2);
      parts.push(<strong key={`bold-${mIdx}`} className="font-sans font-bold text-neutral-900 dark:text-white">{inner}</strong>);
    }
    // 3. Italics: *text*
    else if (value.startsWith("*") && value.endsWith("*")) {
      const inner = value.slice(1, -1);
      parts.push(<em key={`italic-${mIdx}`} className="font-sans italic text-neutral-800 dark:text-neutral-200">{inner}</em>);
    }
    // 4. Inline code: `code`
    else if (value.startsWith("`") && value.endsWith("`")) {
      const inner = value.slice(1, -1);
      parts.push(
        <code key={`code-${mIdx}`} className="font-mono text-xs bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/5 text-orange-500 dark:text-orange-400 px-1.5 py-0.5 rounded-md">
          {inner}
        </code>
      );
    }
    // 5. Tech References
    else if (TECH_CHIPS[value.toLowerCase()]) {
      const meta = TECH_CHIPS[value.toLowerCase()];
      parts.push(
        <span 
          key={`tech-${mIdx}`} 
          className={`inline-flex items-center font-mono text-[10px] font-semibold ${meta.bg} ${meta.border} border ${meta.text} px-2 py-0.5 rounded-md mx-0.5 shadow-sm transition-all hover:scale-105 duration-200`}
        >
          {meta.label}
        </span>
      );
    }
    // 6. Project References (AgentMonitor, CareerPilot, KnowledgeForge AI, TabulaX)
    else {
      let key = value.toLowerCase();
      if (key === "knowledgeforge ai") key = "knowledgeforge";
      
      const proj = PROJECTS_REFS[key];
      if (proj) {
        parts.push(
          <ProjectBadgeAndCard key={`proj-${mIdx}`} project={proj} />
        );
      } else if (value.startsWith("http")) {
        // Generic raw link
        parts.push(
          <a 
            key={`raw-link-${mIdx}`}
            href={value} 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 dark:text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm"
          >
            Visit Link
            <ExternalLink size={10} />
          </a>
        );
      } else {
        parts.push(value);
      }
    }

    index = match.index! + value.length;
  });

  // Remaining tail text
  if (index < text.length) {
    parts.push(text.slice(index));
  }

  return <>{parts}</>;
}

/* ==========================================================================
   SUB-COMPONENT: PROJECT REFERENCE BADGE + INLINE EXPANDABLE CARD
   ========================================================================== */
interface ProjectBadgeAndCardProps {
  key?: string | number;
  project: ProjectData;
}

function ProjectBadgeAndCard({ project }: ProjectBadgeAndCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <span className="inline-block my-1 align-middle">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-1.5 bg-orange-500/10 hover:bg-orange-500/20 active:scale-95 border border-orange-500/20 text-orange-500 dark:text-orange-400 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
      >
        <Layers size={11} className="animate-pulse" />
        {project.name}
        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="block w-full max-w-md bg-neutral-50 dark:bg-[#0b0b0b]/80 backdrop-blur-md border border-neutral-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-lg p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-sans font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-1.5">
                  {project.name}
                  <Sparkles size={11} className="text-orange-400" />
                </h4>
                <p className="font-sans text-[11px] text-orange-500 font-semibold leading-relaxed">
                  {project.tagline}
                </p>
              </div>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-[10px] text-neutral-400 hover:text-neutral-900 dark:text-white/40 dark:hover:text-white border border-neutral-200 dark:border-white/10 px-2 py-0.5 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>

            <p className="font-sans text-xs text-neutral-600 dark:text-white/60 mb-3.5 leading-relaxed">
              {project.description}
            </p>

            <div className="mb-4">
              <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 dark:text-white/30 block mb-1">Tech Stack</span>
              <div className="flex flex-wrap gap-1">
                {project.techStack.map((tech) => (
                  <span 
                    key={tech} 
                    className="font-mono text-[9px] bg-neutral-200/50 dark:bg-white/5 border border-neutral-300 dark:border-white/5 text-neutral-700 dark:text-white/75 px-1.5 py-0.5 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center gap-2 border-t border-neutral-200 dark:border-white/5 pt-3">
              {project.github && (
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="font-sans font-semibold text-[11px] bg-neutral-900 hover:bg-neutral-850 dark:bg-white/10 dark:hover:bg-white/15 text-white dark:text-white/90 border border-neutral-800 dark:border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
                >
                  <Github size={11} />
                  GitHub Code
                </a>
              )}
              {project.demo && (
                <a 
                  href={project.demo} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="font-sans font-semibold text-[11px] bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors shadow-sm shadow-orange-500/10"
                >
                  <ExternalLink size={11} />
                  Live Demo
                </a>
              )}
              {project.paper && (
                <a 
                  href={project.paper} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="font-sans font-semibold text-[11px] bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors shadow-sm shadow-blue-500/10"
                >
                  <FileText size={11} />
                  Research Paper
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ==========================================================================
   SUB-COMPONENT: CODE BLOCK EDITOR (Custom styled editor + highlight)
   ========================================================================== */
interface CodeBlockEditorProps {
  key?: string | number;
  code: string;
  language: string;
}

function CodeBlockEditor({ code, language }: CodeBlockEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy code", e);
    }
  };

  // Basic robust regex-based Syntax Highlighting
  const highlightCode = (rawCode: string, lang: string) => {
    const escaped = rawCode
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const l = lang.toLowerCase();

    if (l === "javascript" || l === "typescript" || l === "js" || l === "ts") {
      return escaped
        .replace(/\b(const|let|var|function|return|import|export|from|default|class|extends|new|async|await|try|catch|finally|if|else|for|while|do|switch|case|break|continue)\b/g, '<span class="text-pink-400 font-semibold">$1</span>')
        .replace(/\b(string|number|boolean|any|void|unknown|never|interface|type|null|undefined)\b/g, '<span class="text-cyan-400">$1</span>')
        .replace(/(["'`])(.*?)\1/g, '<span class="text-emerald-400">"$2"</span>')
        .replace(/(\/\/.*)/g, '<span class="text-neutral-500 italic">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-amber-400">$1</span>');
    }

    if (l === "python" || l === "py") {
      return escaped
        .replace(/\b(def|class|return|import|from|as|if|elif|else|for|while|try|except|finally|with|lambda|in|is|not|and|or|pass|break|continue|global|nonlocal|assert)\b/g, '<span class="text-pink-400 font-semibold">$1</span>')
        .replace(/(["'`])(.*?)\1/g, '<span class="text-emerald-400">"$2"</span>')
        .replace(/(#.*)/g, '<span class="text-neutral-500 italic">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-amber-400">$1</span>')
        .replace(/\b(self|cls)\b/g, '<span class="text-orange-400 italic">$1</span>');
    }

    if (l === "json") {
      return escaped
        .replace(/(["'])(.*?)\1(\s*:)/g, '<span class="text-purple-400 font-semibold">"$2"</span>$3')
        .replace(/(["'])(.*?)\1/g, '<span class="text-emerald-400">"$2"</span>')
        .replace(/\b(true|false|null)\b/g, '<span class="text-cyan-400 font-semibold">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-amber-400">$1</span>');
    }

    if (l === "sql") {
      return escaped
        .replace(/\b(SELECT|FROM|WHERE|INSERT|INTO|UPDATE|SET|DELETE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|BY|ORDER|HAVING|LIMIT|AND|OR|NOT|IN|AS|CREATE|TABLE|ALTER|DROP|INDEX|PRIMARY|KEY|FOREIGN|REFERENCES|VALUES|COUNT|SUM|AVG|MIN|MAX|WITH|RECURSIVE|UNION|ALL|EXISTS)\b/gi, '<span class="text-pink-400 font-bold">$1</span>')
        .replace(/(["'`])(.*?)\1/g, '<span class="text-emerald-400">"$2"</span>')
        .replace(/(--.*)/g, '<span class="text-neutral-500 italic">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-amber-400">$1</span>');
    }

    if (l === "html" || l === "xml") {
      return escaped
        .replace(/(&lt;\/?[a-zA-Z0-9:-]+)/g, '<span class="text-pink-400">$1</span>')
        .replace(/(\/?&gt;)/g, '<span class="text-pink-400">$1</span>')
        .replace(/([a-zA-Z:-]+)(=)/g, '<span class="text-cyan-400">$1</span>$2')
        .replace(/(["'])(.*?)\1/g, '<span class="text-emerald-400">"$2"</span>');
    }

    return escaped;
  };

  return (
    <div className="my-5 rounded-2xl bg-[#0b0b0b] border border-neutral-800 shadow-[0_4px_30px_rgba(0,0,0,0.4)] overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#121212] border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 font-mono text-[10px] text-neutral-400 font-medium tracking-wider uppercase">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-neutral-400 hover:text-white hover:bg-white/5 border border-neutral-800 rounded-xl transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={11} className="text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={11} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Editor Code Body */}
      <div className="p-4 overflow-x-auto max-h-[380px] scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        <pre className="font-mono text-xs text-[#E5E7EB] leading-relaxed">
          <code 
            dangerouslySetInnerHTML={{ 
              __html: highlightCode(code, language) 
            }} 
          />
        </pre>
      </div>
    </div>
  );
}

/* ==========================================================================
   SUB-COMPONENT: BULLET FEATURE CARD
   ========================================================================== */
interface BulletCardProps {
  key?: string | number;
  text: string;
}

function BulletCard({ text }: BulletCardProps) {
  // Check if bullet has form "**Title**: Description"
  const isHeaderFormat = text.startsWith("**") && text.includes(":**");
  let title = "";
  let description = text;

  if (isHeaderFormat) {
    const colonIdx = text.indexOf(":**");
    title = text.slice(2, colonIdx).trim();
    description = text.slice(colonIdx + 3).trim();
  } else if (text.includes(":") && text.indexOf(":") < 25 && !text.startsWith("http")) {
    const colonIdx = text.indexOf(":");
    title = text.slice(0, colonIdx).trim();
    description = text.slice(colonIdx + 1).trim();
  }

  const icon = getIconForBullet(title, description);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -3, scale: 1.01 }}
      className="flex gap-3 bg-neutral-50/75 dark:bg-white/[0.02] hover:bg-neutral-100/80 dark:hover:bg-white/[0.04] border border-neutral-200 dark:border-white/5 rounded-2xl p-3.5 transition-all duration-300 shadow-sm cursor-default group"
    >
      <div className="p-2 h-fit bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl shrink-0 transition-transform group-hover:scale-110 duration-300">
        {icon}
      </div>
      <div>
        {title ? (
          <>
            <h4 className="font-sans font-bold text-sm text-neutral-900 dark:text-white leading-relaxed group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
              <InlineTextFormatter text={title} />
            </h4>
            <p className="font-sans text-xs text-neutral-600 dark:text-white/60 leading-relaxed mt-0.5">
              <InlineTextFormatter text={description} />
            </p>
          </>
        ) : (
          <p className="font-sans text-xs sm:text-sm text-neutral-700 dark:text-white/80 leading-relaxed">
            <InlineTextFormatter text={description} />
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   SUB-COMPONENT: SYSTEM ARCHITECTURE DIAGRAMS (ASCII/Graph visualizers)
   ========================================================================== */
interface ArchitectureDiagramProps {
  key?: string | number;
  lines: string[];
}

function ArchitectureDiagram({ lines }: ArchitectureDiagramProps) {
  return (
    <div className="my-5 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-inner overflow-hidden relative group">
      {/* Mesh grid background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none" />
      
      {/* Top Banner */}
      <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2 relative z-10">
        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-cyan-400">
          <Terminal size={10} className="animate-pulse" />
          <span>Technical Architecture Schema</span>
        </div>
        <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20 uppercase font-mono font-bold">
          ASCII-V
        </span>
      </div>

      <div className="overflow-x-auto relative z-10 text-center py-2">
        <pre className="font-mono text-[11px] sm:text-xs text-cyan-400 dark:text-cyan-300 leading-normal inline-block text-left whitespace-pre">
          {lines.join("\n")}
        </pre>
      </div>
    </div>
  );
}

/* ==========================================================================
   SUB-COMPONENT: PREMIUM TABLES
   ========================================================================== */
interface PremiumTableProps {
  key?: string | number;
  lines: string[];
}

function PremiumTable({ lines }: PremiumTableProps) {
  // Parse markdown tables: e.g. | Header 1 | Header 2 |
  const parsedRows = lines
    .map(line => line.split("|").map(col => col.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1))
    .filter(row => row.length > 0);

  if (parsedRows.length === 0) return null;

  const headers = parsedRows[0];
  // Filter out table divider separator row like | --- | --- |
  const rows = parsedRows.slice(1).filter(row => !row.every(cell => cell.startsWith("-")));

  return (
    <div className="my-5 overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-[#080808] shadow-sm">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm">
          <thead>
            <tr className="bg-neutral-50 dark:bg-white/[0.03] border-b border-neutral-200 dark:border-white/5">
              {headers.map((h, idx) => (
                <th key={idx} className="p-3 font-semibold text-neutral-800 dark:text-white select-none whitespace-nowrap">
                  <InlineTextFormatter text={h} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr 
                key={rIdx} 
                className="border-b border-neutral-100 dark:border-white/[0.03] last:border-b-0 hover:bg-neutral-50/50 dark:hover:bg-white/[0.01] transition-colors"
              >
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-3 text-neutral-600 dark:text-white/70">
                    <InlineTextFormatter text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
