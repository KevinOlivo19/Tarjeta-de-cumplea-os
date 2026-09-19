/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '380px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        dark: {
          950: '#030107',
          900: '#080312',
          800: '#110722',
          700: '#1b0d36',
          600: '#2c1454',
        },
        mystic: {
          purple: '#8a2be2',
          violet: '#a855f7',
          deep: '#4c1d95',
          gold: '#f59e0b',
          glow: '#c084fc',
          accent: '#e9d5ff',
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', '"Cormorant Garamond"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        handwriting: ['"Caveat"', '"Dancing Script"', 'cursive']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-reverse': 'float-reverse 7s ease-in-out infinite',
        'glow-pulse': 'glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(10px) rotate(-1deg)' },
        },
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.4))' },
          '50%': { filter: 'drop-shadow(0 0 28px rgba(192, 132, 252, 0.8))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
