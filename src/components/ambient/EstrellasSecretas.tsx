import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../../utils/soundSynth';

interface EstrellasSecretasProps {
  onUnlock: () => void;
}

interface StarItem {
  id: string;
  // Posiciones optimizadas tanto para teléfonos (vertical) como escritorio
  styleMobile: { top?: string; bottom?: string; left?: string; right?: string };
  name: string;
}

const STARS_CONFIG: StarItem[] = [
  {
    id: 'estrella-arriba',
    name: 'Estrella Superior',
    // 1. Arriba a la derecha (en el cielo despejado)
    styleMobile: { top: '7%', right: '14%' },
  },
  {
    id: 'estrella-der-nombre',
    name: 'Estrella Derecha Nombre',
    // 2. A la derecha de su nombre "LUISA", bien retirado hacia el lateral
    styleMobile: { top: '39.5%', right: '11%' },
  },
  {
    id: 'estrella-izq-foto',
    name: 'Estrella Lateral Foto',
    // 3. A la izquierda de la foto de Luisa
    styleMobile: { top: '21%', left: '11%' },
  },
];

const STORAGE_KEY = 'luisa_collected_stars_v3';

export const EstrellasSecretas: React.FC<EstrellasSecretasProps> = ({ onUnlock }) => {
  const [collected, setCollected] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [sparkPos, setSparkPos] = useState<{ x: number; y: number } | null>(null);

  // Verificar si ya estaban las 3 recolectadas previamente
  useEffect(() => {
    if (collected.length >= 3) {
      localStorage.setItem('luisa_secret_unlocked', 'true');
    }
  }, [collected]);

  // Escuchar recarga de estrellas desde el botón de pruebas
  useEffect(() => {
    const handleReload = () => {
      setCollected([]);
    };
    window.addEventListener('luisa_reload_stars', handleReload);
    return () => window.removeEventListener('luisa_reload_stars', handleReload);
  }, []);

  const handleCollect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    if (collected.includes(id)) return;

    // Calcular posición para las chispas
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;
    if (e.clientX && e.clientY) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    setSparkPos({ x: clientX, y: clientY });
    soundEngine.playHoverChime();

    const updated = [...collected, id];
    setCollected(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignorar fallo de storage
    }

    if (updated.length >= 3) {
      localStorage.setItem('luisa_secret_unlocked', 'true');
      soundEngine.playSecretUnlocked();
      onUnlock();
    }

    setTimeout(() => {
      setSparkPos(null);
    }, 800);
  };

  return (
    <>
      {/* RENDERIZAR ÚNICAMENTE LAS ESTRELLAS NO RECOLECTADAS */}
      {STARS_CONFIG.map((star) => {
        if (collected.includes(star.id)) return null;

        return (
          <div
            key={star.id}
            className="fixed z-30 select-none pointer-events-auto"
            style={star.styleMobile}
          >
            <button
              type="button"
              onClick={(e) => handleCollect(e, star.id)}
              className="relative -top-4 -left-4 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center cursor-pointer focus:outline-none bg-transparent border-none p-0 active:scale-90 transition-transform"
              aria-label={`Estrella ${star.name}`}
            >
              {/* Estrella fija, sutilmente brillante en el cielo */}
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-200/90 drop-shadow-[0_0_4px_rgba(254,240,138,0.7)] pointer-events-none"
                fill="currentColor"
              >
                <path d="M12 0 C12 6.5 16 10.5 24 12 C16 13.5 12 17.5 12 24 C12 17.5 8 13.5 0 12 C8 10.5 12 6.5 12 0 Z" />
              </svg>
            </button>
          </div>
        );
      })}

      {/* CHISPAS AL TOCAR CUALQUIERA DE LAS ESTRELLAS */}
      <AnimatePresence>
        {sparkPos && (
          <div
            className="fixed pointer-events-none z-50"
            style={{ left: sparkPos.x, top: sparkPos.y }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-amber-300/80 blur-sm"
            />
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const dist = 24 + (i % 3) * 8;
              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    opacity: 0,
                    scale: 0.2,
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_6px_#fef08a]"
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
