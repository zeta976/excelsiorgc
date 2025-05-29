const fs = require('fs');
const path = require('path');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Change this in production!

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }
  const { id, action, password } = JSON.parse(event.body || '{}');
  if (!id || !action || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Faltan datos requeridos' })
    };
  }
  if (password !== ADMIN_PASSWORD) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Contraseña incorrecta' })
    };
  }
  const pendingPath = path.join(__dirname, '../../data/pending-articles.json');
  const publishedPath = path.join(__dirname, '../../data/published-articles.json');
  let pending = [];
  if (fs.existsSync(pendingPath)) {
    pending = JSON.parse(fs.readFileSync(pendingPath, 'utf8'));
  }
  const idx = pending.findIndex(a => a.id === id);
  if (idx === -1) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Artículo no encontrado' })
    };
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
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
