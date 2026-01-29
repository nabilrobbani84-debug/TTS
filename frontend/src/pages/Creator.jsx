import React, { useState } from 'react';
import { Plus, Trash2, Save, RefreshCw, AlertCircle, Grid, Type, ArrowRight } from 'lucide-react';
import { generateCrossword, savePuzzle } from '../utils/crossword';
import { useNavigate } from 'react-router-dom';

function CreatorPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [words, setWords] = useState([
    { word: '', clue: '' },
    { word: '', clue: '' },
    { word: '', clue: '' },
    { word: '', clue: '' },
    { word: '', clue: '' },
  ]);
  const [generated, setGenerated] = useState(null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleWordChange = (idx, field, val) => {
    const newWords = [...words];
    newWords[idx][field] = val;
    setWords(newWords);
    setGenerated(null);
  };

  const addRow = () => {
    setWords([...words, { word: '', clue: '' }]);
  };

  const removeRow = (idx) => {
    if (words.length <= 2) return;
    const newWords = words.filter((_, i) => i !== idx);
    setWords(newWords);
    setGenerated(null);
  };

  const handleGenerate = () => {
    setError('');
    const validWords = words.filter(w => w.word.trim().length > 1 && w.clue.trim());
    if (validWords.length < 5) {
      setError('Please add at least 5 valid words with clues to create a good puzzle.');
      return;
    }

    const result = generateCrossword(validWords);
    if (!result) {
      setError('Could not generate a valid crossing grid. Try adding more intersecting letters.');
      setGenerated(null);
    } else {
      setGenerated(result);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please give your puzzle a title.');
      return;
    }
    if (!generated) return;

    setIsSaving(true);
    try {
      const payload = {
        title,
        words: generated.words,
        grid: generated.cells,
        width: generated.width,
        height: generated.height
      };

      const saved = await savePuzzle(payload);
      // const res = await fetch('http://localhost:3000/api/puzzles', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });

      // if (!res.ok) throw new Error('Failed to save');
      
      // const saved = await res.json();
      navigate(`/play/${saved.id}`);
    } catch (err) {
      setError('Error saving puzzle. Is the server running?');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-slide-up pb-20">
      
      {/* Editor Column */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-panel p-4 md:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Type className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Puzzle Details</h2>
          </div>
          
          <div className="mb-8 relative group z-10">
            <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 ml-1">Puzzle Title</label>
            <div className="relative">
              <input 
                type="text" 
                className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700/50 rounded-xl text-xl font-bold text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all duration-300 shadow-inner group-hover:bg-slate-900/80"
                placeholder="e.g., The Solar System"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <div className="absolute inset-0 rounded-xl bg-blue-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider">Words & Clues</label>
              <span className="text-xs font-medium text-slate-500 py-1 px-3 bg-slate-900 rounded-full border border-slate-800">{words.length} items</span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar -mr-2 pb-2">
              {words.map((row, i) => (
                <div 
                  key={i} 
                  className="group relative flex items-start gap-4 p-5 bg-slate-900/40 border border-slate-800/60 rounded-2xl transition-all duration-300 hover:border-blue-500/30 hover:bg-slate-800/40 hover:shadow-lg hover:shadow-black/20 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 focus-within:bg-slate-800/60 transform hover:-translate-y-0.5"
                >
                  <div className="mt-1 w-8 h-8 flex items-center justify-center bg-slate-800/80 rounded-lg text-xs font-bold text-slate-500 border border-slate-700/50 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-colors">
                    {i + 1}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="WORD"
                        className="w-full bg-transparent text-lg font-bold uppercase tracking-widest text-slate-200 placeholder-slate-700 focus:outline-none transition-colors"
                        value={row.word}
                        onChange={e => handleWordChange(i, 'word', e.target.value)}
                      />
                      {/* Interactive underline */}
                      <div className="absolute bottom-0 left-0 w-full h-px bg-slate-700/50 group-focus-within:bg-blue-500/30 transition-colors" />
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Enter a helpful clue..."
                      className="w-full bg-transparent text-sm font-medium text-slate-400 placeholder-slate-600 focus:outline-none focus:text-blue-200 transition-colors"
                      value={row.clue}
                      onChange={e => handleWordChange(i, 'clue', e.target.value)}
                    />
                  </div>

                  <button 
                    onClick={() => removeRow(i)}
                    className="mt-1 p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 focus:opacity-100 focus:translate-x-0"
                    disabled={words.length <= 2}
                    title="Remove word"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={addRow}
              className="group w-full py-4 border border-dashed border-slate-700 rounded-2xl text-slate-400 font-medium hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <div className="p-1 rounded-md bg-slate-800 group-hover:bg-blue-500/20 transition-colors">
                <Plus className="w-4 h-4" /> 
              </div>
              <span>Add Another Word</span>
            </button>
          </div>
        </div>

        <div className="glass-panel p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-br from-slate-900/80 to-slate-800/80">
           <div className="text-slate-400 text-sm text-center sm:text-left">
             <span className="block text-white font-semibold mb-1">Generated?</span>
             <span>Preview matches inputs</span>
           </div>
           <button 
             onClick={handleGenerate}
             className="w-full sm:w-auto px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
           >
             <RefreshCw className="w-5 h-5" /> Generate
           </button>
        </div>
        
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 flex items-center gap-3 animate-fade-in shadow-lg shadow-red-500/5">
            <AlertCircle className="w-5 h-5 shrink-0" /> <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>

      {/* Preview Column */}
      <div className="lg:col-span-7 h-full">
        <div className="lg:sticky lg:top-24 space-y-6">
          <div className="glass-panel p-4 md:p-8 min-h-[50vh] lg:min-h-[600px] flex flex-col relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4 relative z-10">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Grid className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Live Preview</h2>
            </div>

            <div className="flex-1 flex items-center justify-center p-2 relative z-10 overflow-auto">
              {generated ? (
                <div className="relative animate-fade-in w-full flex flex-col items-center">
                  <div 
                    className="grid gap-[2px] p-2 bg-slate-800/50 rounded-lg shadow-2xl border border-slate-700/50 backdrop-blur-sm"
                    style={{
                      gridTemplateColumns: `repeat(${generated.width}, minmax(24px, 44px))`,
                      gridTemplateRows: `repeat(${generated.height}, minmax(24px, 44px))`
                    }}
                  >
                    {Array.from({ length: generated.height }).map((_, y) => (
                      Array.from({ length: generated.width }).map((_, x) => {
                        const key = `${x},${y}`;
                        const cell = generated.cells[key];
                        return (
                          <div 
                            key={key}
                            className={`
                              relative flex items-center justify-center text-sm md:text-lg font-bold uppercase rounded-sm md:rounded-md transition-all duration-300
                              ${cell 
                                ? 'bg-white text-slate-900 shadow-sm scale-100 opacity-100' 
                                : 'bg-white/5 text-transparent scale-90 opacity-20'
                              }
                            `}
                          >
                            {cell?.number && (
                              <span className="absolute top-0.5 left-0.5 text-[0.4rem] md:text-[0.55rem] leading-none font-bold text-slate-400">
                                {cell.number}
                              </span>
                            )}
                            {cell?.char || ''}
                          </div>
                        );
                      })
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center w-full">
                    <p className="text-slate-400 text-sm mb-2">Looks good?</p>
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="btn-primary w-full sm:w-auto px-10 py-4 text-lg shadow-blue-500/25 flex items-center justify-center gap-3"
                    >
                      {isSaving ? 'Saving...' : (
                        <>
                          <Save className="w-5 h-5" /> Publish
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-600 max-w-sm">
                  <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700/50">
                    <RefreshCw className="w-8 h-8 opacity-40" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-400 mb-2">Awaiting Generation</h3>
                  <p className="text-sm">Enter your words on the left and click "Generate" to see your puzzle.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatorPage;
