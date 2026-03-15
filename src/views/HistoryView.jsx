import React from 'react';
import { History, Trash2 } from 'lucide-react';

export default function HistoryView({ history, clearHistory }) {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 animate-fade-in w-full">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <History className="text-purple-400"/> Generation History
        </h2>
        {history.length > 0 && (
          <button onClick={clearHistory} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-2 px-4 py-2 rounded-lg bg-red-950/30 border border-red-900/50 transition-colors">
            <Trash2 size={16} /> Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl">
          <History size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-300 mb-2">No history yet</h3>
          <p className="text-gray-500">Your generated strategies will be saved locally here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((item, idx) => (
            <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 transition-all hover:border-purple-500/30">
              <div className="mb-4 border-b border-white/5 pb-4">
                <p className="text-xs text-gray-500 mb-1">{new Date(item.timestamp).toLocaleString()}</p>
                <h3 className="text-xl font-bold text-white">"{item.prompt}"</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="text-sm"><strong className="text-blue-400 block mb-1">Tagline:</strong><span className="text-gray-400 line-clamp-2">{item.data.tagline}</span></div>
                 <div className="text-sm"><strong className="text-green-400 block mb-1">Keywords:</strong><span className="text-gray-400 line-clamp-2">{item.data.seo}</span></div>
                 <div className="text-sm"><strong className="text-purple-400 block mb-1">Persona:</strong><span className="text-gray-400 line-clamp-2">{item.data.persona}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}