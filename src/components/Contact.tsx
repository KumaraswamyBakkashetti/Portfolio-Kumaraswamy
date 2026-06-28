import React from "react";
import { motion } from "motion/react";
import { Mail, Github, Linkedin, Code2, MessageSquare, ArrowUpRight, Check } from "lucide-react";

export default function Contact() {
  const directLinks = [
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/kumaraswamy-bakkashetti-5164482b0",
      icon: <Linkedin size={20} />,
      label: "Professional Connection",
      desc: "Connect for industry collaboration, enterprise AI agent architecture, and direct career discussions.",
      actionText: "Connect on LinkedIn",
      accent: "text-[#0A66C2]",
    },
    {
      name: "GitHub Profile",
      url: "https://github.com/KumaraswamyBakkashetti",
      icon: <Github size={20} />,
      label: "Open-Source Hub",
      desc: "Deep-dive into production code repositories, verifiable engineering benchmarks, and custom developer tools.",
      actionText: "Verify Repositories",
      accent: "text-neutral-900 dark:text-[#F5F5F5]",
    },
    {
      name: "Direct Email",
      url: "mailto:kumaraswamybakkashetti@gmail.com",
      icon: <Mail size={20} />,
      label: "Secure Transmission",
      desc: "Send direct inquiries for high-throughput software projects, partnerships, or immediate consultations.",
      actionText: "Initiate Thread",
      accent: "text-orange-500",
    },
    {
      name: "LeetCode Algorithmic",
      url: "https://leetcode.com/u/kumaraswamybakkashetti/",
      icon: <Code2 size={20} />,
      label: "Computational Rating",
      desc: "Review optimized multi-agent logic, verified data structures, and algorithmic puzzle-solving metrics.",
      actionText: "Analyze Rating",
      accent: "text-yellow-500",
    },
  ];

  return (
    <section id="contact" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 text-orange-500 font-mono text-xs uppercase tracking-wider bg-orange-500/5 px-3 py-1 rounded-full border border-orange-500/10">
          <MessageSquare size={14} />
          <span>Direct Routing Protocol</span>
        </div>
        <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-[#F5F5F5] transition-colors duration-300 uppercase">
          Let's Collaborate
        </h2>
        <p className="font-sans text-slate-500 dark:text-white/50 text-sm max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
          Ready to engineer deterministic RAG pipelines and multi-agent frameworks. Initiate a secure link below to connect directly with Kumaraswamy.
        </p>
      </div>

      {/* High-Fidelity Bento Grid for Direct Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {directLinks.map((link, idx) => (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -6, scale: 1.015 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="group relative block bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/5 hover:border-orange-500/30 dark:hover:border-orange-500/30 rounded-2xl p-6 sm:p-8 transition-all duration-300 overflow-hidden cursor-pointer shadow-md hover:shadow-xl"
          >
            {/* Ambient visual indicator */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:from-orange-500/10 transition-all duration-500" />
            
            <div className="flex items-start justify-between mb-6">
              <div className={`p-3 bg-white dark:bg-black/40 border border-neutral-200 dark:border-white/5 rounded-xl group-hover:border-orange-500/30 transition-colors shadow-sm ${link.accent}`}>
                {link.icon}
              </div>
              <span className="font-mono text-[9px] bg-neutral-200/50 dark:bg-[#050505] border border-neutral-300/30 dark:border-white/5 px-2.5 py-1 rounded text-neutral-600 dark:text-white/40 uppercase tracking-widest font-medium group-hover:text-orange-400 group-hover:border-orange-500/20 transition-all">
                {link.label}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-sans font-bold text-xl text-neutral-950 dark:text-white group-hover:text-orange-400 dark:group-hover:text-orange-400 transition-colors duration-300">
                {link.name}
              </h3>
              <p className="font-sans text-sm text-neutral-600 dark:text-white/50 leading-relaxed transition-colors duration-300">
                {link.desc}
              </p>
            </div>

            {/* Simulated terminal response verification bar */}
            <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-white/5 flex items-center justify-between transition-colors duration-300">
              <span className="font-mono text-[10px] text-neutral-500 dark:text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                System Active
              </span>
              <span className="font-sans font-semibold text-xs text-orange-500 dark:text-orange-400 group-hover:translate-x-1.5 transition-transform duration-300 flex items-center gap-1">
                {link.actionText}
                <ArrowUpRight size={13} />
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
