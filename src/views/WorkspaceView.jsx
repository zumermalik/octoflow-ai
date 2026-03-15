import React, { useState } from 'react';
import { Zap, Share2, Users, Search, Mail, Target, Layers, User, Image as ImageIcon, Settings } from 'lucide-react';
import OctoCard from '../components/OctoCard';
import SkeletonCard from '../components/SkeletonCard';
import { generateStrategy } from '../utils/gemini';

export default function WorkspaceView({ setHistory, localApiKey, setLocalApiKey }) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const cardsConfig = [
    { key: 'twitter', title: 'Twitter Hook', icon: Share2, color: 'text-blue-400' },
    { key: 'linkedin', title: 'LinkedIn Opener', icon: Users, color: 'text-blue-600' },
    { key: 'seo', title: 'SEO Strategy', icon: Search, color: 'text-green-400' },
    { key: 'email', title: 'Email Newsletter', icon: Mail, color: 'text-yellow-400' },
    { key: 'tagline', title: 'Brand Tagline', icon: Layers, color: 'text-pink-400' },
    { key: 'competitors', title: 'Competitors', icon: Target, color: 'text-red-400' },
    { key: 'persona', title: 'Target Persona', icon: User, color: 'text-purple-400' },
    { key: 'image_prompt', title: 'Visual Prompt', icon: ImageIcon, color: 'text-indigo-400' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setResults(null);
    try {
      const data = await generateStrategy(prompt, localApiKey);
      setResults(data);
      setHistory(prev => [{ timestamp: new Date().toISOString(), prompt, data }, ...prev]);
    } catch (error) {
      alert(error.message);
      if(error.message.includes("API Key missing")) setShowSettings(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center animate-fade-in">
      
      {/* Settings Toggle */}
      <button onClick={() => setShowSettings(true)} className="absolute top-24 right-6 text-gray-500 hover:text-white flex items-center gap-2 text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
        <Settings size={14}/> API Config
      </button>

      {/* Input Brain Component */}
      <div className="w-full max-w-3xl mb-16">
        <h2 className="text-3xl font-bold text-center mb-6">Ignite a new strategy</h2>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative flex bg-[#0f0f13] rounded-full p-2 border border-white/10 shadow-2xl">
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="Enter your product, idea, or niche..." 
              className="w-full bg-transparent text-white px-6 py-4 focus:outline-none placeholder-gray-600 text-lg"
            />
            <button 
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:text-gray-400 text-white px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 shrink-0"
            >
              {isLoading ? 'Processing...' : 'Generate'}
              {!isLoading && <Zap size={18} className="fill-current" />}
            </button>
          </div>
        </div>
      </div>

      {/* Results Component */}
      <div className="w-full relative">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {results && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full pb-12">
            {cardsConfig.map((config, index) => (
              <OctoCard 
                key={config.key}
                title={config.title}
                content={results[config.key]}
                icon={config.icon}
                colorClass={config.color}
                delay={index * 100}
              />
            ))}
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f0f13] border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-2 text-white">API Configuration</h3>
            <p className="text-sm text-gray-400 mb-6">Enter a Gemini API Key to use locally. In production, set `VITE_GEMINI_API_KEY` in Netlify.</p>
            <input 
              type="password" 
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              placeholder="Paste local API key here" 
              className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none font-mono text-sm mb-6"
            />
            <div className="flex justify-end">
              <button onClick={() => setShowSettings(false)} className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium">Save & Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}