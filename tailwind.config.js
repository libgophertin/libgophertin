/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Включение темной темы по классу
  theme: {
    extend: {
      colors: {
        gopher: {
          light: '#CEE7F0', // Очень светлый голубой
          DEFAULT: '#00ADD8', // Основной цвет Go
          dark: '#007D9C',    // Темный оттенок
        },
        darkbg: '#121212',
        cardbg: '#1E1E1E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}