/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#B2926B',
        'primaryHover': "#97774E",
        'secondary': '#454544',
        'heading': '#222222',
        'paragraph': '#5C727D',
        "lightBg": '#F8F9F9',
        "darkBg": "#2C2D2D"
      },
      fontFamily: {
        dmSans: ['DM Sans', 'sans-serif']
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}