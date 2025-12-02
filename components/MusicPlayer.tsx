
// Iffi Virtual PC Simulator
// Developed by: Iftikhar Ali (iffibaloch334@gmail.com)
// CEO, iffi.dev
// © 2025

import React, { useState, useEffect } from 'react';
import { Theme, FileSystemItem } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music as MusicIcon } from 'lucide-react';

interface MusicPlayerProps {
  theme: Theme;
  file?: FileSystemItem;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ theme, file }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(new Array(20).fill(10));

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.5));
        // Randomize visualizer bars
        setVisualizerBars(prev => prev.map(() => Math.random() * 100));
      }, 100);
    } else {
        setVisualizerBars(new Array(20).fill(5));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
       {/* Visualizer Area */}
       <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
           {/* Background Album Art Blur */}
           <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-purple-900 to-blue-900"></div>
           
           <div className="z-10 flex flex-col items-center">
                <div className="w-32 h-32 bg-gradient-to-tr from-gray-800 to-gray-700 rounded-lg shadow-2xl flex items-center justify-center border border-white/10 mb-6">
                    <MusicIcon size={48} className="text-gray-500" />
                </div>
                <h2 className="text-xl font-bold">{file?.name || 'No Track Selected'}</h2>
                <p className="text-gray-400 text-xs mt-1">Unknown Artist</p>
           </div>

           {/* Bar Visualizer at bottom */}
           <div className="absolute bottom-0 w-full flex items-end justify-center gap-1 h-32 px-4 opacity-50">
               {visualizerBars.map((height, i) => (
                   <div 
                      key={i} 
                      className="flex-1 bg-white transition-all duration-100 rounded-t-sm"
                      style={{ 
                          height: `${height}%`, 
                          backgroundColor: theme.colors.primary 
                      }}
                   ></div>
               ))}
           </div>
       </div>

       {/* Controls Area */}
       <div className="h-24 bg-gray-900 border-t border-white/10 p-4 flex flex-col justify-between">
           {/* Progress Bar */}
           <div className="w-full h-1 bg-gray-700 rounded-full cursor-pointer relative group">
               <div 
                  className="h-full bg-blue-500 rounded-full relative" 
                  style={{ width: `${progress}%`, backgroundColor: theme.colors.primary }}
               >
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow"></div>
               </div>
           </div>
           
           {/* Buttons */}
           <div className="flex items-center justify-between">
               <div className="text-xs text-gray-500 w-10">0:00</div>
               
               <div className="flex items-center gap-4">
                   <button className="text-gray-400 hover:text-white"><SkipBack size={20} /></button>
                   <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                   >
                       {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-1" />}
                   </button>
                   <button className="text-gray-400 hover:text-white"><SkipForward size={20} /></button>
               </div>

               <div className="flex items-center gap-2 w-24">
                   <Volume2 size={16} className="text-gray-400" />
                   <div className="h-1 flex-1 bg-gray-700 rounded-full">
                       <div className="h-full w-2/3 bg-gray-400 rounded-full"></div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};
