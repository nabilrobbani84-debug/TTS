import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, List, Gamepad2 } from 'lucide-react'; // Ensure lucide-react is installed

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
    ${isActive(path) 
      ? 'bg-blue-600/20 text-blue-400 font-semibold shadow-[0_0_15px_rgba(56,189,248,0.3)]' 
      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
  `;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
        <div className="glass-panel flex h-16 items-center justify-between px-6 bg-slate-900/60">
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Gamepad2 className="w-5 h-5 text-white relative z-10" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:from-blue-400 group-hover:to-indigo-400 transition-all duration-300">
              CrosswordGen
            </span>
          </Link>

          <div className="flex items-center gap-1 bg-slate-900/30 p-1 rounded-xl border border-white/5">
            <Link to="/" className={linkClass('/')}>
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link to="/create" className={linkClass('/create')}>
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </Link>
            <Link to="/list" className={linkClass('/list')}>
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Puzzles</span>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
