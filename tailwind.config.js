/** @type {import('tailwindcss').Config} */

import { themeColors } from './src/styles/themeColors.js'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        themeColors,
      },
      fontFamily: {
        heading: ['Inter', 'ui-sans-serif'],
        body: ['Manrope', 'ui-sans-serif'],
        button: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
  
}

