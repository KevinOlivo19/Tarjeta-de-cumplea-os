import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  rotation: number;
  vRot: number;
  type: 'petal' | 'dust';
  color: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

interface FondoCanvasProps {
  isPaused?: boolean;
}

export const FondoCanvas: React.FC<FondoCanvasProps> = ({ isPaused = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let isMobile = width < 768;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      isMobile = width < 768;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    const starColors = ['#f3e8ff', '#e9d5ff', '#c084fc', '#fef08a', '#ffffff'];
    const petalColors = ['rgba(147, 51, 234, 0.45)', 'rgba(126, 34, 206, 0.35)', 'rgba(88, 28, 135, 0.3)'];

    let stars: Star[] = [];
    const particles: Particle[] = [];
    const ripples: Ripple[] = [];

    const initStars = () => {
      stars = [];
      const starCount = isMobile ? 25 : Math.floor((width * height) / 5000);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.5,
          baseAlpha: Math.random() * 0.7 + 0.3,
          alpha: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.008,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };

    initStars();

    const particleCount = isMobile ? 8 : 30;
    for (let i = 0; i < particleCount; i++) {
      const isPetal = !isMobile && i % 3 === 0;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isPetal ? Math.random() * 5 + 2 : Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.3 + 0.1,
        vy: Math.random() * 0.3 + 0.15,
        alpha: Math.random() * 0.5 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.015,
        type: isPetal ? 'petal' : 'dust',
        color: isPetal
          ? petalColors[Math.floor(Math.random() * petalColors.length)]
          : 'rgba(216, 180, 254, 0.4)',
      });
    }

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (isMobile) return; // Desactivar ondas en móvil para máxima fluidez
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      if (Math.random() > 0.7) {
        ripples.push({
          x: clientX,
          y: clientY,
          radius: 2,
          alpha: 0.5,
        });
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    let time = 0;

    const render = () => {
      if (isPausedRef.current) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // En desktop renderizamos las nebulosas dinámicas, en móvil se omiten para ahorrar GPU
      if (!isMobile) {
        const nebula1X = width * 0.25 + Math.sin(time * 0.5) * 30;
        const nebula1Y = height * 0.35 + Math.cos(time * 0.4) * 20;
        const grad1 = ctx.createRadialGradient(nebula1X, nebula1Y, 10, nebula1X, nebula1Y, width * 0.4);
        grad1.addColorStop(0, 'rgba(76, 29, 149, 0.18)');
        grad1.addColorStop(0.5, 'rgba(44, 20, 84, 0.08)');
        grad1.addColorStop(1, 'rgba(3, 1, 7, 0)');
        ctx.fillStyle = grad1;
        ctx.fillRect(0, 0, width, height);
      }

      // Estrellas
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.alpha += star.twinkleSpeed;
        const currentAlpha = (Math.sin(star.alpha) * 0.5 + 0.5) * star.baseAlpha;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.fill();
      }

      // Partículas
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(time + i) * 0.2;
        p.y += p.vy;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ondas en desktop
      if (!isMobile && ripples.length > 0) {
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rip = ripples[i];
          rip.radius += 1.2;
          rip.alpha -= 0.02;

          if (rip.alpha <= 0) {
            ripples.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(192, 132, 252, ${rip.alpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
};
