import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import { soundEngine } from '../../utils/soundSynth';

interface PantallaCumpleProps {
  onContinue: () => void;
}

// Confeti festivo cayendo
const CONFETTI_PIECES = Array.from({ length: 45 }, (_, i) => ({
  id: i,
  x: (i * 23) % 100, // porcentaje horizontal
  color: ['#fde047', '#f472b6', '#38bdf8', '#c084fc', '#4ade80', '#fb923c', '#e879f9'][i % 7],
  size: (i % 3) * 3 + 6,
  duration: 3.5 + (i % 5) * 0.8,
  delay: (i % 10) * 0.35,
  isCircle: i % 2 === 0,
}));

// Globos flotantes
const BALLOONS = [
  { id: 1, color: 'from-amber-400 to-amber-600', shadow: 'rgba(251,191,36,0.5)', left: '5%', bottom: '-10%', delay: 0.2, duration: 6, size: 'w-16 h-20 sm:w-24 sm:h-28' },
  { id: 2, color: 'from-rose-400 to-pink-600', shadow: 'rgba(244,63,94,0.5)', left: '15%', bottom: '-15%', delay: 0.8, duration: 7, size: 'w-14 h-18 sm:w-20 sm:h-26' },
  { id: 3, color: 'from-purple-400 to-indigo-600', shadow: 'rgba(168,85,247,0.5)', left: '80%', bottom: '-12%', delay: 0.4, duration: 6.5, size: 'w-16 h-20 sm:w-22 sm:h-28' },
  { id: 4, color: 'from-cyan-400 to-blue-600', shadow: 'rgba(56,189,248,0.5)', left: '88%', bottom: '-8%', delay: 1.1, duration: 7.2, size: 'w-14 h-18 sm:w-20 sm:h-24' },
];

