
// Iffi Virtual PC Simulator
// Developed by: Iftikhar Ali (iffibaloch334@gmail.com)
// CEO, iffi.dev
// © 2025

import React, { useRef } from 'react';
import { SystemState, CpuState, Theme, WindowState, FileSystemItem, LogEntry } from '../types';
import { DEVELOPER_INFO } from '../constants';
import { Folder, Terminal, Settings, Info, Activity, Globe, User, Image as ImageIcon, Music as MusicIcon } from 'lucide-react';
import { WindowManager } from './WindowManager';
import { FileBrowser } from './FileBrowser';
import { LogViewer } from './LogViewer';
import { Browser } from './Browser';
import { MusicPlayer } from './MusicPlayer';
import { ImageViewer } from './ImageViewer';

// --- Sub Components Definitions ---

const DesktopIcon = ({ icon, label, onClick, color }: { icon: React.ReactNode, label: string, onClick: () => void, color: string }) => (
  <button onClick={onClick} className="flex flex-col items-center group w-full outline-none focus:scale-105 transition-transform">
    <div 
        className="w-14 h-14 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 group-hover:bg-white/10 group-hover:border-white/30 flex items-center justify-center transition-all shadow-lg"
        style={{ color: color }}
    >
      {icon}
    </div>
    <span className="mt-2 text-xs text-white font-medium drop-shadow-md bg-black/40 px-2 rounded-full border border-black/20">{label}</span>
  </button>
);

