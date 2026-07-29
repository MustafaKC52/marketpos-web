import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		outDir: path.resolve(__dirname, "../assets/pricing"),
		emptyOutDir: true,
		cssCodeSplit: false,
		rollupOptions: {
			input: path.resolve(__dirname, "src/main.tsx"),
			output: {
				entryFileNames: "pricing.js",
				assetFileNames: "pricing.[ext]",
			},
		},
	},
});
