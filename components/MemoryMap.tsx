import React from 'react';
import { MEMORY_SIZE } from '../types';

interface MemoryMapProps {
  memory: number[];
  pc: number; // To highlight executed region? Or just accessed
  lastAccessedAddress?: number;
}

export const MemoryMap: React.FC<MemoryMapProps> = ({ memory, lastAccessedAddress }) => {
  // We can't render 1024 divs without performance hit if not careful, but 1024 simple divs is actually fine in modern React.
  // We'll visualize them as small blocks.
  
  // Create a display window logic if needed, but let's try rendering a subset or a condensed view.
  // For the prompt, let's render the first 256 "System" blocks and a "Heap" section.
  
  // Just rendering 512 for visual balance
  const displaySize = 512;

  return (
    <div className="h-full flex flex-col">
       <div className="text-xs text-gray-400 mb-2 flex justify-between">
         <span>RAM VISUALIZATION (First {displaySize} Blocks)</span>
         <span>TOTAL: {MEMORY_SIZE} KB</span>
       </div>
       <div className="flex-1 bg-black border border-gray-800 p-1 overflow-y-auto grid grid-cols-16 gap-px content-start">
          {Array.from({ length: displaySize }).map((_, idx) => {
            const val = memory[idx];
            const isZero = val === 0;
            const isActive = idx === lastAccessedAddress;
            
            let bgClass = 'bg-gray-900';
            if (isActive) bgClass = 'bg-white shadow-[0_0_10px_white] z-10';
            else if (!isZero) bgClass = 'bg-green-600';
            
            return (
              <div 
                key={idx} 
                className={`aspect-square w-full ${bgClass} transition-colors duration-200 hover:opacity-75`}
                title={`Addr: ${idx} | Val: ${val}`}
              ></div>
            );
          })}
       </div>
       <div className="mt-1 text-[10px] text-gray-600 flex justify-between">
           <span className="flex items-center gap-1"><div className="w-2 h-2 bg-gray-900"></div> Empty</span>
           <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-600"></div> Data</span>
           <span className="flex items-center gap-1"><div className="w-2 h-2 bg-white"></div> Active</span>
       </div>
    </div>
  );
};