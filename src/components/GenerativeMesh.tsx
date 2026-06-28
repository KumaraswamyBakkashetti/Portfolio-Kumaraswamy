import { useEffect, useRef } from "react";

interface GenerativeMeshProps {
  className?: string;
  isLightMode?: boolean;
}

export default function GenerativeMesh({ className = "", isLightMode = false }: GenerativeMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const starsRef = useRef<Array<{
    x: number;
    y: number;
    z: number;
    size: number;
    baseAlpha: number;
    speedX: number;
    speedY: number;
    speedZ: number;
    color: string;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      mouseRef.current.targetX = x * 0.003;
      mouseRef.current.targetY = y * 0.003;
    };

    window.addEventListener("resize", handleResize);
    canvas.parentElement?.addEventListener("mousemove", handleMouseMove);

    // Initialize stars/particles field once for high immersive cosmic feel
    if (starsRef.current.length === 0) {
      const arr = [];
      for (let k = 0; k < 150; k++) {
        arr.push({
          x: (Math.random() - 0.5) * 2.5,
          y: (Math.random() - 0.5) * 2.5,
          z: Math.random() * 2.0,
          size: Math.random() * 2.4 + 0.4,
          baseAlpha: Math.random() * 0.55 + 0.15,
          speedX: (Math.random() - 0.5) * 0.0003,
          speedY: (Math.random() - 0.5) * 0.0003,
          speedZ: -Math.random() * 0.0006 - 0.0003,
          color: "rgba(255, 255, 255, "
        });
      }
      starsRef.current = arr;
    }

    // 3D Grid parameters for super dense organic wireframe sphere (matching image)
    const N = 40; // Latitude divisions (higher density)
    const M = 40; // Longitude divisions (higher density)

    let time = 0;
    let rotX = 0;
    let rotY = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      time += 0.004; // slower, elegant rotation
      rotX = time * 0.12 + mouse.y;
      rotY = time * 0.18 + mouse.x;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const isMobile = width < 768;
      const cx = isMobile ? width / 2 : width * 0.60; // Offset right on desktop like the image
      const cy = height / 2;
      const baseRadius = isMobile 
        ? Math.min(width, height) * 0.45 
        : Math.min(width, height) * 0.49;

      // Soft backing glow behind the sphere for extra volumetric presence and brightness
      if (!isLightMode) {
        const sphereGlow = ctx.createRadialGradient(cx, cy, baseRadius * 0.05, cx, cy, baseRadius * 1.1);
        sphereGlow.addColorStop(0, "rgba(255, 255, 255, 0.12)");
        sphereGlow.addColorStop(0.4, "rgba(255, 255, 255, 0.05)");
        sphereGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = sphereGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius * 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

      // 1. Draw Starfield background with 3D perspective & movement
      if (!isLightMode) {
        starsRef.current.forEach((star) => {
          // drift star forward/back & drift sides
          star.z += star.speedZ;
          if (star.z <= 0.1) {
            star.z = 2.0;
            star.x = (Math.random() - 0.5) * 2.5;
            star.y = (Math.random() - 0.5) * 2.5;
          }
          star.x += star.speedX;
          star.y += star.speedY;
          if (star.x < -1.5) star.x = 1.5;
          if (star.x > 1.5) star.x = -1.5;
          if (star.y < -1.5) star.y = 1.5;
          if (star.y > 1.5) star.y = -1.5;

          const starPersp = 1.8 / (1.8 + star.z);
          const sx = width / 2 + star.x * width * 0.6 * starPersp;
          const sy = height / 2 + star.y * height * 0.6 * starPersp;

          if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
            const alphaVal = star.baseAlpha * (1 - star.z / 2) * (0.45 + Math.sin(time * 6 + star.x * 200) * 0.2);
            ctx.beginPath();
            if (star.size > 1.8) {
              const radGlow = star.size * 2.5 * starPersp;
              const radGrad = ctx.createRadialGradient(sx, sy, 0.1, sx, sy, radGlow);
              radGrad.addColorStop(0, `${star.color}${alphaVal * 0.95})`);
              radGrad.addColorStop(1, `${star.color}0)`);
              ctx.fillStyle = radGrad;
              ctx.arc(sx, sy, radGlow, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.fillStyle = `${star.color}${alphaVal})`;
              ctx.arc(sx, sy, star.size * starPersp, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });
      }

      // Store projected points
      const points: Array<Array<{ x: number; y: number; depth: number; alpha: number }>> = [];

      for (let i = 0; i <= N; i++) {
        const theta = (i / N) * Math.PI;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);
        const row = [];

        for (let j = 0; j <= M; j++) {
          const phi = (j / M) * 2 * Math.PI;
          const sinPhi = Math.sin(phi);
          const cosPhi = Math.cos(phi);

          // Deeply detailed organic wave harmonics for brain/neural mesh aesthetic
          const wave1 = Math.sin(5 * theta + time * 1.6) * Math.cos(3 * phi - time * 0.9) * 0.16;
          const wave2 = Math.cos(7 * theta - time * 1.1) * Math.sin(5 * phi + time * 1.9) * 0.08;
          const wave3 = Math.sin(10 * theta - 8 * phi + time * 2.8) * 0.03; // detail ridge
          const wave4 = Math.sin(2 * theta - time * 0.5) * Math.cos(2 * phi + time * 0.4) * 0.12; // massive organic drift
          const radius = baseRadius * (1.0 + wave1 + wave2 + wave3 + wave4);

          // Spherical coordinates
          const x3d = radius * sinTheta * cosPhi;
          const y3d = radius * sinTheta * sinPhi;
          const z3d = radius * cosTheta;

          // 3D Rotations
          const y1 = y3d * cosX - z3d * sinX;
          const z1 = y3d * sinX + z3d * cosX;

          const x2 = x3d * cosY + z1 * sinY;
          const z2 = -x3d * sinY + z1 * cosY;

          // Perspective projection
          const cameraDistance = baseRadius * 3.2;
          const perspective = cameraDistance / (cameraDistance + z2);

          const projX = cx + x2 * perspective;
          const projY = cy + y1 * perspective;

          // Normalized depth (0 is closest, 1 is back)
          const depthNormalized = (z2 + baseRadius * 1.5) / (baseRadius * 3);
          const alpha = Math.max(0.04, Math.min(1.0, (1 - depthNormalized) * 0.95));

          row.push({ x: projX, y: projY, depth: z2, alpha });
        }
        points.push(row);
      }

      const strokeColorMain = isLightMode ? "rgba(15, 23, 42," : "rgba(255, 255, 255,";

      // Draw dense connection wires matching user's reference image
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
          const p1 = points[i][j];
          const p2 = points[i + 1][j];
          const p3 = points[i][j + 1];

          // Set adaptive line width and opacity based on proximity/depth for awesome 3D perception
          const depthAlpha = p1.alpha;
          const baseOpacity = 0.58;
          const computedAlpha = depthAlpha * baseOpacity;

          // Draw longitude connections (down)
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `${strokeColorMain}${computedAlpha})`;
          ctx.lineWidth = Math.max(0.25, (depthAlpha) * 1.55);
          ctx.stroke();

          // Draw latitude connections (right)
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.strokeStyle = `${strokeColorMain}${computedAlpha})`;
          ctx.lineWidth = Math.max(0.25, (depthAlpha) * 1.55);
          ctx.stroke();
        }
      }

      // Draw sparkling nodes on active foreground intersections
      for (let i = 0; i <= N; i += 2) {
        for (let j = 0; j <= M; j += 2) {
          const pt = points[i][j];
          if (pt.depth < 0) { // foreground only
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, Math.max(0.6, pt.alpha * 1.5), 0, Math.PI * 2);
            ctx.fillStyle = isLightMode
              ? `rgba(15, 23, 42, ${pt.alpha * 0.4})`
              : `rgba(255, 255, 255, ${pt.alpha * 0.85})`;
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.parentElement?.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isLightMode]);

  return (
    <canvas
      ref={canvasRef}
      className={`block select-none pointer-events-none transition-opacity duration-500 ${className}`}
    />
  );
}