const TerminalApp = ({ system, onRun, onFormat }: { system: SystemState, onRun: (type: 'add' | 'search' | 'sort') => void, onFormat: () => void }) => (
    <div className="bg-black text-green-500 font-mono text-xs p-2 h-full overflow-y-auto">
        <div className="mb-2">IffiOS Kernel [v2.0.4] <br />(c) 2025 Iffi Dev Corp.</div>
        <div className="space-y-1 mb-4">
             {system.outputConsole.map((line: string, i: number) => (
                 <div key={i}>{line}</div>
             ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-800">
             <button onClick={() => onRun('add')} className="px-3 py-1 bg-green-900/40 border border-green-700 rounded hover:bg-green-800">RUN_ADD</button>
             <button onClick={() => onRun('search')} className="px-3 py-1 bg-blue-900/40 border border-blue-700 rounded hover:bg-blue-800">RUN_SEARCH</button>
             <button onClick={() => onRun('sort')} className="px-3 py-1 bg-purple-900/40 border border-purple-700 rounded hover:bg-purple-800">RUN_SORT</button>
             <button onClick={onFormat} className="px-3 py-1 bg-red-900/40 border border-red-700 rounded hover:bg-red-800">FORMAT_DISK</button>
        </div>
    </div>
);

const SettingsApp = ({ theme, setTheme }: { theme: Theme, setTheme: (t: Theme) => void }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const authorInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'wallpaper' | 'author') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const result = ev.target?.result as string;
                if (type === 'wallpaper') {
                    setTheme({ ...theme, customWallpaperUrl: result, wallpaper: 'custom' });
                } else {
                    setTheme({ ...theme, authorImageUrl: result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-6 text-white overflow-y-auto h-full">
            <h3 className="font-bold mb-4 text-lg">Control Panel</h3>
            
            {/* Theme Colors */}
            <div className="mb-6 space-y-4">
                <div className="text-sm font-bold text-gray-400 border-b border-gray-700 pb-1">THEME COLORS</div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Primary Color</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                value={theme.colors.primary}
                                onChange={(e) => setTheme({...theme, colors: {...theme.colors, primary: e.target.value}})}
                                className="w-10 h-10 rounded cursor-pointer bg-transparent border-none"
                            />
                            <span className="text-xs font-mono">{theme.colors.primary}</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Background Color</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                value={theme.colors.background}
                                onChange={(e) => setTheme({...theme, colors: {...theme.colors, background: e.target.value}})}
                                className="w-10 h-10 rounded cursor-pointer bg-transparent border-none"
                            />
                            <span className="text-xs font-mono">{theme.colors.background}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wallpaper Settings */}
            <div className="mb-6 space-y-4">
                 <div className="text-sm font-bold text-gray-400 border-b border-gray-700 pb-1">WALLPAPER</div>
                 <div className="space-y-2">
                     <button 
                         onClick={() => fileInputRef.current?.click()}
                         className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-bold flex items-center justify-center gap-2"
                     >
                         <ImageIcon size={16} />
                         Upload Custom Wallpaper
                     </button>
                     <input 
                         type="file" 
                         ref={fileInputRef} 
                         className="hidden" 
                         accept="image/*" 
                         onChange={(e) => handleFileUpload(e, 'wallpaper')} 
                     />
                     <div className="text-[10px] text-gray-500 text-center">
                         Supports JPG, PNG. Image is stored in session RAM.
                     </div>
                 </div>
                 <div className="flex gap-2">
                      <button onClick={() => setTheme({...theme, wallpaper: 'grid', customWallpaperUrl: undefined})} className={`flex-1 py-1 rounded text-xs border ${theme.wallpaper === 'grid' ? 'bg-white/20 border-white' : 'border-gray-600'}`}>Grid</button>
                      <button onClick={() => setTheme({...theme, wallpaper: 'gradient', customWallpaperUrl: undefined})} className={`flex-1 py-1 rounded text-xs border ${theme.wallpaper === 'gradient' ? 'bg-white/20 border-white' : 'border-gray-600'}`}>Gradient</button>
                 </div>
            </div>

            {/* Author Settings */}
             <div className="mb-6 space-y-4">
                 <div className="text-sm font-bold text-gray-400 border-b border-gray-700 pb-1">USER PROFILE</div>
                 <div className="space-y-2">
                     <button 
                         onClick={() => authorInputRef.current?.click()}
                         className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm font-bold flex items-center justify-center gap-2"
                     >
                         <User size={16} />
                         Set Author Picture
                     </button>
                     <input 
                         type="file" 
                         ref={authorInputRef} 
                         className="hidden" 
                         accept="image/*" 
                         onChange={(e) => handleFileUpload(e, 'author')} 
                     />
                 </div>
            </div>
        </div>
    );
};

const AboutApp = ({ theme }: { theme: Theme }) => (
    <div className="p-8 text-center text-white h-full flex flex-col items-center justify-center overflow-y-auto">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">Iffi Virtual PC</h1>
        <div className="w-16 h-1 bg-gray-700 rounded mb-6"></div>
        
        {/* Author Picture Slot */}
        <div className="mb-6 relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 shadow-xl relative" style={{ borderColor: theme.colors.primary }}>
                 {theme.authorImageUrl ? (
                     <img src={theme.authorImageUrl} alt="Author" className="w-full h-full object-cover" />
                 ) : (
                     <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 flex-col">
                         <User size={32} />
                         <span className="text-[10px] mt-1">No Image</span>
                     </div>
                 )}
            </div>
            {!theme.authorImageUrl && <div className="text-[10px] text-gray-500 mt-2">Go to Settings to upload pic</div>}
        </div>

        <div className="space-y-2 text-sm text-gray-300">
            <p>Developed by <span className="font-bold text-white">{DEVELOPER_INFO.name}</span></p>
            <p className="text-xs opacity-70">{DEVELOPER_INFO.title} | {DEVELOPER_INFO.company}</p>
            <p className="text-blue-400 hover:underline cursor-pointer">{DEVELOPER_INFO.website}</p>
        </div>
        <div className="mt-8 text-xs text-gray-500 border-t border-gray-800 pt-4 w-full">
            <p>Inspired By: {DEVELOPER_INFO.inspiredBy}</p>
            <p>Teachers: {DEVELOPER_INFO.teacher}</p>
            <p>Contact: {DEVELOPER_INFO.email}</p>
        </div>
    </div>
);

const BootScreen = () => {
    return (
        <div className="w-full h-full bg-black font-mono text-white p-10 flex flex-col justify-center items-center">
            <div className="text-2xl font-bold text-blue-500 mb-4 animate-pulse">IFFI BIOS v3.0</div>
            <div className="w-64 h-2 bg-gray-900 rounded overflow-hidden">
                <div className="h-full bg-blue-500 animate-[width_3s_ease-out_forwards]" style={{ width: '0%' }}></div>
            </div>
            <div className="mt-2 text-xs text-gray-500">Loading System Resources...</div>
        </div>
    );
};

// --- Main Monitor Component ---

interface MonitorProps {
  system: SystemState;
  cpu: CpuState;
  theme: Theme;
  windows: WindowState[];
  fileSystem: FileSystemItem[];
  logs: LogEntry[];
  // Window Actions
  onOpenWindow: (appId: WindowState['appId'], title: string, metadata?: any) => void;
  onCloseWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onMaximizeWindow: (id: string) => void;
  onFocusWindow: (id: string) => void;
  onUpdateWindow: (id: string, updates: Partial<WindowState>) => void;
  // App Actions
  onRunProgram: (type: 'add' | 'search' | 'sort') => void;
  onFormat: () => void;
  setTheme: (theme: Theme) => void; 
  onClearLogs: () => void;
}

export const Monitor: React.FC<MonitorProps> = ({ 
  system, cpu, theme, windows, fileSystem, logs,
  onOpenWindow, onCloseWindow, onMinimizeWindow, onMaximizeWindow, onFocusWindow, onUpdateWindow,
  onRunProgram, onFormat, setTheme, onClearLogs
}) => {
  
  // -- WALLPAPER RENDERING --
  const getWallpaperStyle = () => {
      if (theme.customWallpaperUrl) {
          return {
              backgroundImage: `url(${theme.customWallpaperUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: theme.colors.background
          };
      }
      if (theme.wallpaper === 'gradient') {
          return { background: `radial-gradient(circle at center, ${theme.colors.secondary}, ${theme.colors.background})` };
      }
      if (theme.wallpaper === 'grid') {
          return { 
              backgroundColor: theme.colors.background,
              backgroundImage: `linear-gradient(${theme.colors.secondary}33 1px, transparent 1px), linear-gradient(90deg, ${theme.colors.secondary}33 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
          };
      }
      return { backgroundColor: theme.colors.background };
  };

  const handleOpenFile = (file: FileSystemItem) => {
      if (file.name.endsWith('.mp3')) {
          onOpenWindow('music-player', 'Music Player', file);
      } else if (file.name.endsWith('.png') || file.name.endsWith('.jpg')) {
          onOpenWindow('image-viewer', 'Image Viewer', file);
      } else {
          // Default to text viewer (simulated via log viewer or notification for now)
          // Ideally we would have a TextViewer, but for now let's just show an alert or open log viewer
          // alert(`Opening file: ${file.name}`);
      }
  };

  if (!system.isOn) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden">
        <div className="w-1 h-1 bg-white rounded-full opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5 pointer-events-none"></div>
      </div>
    );
  }

  if (system.isBooting) {
    return <BootScreen />;
  }

  return (
    <div 
        className="w-full h-full relative overflow-hidden flex flex-col font-sans text-sm transition-all duration-500"
        style={getWallpaperStyle()}
    >
       {/* CRT Effects */}
       <div className="absolute inset-0 crt-overlay pointer-events-none z-50 opacity-20"></div>
       <div className="absolute inset-0 animate-scanline bg-gradient-to-b from-transparent via-white/5 to-transparent h-4 pointer-events-none z-40"></div>

       {/* Desktop Area */}
       <div className="flex-1 relative z-10 p-4">
           {/* Desktop Icons Grid */}
           <div className="grid grid-cols-1 gap-6 w-24 content-start">
               <DesktopIcon icon={<Terminal size={32} />} label="Terminal" color={theme.colors.primary} onClick={() => onOpenWindow('terminal', 'Iffi Shell v1.0')} />
               <DesktopIcon icon={<Globe size={32} />} label="Browser" color={theme.colors.accent} onClick={() => onOpenWindow('browser', 'IffiWeb Browser')} />
               <DesktopIcon icon={<Folder size={32} />} label="Explorer" color={theme.colors.primary} onClick={() => onOpenWindow('file-browser', 'File Explorer')} />
               <DesktopIcon icon={<MusicIcon size={32} />} label="Music" color={theme.colors.secondary} onClick={() => onOpenWindow('music-player', 'Music Player')} />
               <DesktopIcon icon={<ImageIcon size={32} />} label="Pictures" color={theme.colors.secondary} onClick={() => onOpenWindow('image-viewer', 'Image Viewer')} />
               <DesktopIcon icon={<Activity size={32} />} label="Sys Logs" color={theme.colors.primary} onClick={() => onOpenWindow('log-viewer', 'System Logs')} />
               <DesktopIcon icon={<Settings size={32} />} label="Settings" color={theme.colors.primary} onClick={() => onOpenWindow('settings', 'Control Panel')} />
               <DesktopIcon icon={<Info size={32} />} label="About" color={theme.colors.primary} onClick={() => onOpenWindow('about', 'About System')} />
           </div>

           {/* Windows Layer */}
           {windows.map(win => (
               <WindowManager 
                  key={win.id} 
                  window={win} 
                  theme={theme}
                  onClose={onCloseWindow}
                  onMinimize={onMinimizeWindow}
                  onMaximize={onMaximizeWindow}
                  onFocus={onFocusWindow}
                  onUpdate={onUpdateWindow}
               >
                  {/* Window Content Routing */}
                  {win.appId === 'terminal' && <TerminalApp system={system} onRun={onRunProgram} onFormat={onFormat} />}
                  {win.appId === 'browser' && <Browser theme={theme} />}
                  {win.appId === 'file-browser' && <FileBrowser fileSystem={fileSystem} theme={theme} onOpenFile={handleOpenFile} />}
                  {win.appId === 'log-viewer' && <LogViewer logs={logs} theme={theme} onClear={onClearLogs} />}
                  {win.appId === 'settings' && <SettingsApp theme={theme} setTheme={setTheme} />}
                  {win.appId === 'about' && <AboutApp theme={theme} />}
                  {win.appId === 'music-player' && <MusicPlayer theme={theme} file={win.metadata} />}
                  {win.appId === 'image-viewer' && <ImageViewer theme={theme} file={win.metadata} />}
               </WindowManager>
           ))}
       </div>

       {/* Taskbar */}
       <div 
          className="h-10 backdrop-blur-md border-t border-white/10 flex items-center px-4 justify-between z-50 select-none relative"
          style={{ backgroundColor: theme.colors.windowBg }}
       >
          <div className="flex items-center gap-4">
             {/* Start Button */}
             <button 
                className="flex items-center gap-2 px-3 py-1 rounded hover:bg-white/10 transition-colors"
                style={{ color: theme.colors.primary }}
             >
                 <div className="font-bold text-lg">IFFI</div>
             </button>

             {/* Taskbar Items */}
             <div className="flex gap-1">
                 {windows.map(win => (
                     <button
                        key={win.id}
                        onClick={() => win.isMinimized ? onFocusWindow(win.id) : onMinimizeWindow(win.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs max-w-[120px] transition-all border-b-2 ${win.isOpen && !win.isMinimized ? 'bg-white/10' : 'bg-transparent opacity-70 hover:opacity-100'}`}
                        style={{ borderColor: win.isOpen && !win.isMinimized ? theme.colors.primary : 'transparent' }}
                     >
                         <span className="truncate text-white">{win.title}</span>
                     </button>
                 ))}
             </div>
          </div>
          
          {/* Clock & System Tray */}
          <div className="flex items-center gap-4 text-xs font-mono text-gray-300">
             <div className="flex flex-col items-end leading-tight">
                 <span>{cpu.temperature.toFixed(1)}°C</span>
                 <span className="text-[10px] text-gray-500">CPU</span>
             </div>
             <div className="h-6 w-px bg-gray-700"></div>
             <div>
                {new Date().toLocaleTimeString()}
             </div>
          </div>
       </div>
    </div>
  );
};
