import React, { useState } from 'react';

export default function SubmitArticle() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!title.trim() || !author.trim() || !content.trim()) {
      setMessage('Por favor, completa todos los campos.');
      return;
    }
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, content })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('¡Artículo enviado para revisión! Será publicado tras aprobación.');
        setTitle('');
        setAuthor('');
        setContent('');
      } else {
        setMessage(data.error || 'Error al enviar el artículo.');
      }
    } catch (err) {
      setMessage('Error de red al enviar el artículo.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Enviar artículo</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          className="border rounded px-3 py-2"
          placeholder="Título del artículo"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          type="text"
          className="border rounded px-3 py-2"
          placeholder="Autor/a"
          value={author}
          onChange={e => setAuthor(e.target.value)}
        />
        <textarea
          className="border rounded px-3 py-2 min-h-[120px]"
          placeholder="Contenido del artículo..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-primary text-white font-bold px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Enviar para revisión
        </button>
        {message && <div className="text-green-700 font-semibold mt-2">{message}</div>}
      </form>
      <div className="mt-4 text-xs text-neutral-500">
        Los artículos enviados serán revisados por los administradores antes de su publicación.
      </div>
    </div>
  );
}
