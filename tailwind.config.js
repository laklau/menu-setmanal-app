/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'menu-green': '#b1f090',
      },
      fontFamily: {
        'fugaz': ['"Fugaz One"', 'cursive'],
        'nunito': ['"Nunito"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
