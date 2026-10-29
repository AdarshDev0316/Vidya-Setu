import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // AICTE / Government of India palette
        saffron: {
          50:  "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          DEFAULT: "#E8571A",  // primary CTA – matches AICTE orange
        },
        gov: {
          green:   "#1B6B3A",  // dark government green
          green2:  "#2E7D32",
          teal:    "#006D6D",
          blue:    "#003087",  // Ashoka-navy
          lightbg: "#F5F5F5",
          gray:    "#6B7280",
        },
        tricolor: {
          saffron: "#FF9933",
          white:   "#FFFFFF",
          green:   "#138808",
          navy:    "#000080",
        },
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans", "sans-serif"],
        heading: ["Poppins", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "tricolor-gradient":
          "linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)",
        "gov-gradient":
          "linear-gradient(135deg, #1B6B3A 0%, #003087 100%)",
        "hero-wave":
          "url('/hero-wave.svg')",
      },
    },
  },
  plugins: [],
};
export default config;
