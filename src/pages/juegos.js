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
        <button
          className={`px-4 py-2 rounded font-bold border ${selected === '2048' ? 'bg-yellow-500 text-white' : 'bg-white text-yellow-700 border-yellow-500'}`}
          onClick={() => setSelected('2048')}
        >
          2048
        </button>
        <button
          className={`px-4 py-2 rounded font-bold border ${selected === 'tictactoe' ? 'bg-pink-500 text-white' : 'bg-white text-pink-700 border-pink-500'}`}
          onClick={() => setSelected('tictactoe')}
        >
          Tres en Raya
        </button>
        <button
          className={`px-4 py-2 rounded font-bold border ${selected === 'minesweeper' ? 'bg-green-600 text-white' : 'bg-white text-green-700 border-green-600'}`}
          onClick={() => setSelected('minesweeper')}
        >
          Buscaminas
        </button>
      </div>
      <div className="bg-white rounded shadow p-4">
        {selected === 'snake' && <SnakeGame />}
        {selected === 'sudoku' && <SudokuGame />}
        {selected === '2048' && <Game2048 selected={selected} />}
        {selected === 'tictactoe' && <TicTacToeGame />}
        {selected === 'minesweeper' && <MinesweeperGame />}
      </div>
    </main>
  );
}

// --- Sudoku Game Component ---
// --- 2048 Game Component ---
// --- Minesweeper (Buscaminas) Game Component ---
function MinesweeperGame() {
  const ROWS = 14, COLS = 18, MINES = 40;
  const createEmptyBoard = () => Array(ROWS).fill(null).map(() => Array(COLS).fill({ revealed: false, mine: false, flag: false, adjacent: 0 }));

  function plantMines(board, firstRow, firstCol) {
    let placed = 0;
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    // Avoid placing mines in the 3x3 area around the first click
    function isSafeZone(r, c) {
      return Math.abs(r - firstRow) <= 1 && Math.abs(c - firstCol) <= 1;
    }
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      // Don't plant on the first click or in the 3x3 safe zone or on an already mined cell
      if (isSafeZone(r, c) || newBoard[r][c].mine) continue;
      newBoard[r][c].mine = true;
      placed++;
    }
    // Calculate adjacent mines
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (newBoard[i][j].mine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = i + dr, nc = j + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newBoard[nr][nc].mine) count++;
        }
        newBoard[i][j].adjacent = count;
      }
    }
    return newBoard;
  }

  const [board, setBoard] = React.useState(createEmptyBoard());
  const [minesPlanted, setMinesPlanted] = React.useState(false);
  const [gameOver, setGameOver] = React.useState(false);
  const [won, setWon] = React.useState(false);
  const [flags, setFlags] = React.useState(0);

  // Reveal cells recursively
  function reveal(board, r, c, visited = {}) {
    if (board[r][c].revealed || board[r][c].flag) return;
    board[r][c].revealed = true;
    if (board[r][c].adjacent === 0 && !board[r][c].mine) {
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !(dr === 0 && dc === 0)) {
          if (!board[nr][nc].revealed && !board[nr][nc].mine) {
            reveal(board, nr, nc, visited);
          }
        }
      }
    }
  }

  function handleCellClick(r, c) {
    if (gameOver || won) return;
    let newBoard = board.map(row => row.map(cell => ({ ...cell })));
    if (!minesPlanted) {
      newBoard = plantMines(newBoard, r, c);
      setMinesPlanted(true);
    }
    if (newBoard[r][c].flag) return;
    if (newBoard[r][c].mine) {
      newBoard[r][c].revealed = true;
      setBoard(newBoard);
      setGameOver(true);
      return;
    }
    reveal(newBoard, r, c);
    setBoard(newBoard);
    checkWin(newBoard);
  }

  function handleRightClick(e, r, c) {
    e.preventDefault();
    if (gameOver || won || board[r][c].revealed) return;
    let newBoard = board.map(row => row.map(cell => ({ ...cell })));
    if (newBoard[r][c].flag) {
      newBoard[r][c].flag = false;
      setFlags(f => f - 1);
    } else if (flags < MINES) {
      newBoard[r][c].flag = true;
      setFlags(f => f + 1);
    }
    setBoard(newBoard);
    checkWin(newBoard);
  }

  function checkWin(bd) {
    let revealedCount = 0;
    for (let i = 0; i < ROWS; i++) for (let j = 0; j < COLS; j++) {
      if (bd[i][j].revealed) revealedCount++;
    }
    // Win if all non-mine cells are revealed
    if (revealedCount === ROWS * COLS - MINES) setWon(true);
  }

  function reset() {
    setBoard(createEmptyBoard());
    setMinesPlanted(false);
    setGameOver(false);
    setWon(false);
    setFlags(0);
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">Buscaminas</h2>
      <div className="mb-2 text-base">Minas: <span className="font-bold">{MINES}</span> | Banderas: <span className="font-bold">{flags}</span></div>
      <div className="grid grid-cols-18 gap-1 bg-green-100 p-2 rounded select-none">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <button
              key={i+"-"+j}
              className={`w-8 h-8 flex items-center justify-center text-base font-bold rounded border border-green-300
                ${cell.revealed ? (cell.mine ? 'bg-red-500 text-white' : 'bg-green-200') : 'bg-green-50'}
                ${cell.flag ? 'bg-yellow-400 text-green-900' : ''}`}
              onClick={() => handleCellClick(i, j)}
              onContextMenu={e => handleRightClick(e, i, j)}
              disabled={cell.revealed || gameOver || won}
              aria-label={`Celda ${i+1},${j+1}`}
            >
              {cell.revealed ? (cell.mine ? '💣' : (cell.adjacent || '')) : (cell.flag ? '🚩' : '')}
            </button>
          ))
        )}
      </div>
      {(gameOver || won) && (
        <div className={`mt-4 text-lg font-bold ${won ? 'text-green-700' : 'text-red-600'}`}>
          {won ? '¡Ganaste! ¡Has encontrado todas las minas!' : '¡Perdiste! Había una mina.'}
        </div>
      )}
      <div className="flex gap-2 mt-4">
        <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={reset}>Reiniciar</button>
      </div>
      <div className="mt-2 text-xs text-neutral-500">Haz clic izquierdo para descubrir una celda. Haz clic derecho para marcar/desmarcar una bandera. Descubre todas las celdas sin minas para ganar.</div>
    </div>
  );
}

