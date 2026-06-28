import { useEffect, useRef } from "react";

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Respect reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }> = [];

    const particleCount = Math.min(60, Math.floor((width * height) / 25000));

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const colors = ["rgba(255, 255, 255,", "rgba(249, 115, 22,", "rgba(59, 130, 246,"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.4,
        vy: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        colorPrefix: randomColor,
      } as any);
    }

    let mouseX = -9999;
    let mouseY = -9999;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const isLight = document.documentElement.classList.contains("light");

      // Solid pitch black / light gray base
      ctx.fillStyle = isLight ? "#FAFAFA" : "#050505";
      ctx.fillRect(0, 0, width, height);

      // Top-left Atmospheric Orange Glow
      const topGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, Math.max(width, height) * 0.7);
      topGlow.addColorStop(0, isLight ? "rgba(249, 115, 22, 0.04)" : "rgba(249, 115, 22, 0.08)"); // Subtle orange glow
      topGlow.addColorStop(1, isLight ? "rgba(250, 250, 250, 0)" : "rgba(5, 5, 5, 0)");
      ctx.fillStyle = topGlow;
      ctx.fillRect(0, 0, width, height);

      // Bottom-right Atmospheric Blue Glow
      const bottomGlow = ctx.createRadialGradient(width, height, 10, width, height, Math.max(width, height) * 0.6);
      bottomGlow.addColorStop(0, isLight ? "rgba(59, 130, 246, 0.04)" : "rgba(59, 130, 246, 0.08)"); // Subtle blue glow
      bottomGlow.addColorStop(1, isLight ? "rgba(250, 250, 250, 0)" : "rgba(5, 5, 5, 0)");
      ctx.fillStyle = bottomGlow;
      ctx.fillRect(0, 0, width, height);

      // Draw connections
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i] as any;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        
        let colorPrefix = p1.colorPrefix;
        if (isLight && colorPrefix.startsWith("rgba(255, 255, 255,")) {
          colorPrefix = "rgba(15, 23, 42,";
        }
        ctx.fillStyle = `${colorPrefix} ${p1.alpha * (isLight ? 0.6 : 1)})`;
        ctx.fill();

        // Check distance with mouse for a subtle glowing effect
        if (mouseX !== -9999 && mouseY !== -9999) {
          const dxMouse = p1.x - mouseX;
          const dyMouse = p1.y - mouseY;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          if (distMouse < 150) {
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, p1.radius * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(249, 115, 22, ${(1 - distMouse / 150) * 0.4})`; // Orange glowing feedback
            ctx.fill();
          }
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * (isLight ? 0.05 : 0.12);
            ctx.strokeStyle = isLight ? `rgba(15, 23, 42, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Update positions
        if (!prefersReducedMotion) {
          p1.x += p1.vx;
          p1.y += p1.vy;

          // Mouse gravity pull (subtle)
          if (mouseX !== -9999 && mouseY !== -9999) {
            const dx = mouseX - p1.x;
            const dy = mouseY - p1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
              const force = (200 - dist) / 200;
              p1.x += (dx / dist) * force * 0.2;
              p1.y += (dy / dist) * force * 0.2;
            }
          }

          // Bounce boundaries
          if (p1.x < 0 || p1.x > width) p1.vx *= -1;
          if (p1.y < 0 || p1.y > height) p1.vy *= -1;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="bg-canvas"
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}
