/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#007acc',
        'gray-secondary': '#6E6E73',
        'gray-tertiary': '#B7B7B7',
        'gray-quaternary': '#5E5E5E',
        'purple-1': '#FBFBFDCC',
        'primary-black': '#282828',
        'secondary-black': '#1D1D1F',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        expand: {
          '0%, 100%': { transform: 'scaleX(0)' },
          '50%': { transform: 'scaleX(1)' },
        },
      },
    },
  },
  plugins: [],
};
