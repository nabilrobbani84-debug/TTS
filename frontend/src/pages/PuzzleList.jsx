import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Calendar, Grid3X3, ArrowRight, Puzzle } from 'lucide-react';
import { getPuzzleList } from '../utils/crossword';

function PuzzleList() {
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPuzzleList()
      // .then(res => res.json())
      .then(data => {
        setPuzzles(data.reverse()); // Newest first
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="space-y-12 animate-slide-up pb-20">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Explore Puzzles
          </h1>
          <p className="text-slate-400 max-w-lg">
            Challenge yourself with community-created puzzles or jump back into your favorites.
          </p>
        </div>
        <Link to="/create" className="btn-primary flex items-center gap-2 group shadow-blue-500/25">
           <span>Create New Puzzle</span>
           <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {puzzles.length === 0 ? (
        <div className="glass-panel p-16 text-center flex flex-col items-center justify-center space-y-6">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-2">
            <Puzzle className="w-10 h-10 text-slate-500 opacity-50" />
          </div>
          <div className="max-w-md space-y-2">
            <h3 className="text-2xl font-bold text-white">No puzzles found</h3>
            <p className="text-slate-400">It looks like the collection is empty. Why not be the first to create a masterpiece?</p>
          </div>
          <Link to="/create" className="px-8 py-3 rounded-xl bg-blue-600/20 text-blue-300 font-semibold hover:bg-blue-600/30 transition-all border border-blue-500/30">
            Start Creating
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {puzzles.map((puzzle, i) => (
            <Link 
              key={puzzle.id} 
              to={`/play/${puzzle.id}`}
              className="group relative glass-panel p-6 hover:-translate-y-2 transition-all duration-300 border border-white/5 overflow-hidden"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Decorative gradient blob on hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-3 bg-slate-950/50 rounded-xl border border-white/5 group-hover:border-blue-500/30 group-hover:scale-110 transition-all duration-300">
                  <Grid3X3 className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 bg-slate-900/40 px-2 py-1 rounded-md">
                  <Calendar className="w-3 h-3" />
                  {new Date(puzzle.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-300 transition-colors relative z-10">
                {puzzle.title}
              </h3>
              
              <div className="flex items-center justify-between mt-8 relative z-10">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <span>{puzzle.wordCount} words</span>
                </div>
                <span className="group-hover:translate-x-1 transition-transform flex items-center text-blue-400 font-bold text-sm tracking-wide">
                  Play Now <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default PuzzleList;
