module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        xs: '.70rem',
      },
      cursor: {
        'ns-resize': 'ns-resize',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
