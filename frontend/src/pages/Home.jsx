import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, Share2, ArrowRight } from 'lucide-react';

function HomePage() {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center space-y-16 py-10">
      
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Hero Content */}
      <div className="relative z-10 space-y-8 max-w-4xl mx-auto animate-slide-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" /> New: AI-Powered Grid Generation
        </div>
        
        <h1 className="text-7xl font-extrabold tracking-tight leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Craft Custom Puzzles
          </span>
          <br />
          <span className="text-slate-100">In Seconds</span>
        </h1>
        
        <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
          The most intuitive way to create, play, and share crossword puzzles. 
          Perfect for teachers, quiz masters, and puzzle enthusiasts.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/create" className="btn-primary flex items-center gap-2 text-lg px-8 py-4 w-full sm:w-auto justify-center group">
            Start Creating
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/list" className="px-8 py-4 rounded-xl bg-slate-800/50 text-slate-200 font-semibold hover:bg-slate-700/50 hover:text-white transition-all border border-slate-700/50 flex items-center gap-2 w-full sm:w-auto justify-center">
            <Brain className="w-5 h-5" />
            Browse Puzzles
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl text-left mt-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {[
          { 
            icon: Sparkles, 
            title: "Smart Generator", 
            desc: "Input your words and clues, and watch our algorithm instantly build a perfectly connected grid structure for you.",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            action: null
          },
          { 
            icon: Brain, 
            title: "Interactive Play", 
            desc: "Enjoy a smooth checking experience. Visual cues highlight your active word, making solving a breeze on any device.",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            action: null
          },
          { 
            icon: Share2, 
            title: "Bagikan & Tantang", 
            desc: "Sudah menyelesaikan sebuah karya agung? Buat tautan unik dan tantang teman-teman Anda untuk mengalahkan waktu penyelesaian Anda.",
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
            action: async () => {
              const url = window.location.href;
              const shareData = {
                title: 'Crossword Legends',
                text: 'Ayo mainkan teka-teki silang buatan saya!',
                url: url
              };
              if (navigator.share) {
                try { await navigator.share(shareData); } catch (err) { console.error(err); }
              } else {
                try {
                    await navigator.clipboard.writeText(url);
                    alert('Tautan disalin ke papan klip!');
                } catch (err) {
                    console.error('Gagal menyalin', err);
                }
              }
            }
          },
        ].map((feature, idx) => (
          <div 
            key={idx} 
            onClick={feature.action}
            className={`glass-panel p-8 transition-all duration-300 group ${feature.action ? 'cursor-pointer hover:bg-slate-800/80 active:scale-95' : 'hover:-translate-y-2'}`}
          >
            <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <feature.icon className={`w-7 h-7 ${feature.color}`} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                {feature.title}
                {feature.action && <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-400 font-normal border border-slate-700 rounded px-1.5 py-0.5 ml-auto">Click to Share</span>}
            </h3>
            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
