import React from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '../../utils/soundSynth';

export type ComponenteItemVariant = 'tastes' | 'letter' | 'easter-egg' | 'memories';

interface ComponenteItemProps {
  id: string;
  variant: ComponenteItemVariant;
  title: string;
  subtitle: string;
  onClick: () => void;
  floatDelay?: number;
  initialOffset: { x: number; y: number };
  isLocked?: boolean;
  onLockedClick?: () => void;
  isHighlighted?: boolean;
}

export const ComponenteItem: React.FC<ComponenteItemProps> = ({
  variant,
  title,
  subtitle,
  onClick,
  floatDelay = 0,
  initialOffset,
  isLocked = false,
  onLockedClick,
  isHighlighted = false,
}) => {
  const [isHintActive, setIsHintActive] = React.useState(false);

  const handleMouseEnter = () => {
    soundEngine.playHoverChime();
  };

  const handleClick = () => {
    if (isLocked) {
      soundEngine.playPuzzleError();
      setIsHintActive(true);
      setTimeout(() => setIsHintActive(false), 380);
      if (onLockedClick) {
        onLockedClick();
      }
      return;
    }
    soundEngine.playObjectClick();
    onClick();
  };

  const colorProfiles: Record<
    ComponenteItemVariant,
    {
      gradient: string;
      glowColor: string;
      borderColor: string;
      tagBg: string;
      tagText: string;
    }
  > = {
    tastes: {
      gradient: 'from-amber-500 via-purple-600 to-rose-500',
      glowColor: 'rgba(236, 72, 153, 0.5)',
      borderColor: 'border-amber-300/80',
      tagBg: 'bg-purple-500/20',
      tagText: 'text-amber-200',
    },
    letter: {
      gradient: 'from-rose-600 via-red-500 to-pink-500',
      glowColor: 'rgba(239, 68, 68, 0.45)',
      borderColor: 'border-rose-300/80',
      tagBg: 'bg-rose-500/20',
      tagText: 'text-rose-200',
    },
    'easter-egg': {
      gradient: 'from-purple-700 via-fuchsia-600 to-amber-500',
      glowColor: 'rgba(217, 70, 239, 0.55)',
      borderColor: 'border-amber-300/80',
      tagBg: 'bg-purple-500/20',
      tagText: 'text-amber-200',
    },
    memories: {
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      glowColor: 'rgba(20, 184, 166, 0.5)',
      borderColor: 'border-emerald-300/80',
      tagBg: 'bg-emerald-500/20',
      tagText: 'text-emerald-200',
    },
  };

  const currentTheme = colorProfiles[variant];

  const renderIcon = () => {
    switch (variant) {
      case 'tastes':
        return (
          <div className="relative w-10 h-10 xs:w-11 xs:h-11 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 flex items-center justify-center">
            <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
              <path
                d="M28 8 C15 8 6 18 6 32 C6 44 14 54 26 57 C29 58 32 55 32 52 C32 49 30 47 30 44 C30 38 35 33 41 33 C45 33 48 35 51 38 C53 40 56 40 57 38 C59 34 60 29 60 24 C60 14 47 8 28 8 Z"
                fill="#fde68a"
                stroke="#d97706"
                strokeWidth="2"
              />
              <ellipse cx="18" cy="44" rx="4" ry="5" fill="#c2410c" opacity="0.8" />
              <circle cx="18" cy="20" r="4" fill="#ef4444" />
              <circle cx="28" cy="15" r="4" fill="#3b82f6" />
              <circle cx="39" cy="18" r="4" fill="#22c55e" />
              <circle cx="46" cy="26" r="4" fill="#ec4899" />
              <path d="M12 52 L34 28 L38 32 L16 56 Z" fill="#92400e" stroke="#78350f" strokeWidth="1" />
              <path
                d="M44 12 L56 7 L56 22 C55 21 53 20 51 21 C48 22 47 25 49 27 C50 29 54 29 56 27 C57 26 58 24 58 22 L58 12 L46 16 L46 25 C45 24 43 23 41 24 C38 25 37 28 39 30 C40 32 44 32 46 30 C47 29 48 27 48 25 L48 12 Z"
                fill="#fbbf24"
                stroke="#d97706"
                strokeWidth="1"
              />
            </svg>
          </div>
        );

      case 'letter':
        return (
          <div className="relative w-10 h-10 xs:w-11 xs:h-11 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 flex items-center justify-center">
            <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
              <rect x="8" y="16" width="48" height="34" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              <path
                d="M8 50 L26 33 M56 50 L38 33"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M8 18 L32 36 L56 18"
                fill="#f1f5f9"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="32" cy="35" r="7" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
              <path
                d="M32 37.5 C32 37.5 28.5 35 28.5 33.5 C28.5 32.5 29.5 31.8 30.5 32.2 C31.2 32.5 32 33.2 32 33.2 C32 33.2 32.8 32.5 33.5 32.2 C34.5 31.8 35.5 32.5 35.5 33.5 C35.5 35 32 37.5 32 37.5 Z"
                fill="#ffffff"
              />
            </svg>
          </div>
        );

      case 'easter-egg':
        return (
          <div className="relative w-10 h-10 xs:w-11 xs:h-11 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 flex items-center justify-center">
            <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_0_14px_rgba(251,191,36,0.9)]">
              {/* Anillos astronómicos orbitantes */}
              <circle cx="32" cy="32" r="27" fill="none" stroke="#e879f9" strokeWidth="1" strokeDasharray="3 3" opacity={isLocked ? "0.4" : "0.75"} />
              <circle cx="32" cy="32" r="22" fill="none" stroke="#fde047" strokeWidth="0.8" opacity={isLocked ? "0.3" : "0.6"} />
              
              {/* Estrellas místicas alrededor */}
              <path d="M14 18 L15 15 L18 14 L15 13 L14 10 L13 13 L10 14 L13 15 Z" fill="#fde047" opacity={isLocked ? "0.5" : "1"} />
              <path d="M50 46 L51 43 L54 42 L51 41 L50 38 L49 41 L46 42 L49 43 Z" fill="#fde047" opacity={isLocked ? "0.5" : "1"} />

              {/* Símbolo central "?" Cósmico */}
              <text
                x="32"
                y="41"
                textAnchor="middle"
                fontFamily="Cinzel, serif"
                fontWeight="bold"
                fontSize="34"
                fill="url(#q-gold-grad)"
                filter="drop-shadow(0 2px 8px rgba(245,158,11,0.6))"
              >
                ?
              </text>

              {/* Indicador de candado sutil si está bloqueado */}
              {isLocked && (
                <g transform="translate(38, 38)">
                  <circle cx="7" cy="7" r="8" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.2" />
                  <rect x="4" y="6" width="6" height="5" rx="1" fill="#f59e0b" />
                  <path d="M5 6 V4.5 C5 3.4 5.9 2.5 7 2.5 C8.1 2.5 9 3.4 9 4.5 V6" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
                </g>
              )}

              {/* Destello rápido como estrella de pista (casi imperceptible) al dar click bloqueado */}
              {isHintActive && (
                <motion.g
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: [0.2, 1.3, 0.8], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  style={{ transformOrigin: '32px 30px' }}
                >
                  <circle cx="32" cy="30" r="15" fill="#fbbf24" opacity="0.3" />
                  <path
                    d="M32 14 C32 22 36 26 44 30 C36 34 32 38 32 46 C32 38 28 34 20 30 C28 26 32 22 32 14 Z"
                    fill="#ffffff"
                    filter="drop-shadow(0 0 8px #fde047) drop-shadow(0 0 14px #f59e0b)"
                  />
                </motion.g>
              )}

              <defs>
                <linearGradient id="q-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#fef08a" />
                  <stop offset="70%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        );

      case 'memories':
        return (
          <div className="relative w-10 h-10 xs:w-11 xs:h-11 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 flex items-center justify-center">
            <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
              <rect x="8" y="18" width="48" height="34" rx="8" fill="#0d9488" stroke="#042f2e" strokeWidth="2" />
              <path d="M8 26 L56 26 L56 22 C56 19.8 54.2 18 52 18 L12 18 C9.8 18 8 19.8 8 22 Z" fill="#14b8a6" />
              <rect x="42" y="21" width="8" height="6" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
              <circle cx="16" cy="23" r="3" fill="#1e293b" />
              <circle cx="32" cy="35" r="13" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="32" cy="35" r="10" fill="#0f172a" />
              <circle cx="32" cy="35" r="7" fill="#0284c7" />
              <circle cx="30" cy="33" r="2.5" fill="#ffffff" opacity="0.8" />
              <rect x="14" y="14" width="7" height="4" rx="1.5" fill="#ef4444" />
            </svg>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{
        y: initialOffset ? initialOffset.y * 0.25 : 15,
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.5,
        delay: floatDelay * 0.08,
        ease: 'easeOut',
      }}
      className="relative z-20 flex flex-col items-center shrink-0"
    >
      <motion.div
        animate={
          isHighlighted
            ? {
                scale: [1, 1.15, 1],
                rotate: [-2, 2, -2],
              }
            : undefined
        }
        transition={
          isHighlighted
            ? {
                duration: 0.9,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : undefined
        }
        whileHover={{
          scale: 1.08,
          transition: { duration: 0.15 },
        }}
        whileTap={{ scale: 0.94 }}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={title ? `Abrir ${title}` : undefined}
        className="group relative cursor-pointer flex flex-col items-center p-1 xs:p-1.5 sm:p-3 md:p-4 focus:outline-none"
      >
        {/* Halo resplandeciente exterior */}
        <div
          className={`absolute inset-0 rounded-2xl sm:rounded-3xl transition-opacity duration-200 blur-lg ${
            isHighlighted
              ? 'opacity-100 shadow-[0_0_30px_rgba(251,191,36,0.9)]'
              : isHintActive
              ? 'opacity-100 shadow-[0_0_25px_rgba(251,191,36,0.95)]'
              : 'opacity-40 group-hover:opacity-80'
          } pointer-events-none`}
          style={{ background: isHighlighted || isHintActive ? 'rgba(251, 191, 36, 0.95)' : currentTheme.glowColor }}
        />

        {/* Anillo de desbloqueo pulsante cuando está resaltado */}
        {isHighlighted && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.25, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-1.5 sm:-inset-2.5 rounded-2xl xs:rounded-3xl sm:rounded-3xl md:rounded-[2.2rem] border-2 border-amber-300 shadow-[0_0_25px_rgba(251,191,36,1)] pointer-events-none z-30"
          />
        )}

        <div
          className={`relative w-20 h-20 xs:w-[86px] xs:h-[86px] sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 rounded-2xl xs:rounded-3xl sm:rounded-3xl md:rounded-[2rem] lg:rounded-[2.25rem] bg-gradient-to-tr ${currentTheme.gradient} p-0.5 sm:p-1 md:p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.8)] md:shadow-[0_12px_28px_rgba(0,0,0,0.85)] border-2 md:border-[3px] ${
            isHighlighted ? 'border-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.95)]' : currentTheme.borderColor
          } group-hover:shadow-[0_16px_38px_rgba(0,0,0,0.95)] flex items-center justify-center transition-all duration-300`}
        >
          <div className="absolute inset-x-1 top-0.5 md:top-1 h-1/2 rounded-t-xl sm:rounded-t-2xl md:rounded-t-[1.8rem] bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

          <div className="relative w-full h-full rounded-[14px] xs:rounded-[18px] sm:rounded-[22px] md:rounded-[28px] lg:rounded-[32px] bg-gradient-to-b from-black/15 via-black/25 to-black/40 shadow-inner flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rotate-45 pointer-events-none" />

            <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
              {renderIcon()}
            </div>
          </div>
        </div>

        {title && title.trim().length > 0 && (
          <div className="mt-1.5 xs:mt-2 sm:mt-2.5 md:mt-4 lg:mt-5 text-center max-w-[115px] xs:max-w-[130px] sm:max-w-[160px] md:max-w-[190px] lg:max-w-[220px] xl:max-w-[250px]">
            <h2 className="font-serif text-[11px] xs:text-xs sm:text-base md:text-base lg:text-lg xl:text-xl font-bold tracking-wide md:tracking-wider text-yellow-300 text-gold-glow drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] group-hover:text-yellow-100 transition-colors duration-200 leading-tight uppercase">
              {title}
            </h2>
            {subtitle && subtitle.trim().length > 0 && (
              <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-amber-200/90 font-medium mt-0.5 line-clamp-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
