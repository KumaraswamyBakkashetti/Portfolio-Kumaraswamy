import { motion } from "motion/react";
import { Terminal, Shield, Brain, Database, Layers } from "lucide-react";

export default function About() {
  const principles = [
    {
      icon: <Shield className="text-orange-500" size={20} />,
      title: "Agentic Safety & Validation",
      desc: "Committed to building safe LLM applications by implementing structured response validation, hallucination detection, and safety frameworks.",
    },
    {
      icon: <Brain className="text-blue-600 dark:text-blue-400" size={20} />,
      title: "Intelligent Data Extraction",
      desc: "Specialized in using embeddings, semantic search, and prompt engineering to build high-precision Retrieval-Augmented Generation (RAG) platforms.",
    },
    {
      icon: <Database className="text-neutral-700 dark:text-white/80" size={20} />,
      title: "Robust Backend Pipelines",
      desc: "Architecting high-throughput REST APIs and multi-agent platforms with secure execution logging, JWT auth, and stable relational/non-relational storage.",
    },
    {
      icon: <Layers className="text-neutral-500 dark:text-[#F5F5F5]/60" size={20} />,
      title: "Research Implementation",
      desc: "Bridging the gap between theoretical ML models and production-grade software, turning research table mappings into executable Python systems.",
    },
  ];

  return (
    <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-200 dark:border-white/5 transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Biography Block - 5 columns */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2 text-orange-500 font-mono text-xs uppercase tracking-wider">
            <Terminal size={14} />
            <span>Biography</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white leading-tight transition-colors duration-300">
            Bridging High-Performance Code & LLM Intelligence
          </h2>
          <p className="font-sans text-neutral-600 dark:text-white/50 text-sm sm:text-base leading-relaxed transition-colors duration-300">
            I am Kumaraswamy Bakkashetti, a Software Engineer from Hyderabad, India, focusing on
            the intersection of high-availability backend engineering and robust AI orchestration.
          </p>
          <p className="font-sans text-neutral-600 dark:text-white/50 text-sm sm:text-base leading-relaxed transition-colors duration-300">
            From architecting safe multi-agent execution monitors to designing LLM classifiers for table transformations, 
            I construct software that makes complex models predictable, secure, and production-ready.
          </p>
          <div className="pt-4 flex items-center gap-6">
            <div>
              <div className="font-sans font-bold text-3xl text-neutral-950 dark:text-white transition-colors duration-300">9.43</div>
              <div className="font-sans text-xs text-neutral-500 dark:text-white/30 transition-colors duration-300">KMIT B.Tech CGPA</div>
            </div>
            <div className="h-8 w-px bg-neutral-200 dark:bg-white/10 transition-colors duration-300" />
            <div>
              <div className="font-sans font-bold text-3xl text-neutral-950 dark:text-white transition-colors duration-300">230+</div>
              <div className="font-sans text-xs text-neutral-500 dark:text-white/30 transition-colors duration-300">LeetCode Solved</div>
            </div>
            <div className="h-8 w-px bg-neutral-200 dark:bg-white/10 transition-colors duration-300" />
            <div>
              <div className="font-sans font-bold text-3xl text-neutral-950 dark:text-white transition-colors duration-300">Top 16</div>
              <div className="font-sans text-xs text-neutral-500 dark:text-white/30 transition-colors duration-300">Hackathon Finalist</div>
            </div>
          </div>
        </div>

        {/* Bento Grid Core Principles - 7 columns */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {principles.map((principle, idx) => (
            <motion.div
              key={idx}
              className="bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200/50 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/10 rounded-2xl p-5 transition-all duration-300 group cursor-pointer shadow-sm"
              whileHover={{ y: -4 }}
            >
              <div className="p-2 bg-white dark:bg-[#050505] border border-neutral-200 dark:border-white/5 rounded-xl w-fit mb-4 group-hover:border-orange-500/20 group-hover:bg-orange-500/5 transition-all duration-300">
                {principle.icon}
              </div>
              <h3 className="font-sans font-semibold text-neutral-800 dark:text-white/90 text-base mb-2 group-hover:text-black dark:group-hover:text-white transition-colors">
                {principle.title}
              </h3>
              <p className="font-sans text-neutral-600 dark:text-white/50 text-xs sm:text-sm leading-relaxed transition-colors duration-300">
                {principle.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
