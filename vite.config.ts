import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import YAMLPlugin from 'unplugin-yaml/vite';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [YAMLPlugin(), react(), cloudflare()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});