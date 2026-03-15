import React from 'react';
import { Home, History } from 'lucide-react';

export default function Navbar({ route, setRoute, historyCount }) {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setRoute('landing')}>
          <span className="text-2xl group-hover:rotate-12 transition-transform">🐙</span>
          <span className="font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Octo-Flow Pro</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button onClick={() => setRoute('app')} className={`text-sm font-medium flex items-center gap-2 transition-colors ${route === 'app' ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
            <Home size={16} /> Workspace
          </button>
          <button onClick={() => setRoute('history')} className={`text-sm font-medium flex items-center gap-2 transition-colors ${route === 'history' ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
            <History size={16} /> History ({historyCount})
          </button>
        </div>
      </div>
    </nav>
  );
}