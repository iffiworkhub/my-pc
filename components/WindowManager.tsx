// Iffi Virtual PC Simulator
// Developed by: Iftikhar Ali (iffibaloch334@gmail.com)
// CEO, iffi.dev
// © 2025

import React, { useRef, useState, useEffect } from 'react';
import { WindowState, Theme } from '../types';
import { X, Minus, Square, Maximize2 } from 'lucide-react';

interface WindowProps {
  window: WindowState;
  theme: Theme;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdate: (id: string, updates: Partial<WindowState>) => void;
  children: React.ReactNode;
}

export const WindowManager: React.FC<WindowProps> = ({ window, theme, onClose, onMinimize, onMaximize, onFocus, onUpdate, children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFocus(window.id);
    if (window.isMaximized) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      onUpdate(window.id, {
        position: { x: Math.max(0, newX), y: Math.max(0, newY) }
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, window.id, onUpdate]);

  if (window.isMinimized) return null;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: window.isMaximized ? 0 : window.position.x,
    top: window.isMaximized ? 0 : window.position.y,
    width: window.isMaximized ? '100%' : window.size.w,
    height: window.isMaximized ? '100%' : window.size.h,
    zIndex: window.zIndex,
    backgroundColor: theme.colors.windowBg,
    borderColor: theme.colors.secondary,
    color: theme.colors.text,
  };

  return (
    <div 
      ref={windowRef}
      style={style}
      className={`flex flex-col rounded-lg border shadow-2xl overflow-hidden backdrop-blur-md transition-all duration-75 ${window.isMaximized ? 'rounded-none' : ''}`}
      onMouseDown={() => onFocus(window.id)}
    >
      {/* Title Bar */}
      <div 
        className="h-9 flex items-center justify-between px-3 select-none cursor-grab active:cursor-grabbing border-b border-white/10"
        style={{ backgroundColor: theme.colors.panelBg }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
           <span className="text-xs font-bold tracking-wide opacity-90">{window.title}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
           <button onClick={(e) => { e.stopPropagation(); onMinimize(window.id); }} className="hover:text-white p-1"><Minus size={14} /></button>
           <button onClick={(e) => { e.stopPropagation(); onMaximize(window.id); }} className="hover:text-white p-1">{window.isMaximized ? <Square size={12} /> : <Maximize2 size={12} />}</button>
           <button onClick={(e) => { e.stopPropagation(); onClose(window.id); }} className="hover:text-red-500 p-1"><X size={14} /></button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto relative">
        {children}
      </div>

      {/* Resize Handle (Simple corner) */}
      {!window.isMaximized && (
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" />
      )}
    </div>
  );
};
