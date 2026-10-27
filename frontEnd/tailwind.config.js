/** @type {import('tailwindcss').Config} */
export default {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#190852',
          dark: '#0d0330',
          light: '#2d1a86',
        },
      },
    },
  },
  plugins: [],
}