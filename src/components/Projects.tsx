import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Github, ExternalLink, ShieldCheck, FileText, Database, Layers, CheckCircle2, ChevronRight, AlertTriangle, Lightbulb } from "lucide-react";
import { Project } from "../types";

export default function Projects() {
  const [activeTabs, setActiveTabs] = useState<{ [projectId: string]: "overview" | "problem" | "architecture" | "contributions" }>({
    agentmonitor: "overview",
    tabulax: "overview",
    knowledgeforge: "overview",
  });

  const projects: Project[] = [
    {
      id: "agentmonitor",
      name: "AgentMonitor",
      tagline: "Multi-Agent LLM Monitoring, Validation & Safety Framework",
      techStack: ["Python", "FastAPI", "React", "MongoDB", "JWT", "Gemini", "Llama 3", "XGBoost", "Render"],
      bullets: [
        "Architected a modular monitoring framework for multi-agent LLM systems.",
        "Designed structured response validation across Gemini and Llama 3.",
        "Implemented hallucination detection and JSON schema validation.",
        "Built JWT authentication with MongoDB-backed execution logging.",
        "Integrated XGBoost for downstream task quality prediction.",
      ],
      problem: "Multi-agent LLM architectures often fail due to unexpected loop traps, structured JSON model failures, hallucinations, and untracked API execution costs.",
      solution: "An end-to-end monitoring & validation engine that captures model streams, verifies structured responses against rigid JSON schemas, runs real-time semantic drift/hallucination checks, and trains an XGBoost classifier to flag failing execution pathways before completion.",
      architecture: [
        "React frontend for execution visualization",
        "FastAPI middleware catching LLM calls",
        "Structured logging saved directly to MongoDB",
        "Downstream XGBoost quality predictor running asynchronously",
      ],
      impact: "Eliminated JSON formatting crashes by 100% and lowered multi-agent failure rates by introducing predictive validation pipelines.",
      links: {
        github: "https://github.com/KumaraswamyBakkashetti/3-1project",
        demo: "https://agentmonitor-lvi7.onrender.com",
      },
    },
    {
      id: "tabulax",
      name: "TabulaX",
      tagline: "Research Implementation of Multi-Class Table Transformations",
      techStack: ["Python", "LLMs", "Pandas", "NumPy"],
      bullets: [
        "Implemented an LLM-powered framework for heterogeneous table transformations.",
        "Designed a transformation classifier supporting String, Numerical, Algorithmic, and General mappings.",
        "Generated interpretable Python transformation functions.",
        "Supported semantic integration, heterogeneous joins, anomaly detection, and missing-value imputation.",
      ],
      problem: "Tabular data is historically hard to integrate due to column type mismatches, legacy formatting, and inconsistent null values, requiring thousands of lines of fragile manual glue-code.",
      solution: "A research-focused table mapper that uses LLMs as high-level transformation classifiers. It maps dirty columns to target definitions and programmatically outputs complete, interpretable, and reproducible Pandas Python functions to execute the joins and clean the anomalies.",
      architecture: [
        "Table Transformation Classifier (String/Numerical/Algorithmic/General)",
        "Interpretable Python transformation function generator",
        "Pandas execution sandbox engine",
        "Anomalous cell drift detector",
      ],
      impact: "Created a modular, automated approach to raw data cleaning, converting minutes of manual data-wrangling into milliseconds of programmatically verifiable code.",
      links: {
        github: "https://github.com/KumaraswamyBakkashetti/tabulax-project",
        paper: "https://arxiv.org/pdf/2411.17110",
      },
    },
    {
      id: "knowledgeforge",
      name: "KnowledgeForge AI",
      tagline: "Retrieval-Augmented Knowledge & Semantic Platform",
      techStack: ["FastAPI", "PostgreSQL", "Llama 3", "Render", "Vercel"],
      bullets: [
        "Built a Retrieval-Augmented Generation (RAG) platform.",
        "Implemented embeddings and semantic retrieval.",
        "Designed modular routing architecture.",
        "Developed scalable backend APIs with authentication.",
      ],
      problem: "Standard text lookup suffers from poor context understanding, and off-the-shelf vector databases can be slow to query without specialized semantic routing.",
      solution: "A fast, production-ready Retrieval-Augmented Generation engine. It processes raw document streams, computes high-density embeddings, stores them with vector indexing in PostgreSQL, and implements modular route handlers for low-latency context retrieval.",
      architecture: [
        "Document ingest & chunking middleware",
        "Embeddings indexing via vector metrics in PostgreSQL",
        "FastAPI semantic routing with JWT access tokens",
        "Llama 3 LLM context generation proxy",
      ],
      impact: "Reduced query latencies and delivered highly accurate domain-specific context mapping to LLM prompts.",
      links: {
        demo: "https://ai-wiki-alpha.vercel.app",
      },
    },
  ];

  const handleTabChange = (projectId: string, tab: "overview" | "problem" | "architecture" | "contributions") => {
    setActiveTabs((prev) => ({ ...prev, [projectId]: tab }));
  };

  return (
    <section id="projects" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 light:border-black/5 transition-colors duration-300">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-orange-500 font-mono text-xs uppercase tracking-wider mb-2">
          <Layers size={14} />
          <span>Product Showcases</span>
        </div>
        <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-white light:text-black mb-2 transition-colors duration-300">
          Featured Engineering Works
        </h2>
        <p className="font-sans text-white/50 light:text-black/50 text-sm max-w-2xl leading-relaxed transition-colors duration-300">
          Deep-dive into production systems built around structured verification, research code generation, and low-latency semantic extraction.
        </p>
      </div>

      {/* Projects Grid/List */}
      <div className="space-y-12">
        {projects.map((project, index) => {
          const currentTab = activeTabs[project.id];
          return (
            <motion.div
              key={project.id}
              whileHover={{
                y: -6,
                scale: 1.01,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white/5 light:bg-black/5 border border-white/5 light:border-black/5 hover:border-white/10 light:hover:border-black/10 rounded-2xl p-6 sm:p-8 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 relative overflow-hidden group cursor-default shadow-lg hover:shadow-xl"
            >
              {/* Subtle background overlay transition on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-transparent to-orange-500/0 group-hover:from-orange-500/[0.02] group-hover:to-orange-500/[0.02] light:group-hover:from-orange-500/[0.01] light:group-hover:to-orange-500/[0.01] transition-all duration-500 pointer-events-none" />

              {/* Left Column: Title & Tech stack (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between z-10">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-white/10 light:bg-black/10 rounded text-[9px] uppercase tracking-widest text-[#F5F5F5]/80 light:text-black/80">
                      Case Study — 0{index + 1}
                    </span>
                  </div>
                  <h3 className="font-sans font-bold text-2xl sm:text-3xl text-white light:text-black mb-3 transition-colors duration-300">
                    {project.name}
                  </h3>
                  <p className="font-sans text-sm text-white/50 light:text-black/50 mb-6 leading-relaxed transition-colors duration-300">
                    {project.tagline}
                  </p>
                </div>

                {/* Tech stack tags */}
                <div className="mt-4">
                  <h4 className="font-mono text-[9px] text-white/30 light:text-black/40 uppercase tracking-widest mb-2 transition-colors duration-300">Tech Stack</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[9px] bg-[#050505] light:bg-white px-2 py-0.5 rounded border border-white/5 light:border-black/5 text-white/65 light:text-black/75 transition-colors duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Project Links */}
                  <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/5 light:border-black/5 transition-colors duration-300">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noreferrer"
                        className="font-sans font-medium text-xs text-white/40 light:text-black/40 hover:text-white light:hover:text-black flex items-center gap-1.5 transition-colors"
                      >
                        <Github size={13} />
                        GitHub Repo
                      </a>
                    )}
                    {project.links.demo && (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="font-sans font-medium text-xs text-orange-400 light:text-orange-600 hover:text-orange-300 light:hover:text-orange-700 flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink size={13} />
                        Live Demo
                      </a>
                    )}
                    {project.links.paper && (
                      <a
                        href={project.links.paper}
                        target="_blank"
                        rel="noreferrer"
                        className="font-sans font-medium text-xs text-blue-400 light:text-blue-500 hover:text-blue-300 light:hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                      >
                        <FileText size={13} />
                        Research Paper
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Tabs System (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between bg-[#050505]/40 light:bg-white/80 border border-white/5 light:border-black/5 rounded-xl p-5 sm:p-6 min-h-[320px] z-10 transition-colors duration-300">
                <div>
                  {/* Tab bar header */}
                  <div className="flex border-b border-white/5 light:border-black/5 mb-6 overflow-x-auto scrollbar-none gap-2 transition-colors duration-300">
                    {(["overview", "problem", "architecture", "contributions"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => handleTabChange(project.id, tab)}
                        className={`pb-3 text-xs uppercase tracking-widest font-sans font-medium relative px-2 transition-colors cursor-pointer whitespace-nowrap ${
                          currentTab === tab ? "text-orange-400 light:text-orange-600 font-semibold" : "text-white/40 light:text-black/40 hover:text-white light:hover:text-black"
                        }`}
                      >
                        {tab === "contributions" ? "key contributions" : tab === "problem" ? "problem & solution" : tab}
                        {currentTab === tab && (
                          <motion.span
                            layoutId={`project-tab-active-${project.id}`}
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-500 rounded-full"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Tab Body with AnimatePresence */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-4"
                    >
                      {currentTab === "overview" && (
                        <div className="space-y-3">
                          <p className="font-sans text-sm text-white/50 light:text-black/50 leading-relaxed transition-colors duration-300">
                            {project.tagline}. Built specifically with high-quality validation pipelines to tackle critical failure nodes in production setups.
                          </p>
                          <div className="flex items-start gap-2.5 bg-white/5 light:bg-black/5 p-3 rounded-lg border border-white/5 light:border-black/5 transition-colors duration-300">
                            <CheckCircle2 size={15} className="text-orange-400 light:text-orange-600 shrink-0 mt-0.5" />
                            <div>
                              <h5 className="font-mono text-[9px] text-white/30 light:text-black/40 uppercase tracking-widest mb-0.5 transition-colors duration-300">Key Impact</h5>
                              <p className="font-sans text-xs text-white/80 light:text-black/80 font-medium transition-colors duration-300">{project.impact}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentTab === "problem" && (
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center gap-1.5 font-mono text-[9px] text-orange-400 light:text-orange-600 uppercase tracking-widest mb-1 transition-colors duration-300">
                              <AlertTriangle size={11} />
                              <span>The Problem</span>
                            </div>
                            <p className="font-sans text-xs sm:text-sm text-white/50 light:text-black/50 leading-relaxed transition-colors duration-300">
                              {project.problem}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-mono text-[9px] text-blue-400 light:text-blue-600 uppercase tracking-widest mb-1 transition-colors duration-300">
                              <Lightbulb size={11} />
                              <span>The Solution</span>
                            </div>
                            <p className="font-sans text-xs sm:text-sm text-white/80 light:text-black/80 leading-relaxed transition-colors duration-300">
                              {project.solution}
                            </p>
                          </div>
                        </div>
                      )}

                      {currentTab === "architecture" && (
                        <div>
                          <div className="font-mono text-[9px] text-white/30 light:text-black/40 uppercase tracking-widest mb-3 transition-colors duration-300">System Architecture Components</div>
                          <ul className="space-y-2">
                            {project.architecture.map((item, i) => (
                              <li key={i} className="flex items-start gap-2.5 font-sans text-xs sm:text-sm text-white/70 light:text-black/70 transition-colors duration-300">
                                <span className="font-mono text-xs text-orange-500 light:text-orange-600 mt-0.5">0{i + 1}.</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {currentTab === "contributions" && (
                        <ul className="space-y-2.5">
                          {project.bullets.map((bullet, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 font-sans text-xs sm:text-sm text-white/70 light:text-black/70 transition-colors duration-300">
                              <span className="h-1.5 w-1.5 bg-orange-500 light:text-orange-600 rounded-full shrink-0 mt-2" />
                              <span className="leading-relaxed">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
