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

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
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
      const starCount = Math.floor((width * height) / 4500);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.8 + 0.5,
          baseAlpha: Math.random() * 0.7 + 0.3,
          alpha: Math.random(),
          twinkleSpeed: Math.random() * 0.03 + 0.008,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };

    initStars();

    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      const isPetal = i % 3 === 0;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isPetal ? Math.random() * 6 + 3 : Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.4 + 0.15,
        vy: Math.random() * 0.4 + 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
        type: isPetal ? 'petal' : 'dust',
        color: isPetal
          ? petalColors[Math.floor(Math.random() * petalColors.length)]
          : 'rgba(216, 180, 254, 0.5)',
      });
    }

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      if (Math.random() > 0.65) {
        ripples.push({
          x: clientX,
          y: clientY,
          radius: 2,
          alpha: 0.6,
        });
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    let time = 0;

    const render = () => {
      if (isPausedRef.current) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      const nebula1X = width * 0.25 + Math.sin(time * 0.5) * 40;
      const nebula1Y = height * 0.35 + Math.cos(time * 0.4) * 30;
      const grad1 = ctx.createRadialGradient(nebula1X, nebula1Y, 10, nebula1X, nebula1Y, width * 0.45);
      grad1.addColorStop(0, 'rgba(76, 29, 149, 0.22)');
      grad1.addColorStop(0.5, 'rgba(44, 20, 84, 0.12)');
      grad1.addColorStop(1, 'rgba(3, 1, 7, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const nebula2X = width * 0.75 + Math.cos(time * 0.3) * 50;
      const nebula2Y = height * 0.65 + Math.sin(time * 0.5) * 40;
      const grad2 = ctx.createRadialGradient(nebula2X, nebula2Y, 10, nebula2X, nebula2Y, width * 0.4);
      grad2.addColorStop(0, 'rgba(109, 40, 217, 0.18)');
      grad2.addColorStop(0.6, 'rgba(59, 7, 100, 0.08)');
      grad2.addColorStop(1, 'rgba(3, 1, 7, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.alpha += star.twinkleSpeed;
        const currentAlpha = (Math.sin(star.alpha) * 0.5 + 0.5) * star.baseAlpha;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowBlur = star.size > 1.2 ? 6 : 0;
        ctx.shadowColor = star.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(time + i) * 0.3;
        p.y += p.vy;
        p.rotation += p.vRot;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.type === 'petal') {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.5, p.size * 0.8, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

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
        ctx.strokeStyle = `rgba(192, 132, 252, ${rip.alpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
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