// --- Tic Tac Toe Game Component ---
function TicTacToeGame() {
  const emptyBoard = Array(3).fill(null).map(() => Array(3).fill(null));
  const [board, setBoard] = React.useState(emptyBoard);
  const [turn, setTurn] = React.useState('X');
  const [winner, setWinner] = React.useState(null);
  const [draw, setDraw] = React.useState(false);

  function checkWinner(bd) {
    // Rows, columns, diagonals
    for (let i = 0; i < 3; i++) {
      if (bd[i][0] && bd[i][0] === bd[i][1] && bd[i][1] === bd[i][2]) return bd[i][0];
      if (bd[0][i] && bd[0][i] === bd[1][i] && bd[1][i] === bd[2][i]) return bd[0][i];
    }
    if (bd[0][0] && bd[0][0] === bd[1][1] && bd[1][1] === bd[2][2]) return bd[0][0];
    if (bd[0][2] && bd[0][2] === bd[1][1] && bd[1][1] === bd[2][0]) return bd[0][2];
    return null;
  }

  function checkDraw(bd) {
    return bd.flat().every(cell => cell !== null);
  }

  function handleClick(i, j) {
    if (board[i][j] || winner) return;
    const newBoard = board.map(row => [...row]);
    newBoard[i][j] = turn;
    const win = checkWinner(newBoard);
    const isDraw = !win && checkDraw(newBoard);
    setBoard(newBoard);
    setWinner(win);
    setDraw(isDraw);
    if (!win && !isDraw) setTurn(turn === 'X' ? 'O' : 'X');
  }

  function reset() {
    setBoard(emptyBoard);
    setTurn('X');
    setWinner(null);
    setDraw(false);
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">Tricky</h2>
      <div className="grid grid-cols-3 gap-1 bg-pink-100 p-2 rounded">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <button
              key={i+"-"+j}
              className={`w-16 h-16 flex items-center justify-center text-3xl font-bold rounded border border-pink-300 hover:bg-pink-200 ${cell === 'X' ? 'text-pink-700' : cell === 'O' ? 'text-blue-700' : ''}`}
              onClick={() => handleClick(i, j)}
              disabled={!!cell || !!winner || draw}
              aria-label={`Celda ${i+1},${j+1}`}
            >{cell}</button>
          ))
        )}
      </div>
      <div className="mt-4 text-lg font-semibold">
        {winner && <span className="text-green-700">¡Ganador: {winner}!</span>}
        {!winner && draw && <span className="text-neutral-700">¡Empate!</span>}
        {!winner && !draw && <span className="text-pink-700">Turno: {turn}</span>}
      </div>
      <button className="px-3 py-1 mt-4 bg-pink-600 text-white rounded" onClick={reset}>Reiniciar</button>
      <div className="mt-2 text-xs text-neutral-500">Haz clic en una celda para colocar tu ficha. Gana quien logre tres en línea.</div>
    </div>
  );
}

