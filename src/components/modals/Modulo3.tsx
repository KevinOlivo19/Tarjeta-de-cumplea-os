import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Maximize2, Sparkles, BookOpen } from 'lucide-react';
import { birthdayContent } from '../../data/birthdayContent';
import { soundEngine } from '../../utils/soundSynth';

interface Modulo3Props {
  onClose: () => void;
}

// Mapea la ruta de la imagen original a su miniatura ultraliviana (reduce 50MB a 0.5MB)
const getThumbnailUrl = (imgUrl: string) => {
  const match = imgUrl.match(/(?:img\/)?(img\d+)\.(png|jpe?g)$/i);
  if (match) {
    return `/img/thumbs/${match[1]}.jpg`;
  }
  return imgUrl;
};

export const Modulo3: React.FC<Modulo3Props> = ({ onClose }) => {
  const { memories, memoriesHeader } = birthdayContent;
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<number>(0);
  const [showTextModal, setShowTextModal] = useState<boolean>(false);

  // Evitar saltos dobles (brincos de dos en dos) al deslizar
  const isNavigatingRef = useRef(false);

  // Navegación en el visor de foto grande
  const handlePrevPhoto = useCallback(() => {
    if (selectedPhotoIndex === null || isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 280);

    setDirection(-1);
    setSelectedPhotoIndex((prev) => (prev! - 1 + memories.length) % memories.length);
    soundEngine.playHoverChime();
  }, [memories.length, selectedPhotoIndex]);

  const handleNextPhoto = useCallback(() => {
    if (selectedPhotoIndex === null || isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 280);

    setDirection(1);
    setSelectedPhotoIndex((prev) => (prev! + 1) % memories.length);
    soundEngine.playHoverChime();
  }, [memories.length, selectedPhotoIndex]);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showTextModal) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setShowTextModal(false);
        }
        return;
      }

      if (selectedPhotoIndex !== null) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevPhoto();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextPhoto();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setSelectedPhotoIndex(null);
        }
      } else {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevPhoto, handleNextPhoto, selectedPhotoIndex, showTextModal, onClose]);

  // Pre-carga fluida de fotos adyacentes para que el swipe sea instantáneo y sin lag
  useEffect(() => {
    if (selectedPhotoIndex === null) return;
    const nextIdx = (selectedPhotoIndex + 1) % memories.length;
    const prevIdx = (selectedPhotoIndex - 1 + memories.length) % memories.length;
    const imgNext = new Image();
    imgNext.src = memories[nextIdx].image;
    const imgPrev = new Image();
    imgPrev.src = memories[prevIdx].image;
  }, [selectedPhotoIndex, memories]);

  const mainModalTouchStartY = useRef<number>(0);

  const selectedMemory = selectedPhotoIndex !== null ? memories[selectedPhotoIndex] : null;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. VISTA PRINCIPAL: TODAS LAS IMÁGENES EN FILAS (PANTALLA COMPLETA)       */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 z-[100] bg-[#060112]/96 flex items-center justify-center p-0.5 sm:p-2 md:p-3 overflow-hidden select-none">
        {/* Fondo con clic para cerrar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        {/* Tarjeta de la Galería Completa ocupando la pantalla optimizada para móvil */}
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.98, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 340 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.05, bottom: 0.5 }}
          onDragEnd={(_e, info) => {
            if (info.offset.y > 65 || info.velocity.y > 250) {
              soundEngine.playModalClose();
              onClose();
            }
          }}
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, #1a0833 0%, #0d031c 65%, #070110 100%)',
          }}
          className="relative z-10 w-full h-[100dvh] sm:h-full max-w-[100vw] sm:max-w-[99vw] max-h-[100dvh] sm:max-h-[98dvh] flex flex-col rounded-none sm:rounded-3xl p-2 pt-7 sm:pt-5 md:p-6 border-0 sm:border border-amber-400/40 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden mx-auto"
        >
          {/* Indicador de arrastrar hacia abajo para cerrar en móvil */}
          <div
            className="md:hidden absolute top-1.5 left-0 right-0 flex justify-center py-1 z-30 cursor-grab active:cursor-grabbing touch-none"
            onTouchStart={(e) => {
              mainModalTouchStartY.current = e.touches[0].clientY;
            }}
            onTouchEnd={(e) => {
              const deltaY = e.changedTouches[0].clientY - mainModalTouchStartY.current;
              if (deltaY > 50) {
                soundEngine.playModalClose();
                onClose();
              }
            }}
          >
            <div className="w-12 h-1 rounded-full bg-amber-300/40" />
          </div>

          {/* Tacha de cerrar modal arriba a la derecha */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-[#150727]/90 border border-amber-400/60 text-amber-300 hover:text-white hover:bg-purple-900 hover:scale-105 active:scale-95 transition-all duration-150 shadow-[0_0_12px_rgba(251,191,36,0.35)] cursor-pointer z-30"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Contenedor principal con SCROLL FLUIDO NATIVO */}
          <div
            className="flex-1 overflow-y-auto px-1 py-1 pr-1.5 custom-scrollbar"
            style={{
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
            }}
          >
            {/* Encabezado compacto */}
            <div className="w-full pt-0.5 pb-2 mb-2 border-b border-purple-500/25 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-full max-w-none md:max-w-6xl flex flex-col items-center justify-center text-center mx-auto">
                <h2 className="font-serif text-base xs:text-lg sm:text-2xl md:text-3xl font-bold text-amber-200 tracking-wide text-gold-glow text-center">
                  {memoriesHeader?.title || "Álbum de Recuerdos"}
                </h2>

                {/* BOTÓN LÉEME: Abre el modal con el mensaje */}
                {memoriesHeader?.subtitle && (
                  <button
                    onClick={() => {
                      setShowTextModal(true);
                      soundEngine.playHoverChime();
                    }}
                    className="mt-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-purple-950 via-[#280a4d] to-purple-950 border border-amber-400/75 text-amber-200 hover:text-white font-serif text-xs xs:text-sm font-semibold tracking-wider shadow-[0_0_12px_rgba(251,191,36,0.3)] flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                    <span>Léeme</span>
                    <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                  </button>
                )}
              </div>
            </div>

            {/* Cuadrícula con TODAS las imágenes */}
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3.5 md:gap-4 pb-6">
              {memories.map((memory, idx) => (
                <div
                  key={memory.id}
                  onClick={() => {
                    setSelectedPhotoIndex(idx);
                    soundEngine.playObjectClick();
                  }}
                  style={{ contain: 'paint layout' }}
                  className="group relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#070112] border border-purple-500/30 hover:border-amber-400/90 shadow-sm hover:shadow-[0_0_18px_rgba(251,191,36,0.4)] cursor-pointer active:scale-95 transition-transform duration-150 select-none"
                >
                  {/* Foto miniatura optimizada */}
                  <MemoryPhotoThumbnail key={memory.id} imgUrl={memory.image} title={memory.title} />

                  {/* Gradiente sutil al hacer hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none" />

                  {/* Icono de Ver al pasar el mouse */}
                  <div className="absolute bottom-1.5 right-1.5 z-10">
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1 font-serif text-amber-300 font-medium bg-black/75 px-1.5 py-0.5 rounded border border-amber-400/30">
                      <Maximize2 className="w-2.5 h-2.5" /> Ver
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEGUNDO MODAL: VISOR DE FOTO GRANDE (FLUIDO, SIN LAG)                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && selectedMemory && (
          <div className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-md flex items-center justify-center p-1 sm:p-3 md:p-6 overflow-hidden select-none">
            {/* Clic al fondo para cerrar con difuminado suave */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedPhotoIndex(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-md"
            />

            {/* Flecha Izquierda Flotante en Desktop */}
            <button
              onClick={handlePrevPhoto}
              className="hidden md:flex fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-[130] p-2.5 sm:p-3.5 rounded-full bg-[#120524]/90 hover:bg-purple-900 border border-amber-400/60 text-amber-300 hover:text-white hover:scale-110 active:scale-90 transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)] cursor-pointer items-center justify-center"
              aria-label="Foto anterior"
              title="Foto anterior"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>

            {/* Flecha Derecha Flotante en Desktop */}
            <button
              onClick={handleNextPhoto}
              className="hidden md:flex fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[130] p-2.5 sm:p-3.5 rounded-full bg-[#120524]/90 hover:bg-purple-900 border border-amber-400/60 text-amber-300 hover:text-white hover:scale-110 active:scale-90 transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)] cursor-pointer items-center justify-center"
              aria-label="Foto siguiente"
              title="Foto siguiente"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>

            {/* Tarjeta del Visor adaptada a dvh móvil con Swipe fluido hacia abajo */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 340 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.05, bottom: 0.4 }}
              onDragEnd={(_e, info) => {
                if (info.offset.y > 60 || info.velocity.y > 250) {
                  soundEngine.playModalClose();
                  setSelectedPhotoIndex(null);
                }
              }}
              className="relative z-10 w-full max-w-[99vw] sm:max-w-[92vw] md:max-w-3xl max-h-[calc(100dvh-10px)] flex flex-col items-center rounded-2xl sm:rounded-3xl glass-panel-glow p-1.5 sm:p-3 border border-amber-400/50 shadow-[0_0_40px_rgba(0,0,0,0.95)] overflow-hidden mx-auto"
            >
              {/* Barra de agarre para deslizar hacia abajo en móvil */}
              <div
                onClick={() => setSelectedPhotoIndex(null)}
                className="w-12 h-1 rounded-full bg-amber-300/40 mx-auto -mt-0.5 mb-1.5 md:hidden cursor-pointer"
              />

              {/* Barra superior compacta */}
              <div className="w-full flex items-center justify-between pb-1 mb-1 border-b border-purple-500/25 px-1.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-[11px] sm:text-xs text-amber-200/95 tracking-wider font-semibold uppercase">
                    Foto {selectedPhotoIndex + 1} de {memories.length}
                  </span>
                  <span className="md:hidden text-[10px] text-amber-300/60 font-serif italic">
                    • desliza
                  </span>
                </div>

                {/* Tacha para cerrar */}
                <button
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="p-1 sm:p-1.5 rounded-full bg-[#150727]/90 border border-amber-400/60 text-amber-300 hover:text-white hover:bg-purple-900 active:scale-95 transition-all shadow-[0_0_10px_rgba(251,191,36,0.3)] cursor-pointer"
                  aria-label="Cerrar visor"
                  title="Volver"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Contenedor con Swipe instantáneo en móvil (popLayout sin retraso) */}
              <div className="relative flex items-center justify-center rounded-xl sm:rounded-2xl overflow-hidden w-full flex-1 min-h-0">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={selectedMemory.id}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -direction * 40 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_e, info) => {
                      const swipeThreshold = 40;
                      if (info.offset.x > swipeThreshold || info.velocity.x > 250) {
                        handlePrevPhoto();
                      } else if (info.offset.x < -swipeThreshold || info.velocity.x < -250) {
                        handleNextPhoto();
                      }
                    }}
                    className="w-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none"
                  >
                    {/* Imagen ampliada */}
                    <div className="relative rounded-xl overflow-hidden bg-[#070110] border border-purple-500/30 shadow-2xl flex items-center justify-center">
                      <MemoryPhotoLarge
                        imgUrl={selectedMemory.image}
                        title={selectedMemory.title}
                        hasText={Boolean(selectedMemory.title || selectedMemory.text)}
                      />
                    </div>

                    {/* Descripción debajo de la foto */}
                    {(selectedMemory.title || selectedMemory.text) && (
                      <div className="w-full max-w-sm xs:max-w-md sm:max-w-xl mt-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-[#120524]/95 border border-amber-400/40 text-center shadow-lg shrink-0">
                        {selectedMemory.title && (
                          <h3 className="font-serif text-[11px] sm:text-xs md:text-sm font-bold text-amber-200 mb-0.5 tracking-wide">
                            {selectedMemory.title}
                          </h3>
                        )}
                        {selectedMemory.text && (
                          <p className="font-serif text-xs xs:text-[13px] sm:text-sm leading-snug sm:leading-relaxed text-amber-100/95 font-medium text-center">
                            {selectedMemory.text}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 3. MODAL DE TEXTO "LÉEME" (ÚNICAMENTE EN TELÉFONO)                         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showTextModal && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-3.5 sm:p-6 select-none">
            {/* Backdrop con blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTextModal(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Card con soporte de arrastrar para cerrar */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.05, bottom: 0.6 }}
              onDragEnd={(_e, info) => {
                if (info.offset.y > 60 || info.velocity.y > 250) {
                  soundEngine.playModalClose();
                  setShowTextModal(false);
                }
              }}
              className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl sm:rounded-3xl glass-panel-glow border border-amber-400/50 p-3.5 xs:p-5 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.95)] overflow-hidden mx-auto text-purple-100"
            >
              {/* Barra de agarre para deslizar en móvil */}
              <div className="w-10 h-1 rounded-full bg-amber-300/40 mx-auto -mt-1 mb-2 md:hidden" />

              {/* Header con Tacha */}
              <div className="flex items-center justify-between border-b border-purple-500/25 pb-2.5 mb-3">
                <div className="flex items-center gap-2 text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="font-serif text-sm xs:text-base font-bold text-amber-200 tracking-wide text-gold-glow">
                    {memoriesHeader?.title || "Álbum de Recuerdos"}
                  </span>
                </div>
                <button
                  onClick={() => setShowTextModal(false)}
                  className="p-1.5 rounded-full bg-[#150727]/90 border border-amber-400/60 text-amber-300 hover:text-white hover:bg-purple-900 transition-all shadow-[0_0_12px_rgba(251,191,36,0.3)] cursor-pointer"
                  aria-label="Cerrar mensaje"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Contenido con scroll */}
              <div className="overflow-y-auto custom-scrollbar pr-1.5 max-h-[65vh] space-y-3.5 sm:space-y-4">
                {memoriesHeader?.subtitle?.split('\n\n').map((paragraph, index) => (
                  <p
                    key={index}
                    className="font-serif text-xs xs:text-sm sm:text-base leading-relaxed text-purple-100/95 font-light text-justify"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Botón inferior de cerrar */}
              <div className="mt-4 pt-3 border-t border-purple-500/20 flex justify-center">
                <button
                  onClick={() => setShowTextModal(false)}
                  className="px-6 py-1.5 rounded-full bg-purple-900/80 hover:bg-purple-800 border border-amber-400/60 text-amber-200 hover:text-white text-xs xs:text-sm font-serif tracking-wider shadow-[0_0_15px_rgba(251,191,36,0.3)] active:scale-95 transition-all cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// Miniatura ultraliviana para la cuadrícula
const MemoryPhotoThumbnail: React.FC<{ imgUrl: string; title?: string }> = ({ imgUrl, title }) => {
  const [useFallback, setUseFallback] = useState(false);
  const [error, setError] = useState(false);

  const currentSrc = useFallback ? imgUrl : getThumbnailUrl(imgUrl);

  const handleError = () => {
    if (!useFallback && currentSrc !== imgUrl) {
      // Si la miniatura no existe, cargar la original
      setUseFallback(true);
    } else {
      setError(true);
    }
  };

  if (error || !imgUrl) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-purple-950/30 text-purple-300">
        <ImageIcon className="w-6 h-6 mb-1 opacity-50 text-amber-300" />
        <span className="font-serif text-[9px] text-purple-200 line-clamp-1">
          {title || "Recuerdo"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={title || "Recuerdo"}
      onError={handleError}
      loading="lazy"
      decoding="async"
      className="w-full h-full object-cover transform-gpu pointer-events-none"
    />
  );
};

// Foto grande para el segundo modal (calidad completa)
const MemoryPhotoLarge: React.FC<{ imgUrl: string; title?: string; hasText?: boolean }> = ({ imgUrl, title, hasText }) => {
  const [error, setError] = useState(false);

  if (error || !imgUrl) {
    return (
      <div className="w-64 h-80 sm:w-80 sm:h-96 flex flex-col items-center justify-center p-4 text-center bg-purple-950/20 text-purple-300">
        <ImageIcon className="w-10 h-10 mb-2 opacity-50 text-amber-300" />
        <span className="font-serif text-xs sm:text-sm text-purple-200">
          {title || "Elemento especial"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={imgUrl}
      alt={title || "Elemento"}
      onError={() => setError(true)}
      decoding="async"
      className={`w-auto max-w-[95vw] sm:max-w-[88vw] md:max-w-[80vw] object-contain rounded-xl sm:rounded-2xl filter contrast-[1.03] brightness-[1.02] pointer-events-none transition-all duration-150 ${
        hasText
          ? 'max-h-[48dvh] xs:max-h-[52dvh] sm:max-h-[64dvh] md:max-h-[72dvh]'
          : 'max-h-[68dvh] xs:max-h-[72dvh] sm:max-h-[78dvh] md:max-h-[82dvh]'
      }`}
    />
  );
};
