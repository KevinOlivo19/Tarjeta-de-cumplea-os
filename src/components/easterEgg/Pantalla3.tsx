import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, ArrowRight, Heart, KeyRound } from 'lucide-react';
import { birthdayContent, type IntimateClue } from '../../data/birthdayContent';
import { soundEngine } from '../../utils/soundSynth';

interface Pantalla3Props {
  onClose: () => void;
  onSolved: () => void;
}

const STORAGE_KEY = 'luisa_intimate_sequence_v1';

// Función para normalizar texto: quita tildes, signos, mayúsculas y espacios extra
const normalizeText = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
};

export const Pantalla3: React.FC<Pantalla3Props> = ({ onClose, onSolved }) => {
  const clues: IntimateClue[] = birthdayContent.intimateSequence || [];

  // Estado de progreso: cuántas pistas han sido descubiertas (0, 1, 2 o 3)
  const [solvedCount, setSolvedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return typeof parsed.count === 'number' ? parsed.count : 0;
      }
      return 0;
    } catch {
      return 0;
    }
  });

  // Texto que el usuario está escribiendo en el paso activo
  const [currentInput, setCurrentInput] = useState('');
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

  // Escuchar recarga de pruebas
  useEffect(() => {
    const handleReload = () => {
      setSolvedCount(0);
      setCurrentInput('');
      setFeedbackError(null);
    };
    window.addEventListener('luisa_reload_stars', handleReload);
    return () => window.removeEventListener('luisa_reload_stars', handleReload);
  }, []);

  // Al enfocarse en móvil, asegurarse de que el formulario quede visible por encima del teclado
  const handleInputFocus = () => {
    setTimeout(() => {
      formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 280);
  };

  const activeClue = clues[solvedCount] as IntimateClue | undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClue) return;

    const userClean = normalizeText(currentInput);
    const expectedClean = normalizeText(activeClue.expectedAnswer);

    let isCorrect = userClean === expectedClean;

    // Verificar variantes aceptadas en los datos
    if (!isCorrect && activeClue.acceptedAnswers) {
      isCorrect = activeClue.acceptedAnswers.some(
        (ans) => normalizeText(ans) === userClean
      );
    }

    // Regla flexible especial solicitada para el segundo acertijo:
    // "si ponen NOS VUELVE, PONE, HACE, CONVIERTE EN, HACE SER todo eso estará correcto, agrégale más por si acaso"
    if (!isCorrect && activeClue.step === 2) {
      const hasPendejo = userClean.includes('PENDEJ');
      const hasKeyVerb = [
        'VUELVE',
        'PONE',
        'HACE',
        'CONVIERTE',
        'HACE SER',
        'TRANSFORMA',
        'DEJA',
        'VUELVA',
      ].some((verb) => userClean.includes(verb));

      if (hasPendejo && hasKeyVerb) {
        isCorrect = true;
      }
    }

    if (isCorrect) {
      soundEngine.playSecretUnlocked();
      const nextCount = solvedCount + 1;
      setSolvedCount(nextCount);
      setCurrentInput('');
      setFeedbackError(null);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: nextCount }));
      } catch {
        // Ignorar si storage falla
      }
    } else {
      soundEngine.playPuzzleError();
      setFeedbackError('Esa frase aún no resuena con este recuerdo... piensa con calma e inténtalo de nuevo.');
      setTimeout(() => {
        setFeedbackError(null);
      }, 3500);
    }
  };

  const isAllCompleted = solvedCount >= 3;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden p-2 xs:p-3 sm:p-6 pt-16 xs:pt-20 sm:pt-24 pb-44 sm:pb-16 bg-black/95 select-none">
      {/* Fondo cósmico etéreo */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(88,28,135,0.35),_rgba(15,3,25,0.95)_75%)] pointer-events-none" />

      {/* Botón Cerrar (Esquina superior derecha) */}
      <button
        onClick={onClose}
        className="fixed top-2.5 right-2.5 sm:top-5 sm:right-5 p-2 sm:p-2.5 rounded-full bg-purple-950/80 border border-purple-400/50 text-purple-200 hover:text-white hover:bg-purple-900 transition-colors z-50 shadow-2xl cursor-pointer"
        aria-label="Cerrar"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Tarjeta Contenedora adaptable a teclados móviles */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.05, bottom: 0.6 }}
        onDragEnd={(_e, info) => {
          if (info.offset.y > 60 || info.velocity.y > 250) {
            soundEngine.playModalClose();
            onClose();
          }
        }}
        className="relative z-10 w-full max-w-xl flex flex-col items-center"
      >
        {/* Barra de agarre para deslizar en móvil */}
        <div className="w-12 h-1 rounded-full bg-amber-300/40 mx-auto -mt-2 mb-3 md:hidden pointer-events-none" />

        {/* Encabezado compacto en móviles para ahorrar altura de pantalla */}
        <div className="text-center mb-3 sm:mb-6 max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-purple-950/90 border border-amber-400/50 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] mb-1.5 sm:mb-2">
            <KeyRound className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-purple-100 to-amber-200 text-gold-glow">
            {isAllCompleted ? 'La Secuencia Revelada' : 'Puzzle de Tres Frases'}
          </h2>

          <p className="text-[11px] sm:text-xs md:text-sm text-purple-200/80 font-serif mt-1 leading-relaxed px-2">
            {isAllCompleted
              ? 'Dede aquí ya debes saber por donde van las cosas.'
              : 'Habrán tres pistas para poder avanzar. Descúbrelas una a una.'}
          </p>
        </div>

        {/* 1. SECCIÓN DE FRASES YA DESCUBIERTAS (Compactas en móvil para no tapar el teclado) */}
        {solvedCount > 0 && !isAllCompleted && (
          <div className="w-full space-y-2 mb-3 sm:mb-4">
            {clues.slice(0, solvedCount).map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full py-2 px-3 sm:py-3 sm:px-4 rounded-xl bg-purple-950/70 border border-amber-400/50 shadow-sm flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-300/60 flex items-center justify-center text-amber-300 text-[10px] font-serif font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-[10px] text-purple-300/70 font-serif italic hidden xs:inline">
                    Descubierta:
                  </span>
                </div>

                <div className="font-serif text-xs sm:text-sm md:text-base font-bold tracking-wider text-amber-200 text-gold-glow uppercase text-right sm:text-center truncate">
                  {item.complement && (
                    <span className="text-amber-300/80 italic font-normal lowercase mr-1.5 text-[10px] sm:text-xs">
                      {item.complement}...
                    </span>
                  )}
                  {item.revealedPhrase}
                </div>

                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </motion.div>
            ))}
          </div>
        )}

        {/* 2. PISTA ACTIVA ACTUAL (Optimizado para teclado de móvil) */}
        {!isAllCompleted && activeClue && (
          <motion.div
            ref={formCardRef}
            key={activeClue.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full p-4 xs:p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#140526]/95 border-2 border-purple-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.85)] backdrop-blur-md"
          >
            {/* Indicador de paso */}
            <div className="flex items-center justify-between mb-2 border-b border-purple-500/20 pb-2">
              <span className="text-[11px] sm:text-xs font-serif font-bold uppercase tracking-widest text-amber-300">
                Pista {activeClue.step} de 3
              </span>
              <span className="text-[10px] sm:text-[11px] text-purple-300/60 font-serif">
                Paso {activeClue.step}
              </span>
            </div>

            {/* Texto de la pista íntima */}
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs sm:text-sm font-serif text-purple-100/95 leading-relaxed shadow-inner mb-2.5">
              "{activeClue.clue}"
            </div>

            {/* Ayuda complementaria para la tercera pista ("pero yo quiero") */}
            {activeClue.complement && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2.5 px-2.5 py-1 rounded-lg bg-purple-900/35 border border-amber-400/30 inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-amber-200/90 font-serif italic"
              >
                <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                <span>Como complemento: <strong className="text-amber-300 not-italic">"{activeClue.complement}..."</strong></span>
              </motion.div>
            )}

            {/* Formulario de respuesta abierta */}
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="text"
                  value={currentInput}
                  onFocus={handleInputFocus}
                  onChange={(e) => {
                    setCurrentInput(e.target.value);
                    if (feedbackError) setFeedbackError(null);
                  }}
                  placeholder="Escribe la frase que consideras que corresponde..."
                  className="w-full px-3 py-2.5 sm:py-3.5 pr-24 sm:pr-28 rounded-xl sm:rounded-2xl bg-[#0a0214] border border-purple-400/40 text-purple-100 placeholder-purple-400/40 text-xs sm:text-sm focus:outline-none focus:border-amber-300/80 focus:ring-1 focus:ring-amber-300/50 transition-all font-serif"
                  autoFocus
                />

                <button
                  type="submit"
                  disabled={!currentInput.trim()}
                  className={`absolute right-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-serif font-bold tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-md ${currentInput.trim()
                    ? 'bg-gradient-to-r from-purple-700 to-amber-600 text-amber-100 hover:brightness-110 active:scale-95 border border-amber-300/60'
                    : 'bg-purple-950/40 text-purple-500/40 border border-purple-900/40 cursor-not-allowed'
                    }`}
                >
                  <span>LISTO</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Mensaje de error delicado */}
              <AnimatePresence>
                {feedbackError && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="text-[11px] text-rose-300/90 font-serif italic text-center px-1"
                  >
                    {feedbackError}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        )}

        {/* 3. REVELACIÓN FINAL: LAS TRES FRASES JUNTAS CON EL COMPLEMENTO "PERO YO QUIERO" */}
        {isAllCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="w-full p-4 xs:p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#240a38] via-[#170524] to-[#0c0214] border-2 border-amber-400/70 shadow-[0_0_40px_rgba(245,158,11,0.35)] text-center my-auto"
          >
            <div className="flex items-center justify-center gap-1.5 text-amber-300 font-serif font-bold text-xs sm:text-sm mb-3 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>FELICIDADES</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            {/* LAS TRES FRASES JUNTAS CON "PERO YO QUIERO" INCLUIDO */}
            <div className="space-y-3.5 py-4 px-3 sm:px-6 rounded-xl sm:rounded-2xl bg-purple-950/50 border border-amber-400/30 my-3 shadow-inner">
              {/* Frase 1 */}
              <p className="font-serif text-base sm:text-2xl md:text-3xl font-bold tracking-widest text-amber-200 text-gold-glow uppercase">
                PERDÓNAME LUISA
              </p>

              <div className="w-10 sm:w-14 h-[1px] bg-amber-400/40 mx-auto" />

              {/* Frase 2 */}
              <p className="font-serif text-base sm:text-2xl md:text-3xl font-bold tracking-widest text-amber-200 text-gold-glow uppercase">
                EL AMOR NOS VUELVE PENDEJOS
              </p>

              <div className="w-10 sm:w-14 h-[1px] bg-amber-400/40 mx-auto" />

              {/* Frase 3 con el complemento "pero yo quiero" que solicitó el usuario */}
              <div className="flex flex-col items-center">
                <span className="font-serif italic text-xs sm:text-base md:text-lg text-amber-300/85 mb-0.5 tracking-wider lowercase">
                  ...y yo quiero...
                </span>
                <p className="font-serif text-base sm:text-2xl md:text-3xl font-bold tracking-widest text-amber-200 text-gold-glow uppercase">
                  APRENDER A QUERERTE
                </p>
              </div>
            </div>

            <p className="text-[11px] sm:text-xs md:text-sm text-purple-200/90 font-serif italic max-w-md mx-auto my-3 sm:my-4 leading-relaxed">
              "Espero que me entiendas"
            </p>

            {/* Botón para pasar a la carta secreta final */}
            <button
              onClick={onSolved}
              className="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-purple-950 font-serif font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <Heart className="w-4 h-4 text-rose-700 fill-rose-700" />
              <span>Continuar</span>
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
