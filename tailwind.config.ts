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
        tsky: {
          100: "#E0F7FA", 200: "#B2EBF2", 300: "#4DD0E1", 400: "#00BCD4", 500: "#0097A7",
        },
        ocean: {
          100: "#00ACC1", 200: "#00838F", 300: "#006064", 400: "#004D56", 500: "#003640",
        },
        gold: {
          100: "#FFF8E1", 300: "#FFD54F", 500: "#FFB300", 700: "#FF8F00",
        },
        coral: "#FF6B6B",
        mint: "#69F0AE",
        sand: "#FFF3E0",
        ink: "#0A2540",
        lagoon: "#00D4FF",
        tropical: "#00E5A0",
        foam: "#E0FFFF",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "slide-up": "fadeUp 0.6s ease-out forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        shimmer: "shimmerSweep 2s linear infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "floatSlow 8s ease-in-out infinite",
        spin: "spin 1s linear infinite",
        "spin-slow": "spinSlow 12s linear infinite",
        sway: "sway 5s ease-in-out infinite",
        "drift-cloud": "driftCloud 35s linear infinite",
        "wave-roll": "waveRoll 12s ease-in-out infinite",
        "particle-drift": "particleDrift 5s ease-out infinite",
        bounce: "bounce 2s ease-in-out infinite",
        "tropical-float": "tropicalFloat 10s ease-in-out infinite",
        "palm-sway": "palmSway 7s ease-in-out infinite",
        "bubble-float": "bubbleFloat 8s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeUp: { "0%": { opacity: "0", transform: "translateY(30px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        shimmerSweep: { "0%": { backgroundPosition: "-600px 0" }, "100%": { backgroundPosition: "600px 0" } },
        float: { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-14px)" } },
        floatSlow: { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-8px)" } },
        spin: { to: { transform: "rotate(360deg)" } },
        spinSlow: { to: { transform: "rotate(360deg)" } },
        pulse: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.6" } },
        bounce: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        sway: { "0%,100%": { transform: "rotate(-2.5deg)" }, "50%": { transform: "rotate(2.5deg)" } },
        driftCloud: { from: { transform: "translateX(-100px)" }, to: { transform: "translateX(calc(100vw + 300px))" } },
        waveRoll: { "0%": { transform: "rotate(0deg) translateX(0%)" }, "50%": { transform: "rotate(180deg) translateX(-8%)" }, "100%": { transform: "rotate(360deg) translateX(0%)" } },
        particleDrift: { "0%": { transform: "translateY(0)", opacity: "0" }, "20%": { opacity: "0.6" }, "100%": { transform: "translateY(-80px)", opacity: "0" } },
        tropicalFloat: { "0%,100%": { transform: "translateY(0) rotate(0deg)" }, "25%": { transform: "translateY(-18px) rotate(3deg)" }, "75%": { transform: "translateY(-22px) rotate(4deg)" } },
        palmSway: { "0%,100%": { transform: "rotate(-4deg)" }, "50%": { transform: "rotate(5deg)" } },
        bubbleFloat: { "0%": { transform: "translateY(100%) scale(0)", opacity: "0" }, "20%": { opacity: "0.6" }, "100%": { transform: "translateY(-20%) scale(0.5)", opacity: "0" } },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.06)",
        "glass-lg": "0 16px 48px rgba(0, 0, 0, 0.1)",
        "glass-xl": "0 24px 64px rgba(0, 0, 0, 0.14)",
        glow: "0 0 40px rgba(255, 179, 0, 0.15)",
        "glow-ocean": "0 0 40px rgba(0, 188, 212, 0.20)",
        "glow-coral": "0 0 40px rgba(255, 107, 107, 0.15)",
        "glow-tropical": "0 0 40px rgba(0, 229, 160, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
