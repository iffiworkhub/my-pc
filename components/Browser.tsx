
// Iffi Virtual PC Simulator
// Developed by: Iftikhar Ali (iffibaloch334@gmail.com)
// CEO, iffi.dev
// © 2025

import React, { useState } from 'react';
import { Theme } from '../types';
import { ArrowLeft, ArrowRight, RotateCw, Search, Home, Star, Lock, AlertTriangle } from 'lucide-react';

interface BrowserProps {
  theme: Theme;
}

export const Browser: React.FC<BrowserProps> = ({ theme }) => {
  const [url, setUrl] = useState('https://www.wikipedia.org');
  const [inputValue, setInputValue] = useState('https://www.wikipedia.org');
  const [history, setHistory] = useState<string[]>(['https://www.wikipedia.org']);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const handleNavigate = (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setLoadError(false);
    
    let target = inputValue;
    if (!target.startsWith('http')) {
        target = `https://www.bing.com/search?q=${encodeURIComponent(inputValue)}`;
    }
    
    setUrl(target);
    setHistory(prev => [...prev, target]);
    
    // Reset loading state after a delay (iframe onload is unreliable for some sites)
    setTimeout(() => setIsLoading(false), 1500);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const prev = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setUrl(prev);
      setInputValue(prev);
    }
  };

  const handleIframeLoad = () => {
      setIsLoading(false);
  };

  const handleIframeError = () => {
      setIsLoading(false);
      setLoadError(true);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-100 text-gray-800 font-sans">
      {/* Browser Chrome (Top Bar) */}
      <div className="bg-[#2b2b2b] p-2 flex items-center gap-2 border-b border-black">
        <div className="flex items-center gap-1 text-gray-400">
          <button onClick={goBack} className="p-1.5 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30" disabled={history.length <= 1}>
             <ArrowLeft size={14} />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30" disabled>
             <ArrowRight size={14} />
          </button>
          <button onClick={() => handleNavigate()} className={`p-1.5 hover:bg-white/10 rounded-full transition-colors ${isLoading ? 'animate-spin' : ''}`}>
             <RotateCw size={14} />
          </button>
        </div>

        {/* Address Bar */}
        <form onSubmit={handleNavigate} className="flex-1">
          <div className="bg-[#1a1a1a] rounded-full flex items-center px-3 py-1.5 border border-gray-700 focus-within:border-blue-500 focus-within:bg-black transition-colors">
             <Lock size={10} className="text-green-500 mr-2" />
             <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="bg-transparent border-none outline-none text-gray-300 text-xs w-full font-mono"
                placeholder="Search or enter URL"
             />
             <Star size={12} className="text-gray-500 ml-2 cursor-pointer hover:text-yellow-400" />
          </div>
        </form>

        <div className="flex gap-2 text-gray-400 px-2">
            <Home size={16} className="cursor-pointer hover:text-white" onClick={() => { setUrl('https://www.wikipedia.org'); setInputValue('https://www.wikipedia.org'); }} />
        </div>
      </div>

      {/* Browser Content (Viewport) */}
      <div className="flex-1 bg-white relative overflow-hidden">
         {isLoading && (
             <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-200 z-10">
                 <div className="h-full bg-blue-500 animate-[width_1s_ease-out_forwards]" style={{ width: '80%' }}></div>
             </div>
         )}
         
         {loadError ? (
             <div className="flex flex-col items-center justify-center h-full text-center p-8">
                 <AlertTriangle size={48} className="text-yellow-500 mb-4" />
                 <h2 className="text-xl font-bold mb-2">Connection Refused</h2>
                 <p className="text-sm text-gray-600 max-w-md">
                     The website <b>{url}</b> refused to connect inside this simulator. 
                     Many major sites (Google, YouTube) block embedding for security.
                 </p>
                 <button onClick={() => { setUrl('https://www.wikipedia.org'); setInputValue('https://www.wikipedia.org'); setLoadError(false); }} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                     Go to Homepage
                 </button>
             </div>
         ) : (
             <iframe 
                src={url} 
                className="w-full h-full border-none"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                title="Browser Viewport"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
             />
         )}
      </div>
    </div>
  );
};
