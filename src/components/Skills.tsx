import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Code, Server, Database, Wrench, CircleDot, Grid, Sparkles } from "lucide-react";
import SkillsConstellation from "./SkillsConstellation";

interface SkillCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  skills: { name: string; level: string; description: string }[];
}

interface SkillsProps {
  onEnterImmersive?: () => void;
}

export default function Skills({ onEnterImmersive }: SkillsProps) {
  const [viewMode, setViewMode] = useState<"constellation" | "grid">("constellation");
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const skillCategories: SkillCategory[] = [
    {
      id: "ai-ml",
      name: "AI & Machine Learning",
      icon: <Cpu size={16} />,
      skills: [
        { name: "Large Language Models", level: "Expert", description: "Prompt optimization, system engineering, and structured outputs." },
        { name: "RAG Platform", level: "Expert", description: "Embeddings, semantic retrieval, indexing, chunking, and metadata routing." },
        { name: "Multi-Agent Systems", level: "Advanced", description: "Autonomous orchestration, safe execution frameworks, and collaboration loops." },
        { name: "Prompt Engineering", level: "Expert", description: "Structured response validation, JSON schemas, and safety guards." },
        { name: "LangChain", level: "Advanced", description: "Chain building, tool binding, and semantic memory state managers." },
        { name: "XGBoost", level: "Advanced", description: "Downstream prediction, regression modeling, and performance evaluation." },
        { name: "AI Agents", level: "Expert", description: "Safe validation, tool calling loops, and self-correction cycles." },
      ],
    },
    {
      id: "languages",
      name: "Programming Languages",
      icon: <Code size={16} />,
      skills: [
        { name: "Python", level: "Expert", description: "Core data transformation, research modeling, FastAPI, and data structures." },
        { name: "Java", level: "Advanced", description: "Object-oriented program structure, multithreading, and systems design." },
        { name: "C++", level: "Advanced", description: "Algorithmic thinking, memory layout optimization, and core logic." },
        { name: "JavaScript", level: "Expert", description: "Event-driven UI, server controllers, asynchronous loops, and modern ES6." },
        { name: "SQL", level: "Expert", description: "Relational modeling, query optimization, joins, and indexing." },
      ],
    },
    {
      id: "backend",
      name: "Backend Engineering",
      icon: <Server size={16} />,
      skills: [
        { name: "FastAPI", level: "Expert", description: "High-performance REST APIs, background tasks, and automatic documentation." },
        { name: "Flask", level: "Advanced", description: "Microservices design, route routing, and session state engines." },
        { name: "Node.js", level: "Expert", description: "Asynchronous runtime loops, local modules, and custom micro-servers." },
        { name: "Express", level: "Expert", description: "API proxy routing, custom middlewares, static serving, and secure paths." },
        { name: "JWT Authentication", level: "Expert", description: "Secure token generation, claims, and role-based access controls." },
        { name: "REST APIs", level: "Expert", description: "Scalable routing, request safety, error handling, and structured JSON." },
      ],
    },
    {
      id: "databases",
      name: "Database Systems",
      icon: <Database size={16} />,
      skills: [
        { name: "MongoDB", level: "Expert", description: "NoSQL schema design, pipeline aggregations, and execution logging storage." },
        { name: "PostgreSQL", level: "Expert", description: "Relational schema layouts, complex queries, indexing, and vector extensions." },
        { name: "SQLite", level: "Advanced", description: "Lightweight local database storage, mobile caches, and development mock-ups." },
      ],
    },
    {
      id: "tools",
      name: "Developer Tools",
      icon: <Wrench size={16} />,
      skills: [
        { name: "Docker", level: "Advanced", description: "Container isolation, image builds, and multi-service networks." },
        { name: "Git", level: "Expert", description: "Version control, branching strategies, and collaboration pipelines." },
        { name: "Linux", level: "Advanced", description: "Shell scripting, daemon management, and permission controls." },
        { name: "Postman", level: "Expert", description: "API testing, collections, environment variables, and automated tests." },
      ],
    },
  ];

  // Get all skills if "all" category is selected
  const displayedSkills =
    activeCategory === "all"
      ? skillCategories.flatMap((cat) => cat.skills.map((s) => ({ ...s, catId: cat.id })))
      : skillCategories
          .find((cat) => cat.id === activeCategory)
          ?.skills.map((s) => ({ ...s, catId: activeCategory })) || [];

  return (
    <section id="skills" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 light:border-black/5 transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-orange-500 font-mono text-xs uppercase tracking-wider mb-2">
            <Code size={14} />
            <span>Capabilities</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-[#F5F5F5] transition-colors duration-300">
            Technical Arsenal
          </h2>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl md:rounded-full border border-slate-200 dark:border-white/5">
          <button
            onClick={() => setViewMode("constellation")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer ${
              viewMode === "constellation"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                : "text-slate-500 dark:text-white/40 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <CircleDot size={11} className="animate-pulse" />
            Cosmic Orbit
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer ${
              viewMode === "grid"
                ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg"
                : "text-slate-500 dark:text-white/40 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <Grid size={11} />
            Interactive Grid
          </button>
          <button
            onClick={onEnterImmersive}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-widest font-bold transition-all duration-300 cursor-pointer bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:scale-[1.03] active:scale-[0.97]"
          >
            <Sparkles size={11} className="animate-pulse text-yellow-300" />
            3D Immersive Universe
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "constellation" ? (
          <motion.div
            key="constellation"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <SkillsConstellation />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-3 py-1.5 rounded-full font-sans text-xs uppercase tracking-widest font-medium transition-all duration-300 cursor-pointer border ${
                  activeCategory === "all"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white"
                    : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 hover:text-slate-800 dark:hover:text-white border-slate-200 dark:border-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10"
                }`}
              >
                All Areas
              </button>
              {skillCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-xs uppercase tracking-widest font-medium transition-all duration-300 cursor-pointer border ${
                    activeCategory === cat.id
                      ? "bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white"
                      : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 hover:text-slate-800 dark:hover:text-white border-slate-200 dark:border-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10"
                  }`}
                >
                  {cat.icon}
                  {cat.name.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-h-[300px]">
              <AnimatePresence mode="popLayout">
                {displayedSkills.map((skill, idx) => (
                  <motion.div
                    layout
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className="relative bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 rounded-2xl p-4 cursor-pointer transition-all duration-300 group flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[9px] bg-slate-200/60 dark:bg-black/10 px-2 py-0.5 rounded border border-slate-300/30 dark:border-white/5 text-slate-600 dark:text-white/40 uppercase tracking-wider">
                          {skill.catId ? skill.catId.replace("-", " ") : "Core"}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                          <span className="font-sans text-[10px] font-semibold text-slate-500 dark:text-white/40 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            {skill.level}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-sans font-semibold text-slate-900 dark:text-white/90 text-sm group-hover:text-orange-600 dark:group-hover:text-white transition-colors mb-2">
                        {skill.name}
                      </h3>
                      <p className="font-sans text-slate-500 dark:text-white/50 text-xs leading-relaxed">
                        {skill.description}
                      </p>
                    </div>

                    {/* Dynamic bottom subtle line highlight */}
                    <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 rounded-full mt-4" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
