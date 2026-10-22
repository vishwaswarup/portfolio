/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        teal: {
          400: '#14b8a6',
          500: '#06b6d4',
          600: '#0891b2',
        },
        // The site accent. Components still say `emerald-*`; this palette
        // swaps them to the portfolio's purple (#8f7cff) in one place.
        emerald: {
          50: '#f4f2ff',
          100: '#ebe7ff',
          200: '#d9d2ff',
          300: '#bcb0ff',
          400: '#8f7cff',
          500: '#8f7cff',
          600: '#6c54f0',
          700: '#5a43d1',
          800: '#4a38a8',
          900: '#3b2e82',
          950: '#231b52',
        },
      },
    },
  },
  plugins: [],
}
