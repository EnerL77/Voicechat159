// server.js (ESM)
// wenn dein package.json "type": "module" hat (siehe unten), dann so importieren:
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());           // bei Bedarf cors({ origin: 'https://voicechat159.onrender.com' })
app.use(express.json());

// HEALTHCHECK
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// *** WICHTIG: POST /start (fix gegen 405) ***
app.post('/start', (req, res) => {
  // hier ggf. Session/Init/Keys etc.
  res.json({ ok: true, message: 'Session started' });
});

// Static Files aus /public
app.use(express.static(path.join(__dirname, 'public')));

// Fallback auf index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
