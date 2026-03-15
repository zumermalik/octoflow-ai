import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingView from './views/LandingView';
import WorkspaceView from './views/WorkspaceView';
import HistoryView from './views/HistoryView';
import useLocalStorage from './hooks/useLocalStorage';

export default function App() {
  const [route, setRoute] = useState('landing');
  const [history, setHistory] = useLocalStorage('octo_history', []);
  const [localApiKey, setLocalApiKey] = useLocalStorage('octo_api_key', '');

  const clearHistory = () => {
    if(window.confirm("Are you sure you want to delete all local history?")) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[120px]"></div>
      </div>

      <Navbar route={route} setRoute={setRoute} historyCount={history.length} />

      <div className="relative z-10 min-h-screen flex flex-col">
        {route === 'landing' && <LandingView setRoute={setRoute} />}
        {route === 'history' && <HistoryView history={history} clearHistory={clearHistory} />}
        {route === 'app' && (
          <WorkspaceView 
            setHistory={setHistory} 
            localApiKey={localApiKey} 
            setLocalApiKey={setLocalApiKey} 
          />
        )}
      </div>
    </div>
  );
}