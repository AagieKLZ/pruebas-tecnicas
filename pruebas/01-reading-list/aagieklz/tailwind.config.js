/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.html',
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary))',
        base: 'rgb(var(--color-base))',
        secondary: 'rgb(var(--color-secondary))',
      }
    },
  },
  plugins: [],
}

