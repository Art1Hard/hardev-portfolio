// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

import icon from "astro-icon";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
	site: "https://hardev.ru",
	output: "static",

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [mdx(), sitemap(), icon()],
	adapter: vercel(),
});