export const PantallaCumple: React.FC<PantallaCumpleProps> = ({ onContinue }) => {
  const handleContinue = () => {
    soundEngine.playSecretUnlocked();
    onContinue();
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 md:pt-6 z-20 overflow-x-hidden overflow-y-auto select-none">
      {/* Luces de fondo festivas */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] sm:w-[45rem] h-[32rem] sm:h-[45rem] rounded-full bg-gradient-to-r from-pink-600/20 via-purple-600/25 to-amber-500/20 blur-3xl pointer-events-none" />

      {/* Confeti animado continuo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {CONFETTI_PIECES.map((c) => (
          <motion.div
            key={c.id}
            initial={{ y: -20, x: `${c.x}vw`, opacity: 0, rotate: 0 }}
            animate={{
              y: '110vh',
              opacity: [0, 1, 1, 0],
              rotate: 360 * (c.id % 2 === 0 ? 2 : -2),
            }}
            transition={{
              duration: c.duration,
              repeat: Infinity,
              delay: c.delay,
              ease: 'linear',
            }}
            style={{
              backgroundColor: c.color,
              width: c.size,
              height: c.isCircle ? c.size : c.size * 1.6,
              borderRadius: c.isCircle ? '9999px' : '2px',
            }}
            className="absolute shadow-sm"
          />
        ))}
      </div>

      {/* Globos flotantes en los laterales */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-15">
        {BALLOONS.map((b) => (
          <motion.div
            key={b.id}
            initial={{ y: 80, opacity: 0 }}
            animate={{
              y: [-15, 15, -15],
              x: [-6, 6, -6],
              opacity: 0.92,
            }}
            transition={{
              y: { duration: b.duration, repeat: Infinity, ease: 'easeInOut', delay: b.delay },
              x: { duration: b.duration * 0.8, repeat: Infinity, ease: 'easeInOut', delay: b.delay * 0.5 },
              opacity: { duration: 1, delay: b.delay },
            }}
            style={{ left: b.left, bottom: b.bottom }}
            className="absolute flex flex-col items-center"
          >
            {/* Globo con degradado y brillo */}
            <div
              className={`${b.size} rounded-full bg-gradient-to-br ${b.color} relative shadow-2xl flex items-center justify-center`}
              style={{
                borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                boxShadow: `0 10px 25px ${b.shadow}`,
              }}
            >
              {/* Brillo de luz del globo */}
              <div className="absolute top-2 left-3 w-3 sm:w-4 h-5 sm:h-7 bg-white/40 rounded-full blur-[1px] -rotate-12" />
              {/* Nudo */}
              <div className="absolute -bottom-1.5 w-2.5 h-2 bg-inherit rounded-sm" />
            </div>
            {/* Cuerda del globo */}
            <div className="w-[1.5px] h-20 sm:h-28 bg-neutral-300/40 mt-1" />
          </motion.div>
        ))}
      </div>

      {/* Tarjeta Principal de Cumpleaños */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: -20 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className="relative z-20 w-full max-w-xl sm:max-w-2xl rounded-3xl glass-panel-glow border-2 border-amber-400/60 p-5 xs:p-6 sm:p-9 md:p-10 shadow-[0_0_60px_rgba(245,158,11,0.25),0_20px_60px_rgba(0,0,0,0.9)] text-center flex flex-col items-center my-auto"
      >
        {/* Pastel de Cumpleaños Ilustrado con Velas Animadas */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mb-3 sm:mb-5 flex items-center justify-center"
        >
          {/* Aura dorada tras el pastel */}
          <div className="absolute w-24 h-24 sm:w-32 sm:h-32 bg-amber-400/30 rounded-full blur-2xl pointer-events-none" />

          {/* SVG del Pastel Festivo */}
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center filter drop-shadow-[0_8px_20px_rgba(245,158,11,0.6)]">
            <svg viewBox="0 0 96 96" className="w-full h-full">
              {/* Velas */}
              <rect x="36" y="24" width="4" height="14" rx="2" fill="#fef08a" />
              <rect x="46" y="20" width="4" height="18" rx="2" fill="#f472b6" />
              <rect x="56" y="24" width="4" height="14" rx="2" fill="#38bdf8" />

              {/* Llamas de las velas animadas sin error de atributo r */}
              <motion.g
                animate={{ scale: [0.85, 1.2, 0.85], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '38px 19px' }}
              >
                <circle cx="38" cy="19" r="3.5" fill="#f59e0b" />
                <circle cx="38" cy="19" r="1.8" fill="#fef08a" />
              </motion.g>

              <motion.g
                animate={{ scale: [0.9, 1.25, 0.9], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 0.65, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                style={{ transformOrigin: '48px 15px' }}
              >
                <circle cx="48" cy="15" r="4.2" fill="#fbbf24" />
                <circle cx="48" cy="15" r="2.2" fill="#ffffff" />
              </motion.g>

              <motion.g
                animate={{ scale: [0.85, 1.2, 0.85], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 0.85, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                style={{ transformOrigin: '58px 19px' }}
              >
                <circle cx="58" cy="19" r="3.5" fill="#f59e0b" />
                <circle cx="58" cy="19" r="1.8" fill="#fef08a" />
              </motion.g>

              {/* Piso Superior del Pastel */}
              <rect x="26" y="38" width="44" height="20" rx="6" fill="#f43f5e" stroke="#881337" strokeWidth="1.5" />
              {/* Glaseado crema */}
              <path d="M26 44 C30 48, 34 40, 38 45 C42 49, 46 41, 50 46 C54 50, 58 42, 62 46 C66 49, 70 44, 70 44 L70 38 L26 38 Z" fill="#fdf2f8" />

              {/* Piso Inferior del Pastel */}
              <rect x="18" y="58" width="60" height="24" rx="8" fill="#ec4899" stroke="#9d174d" strokeWidth="1.5" />
              {/* Glaseado piso inferior */}
              <path d="M18 66 C23 72, 28 62, 33 68 C38 73, 43 63, 48 69 C53 74, 58 64, 63 70 C68 74, 73 65, 78 66 L78 58 L18 58 Z" fill="#fef08a" />

              {/* Detalles / Chispas */}
              <circle cx="28" cy="74" r="1.5" fill="#ffffff" />
              <circle cx="40" cy="76" r="1.5" fill="#ffffff" />
              <circle cx="52" cy="74" r="1.5" fill="#ffffff" />
              <circle cx="66" cy="76" r="1.5" fill="#ffffff" />

              {/* Plato / Base */}
              <ellipse cx="48" cy="83" rx="38" ry="4" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
            </svg>
          </div>
        </motion.div>

        {/* Título de Feliz Cumpleaños */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="font-serif text-xs xs:text-sm uppercase tracking-[0.25em] text-amber-300/90 font-bold">
              ¡Día Especial!
            </span>
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>

          <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-pink-200 to-amber-300 text-gold-glow drop-shadow-[0_4px_16px_rgba(245,158,11,0.6)]">
            ¡Feliz Cumpleaños, Luisa! 🎉
          </h1>
        </div>

        {/* Mensaje Deseado */}
        <div className="space-y-3.5 sm:space-y-4 font-serif text-sm xs:text-base sm:text-lg leading-relaxed sm:leading-loose text-purple-100/95 font-light text-center px-1 sm:px-4 mb-6 sm:mb-8">
          <p className="font-medium text-amber-200/95 text-base xs:text-lg sm:text-xl">
            Te deseo lo mejor del mundo hoy y siempre.
          </p>

          <p>
            Sé que vas a ser inmensamente feliz en esta vida, y si alguna vez las cosas no se dan fáciles, sé muy bien que <span className="font-semibold text-amber-200">vas a pelear con todo tu corazón por lograrlo</span>.
          </p>

          <p>
            Sé que te va a ir muy bien en todo lo que te propongas, y si en algún momento se presentan dificultades, sé con total certeza que <span className="font-semibold text-pink-200">eres capaz de enfrentar y vencer cualquier desafío que venga</span>.
          </p>

          <p className="text-xs xs:text-sm sm:text-base text-amber-300/90 italic pt-1">
            ✨ Que este nuevo año te regale infinitas alegrías, risas y metas cumplidas ✨
          </p>

          <p className="text-xs xs:text-sm sm:text-base text-pink-200/95 font-medium italic pt-2 border-t border-purple-500/25">
            Todo este lo hago con todo el cariño que te tengo. 💖
          </p>
        </div>

        {/* Botón para continuar a la siguiente pantalla */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          className="group relative px-6 xs:px-8 sm:px-10 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 text-white font-serif font-bold text-sm xs:text-base sm:text-lg tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:shadow-[0_0_45px_rgba(236,72,153,0.7)] border-2 border-amber-300/80 cursor-pointer flex items-center gap-2.5 transition-all duration-300"
        >
          <span>Descubrir tus sorpresas</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1.5" />
          <Heart className="w-4 h-4 text-pink-200 fill-pink-300 animate-pulse" />
        </motion.button>
      </motion.div>
    </div>
  );
};
