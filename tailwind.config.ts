import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        ocean: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        sunset: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        sand: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
        },
        deep: {
          blue: "#1e3a5f",
          navy: "#0f2744",
          slate: "#1e293b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 12s ease-in-out infinite",
        "drift-right": "driftRight 20s linear infinite",
        "drift-left": "driftLeft 18s linear infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "sway": "sway 5s ease-in-out infinite",
        "pulse-zoom": "pulseZoom 20s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        driftRight: {
          "0%": { transform: "translateX(-100px) translateY(0)" },
          "50%": { transform: "translateX(50vw) translateY(-30px)" },
          "100%": { transform: "translateX(110vw) translateY(0)" },
        },
        driftLeft: {
          "0%": { transform: "translateX(110vw) translateY(0)" },
          "50%": { transform: "translateX(50vw) translateY(-20px)" },
          "100%": { transform: "translateX(-100px) translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.1)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        pulseZoom: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 10px 1px rgba(45, 212, 191, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          },
          '50%': { 
            boxShadow: '0 0 20px 3px rgba(45, 212, 191, 0.4)',
            borderColor: 'rgba(45, 212, 191, 0.5)' 
          },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.06)",
        "glass-lg": "0 16px 48px rgba(0, 0, 0, 0.1)",
        "glass-xl": "0 24px 64px rgba(0, 0, 0, 0.14)",
        glow: "0 0 40px rgba(249, 115, 22, 0.15)",
        "glow-ocean": "0 0 40px rgba(8, 145, 178, 0.15)",
        "booking": "0 4px 16px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
