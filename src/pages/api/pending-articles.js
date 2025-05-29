import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }
  const filePath = path.join(process.cwd(), 'data', 'pending-articles.json');
  let articles = [];
  if (fs.existsSync(filePath)) {
    articles = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  res.status(200).json({ articles });
}
