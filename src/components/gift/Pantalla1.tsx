import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../../utils/soundSynth';
import { ComponenteParticulas } from './ComponenteParticulas';

interface Pantalla1Props {
  onOpen: () => void;
  onStepChange: (step: number) => void;
}

export const Pantalla1: React.FC<Pantalla1Props> = ({ onOpen, onStepChange }) => {
  const [clickCount, setClickCount] = useState(0);
  const [isVibrating, setIsVibrating] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

  const handleClick = () => {
    if (isOpening) return;

    if (clickCount === 0) {
      setClickCount(1);
      onStepChange(1);
      soundEngine.playClick1();
    } else if (clickCount === 1) {
      setClickCount(2);
      onStepChange(2);
      setIsVibrating(true);
      soundEngine.playClick2();
      setTimeout(() => setIsVibrating(false), 900);
    } else if (clickCount === 2) {
      setClickCount(3);
      onStepChange(3);
      setIsOpening(true);
      setShowBurst(true);
      soundEngine.playClick3Explosion();

      setTimeout(() => {
        onOpen();
      }, 1600);
    }
  };

  const statusTexts = [
    "Ya que no quisiste que te comprara un regalo...",
    "Logré hacer este detalle para ti...",
    "Espero y te guste...vale ser honesta",
    "¡Sorpresa!"
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 z-20 select-none">
      {/* Ambient Aura */}
      <motion.div
        animate={{
          scale: clickCount === 0 ? 1 : clickCount === 1 ? 1.4 : clickCount === 2 ? 1.9 : 2.8,
          opacity: clickCount === 0 ? 0.4 : clickCount === 1 ? 0.65 : clickCount === 2 ? 0.85 : 1,
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute w-[32rem] h-[32rem] rounded-full bg-gradient-to-r from-purple-600/35 via-amber-500/25 to-rose-600/35 blur-3xl pointer-events-none"
      />

      {/* Shockwave */}
      {clickCount >= 2 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0.9 }}
          animate={{ scale: [1, 2.2], opacity: [0.8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          className="absolute w-96 h-96 rounded-full border-2 border-amber-300/70 pointer-events-none"
        />
      )}

      {/* Burst Particles */}
      <ComponenteParticulas active={showBurst} />

      {/* Main Interactive Box Container */}
      <motion.div
        onClick={handleClick}
        animate={
          isOpening
            ? { scale: [1.15, 1.35, 0], opacity: [1, 1, 0] }
            : isVibrating
              ? {
                x: [-6, 7, -7, 6, -5, 5, 0],
                y: [-3, 4, -4, 3, -2, 2, 0],
                scale: 1.12,
              }
              : {
                scale: clickCount === 0 ? 1 : clickCount === 1 ? 1.06 : 1.12,
                y: clickCount === 0 ? [-6, 6, -6] : [-3, 3, -3],
              }
        }
        transition={
          isOpening
            ? { duration: 1.4, ease: 'easeInOut' }
            : isVibrating
              ? { duration: 0.8, repeat: 1 }
              : {
                y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
                scale: { duration: 0.4 },
              }
        }
        whileHover={{ scale: clickCount === 0 ? 1.04 : clickCount === 1 ? 1.09 : 1.15 }}
        whileTap={{ scale: 0.96 }}
        className="relative cursor-pointer group p-3 xs:p-6 sm:p-10 flex flex-col items-center"
        role="button"
        tabIndex={0}
        aria-label="Abrir regalo interactivo"
      >
        {/* Glow halo */}
        <div
          className={`absolute inset-4 rounded-3xl transition-all duration-700 blur-3xl ${clickCount === 0
            ? 'bg-purple-600/25 group-hover:bg-purple-500/40'
            : clickCount === 1
              ? 'bg-amber-500/35 shadow-[0_0_80px_rgba(245,158,11,0.5)]'
              : 'bg-gradient-to-r from-rose-500/50 to-amber-500/50 shadow-[0_0_120px_rgba(245,158,11,0.7)]'
            }`}
        />

        <div className="relative w-52 h-52 xs:w-64 xs:h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex flex-col items-center justify-end">
          {/* Satin Ribbon Bow */}
          <motion.div
            animate={
              isOpening
                ? { y: -380, rotate: -45, opacity: 0 }
                : clickCount === 2
                  ? { rotate: [-5, 5, -5] }
                  : { y: [0, -3, 0] }
            }
            transition={
              isOpening
                ? { duration: 1.1, ease: [0.1, 0.9, 0.2, 1] }
                : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
            }
            className="absolute -top-10 xs:-top-12 sm:-top-16 md:-top-20 z-40 w-36 xs:w-44 sm:w-56 md:w-64 h-auto pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
          >
            <svg viewBox="0 0 200 120" className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="satinGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="25%" stopColor="#f59e0b" />
                  <stop offset="60%" stopColor="#d97706" />
                  <stop offset="85%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>

                <linearGradient id="satinGoldDark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>

                <linearGradient id="ribbonSheen" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#b45309" />
                  <stop offset="35%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="65%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
              </defs>

              <path
                d="M90,75 C70,95 50,118 35,135 L52,138 C68,118 84,98 94,82 Z"
                fill="url(#satinGold)"
                stroke="#92400e"
                strokeWidth="1"
              />
              <path
                d="M110,75 C130,95 150,118 165,135 L148,138 C132,118 116,98 106,82 Z"
                fill="url(#satinGold)"
                stroke="#92400e"
                strokeWidth="1"
              />
              <path
                d="M100,75 C60,35 15,20 20,55 C24,80 70,82 100,75 Z"
                fill="url(#satinGold)"
                stroke="#d97706"
                strokeWidth="1.5"
              />
              <ellipse cx="50" cy="52" rx="15" ry="11" fill="url(#satinGoldDark)" opacity="0.6" transform="rotate(-15 50 52)" />
              <path
                d="M100,75 C140,35 185,20 180,55 C176,80 130,82 100,75 Z"
                fill="url(#satinGold)"
                stroke="#d97706"
                strokeWidth="1.5"
              />
              <ellipse cx="150" cy="52" rx="15" ry="11" fill="url(#satinGoldDark)" opacity="0.6" transform="rotate(15 150 52)" />
              <rect
                x="87"
                y="63"
                width="26"
                height="24"
                rx="7"
                fill="url(#satinGold)"
                stroke="#fef08a"
                strokeWidth="2"
              />
              <line x1="100" y1="65" x2="100" y2="85" stroke="#fef08a" strokeWidth="2" opacity="0.8" />
            </svg>
          </motion.div>

          {/* Lid */}
          <motion.div
            animate={
              isOpening
                ? {
                  y: -360,
                  rotate: -35,
                  opacity: 0,
                  scale: 1.25,
                }
                : clickCount === 2
                  ? { y: [-3, 3, -3] }
                  : {}
            }
            transition={
              isOpening
                ? { duration: 1.1, ease: [0.1, 0.9, 0.2, 1] }
                : { duration: 0.2, repeat: Infinity }
            }
            className="absolute top-8 xs:top-10 sm:top-12 md:top-14 z-30 w-60 xs:w-72 sm:w-88 md:w-[26rem] h-13 xs:h-16 sm:h-20 md:h-24 rounded-2xl bg-gradient-to-b from-[#831843] via-[#701a75] to-[#4a044e] border-2 border-amber-300/80 shadow-[0_16px_30px_rgba(0,0,0,0.85)] flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 w-11 xs:w-14 sm:w-16 md:w-20 bg-gradient-to-r from-[#92400e] via-[#fef08a] via-50% to-[#92400e] shadow-[0_0_15px_rgba(245,158,11,0.6)] flex items-center justify-center">
              <div className="w-1 h-full bg-white/40" />
            </div>

            <div className="absolute top-1.5 xs:top-2 left-3 xs:left-4 sm:left-6 rotate-[-8deg] bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-400 rounded-md px-2 xs:px-2.5 py-0.5 xs:py-1 shadow-md z-30 flex items-center gap-1 pointer-events-none">
              <span className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-serif text-amber-950 font-bold tracking-wide">
                Para: Luisa ✨
              </span>
            </div>
          </motion.div>

          {/* Box Body */}
          <div className="relative w-52 h-40 xs:w-64 xs:h-48 sm:w-80 sm:h-60 md:w-96 md:h-72 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#701a75] via-[#581c87] to-[#31054a] border-2 border-amber-400/60 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden flex items-center justify-center">
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-20" />
            <div className="absolute inset-x-0 top-8 h-1/3 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

            <div className="absolute inset-y-0 w-11 xs:w-14 sm:w-16 md:w-20 bg-gradient-to-r from-[#92400e] via-[#fef08a] via-50% to-[#92400e] shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center justify-center z-10">
              <div className="w-1 h-full bg-white/40" />
            </div>

            <div className="absolute inset-x-0 h-11 xs:h-14 sm:h-16 md:h-20 bg-gradient-to-b from-[#92400e] via-[#fef08a] via-50% to-[#92400e] shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center justify-center z-10">
              <div className="h-1 w-full bg-white/40" />
            </div>

            {clickCount >= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-t from-transparent via-amber-400/30 to-yellow-200/50 pointer-events-none z-15"
              />
            )}
          </div>
        </div>

        {/* Progress Dots */}
        <div className="mt-6 sm:mt-10 flex items-center justify-center gap-3 sm:gap-4">
          {[0, 1, 2].map((idx) => (
            <motion.div
              key={idx}
              animate={{
                scale: clickCount > idx ? 1.3 : 1,
                backgroundColor:
                  clickCount > idx
                    ? '#fbbf24'
                    : 'rgba(245, 158, 11, 0.2)',
                boxShadow:
                  clickCount > idx
                    ? '0 0 20px rgba(251, 191, 36, 1)'
                    : 'none',
              }}
              className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border-2 border-amber-300/80 transition-colors duration-300"
            />
          ))}
        </div>
      </motion.div>

      {/* Status Texts */}
      <AnimatePresence mode="wait">
        <motion.div
          key={clickCount}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.5 }}
          className="mt-3 sm:mt-6 text-center max-w-2xl px-3 sm:px-4"
        >
          <h2 className="font-serif text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-300 text-gold-glow uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
            {statusTexts[clickCount]}
          </h2>

          <p className="text-xs xs:text-sm sm:text-base md:text-xl font-light text-purple-200/90 mt-2 sm:mt-3 drop-shadow-md">
            {clickCount === 0 && "Toca el regalo para iniciar"}
            {clickCount === 1 && "Vuelve a tocar para avanzar"}
            {clickCount === 2 && "Un último toque"}
            {clickCount === 3 && "¡El regalo se está abriendo!"}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
