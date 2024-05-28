module.exports = {
  content: ['./src/**/*.tsx', './index.html', './confirm/**/*.tsx', './confirm/index.html'],
  theme: {
    extend: {
      colors: {
        dark: '#202124',
        'dark-box': '#282828',
        'dark-selector-bg': '#1c1c1e',
        hover: '#43a047',
        primary: '#7F77C8',
        error: '#FF0000',
        secondary: '#707ea8',
        accent: '#1f2022',
      },
      textColor: {
        'dark-primary': '#e5e6e7',
        'dark-scecond': '#808182',
      },
      fontSize: {
        xxl: '12rem',
      },
      height: {
        'calc-14': 'calc(100% - 5rem)',
        108: '28rem',
      },
      width: {
        86: '21rem',
        'calc-grow': 'calc(21rem - 7.5rem)',
      },
    },
  },
  plugins: [],
}
