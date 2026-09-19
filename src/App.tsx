import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FondoCanvas } from './components/ambient/FondoCanvas';
import { CapaEfectos } from './components/ambient/CapaEfectos';
import { CursorEfecto } from './components/ambient/CursorEfecto';
import { Pantalla1 } from './components/gift/Pantalla1';
import { PantallaCumple } from './components/birthday/PantallaCumple';
import { Pantalla2 } from './components/main/Pantalla2';
import { Pantalla3 } from './components/easterEgg/Pantalla3';
import { Pantalla4 } from './components/secret/Pantalla4';
import { Modulo1 } from './components/modals/Modulo1';
import { Modulo2 } from './components/modals/Modulo2';
import { Modulo3 } from './components/modals/Modulo3';
import { Modulo4 } from './components/modals/Modulo4';
import { useAudioController } from './hooks/useAudioController';
import { useNotification } from './hooks/useNotification';
import { Volume2, VolumeX, Gift, Cake } from 'lucide-react';

type AppPhase = 'pantalla1' | 'pantalla_cumple' | 'pantalla2' | 'pantalla3' | 'pantalla4';
type ModalType = 'modulo1' | 'modulo2' | 'modulo3' | 'modulo4' | null;

const phaseMap: Record<string, AppPhase> = {
  box: 'pantalla1',
  pantalla1: 'pantalla1',
  cumple: 'pantalla_cumple',
  pantalla_cumple: 'pantalla_cumple',
  universe: 'pantalla2',
  pantalla2: 'pantalla2',
  easter_egg: 'pantalla3',
  pantalla3: 'pantalla3',
  secret_letter: 'pantalla4',
  pantalla4: 'pantalla4',
};

const modalMap: Record<string, ModalType> = {
  tastes: 'modulo1',
  modulo1: 'modulo1',
  letter: 'modulo2',
  modulo2: 'modulo2',
  memories: 'modulo3',
  modulo3: 'modulo3',
  portrait: 'modulo4',
  modulo4: 'modulo4',
};

