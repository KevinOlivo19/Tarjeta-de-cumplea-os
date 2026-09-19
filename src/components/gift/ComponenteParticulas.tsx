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

const BURST_PARTICLES: BurstParticle[] = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2;
  const distance = 90 + (i % 3) * 30;
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 20,
    scale: 0.8 + (i % 3) * 0.25,
    color: COLORS[i % COLORS.length],
    duration: 0.65 + (i % 3) * 0.1,
    delay: (i % 3) * 0.03,
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
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
};
