import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Terminal, Code2, Cpu, ArrowLeft, Maximize2, 
  RotateCcw, Sliders, Play, Pause, ZoomIn, ZoomOut, Compass, Info, Check, Globe
} from "lucide-react";

interface Moon {
  name: string;
  description: string;
  level: string;
  projects: string;
}

interface ArchitectureItem {
  source: string;
  target: string;
  relation: string;
}

interface TimelineItem {
  year: string;
  milestone: string;
}

interface RepoItem {
  name: string;
  stars: number;
  description: string;
}

interface CertItem {
  name: string;
  issuer: string;
}

interface Planet {
  id: string;
  name: string;
  size: number;
  color: string;
  trailColor: string;
  orbitRadius: number;
  orbitSpeed: number;
  inclination: number; // Orbit plane slant
  eccentricity: number; // Elliptical distortion
  delay: number; // Helix spring delay
  description: string;
  experience: string;
  projects: string;
  moons: Moon[];
  architecture: ArchitectureItem[];
  timeline: TimelineItem[];
  repos: RepoItem[];
  certs: CertItem[];
}

interface ImmersiveSkillsUniverseProps {
  onClose: () => void;
  theme: "dark" | "light";
}

export default function ImmersiveSkillsUniverse({ onClose, theme }: ImmersiveSkillsUniverseProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [hoveredMoon, setHoveredMoon] = useState<Moon | null>(null);
  const [activeTab, setActiveTab] = useState<"specs" | "arch" | "timeline" | "repos">("specs");
  
  // Custom HUD simulation configurations
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [showOrbitTrails, setShowOrbitTrails] = useState<boolean>(true);
  const [showNebulas, setShowNebulas] = useState<boolean>(true);
  const [cameraAutopilot, setCameraAutopilot] = useState<boolean>(true);
  const [universeAge, setUniverseAge] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  
  // Interactive gesture refs
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  
  const cameraRef = useRef({
    yaw: 0,
    pitch: 0.85,
    zoom: 0.8,
    targetYaw: 0,
    targetPitch: 0.85,
    targetZoom: 0.8,
    focusX: 0,
    focusY: 0,
    focusZ: 0,
    targetFocusX: 0,
    targetFocusY: 0,
    targetFocusZ: 0,
    yawVelocity: 0.003, // slow spin autopilot
    pitchVelocity: 0,
  });

  // Big Bang ignition intro animation
  const introProgressRef = useRef<number>(0);

  // Dynamic overlays storage
  const [overlays, setOverlays] = useState<Array<{
    id: string;
    type: "planet" | "moon" | "core";
    name: string;
    x: number;
    y: number;
    scale: number;
    zIndex: number;
    opacity: number;
    color: string;
    active: boolean;
    refObject?: any;
  }>>([]);

  const planets: Planet[] = [
    {
      id: "programming",
      name: "Programming Core",
      size: 16,
      color: "#EF4444", // Crimson Red
      trailColor: "rgba(239, 68, 68, 0.4)",
      orbitRadius: 90,
      orbitSpeed: 0.28,
      inclination: 0.08,
      eccentricity: 1.12,
      delay: 4,
      experience: "Expert",
      description: "Crafting bulletproof, type-safe software systems. Fluent in procedural, object-oriented, and dynamic functional language design paradigms.",
      projects: "Multi-threaded Query Compiler, Legacy Enterprise Refactoring, AST Bytecode Parser",
      moons: [
        { name: "Python", description: "Dynamic interpreter, metadata scripting, and extensive machine learning platform integrations.", level: "Expert", projects: "Vector Clustering Model" },
        { name: "Java", description: "Strong typing, virtual machines orchestration, concurrent thread safety structures, JVM profiling.", level: "Expert", projects: "Financial Order Ledger" },
        { name: "JavaScript", description: "Asynchronous event-driven runtimes, non-blocking asynchronous loops, and rich frontend client engines.", level: "Expert", projects: "Telemetry Data Streamer" },
        { name: "C++", description: "Manual memory allocation, pointer arithmetic, zero-overhead templates, and hardware-near routines.", level: "Advanced", projects: "High-Frequency Packet Gateway" }
      ],
      architecture: [
        { source: "Developer Source", target: "AST Engine", relation: "Parses String" },
        { source: "AST Engine", target: "LLVM Compiler", relation: "Generates IR Code" },
        { source: "LLVM Compiler", target: "Binary Target", relation: "Emits Assembly" }
      ],
      timeline: [
        { year: "2018", milestone: "Deep C++ system optimizations for packet processing and driver queues." },
        { year: "2020", milestone: "Architected enterprise-grade type-safe Java financial frameworks." },
        { year: "2023", milestone: "Pioneered unified Python-centric automation toolchains and diagnostic routines." }
      ],
      repos: [
        { name: "ast-bytecode-parser", stars: 142, description: "Highly efficient AST interpreter with custom type resolution blocks." },
        { name: "multithreaded-scheduler", stars: 98, description: "A high-performance concurrent queue manager built in pure Java." }
      ],
      certs: [
        { name: "Oracle Certified Java Professional", issuer: "Oracle Corporation" }
      ]
    },
    {
      id: "ai-ml",
      name: "AI & ML Core",
      size: 18,
      color: "#F97316", // Solar Orange
      trailColor: "rgba(249, 115, 22, 0.45)",
      orbitRadius: 145,
      orbitSpeed: 0.22,
      inclination: -0.12,
      eccentricity: 1.15,
      delay: 7,
      experience: "Expert",
      description: "Pioneering autonomous multi-agent networks, locality-sensitive vector database index spaces, and state-of-the-art hybrid RAG platforms.",
      projects: "Clinical AI Agent Mesh, Dense Vector Embeddings Partitioning, RAG Reasoning Router",
      moons: [
        { name: "LangChain", description: "Stateful agent DAG routing pipelines, cognitive chain state managers, custom tool binders.", level: "Expert", projects: "Multi-Agent Analyst" },
        { name: "Gemini", description: "Multimodal contextual window parsing, high-throughput function calling routing, structured JSON constraints.", level: "Expert", projects: "Medical File Summarizer" },
        { name: "OpenAI", description: "Fine-tuning weights datasets, structured JSON schema response coercion, context compression.", level: "Expert", projects: "Code Refactoring Engine" },
        { name: "RAG", description: "Hybrid keyword lexical retrieval, vector distance embeddings clustering, rerankers integration.", level: "Expert", projects: "Legal Intel Engine" },
        { name: "XGBoost", description: "Tabular forecasting matrices, feature importance calculations, customer churn prediction pipelines.", level: "Advanced", projects: "SaaS Forecasting Matrix" },
        { name: "Transformers", description: "Self-attention matrix weights calculation, sequence tokenization, encoder structures.", level: "Advanced", projects: "Custom Classifier model" }
      ],
      architecture: [
        { source: "User Query", target: "Gemini / OpenAI", relation: "Analyzes Semantics" },
        { source: "Gemini / OpenAI", target: "Vector DB (RAG)", relation: "Fetches Contextual Docs" },
        { source: "Vector DB (RAG)", target: "LangChain Agent", relation: "Executes Reasoning Loop" }
      ],
      timeline: [
        { year: "2021", milestone: "Deployed predictive XGBoost tabular classifiers into production." },
        { year: "2023", milestone: "Engineered robust semantic search pipelines utilizing pgvector caches." },
        { year: "2025", milestone: "Co-authored secure, multi-agent automated RAG clinical platforms." }
      ],
      repos: [
        { name: "clinical-agent-rag-gateway", stars: 412, description: "Secure, HIPAA-aligned multi-agent RAG reasoning engine." },
        { name: "dynamic-vector-partitioner", stars: 189, description: "Locality-sensitive hashing optimizer for hyper-scale vector datasets." }
      ],
      certs: [
        { name: "TensorFlow Certified Developer", issuer: "Google Developers" },
        { name: "Generative AI Agent Specialist", issuer: "DeepLearning.AI" }
      ]
    },
    {
      id: "backend",
      name: "Backend System",
      size: 17,
      color: "#10B981", // Emerald
      trailColor: "rgba(16, 185, 129, 0.4)",
      orbitRadius: 200,
      orbitSpeed: 0.17,
      inclination: 0.16,
      eccentricity: 0.95,
      delay: 11,
      experience: "Expert",
      description: "Constructing scalable, asynchronous backend systems, low-latency API gateways, and distributed event-driven pipelines.",
      projects: "FastAPI Analytic Endpoint, High-Performance Socket Broker, Route Authorization Filter",
      moons: [
        { name: "FastAPI", description: "Async non-blocking endpoints, automatic Pydantic model validations, fast JSON routing.", level: "Expert", projects: "Telemetry Logging Core" },
        { name: "Node.js", description: "Event-driven architecture runtime pipelines, platform buffers, binary cluster forks.", level: "Expert", projects: "Async File Parser Microservice" },
        { name: "Express", description: "Middleware request validators, secure API rate limiters, static view loaders.", level: "Expert", projects: "Proxy Routing Server" },
        { name: "REST APIs", description: "Design layouts for uniform resource indicators, response caching headers, clean status codes.", level: "Expert", projects: "Universal Unified Schema" },
        { name: "JWT", description: "Cryptographically signed token authorizations, secret keys rotation, stateless validation.", level: "Expert", projects: "Stateless Microservice Auth" }
      ],
      architecture: [
        { source: "Client App", target: "API Gateway (Express)", relation: "Inspects JWT" },
        { source: "API Gateway (Express)", target: "Microservice (FastAPI)", relation: "Routes Payload" },
        { source: "Microservice (FastAPI)", target: "Event Queue", relation: "Dispatches Async Event" }
      ],
      timeline: [
        { year: "2019", milestone: "Refactored monolithic backends into efficient Node.js microservices." },
        { year: "2022", milestone: "Adopted asynchronous FastAPI structures for low-overhead REST APIs." },
        { year: "2024", milestone: "Implemented distributed session rate-limiters across global API gateways." }
      ],
      repos: [
        { name: "fastapi-socket-broker", stars: 295, description: "Highly scalable, ASGI-compliant real-time client pipeline." },
        { name: "custom-auth-interceptor", stars: 110, description: "Flexible middleware for declarative route authorization guards." }
      ],
      certs: [
        { name: "AWS Certified Developer - Associate", issuer: "Amazon Web Services" }
      ]
    },
    {
      id: "frontend",
      name: "Frontend Universe",
      size: 16,
      color: "#06B6D4", // Cyan
      trailColor: "rgba(6, 182, 212, 0.4)",
      orbitRadius: 255,
      orbitSpeed: 0.13,
      inclination: -0.22,
      eccentricity: 1.05,
      delay: 15,
      experience: "Expert",
      description: "Developing gorgeous, Awwwards-worthy user experiences featuring dynamic WebGL visualizers, and canvas coordinates calculations.",
      projects: "Interactive Heliocentric Solar Space, Infinite Portfolio Mesh, Responsive Interactive Timeline",
      moons: [
        { name: "React", description: "Fiber rendering cycles, state reconciler patterns, custom memory state hooks, profiling.", level: "Expert", projects: "Real-time Operations Dashboard" },
        { name: "Next.js", description: "Server-Side Rendering, Server Components, static generation, file-based routing grids.", level: "Expert", projects: "Enterprise Portal Core" },
        { name: "Tailwind CSS", description: "Responsive fluid styling rules, arbitrary component values, atomic class optimizations.", level: "Expert", projects: "Corporate Presentation Platform" },
        { name: "HTML", description: "Semantic markup structures, accessible ARIA landmarks, SEO optimizations.", level: "Expert", projects: "Interactive Brand Deck" },
        { name: "CSS", description: "Absolute 3D transforms, hardware-accelerated animations, grid coordinates layouts.", level: "Expert", projects: "Immersive Curtain Transition" }
      ],
      architecture: [
        { source: "Viewport Mouse", target: "Event Listener", relation: "Captures Vector Coordinates" },
        { source: "Event Listener", target: "React State Core", relation: "Triggers Fiber Re-render" },
        { source: "React State Core", target: "Canvas Context 2D", relation: "Renders Vector Curves" }
      ],
      timeline: [
        { year: "2020", milestone: "Designed pixel-perfect React application panels for data operations." },
        { year: "2022", milestone: "Migrated legacy codebases to type-safe, performance-tuned Next.js structures." },
        { year: "2025", milestone: "Built bespoke WebGL-accelerated canvas components with fluid layout shifts." }
      ],
      repos: [
        { name: "interactive-3d-heliocentric-space", stars: 520, description: "A highly interactive celestial visualization constructed purely with HTML5 Canvas." },
        { name: "motion-curtain-transition", stars: 174, description: "Premium, physical spring-based route transitions for React SPAs." }
      ],
      certs: [
        { name: "Meta Professional Front-End Developer", issuer: "Meta" }
      ]
    },
    {
      id: "databases",
      name: "Database Systems",
      size: 15,
      color: "#6366F1", // Indigo
      trailColor: "rgba(99, 102, 241, 0.4)",
      orbitRadius: 310,
      orbitSpeed: 0.1,
      inclination: 0.18,
      eccentricity: 1.1,
      delay: 19,
      experience: "Expert",
      description: "Deploying high-performance ACID-compliant storage tables, transactional indexes, and vectorized search query caches.",
      projects: "Double-Entry Financial Book, Semantic Vector Storage Ledger, Client Database Cache Sync",
      moons: [
        { name: "PostgreSQL", description: "Deep relational join plans, transaction isolation levels, pgvector embeddings indexing.", level: "Expert", projects: "Cognitive AI Document Index" },
        { name: "SQL", description: "Complex recursive CTE queries, indexing strategies, analytical window functions.", level: "Expert", projects: "Global BI Data Pipeline" },
        { name: "MongoDB", description: "Flexible document stores, heavy aggregate projection pipelines, cluster indexes.", level: "Expert", projects: "Dynamic User Metadata Store" },
        { name: "SQLite", description: "Ultra-fast embedded local file caches, isolated sandboxed unit testing, clean storage.", level: "Advanced", projects: "Secure Offline Client DB" },
        { name: "Redis", description: "In-memory key/value cache, transactional publish/subscribe channels, session state storage.", level: "Expert", projects: "Distributed Rate Limiter" }
      ],
      architecture: [
        { source: "FastAPI App", target: "Redis Cache", relation: "Looks Up Session Hash" },
        { source: "Redis Cache (Miss)", target: "PostgreSQL DB", relation: "Queries Indexed Table" },
        { source: "PostgreSQL DB", target: "Redis Cache", relation: "Hydrates Transient Entry" }
      ],
      timeline: [
        { year: "2020", milestone: "Designed enterprise MongoDB replica clusters with automatic failover." },
        { year: "2022", milestone: "Optimized complex analytical relational queries, cutting load times by 75%." },
        { year: "2024", milestone: "Implemented pgvector indexing for clinical AI RAG semantic search." }
      ],
      repos: [
        { name: "db-vector-search-engine", stars: 330, description: "Fast, concurrent embeddings lookup utilizing relational custom tables." },
        { name: "distributed-cache-sync", stars: 155, description: "A simple database replication pipeline for multi-region structures." }
      ],
      certs: [
        { name: "PostgreSQL Advanced Specialist", issuer: "EnterpriseDB" }
      ]
    },
    {
      id: "devops",
      name: "DevOps & Infrastructure",
      size: 14,
      color: "#EAB308", // Golden Yellow
      trailColor: "rgba(234, 179, 8, 0.4)",
      orbitRadius: 365,
      orbitSpeed: 0.075,
      inclination: -0.15,
      eccentricity: 0.9,
      delay: 24,
      experience: "Advanced",
      description: "Virtualizing application modules via Docker compose, establishing automated code test validation gates, and Webhook dispatch configurations.",
      projects: "Sandbox Container Cluster, Git-Hook Validation Actions, Daemon Process Log Rotator",
      moons: [
        { name: "Docker", description: "Multi-stage container builds, registry version controls, isolated networks configuration.", level: "Advanced", projects: "Full-Stack Dev Sandboxes" },
        { name: "Git", description: "Trunk workflow history, deep interactive rebase trees, secure release tags signing.", level: "Expert", projects: "Enterprise Team Repositories" },
        { name: "Linux Systems", description: "POSIX shell script automated routines, daemon management, user privilege controls.", level: "Advanced", projects: "Automated Server Watchdog" },
        { name: "Webhooks", description: "Designing secure event dispatch queues, response retry systems, cryptographic signatures.", level: "Expert", projects: "Real-time Callback Router" }
      ],
      architecture: [
        { source: "Git Push", target: "GitHub Actions", relation: "Spawns Build Agent" },
        { source: "GitHub Actions", target: "Docker Builder", relation: "Compiles Layer Images" },
        { source: "Docker Builder", target: "Cloud Container Host", relation: "Rolls Out Webhook Event" }
      ],
      timeline: [
        { year: "2021", milestone: "Automated standard enterprise environment deployments with Git hooks." },
        { year: "2023", milestone: "Created modular Docker setups that reduced setup times for new developers." },
        { year: "2025", milestone: "Engineered automatic diagnostic logging services running on secure Linux sandboxes." }
      ],
      repos: [
        { name: "sandbox-container-cluster", stars: 215, description: "A local, full-stack microservices deployment environment built on Docker." },
        { name: "git-lint-hook", stars: 85, description: "Rigorous static analyzer gate that intercepts commits before they are pushed." }
      ],
      certs: [
        { name: "Docker Certified Associate", issuer: "Docker" },
        { name: "Linux Professional Institute LPIC-1", issuer: "LPI" }
      ]
    }
  ];

  const relationships = [
    { from: "programming", to: "frontend", label: "Core Foundations" },
    { from: "programming", to: "backend", label: "Logic Runtime" },
    { from: "programming", to: "ai-ml", label: "Algorithm Models" },
    { from: "backend", to: "databases", label: "Transactional Query" },
    { from: "ai-ml", to: "databases", label: "pgvector Storage" },
    { from: "devops", to: "backend", label: "Containerized Engine" },
    { from: "frontend", to: "backend", label: "API Gateway Handshake" },
    { from: "ai-ml", to: "backend", label: "Agent Orchestration" }
  ];

  // Reset tab when selected planet changes
  useEffect(() => {
    setActiveTab("specs");
  }, [selectedPlanet]);

  // Set up mouse moving vectors for interactive camera parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mouseRef.current.targetX = (e.clientX / w - 0.5) * 1.5;
      mouseRef.current.targetY = (e.clientY / h - 0.5) * 1.2;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Set up Canvas Simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let localStars: { x: number; y: number; z: number; size: number; color: string; speed: number; phase: number }[] = [];
    let localNebulas: { x: number; y: number; z: number; radius: number; color: string; speed: number }[] = [];
    let localShootingStars: { x: number; y: number; z: number; vx: number; vy: number; vz: number; len: number; life: number; maxLife: number }[] = [];

    // Pre-generate rich stellar backdrop with depth
    for (let i = 0; i < 450; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 450 + 20;
      localStars.push({
        x: r * Math.cos(angle),
        y: (Math.random() - 0.5) * 200,
        z: r * Math.sin(angle),
        size: Math.random() * 1.5 + 0.3,
        color: Math.random() > 0.82 
          ? `rgba(249, 115, 22, ${Math.random() * 0.45 + 0.15})` // Solar gold stars
          : `rgba(${210 + Math.random() * 45}, ${220 + Math.random() * 35}, ${255}, ${Math.random() * 0.5 + 0.1})`, // Twinkling bluish-white
        speed: (Math.random() * 0.0006 + 0.0001) * (Math.random() > 0.5 ? 1 : -1),
        phase: Math.random() * Math.PI * 2
      });
    }

    // Pre-generate dynamic gas clouds (Nebula clusters)
    const nebulaColors = [
      "rgba(147, 51, 234, 0.06)", // Purple
      "rgba(99, 102, 241, 0.05)",  // Indigo
      "rgba(249, 115, 22, 0.04)",  // Orange
      "rgba(6, 182, 212, 0.04)"    // Cyan
    ];
    for (let i = 0; i < 12; i++) {
      localNebulas.push({
        x: (Math.random() - 0.5) * 350,
        y: (Math.random() - 0.5) * 80,
        z: (Math.random() - 0.5) * 350,
        radius: Math.random() * 180 + 120,
        color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
        speed: Math.random() * 0.0002 + 0.0001
      });
    }

    // Trails history tracking structures to draw helical spirals
    const trailsHistory: { [key: string]: { x: number; y: number; z: number }[] } = {};
    planets.forEach((p) => {
      trailsHistory[p.id] = [];
    });

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Primary loop function
    const frame = () => {
      // Big Bang entrance interpolation
      if (introProgressRef.current < 1.0) {
        introProgressRef.current += 0.015;
      }

      // Track relative simulation speed factor
      const dt = 0.014 * simSpeed;
      timeRef.current += dt;
      setUniverseAge(Math.floor(timeRef.current * 100));

      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Low-pass filter spring cameras
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      const camera = cameraRef.current;

      // Autopilot floating system rotation mechanics
      if (cameraAutopilot) {
        camera.targetYaw += camera.yawVelocity;
        camera.targetPitch = 0.85 + Math.sin(timeRef.current * 0.12) * 0.05 + mouse.y * 0.2;
      } else {
        camera.targetYaw = mouse.x * 0.6;
        camera.targetPitch = 0.85 + mouse.y * 0.4;
      }

      // Focused cinematic planet camera locks
      if (selectedPlanet) {
        camera.targetZoom = w < 768 ? 1.4 : 1.75;
      } else {
        camera.targetZoom = w < 768 ? 0.6 : 0.8;
      }

      // Smooth camera interpolation variables
      camera.yaw += (camera.targetYaw - camera.yaw) * 0.05;
      camera.pitch += (camera.targetPitch - camera.pitch) * 0.05;
      camera.zoom += (camera.targetZoom - camera.zoom) * 0.05;
      camera.focusX += (camera.targetFocusX - camera.focusX) * 0.07;
      camera.focusY += (camera.targetFocusY - camera.focusY) * 0.07;
      camera.focusZ += (camera.targetFocusZ - camera.focusZ) * 0.07;

      // Draw galactic black hole backdrop
      ctx.fillStyle = "#020205";
      ctx.fillRect(0, 0, w, h);

      // SPA 3D Projection Engine coordinates calculations
      const project = (x3d: number, y3d: number, z3d: number) => {
        // Shift based on camera anchor focus
        const dx = x3d - camera.focusX;
        const dy = y3d - camera.focusY;
        const dz = z3d - camera.focusZ;

        // Apply camera system Yaw (rotate around Y)
        const xRotYaw = dx * Math.cos(camera.yaw) - dz * Math.sin(camera.yaw);
        const zRotYaw = dx * Math.sin(camera.yaw) + dz * Math.cos(camera.yaw);

        // Apply camera system Pitch (rotate around X)
        const yRotPitch = dy * Math.cos(camera.pitch) - zRotYaw * Math.sin(camera.pitch);
        const zRotPitch = dy * Math.sin(camera.pitch) + zRotYaw * Math.cos(camera.pitch);

        const cameraDistance = 450;
        const focalLength = 390 * camera.zoom;
        const scale = focalLength / (cameraDistance + zRotPitch);

        return {
          x: cx + xRotYaw * scale,
          y: cy + yRotPitch * scale,
          depth: zRotPitch,
          scale,
        };
      };

      // Vector coordinates of traveling Core (The mini-star)
      // Moving continuously through space on elegant 3D loop!
      const core3DX = Math.sin(timeRef.current * 0.75) * 38 * introProgressRef.current;
      const core3DY = Math.cos(timeRef.current * 0.55) * 12 * introProgressRef.current;
      const core3DZ = Math.sin(timeRef.current * 0.35) * 22 * introProgressRef.current;

      // Main drawing stack for painters depth sorting
      const renderStack: Array<{
        depth: number;
        draw: () => void;
      }> = [];

      // Spawn periodic shooting stars
      if (Math.random() < 0.012 && localShootingStars.length < 3) {
        localShootingStars.push({
          x: (Math.random() - 0.5) * 450,
          y: (Math.random() - 0.5) * 250 - 150,
          z: (Math.random() - 0.5) * 450,
          vx: Math.random() * 9 + 14,
          vy: Math.random() * 5 + 4,
          vz: Math.random() * 8 - 4,
          len: Math.random() * 25 + 15,
          life: 0,
          maxLife: Math.random() * 20 + 15
        });
      }

      // Update and draw shooting stars
      localShootingStars = localShootingStars.filter(ss => {
        ss.x += ss.vx * simSpeed;
        ss.y += ss.vy * simSpeed;
        ss.z += ss.vz * simSpeed;
        ss.life += simSpeed;

        const pStart = project(ss.x, ss.y, ss.z);
        const pEnd = project(ss.x - ss.vx * 0.8, ss.y - ss.vy * 0.8, ss.z - ss.vz * 0.8);

        if (ss.life < ss.maxLife) {
          renderStack.push({
            depth: pStart.depth + 180,
            draw: () => {
              const alpha = (1 - ss.life / ss.maxLife) * 0.65;
              ctx.beginPath();
              ctx.moveTo(pStart.x, pStart.y);
              ctx.lineTo(pEnd.x, pEnd.y);
              ctx.strokeStyle = `rgba(249, 115, 22, ${alpha})`;
              ctx.lineWidth = 1.8 * pStart.scale;
              ctx.stroke();
            }
          });
          return true;
        }
        return false;
      });

      // Draw nebulas gas clouds
      if (showNebulas) {
        localNebulas.forEach((neb, idx) => {
          // Slow orbital shift
          const nAngle = timeRef.current * neb.speed + idx;
          const nx = neb.x + Math.sin(nAngle) * 35;
          const nz = neb.z + Math.cos(nAngle) * 35;

          const p = project(nx, neb.y, nz);
          renderStack.push({
            depth: p.depth + 220, // Keep in deep background
            draw: () => {
              const rad = neb.radius * p.scale * introProgressRef.current;
              if (rad <= 0) return;
              const grad = ctx.createRadialGradient(p.x, p.y, rad * 0.1, p.x, p.y, rad);
              grad.addColorStop(0, neb.color);
              grad.addColorStop(0.5, neb.color.replace("0.05", "0.02").replace("0.06", "0.02"));
              grad.addColorStop(1, "rgba(2, 2, 5, 0)");

              ctx.beginPath();
              ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
              ctx.fillStyle = grad;
              ctx.fill();
            }
          });
        });
      }

      // Draw stars
      localStars.forEach((star) => {
        // Slow star rotation
        const sAngle = Math.atan2(star.z, star.x) + star.speed * simSpeed;
        const sRadius = Math.sqrt(star.x * star.x + star.z * star.z);
        star.x = sRadius * Math.cos(sAngle);
        star.z = sRadius * Math.sin(sAngle);

        const p = project(star.x, star.y, star.z);
        if (p.x >= 0 && p.x <= w && p.y >= 0 && p.y <= h) {
          renderStack.push({
            depth: p.depth + 200, // Background layer sorting
            draw: () => {
              const pulse = 1.0 + Math.sin(timeRef.current * 1.5 + star.phase) * 0.25;
              ctx.beginPath();
              ctx.arc(p.x, p.y, star.size * p.scale * pulse * introProgressRef.current, 0, Math.PI * 2);
              ctx.fillStyle = star.color;
              ctx.fill();
            }
          });
        }
      });

      // Track positions for HTML overlays
      const livePositions: { [key: string]: { x: number; y: number; z: number } } = {};
      const localOverlays: typeof overlays = [];

      // Calculate planets coordinates
      planets.forEach((p) => {
        const radius = p.orbitRadius;
        const angle = timeRef.current * p.orbitSpeed + (planets.indexOf(p) * Math.PI * 2) / planets.length;

        // Elliptical coordinate formulas with inclined slant
        const localX = radius * Math.cos(angle) * p.eccentricity;
        const localZ = radius * Math.sin(angle) * Math.cos(p.inclination);
        const localY = radius * Math.sin(angle) * Math.sin(p.inclination);

        // Spring lag coordinates tracing the moving Core (creates beautiful helical trailing)
        const lagCoreX = Math.sin((timeRef.current - p.delay * 0.05) * 0.75) * 38 * introProgressRef.current;
        const lagCoreY = Math.cos((timeRef.current - p.delay * 0.05) * 0.55) * 12 * introProgressRef.current;
        const lagCoreZ = Math.sin((timeRef.current - p.delay * 0.05) * 0.35) * 22 * introProgressRef.current;

        const planetX = lagCoreX + localX;
        const planetY = lagCoreY + localY;
        const planetZ = lagCoreZ + localZ;

        livePositions[p.id] = { x: planetX, y: planetY, z: planetZ };

        // Save trails history
        if (showOrbitTrails) {
          const trail = trailsHistory[p.id];
          trail.push({ x: planetX, y: planetY, z: planetZ });
          if (trail.length > 50) trail.shift();
        }
      });

      // Anchor camera focus destination on focused planet or the center Core
      if (selectedPlanet) {
        const pFocused = livePositions[selectedPlanet.id];
        if (pFocused) {
          camera.targetFocusX = pFocused.x;
          camera.targetFocusY = pFocused.y;
          camera.targetFocusZ = pFocused.z;
        }
      } else {
        camera.targetFocusX = core3DX;
        camera.targetFocusY = core3DY;
        camera.targetFocusZ = core3DZ;
      }

      // Draw Orbit Trails
      if (showOrbitTrails) {
        planets.forEach((p) => {
          const trail = trailsHistory[p.id];
          if (trail.length < 2) return;

          renderStack.push({
            depth: 110,
            draw: () => {
              ctx.beginPath();
              const pStart = project(trail[0].x, trail[0].y, trail[0].z);
              ctx.moveTo(pStart.x, pStart.y);

              for (let idx = 1; idx < trail.length; idx++) {
                const node = project(trail[idx].x, trail[idx].y, trail[idx].z);
                ctx.lineTo(node.x, node.y);
              }

              const isFocus = selectedPlanet?.id === p.id;
              const isHover = hoveredPlanet?.id === p.id;

              ctx.strokeStyle = p.trailColor;
              ctx.lineWidth = (isFocus || isHover ? 2.4 : 1.0) * pStart.scale * introProgressRef.current;
              ctx.lineCap = "round";
              ctx.lineJoin = "round";
              ctx.stroke();
            }
          });
        });
      }

      // Draw technology central Core (Star Core)
      const pCore = project(core3DX, core3DY, core3DZ);
      renderStack.push({
        depth: pCore.depth,
        draw: () => {
          const coreRadius = (selectedPlanet ? 16 : 38) * pCore.scale * introProgressRef.current;
          if (coreRadius <= 0) return;

          ctx.shadowBlur = 48;
          ctx.shadowColor = "rgba(249, 115, 22, 0.4)";

          // Core Volumetric Flare Radial Multi-gradient
          const coreGrad = ctx.createRadialGradient(
            pCore.x, pCore.y, coreRadius * 0.15,
            pCore.x, pCore.y, coreRadius * 1.6
          );
          coreGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
          coreGrad.addColorStop(0.2, "rgba(249, 115, 22, 1)");
          coreGrad.addColorStop(0.5, "rgba(239, 68, 68, 0.8)");
          coreGrad.addColorStop(1, "rgba(239, 68, 68, 0)");

          ctx.beginPath();
          ctx.arc(pCore.x, pCore.y, coreRadius * 1.6, 0, Math.PI * 2);
          ctx.fillStyle = coreGrad;
          ctx.fill();

          ctx.shadowBlur = 0; // reset shadow rendering pipeline

          // Solar Corona Flares / Rays Simulation
          const numFlares = 6;
          for (let f = 0; f < numFlares; f++) {
            const fAngle = timeRef.current * 1.3 + (f * Math.PI * 2) / numFlares;
            const len = coreRadius * (1.12 + Math.sin(timeRef.current * 3.5 + f) * 0.08);
            const fx = pCore.x + Math.cos(fAngle) * len;
            const fy = pCore.y + Math.sin(fAngle) * len;

            ctx.beginPath();
            ctx.moveTo(pCore.x, pCore.y);
            ctx.lineTo(fx, fy);
            ctx.strokeStyle = `rgba(249, 115, 22, ${0.45 - f * 0.05})`;
            ctx.lineWidth = 2.4 * pCore.scale;
            ctx.stroke();
          }

          // Rotating outer ring
          ctx.beginPath();
          ctx.ellipse(pCore.x, pCore.y, coreRadius * 1.85, coreRadius * 0.4, timeRef.current * 0.15, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(249, 115, 22, 0.18)";
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      });

      // Push solar Core overlay tracking data
      localOverlays.push({
        id: "core-center",
        type: "core",
        name: selectedPlanet ? "SYSTEM FOCUS" : "ENGINEERING CORE",
        x: pCore.x,
        y: pCore.y,
        scale: pCore.scale,
        zIndex: Math.floor((100 - pCore.depth) * 2),
        opacity: selectedPlanet ? 0.25 : Math.max(0.4, Math.min(1, pCore.scale * 1.2)),
        color: "#F97316",
        active: !selectedPlanet
      });

      // Draw active connection lines
      planets.forEach((p) => {
        const pPos = livePositions[p.id];
        if (!pPos) return;

        const isFocus = selectedPlanet?.id === p.id;
        const isHover = hoveredPlanet?.id === p.id;
        const pProj = project(pPos.x, pPos.y, pPos.z);

        renderStack.push({
          depth: (pProj.depth + pCore.depth) / 2 + 5,
          draw: () => {
            ctx.beginPath();
            ctx.moveTo(pCore.x, pCore.y);
            ctx.lineTo(pProj.x, pProj.y);
            
            ctx.strokeStyle = isFocus || isHover 
              ? `rgba(249, 115, 22, ${0.4 * pProj.scale})`
              : `rgba(249, 115, 22, ${0.08 * pProj.scale})`;
            ctx.lineWidth = (isFocus || isHover ? 2.0 : 0.8) * pProj.scale * introProgressRef.current;
            ctx.stroke();

            // Traveling energy pulses
            if (isFocus || isHover || Math.sin(timeRef.current * 1.8 + planets.indexOf(p)) > 0.4) {
              const pct = (timeRef.current * 0.5) % 1.0;
              const px = pCore.x + (pProj.x - pCore.x) * pct;
              const py = pCore.y + (pProj.y - pCore.y) * pct;

              ctx.beginPath();
              ctx.arc(px, py, 2.8 * pProj.scale, 0, Math.PI * 2);
              ctx.fillStyle = p.color;
              ctx.shadowBlur = 12;
              ctx.shadowColor = p.color;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        });
      });

      // Draw inter-planetary Knowledge Graph relationship curves with animated energy pulses
      relationships.forEach((rel) => {
        const p1Pos = livePositions[rel.from];
        const p2Pos = livePositions[rel.to];
        if (!p1Pos || !p2Pos) return;

        const proj1 = project(p1Pos.x, p1Pos.y, p1Pos.z);
        const proj2 = project(p2Pos.x, p2Pos.y, p2Pos.z);

        const isP1Focused = selectedPlanet?.id === rel.from;
        const isP2Focused = selectedPlanet?.id === rel.to;
        const isP1Hovered = hoveredPlanet?.id === rel.from;
        const isP2Hovered = hoveredPlanet?.id === rel.to;

        const isHighlyActive = isP1Focused || isP2Focused || isP1Hovered || isP2Hovered;
        const isAnyPlanetSelected = !!selectedPlanet;
        const isAnyPlanetHovered = !!hoveredPlanet;

        // Determine line opacity based on relationship state
        let opacity = 0.09;
        if (isHighlyActive) {
          opacity = 0.55;
        } else if (isAnyPlanetSelected || isAnyPlanetHovered) {
          opacity = 0.02; // dim other connections
        }

        renderStack.push({
          depth: (proj1.depth + proj2.depth) / 2 + 10,
          draw: () => {
            ctx.beginPath();
            ctx.moveTo(proj1.x, proj1.y);
            
            // Draw a subtle quadratic curve using Core pull offset as control point
            const midX = (proj1.x + proj2.x) / 2;
            const midY = (proj1.y + proj2.y) / 2;
            const pullFactor = 0.15;
            const ctrlX = midX + (pCore.x - midX) * pullFactor;
            const ctrlY = midY + (pCore.y - midY) * pullFactor;

            ctx.quadraticCurveTo(ctrlX, ctrlY, proj2.x, proj2.y);

            // High glow or subtle network trace styling
            ctx.strokeStyle = isHighlyActive 
              ? "rgba(249, 115, 22, " + opacity + ")" 
              : "rgba(255, 255, 255, " + opacity + ")";
            ctx.lineWidth = (isHighlyActive ? 1.8 : 0.7) * ((proj1.scale + proj2.scale) / 2) * introProgressRef.current;
            ctx.stroke();

            // Animated traveling energy beams
            if (isHighlyActive || Math.sin(timeRef.current * 1.5 + rel.label.length) > 0.1) {
              const pulsePct = (timeRef.current * 0.45 + rel.label.length * 0.1) % 1.0;
              // Interpolated quadratic bezier position formula
              const t = pulsePct;
              const px = (1 - t) * (1 - t) * proj1.x + 2 * (1 - t) * t * ctrlX + t * t * proj2.x;
              const py = (1 - t) * (1 - t) * proj1.y + 2 * (1 - t) * t * ctrlY + t * t * proj2.y;

              ctx.beginPath();
              ctx.arc(px, py, (isHighlyActive ? 3.2 : 1.8) * ((proj1.scale + proj2.scale) / 2), 0, Math.PI * 2);
              ctx.fillStyle = isHighlyActive ? "#F97316" : "rgba(255, 255, 255, 0.75)";
              ctx.shadowBlur = isHighlyActive ? 10 : 4;
              ctx.shadowColor = "#F97316";
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        });
      });

      // Draw Orbiting planet bodies
      planets.forEach((p) => {
        const pPos = livePositions[p.id];
        if (!pPos) return;

        const isFocus = selectedPlanet?.id === p.id;
        const isHover = hoveredPlanet?.id === p.id;
        const pProj = project(pPos.x, pPos.y, pPos.z);

        renderStack.push({
          depth: pProj.depth,
          draw: () => {
            const baseSize = p.size * (isHover ? 1.35 : isFocus ? 1.25 : 1.0) * pProj.scale * introProgressRef.current;
            if (baseSize <= 0) return;

            // Draw planetary atmosphere ring
            ctx.beginPath();
            ctx.arc(pProj.x, pProj.y, baseSize * 1.6, 0, Math.PI * 2);
            ctx.strokeStyle = p.color + "28";
            ctx.lineWidth = 1.2 * pProj.scale;
            ctx.stroke();

            // High-fidelity shaded 3D planet gradient (specular focus point + dark shadow cast)
            const sphereGrad = ctx.createRadialGradient(
              pProj.x - baseSize * 0.35, pProj.y - baseSize * 0.35, baseSize * 0.08,
              pProj.x, pProj.y, baseSize
            );
            sphereGrad.addColorStop(0, "#FFFFFF"); // specular white spot
            sphereGrad.addColorStop(0.35, p.color); // planet core pigment
            sphereGrad.addColorStop(0.85, "#0d0a14"); // twilight dark transition
            sphereGrad.addColorStop(1, "#020105"); // shadow terminal block

            ctx.beginPath();
            ctx.arc(pProj.x, pProj.y, baseSize, 0, Math.PI * 2);
            ctx.fillStyle = sphereGrad;
            ctx.fill();

            // Glowing dash selector rings
            if (isHover || isFocus) {
              ctx.beginPath();
              ctx.arc(pProj.x, pProj.y, baseSize * 1.95, 0, Math.PI * 2);
              ctx.strokeStyle = p.color + "B0";
              ctx.lineWidth = 1.8 * pProj.scale;
              ctx.setLineDash([5, 5]);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }
        });

        // Planetary billing HTML Overlays
        localOverlays.push({
          id: p.id,
          type: "planet",
          name: p.name,
          x: pProj.x,
          y: pProj.y + p.size * pProj.scale + 18,
          scale: pProj.scale,
          zIndex: Math.floor((120 - pProj.depth) * 2),
          opacity: selectedPlanet && !isFocus ? 0.12 : Math.max(0.35, Math.min(1, pProj.scale * 1.15)),
          color: p.color,
          active: isFocus || (isHover && !selectedPlanet)
        });

        // Orbiting moons for selected focus planet
        if (isFocus) {
          p.moons.forEach((moon, mIdx) => {
            const mRadius = 45 + mIdx * 20;
            // Orbit calculation
            const mAngle = timeRef.current * 0.75 + (mIdx * Math.PI * 2) / p.moons.length;
            
            const mx = pPos.x + mRadius * Math.cos(mAngle);
            const mz = pPos.z + mRadius * Math.sin(mAngle) * Math.cos(0.4);
            const my = pPos.y + mRadius * Math.sin(mAngle) * Math.sin(0.4);

            const mProj = project(mx, my, mz);
            const isMoonHover = hoveredMoon?.name === moon.name;

            renderStack.push({
              depth: mProj.depth,
              draw: () => {
                const moonSize = (isMoonHover ? 8.0 : 5.0) * mProj.scale;

                // Draw moon trail orbit circle
                ctx.beginPath();
                ctx.arc(pProj.x, pProj.y, mRadius * mProj.scale, 0, Math.PI * 2);
                ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
                ctx.lineWidth = 0.8 * mProj.scale;
                ctx.stroke();

                // Small connector vector lines
                ctx.beginPath();
                ctx.moveTo(pProj.x, pProj.y);
                ctx.lineTo(mProj.x, mProj.y);
                ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
                ctx.lineWidth = 0.5 * mProj.scale;
                ctx.stroke();

                // Moon shaded body
                const moonGrad = ctx.createRadialGradient(
                  mProj.x - moonSize * 0.25, mProj.y - moonSize * 0.25, moonSize * 0.05,
                  mProj.x, mProj.y, moonSize
                );
                moonGrad.addColorStop(0, "#FFFFFF");
                moonGrad.addColorStop(0.45, p.color);
                moonGrad.addColorStop(1, "#020105");

                ctx.beginPath();
                ctx.arc(mProj.x, mProj.y, moonSize, 0, Math.PI * 2);
                ctx.fillStyle = moonGrad;
                ctx.fill();

                if (isMoonHover) {
                  ctx.beginPath();
                  ctx.arc(mProj.x, mProj.y, moonSize * 1.85, 0, Math.PI * 2);
                  ctx.strokeStyle = p.color;
                  ctx.lineWidth = 1.2 * mProj.scale;
                  ctx.stroke();
                }
              }
            });

            // Moon labels overlays
            localOverlays.push({
              id: `${p.id}-moon-${mIdx}`,
              type: "moon",
              name: moon.name,
              x: mProj.x,
              y: mProj.y + 12,
              scale: mProj.scale,
              zIndex: Math.floor((130 - mProj.depth) * 2),
              opacity: hoveredMoon && !isMoonHover ? 0.3 : Math.max(0.4, Math.min(1, mProj.scale * 1.12)),
              color: p.color,
              active: isMoonHover,
              refObject: moon
            });
          });
        }
      });

      // Painter sorting
      renderStack.sort((a, b) => b.depth - a.depth);
      renderStack.forEach((node) => node.draw());

      setOverlays(localOverlays);
      requestRef.current = requestAnimationFrame(frame);
    };

    frame();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [selectedPlanet, hoveredPlanet, hoveredMoon, simSpeed, showOrbitTrails, showNebulas, cameraAutopilot]);

  // Click handler to select planet
  const handlePlanetClick = (p: Planet) => {
    if (selectedPlanet?.id === p.id) {
      setSelectedPlanet(null);
      setHoveredMoon(null);
    } else {
      setSelectedPlanet(p);
      setHoveredPlanet(null);
      setHoveredMoon(null);
    }
  };

  // Mouse Drag Camera Orbits Handling
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setCameraAutopilot(false); // Disable autopilot on manual override drag
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    cameraRef.current.targetYaw += dx * 0.005;
    cameraRef.current.targetPitch = Math.max(
      0.15,
      Math.min(Math.PI / 2 - 0.05, cameraRef.current.targetPitch - dy * 0.005)
    );

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Wheel zoom controls
  const handleWheel = (e: React.WheelEvent) => {
    cameraRef.current.targetZoom = Math.max(
      0.35,
      Math.min(2.5, cameraRef.current.targetZoom - e.deltaY * 0.001)
    );
  };

  const resetCamera = () => {
    setSelectedPlanet(null);
    setHoveredMoon(null);
    cameraRef.current.targetYaw = 0;
    cameraRef.current.targetPitch = 0.85;
    cameraRef.current.targetZoom = 0.8;
    setCameraAutopilot(true);
  };

  const activePlanet = selectedPlanet || hoveredPlanet || planets[0];

  return (
    <div 
      className="dark fixed inset-0 w-screen h-screen z-[200] bg-[#020205] text-white overflow-hidden flex flex-col justify-between"
      onWheel={handleWheel}
    >
      {/* 3D Cosmic Space Canvas backplane */}
      <canvas 
        ref={canvasRef} 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="absolute inset-0 w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Interactive Billboarding HTML elements mapped to 3D projected coordinates */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {overlays.map((overlay) => {
          const style = {
            transform: `translate3d(${overlay.x}px, ${overlay.y}px, 0) translate(-50%, -50%) scale(${overlay.scale})`,
            zIndex: overlay.zIndex,
            opacity: overlay.opacity,
          };

          if (overlay.type === "core") {
            if (!overlay.active) return null;
            return (
              <div
                key={overlay.id}
                style={style}
                className="absolute px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full font-mono text-[8px] text-orange-400 font-extrabold tracking-widest uppercase shadow-xl backdrop-blur-md"
              >
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping inline-block mr-1.5 align-middle" />
                {overlay.name}
              </div>
            );
          }

          if (overlay.type === "planet") {
            const isSelected = selectedPlanet?.id === overlay.id;
            const isHovered = hoveredPlanet?.id === overlay.id;
            const isActive = isSelected || isHovered;

            return (
              <button
                key={overlay.id}
                style={style}
                onMouseEnter={() => {
                  if (!selectedPlanet) {
                    const p = planets.find((item) => item.id === overlay.id);
                    if (p) setHoveredPlanet(p);
                  }
                }}
                onMouseLeave={() => {
                  if (!selectedPlanet) setHoveredPlanet(null);
                }}
                onClick={() => {
                  const p = planets.find((item) => item.id === overlay.id);
                  if (p) handlePlanetClick(p);
                }}
                className={`absolute px-4 py-2 rounded-2xl font-mono text-[10px] font-bold tracking-wider pointer-events-auto whitespace-nowrap transition-all duration-300 cursor-pointer shadow-2xl border backdrop-blur-md flex items-center gap-2 ${
                  isActive
                    ? "bg-white text-black border-white scale-110"
                    : "bg-zinc-950/80 text-white border-white/10 hover:border-orange-500"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block shrink-0 shadow-md"
                  style={{ backgroundColor: overlay.color }}
                />
                <span>{overlay.name}</span>
                {isSelected && <Maximize2 size={9} className="text-orange-500 ml-0.5 animate-pulse" />}
              </button>
            );
          }

          if (overlay.type === "moon") {
            const isHovered = hoveredMoon?.name === overlay.name;
            return (
              <button
                key={overlay.id}
                style={style}
                onMouseEnter={() => setHoveredMoon(overlay.refObject)}
                onMouseLeave={() => setHoveredMoon(null)}
                className={`absolute px-2.5 py-1.5 rounded-xl font-sans text-[9px] font-semibold tracking-wide pointer-events-auto whitespace-nowrap transition-all duration-300 cursor-pointer border shadow-lg backdrop-blur-md ${
                  isHovered
                    ? "bg-orange-500 text-white border-orange-400 scale-110 z-50 shadow-orange-500/30"
                    : "bg-zinc-900/90 text-white/80 border-white/5 hover:border-orange-400"
                }`}
              >
                {overlay.name}
              </button>
            );
          }

          return null;
        })}
      </div>

      {/* TOP HEADER: Immersive Navbar HUD */}
      <div className="z-10 relative flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#020205] to-transparent pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-white/20 bg-black/40 rounded-xl flex items-center justify-center font-bold text-white text-sm">
            KB
          </div>
          <div>
            <h1 className="font-sans text-[11px] font-black tracking-[0.25em] text-white uppercase leading-none mb-1">
              TECHNOLOGY GALAXY
            </h1>
            <p className="font-mono text-[8px] text-white/40 tracking-wider">
              PORTFOLIO IMMERSIVE ENGINE V1.2 • HYPERION PHYSICS
            </p>
          </div>
        </div>

        {/* Exit & Return action buttons */}
        <button
          onClick={onClose}
          className="pointer-events-auto px-5 py-2.5 bg-white text-black hover:bg-orange-500 hover:text-white rounded-2xl font-mono text-[10px] uppercase tracking-widest font-black flex items-center gap-2 shadow-2xl transition-all hover:-translate-y-0.5 duration-300 cursor-pointer border border-white/15"
        >
          <ArrowLeft size={11} />
          Return to Portfolio
        </button>
      </div>

      {/* MAIN SYSTEM DASHBOARD PANEL: Split Screen HUD Layout */}
      <div className="flex-1 flex flex-col lg:flex-row justify-between items-stretch px-6 lg:px-8 gap-6 z-10 relative pointer-events-none">
        
        {/* LEFT COLUMN: Astronomical Interactive Console Controller */}
        <div className="w-full lg:w-[260px] self-center flex flex-col gap-4 bg-zinc-950/70 border border-white/5 p-5 rounded-3xl backdrop-blur-md pointer-events-auto shadow-2xl transition-all">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5 text-orange-500">
            <Sliders size={13} />
            <span className="font-mono text-[10px] uppercase tracking-widest font-black">Simulation Dials</span>
          </div>

          {/* Autopilot Controller */}
          <div className="space-y-1.5">
            <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest block">Cam Orbit Mode</span>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5">
              <button
                onClick={() => setCameraAutopilot(true)}
                className={`py-1 rounded-lg text-center font-mono text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  cameraAutopilot 
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" 
                    : "text-white/40 hover:text-white"
                }`}
              >
                Autopilot
              </button>
              <button
                onClick={() => setCameraAutopilot(false)}
                className={`py-1 rounded-lg text-center font-mono text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  !cameraAutopilot 
                    ? "bg-orange-500 text-white shadow-md" 
                    : "text-white/40 hover:text-white"
                }`}
              >
                Manual Drag
              </button>
            </div>
          </div>

          {/* Warp Velocity speeds */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[8px] font-mono text-white/30 uppercase tracking-widest">
              <span>Warp Speed</span>
              <span className="text-orange-500 font-extrabold">{simSpeed.toFixed(1)}x</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSimSpeed(prev => Math.max(0.1, prev - 0.25))}
                className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center border border-white/5 cursor-pointer text-white"
              >
                <ZoomOut size={10} />
              </button>
              <input 
                type="range"
                min="0.1"
                max="2.5"
                step="0.1"
                value={simSpeed}
                onChange={(e) => setSimSpeed(parseFloat(e.target.value))}
                className="flex-1 accent-orange-500 h-[3px] bg-white/10 rounded-lg cursor-pointer"
              />
              <button 
                onClick={() => setSimSpeed(prev => Math.min(2.5, prev + 0.25))}
                className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center border border-white/5 cursor-pointer text-white"
              >
                <ZoomIn size={10} />
              </button>
            </div>
          </div>

          {/* Render Layers Toggles */}
          <div className="space-y-2 pt-1.5 border-t border-white/5">
            <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest block mb-1">Visual Layers</span>
            
            <label className="flex items-center justify-between cursor-pointer group text-xs text-white/60 hover:text-white font-sans font-medium">
              <span>Orbit Trace Lines</span>
              <input 
                type="checkbox"
                checked={showOrbitTrails}
                onChange={(e) => setShowOrbitTrails(e.target.checked)}
                className="rounded accent-orange-500 bg-zinc-900 border-white/15 w-3.5 h-3.5"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer group text-xs text-white/60 hover:text-white font-sans font-medium">
              <span>Cosmic Nebulas</span>
              <input 
                type="checkbox"
                checked={showNebulas}
                onChange={(e) => setShowNebulas(e.target.checked)}
                className="rounded accent-orange-500 bg-zinc-900 border-white/15 w-3.5 h-3.5"
              />
            </label>
          </div>

          {/* System Control actions */}
          <div className="pt-3 border-t border-white/5 flex gap-2">
            <button
              onClick={resetCamera}
              className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-mono text-[9px] uppercase tracking-wider font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/5"
            >
              <RotateCcw size={10} />
              Reset Focal
            </button>
          </div>
        </div>

        {/* MIDDLE: Hidden spacer or focus details */}
        <div className="flex-1 min-h-[50px] lg:min-h-0 pointer-events-none" />

        {/* RIGHT COLUMN: Stellar Information Dossier Panel */}
        <div className="w-full lg:w-[350px] self-center pointer-events-auto">
          <AnimatePresence mode="wait">
            {activePlanet && (
              <motion.div
                key={activePlanet.id + (hoveredMoon ? `-${hoveredMoon.name}` : "-planet-dossier")}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-zinc-950/70 border border-white/5 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl backdrop-blur-md flex flex-col justify-between"
              >
                {/* Dossier Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full inline-block animate-pulse"
                      style={{ backgroundColor: activePlanet.color }}
                    />
                    <span className="px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded-md text-[8px] font-mono uppercase tracking-widest text-orange-400 font-bold">
                      {hoveredMoon ? "Orbital Tech Satellite" : "Primary Galaxy Planet"}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-white/30">
                    AGE: <span className="text-orange-400 font-black">{universeAge} Gyrs</span>
                  </span>
                </div>

                {/* Main Node Titles */}
                <div>
                  <h3 className="font-sans font-black text-2xl sm:text-3xl tracking-tight text-white leading-tight flex items-center gap-2">
                    {hoveredMoon ? hoveredMoon.name : activePlanet.name}
                    <Sparkles size={16} className="text-orange-400 shrink-0" />
                  </h3>
                  <div className="mt-1 font-mono text-[9px] text-white/40 uppercase tracking-widest">
                    Category Proficiency Level: <span className="text-orange-400 font-extrabold">{hoveredMoon ? hoveredMoon.level : activePlanet.experience}</span>
                  </div>
                </div>

                {/* If planet is selected, show custom visual tab switcher! */}
                {selectedPlanet && !hoveredMoon && (
                  <div className="flex border-b border-white/5 pb-1 gap-1 overflow-x-auto select-none">
                    {(["specs", "arch", "timeline", "repos"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-2 py-1 font-mono text-[8px] uppercase tracking-wider rounded-md font-bold transition-all border shrink-0 cursor-pointer ${
                          activeTab === tab
                            ? "bg-orange-500 text-white border-orange-400"
                            : "bg-white/5 text-white/50 border-transparent hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {tab === "specs" ? "Moons" : tab === "arch" ? "Architecture" : tab === "timeline" ? "Timeline" : "GitHub & Certs"}
                      </button>
                    ))}
                  </div>
                )}

                {/* Description paragraphs */}
                {(!selectedPlanet || hoveredMoon || activeTab === "specs") && (
                  <p className="font-sans text-xs text-white/70 leading-relaxed min-h-[50px]">
                    {hoveredMoon ? hoveredMoon.description : activePlanet.description}
                  </p>
                )}

                {/* SPECIFICATIONS AND SATELLITE MOONS TAB */}
                {(!selectedPlanet || hoveredMoon || activeTab === "specs") && (
                  <>
                    {/* Orbit Satellites Moons details */}
                    {!hoveredMoon && (
                      <div className="space-y-2">
                        <span className="block font-mono text-[8px] text-white/30 uppercase tracking-widest">
                          Satellite Moons {selectedPlanet ? "(Click to Freeze)" : "(Click Planet to Zoom)"}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {activePlanet.moons.map((m) => (
                            <span
                              key={m.name}
                              onClick={() => {
                                if (selectedPlanet) setHoveredMoon(m);
                              }}
                              className={`px-2 py-0.5 text-[9px] font-mono rounded-lg border transition-all duration-300 cursor-pointer ${
                                hoveredMoon?.name === m.name
                                  ? "bg-orange-500 text-white border-orange-400"
                                  : "bg-white/5 text-white/70 border-white/5 hover:border-orange-500/30"
                              }`}
                            >
                              {m.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Verifiable Integrations projects cards */}
                    <div className="space-y-1.5">
                      <span className="block font-mono text-[8px] text-white/30 uppercase tracking-widest">
                        Mission Deployments
                      </span>
                      <div className="p-3 bg-black/40 border border-white/5 rounded-2xl flex items-start gap-3">
                        <div className="p-2 bg-white/5 border border-white/5 rounded-xl text-orange-400 shrink-0">
                          <Terminal size={12} />
                        </div>
                        <div>
                          <span className="block font-sans text-[10px] text-white/80 font-bold">
                            {hoveredMoon ? "Feature Implementation" : "System Integration"}
                          </span>
                          <span className="block font-sans text-[10px] text-white/50 leading-relaxed font-medium">
                            {hoveredMoon ? hoveredMoon.projects : activePlanet.projects}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ARCHITECTURE BLUEPRINT TAB */}
                {selectedPlanet && !hoveredMoon && activeTab === "arch" && (
                  <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/5 font-mono text-[10px]">
                    <div className="text-[8px] text-white/40 uppercase tracking-widest pb-1 border-b border-white/5 flex items-center justify-between">
                      <span>Active Stack Flow Pipeline</span>
                      <span className="text-orange-500 animate-pulse">● Live Engine</span>
                    </div>
                    <div className="flex flex-col gap-2.5 pt-1.5">
                      {activePlanet.architecture.map((node, nIdx) => (
                        <div key={nIdx} className="flex flex-col gap-1 items-center bg-white/5 p-2.5 rounded-xl border border-white/5 relative overflow-hidden group">
                          <div className="absolute top-0 left-0 w-[2px] h-full bg-orange-500" />
                          <div className="flex justify-between items-center w-full text-white/95 font-bold text-[9px] tracking-wide">
                            <span className="text-white">{node.source}</span>
                            <span className="text-orange-400 text-[8px]">──▶</span>
                            <span className="text-orange-300">{node.target}</span>
                          </div>
                          <div className="w-full text-left text-[8px] text-white/40 uppercase tracking-wider mt-0.5">
                            Stream Type: <span className="text-white/60 font-semibold">{node.relation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TIMELINE TAB */}
                {selectedPlanet && !hoveredMoon && activeTab === "timeline" && (
                  <div className="space-y-4 bg-black/40 p-4 rounded-2xl border border-white/5 font-sans">
                    <div className="text-[8px] font-mono text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                      Deployment Milestones Timeline
                    </div>
                    <div className="relative pl-3 border-l border-orange-500/30 space-y-4 pt-1.5 ml-1">
                      {activePlanet.timeline.map((item, tIdx) => (
                        <div key={tIdx} className="relative group">
                          <div className="absolute -left-[16px] top-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 border border-[#020205] shadow shadow-orange-500/50" />
                          <div className="font-mono text-[9px] text-orange-400 font-extrabold leading-none">{item.year}</div>
                          <div className="text-[10px] text-white/80 font-medium leading-relaxed mt-1">{item.milestone}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* REPOSITORIES & CERTS TAB */}
                {selectedPlanet && !hoveredMoon && activeTab === "repos" && (
                  <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                    {/* GitHub Repos */}
                    <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-white/5">
                      <div className="text-[8px] font-mono text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                        Verified Repositories
                      </div>
                      <div className="space-y-2 pt-1">
                        {activePlanet.repos.map((repo, rIdx) => (
                          <div key={rIdx} className="flex flex-col gap-1 p-2 bg-white/5 rounded-lg border border-white/5 transition-all">
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-[10px] font-bold text-orange-400">{repo.name}</span>
                              <span className="flex items-center gap-0.5 font-mono text-[8px] text-white/50">
                                ★ {repo.stars}
                              </span>
                            </div>
                            <p className="text-[9px] text-white/60 leading-normal">{repo.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Certs list */}
                    <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-white/5">
                      <div className="text-[8px] font-mono text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                        Stellar Certifications
                      </div>
                      <div className="space-y-1.5 pt-1">
                        {activePlanet.certs.map((cert, cIdx) => (
                          <div key={cIdx} className="flex items-center gap-2 p-1.5 bg-white/5 rounded-lg border border-white/5">
                            <div className="w-4 h-4 bg-orange-500/10 border border-orange-500/20 rounded-md flex items-center justify-center text-orange-400 text-[8px] shrink-0 font-bold">
                              ✓
                            </div>
                            <div>
                              <div className="text-[9px] text-white/90 font-bold leading-tight">{cert.name}</div>
                              <div className="text-[7px] font-mono text-white/40 uppercase leading-none">{cert.issuer}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer specs details */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-white/30 uppercase">
                  <span className="flex items-center gap-1">
                    <Compass size={11} className="text-orange-500 animate-spin" />
                    Physics: Elliptical Plane
                  </span>
                  <span>Dist: {hoveredMoon ? "Orbiting Moon" : `${activePlanet.orbitRadius} AU`}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM FOOTER STATUS BAR */}
      <div className="z-10 relative flex items-center justify-between px-6 py-3 border-t border-white/5 bg-[#020205] text-[9px] font-mono text-white/30 uppercase tracking-widest pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span>Status: System Aligned</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>Camera Zoom: {cameraRef.current.zoom.toFixed(2)}x</span>
          <span>Stellar Stars: [450]</span>
          <span>Tilt: {cameraRef.current.pitch.toFixed(2)} rad</span>
        </div>
        <div>
          <span>Kumaraswamy B. Ecosystem</span>
        </div>
      </div>
    </div>
  );
}
