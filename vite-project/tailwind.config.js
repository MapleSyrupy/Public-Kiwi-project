/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./Routes/login.jsx",
    "./Routes/index.jsx",
    "./Routes/signUp.jsx",
     "./src/**/*.{js,ts,jsx,tsx}"
  ],
  prefix:"tw-",
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui")
  ],
  daisyui:{
    themes:false,
    base:false
  },
  darkMode:"selector"
}

