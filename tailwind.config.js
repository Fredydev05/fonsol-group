import animations from '@midudev/tailwind-animations'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        secondaryDarker: 'var(--color-secondary-darker)',
      },
    },
  },
  plugins: [ animations],
};
