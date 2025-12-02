// Iffi Virtual PC Simulator
// Developed by: Iftikhar Ali (iffibaloch334@gmail.com)
// CEO, iffi.dev
// © 2025

import React, { useState, useRef, useEffect } from 'react';
import { LogEntry, Theme } from '../types';
import { Pause, Play, Download, Search, Filter, Trash2 } from 'lucide-react';

interface LogViewerProps {
  logs: LogEntry[];
  theme: Theme;
  onClear: () => void;
}

export const LogViewer: React.FC<LogViewerProps> = ({ logs, theme, onClear }) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter(log => {
    if (filterLevel !== 'ALL' && log.level !== filterLevel) return false;
    if (searchTerm && !log.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-500';
      case 'WARN': return 'text-yellow-500';
      case 'INFO': return 'text-blue-400';
      case 'DEBUG': return 'text-gray-500';
      default: return 'text-white';
    }
  };

  const handleExport = () => {
      const text = logs.map(l => `[${l.timestamp}] [${l.level}] ${l.message}`).join('\n');
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system_logs_${Date.now()}.txt`;
      a.click();
  };

  return (
    <div className="flex flex-col h-full font-mono text-xs">
       {/* Toolbar */}
       <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-2 gap-2 justify-between">
          <div className="flex items-center gap-2">
            <button 
                onClick={() => setAutoScroll(!autoScroll)}
                className={`p-1.5 rounded hover:bg-white/10 ${autoScroll ? 'text-green-400' : 'text-red-400'}`}
                title={autoScroll ? "Pause Scrolling" : "Resume Scrolling"}
            >
                {autoScroll ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button onClick={onClear} className="p-1.5 rounded hover:bg-white/10 hover:text-red-500" title="Clear Logs">
                <Trash2 size={14} />
            </button>
            <button onClick={handleExport} className="p-1.5 rounded hover:bg-white/10" title="Export Logs">
                <Download size={14} />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="relative">
                <Filter size={14} className="absolute left-2 top-1.5 text-gray-500" />
                <select 
                    value={filterLevel} 
                    onChange={e => setFilterLevel(e.target.value)}
                    className="bg-black/30 border border-white/10 rounded pl-7 pr-2 py-1 focus:outline-none appearance-none cursor-pointer"
                >
                    <option value="ALL">All Levels</option>
                    <option value="INFO">Info</option>
                    <option value="WARN">Warn</option>
                    <option value="ERROR">Error</option>
                    <option value="DEBUG">Debug</option>
                </select>
             </div>
             <div className="relative">
                <Search size={14} className="absolute left-2 top-1.5 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Search logs..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-40 bg-black/30 border border-white/10 rounded pl-7 py-1 focus:outline-none focus:border-white/30"
                />
             </div>
          </div>
       </div>

       {/* Log Stream */}
       <div className="flex-1 overflow-y-auto bg-black/80 p-2 space-y-1">
          {filteredLogs.length === 0 ? (
              <div className="text-gray-600 text-center mt-10 italic">No logs found matching criteria.</div>
          ) : (
              filteredLogs.map(log => (
                <div key={log.id} className="flex gap-2 hover:bg-white/5 p-0.5 rounded leading-tight break-all">
                    <span className="text-gray-500 shrink-0 select-none">[{log.timestamp}]</span>
                    <span className={`font-bold w-12 shrink-0 ${getLevelColor(log.level)}`}>{log.level}</span>
                    <span style={{ color: theme.colors.text }}>{log.message}</span>
                </div>
              ))
          )}
          <div ref={endRef} />
       </div>
       
       {/* Footer Status */}
       <div className="h-6 bg-black border-t border-white/10 flex items-center px-2 text-[10px] text-gray-500 justify-between">
           <span>Total: {logs.length} events</span>
           <span>Filtered: {filteredLogs.length} events</span>
       </div>
    </div>
  );
};
