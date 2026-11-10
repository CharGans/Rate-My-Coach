/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',
        brown: { DEFAULT: '#291b14', light: '#4f3c35', border: '#53504c' },
        violet: { DEFAULT: '#6B4FA0', hover: '#5A3F8A' },
        lilac: { DEFAULT: '#C4A8D4', light: '#EDE4F5', dark: '#9B7BB0' },
      },
    },
  },
  plugins: [],
}
