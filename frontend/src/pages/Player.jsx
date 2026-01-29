import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, HelpCircle, Trophy, Home, Info, X, Keyboard, MousePointer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getPuzzle } from '../utils/crossword';

function PlayerPage() {
  const { id } = useParams();
  const [puzzle, setPuzzle] = useState(null);
  const [inputs, setInputs] = useState({});
  const [activeCell, setActiveCell] = useState(null);
  const [direction, setDirection] = useState('across'); 
  const [isWon, setIsWon] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  
  const inputsRef = useRef({});

  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    getPuzzle(id)
      // .then(res => res.json())
      .then(data => {
        // Normalize legacy data that might have 'cells' instead of 'grid'
        if (!data.grid && data.cells) {
          data.grid = data.cells;
        }
        setPuzzle(data);
      })
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    if (!puzzle) return;
    const allFilled = puzzle.words.every(w => {
      for (let i = 0; i < w.word.length; i++) {
        const cx = w.direction === 'across' ? w.x + i : w.x;
        const cy = w.direction === 'across' ? w.y : w.y + i;
        const key = `${cx},${cy}`;
        if (inputs[key] !== w.word[i]) return false;
      }
      return true;
    });
    
    if (allFilled && Object.keys(inputs).length > 0 && !isWon) {
      setIsWon(true);
      triggerWinConfetti();
    }
  }, [inputs, puzzle, isWon]);

  // Check effect
  useEffect(() => {
    if (isChecking) {
       // Re-check win condition if inputs change while checking is on
       if (!puzzle) return;
       const allFilled = puzzle.words.every(w => {
         for (let i = 0; i < w.word.length; i++) {
            const cx = w.direction === 'across' ? w.x + i : w.x;
            const cy = w.direction === 'across' ? w.y : w.y + i;
            const key = `${cx},${cy}`;
            if (inputs[key] !== w.word[i]) return false;
         }
         return true;
       });
       
       if (allFilled && !isWon) {
         setIsWon(true);
         triggerWinConfetti();
         setIsChecking(false); // Reset checking visual on win
       }
    }
  }, [inputs, isChecking, puzzle, isWon]);

  const triggerWinConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#60a5fa', '#a855f7', '#fbbf24'] 
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#60a5fa', '#a855f7', '#fbbf24']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleCheck = () => {
    setIsChecking(true);
    
    // Check if won immediately after clicking check
    if (!puzzle) return;
    const allFilled = puzzle.words.every(w => {
      for (let i = 0; i < w.word.length; i++) {
        const cx = w.direction === 'across' ? w.x + i : w.x;
        const cy = w.direction === 'across' ? w.y : w.y + i;
        const key = `${cx},${cy}`;
        if (inputs[key] !== w.word[i]) return false;
      }
      return true;
    });
    
    if (allFilled && Object.keys(inputs).length > 0 && !isWon) {
      setIsWon(true);
      triggerWinConfetti();
    }
  };

  const handleCellClick = (x, y) => {
    if (activeCell?.x === x && activeCell?.y === y) {
      setDirection(d => d === 'across' ? 'down' : 'across');
    } else {
      setActiveCell({ x, y });
    }
  };

  const handleKeyDown = (e, x, y) => {
    if (isWon) return;

    if (e.key === 'ArrowRight') {
      moveFocus(x + 1, y);
    } else if (e.key === 'ArrowLeft') {
      moveFocus(x - 1, y);
    } else if (e.key === 'ArrowDown') {
      moveFocus(x, y + 1);
    } else if (e.key === 'ArrowUp') {
      moveFocus(x, y - 1);
    } else if (e.key === 'Backspace') {
      const newInputs = { ...inputs };
      if (!inputs[`${x},${y}`]) {
         const next = getNextPos(x, y, true);
         if (next) {
            newInputs[`${next.x},${next.y}`] = '';
            setInputs(newInputs);
            moveFocus(next.x, next.y);
         }
      } else {
         newInputs[`${x},${y}`] = '';
         setInputs(newInputs);
      }
    }
  };

  const handleChange = (e, x, y) => {
    if (isWon) return;
    const char = e.target.value.slice(-1).toUpperCase();
    if (!/^[A-Z]$/.test(char) && char !== '') return;

    const newInputs = { ...inputs, [`${x},${y}`]: char };
    setInputs(newInputs);

    if (char) {
      const next = getNextPos(x, y);
      if (next) moveFocus(next.x, next.y);
    }
  };

  const getNextPos = (x, y, backwards = false) => {
    let nextX = x;
    let nextY = y;
    if (direction === 'across') {
       nextX = backwards ? x - 1 : x + 1;
    } else {
       nextY = backwards ? y - 1 : y + 1;
    }
    if (puzzle.grid[`${nextX},${nextY}`]) {
      return { x: nextX, y: nextY };
    }
    return null;
  };

  const moveFocus = (x, y) => {
    const el = inputsRef.current[`${x},${y}`];
    if (el) {
      el.focus();
      setActiveCell({ x, y });
    }
  };

  if (!puzzle) return (
    <div className="flex items-center justify-center min-h-[60vh]">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  const acrossClues = puzzle.words ? puzzle.words.filter(w => w.direction === 'across').sort((a,b) => a.number - b.number) : [];
  const downClues = puzzle.words ? puzzle.words.filter(w => w.direction === 'down').sort((a,b) => a.number - b.number) : [];

  return (
    <div className="animate-fade-in pb-20 max-w-7xl mx-auto relative">
      
      {/* Header */}
      <div className="mb-6 lg:mb-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">{puzzle.title}</h1>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-sm text-slate-400">
             <span className="px-2 py-1 bg-slate-800 rounded-md border border-slate-700">{puzzle.height}x{puzzle.width} Grid</span>
             <span className="px-2 py-1 bg-slate-800 rounded-md border border-slate-700">{puzzle.words ? puzzle.words.length : 0} Words</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
          <button 
             onClick={handleCheck}
             className="flex-1 md:flex-none flex items-center justify-center gap-2 text-white bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-2 rounded-lg font-semibold shadow-lg shadow-indigo-500/20 whitespace-nowrap"
          >
            <CheckCircle className="w-4 h-4" /> Check
          </button>
          <button 
             onClick={() => setShowTutorial(true)}
             className="flex-1 md:flex-none flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-500 transition-colors px-4 py-2 rounded-lg font-semibold shadow-lg shadow-blue-500/20 whitespace-nowrap"
          >
            <Info className="w-4 h-4" /> Help
          </button>
          <Link to="/list" className="flex-1 md:flex-none flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10 whitespace-nowrap">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Grid Area - Always First */}
        <div className="lg:col-span-8 order-1">
          <div className="glass-panel p-4 md:p-8 flex justify-center items-center h-[50vh] lg:h-auto lg:min-h-[600px] overflow-auto bg-slate-900/40 relative">
            <div 
              className="grid gap-[2px] md:gap-[4px] p-2 md:p-4 bg-slate-800 rounded-xl shadow-2xl border-[4px] border-slate-700 relative"
              style={{
                gridTemplateColumns: `repeat(${puzzle.width}, minmax(30px, 50px))`,
                gridTemplateRows: `repeat(${puzzle.height}, minmax(30px, 50px))`
              }}
            >
              {Array.from({ length: puzzle.height }).map((_, y) => (
                Array.from({ length: puzzle.width }).map((_, x) => {
                  const key = `${x},${y}`;
                  const cell = puzzle.grid[key];
                  const isActive = activeCell?.x === x && activeCell?.y === y;
                  const inputValue = inputs[key] || '';
                  
                  if (!cell) {
                    return <div key={key} className="bg-transparent" />;
                  }

                  const isCorrect = cell.char === inputValue;
                  const showError = isChecking && inputValue && !isCorrect;

                  return (
                    <div 
                      key={key} 
                      className={`
                        relative transition-all duration-200 transform
                        ${isActive ? 'scale-105 z-10' : 'scale-100 z-0'}
                      `}
                    >
                      {cell.number && (
                        <span className="absolute top-0.5 md:top-1 left-0.5 md:left-1.5 text-[0.5rem] md:text-[0.65rem] text-slate-500 font-bold select-none pointer-events-none z-20">
                          {cell.number}
                        </span>
                      )}
                      <input
                        ref={el => inputsRef.current[key] = el}
                        type="text"
                        maxLength={1}
                        value={inputValue}
                        onClick={() => handleCellClick(x, y)}
                        onKeyDown={(e) => handleKeyDown(e, x, y)}
                        onChange={(e) => {
                          setIsChecking(false); // Reset check on invalidation
                          handleChange(e, x, y);
                        }}
                        className={`
                          w-full h-full text-center text-lg md:text-2xl font-bold uppercase focus:outline-none rounded md:rounded-lg
                          shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border-b-2 md:border-b-4 
                          transition-all duration-150 cursor-pointer caret-transparent
                          ${isActive 
                            ? 'bg-yellow-100 text-slate-900 border-yellow-300 shadow-lg ring-2 ring-yellow-400/50' 
                            : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-white'}
                          ${isWon ? 'bg-green-100 text-green-700 border-green-300' : ''}
                          ${!isWon && showError ? 'bg-red-200 text-red-800 border-red-400' : ''}
                        `}
                      />
                    </div>
                  );
                })
              ))}
            </div>
          </div>
        </div>

        {/* Clues Area - Second on Mobile */}
        <div className="lg:col-span-4 order-2 space-y-6">
          <div className="glass-panel p-4 md:p-6 lg:sticky lg:top-24 h-[40vh] lg:h-auto lg:max-h-[calc(100vh-140px)] flex flex-col">
             <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-4">
               <HelpCircle className="w-5 h-5 text-blue-400" />
               <h3 className="text-lg font-bold text-white">Clues</h3>
             </div>
             
             <div className="overflow-y-auto custom-scrollbar flex-1 space-y-6 md:space-y-8 pr-2">
               <div>
                 <h4 className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">
                   <span className="w-2 h-2 rounded-full bg-blue-400"></span> Across
                 </h4>
                 <ul className="space-y-3">
                   {acrossClues.map((w, i) => (
                     <li key={i} className="group cursor-pointer p-3 rounded-lg hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-all">
                       <div className="flex gap-3">
                         <span className="font-bold text-blue-400 font-mono text-lg">{w.number}</span>
                         <span className="text-sm text-slate-300 group-hover:text-white leading-relaxed">{w.clue}</span>
                       </div>
                     </li>
                   ))}
                 </ul>
               </div>

               <div>
                 <h4 className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">
                   <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Down
                 </h4>
                 <ul className="space-y-3">
                   {downClues.map((w, i) => (
                     <li key={i} className="group cursor-pointer p-3 rounded-lg hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all">
                       <div className="flex gap-3">
                         <span className="font-bold text-indigo-400 font-mono text-lg">{w.number}</span>
                         <span className="text-sm text-slate-300 group-hover:text-white leading-relaxed">{w.clue}</span>
                       </div>
                     </li>
                   ))}
                 </ul>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm animate-fade-in" onClick={() => setShowTutorial(false)}></div>
          <div className="relative glass-panel w-full max-w-2xl overflow-hidden animate-slide-up bg-slate-900 border border-slate-700 shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-400" /> How to Play
              </h2>
              <button onClick={() => setShowTutorial(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <MousePointer className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg mb-1">Navigation</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Click any cell to highlight it. Click the <span className="text-blue-300 font-semibold">same cell again</span> to switch between Across and Down direction.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                      <Keyboard className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg mb-1">Controls</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Use <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-600 text-xs text-white">Arrow Keys</span> to move around. 
                        Type letters to fill. <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-600 text-xs text-white">Backspace</span> clears current cell.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 text-center">
                    <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-bounce" />
                    <h3 className="font-bold text-white mb-2">Winning the Game</h3>
                    <p className="text-slate-400 text-sm">
                      Fill all white squares with the correct letters. The puzzle will automatically detect when you've won!
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 text-center">
                <button 
                  onClick={() => setShowTutorial(false)}
                  className="btn-primary px-8 py-3"
                >
                  Got it, let's play!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default PlayerPage;
