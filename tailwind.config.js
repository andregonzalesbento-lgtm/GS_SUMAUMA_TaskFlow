/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        floresta: '#0B2E1B',
        natureza: '#2E7D32',
        folha: '#A5D6A7',
        laranja: '#FB8C00',
        vermelho: '#D32F2F',
        areia: '#F5F5DC',
        grafite: '#1B1F24',
        cinza: '#546E63',
        vivo: '#66BB6A',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
