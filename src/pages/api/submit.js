import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }
  const { title, author, content } = req.body;
  if (!title || !author || !content) {
    res.status(400).json({ error: 'Faltan campos requeridos' });
    return;
  }
  const filePath = path.join(process.cwd(), 'data', 'pending-articles.json');
  let articles = [];
  if (fs.existsSync(filePath)) {
    articles = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  const newArticle = {
    id: Date.now(),
    title,
    author,
    content,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };
  articles.push(newArticle);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(articles, null, 2), 'utf8');
  res.status(200).json({ message: 'Artículo enviado correctamente' });
}
