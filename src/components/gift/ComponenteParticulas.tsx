import React from 'react';
import { motion } from 'framer-motion';

interface BurstParticle {
  id: number;
  x: number;
  y: number;
  scale: number;
  color: string;
  duration: number;
  delay: number;
}

const COLORS = ['#fde047', '#c084fc', '#e879f9', '#ffffff', '#a855f7', '#fbbf24'];

const BURST_PARTICLES: BurstParticle[] = Array.from({ length: 60 }, (_, i) => {
  const angle = (i / 60) * Math.PI * 2 + ((i * 17) % 30) * (Math.PI / 180);
  const p1 = ((i * 37) % 100) / 100;
  const p2 = ((i * 53) % 100) / 100;
  const p3 = ((i * 79) % 100) / 100;
  const distance = p1 * 260 + 60;
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - p2 * 50,
    scale: p3 * 1.5 + 0.5,
    color: COLORS[i % COLORS.length],
    duration: p1 * 1.2 + 0.8,
    delay: p2 * 0.2,
  };
});

export const ComponenteParticulas: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-40">
      {BURST_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: p.scale }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: 0.1,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
          style={{ backgroundColor: p.color, color: p.color }}
        />
      ))}
    </div>
  );
};