function Game2048({ selected }) {
  const size = 4;
  const [board, setBoard] = React.useState(() => addRandom(addRandom(Array(size).fill(0).map(() => Array(size).fill(0)))));
  const [score, setScore] = React.useState(0);
  const [gameOver, setGameOver] = React.useState(false);
  const [won, setWon] = React.useState(false);

  // Use a ref to always get the latest state in the event handler
  const boardRef = React.useRef(board);
  const gameOverRef = React.useRef(gameOver);
  const wonRef = React.useRef(won);
  React.useEffect(() => { boardRef.current = board; }, [board]);
  React.useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
  React.useEffect(() => { wonRef.current = won; }, [won]);

  React.useEffect(() => {
    if (selected !== '2048') return;
    const handleKey = (e) => {
      if (gameOverRef.current || wonRef.current) return;
      let moved = false;
      let newBoard = boardRef.current.map(row => [...row]);
      let points = 0;
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
        switch (e.key) {
          case 'ArrowUp': [newBoard, points, moved] = move(newBoard, 'up'); break;
          case 'ArrowDown': [newBoard, points, moved] = move(newBoard, 'down'); break;
          case 'ArrowLeft': [newBoard, points, moved] = move(newBoard, 'left'); break;
          case 'ArrowRight': [newBoard, points, moved] = move(newBoard, 'right'); break;
          default: break;
        }
        if (moved) {
          newBoard = addRandom(newBoard);
          setBoard(newBoard);
          setScore(s => s + points);
          if (has2048(newBoard)) setWon(true);
          else if (!canMove(newBoard)) setGameOver(true);
        }
      }
    };
    window.addEventListener('keydown', handleKey, { passive: false });
    return () => window.removeEventListener('keydown', handleKey);
  }, [selected]);

  function reset() {
    setBoard(addRandom(addRandom(Array(size).fill(0).map(() => Array(size).fill(0)))));
    setScore(0);
    setGameOver(false);
    setWon(false);
  }

  // --- Helper functions ---
  function addRandom(bd) {
    const empty = [];
    for (let i=0; i<size; i++) for (let j=0; j<size; j++) if (bd[i][j]===0) empty.push([i,j]);
    if (empty.length === 0) return bd;
    const [i,j] = empty[Math.floor(Math.random()*empty.length)];
    bd[i][j] = Math.random()<0.9 ? 2 : 4;
    return bd;
  }
  function transpose(bd) {
    return bd[0].map((_,i) => bd.map(row => row[i]));
  }
  function reverse(bd) {
    return bd.map(row => [...row].reverse());
  }
  function compress(row) {
    const filtered = row.filter(x => x !== 0);
    while (filtered.length < size) filtered.push(0);
    return filtered;
  }
  function merge(row) {
    let points = 0;
    for (let i=0; i<size-1; i++) {
      if (row[i] !== 0 && row[i] === row[i+1]) {
        row[i] *= 2;
        points += row[i];
        row[i+1] = 0;
      }
    }
    return [row, points];
  }
  function move(bd, dir) {
    let moved = false;
    let points = 0;
    let newBd = bd.map(row => [...row]);
    if (dir === 'up') {
      newBd = transpose(newBd);
      for (let i=0; i<size; i++) {
        let row = compress(newBd[i]);
        let merged, pointsThisRow;
        [merged, pointsThisRow] = merge(row);
        points += pointsThisRow;
        row = compress(merged);
        if (!arraysEqual(row, newBd[i])) moved = true;
        newBd[i] = row;
      }
      newBd = transpose(newBd);
    } else if (dir === 'down') {
      newBd = transpose(newBd);
      newBd = reverse(newBd);
      for (let i=0; i<size; i++) {
        let row = compress(newBd[i]);
        let merged, pointsThisRow;
        [merged, pointsThisRow] = merge(row);
        points += pointsThisRow;
        row = compress(merged);
        if (!arraysEqual(row, newBd[i])) moved = true;
        newBd[i] = row;
      }
      newBd = reverse(newBd);
      newBd = transpose(newBd);
    } else if (dir === 'left') {
      for (let i=0; i<size; i++) {
        let row = compress(newBd[i]);
        let merged, pointsThisRow;
        [merged, pointsThisRow] = merge(row);
        points += pointsThisRow;
        row = compress(merged);
        if (!arraysEqual(row, newBd[i])) moved = true;
        newBd[i] = row;
      }
    } else if (dir === 'right') {
      newBd = reverse(newBd);
      for (let i=0; i<size; i++) {
        let row = compress(newBd[i]);
        let merged, pointsThisRow;
        [merged, pointsThisRow] = merge(row);
        points += pointsThisRow;
        row = compress(merged);
        if (!arraysEqual(row, newBd[i])) moved = true;
        newBd[i] = row;
      }
      newBd = reverse(newBd);
    }
    return [newBd, points, moved];
  }
  function arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }
  function canMove(bd) {
    for (let i=0; i<size; i++) for (let j=0; j<size; j++) {
      if (bd[i][j]===0) return true;
      if (i<size-1 && bd[i][j]===bd[i+1][j]) return true;
      if (j<size-1 && bd[i][j]===bd[i][j+1]) return true;
    }
    return false;
  }
  function has2048(bd) {
    for (let i=0; i<size; i++) for (let j=0; j<size; j++) if (bd[i][j]===2048) return true;
    return false;
  }

  return (
    <div className="flex flex-col items-center select-none">
      <h2 className="text-xl font-bold mb-2">2048</h2>
      <div className="mb-2 text-base">Puntaje: <span className="font-bold">{score}</span></div>
      <div className="grid grid-cols-4 gap-1 bg-yellow-100 p-2 rounded">
        {board.map((row, i) => row.map((cell, j) => (
          <div key={i + '-' + j}
            className={`w-16 h-16 flex items-center justify-center text-2xl font-bold rounded border ${cell ? 'bg-yellow-300' : 'bg-yellow-50'} ${cell >= 128 ? 'text-white bg-yellow-500' : ''}`}
          >{cell !== 0 ? cell : ''}</div>
        )))}
      </div>
      {(gameOver || won) && (
        <div className={`mt-4 text-lg font-bold ${won ? 'text-green-700' : 'text-red-600'}`}>
          {won ? '¡Ganaste! ¡Llegaste a 2048!' : 'Juego terminado. ¡Intenta de nuevo!'}
        </div>
      )}
      <div className="flex gap-2 mt-4">
        <button className="px-3 py-1 bg-yellow-600 text-white rounded" onClick={reset}>Reiniciar</button>
      </div>
      <div className="mt-2 text-xs text-neutral-500">Usa las flechas del teclado para mover las fichas. Combina números iguales para llegar a 2048.</div>
    </div>
  );
}

