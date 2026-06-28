import { useEffect, useRef } from "react";

interface GenerativeMeshProps {
  className?: string;
  isLightMode?: boolean;
}

export default function GenerativeMesh({ className = "", isLightMode = false }: GenerativeMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

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
      mouseRef.current.targetX = x * 0.005;
      mouseRef.current.targetY = y * 0.005;
    };

    window.addEventListener("resize", handleResize);
    canvas.parentElement?.addEventListener("mousemove", handleMouseMove);

    // 3D Grid parameters
    const N = 26; // Latitude divisions
    const M = 26; // Longitude divisions
    const baseRadius = Math.min(width, height) * 0.28;

    let time = 0;
    let rotX = 0;
    let rotY = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      time += 0.006;
      rotX = time * 0.15 + mouse.y;
      rotY = time * 0.22 + mouse.x;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

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

          // Morphing wave using combinations of 3D sine/cosine harmonics
          const wave1 = Math.sin(4 * theta + time * 2) * Math.cos(3 * phi - time * 1.5) * 0.14;
          const wave2 = Math.cos(6 * theta - time * 1.1) * Math.sin(5 * phi + time * 2.3) * 0.06;
          const wave3 = Math.sin(10 * theta - 8 * phi + time * 3) * 0.02; // Fine detail
          const radius = baseRadius * (1.0 + wave1 + wave2 + wave3);

          // Standard spherical coordinates
          const x3d = radius * sinTheta * cosPhi;
          const y3d = radius * sinTheta * sinPhi;
          const z3d = radius * cosTheta;

          // 3D Rotations
          // Rotate around X-axis
          const y1 = y3d * cosX - z3d * sinX;
          const z1 = y3d * sinX + z3d * cosX;

          // Rotate around Y-axis
          const x2 = x3d * cosY + z1 * sinY;
          const z2 = -x3d * sinY + z1 * cosY;

          // 3D projection parameters
          const cameraDistance = baseRadius * 3;
          const perspective = cameraDistance / (cameraDistance + z2);

          const projX = width / 2 + x2 * perspective;
          const projY = height / 2 + y1 * perspective;

          // Compute normalized depth for lighting/styling
          const depthNormalized = (z2 + baseRadius * 1.5) / (baseRadius * 3); // 0 (front) to 1 (back)
          const alpha = Math.max(0.05, 1 - depthNormalized); // closer points are brighter

          row.push({ x: projX, y: projY, depth: z2, alpha });
        }
        points.push(row);
      }

      // Draw lines / mesh network
      ctx.lineWidth = 0.55;

      const strokeColorMain = isLightMode ? "rgba(15, 23, 42," : "rgba(245, 245, 245,";
      const strokeColorAccent = isLightMode ? "rgba(249, 115, 22," : "rgba(249, 115, 22,";

      for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
          const p1 = points[i][j];
          const p2 = points[i + 1][j];
          const p3 = points[i][j + 1];

          // Determine line type (accentuate certain latitudes/longitudes)
          const isAccentLine = i % 4 === 0 || j % 4 === 0;
          const baseOpacity = isAccentLine ? 0.35 : 0.12;
          const colorPrefix = isAccentLine ? strokeColorAccent : strokeColorMain;

          // Connect down (longitude lines)
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `${colorPrefix}${p1.alpha * baseOpacity})`;
          ctx.stroke();

          // Connect right (latitude lines)
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.strokeStyle = `${colorPrefix}${p1.alpha * baseOpacity})`;
          ctx.stroke();
        }
      }

      // Optional: draw sparkling floating dots on active/accent nodes in foreground
      for (let i = 0; i <= N; i += 2) {
        for (let j = 0; j <= M; j += 2) {
          const pt = points[i][j];
          if (pt.depth < 0) { // Foreground only
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = isLightMode
              ? `rgba(249, 115, 22, ${pt.alpha * 0.55})`
              : `rgba(255, 255, 255, ${pt.alpha * 0.75})`;
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
