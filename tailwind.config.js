// import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./global.css"
  ],
  
  theme: {
    extend: {
      
      colors: {
        primary: '#e53e51',
        'primary-shadow': '#E53E51CC',
        'primary-hover': '#ea6574',
        secondary: '#2b8da1',
        'secondary-hover': '#55a4b4',
        'secondary-active': '#CEECF5',
        'light-grey': '#f2f2f2',
        success: '#02ac8f',
        hoverSuccess: '#35bda5',
        'bg-success': '#E6F7F4',
        placeholder: '#cccccc',
        danger: '#da162d',
        sub: '#6e6f73',
        dark: '#212339',
        disabled: '#e0e0e0',
        'disabled-on-grey': '#c6c6c6',
        'dark-transparent': '#212339bf',
        'desktop-dark-transparent': '#000000BF',
        'danger-bg': '#fbe8ea',
        'success-bg': '#e6f7f4',
        'unique-user': '#60c1df',
        booking: '#f4c571',
        base: '#d9d9d9',
        'in-process': '#fef9f1',
        checked: '#eff9fc',
      },
      fontSize: {
        'desktop-h1': ['1.75rem', {
          fontWeight: 600,
        }],
        'desktop-big-h2': ['1.5rem', {
          fontWeight: 600,
        }],
        'desktop-h2': ['1.25rem', {
          fontWeight: 600,
        }],
        'desktop-h3': ['1.25rem', {
          fontWeight: 600,
        }],
        'desktop-highlight': ['1.25rem', {
          fontWeight: 500,
        }],
        'desktop-bold-base|label': ['1rem', {
          fontWeight: 600,
        }],
        'desktop-base': '1rem',
        'desktop-button': ['1.125rem', {
          fontWeight: 500,
        }],
        'desktop-caption': '0.875rem',
        'mobile-big-number': ['2rem', {
          fontWeight: 600,
        }],
        'mobile-h1': ['1.75rem', {
          fontWeight: 600,
        }],
        'mobile-big-h2': ['1.5rem', {
          fontWeight: 600,
        }],
        'mobile-h2': ['1.25rem', {
          fontWeight: 600,
        }],
        'mobile-h3': ['1.25rem', {
          fontWeight: 600,
        }],
        'mobile-highlight': ['1.25rem', {
          fontWeight: 500,
        }],
        'mobile-bold-base|label': ['1rem', {
          fontWeight: 600,
        }],
        'mobile-base': '1rem',
        'mobile-button': ['1rem', {
          fontWeight: 500,
        }],
        'mobile-caption': '0.75rem',
        'desktop-back-office-big-number': ['2.25rem', {
          fontWeight: 600,
        }],
        'desktop-back-office-h1': ['2rem', {
          fontWeight: 600,
        }],
        'desktop-back-office-h2': ['1.5rem', {
          fontWeight: 600,
        }],
        'desktop-back-office-h3': ['1.25rem', {
          fontWeight: 600,
        }],
        'desktop-back-office-bold-base|label': ['1.125rem', {
          fontWeight: 600,
        }],
        'desktop-back-office-base': '1.125rem',
        'desktop-back-office-button': ['1.25rem', {
          fontWeight: 500,
        }],
        'desktop-back-office-caption': '0.875rem',
      },
    },
  },
  plugins: [],
// } satisfies Config;
}
