import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function LandingView({ setRoute }) {
  return (
    <main className="relative z-10 pt-32 pb-20 max-w-7xl mx-auto px-6 animate-fade-in">
      <section className="text-center mb-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/20 border border-purple-500/20 text-purple-300 text-xs font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          Octopus Hackathon 2026 
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] text-white">
          One Brain. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400">
            Eight Tentacles.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop context switching. Octo-Flow uses parallel AI processing to generate your entire go-to-market strategy, content, and research in a single click.
        </p>
        <button onClick={() => setRoute('app')} className="h-14 px-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(147,51,234,0.5)] flex items-center gap-2 mx-auto">
          Launch Workspace <ArrowRight size={20} />
        </button>
      </section>
    </main>
  );
}