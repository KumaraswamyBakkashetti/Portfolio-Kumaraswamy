import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Terminal, Code2, Cpu, ArrowLeft, Maximize2, Minimize2, Check, ExternalLink } from "lucide-react";

interface Moon {
  name: string;
  description: string;
  level: string;
  projects: string;
}

interface Planet {
  id: string;
  name: string;
  size: number;
  color: string;
  trailColor: string;
  orbitRadius: number;
  orbitSpeed: number;
  inclination: number; // orbital plane inclination (radians)
  delay: number; // spring delay (seconds / frames lag)
  description: string;
  experience: string;
  projects: string;
  moons: Moon[];
}

export default function SkillsConstellation() {
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [hoveredMoon, setHoveredMoon] = useState<Moon | null>(null);
  
  const [time, setTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  // Interaction vectors
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const cameraRef = useRef({
    yaw: 0,
    pitch: 0.9,
    zoom: 1.0,
    targetYaw: 0,
    targetPitch: 0.9,
    targetZoom: 1.0,
    focusX: 0,
    focusY: 0,
    focusZ: 0,
    targetFocusX: 0,
    targetFocusY: 0,
    targetFocusZ: 0,
  });

  // Track dynamic positions for HTML overlays
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
      id: "ai-ml",
      name: "AI & ML Core",
      size: 16,
      color: "#F97316", // Orange
      trailColor: "rgba(249, 115, 22, 0.3)",
      orbitRadius: 90,
      orbitSpeed: 0.28,
      inclination: 0.15,
      delay: 4,
      experience: "Expertise",
      description: "Architecting autonomous agents, secure retrieval-augmented generation pipelines, and predictive analytical forecasting.",
      projects: "Cognitive Analyst, Medical RAG Query Engine, Dynamic Routing Vector Gateways",
      moons: [
        { name: "RAG Platforms", description: "Semantic vector retrieval, chunk chunking partition, query expansion, and indices tuning.", level: "Expert", projects: "Secure AI Doc Search" },
        { name: "LLM Orchestration", description: "Prompt flow pipelines, JSON schema outputs, defensive safety filters, and functional calling.", level: "Expert", projects: "Deterministic AI Agents" },
        { name: "Multi-Agent Systems", description: "Stateful task breakdown, asynchronous inter-agent communications, and state machine lattices.", level: "Advanced", projects: "Automated Tech Analyst" },
        { name: "LangChain", description: "Memory chain architectures, document parsers, and custom tool binding wrappers.", level: "Advanced", projects: "Enterprise Bot Integrator" },
        { name: "XGBoost", description: "Gradient boosting algorithms, supervised tabular data regressions, and feature optimizations.", level: "Advanced", projects: "Churn Forecasting Portal" }
      ]
    },
    {
      id: "backend",
      name: "Backend Engine",
      size: 14,
      color: "#10B981", // Emerald Green
      trailColor: "rgba(16, 185, 129, 0.3)",
      orbitRadius: 140,
      orbitSpeed: 0.22,
      inclination: -0.2,
      delay: 8,
      experience: "Expertise",
      description: "Developing robust asynchronous REST APIs, proxy routers, message stream brokers, and highly performant server architectures.",
      projects: "FastAPI Analytical Endpoint, Real-Time WebSockets Engine, Token Auth Interceptor",
      moons: [
        { name: "FastAPI", description: "Async backend endpoints, automatic Swagger/OpenAPI typing validation, and performance routers.", level: "Expert", projects: "Telemetry Analytics Core" },
        { name: "Node.js", description: "Event-driven server engines, binary stream pipelines, and robust platform modules.", level: "Expert", projects: "Micro-Service Orchestrator" },
        { name: "Express", description: "API request routers, proxy middlewares, session verification rules, and static hosts.", level: "Expert", projects: "Full-Stack Server Gateway" },
        { name: "REST APIs", description: "Design patterns for highly legible URL systems, resource schemas, and structured error responses.", level: "Expert", projects: "Omnichannel Data Contract" }
      ]
    },
    {
      id: "frontend",
      name: "Frontend UI",
      size: 13,
      color: "#06B6D4", // Cyan
      trailColor: "rgba(6, 182, 212, 0.3)",
      orbitRadius: 185,
      orbitSpeed: 0.17,
      inclination: 0.28,
      delay: 12,
      experience: "Expertise",
      description: "Designing high-fidelity, silky smooth interactive interfaces with custom canvas elements and parallax designs.",
      projects: "Fluid Portfolio Hub, Interactive Timeline Ledger, Real-time Graph Visualizer",
      moons: [
        { name: "React", description: "Component state trees, hooks lifecycle patterns, performance memoization, and fiber renderings.", level: "Expert", projects: "Enterprise Solar Interface" },
        { name: "TypeScript", description: "Strict type-safe interface contracts, complex generic utilities, and type assertion guards.", level: "Expert", projects: "Type-Contract UI Architecture" },
        { name: "Tailwind CSS", description: "Responsive layouts, utility configurations, custom design tokens, and fluid typography grids.", level: "Expert", projects: "Modern Portfolio System" },
        { name: "Motion", description: "Fluid physical animations, interactive gestures tracking, layout morphings, and curtain sweeps.", level: "Expert", projects: "Cinematic Transitions System" }
      ]
    },
    {
      id: "databases",
      name: "Database System",
      size: 12,
      color: "#6366F1", // Indigo
      trailColor: "rgba(99, 102, 241, 0.3)",
      orbitRadius: 230,
      orbitSpeed: 0.13,
      inclination: -0.12,
      delay: 16,
      experience: "Expertise",
      description: "Structuring optimized transactional schemas, relational indices, document aggregations, and high-speed local caches.",
      projects: "Ledger Accounts Directory, Vector Index Store, Embedded Offline Storage Engine",
      moons: [
        { name: "PostgreSQL", description: "Transactional atomicity, table indices optimization, jsonb formats, and vector search modules.", level: "Expert", projects: "Vector DB Storage Ledger" },
        { name: "SQL", description: "Highly complex queries optimization, explain plan assessments, analytical aggregates, and joins.", level: "Expert", projects: "Advanced BI Dashboard Queries" },
        { name: "MongoDB", description: "NoSQL document collections, aggregation pipelines, clustered keys, and schema-free storages.", level: "Expert", projects: "User Profile Storehouse" },
        { name: "SQLite", description: "Local disk database caching, embedded fast testing setups, and zero-config local records.", level: "Advanced", projects: "Client Local Sync State" }
      ]
    },
    {
      id: "infrastructure",
      name: "DevOps & Systems",
      size: 11,
      color: "#EAB308", // Yellow
      trailColor: "rgba(234, 179, 8, 0.3)",
      orbitRadius: 275,
      orbitSpeed: 0.1,
      inclination: 0.22,
      delay: 20,
      experience: "Advanced",
      description: "Docker virtualization containerization, repository workflow pipelines, and custom operating system shell automations.",
      projects: "Isolated Sandboxed Server Compose, Automated CI Validation Webhook, Daemon Log Scraper",
      moons: [
        { name: "Docker", description: "Service virtualization container build, isolated dependencies management, and multi-node compose runs.", level: "Advanced", projects: "Isolated Developer Sandboxes" },
        { name: "Git", description: "Trunk-based workflow branches, complex rebase histories, release tag configurations, and version controls.", level: "Expert", projects: "Team-Wide Repo Orchestrations" },
        { name: "Linux Systems", description: "Bash shell command automations, daemon service bindings, secure POSIX permission schemes, and configurations.", level: "Advanced", projects: "Self-Healing Server Scripts" }
      ]
    },
    {
      id: "testing",
      name: "API Orchestration",
      size: 10,
      color: "#EC4899", // Pink
      trailColor: "rgba(236, 72, 153, 0.3)",
      orbitRadius: 315,
      orbitSpeed: 0.08,
      inclination: -0.18,
      delay: 24,
      experience: "Expertise",
      description: "Asserting integration contracts, designing event structures, and validating system integrity frameworks.",
      projects: "Contract Testing Pipeline, Webhook Payload Certifier, Automated Suite Assertions",
      moons: [
        { name: "Postman", description: "Automated test suites collections, mock environment variables, and pre-request scripts.", level: "Expert", projects: "Continuous API Health Monitor" },
        { name: "Webhooks", description: "Designing secure asynchronous callbacks, payload crypto signing, and retry queue engines.", level: "Expert", projects: "Event-Driven Ledger Dispatcher" },
        { name: "JSON Schema", description: "Draft standard structural validations, request payload verification templates, and auto-parsers.", level: "Expert", projects: "Request Interceptor Guard" }
      ]
    }
  ];

  // Mouse interactivity tracking
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

  // Primary WebGL-style Canvas Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let localTime = 0;
    let stars: { x: number; y: number; z: number; size: number; color: string; speed: number }[] = [];
    let shootingStars: { x: number; y: number; z: number; vx: number; vy: number; vz: number; len: number; life: number; maxLife: number }[] = [];

    // Pre-generate stellar backdrop particles with depth
    for (let i = 0; i < 280; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 320 + 20;
      stars.push({
        x: r * Math.cos(angle),
        y: (Math.random() - 0.5) * 120,
        z: r * Math.sin(angle),
        size: Math.random() * 1.6 + 0.4,
        color: Math.random() > 0.85 
          ? `rgba(249, 115, 22, ${Math.random() * 0.4 + 0.2})` // Golden nebula stars
          : `rgba(${220 + Math.random() * 35}, ${220 + Math.random() * 35}, ${255}, ${Math.random() * 0.5 + 0.15})`, // Distant blue-white giants
        speed: (Math.random() * 0.0008 + 0.0002) * (Math.random() > 0.5 ? 1 : -1)
      });
    }

    // Dynamic Trail Tracking Structure
    const planetTrails: { [key: string]: { x: number; y: number; z: number }[] } = {};
    planets.forEach(p => {
      planetTrails[p.id] = [];
    });

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Dynamic rendering function with 3D sorting and interactive focus camera
    const loop = () => {
      localTime += 0.016;
      setTime(localTime);

      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Low-pass filter spring equations for interactive camera controls
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const camera = cameraRef.current;
      
      // Auto orbiting system rotation plus user mouse interaction offsets
      camera.targetYaw = localTime * 0.06 + mouse.x * 0.4;
      camera.targetPitch = 0.85 + Math.sin(localTime * 0.15) * 0.06 + mouse.y * 0.3;

      // Handle zooming and focus locks
      if (selectedPlanet) {
        camera.targetZoom = w < 768 ? 1.5 : 1.9; // Zoom in to focus planet
      } else {
        camera.targetZoom = w < 768 ? 0.65 : 0.95; // Wide planetary view
      }

      // Interpolate camera variables smoothly
      camera.yaw += (camera.targetYaw - camera.yaw) * 0.06;
      camera.pitch += (camera.targetPitch - camera.pitch) * 0.06;
      camera.zoom += (camera.targetZoom - camera.zoom) * 0.06;
      camera.focusX += (camera.targetFocusX - camera.focusX) * 0.08;
      camera.focusY += (camera.targetFocusY - camera.focusY) * 0.08;
      camera.focusZ += (camera.targetFocusZ - camera.focusZ) * 0.08;

      // Render cosmic background nebula glows
      const isLightMode = false;
      
      // Nebula backing gradient
      const nebulaGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(w, h) * 0.8);
      if (isLightMode) {
        nebulaGlow.addColorStop(0, "rgba(249, 115, 22, 0.06)");
        nebulaGlow.addColorStop(0.5, "rgba(99, 102, 241, 0.02)");
        nebulaGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
      } else {
        nebulaGlow.addColorStop(0, "rgba(249, 115, 22, 0.09)");
        nebulaGlow.addColorStop(0.4, "rgba(99, 102, 241, 0.03)");
        nebulaGlow.addColorStop(1, "rgba(5, 5, 5, 0)");
      }
      ctx.fillStyle = nebulaGlow;
      ctx.fillRect(0, 0, w, h);

      // Spawn periodic shooting stars
      if (Math.random() < 0.008 && shootingStars.length < 3) {
        shootingStars.push({
          x: (Math.random() - 0.5) * 400,
          y: (Math.random() - 0.5) * 200 - 150,
          z: (Math.random() - 0.5) * 400,
          vx: Math.random() * 8 + 12,
          vy: Math.random() * 6 + 4,
          vz: Math.random() * 8 - 4,
          len: Math.random() * 20 + 15,
          life: 0,
          maxLife: Math.random() * 25 + 15
        });
      }

      // Projection mathematics (3D vector coordinates to responsive screen coordinates)
      const project = (x3d: number, y3d: number, z3d: number) => {
        // Shift target coordinates based on camera focal focus point
        const dx = x3d - camera.focusX;
        const dy = y3d - camera.focusY;
        const dz = z3d - camera.focusZ;

        // Apply camera system Yaw rotation (Y-axis)
        const xRotYaw = dx * Math.cos(camera.yaw) - dz * Math.sin(camera.yaw);
        const zRotYaw = dx * Math.sin(camera.yaw) + dz * Math.cos(camera.yaw);

        // Apply camera system Pitch rotation (X-axis)
        const yRotPitch = dy * Math.cos(camera.pitch) - zRotYaw * Math.sin(camera.pitch);
        const zRotPitch = dy * Math.sin(camera.pitch) + zRotYaw * Math.cos(camera.pitch);

        const cameraDistance = 420;
        const focalLength = 380 * camera.zoom;
        const scale = focalLength / (cameraDistance + zRotPitch);

        return {
          x: cx + xRotYaw * scale,
          y: cy + yRotPitch * scale,
          depth: zRotPitch,
          scale,
        };
      };

      // Vector equations of traveling central Core (Sun)
      // Standard helix physics: The center node is not stationary, it travels on an elegant 3D loop!
      const core3DX = Math.sin(localTime * 0.95) * 28;
      const core3DY = Math.cos(localTime * 0.7) * 10;
      const core3DZ = Math.sin(localTime * 0.5) * 18;

      // Track current render stack with depth values for accurate 3D layer sorting
      const renderStack: Array<{
        depth: number;
        draw: () => void;
      }> = [];

      // Update and draw shooting stars backdrop
      shootingStars = shootingStars.filter(ss => {
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.z += ss.vz;
        ss.life++;

        const pStart = project(ss.x, ss.y, ss.z);
        const pEnd = project(ss.x - ss.vx * 0.8, ss.y - ss.vy * 0.8, ss.z - ss.vz * 0.8);

        if (ss.life < ss.maxLife) {
          renderStack.push({
            depth: pStart.depth + 150, // Back rendering layers
            draw: () => {
              const alpha = (1 - ss.life / ss.maxLife) * 0.5;
              ctx.beginPath();
              ctx.moveTo(pStart.x, pStart.y);
              ctx.lineTo(pEnd.x, pEnd.y);
              ctx.strokeStyle = `rgba(249, 115, 22, ${alpha})`;
              ctx.lineWidth = 1.5 * pStart.scale;
              ctx.stroke();
            }
          });
          return true;
        }
        return false;
      });

      // Distant stars with dynamic parallax
      stars.forEach((star) => {
        // Star rotational drift
        const starAngle = Math.atan2(star.z, star.x) + star.speed;
        const starRadius = Math.sqrt(star.x * star.x + star.z * star.z);
        star.x = starRadius * Math.cos(starAngle);
        star.z = starRadius * Math.sin(starAngle);

        const p = project(star.x, star.y, star.z);
        if (p.x >= 0 && p.x <= w && p.y >= 0 && p.y <= h) {
          renderStack.push({
            depth: p.depth + 180, // Far background layer sorting
            draw: () => {
              ctx.beginPath();
              ctx.arc(p.x, p.y, star.size * p.scale, 0, Math.PI * 2);
              ctx.fillStyle = star.color;
              ctx.fill();
            }
          });
        }
      });

      // Calculate dynamic positions of each planet
      const livePositions: { [key: string]: { x: number; y: number; z: number } } = {};
      const localOverlays: typeof overlays = [];

      planets.forEach((p) => {
        const radius = p.orbitRadius;
        
        // Orbital trajectory mathematics around traveling Core
        const angle = localTime * p.orbitSpeed + (planets.indexOf(p) * Math.PI * 2) / planets.length;
        
        // Circular orbit on tilted plane
        const localX = radius * Math.cos(angle);
        const localZ = radius * Math.sin(angle) * Math.cos(p.inclination);
        const localY = radius * Math.sin(angle) * Math.sin(p.inclination);

        // Core lag spring offsets creating helical vortex physics
        const tOffset = p.delay;
        const lagCoreX = Math.sin((localTime - tOffset * 0.05) * 0.95) * 28;
        const lagCoreY = Math.cos((localTime - tOffset * 0.05) * 0.7) * 10;
        const lagCoreZ = Math.sin((localTime - tOffset * 0.05) * 0.5) * 18;

        const planetX = lagCoreX + localX;
        const planetY = lagCoreY + localY;
        const planetZ = lagCoreZ + localZ;

        livePositions[p.id] = { x: planetX, y: planetY, z: planetZ };

        // Save orbital coordinates trail history
        const trail = planetTrails[p.id];
        trail.push({ x: planetX, y: planetY, z: planetZ });
        if (trail.length > 35) trail.shift();
      });

      // Set focused planet camera targets
      if (selectedPlanet) {
        const focusP = livePositions[selectedPlanet.id];
        if (focusP) {
          camera.targetFocusX = focusP.x;
          camera.targetFocusY = focusP.y;
          camera.targetFocusZ = focusP.z;
        }
      } else {
        camera.targetFocusX = core3DX;
        camera.targetFocusY = core3DY;
        camera.targetFocusZ = core3DZ;
      }

      // Draw Orbit Trails for each planet
      planets.forEach((p) => {
        const trail = planetTrails[p.id];
        if (trail.length < 2) return;

        renderStack.push({
          depth: 100, // Render trail beneath the actual planets
          draw: () => {
            ctx.beginPath();
            const pStart = project(trail[0].x, trail[0].y, trail[0].z);
            ctx.moveTo(pStart.x, pStart.y);

            for (let idx = 1; idx < trail.length; idx++) {
              const pNode = project(trail[idx].x, trail[idx].y, trail[idx].z);
              ctx.lineTo(pNode.x, pNode.y);
            }

            // Create beautiful fading visual gradient trail lines
            ctx.strokeStyle = p.trailColor;
            ctx.lineWidth = (hoveredPlanet?.id === p.id || selectedPlanet?.id === p.id ? 2.5 : 1.2) * pStart.scale;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.stroke();
          }
        });
      });

      // 3D Solar Core (The massive animated energy sphere)
      const pCore = project(core3DX, core3DY, core3DZ);
      renderStack.push({
        depth: pCore.depth,
        draw: () => {
          const coreRadius = (selectedPlanet ? 18 : 34) * pCore.scale;
          
          ctx.shadowBlur = 45;
          ctx.shadowColor = "rgba(249, 115, 22, 0.45)";

          // Core Volumetric Radial Plasma Glow Glows
          const coreGlow = ctx.createRadialGradient(
            pCore.x, pCore.y, coreRadius * 0.2,
            pCore.x, pCore.y, coreRadius * 1.5
          );
          coreGlow.addColorStop(0, "rgba(255, 255, 255, 1)");
          coreGlow.addColorStop(0.25, "rgba(249, 115, 22, 1)");
          coreGlow.addColorStop(0.55, "rgba(239, 68, 68, 0.75)");
          coreGlow.addColorStop(1, "rgba(239, 68, 68, 0)");

          ctx.beginPath();
          ctx.arc(pCore.x, pCore.y, coreRadius * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = coreGlow;
          ctx.fill();

          // Plasma shell breathing mechanics
          ctx.shadowBlur = 0; // reset shadow performance
          const numFlares = 5;
          for (let f = 0; f < numFlares; f++) {
            const angleOffset = localTime * 1.2 + (f * Math.PI * 2) / numFlares;
            const flareLen = coreRadius * (1.1 + Math.sin(localTime * 4 + f) * 0.08);
            const flareX = pCore.x + Math.cos(angleOffset) * flareLen;
            const flareY = pCore.y + Math.sin(angleOffset) * flareLen;

            ctx.beginPath();
            ctx.moveTo(pCore.x, pCore.y);
            ctx.lineTo(flareX, flareY);
            ctx.strokeStyle = `rgba(249, 115, 22, ${0.45 - f * 0.05})`;
            ctx.lineWidth = 3 * pCore.scale;
            ctx.stroke();
          }
        }
      });

      // Push Core Overlay Position
      localOverlays.push({
        id: "solar-core",
        type: "core",
        name: selectedPlanet ? "CORE ENGINE" : "ENGINEERING CORE",
        x: pCore.x,
        y: pCore.y,
        scale: pCore.scale,
        zIndex: Math.floor((100 - pCore.depth) * 2),
        opacity: Math.max(0.3, Math.min(1, pCore.scale * 1.2)),
        color: "#F97316",
        active: !selectedPlanet
      });

      // Connection energy lines from orbiting planets to Core
      planets.forEach((p) => {
        const pPos = livePositions[p.id];
        if (!pPos) return;

        const isFocus = selectedPlanet?.id === p.id;
        const isHover = hoveredPlanet?.id === p.id;

        // Draw connection paths
        const pProj = project(pPos.x, pPos.y, pPos.z);
        renderStack.push({
          depth: (pProj.depth + pCore.depth) / 2 + 10,
          draw: () => {
            ctx.beginPath();
            ctx.moveTo(pCore.x, pCore.y);
            ctx.lineTo(pProj.x, pProj.y);
            
            ctx.strokeStyle = isFocus || isHover 
              ? `rgba(249, 115, 22, ${0.35 * pProj.scale})`
              : `rgba(249, 115, 22, ${0.07 * pProj.scale})`;
            ctx.lineWidth = (isFocus || isHover ? 1.8 : 0.8) * pProj.scale;
            ctx.stroke();

            // Energy Pulse travels along vector path
            if (isFocus || isHover || Math.sin(localTime * 2 + planets.indexOf(p)) > 0.4) {
              const pulsePercent = (localTime * 0.6) % 1.0;
              const pulseX = pCore.x + (pProj.x - pCore.x) * pulsePercent;
              const pulseY = pCore.y + (pProj.y - pCore.y) * pulsePercent;

              ctx.beginPath();
              ctx.arc(pulseX, pulseY, 2.5 * pProj.scale, 0, Math.PI * 2);
              ctx.fillStyle = p.color;
              ctx.shadowBlur = 10;
              ctx.shadowColor = p.color;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        });
      });

      // Orbiting planetary technology systems
      planets.forEach((p) => {
        const pPos = livePositions[p.id];
        if (!pPos) return;

        const isFocus = selectedPlanet?.id === p.id;
        const isHover = hoveredPlanet?.id === p.id;
        const pProj = project(pPos.x, pPos.y, pPos.z);

        // Standard coordinate sorting for layered drawing
        renderStack.push({
          depth: pProj.depth,
          draw: () => {
            const renderSize = p.size * (isHover ? 1.3 : isFocus ? 1.25 : 1.0) * pProj.scale;

            // Draw outer atmospheric cloud rings
            ctx.beginPath();
            ctx.arc(pProj.x, pProj.y, renderSize * 1.5, 0, Math.PI * 2);
            ctx.strokeStyle = p.color + "25"; // transparent atmosphere
            ctx.lineWidth = 1 * pProj.scale;
            ctx.stroke();

            // Planet body sphere drawing
            const bodyGrad = ctx.createRadialGradient(
              pProj.x - renderSize * 0.3, pProj.y - renderSize * 0.3, renderSize * 0.1,
              pProj.x, pProj.y, renderSize
            );
            bodyGrad.addColorStop(0, "#FFFFFF");
            bodyGrad.addColorStop(0.35, p.color);
            bodyGrad.addColorStop(1, "#050505");

            ctx.beginPath();
            ctx.arc(pProj.x, pProj.y, renderSize, 0, Math.PI * 2);
            ctx.fillStyle = bodyGrad;
            ctx.fill();

            // Dynamic orbit indicator highlight for active planets
            if (isHover || isFocus) {
              ctx.beginPath();
              ctx.arc(pProj.x, pProj.y, renderSize * 1.9, 0, Math.PI * 2);
              ctx.strokeStyle = p.color + "90";
              ctx.lineWidth = 1.5 * pProj.scale;
              ctx.setLineDash([4, 4]);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }
        });

        // Planetary HTML Text Overlays
        localOverlays.push({
          id: p.id,
          type: "planet",
          name: p.name,
          x: pProj.x,
          y: pProj.y + p.size * pProj.scale + 16,
          scale: pProj.scale,
          zIndex: Math.floor((120 - pProj.depth) * 2),
          opacity: selectedPlanet && !isFocus ? 0.15 : Math.max(0.35, Math.min(1, pProj.scale * 1.15)),
          color: p.color,
          active: isFocus || (isHover && !selectedPlanet)
        });

        // Render Moons (sub-skills) orbiting the focused planet
        if (isFocus) {
          p.moons.forEach((moon, mIdx) => {
            const mRadius = 38 + mIdx * 18;
            const mAngle = localTime * 0.8 + (mIdx * Math.PI * 2) / p.moons.length;
            
            // Orbit plane for moons
            const mX = pPos.x + mRadius * Math.cos(mAngle);
            const mZ = pPos.z + mRadius * Math.sin(mAngle) * Math.cos(0.4);
            const mY = pPos.y + mRadius * Math.sin(mAngle) * Math.sin(0.4);

            const mProj = project(mX, mY, mZ);
            const isMoonHovered = hoveredMoon?.name === moon.name;

            renderStack.push({
              depth: mProj.depth,
              draw: () => {
                const moonSize = (isMoonHovered ? 7.5 : 5.0) * mProj.scale;

                // Moon trail line
                ctx.beginPath();
                ctx.arc(pProj.x, pProj.y, mRadius * mProj.scale, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, 0.05)`;
                ctx.lineWidth = 0.6 * mProj.scale;
                ctx.stroke();

                // Vector lines to planet Core
                ctx.beginPath();
                ctx.moveTo(pProj.x, pProj.y);
                ctx.lineTo(mProj.x, mProj.y);
                ctx.strokeStyle = `rgba(255, 255, 255, 0.12)`;
                ctx.lineWidth = 0.5 * mProj.scale;
                ctx.stroke();

                // Moon sphere body
                const mGrad = ctx.createRadialGradient(
                  mProj.x - moonSize * 0.2, mProj.y - moonSize * 0.2, moonSize * 0.05,
                  mProj.x, mProj.y, moonSize
                );
                mGrad.addColorStop(0, "#FFFFFF");
                mGrad.addColorStop(0.4, p.color);
                mGrad.addColorStop(1, "#050505");

                ctx.beginPath();
                ctx.arc(mProj.x, mProj.y, moonSize, 0, Math.PI * 2);
                ctx.fillStyle = mGrad;
                ctx.fill();

                if (isMoonHovered) {
                  ctx.beginPath();
                  ctx.arc(mProj.x, mProj.y, moonSize * 1.8, 0, Math.PI * 2);
                  ctx.strokeStyle = p.color;
                  ctx.lineWidth = 1 * mProj.scale;
                  ctx.stroke();
                }
              }
            });

            // Moon Label Badges Overlay
            localOverlays.push({
              id: `${p.id}-moon-${mIdx}`,
              type: "moon",
              name: moon.name,
              x: mProj.x,
              y: mProj.y + 12,
              scale: mProj.scale,
              zIndex: Math.floor((130 - mProj.depth) * 2),
              opacity: hoveredMoon && !isMoonHovered ? 0.35 : Math.max(0.4, Math.min(1, mProj.scale * 1.15)),
              color: p.color,
              active: isMoonHovered,
              refObject: moon
            });
          });
        }
      });

      // Sort full 3D stack back-to-front rendering queue (Painter's algorithm)
      renderStack.sort((a, b) => b.depth - a.depth);
      renderStack.forEach((node) => node.draw());

      // Update overlaid HTML components coordinate structures
      setOverlays(localOverlays);

      requestRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [selectedPlanet, hoveredPlanet, hoveredMoon]);

  // Handle zooming / focusing on a planet
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

  const activePlanet = selectedPlanet || hoveredPlanet || planets[0];

  return (
    <div className="dark grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch py-6 min-h-[580px] select-none text-white">
      
      {/* Left Column: Massive interactive celestial canvas */}
      <div className="lg:col-span-7 relative h-[480px] sm:h-[620px] rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/20 overflow-hidden shadow-2xl transition-colors duration-300">
        
        {/* Responsive Graphic Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* Dynamic HTML floating badges overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {overlays.map((overlay) => {
            // Shift coordinates to center perfectly on positions
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
                  className="absolute px-3 py-1 bg-orange-500/10 dark:bg-orange-950/40 border border-orange-500/30 rounded-full font-mono text-[8px] text-orange-600 dark:text-orange-400 font-extrabold tracking-widest whitespace-nowrap uppercase shadow-xl transition-opacity duration-300 backdrop-blur-md"
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
                  className={`absolute px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold tracking-wider pointer-events-auto whitespace-nowrap transition-all duration-300 cursor-pointer shadow-lg border backdrop-blur-md ${
                    isActive
                      ? "bg-slate-900 text-white border-orange-500 dark:bg-white dark:text-black dark:border-white scale-110"
                      : "bg-white/95 text-slate-800 border-slate-200 dark:bg-zinc-950/95 dark:text-[#F5F5F5] dark:border-white/5 hover:border-orange-500"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full inline-block shrink-0 shadow-sm"
                      style={{ backgroundColor: overlay.color }}
                    />
                    <span>{overlay.name}</span>
                    {isSelected && <Maximize2 size={9} className="text-orange-500 ml-0.5 animate-pulse" />}
                  </div>
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
                  className={`absolute px-2.5 py-1 rounded-lg font-sans text-[9px] font-semibold tracking-wide pointer-events-auto whitespace-nowrap transition-all duration-300 cursor-pointer border shadow-md backdrop-blur-md ${
                    isHovered
                      ? "bg-orange-500 text-white border-orange-400 dark:border-orange-500 scale-110 z-50 shadow-orange-500/20"
                      : "bg-white/90 text-slate-700 border-slate-200 dark:bg-zinc-900/90 dark:text-white/80 dark:border-white/5 hover:border-orange-400"
                  }`}
                >
                  {overlay.name}
                </button>
              );
            }

            return null;
          })}
        </div>

        {/* Cosmic HUD Overlays (Top left telemetry metrics) */}
        <div className="absolute top-4 left-4 pointer-events-none font-mono text-[9px] text-slate-600 dark:text-white/40 space-y-1 bg-slate-50/70 dark:bg-black/40 px-3 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 backdrop-blur-sm transition-all">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-white/50 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            TELEMETRY: HELIX SYSTEM ACTIVE
          </div>
          <div>YAW: {cameraRef.current.yaw.toFixed(3)} rad</div>
          <div>PITCH: {cameraRef.current.pitch.toFixed(3)} rad</div>
          <div>FPS: Locked 60Hz</div>
          <div>ASTEROIDS: Parallax Stars [280]</div>
        </div>

        {/* Orbit Focus state label indicators */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
          {selectedPlanet ? (
            <button
              onClick={() => {
                setSelectedPlanet(null);
                setHoveredMoon(null);
              }}
              className="px-3.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-white dark:bg-white/90 dark:hover:bg-white dark:text-black rounded-xl font-mono text-[9px] uppercase tracking-widest font-extrabold flex items-center gap-1.5 shadow-xl cursor-pointer border border-slate-800 dark:border-slate-200 transition-all hover:-translate-y-0.5"
            >
              <ArrowLeft size={10} />
              Return to Solar System
            </button>
          ) : (
            <div className="font-mono text-[8px] text-slate-600 dark:text-white/35 uppercase tracking-widest bg-slate-100/50 dark:bg-black/30 px-2.5 py-1 rounded border border-slate-200/30 dark:border-white/5 backdrop-blur-sm">
              Click any planet node to inspect technologies as orbiting moons
            </div>
          )}

          <div className="font-mono text-[8px] text-slate-600 dark:text-white/35 uppercase tracking-widest bg-slate-100/50 dark:bg-black/30 px-2.5 py-1 rounded border border-slate-200/30 dark:border-white/5 backdrop-blur-sm">
            Inclined Planes: Elliptical Math
          </div>
        </div>
      </div>

      {/* Right Column: Premium High-contrast Glass Details Card */}
      <div className="lg:col-span-5 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {activePlanet && (
            <motion.div
              key={activePlanet.id + (hoveredMoon ? `-${hoveredMoon.name}` : "-planet")}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="bg-white/95 dark:bg-zinc-950/60 border border-slate-200 dark:border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md transition-colors duration-300"
            >
              {/* Category indicator & Rating */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: activePlanet.color }}
                  />
                  <span className="px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded-md text-[9px] font-mono uppercase tracking-widest text-orange-600 dark:text-orange-400 font-bold">
                    {hoveredMoon ? "Orbital Moon Tech" : "Solar Planet Category"}
                  </span>
                </div>
                <span className="font-sans text-[10px] font-bold text-slate-400 dark:text-white/40">
                  Proficiency:{" "}
                  <span className="text-orange-600 dark:text-orange-400 font-black">
                    {hoveredMoon ? hoveredMoon.level : activePlanet.experience}
                  </span>
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight leading-tight flex items-center gap-2">
                  {hoveredMoon ? hoveredMoon.name : activePlanet.name}
                  <Sparkles size={18} className="text-orange-500 animate-pulse shrink-0" />
                </h3>
                <p className="font-sans text-sm text-slate-600 dark:text-white/60 leading-relaxed min-h-[72px]">
                  {hoveredMoon ? hoveredMoon.description : activePlanet.description}
                </p>
              </div>

              {/* Moon lists if showing a Planet */}
              {!hoveredMoon && (
                <div className="space-y-2.5">
                  <span className="block font-mono text-[9px] text-slate-500 dark:text-white/40 uppercase tracking-widest">
                    Sub-Technologies (Planetary Moons)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activePlanet.moons.map((m) => (
                      <span
                        key={m.name}
                        onClick={() => {
                          if (selectedPlanet) setHoveredMoon(m);
                        }}
                        className={`px-2.5 py-1 text-[10px] font-mono rounded-lg border cursor-pointer transition-all duration-300 ${
                          hoveredMoon?.name === m.name
                            ? "bg-orange-500 text-white border-orange-400"
                            : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/80 border-slate-200/60 dark:border-white/5 hover:border-orange-500/40"
                        }`}
                      >
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects highlight ledger */}
              <div className="space-y-2">
                <span className="block font-mono text-[9px] text-slate-500 dark:text-white/40 uppercase tracking-widest">
                  Verifiable Implementations
                </span>
                <div className="p-4 bg-slate-50 dark:bg-black/20 border border-slate-200/50 dark:border-white/5 rounded-2xl flex items-start gap-3 transition-colors">
                  <div className="p-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-orange-500 shrink-0">
                    <Terminal size={15} />
                  </div>
                  <div>
                    <span className="block font-sans text-xs text-slate-800 dark:text-white/90 font-bold mb-0.5">
                      {hoveredMoon ? "Notable Project Integration" : "Strategic Deployments"}
                    </span>
                    <span className="block font-sans text-xs text-slate-600 dark:text-white/50 leading-relaxed font-medium">
                      {hoveredMoon ? hoveredMoon.projects : activePlanet.projects}
                    </span>
                  </div>
                </div>
              </div>

              {/* Helpful interaction tips */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-white/40">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Integration Confirmed
                </span>
                <span>Orbiting Radius: {hoveredMoon ? "Moon Layer" : `${activePlanet.orbitRadius} AU`}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="font-mono text-[9px] text-slate-500 dark:text-white/30 uppercase text-center lg:text-left tracking-widest mt-4">
          Interactive Helical Solar Mechanics • Hover to freeze planetary drift • Click to drill into moons
        </p>
      </div>
    </div>
  );
}
