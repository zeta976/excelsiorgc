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
        <button
          className={`px-4 py-2 rounded font-bold border ${selected === 'sudoku' ? 'bg-blue-500 text-white' : 'bg-white text-blue-700 border-blue-500'}`}
          onClick={() => setSelected('sudoku')}
        >
          Sudoku
        </button>
      </div>
      <div className="bg-white rounded shadow p-4">
        {selected === 'snake' && <SnakeGame />}
        {selected === 'sudoku' && <SudokuGame />}
      </div>
    </main>
  );
}

// --- Sudoku Game Component ---
function SudokuGame() {
  // Example easy puzzle (0 = empty)
  const initial = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9],
  ];
  const [grid, setGrid] = React.useState(initial.map(row => [...row]));
  const [message, setMessage] = React.useState("");

  // Check if a value is valid in its position
  function isValid(grid, row, col, val) {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === val && i !== col) return false;
      if (grid[i][col] === val && i !== row) return false;
    }
    const boxRow = Math.floor(row/3)*3;
    const boxCol = Math.floor(col/3)*3;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      if (grid[boxRow+i][boxCol+j] === val && (boxRow+i !== row || boxCol+j !== col)) return false;
    }
    return true;
  }

  // Handle user input
  function handleChange(row, col, e) {
    let val = e.target.value;
    if (val === "") val = 0;
    else val = parseInt(val);
    if (isNaN(val) || val < 0 || val > 9) return;
    // Only allow editing empty cells
    if (initial[row][col] !== 0) return;
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = val;
    setGrid(newGrid);
    setMessage("");
  }

  // Check solution
  function checkSolution() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const val = grid[row][col];
        if (val === 0 || !isValid(grid, row, col, val)) {
          setMessage("¡Hay errores o celdas vacías!");
          return;
        }
      }
    }
    setMessage("¡Correcto! Sudoku resuelto.");
  }

  // Reset puzzle
  function reset() {
    setGrid(initial.map(row => [...row]));
    setMessage("");
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">Sudoku</h2>
      <div className="grid grid-cols-9 gap-0.5 bg-neutral-300 p-1 rounded">
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <input
              key={i+"-"+j}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className={`w-8 h-8 text-center text-lg border ${initial[i][j]!==0 ? 'bg-neutral-200 font-bold' : 'bg-white'} ${((i+1)%3===0 && i!==8 ? 'border-b-2 border-neutral-500' : '')} ${((j+1)%3===0 && j!==8 ? 'border-r-2 border-neutral-500' : '')}`}
              value={cell === 0 ? "" : cell}
              onChange={e => handleChange(i,j,e)}
              disabled={initial[i][j] !== 0}
            />
          ))
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={checkSolution}>Comprobar</button>
        <button className="px-3 py-1 bg-neutral-400 text-white rounded" onClick={reset}>Reiniciar</button>
      </div>
      {message && <div className="mt-2 text-base font-semibold text-blue-700">{message}</div>}
      <div className="mt-2 text-xs text-neutral-500">Llena la cuadrícula con números del 1 al 9. Cada fila, columna y subcuadro 3x3 debe contener todos los números del 1 al 9 sin repetir.</div>
    </div>
  );
}
