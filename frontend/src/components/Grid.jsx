import { useState } from 'react';

export default function Grid({ width, height, cells, onCellClick, activeCell, activeDirection, answers = {}, showErrors = false, cellStatus = {} }) {
  // cells is object "x,y" => { char, number, x, y }
  
  const renderCell = (x, y) => {
    const key = `${x},${y}`;
    const cellData = cells[key];

    if (!cellData) {
      return <div key={key} className="cell empty" />;
    }

    const isActive = activeCell && activeCell.x === x && activeCell.y === y;
    // Check if in active word path? (Optional highlight)
    
    // Status
    let statusClass = '';
    if (showErrors && answers[key] && answers[key] !== cellData.char) {
        statusClass = 'incorrect';
    } else if (cellStatus[key] === 'correct' || (showErrors && answers[key] === cellData.char)) {
        statusClass = 'correct';
    }

    return (
      <div 
        key={key} 
        className={`cell ${isActive ? 'active' : ''} ${statusClass}`}
        onClick={() => onCellClick(x, y)}
      >
        {cellData.number && <span className="number">{cellData.number}</span>}
        {answers[key] || ''}
      </div>
    );
  };

  return (
    <div 
      className="crossword-grid"
      style={{
        gridTemplateColumns: `repeat(${width}, var(--cell-size))`,
        gridTemplateRows: `repeat(${height}, var(--cell-size))`
      }}
    >
      {Array.from({ length: height }).map((_, y) => 
        Array.from({ length: width }).map((_, x) => renderCell(x, y))
      )}
    </div>
  );
}
