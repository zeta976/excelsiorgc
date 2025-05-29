const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }
  const filePath = path.join(__dirname, '../../data/pending-articles.json');
  let articles = [];
  if (fs.existsSync(filePath)) {
    articles = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ articles })
  };
};
