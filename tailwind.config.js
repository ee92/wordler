/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
    "./ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        shake: 'shake 300ms'
      },
      keyframes: {
        shake: {
          '25%': {
            transform: 'translateX(2px)'
          },
          '50%': {
            transform: 'translateX(-2px)'
          },
          '75%': {
            transform: 'translateX(2px)'
          }
        }
      }
    },
  },
  plugins: [],
}
