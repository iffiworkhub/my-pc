
// Iffi Virtual PC Simulator
// Developed by: Iftikhar Ali (iffibaloch334@gmail.com)
// CEO, iffi.dev
// © 2025

import React from 'react';
import { Theme, FileSystemItem } from '../types';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ImageViewerProps {
  theme: Theme;
  file?: FileSystemItem;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ theme, file }) => {
  return (
    <div className="flex flex-col h-full bg-black/90">
        <div className="h-10 border-b border-white/10 flex items-center justify-end px-4 gap-2">
            <button className="p-1.5 hover:bg-white/10 rounded text-gray-300"><ZoomOut size={16} /></button>
            <button className="p-1.5 hover:bg-white/10 rounded text-gray-300"><ZoomIn size={16} /></button>
            <button className="p-1.5 hover:bg-white/10 rounded text-gray-300"><RotateCcw size={16} /></button>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
            {file && file.content ? (
                <img 
                    src={file.content} 
                    alt={file.name} 
                    className="max-w-full max-h-full object-contain shadow-2xl"
                />
            ) : (
                <div className="text-gray-500">No Image Loaded</div>
            )}
        </div>
    </div>
  );
};
