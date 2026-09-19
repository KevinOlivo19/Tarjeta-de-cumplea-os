import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { birthdayContent } from '../../data/birthdayContent';
import { soundEngine } from '../../utils/soundSynth';
import { notificarCartaAbierta } from '../../services/emailNotification';

interface Pantalla4Props {
  onClose: () => void;
  onSecretAudioTrigger: () => void;
}

export const Pantalla4: React.FC<Pantalla4Props> = ({
  onClose,
  onSecretAudioTrigger,
}) => {
  const [stage, setStage] = useState<'darkness' | 'envelope' | 'reading'>('darkness');
  const { secretLetter } = birthdayContent;

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStage('envelope');
      soundEngine.playHoverChime();
    }, 2000);

    return () => clearTimeout(t1);
  }, []);

  const handleOpenEnvelope = () => {
    setStage('reading');
    soundEngine.playSecretUnlocked();
    onSecretAudioTrigger();
    notificarCartaAbierta();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#020005] select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(126,34,206,0.35),_rgba(3,1,7,0.95)_70%)] pointer-events-none" />

      {/* Botón Cerrar (Esquina superior derecha) - visible antes de desplegar el pergamino */}
      {stage !== 'reading' && (
        <button
          onClick={onClose}
          className="fixed top-3 right-3 sm:top-5 sm:right-5 p-2 sm:p-2.5 rounded-full bg-purple-950/70 border border-purple-400/40 text-purple-200 hover:text-white hover:bg-purple-900 transition-colors duration-200 z-50 shadow-xl cursor-pointer"
          aria-label="Cerrar carta secreta"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}

      <AnimatePresence mode="wait">
        {stage === 'darkness' && (
          <motion.div
            key="darkness"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 text-center px-4"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 1, 0.7] }}
              transition={{ duration: 1.8 }}
              className="font-serif text-sm sm:text-base text-purple-200/80 tracking-widest uppercase italic"
            >
              Tenia que hacerlo...
            </motion.p>
          </motion.div>
        )}

        {stage === 'envelope' && (
          <motion.div
            key="envelope"
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: -40 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center justify-center p-6 text-center select-none"
          >
            <div className="absolute w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

            <div
              onClick={handleOpenEnvelope}
              className="group relative cursor-pointer w-72 sm:w-96 h-52 sm:h-64 rounded-3xl bg-gradient-to-b from-[#1a052e] via-[#0e021c] to-[#05000b] border-2 border-amber-400/40 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(245,158,11,0.25)] flex flex-col items-center justify-center transition-all duration-500 hover:scale-105 hover:border-amber-300"
              role="button"
              tabIndex={0}
              aria-label="Abrir carta secreta"
            >
              <div className="absolute inset-3 rounded-2xl border border-amber-400/20 pointer-events-none" />

              <motion.div
                whileHover={{ scale: 1.15, rotate: 10 }}
                className="relative z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 border-2 border-amber-100 shadow-[0_0_30px_rgba(251,191,36,0.8)] flex items-center justify-center"
              >
                <Heart className="w-8 h-8 text-amber-950 fill-amber-950" />
              </motion.div>

              <h3 className="font-serif text-base sm:text-lg font-bold tracking-widest text-amber-100 mt-5 text-gold-glow">

              </h3>
              <p className="text-xs text-purple-300/60 font-light mt-1.5 font-serif">
                Toca para saberlo todo
              </p>
            </div>
          </motion.div>
        )}

        {stage === 'reading' && (
          <motion.div
            key="reading"
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
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
            className="relative z-10 w-full max-w-[96vw] sm:max-w-[92vw] md:max-w-3xl lg:max-w-4xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl border-2 border-[#b89363]/85 overflow-hidden mx-auto select-text my-auto shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(212,160,96,0.3)]"
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
                  {secretLetter.paragraphs.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + index * 0.05, duration: 0.6 }}
                      className={
                        index === 0
                          ? "first-letter:text-3xl sm:first-letter:text-4xl first-letter:font-bold first-letter:text-[#0b0401] first-letter:mr-1"
                          : ""
                      }
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
