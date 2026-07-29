/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				surface: {
					DEFAULT: "#030617",
					elevated: "#0b1224",
					glass: "rgba(255, 255, 255, 0.04)",
				},
				brand: {
					emerald: "#34d399",
					cyan: "#22d3ee",
					sky: "#38bdf8",
				},
			},
			fontFamily: {
				sans: ["Inter", "system-ui", "sans-serif"],
				display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
			},
			boxShadow: {
				glass: "0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
				glow: "0 0 60px rgba(52, 211, 153, 0.15)",
			},
			borderRadius: {
				"4xl": "2rem",
			},
		},
	},
	plugins: [],
};
