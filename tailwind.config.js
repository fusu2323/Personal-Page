/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'term-bg': '#0d1117',
        'term-green': '#238636',
        'term-blue': '#58a6ff',
        'term-cyan': '#3fb950',
        'term-gray': '#30363d',
        'neon-cyan': '#00f3ff',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"Fira Code"', '"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'cursor': 'cursor .75s step-end infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        cursor: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { bottom: '100%' },
          '100%': { bottom: '-100px' },
        }
      }
    },
  },
  plugins: [],
}
