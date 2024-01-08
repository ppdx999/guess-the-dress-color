import type { Config } from "tailwindcss";

export default {
  mode: "jit",
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
