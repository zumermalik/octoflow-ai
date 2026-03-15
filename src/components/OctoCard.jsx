import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function OctoCard({ title, content, icon: Icon, colorClass, delay }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="bg-white/[0.03] backdrop-blur-md border border-white/5 p-6 rounded-2xl transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg bg-black/40 border border-white/5 ${colorClass}`}>
            <Icon size={16} />
          </div>
          <h3 className={`text-xs font-bold uppercase tracking-widest ${colorClass}`}>{title}</h3>
        </div>
        <button onClick={handleCopy} className="text-gray-500 hover:text-white transition-colors">
          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
        </button>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}