/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html, js}"],
  theme: {
    extend: {
      fontFamily: {
        inter: "'Inter', sans-serif",
      },
      colors: {
        "primary-dark": "#0f172a",
        "primary-light": "#f8fafc",
        "secondary-light": "#e9e9e9",
        "tertiary-light": "#bababa",
      },
    },
  },
  plugins: [],
};
