/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          DEFAULT: '#2E7D32',
          dark: '#1B5E20',
          light: '#4CAF50'
        }
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0,0,0,0.06)'
      },
      borderRadius: {
        xl: '1rem'
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        eco: {
          'primary': '#2E7D32',
          'primary-focus': '#1B5E20',
          'primary-content': '#ffffff',
          'secondary': '#4CAF50',
          'accent': '#2E7D32',
          'neutral': '#2b3440',
          'base-100': '#f7faf7',
          'info': '#42A5F5',
          'success': '#22c55e',
          'warning': '#f59e0b',
          'error': '#ef4444'
        }
      }
    ]
  }
};
