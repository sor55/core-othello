'use client';

import Image from 'next/image';
import './globals.css';

const initialBoard = () => {
  const areaMap = [
    ['holy','holy','holy','holy','highland','highland','highland','highland'],
    ['holy','holy','holy','holy','highland','highland','highland','highland'],
    ['holy','holy','holy','holy','highland','highland','highland','highland'],
    ['holy','holy','holy','capital','capital','highland','highland','highland'],
    ['sea','sea','sea','capital','capital','industry','industry','industry'],
    ['sea','sea','sea','sea','industry','industry','industry','industry'],
    ['sea','sea','sea','sea','industry','industry','industry','industry'],
    ['sea','sea','sea','sea','industry','industry','industry','industry'],
  ];

  const board = Array(8).fill(null).map((_, y) =>
    Array(8).fill(null).map((_, x) => {
      let stone: 'white' | 'black' | null = null;
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

  return board;
};

export default function HomePage() {
  const board = initialBoard();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 60px)',
        gridTemplateRows: 'repeat(8, 60px)',
        gap: '2px',
        backgroundImage: 'url("/images/bg-map.jpg")',
        backgroundSize: 'cover',
        width: 'max-content',
        margin: '50px auto',
        padding: '10px',
        borderRadius: '8px',
      }}
    >
      {board.flat().map((cell) => (
        <div
          key={`${cell.x}-${cell.y}`}
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
  );
}
