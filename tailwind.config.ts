import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15110d",
        vellum: "#f7efe0",
        marble: "#efe8d8",
        oxblood: "#671d1d",
        reliquary: "#b88a44",
        lapis: "#24415d",
        glass: "#2e6f73",
        candle: "#f7c66a"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        relic: "0 24px 80px rgba(21, 17, 13, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