export const App: React.FC = () => {
  const [phase, setPhaseState] = useState<AppPhase>(() => {
    const saved = localStorage.getItem('luisa_experience_phase');
    if (saved && phaseMap[saved]) {
      return phaseMap[saved];
    }
    return 'pantalla1';
  });

  const [activeModal, setActiveModalState] = useState<ModalType>(() => {
    const saved = localStorage.getItem('luisa_active_modal');
    if (saved && modalMap[saved]) {
      return modalMap[saved];
    }
    return null;
  });

  const [, setBoxStepState] = useState<number>(() => {
    const saved = localStorage.getItem('luisa_box_step');
    return saved ? Number(saved) : 0;
  });

  const {
    isMuted,
    setStageVolume,
    toggleMute,
    startSecretAudio,
  } = useAudioController();

  const { notifyEasterEggSolved, notifySecretLetterOpened } = useNotification();

  const setPhase = (newPhase: AppPhase) => {
    setPhaseState(newPhase);
    localStorage.setItem('luisa_experience_phase', newPhase);
  };

  const setActiveModal = (modal: ModalType) => {
    setActiveModalState(modal);
    if (modal) {
      localStorage.setItem('luisa_active_modal', modal);
    } else {
      localStorage.removeItem('luisa_active_modal');
    }
  };

  const setBoxStep = (step: number) => {
    setBoxStepState(step);
    localStorage.setItem('luisa_box_step', String(step));
  };

  useEffect(() => {
    if (phase !== 'pantalla1') {
      setStageVolume(3);
    }
  }, [phase, setStageVolume]);

  const handleBoxStepChange = (step: number) => {
    setBoxStep(step);
    setStageVolume(step);
  };

  const handleBoxOpened = () => {
    setPhase('pantalla_cumple');
  };

  const handleEasterEggSolved = () => {
    notifyEasterEggSolved();
    setPhase('pantalla4');
  };

  const handleSecretLetterClose = () => {
    setPhase('pantalla2');
  };

  const handleSecretAudioTrigger = () => {
    startSecretAudio();
    notifySecretLetterOpened();
  };

  const handleResetExperience = () => {
    localStorage.removeItem('luisa_experience_phase');
    localStorage.removeItem('luisa_active_modal');
    localStorage.removeItem('luisa_box_step');
    setPhaseState('pantalla1');
    setActiveModalState(null);
    setBoxStepState(0);
    setStageVolume(0);
  };

  return (
    <main className="relative min-h-screen w-full bg-[#030107] text-[#f5f2fa] overflow-x-hidden font-sans">
      <FondoCanvas isPaused={Boolean(activeModal)} />
      <CapaEfectos />
      {!activeModal && <CursorEfecto />}

      {/* Floating Navigation & Audio Dock (Top Left) - Botones adaptados según la pantalla activa */}
      {(() => {
        const showGift = phase === 'pantalla2' || phase === 'pantalla3' || phase === 'pantalla4' || Boolean(activeModal);
        const showCake = phase !== 'pantalla1';
        const showHome = phase === 'pantalla3' || phase === 'pantalla4' || Boolean(activeModal);
        const showVolume = true;

        return (
          <div className={`fixed top-2 left-2 sm:top-3 sm:left-3 md:top-5 md:left-5 z-[110] items-center gap-1 sm:gap-1.5 bg-[#0d031e]/90 backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-purple-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.85)] ${activeModal ? 'hidden md:flex' : 'flex'}`}>
            <AnimatePresence mode="popLayout">
              {/* 1. REGRESAR AL REGALO */}
              {showGift && (
                <motion.button
                  key="dock-gift"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveModal(null);
                    handleResetExperience();
                  }}
                  className="p-1.5 sm:p-2 md:px-3.5 md:py-1.5 rounded-full border transition-all flex items-center gap-1.5 text-xs sm:text-sm font-serif bg-purple-950/90 hover:bg-purple-900 border-amber-400/60 text-amber-200 hover:text-white shadow-[0_0_10px_rgba(251,191,36,0.2)] cursor-pointer"
                  title="Regresar a abrir el regalo"
                  aria-label="Regresar al regalo"
                >
                  <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
                  <span className="hidden md:inline font-medium">Regalo</span>
                </motion.button>
              )}

              {/* 2. REGRESAR A PANTALLA CUMPLE / TARJETA (PASTEL) */}
              {showCake && (
                <motion.button
                  key="dock-cake"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: phase !== 'pantalla_cumple' || Boolean(activeModal) ? 1.05 : 1 }}
                  whileTap={{ scale: phase !== 'pantalla_cumple' || Boolean(activeModal) ? 0.95 : 1 }}
                  onClick={() => {
                    if (phase !== 'pantalla_cumple' || activeModal) {
                      setActiveModal(null);
                      setPhase('pantalla_cumple');
                    }
                  }}
                  className={`p-1.5 sm:p-2 md:px-3.5 md:py-1.5 rounded-full border transition-all flex items-center gap-1.5 text-xs sm:text-sm font-serif ${
                    phase === 'pantalla_cumple' && !activeModal
                      ? 'bg-pink-900/60 border-pink-400/80 text-pink-200 shadow-[0_0_10px_rgba(244,63,94,0.3)] cursor-default'
                      : 'bg-purple-950/90 hover:bg-pink-950/90 border-pink-400/60 text-pink-200 hover:text-white shadow-[0_0_10px_rgba(244,63,94,0.2)] cursor-pointer'
                  }`}
                  title="Ver felicitación de cumpleaños"
                  aria-label="Ver felicitación de cumpleaños"
                >
                  <Cake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-300 shrink-0" />
                  <span className="hidden md:inline font-medium">Cumple</span>
                </motion.button>
              )}

              {/* 3. REGRESAR AL INICIO (LOS 4 ICONOS) */}
              {showHome && (
                <motion.button
                  key="dock-home"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveModal(null);
                    if (phase !== 'pantalla2') {
                      setPhase('pantalla2');
                    }
                  }}
                  className="p-1.5 sm:p-2 md:px-3.5 md:py-1.5 rounded-full border transition-all flex items-center gap-1.5 text-xs sm:text-sm font-serif bg-purple-950/90 hover:bg-violet-900 border-amber-400/60 text-amber-200 hover:text-white shadow-[0_0_10px_rgba(251,191,36,0.2)] cursor-pointer"
                  title="Ir al inicio (4 módulos)"
                  aria-label="Ir al inicio (4 módulos)"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span className="hidden md:inline font-medium">Inicio</span>
                </motion.button>
              )}

              {/* 4. SILENCIAR / ACTIVAR MÚSICA */}
              {showVolume && (
                <motion.button
                  key="dock-volume"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMute}
                  className={`p-1.5 sm:p-2 md:px-3.5 md:py-1.5 rounded-full border transition-all flex items-center gap-1.5 text-xs sm:text-sm font-serif cursor-pointer ${
                    isMuted
                      ? 'bg-red-950/90 hover:bg-red-900/90 border-red-400/60 text-red-200 hover:text-white shadow-[0_0_10px_rgba(239,68,68,0.25)]'
                      : 'bg-purple-950/90 hover:bg-purple-900/90 border-purple-400/60 text-purple-200 hover:text-white shadow-[0_0_10px_rgba(168,85,247,0.25)]'
                  }`}
                  title={isMuted ? "Activar música" : "Silenciar música"}
                  aria-label={isMuted ? "Activar música" : "Silenciar música"}
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-300 shrink-0" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300 shrink-0" />
                  )}
                  <span className="hidden md:inline font-medium">{isMuted ? "Mudo" : "Música"}</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

        );
      })()}

      {/* Main Experience Phases */}
      <AnimatePresence mode="wait">
        {phase === 'pantalla1' && (
          <motion.section
            key="pantalla1-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="relative z-10"
          >
            <Pantalla1
              onOpen={handleBoxOpened}
              onStepChange={handleBoxStepChange}
            />
          </motion.section>
        )}

        {phase === 'pantalla_cumple' && (
          <motion.section
            key="pantalla_cumple-section"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.8 } }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <PantallaCumple onContinue={() => setPhase('pantalla2')} />
          </motion.section>
        )}

        {phase === 'pantalla2' && (
          <motion.section
            key="pantalla2-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="relative z-10"
          >
            <Pantalla2
              onOpenModal={(modal) => setActiveModal(modal)}
              onOpenEasterEgg={() => setPhase('pantalla3')}
              showEasterEgg={true}
            />
          </motion.section>
        )}

        {phase === 'pantalla3' && (
          <motion.section
            key="pantalla3-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10"
          >
            <Pantalla3
              onClose={() => setPhase('pantalla2')}
              onSolved={handleEasterEggSolved}
            />
          </motion.section>
        )}

        {phase === 'pantalla4' && (
          <motion.section
            key="pantalla4-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10"
          >
            <Pantalla4
              onClose={handleSecretLetterClose}
              onSecretAudioTrigger={handleSecretAudioTrigger}
            />
          </motion.section>
        )}
      </AnimatePresence>

      {/* Active Modals */}
      <AnimatePresence>
        {activeModal === 'modulo1' && (
          <Modulo1 onClose={() => setActiveModal(null)} />
        )}
        {activeModal === 'modulo2' && (
          <Modulo2 onClose={() => setActiveModal(null)} />
        )}
        {activeModal === 'modulo3' && (
          <Modulo3 onClose={() => setActiveModal(null)} />
        )}
        {activeModal === 'modulo4' && (
          <Modulo4 onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </main>
  );
};

export default App;
