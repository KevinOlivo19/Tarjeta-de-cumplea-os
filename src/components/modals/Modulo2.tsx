import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { birthdayContent } from '../../data/birthdayContent';
import { soundEngine } from '../../utils/soundSynth';

interface Modulo2Props {
  onClose: () => void;
}

export const Modulo2: React.FC<Modulo2Props> = ({ onClose }) => {
  const { normalLetter } = birthdayContent;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 pt-4 sm:pt-5 md:p-6 overflow-hidden">
      {/* Dark backdrop with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 md:backdrop-blur-md"
      />

      {/* Parchment Letter Container */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.05, bottom: 0.6 }}
        onDragEnd={(_e, info) => {
          if (info.offset.y > 60 || info.velocity.y > 250) {
            soundEngine.playModalClose();
            onClose();
          }
        }}
        className="relative z-10 w-full max-w-[98vw] sm:max-w-[92vw] md:max-w-4xl lg:max-w-5xl max-h-[94dvh] flex flex-col rounded-2xl sm:rounded-3xl border-2 border-[#b89363]/85 overflow-hidden mx-auto select-text"
        style={{
          background: 'radial-gradient(ellipse at center 20%, #fffef9 0%, #faefd7 35%, #f1dcba 70%, #dfbf8e 100%)',
          boxShadow: 'inset 0 0 50px rgba(139, 87, 36, 0.3), inset 0 0 100px rgba(90, 50, 15, 0.16), 0 25px 70px rgba(0, 0, 0, 0.95), 0 0 35px rgba(212, 160, 96, 0.3)',
        }}
      >
        {/* Barra de agarre para deslizar en móvil */}
        <div className="w-12 h-1 rounded-full bg-[#8b5724]/40 mx-auto mt-2 -mb-1 md:hidden pointer-events-none" />
        {/* Antique Wax Seal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#8a1c14] via-[#6d130d] to-[#450906] border-2 border-[#e6b17e]/70 text-[#faeed5] hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0_4px_14px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.35)] flex items-center justify-center cursor-pointer group"
          aria-label="Cerrar carta"
          title="Cerrar carta"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] transition-transform duration-200 group-hover:rotate-90" />
        </button>

        {/* Inner Ornate Frame */}
        <div className="relative m-2 sm:m-3 md:m-5 p-3.5 sm:p-6 md:p-9 lg:p-11 rounded-xl sm:rounded-2xl border border-[#a87a4a]/40 flex flex-col flex-1 overflow-hidden">
          {/* Decorative antique corners */}
          <div className="absolute top-1 left-1 w-5 h-5 sm:w-7 sm:h-7 border-t-2 border-l-2 border-[#94612f]/60 rounded-tl pointer-events-none" />
          <div className="absolute top-1 right-1 w-5 h-5 sm:w-7 sm:h-7 border-t-2 border-r-2 border-[#94612f]/60 rounded-tr pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-5 h-5 sm:w-7 sm:h-7 border-b-2 border-l-2 border-[#94612f]/60 rounded-bl pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-5 h-5 sm:w-7 sm:h-7 border-b-2 border-r-2 border-[#94612f]/60 rounded-br pointer-events-none" />

          {/* Scrollable Letter Content */}
          <div className="overflow-y-auto parchment-scrollbar pr-1.5 sm:pr-3 md:pr-4 pt-2 sm:pt-4 max-h-[78vh]">
            {/* Letter Body Paragraphs: Dark ink & clear book serif (Cormorant Garamond) */}
            <div
              className="space-y-4 sm:space-y-6 text-[#120803] text-base xs:text-[1.05rem] sm:text-lg md:text-[1.2rem] leading-relaxed sm:leading-loose text-justify font-semibold tracking-normal px-1 sm:px-4 md:px-6"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {normalLetter.paragraphs.map((para, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "first-letter:text-3xl sm:first-letter:text-4xl first-letter:font-bold first-letter:text-[#0b0401] first-letter:mr-1"
                      : ""
                  }
                >
                  {para}
                </p>
              ))}

              {/* Despedida y Firma al final */}
              <div className="mt-8 sm:mt-10 pt-4 border-t border-[#8c592e]/35 flex flex-col items-end text-right">
                <p className="font-handwriting text-xl sm:text-2xl md:text-[1.7rem] text-[#2c1205] italic font-semibold">
                  con mucho amor y cariño,
                </p>
                <p className="font-handwriting text-2xl sm:text-3xl md:text-[2.2rem] text-[#140802] font-bold mt-1">
                  de: tu ex compañerito
                </p>
              </div>

              {/* Postscript */}
              {normalLetter.postscript && (
                <div className="mt-5 p-3.5 rounded-lg bg-[#edd6b6]/60 border border-[#b88554]/50 italic text-sm sm:text-base text-[#1b0b04] font-medium">
                  {normalLetter.postscript}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
