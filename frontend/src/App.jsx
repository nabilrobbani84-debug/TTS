import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/Home';
import CreatorPage from './pages/Creator';
import PlayerPage from './pages/Player';
import PuzzleList from './pages/PuzzleList'; // Need to create this

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen text-slate-100 pt-24 pb-12 px-4 selection:bg-blue-500/30">
        <Navbar />
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatorPage />} />
            <Route path="/list" element={<PuzzleList />} />
            <Route path="/play/:id" element={<PlayerPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
