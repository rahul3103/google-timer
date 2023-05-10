const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        progress: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        progress: "progress linear",
      },
      colors: {
        "google-blue-100": "#8ab4f8",
        "google-blue-200": "#1B66C9",
        "google-gray-100": "#3c4043",
        "google-gray-200": "#80868b",
        "google-gray-300": "#202124",
        "google-gray-400": "#5f6368",
        "google-gray-500": "#70757a",
        "google-gray-600": "#bdc1c6",
        "google-black-100": "#050607",
        "google-black-200": "#171717",
      },
    },
  },
  plugins: [],
};
