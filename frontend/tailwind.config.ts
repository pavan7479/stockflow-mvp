import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0f1e",
        surface: "#111827",
        border: "#1f2937",
        primary: {
          DEFAULT: "#f9fafb",
          muted: "#6b7280",
        },
        accent: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
        },
        danger: "#dc2626",
        warning: "#d97706",
        success: "#16a34a",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
