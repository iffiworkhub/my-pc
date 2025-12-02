
// Iffi Virtual PC Simulator
// Developed by: Iftikhar Ali (iffibaloch334@gmail.com)
// CEO, iffi.dev
// © 2025

import React, { useState, useMemo } from 'react';
import { FileSystemItem, Theme } from '../types';
import { Folder, FileText, ChevronRight, ChevronDown, HardDrive, ArrowLeft, Download, Trash2, Home, Search, Image as ImageIcon, Music } from 'lucide-react';

interface FileBrowserProps {
  fileSystem: FileSystemItem[];
  theme: Theme;
  onOpenFile?: (file: FileSystemItem) => void;
}

export const FileBrowser: React.FC<FileBrowserProps> = ({ fileSystem, theme, onOpenFile }) => {
  const [currentPathId, setCurrentPathId] = useState<string>('user'); // Start at user home
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  // Derived state
  const currentFolder = fileSystem.find(item => item.id === currentPathId);
  const itemsInCurrentFolder = useMemo(() => {
    return fileSystem.filter(item => item.parentId === currentPathId && item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [fileSystem, currentPathId, searchTerm]);

  // Tree View Logic
  const renderTree = (parentId: string | null, depth = 0) => {
    const children = fileSystem.filter(item => item.parentId === parentId && item.type === 'folder');
    
    return children.map(child => {
      const isSelected = child.id === currentPathId;
      return (
        <div key={child.id}>
           <div 
             className={`flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-white/5 ${isSelected ? 'bg-white/10 text-white font-bold' : 'text-gray-400'}`}
             style={{ paddingLeft: `${depth * 12 + 8}px`, color: isSelected ? theme.colors.primary : undefined }}
             onClick={() => setCurrentPathId(child.id)}
           >
              {isSelected ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              <Folder size={14} fill={isSelected ? theme.colors.primary : 'none'} color={isSelected ? theme.colors.primary : 'currentColor'} />
              <span className="text-xs truncate">{child.name}</span>
           </div>
           {isSelected && renderTree(child.id, depth + 1)}
        </div>
      );
    });
  };

  // Breadcrumbs Logic
  const breadcrumbs = useMemo(() => {
    const crumbs = [];
    let curr = currentFolder;
    while (curr) {
      crumbs.unshift(curr);
      curr = fileSystem.find(item => item.id === curr?.parentId);
    }
    return crumbs;
  }, [currentFolder, fileSystem]);

  const handleSelect = (id: string, multi: boolean) => {
    if (multi) {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedIds(newSet);
    } else {
      setSelectedIds(new Set([id]));
    }
  };

  const getFileIcon = (name: string) => {
      if (name.endsWith('.png') || name.endsWith('.jpg')) return <ImageIcon size={40} className="text-purple-400 mb-2 drop-shadow-lg" />;
      if (name.endsWith('.mp3') || name.endsWith('.wav')) return <Music size={40} className="text-green-400 mb-2 drop-shadow-lg" />;
      return <FileText size={40} className="text-blue-400 mb-2 drop-shadow-lg" />;
  };

  return (
    <div className="flex h-full text-sm select-none">
      {/* Sidebar / Tree */}
      <div className="w-48 border-r border-white/10 flex flex-col bg-black/20">
         <div className="p-2 border-b border-white/10 font-bold text-xs text-gray-400">EXPLORER</div>
         <div className="flex-1 overflow-y-auto py-2">
            <div 
                className={`flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-white/5 ${currentPathId === 'root' ? 'bg-white/10' : ''}`}
                onClick={() => setCurrentPathId('root')}
            >
                <HardDrive size={14} className="text-gray-400" />
                <span className="text-xs text-gray-300">Root System</span>
            </div>
            {renderTree('root')}
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
         
         {/* Toolbar & Breadcrumbs */}
         <div className="h-10 border-b border-white/10 flex items-center px-3 gap-2 bg-white/5">
            <button 
              className="p-1 hover:bg-white/10 rounded disabled:opacity-50" 
              onClick={() => currentFolder?.parentId && setCurrentPathId(currentFolder.parentId)}
              disabled={!currentFolder?.parentId}
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex-1 flex items-center gap-1 bg-black/30 px-2 py-1 rounded border border-white/5 text-xs">
               <Home size={12} className="text-gray-500" />
               {breadcrumbs.map((crumb, i) => (
                 <React.Fragment key={crumb.id}>
                    <span className="text-gray-600">/</span>
                    <span 
                      className="hover:text-white cursor-pointer hover:underline"
                      onClick={() => setCurrentPathId(crumb.id)}
                    >
                      {crumb.name}
                    </span>
                 </React.Fragment>
               ))}
            </div>
            <div className="relative">
               <Search size={14} className="absolute left-2 top-1.5 text-gray-500" />
               <input 
                 type="text" 
                 placeholder="Search..." 
                 className="w-32 bg-black/30 border border-white/5 rounded pl-7 py-1 text-xs focus:outline-none focus:border-white/20"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         {/* Actions Toolbar */}
         <div className="h-8 border-b border-white/10 flex items-center px-3 gap-4 text-xs bg-white/5">
            <button className="flex items-center gap-1 hover:text-white transition-colors">
               <Folder size={14} /> New Folder
            </button>
            <div className="w-px h-4 bg-white/10"></div>
            <button className="flex items-center gap-1 hover:text-white transition-colors disabled:opacity-50" disabled={selectedIds.size === 0}>
               <Download size={14} /> Download
            </button>
            <button className="flex items-center gap-1 hover:text-red-400 transition-colors disabled:opacity-50" disabled={selectedIds.size === 0}>
               <Trash2 size={14} /> Delete
            </button>
         </div>

         {/* File Grid */}
         <div className="flex-1 p-4 overflow-y-auto">
            {itemsInCurrentFolder.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                  <Folder size={48} />
                  <span className="mt-2 text-xs">This folder is empty</span>
               </div>
            ) : (
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {itemsInCurrentFolder.map(item => (
                    <div 
                      key={item.id}
                      className={`group flex flex-col items-center p-3 rounded border border-transparent cursor-pointer transition-all ${selectedIds.has(item.id) ? 'bg-white/10 border-white/20' : 'hover:bg-white/5'}`}
                      onClick={(e) => handleSelect(item.id, e.ctrlKey || e.metaKey)}
                      onDoubleClick={() => {
                          if (item.type === 'folder') {
                              setCurrentPathId(item.id);
                          } else if (onOpenFile) {
                              onOpenFile(item);
                          }
                      }}
                    >
                       {item.type === 'folder' ? (
                          <Folder size={40} className="text-yellow-500 mb-2 drop-shadow-lg" />
                       ) : getFileIcon(item.name)}
                       <span className="text-xs text-center truncate w-full px-1">{item.name}</span>
                       <span className="text-[10px] text-gray-500">{item.type === 'folder' ? 'Folder' : `${item.size} B`}</span>
                    </div>
                  ))}
               </div>
            )}
         </div>
      </div>
    </div>
  );
};
