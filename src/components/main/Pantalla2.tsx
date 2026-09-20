import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ComponenteCentro } from './ComponenteCentro';
import { ComponenteItem } from './ComponenteItem';
import { EstrellasSecretas } from '../ambient/EstrellasSecretas';
import { birthdayContent } from '../../data/birthdayContent';
import { notificarModuloDesbloqueado } from '../../services/emailNotification';

interface Pantalla2Props {
  onOpenModal: (modal: 'modulo1' | 'modulo2' | 'modulo3' | 'modulo4') => void;
  onOpenEasterEgg?: () => void;
  showEasterEgg?: boolean;
}

export const Pantalla2: React.FC<Pantalla2Props> = ({
  onOpenModal,
  onOpenEasterEgg,
  showEasterEgg = true,
}) => {
  const tastes = birthdayContent?.tastes;
  const normalLetter = birthdayContent?.normalLetter;

  const [isSecretUnlocked, setIsSecretUnlocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('luisa_collected_stars_v3');
      const count = saved ? JSON.parse(saved).length : 0;
      return count >= 3;
    } catch {
      return false;
    }
  });

  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);

  // Escuchar recarga de estrellas desde el botón de pruebas
  useEffect(() => {
    const handleReload = () => {
      setIsSecretUnlocked(false);
      setIsHighlighted(false);
    };
    window.addEventListener('luisa_reload_stars', handleReload);
    return () => window.removeEventListener('luisa_reload_stars', handleReload);
  }, []);

  const handleUnlock = () => {
    setIsSecretUnlocked(true);
    setIsHighlighted(true);
    notificarModuloDesbloqueado();

    // Mantener el icono resaltado varios segundos para que llame la atención
    setTimeout(() => {
      setIsHighlighted(false);
    }, 7000);
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-evenly gap-y-2 xs:gap-y-3 sm:gap-y-4 md:gap-y-7 px-3 sm:px-6 pt-14 xs:pt-16 sm:pt-20 md:pt-4 pb-2 sm:pb-6 z-20 overflow-x-hidden overflow-y-auto">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] sm:w-[50rem] h-[30rem] sm:h-[50rem] rounded-full bg-gradient-to-r from-purple-900/20 via-violet-800/15 to-transparent blur-3xl pointer-events-none" />

      {/* 3 ESTRELLAS FIJAS EN EL FONDO (Persistentes por dispositivo) */}
      <EstrellasSecretas onUnlock={handleUnlock} />

      {/* TOP: PORTRAIT */}
      <div className="w-full flex justify-center mt-1 sm:mt-2 md:mt-4 lg:mt-6 mb-0.5 sm:mb-2 md:mb-4 shrink-0">
        <ComponenteCentro onClick={() => onOpenModal('modulo4')} />
      </div>

      {/* 4 MAIN ICONS: 2x2 en móviles, fila horizontal en escritorio */}
      <div className="w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-6xl lg:max-w-7xl xl:max-w-[88rem] mx-auto grid grid-cols-2 md:flex md:flex-row items-center justify-items-center justify-center gap-x-6 xs:gap-x-8 sm:gap-x-12 md:gap-8 lg:gap-14 xl:gap-20 gap-y-3 xs:gap-y-4 sm:gap-y-6 px-2 sm:px-6 md:px-8 shrink-0">
        {/* 1. GUSTOS (MODULO 1) */}
        <ComponenteItem
          id="tastes"
          variant="tastes"
          title={tastes?.title ? "Tus Gustos" : "Gustos"}
          subtitle=""
          onClick={() => onOpenModal('modulo1')}
          floatDelay={0.2}
          initialOffset={{ x: -20, y: 15 }}
        />

        {/* 2. CARTA (MODULO 2) */}
        <ComponenteItem
          id="letter"
          variant="letter"
          title={normalLetter?.title || "Carta personalizada"}
          subtitle=""
          onClick={() => onOpenModal('modulo2')}
          floatDelay={0.4}
          initialOffset={{ x: 20, y: 15 }}
        />

        {/* 3. RECUERDOS (MODULO 3) */}
        <ComponenteItem
          id="memories"
          variant="memories"
          title="Recuerdos"
          subtitle=""
          onClick={() => onOpenModal('modulo3')}
          floatDelay={0.6}
          initialOffset={{ x: -20, y: 15 }}
        />

        {/* 4. ? (MISTERIO DE LAS 3 CARDS) */}
        {showEasterEgg && (
          <ComponenteItem
            id="easter-egg"
            variant="easter-egg"
            title="?"
            subtitle=""
            isLocked={!isSecretUnlocked}
            isHighlighted={isHighlighted}
            onClick={() => {
              notificarModuloDesbloqueado();
              onOpenEasterEgg?.();
            }}
            floatDelay={0.8}
            initialOffset={{ x: 20, y: 15 }}
          />
        )}
      </div>

      {/* Caption at bottom */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-1 sm:mt-3 md:mt-6 mb-1 sm:mb-2 md:mb-4 text-center font-serif text-yellow-300 text-xs xs:text-sm md:text-base lg:text-lg xl:text-xl font-bold tracking-wider md:tracking-[0.2em] uppercase text-gold-glow drop-shadow-[0_2px_12px_rgba(245,158,11,0.7)] px-4 max-w-2xl mx-auto leading-relaxed shrink-0"
      >
        Da click en algún icono
      </motion.p>
    </div>
  );
};
