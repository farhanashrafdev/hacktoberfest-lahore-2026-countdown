import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Vercel serves from the domain root; GitHub Pages needs the repo subpath.
export default defineConfig({
  base: process.env.VERCEL ? '/' : '/hacktoberfest-lahore-2026-countdown/',
  plugins: [react(), tailwindcss()],
})
