import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  ExternalLink,
  MapPin,
  Calendar,
  Server,
  Bot,
  Layers,
  ChevronRight,
  Workflow,
  Sparkles,
  CheckCircle2,
  Cpu,
  ArrowRight,
  GitBranch,
  Terminal,
} from "lucide-react";

interface AgenticFlowStage {
  id: number;
  title: string;
  shortLabel: string;
  tag: string;
  summary: string;
  details: string[];
  artifacts: string;
}

interface ExperienceData {
  id: string;
  role: string;
  company: string;
  companyDivision: string;
  companyUrl: string;
  tagline: string;
  location: string;
  period: string;
  status: string;
  type: string;
  overview: string;
  agenticStages: AgenticFlowStage[];
  keyResponsibilities: {
    icon: typeof Server;
    title: string;
    description: string;
  }[];
  impactMetrics: {
    label: string;
    value: string;
  }[];
  techStack: string[];
}

const experiences: ExperienceData[] = [
  {
    id: "zeta-global",
    role: "Software Engineer Intern",
    company: "Aptroid Consulting",
    companyDivision: "Division of Zeta Global — Product Development Company",
    companyUrl: "https://zetaglobal.com",
    tagline: "Deep Programming, Systems Thinking & AI-Driven Engineering (NYSE: ZETA)",
    location: "Hyderabad, Telangana, India",
    period: "Aug 2026 - Present",
    status: "Active Intern",
    type: "Internship",
    overview:
      "Working as a Software Engineer Intern at Aptroid Consulting (a product development division of Zeta Global) since August 2026, focused on deep programming, systems thinking, and AI-driven engineering. Developing scalable enterprise backend services using Spring Boot and Python, and architecting an end-to-end autonomous agentic workflow powered by LLMs that automates Jira ticket extraction, in-depth requirement analysis, code resolution, and deployment pipelines.",
    agenticStages: [
      {
        id: 1,
        title: "Automatic Jira Ticket Extraction",
        shortLabel: "1. Jira Extraction",
        tag: "Ingestion & Triage",
        summary:
          "Automated webhook and REST polling pipeline connecting to Jira to extract incoming tickets, tasks, user stories, and bug reports without manual developer overhead.",
        details: [
          "Connects to Jira REST APIs / Webhooks for instantaneous event ingestion",
          "Extracts ticket descriptions, acceptance criteria, priority tags, and component scopes",
          "Deduplicates tickets and computes semantic vector embeddings for codebase contextual matching",
        ],
        artifacts: "Input: Jira Ticket ID & Payload → Output: Sanitized Ticket Schema & Context Object",
      },
      {
        id: 2,
        title: "Requirement Analysis & Task Decomposition",
        shortLabel: "2. Requirement Analysis",
        tag: "LLM Reasoning",
        summary:
          "Multi-agent LLM analysis engine that dissects complex requirement specs into atomic technical tasks, identifying dependencies, edge cases, and architectural constraints.",
        details: [
          "Dissects business logic into discrete subtasks and interface definitions",
          "Identifies potential edge cases, failure modes, and security constraints early",
          "Maps required database schemas, Spring Boot endpoints, and Python worker dependencies",
        ],
        artifacts: "Input: Raw Requirement → Output: Structured Technical Spec & Acceptance Checklist",
      },
      {
        id: 3,
        title: "Automated Solving & Code Generation",
        shortLabel: "3. Develop & Solve",
        tag: "Code Synthesis",
        summary:
          "Autonomous coding agent that implements business logic, bug resolutions, and automated test suites in Spring Boot and Python following strict enterprise design patterns.",
        details: [
          "Synthesizes clean code aligned with production architecture and SOLID principles",
          "Generates comprehensive unit and integration tests covering positive and boundary conditions",
          "Validates generated code via AST parsing, linting, and compile-time verification before PR creation",
        ],
        artifacts: "Input: Technical Spec → Output: Code Patch, Unit Tests & Git Branch/PR",
      },
      {
        id: 4,
        title: "Automated Verification & CI/CD Deployment",
        shortLabel: "4. Deployment",
        tag: "Delivery Pipeline",
        summary:
          "End-to-end deployment orchestration that triggers CI/CD workflows, verifies build pipelines in Docker containers, and executes staging rollout with status tracking.",
        details: [
          "Triggers automated test suites and regression analysis on CI/CD pipelines",
          "Executes containerized builds and health-check verification in staging environments",
          "Updates Jira ticket status automatically with commit hashes, test metrics, and deployment URLs",
        ],
        artifacts: "Input: Verified Pull Request → Output: Staging Deployment & Jira Status Update",
      },
    ],
    keyResponsibilities: [
      {
        icon: Bot,
        title: "Autonomous Agentic Flow (Jira to Deployment)",
        description:
          "Architected an autonomous multi-agent pipeline using LLMs for the complete software engineering lifecycle: automated extraction of Jira tickets, deep requirement and edge-case analysis, synthesis of code solutions, automated testing, and triggered deployments.",
      },
      {
        icon: Server,
        title: "Enterprise Backend (Spring Boot & Python)",
        description:
          "Designing and developing high-performance backend microservices and RESTful endpoints using Spring Boot, Java, and Python. Implementing scalable architectures, concurrent operations, and structured data handling.",
      },
      {
        icon: Layers,
        title: "Systems Thinking & Production Rigor",
        description:
          "Applying deep systems thinking around program execution models (stack vs. heap), memory concepts, concurrency, and I/O. Collaborating on architecture discussions, rigorous code reviews, automated CI/CD workflows, and production reliability.",
      },
    ],
    impactMetrics: [
      { label: "Started", value: "August 2026" },
      { label: "Core Stack", value: "Spring Boot • Python • Java" },
      { label: "Agentic Flow", value: "Jira Extraction -> Solve -> Deploy" },
      { label: "Division", value: "Aptroid (Zeta Global, NYSE: ZETA)" },
    ],
    techStack: [
      "Spring Boot",
      "Python",
      "Java",
      "LLMs & Agentic AI",
      "Autonomous Jira Flow",
      "Requirement Analysis",
      "Automated Deployment",
      "Microservices",
      "REST APIs",
      "Concurrency & Systems",
      "Docker",
      "CI/CD Pipelines",
    ],
  },
];

