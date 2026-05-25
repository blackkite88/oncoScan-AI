/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          bg: '#050814',
          card: '#0d1326',
          accent: '#06b6d4',
          accentDark: '#0e7490',
          border: '#1f2937',
        }
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Inter"', 'ui-sans-serif', 'sans-serif'],
        syne: ['"Syne"', 'sans-serif'],
      },
      animation: {
        'scanner-ring': 'scannerRing 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scanLine 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'progress-bar': 'progressBar 1.5s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
      },
      keyframes: {
        scannerRing: {
          '0%, 100%': { transform: 'scale(0.98)', opacity: '0.4', boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)' },
          '50%': { transform: 'scale(1.05)', opacity: '1', boxShadow: '0 0 35px rgba(6, 182, 212, 0.7)' },
        },
        scanLine: {
          '0%': { top: '0%' },
          '50%': { top: '100%' },
          '100%': { top: '0%' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(6, 182, 212, 0.5)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        progressBar: {
          '0%': { width: '0%' },
        }
      }
    },
  },
  plugins: [],
}
