/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#d97706',
          light: '#fbbf24',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          800: '#166534',
          900: '#14532d',
        },
        yellow: {
          50: '#fefce8',
          400: '#facc15',
          600: '#ca8a04',
          900: '#713f12',
        },
        orange: {
          50: '#fff7ed',
          400: '#fb923c',
          600: '#ea580c',
          900: '#7c2d12',
        },
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          400: '#f87171',
          600: '#dc2626',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
    },
  },
  plugins: [],
} 