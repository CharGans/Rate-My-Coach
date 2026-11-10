/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',
        brown: { DEFAULT: '#5C3D2E', light: '#8B6355', border: '#C4A882' },
        violet: { DEFAULT: '#6B4FA0', hover: '#5A3F8A' },
        lilac: { DEFAULT: '#C4A8D4', light: '#EDE4F5', dark: '#9B7BB0' },
      },
    },
  },
  plugins: [],
}
