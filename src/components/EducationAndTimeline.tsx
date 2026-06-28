import { motion } from "motion/react";
import { GraduationCap, Award, Calendar, BookOpen, Trophy, Zap, Terminal } from "lucide-react";

export default function EducationAndTimeline() {
  const achievements = [
    {
      year: "2024",
      title: "Deutsche Börse Group Hackathon Finalist",
      subtitle: "Solo Participant | Top 16 out of ~250 contestants",
      description: "Designed a high-throughput transaction ledger proxy using FastAPI and Redis. Handled stress tests and placed in the final top tier completely solo.",
      icon: <Trophy className="text-orange-500" size={16} />,
      tag: "Hackathon",
    },
    {
      year: "2024",
      title: "PromptFest Engineering Finalist",
      subtitle: "Top-tier finalist among ~250 participants",
      description: "Implemented complex multi-turn prompt structures, rigid system JSON templates, and custom safety wrappers for safety metrics evaluation.",
      icon: <Zap className="text-orange-500" size={16} />,
      tag: "AI Safety",
    },
    {
      year: "2023 - Present",
      title: "LeetCode Rigor & Algorithmic Milestones",
      subtitle: "230+ Problems Solved | Contest Rating: 1480",
      description: "Consistent problem solver in data structures, graph traversals, dynamic programming, and relational database SQL query designs.",
      icon: <Terminal className="text-neutral-600 dark:text-white/80" size={16} />,
      tag: "Algorithms",
    },
  ];

  const keySubjects = [
    "Design and Analysis of Algorithms",
    "Database Management Systems (DBMS)",
    "Object-Oriented Programming (Java)",
    "LLM Prompt Validation Systems",
    "RAG Embeddings Vector Math",
  ];

  return (
    <section id="education-timeline" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-200 dark:border-white/5 transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Education credential - 5 columns */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2 text-orange-500 font-mono text-xs uppercase tracking-wider">
            <GraduationCap size={14} />
            <span>Academic Profile</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white transition-colors duration-300">
            Academic Foundation
          </h2>
          <p className="font-sans text-neutral-600 dark:text-white/50 text-sm leading-relaxed transition-colors duration-300">
            Pursuing Computer Science at Keshav Memorial Institute of Technology, focusing on modern distributed architectures and intelligent systems.
          </p>

          {/* Academic Card */}
          <div className="bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group shadow-sm transition-colors duration-300">
            {/* Ambient indicator lights */}
            <div className="absolute top-0 right-0 h-[100px] w-[100px] bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="font-mono text-[9px] text-orange-400 font-medium bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 uppercase tracking-wider">
                  2023 - 2027
                </span>
                <h3 className="font-sans font-bold text-neutral-950 dark:text-[#F5F5F5] text-lg mt-2 leading-snug transition-colors duration-300">
                  Bachelor of Technology
                </h3>
                <p className="font-sans text-xs text-orange-400 font-medium">Computer Science and Engineering</p>
              </div>
              <div className="p-2 bg-white dark:bg-[#050505] border border-neutral-200 dark:border-white/5 rounded-xl text-neutral-500 dark:text-white/40 transition-colors duration-300 animate-pulse">
                <BookOpen size={18} />
              </div>
            </div>

            <p className="font-sans text-xs sm:text-sm text-neutral-600 dark:text-white/50 mb-6 transition-colors duration-300">
              Keshav Memorial Institute of Technology, Hyderabad, Telangana, India
            </p>

            {/* Metrics */}
            <div className="border-t border-neutral-200 dark:border-white/5 pt-4 mb-6 transition-colors duration-300">
              <div className="flex justify-between items-center">
                <span className="font-sans text-xs text-neutral-500 dark:text-white/40 transition-colors duration-300">Cumulative GPA</span>
                <span className="font-mono text-sm font-semibold text-neutral-950 dark:text-white transition-colors duration-300">9.43 / 10.0</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-[#050505] h-1.5 rounded-full mt-2 overflow-hidden border border-neutral-300 dark:border-white/5 transition-colors duration-300">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full" style={{ width: "94.3%" }} />
              </div>
            </div>

            {/* Sub-block key focus subjects */}
            <div>
              <h4 className="font-mono text-[9px] text-neutral-500 dark:text-white/30 uppercase tracking-widest mb-2 transition-colors duration-300">Selected Key Subjects</h4>
              <div className="flex flex-wrap gap-1.5">
                {keySubjects.map((sub) => (
                  <span key={sub} className="font-sans text-[10px] bg-white dark:bg-[#050505] border border-neutral-200 dark:border-white/5 px-2 py-1 rounded text-neutral-600 dark:text-white/50 transition-colors duration-300 shadow-sm">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chronological Achievements Timeline - 7 columns */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 text-orange-500 font-mono text-xs uppercase tracking-wider">
            <Award size={14} />
            <span>Milestones</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white mb-2 transition-colors duration-300">
            Chronology of Achievements
          </h2>

          <div className="relative border-l border-neutral-200 dark:border-white/5 ml-4 pl-6 space-y-8 pt-2 transition-colors duration-300">
            {achievements.map((ach, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-[35px] top-1.5 bg-white dark:bg-[#050505] border border-neutral-200 dark:border-white/5 p-1.5 rounded-xl text-neutral-500 dark:text-white/40 group-hover:border-orange-500/40 group-hover:text-orange-500 dark:group-hover:text-white transition-all duration-300">
                  {ach.icon}
                </div>

                <div className="bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200/50 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/10 rounded-2xl p-5 transition-all duration-300 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs text-orange-400 font-semibold">{ach.year}</span>
                    <span className="font-mono text-[9px] bg-white dark:bg-[#050505] text-neutral-500 dark:text-white/40 px-2 py-0.5 rounded-md border border-neutral-200 dark:border-white/5 uppercase tracking-wider transition-colors duration-300">
                      {ach.tag}
                    </span>
                  </div>
                  <h3 className="font-sans font-semibold text-neutral-950 dark:text-slate-100 text-base mb-1 group-hover:text-orange-400 transition-colors duration-300">
                    {ach.title}
                  </h3>
                  <p className="font-sans text-xs text-neutral-600 dark:text-white/50 font-medium mb-3 transition-colors duration-300">
                    {ach.subtitle}
                  </p>
                  <p className="font-sans text-xs sm:text-sm text-neutral-600 dark:text-white/50 leading-relaxed transition-colors duration-300">
                    {ach.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
