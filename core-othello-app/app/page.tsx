'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import './globals.css';

type Stone = 'black' | 'white';
type Area = 'holy' | 'highland' | 'capital' | 'industry' | 'sea';

interface Cell {
  x: number;
  y: number;
  stone: Stone | null;
  area: Area;
}

const areaMap: Area[][] = [
  ['holy','holy','holy','holy','highland','highland','highland','highland'],
  ['holy','holy','holy','holy','highland','highland','highland','highland'],
  ['holy','holy','holy','holy','highland','highland','highland','highland'],
  ['holy','holy','holy','capital','capital','highland','highland','highland'],
  ['sea','sea','sea','capital','capital','industry','industry','industry'],
  ['sea','sea','sea','sea','industry','industry','industry','industry'],
  ['sea','sea','sea','sea','industry','industry','industry','industry'],
  ['sea','sea','sea','sea','industry','industry','industry','industry'],
];

const directions = [
  [0, 1],[1, 0],[0, -1],[-1, 0],
  [1, 1],[1, -1],[-1, 1],[-1, -1],
];

function createInitialBoard(): Cell[][] {
  return Array(8).fill(null).map((_, y) =>
    Array(8).fill(null).map((_, x) => {
      let stone: Stone | null = null;
      if (x === 3 && y === 3) stone = 'white';
      if (x === 4 && y === 3) stone = 'black';
      if (x === 3 && y === 4) stone = 'black';
      if (x === 4 && y === 4) stone = 'white';

      return {
        x,
        y,
        stone,
        area: areaMap[y][x],
      };
    })
  );
}

export default function HomePage() {
  const [board, setBoard] = useState<Cell[][]>(createInitialBoard);
  const [turn, setTurn] = useState<Stone>('black');
  const [passCount, setPassCount] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    const hasValidMove = board.flat().some(cell =>
      isValidMove(board, cell.x, cell.y, turn)
    );
    if (!hasValidMove) {
      const next = turn === 'black' ? 'white' : 'black';
      const opponentHasMove = board.flat().some(cell =>
        isValidMove(board, cell.x, cell.y, next)
      );
      if (!opponentHasMove) {
        endGame();
      } else {
        alert(`${turn}はパスです`);
        setTurn(next);
        setPassCount(p => p + 1);
      }
    } else {
      setPassCount(0);
    }
  }, [board, turn]);

  function endGame() {
    const counts = board.flat().reduce(
      (acc, cell) => {
        if (cell.stone === 'black') acc.black++;
        else if (cell.stone === 'white') acc.white++;
        return acc;
      },
      { black: 0, white: 0 }
    );
    if (counts.black > counts.white) setWinner('black');
    else if (counts.white > counts.black) setWinner('white');
    else setWinner('draw');
  }

  function isValidMove(b: Cell[][], x: number, y: number, color: Stone): boolean {
    if (b[y][x].stone) return false;
    const opponent = color === 'black' ? 'white' : 'black';
    for (const [dx, dy] of directions) {
      let i = 1;
      let stonesToFlip = 0;
      while (true) {
        const nx = x + dx * i;
        const ny = y + dy * i;
        if (nx < 0 || ny < 0 || nx >= 8 || ny >= 8) break;
        const s = b[ny][nx].stone;
        if (s === opponent) {
          stonesToFlip++;
        } else if (s === color && stonesToFlip > 0) {
          return true;
        } else {
          break;
        }
        i++;
      }
    }
    return false;
  }

  function handleClick(x: number, y: number) {
    if (!isValidMove(board, x, y, turn)) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[y][x].stone = turn;

    const opponent = turn === 'black' ? 'white' : 'black';

    for (const [dx, dy] of directions) {
      const toFlip: [number, number][] = [];
      let i = 1;
      while (true) {
        const nx = x + dx * i;
        const ny = y + dy * i;
        if (nx < 0 || ny < 0 || nx >= 8 || ny >= 8) break;
        const s = newBoard[ny][nx].stone;
        if (s === opponent) {
          toFlip.push([nx, ny]);
        } else if (s === turn) {
          for (const [fx, fy] of toFlip) {
            newBoard[fy][fx].stone = turn;
          }
          break;
        } else {
          break;
        }
        i++;
      }
    }

    setBoard(newBoard);
    setTurn(turn === 'black' ? 'white' : 'black');
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>{winner ? `勝者: ${winner}` : `手番: ${turn}`}</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 60px)',
          gridTemplateRows: 'repeat(8, 60px)',
          gap: '2px',
          backgroundImage: 'url("/images/bg-map.jpg")',
          backgroundSize: 'cover',
          width: 'max-content',
          margin: '20px auto',
          padding: '10px',
          borderRadius: '8px',
        }}
      >
        {board.flat().map((cell) => (
          <div
            key={`${cell.x}-${cell.y}`}
            onClick={() => handleClick(cell.x, cell.y)}
            style={{
              width: '60px',
              height: '60px',
              backgroundColor: 'rgba(255,255,255,0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isValidMove(board, cell.x, cell.y, turn) ? 'pointer' : 'default',
            }}
          >
            {cell.stone && (
              <Image
                src={`/images/stone_${cell.stone}_${cell.area}.png`}
                alt="stone"
                width={50}
                height={50}
                style={{ objectFit: 'contain' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
