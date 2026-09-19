import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

import fs from 'node:fs';
import path from 'node:path';

function apiDevServerPlugin(): Plugin {
  return {
    name: 'api-dev-server',
    buildStart() {
      try {
        const srcDir = path.resolve(import.meta.dirname, 'img');
        const destDir = path.resolve(import.meta.dirname, 'public', 'img');
        if (fs.existsSync(srcDir)) {
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }
          fs.cpSync(srcDir, destDir, { recursive: true, force: true });
        }
      } catch (e) {
        console.warn('Could not auto-sync img folder during build:', e);
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Direct static serving of user's images/, img/, and audio/ folders
        if (req.url && (req.url.startsWith('/images/') || req.url.startsWith('/img/'))) {
          const isImages = req.url.startsWith('/images/');
          const folder = isImages ? 'images' : 'img';
          const prefix = isImages ? '/images/' : '/img/';
          const filename = req.url.substring(prefix.length).split('?')[0];
          const decoded = decodeURIComponent(filename);
          const publicPath = path.resolve(import.meta.dirname, 'public', folder, decoded);
          const rootPath = path.resolve(import.meta.dirname, folder, decoded);
          const targetPath = fs.existsSync(publicPath)
            ? publicPath
            : fs.existsSync(rootPath)
            ? rootPath
            : null;

          if (targetPath) {
            const ext = path.extname(targetPath).toLowerCase();
            const mimeTypes: Record<string, string> = {
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.webp': 'image/webp',
              '.gif': 'image/gif',
              '.svg': 'image/svg+xml',
            };
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            fs.createReadStream(targetPath).pipe(res);
            return;
          }
        }

        if (req.url && req.url.startsWith('/audio/')) {
          const filename = req.url.substring('/audio/'.length).split('?')[0];
          const decoded = decodeURIComponent(filename);
          const publicAudioPath = path.resolve(import.meta.dirname, 'public', 'audio', decoded);
          if (fs.existsSync(publicAudioPath)) {
            const ext = path.extname(publicAudioPath).toLowerCase();
            const mimeTypes: Record<string, string> = {
              '.mp3': 'audio/mpeg',
              '.wav': 'audio/wav',
              '.ogg': 'audio/ogg',
            };
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            fs.createReadStream(publicAudioPath).pipe(res);
            return;
          }
        }

        if (req.url === '/api/easter-egg' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            console.log('\n[DEV SERVER API] /api/easter-egg received payload:', body);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, localDev: true, message: 'Easter egg solved (logged in dev console)' }));
          });
          return;
        }

        if (req.url === '/api/secret-letter-opened' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            console.log('\n[DEV SERVER API] /api/secret-letter-opened received payload:', body);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, localDev: true, message: 'Secret letter opened (logged in dev console)' }));
          });
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiDevServerPlugin()],
  server: {
    watch: {
      ignored: [
        '**/dist/**',
        '**/public/**',
        '**/img/**',
        '**/*.jpg',
        '**/*.jpeg',
        '**/*.png',
        '**/*.webp',
        '**/*.mp3',
        '**/*.wav',
        '**/*.ogg',
      ],
    },
  },
});
