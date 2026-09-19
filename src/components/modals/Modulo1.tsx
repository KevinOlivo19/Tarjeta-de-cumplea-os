import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { birthdayContent } from '../../data/birthdayContent';
import { soundEngine } from '../../utils/soundSynth';

interface Modulo1Props {
  onClose: () => void;
}

export const Modulo1: React.FC<Modulo1Props> = ({ onClose }) => {
  const { tastes } = birthdayContent;
  const items = tastes.items.filter(item => item.title && item.title.trim().length > 0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [mobilePhotoIndex, setMobilePhotoIndex] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setMobilePhotoIndex(0);
    soundEngine.playHoverChime();
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setMobilePhotoIndex(0);
    soundEngine.playHoverChime();
  }, [items.length]);

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide, onClose]);

  const currentItem = items[currentIndex] || tastes.items[0];

  // Auto-cambio cada 4 segundos en móvil
  useEffect(() => {
    const timer = setInterval(() => {
      setMobilePhotoIndex((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const displayImages = (currentItem.images && currentItem.images.length === 4)
    ? currentItem.images
    : (currentItem.images && currentItem.images.length > 0)
      ? [...currentItem.images, ...Array(4 - currentItem.images.length).fill(currentItem.image)].slice(0, 4)
      : [currentItem.image, currentItem.image, currentItem.image, currentItem.image];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2 md:p-3 overflow-hidden select-none">
      {/* Dark backdrop with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 md:backdrop-blur-md"
      />

      {/* Flecha Izquierda Flotante (Solo en Desktop md:) */}
      <button
        onClick={prevSlide}
        className="hidden md:flex fixed left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-[110] p-2.5 sm:p-3.5 rounded-full bg-[#120524]/90 hover:bg-purple-900 border border-amber-400/60 text-amber-300 hover:text-white hover:scale-110 active:scale-90 transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)] cursor-pointer items-center justify-center"
        aria-label="Anterior"
        title="Anterior"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
      </button>

      {/* Flecha Derecha Flotante (Solo en Desktop md:) */}
      <button
        onClick={nextSlide}
        className="hidden md:flex fixed right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-[110] p-2.5 sm:p-3.5 rounded-full bg-[#120524]/90 hover:bg-purple-900 border border-amber-400/60 text-amber-300 hover:text-white hover:scale-110 active:scale-90 transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)] cursor-pointer items-center justify-center"
        aria-label="Siguiente"
        title="Siguiente"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
      </button>

      {/* Modal Card Principal */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 340 }}
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #1a0833 0%, #0d031c 65%, #070110 100%)',
        }}
        className="relative z-10 w-full h-[100dvh] sm:h-full max-w-[100vw] sm:max-w-[99vw] max-h-[100dvh] sm:max-h-[98dvh] flex flex-col rounded-none sm:rounded-3xl p-2 pt-7 sm:pt-5 md:p-6 border-0 sm:border border-amber-400/40 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden mx-auto"
      >
        {/* Barra de agarre para deslizar hacia abajo en móvil */}
        <div
          className="md:hidden absolute top-2 left-0 right-0 flex justify-center py-1.5 z-30 cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={(e) => {
            e.currentTarget.dataset.startY = e.touches[0].clientY.toString();
          }}
          onTouchEnd={(e) => {
            const startY = parseFloat(e.currentTarget.dataset.startY || '0');
            const deltaY = e.changedTouches[0].clientY - startY;
            if (deltaY > 50) {
              soundEngine.playModalClose();
              onClose();
            }
          }}
        >
          <div className="w-12 h-1 rounded-full bg-amber-300/40" />
        </div>

        {/* Barra superior con contador y Tacha */}
        <div className="w-full flex items-center justify-between pb-2 mb-2 sm:mb-3 border-b border-purple-500/25 px-1 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={prevSlide}
              className="md:hidden p-1.5 rounded-full bg-[#150727]/90 border border-amber-400/50 text-amber-300 hover:text-white active:scale-95 transition-all shadow-[0_0_10px_rgba(251,191,36,0.3)]"
              aria-label="Anterior elemento"
            >
              <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <span className="font-serif text-xs sm:text-sm md:text-base text-amber-200/90 tracking-wider font-medium uppercase">
              Elemento {currentIndex + 1} de {items.length} {currentItem.tag ? `• ${currentItem.tag}` : ''}
            </span>
            <button
              onClick={nextSlide}
              className="md:hidden p-1.5 rounded-full bg-[#150727]/90 border border-amber-400/50 text-amber-300 hover:text-white active:scale-95 transition-all shadow-[0_0_10px_rgba(251,191,36,0.3)]"
              aria-label="Siguiente elemento"
            >
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
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

        {/* Contenedor del contenido */}
        <div className="relative flex-1 w-full min-h-0 overflow-hidden flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentItem.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 50 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_e, info) => {
                const swipeThreshold = 40;
                if (info.offset.x > swipeThreshold || info.velocity.x > 250) {
                  prevSlide();
                } else if (info.offset.x < -swipeThreshold || info.velocity.x < -250) {
                  nextSlide();
                }
              }}
              className="w-full h-full min-h-0 flex flex-col md:flex-row items-stretch gap-2 sm:gap-3 md:gap-6 lg:gap-8 cursor-grab active:cursor-grabbing select-none overflow-hidden"
            >
              {/* VISTA MÓVIL (< md): CARRUSEL FIJO EN LA PARTE SUPERIOR */}
              <div className="md:hidden w-full flex flex-col items-center shrink-0 mb-2 px-1">
                <div className="relative w-full h-52 xs:h-60 sm:h-64 rounded-2xl overflow-hidden border border-amber-400/40 shadow-[0_0_30px_rgba(251,191,36,0.25)] bg-[#080212] select-none flex items-center justify-center">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={`${currentItem.id}-${mobilePhotoIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.1, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full flex items-center justify-center p-2"
                    >
                      {/* Fondo ambiental difuminado */}
                      <img
                        src={displayImages[mobilePhotoIndex]}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-115 pointer-events-none select-none"
                      />

                      {/* Imagen nítida completa sin cortes */}
                      <img
                        src={displayImages[mobilePhotoIndex]}
                        alt={currentItem.title}
                        onError={(e) => {
                          const currentSrc = displayImages[mobilePhotoIndex];
                          if (!e.currentTarget.dataset.fallbackApplied && currentItem.image && currentItem.image !== currentSrc) {
                            e.currentTarget.dataset.fallbackApplied = 'true';
                            e.currentTarget.src = currentItem.image;
                          }
                        }}
                        className="relative z-10 max-w-full max-h-full object-contain rounded-xl drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)] filter contrast-105 brightness-105 pointer-events-none select-none"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Borde interior sombreado para acabado estético */}
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] pointer-events-none z-20" />
                </div>
              </div>

              {/* VISTA ESCRITORIO (md:): 4 IMÁGENES EN CUADRÍCULA 2X2 */}
              <div className="hidden md:flex w-full md:w-1/2 h-[44vh] md:h-full min-h-0 shrink-0 md:shrink items-center justify-center">
                <div className="grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3 md:gap-4 w-full h-full p-1">
                  {displayImages.map((imgSrc, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setPreviewImage(imgSrc);
                        soundEngine.playObjectClick();
                      }}
                      className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#0a0316] border border-purple-500/30 hover:border-amber-400/80 shadow-lg hover:shadow-[0_0_25px_rgba(251,191,36,0.35)] transition-all duration-300 group flex items-center justify-center w-full h-full cursor-pointer"
                    >
                      {/* Imagen principal adaptada llenando la tarjeta con zoom al pasar el ratón */}
                      <img
                        src={imgSrc}
                        alt={`${currentItem.title} ${idx + 1}`}
                        onError={(e) => {
                          if (!e.currentTarget.dataset.fallbackApplied && currentItem.image && currentItem.image !== imgSrc) {
                            e.currentTarget.dataset.fallbackApplied = 'true';
                            e.currentTarget.src = currentItem.image;
                          }
                        }}
                        className="w-full h-full object-cover filter contrast-105 brightness-105 transition-transform duration-500 group-hover:scale-108 pointer-events-none drop-shadow-md"
                      />

                      {/* Gradiente sutil inferior con número de foto y botón de expandir */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10 opacity-70 group-hover:opacity-90 transition-opacity" />

                      <span className="absolute bottom-2 right-2 font-mono text-[10px] text-amber-200/90 font-semibold px-2 py-0.5 rounded-md bg-black/75 border border-purple-500/30 z-20 backdrop-blur-sm">
                        #{idx + 1}
                      </span>

                      <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg bg-black/70 text-amber-300 z-20 pointer-events-none">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* MITAD DERECHA / ABAJO EN MÓVIL: TEXTO ADAPTADO A LOS MÁRGENES CON SCROLL INDEPENDIENTE */}
              <div className="w-full md:w-1/2 flex-1 md:h-full min-h-0 flex flex-col justify-start md:justify-center px-1 sm:px-3 md:pl-6 md:pr-16 lg:pr-20 py-2 md:py-6 overflow-y-auto custom-scrollbar">
                <div className="w-full md:my-auto pb-16 md:pb-0">
                  {currentItem.subtitle && (
                    <span className="block font-serif text-xs sm:text-sm md:text-base text-amber-300/80 uppercase tracking-[0.25em] mb-2 sm:mb-3 font-medium">
                      {currentItem.subtitle}
                    </span>
                  )}
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-amber-200 mb-3 sm:mb-4 md:mb-5 tracking-wide text-gold-glow">
                    {currentItem.title}
                  </h2>
                  <div className="w-24 sm:w-36 h-[1.5px] bg-gradient-to-r from-amber-400/80 via-amber-300/40 to-transparent mb-4 sm:mb-6" />
                  <div className="space-y-4 w-full">
                    {currentItem.message.split('\n\n').map((paragraph, pIdx) => (
                      <p
                        key={pIdx}
                        className="font-serif text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed sm:leading-loose text-purple-100/90 font-light text-justify [text-align-last:left]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modal de Previsualización en Grande al hacer clic en una foto en PC */}
      <AnimatePresence>
        {previewImage && (
          <div
            className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none"
            onClick={() => setPreviewImage(null)}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 sm:p-2.5 rounded-full bg-[#150727]/90 border border-amber-400/60 text-amber-300 hover:text-white hover:bg-purple-900 transition-all z-50 cursor-pointer shadow-lg"
              aria-label="Cerrar vista previa"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center p-2 rounded-2xl bg-[#090214] border border-amber-400/40 shadow-[0_0_50px_rgba(0,0,0,0.95)] overflow-hidden"
            >
              <img
                src={previewImage}
                alt="Vista ampliada"
                className="max-w-[85vw] max-h-[85vh] w-auto h-auto object-contain rounded-xl filter contrast-105 brightness-105 pointer-events-none"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
