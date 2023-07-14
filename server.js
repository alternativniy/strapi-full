import strapi from './backend/node_modules/@strapi/strapi/lib/index.js';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './backend/.env', override: true });

process.env.NODE_ENV = 'production';

strapi({ appDir: './backend', distDir: './backend' }).start();

const app = express();
const port = 80;

app.listen(port);
app.use(express.static('./dist'));

app.use('/*', (req, res) => {
  if(req.url.includes('/admin')) {
    res.sendFile(path.join(__dirname, '/dist/admin/index.html'));
  }

  res.sendFile(path.join(__dirname, '/dist/index.html'));
})

console.log(`Production server started at port ${port}`);