export default function Experience() {
  const [selectedExperience] = useState<string>("zeta-global");
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const exp = experiences.find((e) => e.id === selectedExperience) || experiences[0];
  const currentStage = exp.agenticStages.find((s) => s.id === activeStageId) || exp.agenticStages[0];

  return (
    <section
      id="experience"
      className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-200 dark:border-white/5 transition-colors duration-300"
    >
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center gap-2 text-orange-500 font-mono text-xs uppercase tracking-wider mb-2">
            <Briefcase size={14} />
            <span>Professional Journey</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white transition-colors duration-300">
            Work Experience
          </h2>
        </div>
        <p className="font-sans text-neutral-600 dark:text-white/50 text-sm max-w-md transition-colors duration-300">
          Building production-ready software systems, distributed backend infrastructure, and AI-driven platforms in real-world engineering environments.
        </p>
      </div>


      {/* Main Experience Showcase Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 overflow-hidden shadow-sm transition-all"
      >
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-neutral-200 dark:border-white/10">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            {/* Company Monogram Badge */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-bold text-xl sm:text-2xl tracking-tighter shadow-md border border-neutral-800 dark:border-white/20">
                ZG
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-[#050505]"></span>
              </span>
            </div>

            {/* Title & Organization Details */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="font-mono text-[10px] text-orange-500 font-semibold uppercase tracking-wider bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                  {exp.type}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {exp.status}
                </span>
              </div>

              <h3 className="font-sans font-bold text-2xl sm:text-3xl text-neutral-950 dark:text-white tracking-tight">
                {exp.role}
              </h3>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-neutral-600 dark:text-white/60">
                <a
                  href={exp.companyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-neutral-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 inline-flex items-center gap-1 transition-colors group"
                >
                  <span>{exp.company}</span>
                  <ExternalLink size={13} className="text-neutral-400 group-hover:text-orange-500 transition-colors" />
                </a>
                <span className="text-neutral-300 dark:text-white/20">•</span>
                <span className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-white/80">{exp.companyDivision}</span>
                <span className="text-neutral-300 dark:text-white/20">•</span>
                <span className="text-xs sm:text-sm text-neutral-500 dark:text-white/50">{exp.tagline}</span>
              </div>
            </div>
          </div>

          {/* Location & Period Meta */}
          <div className="flex lg:flex-col items-start lg:items-end justify-between sm:justify-start gap-2 pt-2 lg:pt-0 font-mono text-xs text-neutral-500 dark:text-white/50">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-orange-500" />
              <span className="text-neutral-900 dark:text-white/80 font-medium">{exp.period}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-orange-500" />
              <span>{exp.location}</span>
            </div>
          </div>
        </div>

        {/* Narrative Overview */}
        <div className="relative z-10 py-6 sm:py-8">
          <p className="font-sans text-sm sm:text-base text-neutral-700 dark:text-white/70 leading-relaxed max-w-4xl">
            {exp.overview}
          </p>
        </div>

        {/* Key Responsibilities / Focus Pillars */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {exp.keyResponsibilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm border border-neutral-200/80 dark:border-white/5 rounded-2xl p-5 hover:border-orange-500/30 dark:hover:border-orange-500/30 transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon size={18} />
                </div>
                <h4 className="font-sans font-semibold text-neutral-900 dark:text-white text-sm mb-1.5 flex items-center gap-1.5">
                  <span>{item.title}</span>
                </h4>
                <p className="font-sans text-xs text-neutral-600 dark:text-white/50 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Interactive Autonomous Agentic Flow Architecture Visualizer */}
        <div className="relative z-10 mb-8 bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-neutral-200/90 dark:border-white/10 p-5 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-200 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <Workflow size={17} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-sans font-bold text-neutral-900 dark:text-white text-base sm:text-lg">
                    Autonomous Agentic Flow Pipeline
                  </h4>
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 font-semibold uppercase">
                    Interactive
                  </span>
                </div>
                <p className="font-sans text-xs text-neutral-500 dark:text-white/50">
                  Full lifecycle automation: Jira ticket extraction → requirement analysis → code resolution → automated deployment
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-500 dark:text-white/40 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Step {activeStageId} of {exp.agenticStages.length}</span>
            </div>
          </div>

          {/* Stepper Pipeline Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6">
            {exp.agenticStages.map((stage) => {
              const isActive = stage.id === activeStageId;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStageId(stage.id)}
                  className={`text-left p-3 rounded-xl border transition-all duration-200 relative cursor-pointer ${
                    isActive
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-md"
                      : "bg-white/50 dark:bg-white/5 text-neutral-700 dark:text-white/70 border-neutral-200 dark:border-white/10 hover:border-orange-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isActive
                          ? "bg-white/20 dark:bg-black/10 text-white dark:text-neutral-950"
                          : "bg-neutral-100 dark:bg-white/10 text-orange-500"
                      }`}
                    >
                      Stage 0{stage.id}
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
                    )}
                  </div>
                  <div className="font-sans font-semibold text-xs leading-snug truncate">
                    {stage.shortLabel}
                  </div>
                  <div
                    className={`font-mono text-[9px] mt-0.5 truncate ${
                      isActive ? "text-white/70 dark:text-neutral-900/70" : "text-neutral-500 dark:text-white/40"
                    }`}
                  >
                    {stage.tag}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Inspection Body */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/5 rounded-xl p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-orange-500/10 text-orange-500 font-mono font-bold text-xs flex items-center justify-center">
                    {currentStage.id}
                  </span>
                  <h5 className="font-sans font-bold text-neutral-950 dark:text-white text-sm sm:text-base">
                    {currentStage.title}
                  </h5>
                </div>
                <span className="font-mono text-[10px] text-orange-500 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded w-fit">
                  {currentStage.tag}
                </span>
              </div>

              <p className="font-sans text-xs sm:text-sm text-neutral-700 dark:text-white/70 mb-4 leading-relaxed">
                {currentStage.summary}
              </p>

              {/* Engineering Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-4">
                {currentStage.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-white dark:bg-black/30 border border-neutral-200/60 dark:border-white/5 text-xs text-neutral-700 dark:text-white/70 leading-normal"
                  >
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              {/* Artifact Flow Bar */}
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-900 dark:bg-black text-neutral-200 font-mono text-[11px] overflow-x-auto border border-neutral-800">
                <Terminal size={12} className="text-orange-400 shrink-0" />
                <span className="text-neutral-400 shrink-0">Pipeline IO:</span>
                <span className="text-neutral-200 select-all font-mono whitespace-nowrap">
                  {currentStage.artifacts}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Metrics Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 p-4 bg-white/60 dark:bg-black/20 rounded-2xl border border-neutral-200/60 dark:border-white/5">
          {exp.impactMetrics.map((metric, idx) => (
            <div key={idx} className="text-center sm:text-left p-2">
              <div className="font-mono text-[10px] text-neutral-500 dark:text-white/40 uppercase tracking-widest mb-1">
                {metric.label}
              </div>
              <div className="font-sans font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack Chips & Link CTA */}
        <div className="relative z-10 pt-6 border-t border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] text-neutral-500 dark:text-white/40 uppercase tracking-wider mr-1">
              Technologies:
            </span>
            {exp.techStack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[10px] bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-white/70 px-2.5 py-1 rounded-md shadow-xs"
              >
                {tech}
              </span>
            ))}
          </div>

          <a
            href={exp.companyUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-sans text-xs font-semibold tracking-wide transition-all shadow-sm group shrink-0 cursor-pointer"
          >
            <span>Learn About Zeta Global</span>
            <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
