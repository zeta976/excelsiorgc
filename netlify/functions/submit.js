const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }
  const { title, author, content } = JSON.parse(event.body || '{}');
  if (!title || !author || !content) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Faltan campos requeridos' })
    };
  }
  const filePath = path.join(__dirname, '../../data/pending-articles.json');
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
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Artículo enviado correctamente' })
  };
};
