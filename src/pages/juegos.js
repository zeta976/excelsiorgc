import React, { useState } from 'react';

// --- Simple Snake Game Component ---
function SnakeGame() {
  const [snake, setSnake] = useState([[8, 8]]);
  const [food, setFood] = useState([
    Math.floor(Math.random() * 16),
    Math.floor(Math.random() * 16),
  ]);
  const [direction, setDirection] = useState([0, 1]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  React.useEffect(() => {
    if (gameOver) return;
    const handleKey = (e) => {
      switch (e.key) {
        case 'ArrowUp': if (direction[1] !== 1) setDirection([-1, 0]); break;
        case 'ArrowDown': if (direction[1] !== -1) setDirection([1, 0]); break;
        case 'ArrowLeft': if (direction[0] !== 1) setDirection([0, -1]); break;
        case 'ArrowRight': if (direction[0] !== -1) setDirection([0, 1]); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [direction, gameOver]);

  React.useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const newHead = [prev[0][0] + direction[0], prev[0][1] + direction[1]];
        // Check collision
        if (
          newHead[0] < 0 || newHead[0] > 15 ||
          newHead[1] < 0 || newHead[1] > 15 ||
          prev.some(([x, y]) => x === newHead[0] && y === newHead[1])
        ) {
          setGameOver(true);
          return prev;
        }
        let newSnake = [newHead, ...prev];
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setFood([
            Math.floor(Math.random() * 16),
            Math.floor(Math.random() * 16),
          ]);
          setScore((s) => s + 1);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  React.useEffect(() => {
    if (gameOver) return;
    // Avoid spawning food on the snake
    if (snake.some(([x, y]) => x === food[0] && y === food[1])) {
      setFood([
        Math.floor(Math.random() * 16),
        Math.floor(Math.random() * 16),
      ]);
    }
  }, [food, snake, gameOver]);

  const restart = () => {
    setSnake([[8, 8]]);
    setFood([Math.floor(Math.random() * 16), Math.floor(Math.random() * 16)]);
    setDirection([0, 1]);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">Serpiente (Snake)</h2>
      <div
        className="grid"
        style={{
          gridTemplateRows: `repeat(16, 20px)`,
          gridTemplateColumns: `repeat(16, 20px)`,
          border: '2px solid #888',
          background: '#f8fafc',
        }}
      >
        {[...Array(16 * 16)].map((_, idx) => {
          const x = Math.floor(idx / 16);
          const y = idx % 16;
          const isSnake = snake.some(([sx, sy]) => sx === x && sy === y);
          const isHead = snake[0][0] === x && snake[0][1] === y;
          const isFood = food[0] === x && food[1] === y;
          return (
            <div
              key={idx}
              style={{
                width: 20,
                height: 20,
                background: isHead
                  ? '#16a34a'
                  : isSnake
                  ? '#4ade80'
                  : isFood
                  ? '#fbbf24'
                  : undefined,
                border: '1px solid #e5e7eb',
                boxSizing: 'border-box',
              }}
            />
          );
        })}
      </div>
      <div className="mt-2 text-sm">Puntuación: {score}</div>
      {gameOver && (
        <div className="mt-3 text-red-600 font-bold">
          ¡Juego terminado! <button className="ml-2 px-2 py-1 bg-green-500 text-white rounded" onClick={restart}>Reiniciar</button>
        </div>
      )}
      <div className="mt-2 text-xs text-neutral-500">Usa las flechas para mover la serpiente.</div>
    </div>
  );
}

export default function Juegos() {
  const [selected, setSelected] = useState('snake');
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-black mb-6 tracking-tight text-neutral-900">Juegos</h1>
      <div className="mb-4 flex gap-4">
        <button
          className={`px-4 py-2 rounded font-bold border ${selected === 'snake' ? 'bg-green-500 text-white' : 'bg-white text-green-700 border-green-500'}`}
          onClick={() => setSelected('snake')}
        >
          Serpiente
        </button>
        {/* Aquí puedes agregar más botones para otros juegos en el futuro */}
      </div>
      <div className="bg-white rounded shadow p-4">
        {selected === 'snake' && <SnakeGame />}
        {/* Aquí puedes renderizar otros juegos según el valor de selected */}
      </div>
    </main>
  );
}
