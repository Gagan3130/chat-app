/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/page/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'c-panel-header-background': '#f0f2f5', // blue-light,
        'c-secondary': '#667781',
        'c-conversation-header-border': '#d1d7db',
        'c-chat-border': '#e9edef',
        'c-primary':'#3b4a54',
        'c-header-icon': '#54656f',
        'c-icon-high-emphasis': '#00a884',
        'c-icon-lighter': '#8696a0',
        'c-button-secondary':'#008069'
      },
      fontSize: {
        'body-10': '0.625rem', // 10px
        'body-12': '0.75rem', // 12px
        'body-14': '0.875rem', // 14px
        'body-16': '1rem', // 16px
        h6: '1.125rem', // 18px
        h5: '1.25rem', // 20px
        h4: '1.5rem', // 24px
        h3: '2rem', // 32px
        h2: '2.25rem', // 36px
        h1: '2.5rem', // 40px
      },
      borderRadius: {
        small: '4px',
        normal: '8px',
        large: '12px',
        'large-1': '40px',
      }
    },
  },
  plugins: [],
};
