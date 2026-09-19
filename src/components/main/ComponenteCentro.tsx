import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown } from 'lucide-react';
import { birthdayContent } from '../../data/birthdayContent';

interface ComponenteCentroProps {
  onClick?: () => void;
}

export const ComponenteCentro: React.FC<ComponenteCentroProps> = ({ onClick }) => {
  const [imgError, setImgError] = useState(false);
  const { portrait, name } = birthdayContent;

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center justify-center select-none"
    >
      {/* Halo */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.5, 0.85, 0.5],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-48 h-48 xs:w-54 xs:h-54 sm:w-[22rem] sm:h-[22rem] md:w-[32rem] md:h-[32rem] lg:w-[38rem] lg:h-[38rem] rounded-full bg-gradient-to-r from-purple-600/35 via-violet-500/30 to-fuchsia-600/25 blur-3xl pointer-events-none"
      />

      {/* Floating Sparkles */}
      <div className="absolute top-0.5 right-1.5 md:top-1 md:right-3 text-amber-300 animate-pulse pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
      </div>
      <div className="absolute bottom-0.5 left-1.5 md:bottom-1 md:left-3 text-purple-300 animate-pulse-slow pointer-events-none">
        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-7 lg:h-7 drop-shadow-[0_0_10px_rgba(216,180,254,0.9)]" />
      </div>

      {/* Frame Container */}
      <motion.div
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={`Abrir foto de ${name}`}
        className="relative group p-1 xs:p-1.5 sm:p-3 md:p-4 lg:p-5 rounded-full bg-gradient-to-b from-amber-300/50 via-purple-600/40 to-amber-400/30 border-2 md:border-[3px] border-amber-300/60 shadow-[0_10px_30px_rgba(0,0,0,0.85),0_0_25px_rgba(168,85,247,0.35)] cursor-pointer transition-shadow duration-300 hover:shadow-[0_25px_65px_rgba(0,0,0,0.95),0_0_55px_rgba(251,191,36,0.6)] focus:outline-none"
      >
        <div className="relative w-36 h-36 xs:w-40 xs:h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[22rem] lg:h-[22rem] xl:w-[25rem] xl:h-[25rem] rounded-full overflow-hidden border-2 md:border-4 border-amber-300/80 p-0.5 sm:p-1 md:p-1.5 bg-[#0a0314] shadow-inner">
          {!imgError ? (
            <img
              src={portrait.image}
              alt={name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover rounded-full filter brightness-105 contrast-105 transition-transform duration-700 group-hover:scale-108"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#220c3d] via-[#150529] to-[#070110] flex flex-col items-center justify-center p-2 sm:p-3 md:p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(192,132,252,0.25),_transparent_70%)]" />
              <Crown className="w-5 h-5 sm:w-8 sm:h-8 md:w-12 md:h-12 text-amber-300 mb-0.5 sm:mb-1 md:mb-2 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
              <span className="font-serif text-amber-100 text-[11px] sm:text-base md:text-xl font-semibold tracking-wider">
                {name}
              </span>
              <span className="text-[8px] sm:text-xs md:text-sm text-purple-300/70 font-light mt-0.5 tracking-wide">
                La Reina de la Noche
              </span>
            </div>
          )}

          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-950/30 via-transparent to-amber-200/15 pointer-events-none" />

          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            <span className="font-serif text-[10px] sm:text-sm md:text-base text-amber-200 font-semibold tracking-wider bg-[#150727]/85 border border-amber-400/60 px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 md:py-1.5 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)]">
              Ver foto
            </span>
          </div>
        </div>
      </motion.div>

      {/* Name */}
      <div className="mt-1 sm:mt-2 md:mt-3 lg:mt-4 text-center max-w-sm md:max-w-xl px-2">
        <h1 className="font-serif text-lg xs:text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-widest md:tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-purple-200 to-amber-200 text-gold-glow">
          {name}
        </h1>
      </div>
    </motion.div>
  );
};
