/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Cyberpunk theme colors
        cyberpunk: {
          primary: '#f016f4', // Neon pink
          secondary: '#09fbd3', // Neon teal
          tertiary: '#fe53bb', // Hot pink
          accent: '#08f7fe', // Cyan
          yellow: '#f5d300', // Neon yellow
          purple: '#9b5de5', // Neon purple
          blue: '#00f6ff', // Electric blue
          dark: '#0b0014', // Near black with purple tint
          darker: '#08000f', // Deepest background
          'dark-purple': '#201133', // Dark purple for cards
          'dark-blue': '#001833', // Dark blue alternative
          'neon-glow': '0 0 5px rgba(8, 247, 254, 0.5), 0 0 10px rgba(8, 247, 254, 0.3)', // Cyan glow
          'pink-glow': '0 0 5px rgba(240, 22, 244, 0.5), 0 0 10px rgba(240, 22, 244, 0.3)', // Pink glow
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'text-flicker': 'text-flicker 1.5s infinite alternate',
        'neon-pulse': 'neon-pulse 2s infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'scan-line': 'scan-line 4s linear infinite',
        'glitch': 'glitch 1s linear infinite',
        'terminal-typing': 'terminal-typing 3.5s steps(40, end)',
      },
      keyframes: {
        'text-flicker': {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '1',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.33',
          },
        },
        'neon-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 5px #08f7fe, 0 0 10px #08f7fe, 0 0 15px #08f7fe, 0 0 20px #08f7fe',
          },
          '50%': {
            boxShadow: '0 0 10px #f016f4, 0 0 20px #f016f4, 0 0 30px #f016f4, 0 0 40px #f016f4',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'scan-line': {
          '0%': {
            top: '0%',
          },
          '100%': {
            top: '100%',
          },
        },
        'glitch': {
          '0%, 100%': {
            textShadow: '2px 0 #f016f4, -2px 0 #08f7fe',
            transform: 'translate(0)',
          },
          '25%': {
            textShadow: '-2px 0 #f016f4, 2px 0 #08f7fe',
            transform: 'translate(2px)',
          },
          '50%': {
            textShadow: '2px 0 #f016f4, -2px 0 #08f7fe',
            transform: 'translate(0)',
          },
          '75%': {
            textShadow: '-2px 0 #f016f4, 2px 0 #08f7fe',
            transform: 'translate(-2px)',
          },
        },
        'terminal-typing': {
          'from': {
            width: '0',
          },
          'to': {
            width: '100%',
          },
        },
      },
      backgroundImage: {
        'cyberpunk-grid': 'linear-gradient(rgba(8, 247, 254, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(8, 247, 254, 0.2) 1px, transparent 1px)',
        'cyberpunk-gradient': 'linear-gradient(45deg, rgba(8, 247, 254, 0.1), rgba(240, 22, 244, 0.1))',
        'neon-spotlight': 'radial-gradient(circle, rgba(240, 22, 244, 0.2) 0%, rgba(8, 0, 15, 0) 70%)',
      },
    },
  },
  plugins: [],
};