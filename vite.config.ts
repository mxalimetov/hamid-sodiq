import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import YAMLPlugin from 'unplugin-yaml/vite';

export default defineConfig({
  plugins: [YAMLPlugin(), react()],
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
