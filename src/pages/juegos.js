import React, { useState } from 'react';

// --- Simple Snake Game Component ---
function SnakeGame() {
  const [snake, setSnake] = useState([[8, 8]]);
  const [food, setFood] = useState([Math.floor(Math.random() * 16), Math.floor(Math.random() * 16)]);
  const [direction, setDirection] = useState([0, 1]);
  const directionRef = React.useRef(direction);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Helper to generate a food position not on the snake
  const generateFood = (snakeArr) => {
    let newFood;
    do {
      newFood = [Math.floor(Math.random() * 16), Math.floor(Math.random() * 16)];
    } while (snakeArr.some(([x, y]) => x === newFood[0] && y === newFood[1]));
    return newFood;
  };

  React.useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  React.useEffect(() => {
    if (gameOver) return;
    const handleKey = (e) => {
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const [dx, dy] = directionRef.current;
        let newDir = directionRef.current;
        switch (e.key) {
          case 'ArrowUp':
            if (dx === 0 && dy !== 0) newDir = [-1, 0]; // moving horizontally, allow up
            break;
          case 'ArrowDown':
            if (dx === 0 && dy !== 0) newDir = [1, 0]; // moving horizontally, allow down
            break;
          case 'ArrowLeft':
            if (dy === 0 && dx !== 0) newDir = [0, -1]; // moving vertically, allow left
            break;
          case 'ArrowRight':
            if (dy === 0 && dx !== 0) newDir = [0, 1]; // moving vertically, allow right
            break;
          default: break;
        }
        // Prevent reversing direction
        if (
          (newDir[0] !== -dx || newDir[1] !== -dy) &&
          (newDir[0] !== dx || newDir[1] !== dy)
        ) {
          if (newDir !== directionRef.current) {
            setDirection(newDir);
            directionRef.current = newDir;
          }
        }
      }
    };
    window.addEventListener('keydown', handleKey, { passive: false });
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameOver]);

  React.useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const dir = directionRef.current;
        const newHead = [prev[0][0] + dir[0], prev[0][1] + dir[1]];
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
          const newFood = generateFood(newSnake);
          setFood(newFood);
          setScore((s) => s + 1);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [food, gameOver]);

  // No longer needed: food is always generated off the snake


  const restart = () => {
    setSnake([[8, 8]]);
    setFood(generateFood([[8, 8]]));
    setDirection([0, 1]);
    directionRef.current = [0, 1];
    setGameOver(false);
    setScore(0);
  };


  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">Serpiente (Snake)</h2>
      <div
        className="grid"
        tabIndex={0}
        style={{
          outline: 'none',
          gridTemplateRows: `repeat(16, 20px)`,
          gridTemplateColumns: `repeat(16, 20px)`,
          border: '2px solid #888',
          background: '#f8fafc',
        }}
        aria-label="Área del juego de la serpiente"
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
