import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, Sparkles, AlertCircle, Check } from "lucide-react";
import { Message } from "../types";

const QUICK_QUESTIONS = [
  "What is your experience with RAG platforms?",
  "Tell me about AgentMonitor's safety framework.",
  "How did you perform at the Deutsche Börse Hackathon?",
  "What backend technologies are you strongest in?",
];

export default function AiRepresentative() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello! I am Kumaraswamy's AI Twin. 🤖✨\n\nI can tell you all about his technical skills in AI & Backend Systems, his research in table transformations, or his hackathon achievements. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setApiError(null);
    const userMsg: Message = {
      role: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Map history to the format expected by the API
      // exclude the very first system greeting
      const history = messages
        .slice(1)
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history }),
      });

      if (!res.ok) {
        throw new Error("Could not connect to Gemini API. Ensure GEMINI_API_KEY is configured.");
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const modelMsg: Message = {
        role: "model",
        text: data.text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      setApiError(
        "My backend brain is offline. Please make sure the GEMINI_API_KEY is configured under Secrets, or email Kumaraswamy directly!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        id="ai-floating-btn"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-neutral-900 dark:bg-[#F5F5F5] text-white dark:text-black p-4 rounded-full shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-neutral-800 dark:border-white/20 group"
        whileHover={{ y: -3 }}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-400"></span>
        </span>
        <Bot size={18} className="group-hover:rotate-12 transition-transform text-white dark:text-black" />
        <span className="font-sans font-semibold text-xs uppercase tracking-widest text-white dark:text-black pr-1">Ask AI Twin</span>
      </motion.button>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              id="ai-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Chat Panel */}
            <motion.div
              id="ai-chat-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white/95 dark:bg-[#050505]/95 border-l border-neutral-200 dark:border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.15)] dark:shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 flex flex-col backdrop-blur-md text-neutral-900 dark:text-[#F5F5F5] transition-colors"
            >
              {/* Header */}
              <div className="p-4 border-b border-neutral-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#050505]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 border border-orange-500/20">
                    <Bot size={22} />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-neutral-900 dark:text-slate-100 text-base flex items-center gap-1.5">
                      Kumaraswamy AI Twin
                      <Sparkles size={14} className="text-orange-400 animate-pulse" />
                    </h3>
                    <p className="font-sans text-xs text-orange-400 font-medium">Powered by Gemini 2.5 Flash</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:text-white/40 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed font-sans ${
                        msg.role === "user"
                          ? "bg-orange-500 text-white rounded-tr-none"
                          : "bg-neutral-100 dark:bg-white/5 text-neutral-800 dark:text-white/90 border border-neutral-200 dark:border-white/5 rounded-tl-none"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {msg.text}
                      </div>
                      <div
                        className={`text-[10px] mt-1.5 ${
                          msg.role === "user" ? "text-orange-200" : "text-neutral-500 dark:text-white/30"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/5 text-neutral-850 dark:text-[#F5F5F5] rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                {apiError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400 flex gap-2 items-start">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <div>{apiError}</div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Suggestions / Prompt Chips */}
              <div className="px-4 py-3 border-t border-neutral-200 dark:border-white/5 bg-neutral-50/50 dark:bg-[#050505]/40">
                <p className="text-[9px] text-neutral-400 dark:text-white/30 uppercase tracking-widest mb-2 font-mono">Suggested Questions</p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {QUICK_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      disabled={isLoading}
                      className="text-xs bg-neutral-100 hover:bg-neutral-200/80 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-700 dark:text-white/80 px-2.5 py-1.5 rounded-full border border-neutral-200 dark:border-white/5 transition-all cursor-pointer whitespace-nowrap text-left shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-neutral-200 dark:border-white/5 bg-neutral-50/50 dark:bg-[#050505]/40 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                  placeholder="Ask me something..."
                  disabled={isLoading}
                  className="flex-1 bg-white dark:bg-[#050505] border border-neutral-200 dark:border-white/5 text-neutral-900 dark:text-white/90 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 font-sans transition-all disabled:opacity-50 placeholder:text-neutral-400 dark:placeholder:text-white/20"
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={isLoading || !input.trim()}
                  className="bg-neutral-900 dark:bg-[#F5F5F5] hover:bg-neutral-850 dark:hover:bg-white disabled:opacity-50 text-white dark:text-black p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-center"
                >
                  <Send size={15} className="text-white dark:text-black" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
