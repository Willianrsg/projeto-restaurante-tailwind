/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  fontFamily: {
    'sans': ['Bebas', 'sans-serif', '']
  },
  theme: {
    extend: {
      backgroundImage: {
        "home": "url('/assets/bg.png')",
      }
    },
  },
  plugins: [],
}

