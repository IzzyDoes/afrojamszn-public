/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{html,js}",
    "./scripts/**/*.{js}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#181e24',
        card: '#232b34',
        accent: '#2563eb',
        text: '#e5e7eb',
        faded: '#64748b',
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
}

