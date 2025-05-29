import React, { useState, useEffect } from 'react';

function fetchPendingArticles() {
  return fetch('/api/pending-articles').then(res => res.json());
}

function updateArticle(id, action, password) {
  return fetch('/api/review-article', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, action, password })
  }).then(res => res.json());
}

export default function AdminReview() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [pwPrompt, setPwPrompt] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    if (!pwPrompt) {
      setLoading(true);
      fetchPendingArticles().then(data => {
        setArticles(data.articles || []);
        setLoading(false);
      });
    }
  }, [pwPrompt, actionMsg]);

  const handleAction = async (id, action) => {
    setActionMsg('');
    const res = await updateArticle(id, action, password);
    if (res.success) {
      setActionMsg('Acción realizada con éxito.');
    } else {
      setActionMsg(res.error || 'Error al procesar la acción.');
    }
  };

  if (pwPrompt) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Acceso de Administrador</h2>
        <input
          type="password"
          className="border rounded px-3 py-2 w-full mb-4"
          placeholder="Contraseña de administrador"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="bg-primary text-white px-4 py-2 rounded font-bold w-full"
          onClick={() => setPwPrompt(false)}
        >
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Revisión de Artículos Pendientes</h1>
      {loading ? <div>Cargando...</div> : (
        articles.length === 0 ? <div>No hay artículos pendientes.</div> : (
          <div className="space-y-6">
            {articles.map(article => (
              <div key={article.id} className="border-b pb-4 mb-4">
                <div className="font-bold text-lg">{article.title}</div>
                <div className="text-sm text-neutral-600 mb-2">Por {article.author} | Enviado: {new Date(article.submittedAt).toLocaleString()}</div>
                <div className="mb-2 whitespace-pre-line">{article.content}</div>
                <div className="flex gap-4 mt-2">
                  <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => handleAction(article.id, 'approve')}>Aprobar</button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleAction(article.id, 'reject')}>Rechazar</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
      {actionMsg && <div className="mt-4 text-blue-700 font-semibold">{actionMsg}</div>}
    </div>
  );
}
