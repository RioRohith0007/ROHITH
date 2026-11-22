import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const [owner, repository] = env.GITHUB_REPOSITORY?.split('/') ?? [];
  const base =
    env.GITHUB_ACTIONS === 'true' && repository
      ? repository.toLowerCase() === `${owner?.toLowerCase()}.github.io`
        ? '/'
        : `/${repository}/`
      : '/';

  return {
    base,
    plugins: [react(), tailwindcss()],
    build: {
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks: { motion: ['framer-motion'], react: ['react', 'react-dom'] },
        },
      },
    },
  };
});
