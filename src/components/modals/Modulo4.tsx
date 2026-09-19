import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Crown } from 'lucide-react';
import { birthdayContent } from '../../data/birthdayContent';
import { soundEngine } from '../../utils/soundSynth';

interface Modulo4Props {
  onClose: () => void;
}

export const Modulo4: React.FC<Modulo4Props> = ({ onClose }) => {
  const { portrait, name } = birthdayContent;
  const [imgError, setImgError] = useState(false);

  // Keyboard navigation (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 pt-14 sm:pt-6 overflow-y-auto">
      {/* Dark backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-md"
      />

      {/* Main Modal Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.05, bottom: 0.6 }}
        onDragEnd={(_e, info) => {
          if (info.offset.y > 60 || info.velocity.y > 250) {
            soundEngine.playModalClose();
            onClose();
          }
        }}
        className="relative z-10 w-full max-w-xl rounded-3xl glass-panel-glow p-3.5 xs:p-5 sm:p-8 text-purple-100 shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-h-[92vh] overflow-y-auto my-auto border border-amber-400/40"
      >
        {/* Barra de agarre para deslizar en móvil */}
        <div className="w-10 h-1 rounded-full bg-amber-300/40 mx-auto -mt-1 mb-2.5 md:hidden" />

        {/* Header with Title on Left, Sparkles and Close button on Top Right */}
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3 sm:pb-4 mb-4 sm:mb-5">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-900/60 border border-purple-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-300 text-gold-glow">
              {portrait.title || name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-amber-300">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full bg-[#150727]/90 border border-amber-400/60 text-amber-300 hover:text-white hover:bg-purple-900 hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0_0_15px_rgba(251,191,36,0.35)] cursor-pointer"
              aria-label="Cerrar modal"
              title="Cerrar"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Large Portrait Image Container */}
        <div className="relative rounded-2xl overflow-hidden bg-black/60 border-2 border-amber-300/40 p-1.5 sm:p-2 shadow-[0_15px_35px_rgba(0,0,0,0.8)] mb-4 sm:mb-5">
          <div className="relative w-full max-h-[56vh] sm:max-h-[70vh] flex items-center justify-center rounded-xl overflow-hidden bg-neutral-950">
            {!imgError ? (
              <img
                src={portrait.image}
                alt={name}
                onError={() => setImgError(true)}
                className="max-h-[56vh] sm:max-h-[70vh] w-auto max-w-full object-contain rounded-xl filter brightness-105 contrast-105 shadow-2xl block mx-auto transition-transform duration-500"
              />
            ) : (
              <div className="w-full min-h-[220px] sm:min-h-[260px] flex flex-col items-center justify-center p-4 sm:p-6 text-center text-neutral-300">
                <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300 mb-2 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                <span className="font-serif text-amber-100 text-sm sm:text-base font-semibold">{name}</span>
                <span className="text-[11px] sm:text-xs text-purple-300/60 mt-1 font-mono">public/images/luisa.jpg</span>
              </div>
            )}
          </div>
        </div>

        {/* Text Section / Mensaje personal */}
        <div className="rounded-2xl bg-purple-950/40 border border-purple-500/30 p-3.5 sm:p-6 shadow-inner text-center">
          <p className="font-serif text-xs sm:text-base leading-relaxed text-purple-100/95 font-light whitespace-pre-line text-justify sm:text-center">
            {portrait.message || portrait.quote}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
