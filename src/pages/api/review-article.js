import fs from 'fs';
import path from 'path';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Change this in production!

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }
  const { id, action, password } = req.body;
  if (!id || !action || !password) {
    res.status(400).json({ error: 'Faltan datos requeridos' });
    return;
  }
  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Contraseña incorrecta' });
    return;
  }
  const pendingPath = path.join(process.cwd(), 'data', 'pending-articles.json');
  const publishedPath = path.join(process.cwd(), 'data', 'published-articles.json');
  let pending = [];
  if (fs.existsSync(pendingPath)) {
    pending = JSON.parse(fs.readFileSync(pendingPath, 'utf8'));
  }
  const idx = pending.findIndex(a => a.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'Artículo no encontrado' });
    return;
  }
  if (action === 'approve') {
    let published = [];
    if (fs.existsSync(publishedPath)) {
      published = JSON.parse(fs.readFileSync(publishedPath, 'utf8'));
    }
    const approved = { ...pending[idx], status: 'published', publishedAt: new Date().toISOString() };
    published.push(approved);
    fs.writeFileSync(publishedPath, JSON.stringify(published, null, 2), 'utf8');
  }
  // Remove from pending
  pending.splice(idx, 1);
  fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2), 'utf8');
  res.status(200).json({ success: true });
}