function SudokuGame() {
  // Multiple Sudoku puzzles (0 = empty)
  const puzzles = [
    [
      [5,3,0,0,7,0,0,0,0],
      [6,0,0,1,9,5,0,0,0],
      [0,9,8,0,0,0,0,6,0],
      [8,0,0,0,6,0,0,0,3],
      [4,0,0,8,0,3,0,0,1],
      [7,0,0,0,2,0,0,0,6],
      [0,6,0,0,0,0,2,8,0],
      [0,0,0,4,1,9,0,0,5],
      [0,0,0,0,8,0,0,7,9],
    ],
    [
      [0,2,0,6,0,8,0,0,0],
      [5,8,0,0,0,9,7,0,0],
      [0,0,0,0,4,0,0,0,0],
      [3,7,0,0,0,0,5,0,0],
      [6,0,0,0,0,0,0,0,4],
      [0,0,8,0,0,0,0,1,3],
      [0,0,0,0,2,0,0,0,0],
      [0,0,9,8,0,0,0,3,6],
      [0,0,0,3,0,6,0,9,0],
    ],
    [
      [0,0,0,0,0,0,2,0,0],
      [0,8,0,0,0,7,0,9,0],
      [6,0,2,0,0,0,5,0,0],
      [0,7,0,0,6,0,0,0,0],
      [0,0,0,9,0,1,0,0,0],
      [0,0,0,0,2,0,0,4,0],
      [0,0,5,0,0,0,6,0,3],
      [0,9,0,4,0,0,0,7,0],
      [0,0,6,0,0,0,0,0,0],
    ],
    [
      [1,0,0,0,0,7,0,9,0],
      [0,3,0,0,2,0,0,0,8],
      [0,0,9,6,0,0,5,0,0],
      [0,0,5,3,0,0,9,0,0],
      [0,1,0,0,8,0,0,0,2],
      [6,0,0,0,0,4,0,0,0],
      [3,0,0,0,0,0,0,1,0],
      [0,4,1,0,0,0,0,0,7],
      [0,0,7,0,0,0,3,0,0],
    ]
  ];
  const [puzzleIdx, setPuzzleIdx] = React.useState(() => Math.floor(Math.random() * puzzles.length));
  const [grid, setGrid] = React.useState(puzzles[puzzleIdx].map(row => [...row]));
  const [notes, setNotes] = React.useState(() => Array(9).fill(0).map(() => Array(9).fill(null).map(() => new Set())));
  const [annotationMode, setAnnotationMode] = React.useState(false);
  const [message, setMessage] = React.useState("");

  // Always use the current puzzle as the initial grid
  const initial = puzzles[puzzleIdx];

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

  // Handle user input (number entry or annotation)
  function handleCellInput(row, col, e) {
    let val = e.target.value;
    if (val === "") val = 0;
    else val = parseInt(val);
    if (isNaN(val) || val < 1 || val > 9) return;
    // Only allow editing empty cells
    if (initial[row][col] !== 0) return;
    if (annotationMode) {
      // Toggle annotation for this number
      setNotes(prev => {
        const newNotes = prev.map(r => r.map(s => new Set(s)));
        if (newNotes[row][col].has(val)) {
          newNotes[row][col].delete(val);
        } else {
          newNotes[row][col].add(val);
        }
        return newNotes;
      });
    } else {
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = val;
      setGrid(newGrid);
      // Clear notes for this cell
      setNotes(prev => {
        const newNotes = prev.map(r => r.map(s => new Set(s)));
        newNotes[row][col] = new Set();
        return newNotes;
      });
      setMessage("");
    }
  }

  // Handle cell clear (delete/backspace)
  function handleCellClear(row, col) {
    if (initial[row][col] !== 0) return;
    if (annotationMode) {
      setNotes(prev => {
        const newNotes = prev.map(r => r.map(s => new Set(s)));
        newNotes[row][col] = new Set();
        return newNotes;
      });
    } else {
      setGrid(prev => {
        const newGrid = prev.map(r => [...r]);
        newGrid[row][col] = 0;
        return newGrid;
      });
      setNotes(prev => {
        const newNotes = prev.map(r => r.map(s => new Set(s)));
        newNotes[row][col] = new Set();
        return newNotes;
      });
    }
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
    const idx = Math.floor(Math.random() * puzzles.length);
    setPuzzleIdx(idx);
    setGrid(puzzles[idx].map(row => [...row]));
    setNotes(Array(9).fill(0).map(() => Array(9).fill(null).map(() => new Set())));
    setMessage("");
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">Sudoku</h2>
      <div className="flex gap-2 mb-2">
        <button
          className={`px-3 py-1 rounded ${annotationMode ? 'bg-yellow-400 text-black font-bold' : 'bg-neutral-200 text-neutral-700'}`}
          onClick={() => setAnnotationMode(a => !a)}
        >
          {annotationMode ? 'Modo anotación (activo)' : 'Modo anotación'}
        </button>
      </div>
      <div className="grid grid-cols-9 gap-0.5 bg-neutral-300 p-1 rounded">
        {grid.map((row, i) =>
          row.map((cell, j) => {
            const isFixed = initial[i][j] !== 0;
            return (
              <div
                key={i+"-"+j}
                className={`relative w-8 h-8 border ${isFixed ? 'bg-neutral-200 font-bold' : 'bg-white'} ${((i+1)%3===0 && i!==8 ? 'border-b-2 border-neutral-500' : '')} ${((j+1)%3===0 && j!==8 ? 'border-r-2 border-neutral-500' : '')}`}
                style={{fontSize: isFixed ? '1.1rem' : '1rem'}}
              >
                {isFixed ? (
                  <span className="absolute inset-0 flex items-center justify-center select-none">{initial[i][j]}</span>
                ) : cell !== 0 ? (
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-full h-full text-center text-lg bg-white outline-none"
                    value={cell === 0 ? "" : cell}
                    onChange={e => handleCellInput(i, j, e)}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' || e.key === 'Delete') {
                        e.preventDefault();
                        handleCellClear(i, j);
                      }
                    }}
                  />
                ) : notes[i][j] && notes[i][j].size > 0 ? (
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 text-[0.5rem] text-neutral-500 select-none pointer-events-none" style={{lineHeight:'1'}}>
                    {[1,2,3,4,5,6,7,8,9].map(n => (
                      <span key={n} className="flex items-center justify-center" style={{opacity: notes[i][j].has(n) ? 1 : 0.15}}>{n}</span>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-full h-full text-center text-lg bg-white outline-none"
                    value={""}
                    onChange={e => handleCellInput(i, j, e)}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' || e.key === 'Delete') {
                        e.preventDefault();
                        handleCellClear(i, j);
                      }
                    }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={checkSolution}>Comprobar</button>
        <button className="px-3 py-1 bg-neutral-400 text-white rounded" onClick={reset}>Reiniciar</button>
      </div>
      {message && <div className="mt-2 text-base font-semibold text-blue-700">{message}</div>}
      <div className="mt-2 text-xs text-neutral-500">
        Llena la cuadrícula con números del 1 al 9. Cada fila, columna y subcuadro 3x3 debe contener todos los números del 1 al 9 sin repetir.<br/>
        Puedes activar el <b>Modo anotación</b> para agregar pequeños números en las celdas como ayuda.
      </div>
    </div>
  );
}
