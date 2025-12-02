
// Iffi Virtual PC Simulator
// Developed by: Iftikhar Ali (iffibaloch334@gmail.com)
// CEO, iffi.dev
// © 2025

import { Instruction, OpCode, Theme, FileSystemItem } from './types';

export const DEVELOPER_INFO = {
  name: "Iftikhar Ali",
  title: "Software Engineer",
  email: "iffibaloch334@gmail.com",
  phone: "03181998588",
  company: "iffi.dev",
  website: "https://iffi-dev-crafted-code.vercel.app",
  inspiredBy: "Dr. Amanat Ali, Waqar Ali",
  teacher: "Prof. Ghanwa"
};

const AUTHOR_IMG_URL = 'https://placehold.co/400x400/222/fff?text=Iftikhar+Ali';

export const THEMES: Theme[] = [
  { 
    id: "neon-blue",
    name: "Neon Blue", 
    colors: {
      primary: "#00f3ff",
      secondary: "#0066cc",
      accent: "#bc13fe",
      background: "#050510",
      text: "#e6eef8",
      windowBg: "rgba(10, 10, 22, 0.85)",
      panelBg: "#0a0a16"
    },
    wallpaper: 'custom',
    customWallpaperUrl: AUTHOR_IMG_URL,
    authorImageUrl: AUTHOR_IMG_URL
  },
  { 
    id: "midnight-purple",
    name: "Midnight Purple", 
    colors: {
      primary: "#bc13fe",
      secondary: "#6600cc",
      accent: "#00f3ff",
      background: "#0f0518",
      text: "#f3e6f8",
      windowBg: "rgba(20, 5, 30, 0.85)",
      panelBg: "#14051e"
    },
    wallpaper: 'particles'
  },
  { 
    id: "solar-flare",
    name: "Solar Flare", 
    colors: {
      primary: "#ffaa00",
      secondary: "#cc4400",
      accent: "#ff0044",
      background: "#1a0a05",
      text: "#ffeebb",
      windowBg: "rgba(30, 10, 5, 0.85)",
      panelBg: "#1e0a05"
    },
    wallpaper: 'gradient'
  },
  { 
    id: "forest-cyber",
    name: "Forest Cyber", 
    colors: {
      primary: "#00ff88",
      secondary: "#008844",
      accent: "#aaff00",
      background: "#051a0a",
      text: "#ccffdd",
      windowBg: "rgba(5, 20, 10, 0.85)",
      panelBg: "#05140a"
    },
    wallpaper: 'grid'
  },
];

// Initial File System
export const INITIAL_FILE_SYSTEM: FileSystemItem[] = [
  { id: 'root', name: 'Root', type: 'folder', parentId: null, createdAt: '2025-01-01', modifiedAt: '2025-01-01', owner: 'root' },
  { id: 'home', name: 'Home', type: 'folder', parentId: 'root', createdAt: '2025-01-01', modifiedAt: '2025-01-01', owner: 'root' },
  { id: 'user', name: 'iffi', type: 'folder', parentId: 'home', createdAt: '2025-01-01', modifiedAt: '2025-01-01', owner: 'iffi' },
  { id: 'docs', name: 'Documents', type: 'folder', parentId: 'user', createdAt: '2025-01-02', modifiedAt: '2025-01-02', owner: 'iffi' },
  { id: 'pics', name: 'Pictures', type: 'folder', parentId: 'user', createdAt: '2025-01-02', modifiedAt: '2025-01-02', owner: 'iffi' },
  { id: 'music', name: 'Music', type: 'folder', parentId: 'user', createdAt: '2025-01-05', modifiedAt: '2025-01-05', owner: 'iffi' },
  { id: 'sys', name: 'System', type: 'folder', parentId: 'root', createdAt: '2025-01-01', modifiedAt: '2025-01-01', owner: 'root' },
  { id: 'logs', name: 'Logs', type: 'folder', parentId: 'sys', createdAt: '2025-01-01', modifiedAt: '2025-01-01', owner: 'root' },
  { id: 'f1', name: 'welcome.txt', type: 'file', parentId: 'docs', content: 'Welcome to Iffi Virtual PC!', size: 1024, createdAt: '2025-01-03', modifiedAt: '2025-01-03', owner: 'iffi' },
  { id: 'f2', name: 'project_notes.txt', type: 'file', parentId: 'docs', content: 'Tasks: 1. Optimize CPU. 2. Fix UI.', size: 2048, createdAt: '2025-01-04', modifiedAt: '2025-01-04', owner: 'iffi' },
  { id: 'f3', name: 'sys_log.log', type: 'file', parentId: 'logs', content: 'System initialized...', size: 4096, createdAt: '2025-01-01', modifiedAt: '2025-01-05', owner: 'root' },
  { id: 'pic1', name: 'author_profile.png', type: 'file', parentId: 'pics', content: AUTHOR_IMG_URL, size: 1024, createdAt: '2025-01-05', modifiedAt: '2025-01-05', owner: 'iffi' },
  { id: 'song1', name: 'Saiyarra.mp3', type: 'file', parentId: 'music', content: 'mock_audio_data', size: 5000000, createdAt: '2025-01-05', modifiedAt: '2025-01-05', owner: 'iffi' },
  { id: 'pic2', name: 'mountain_view.png', type: 'file', parentId: 'pics', content: 'https://placehold.co/600x400/111/fff?text=Mountain+View', size: 2048, createdAt: '2025-01-05', modifiedAt: '2025-01-05', owner: 'iffi' },
];

// Sample Programs (Assembly-like)

export const PROGRAM_ADDITION: Instruction[] = [
  { op: OpCode.MOV, args: [0, 15], comment: "MOV 15 to R0" },
  { op: OpCode.MOV, args: [1, 25], comment: "MOV 25 to R1" },
  { op: OpCode.ADD, args: [0, 1], comment: "ADD R0 + R1 -> R0" },
  { op: OpCode.STORE, args: [0, 100], comment: "STORE R0 to Mem[100]" },
  { op: OpCode.OUT, args: [0], comment: "PRINT R0" },
  { op: OpCode.HLT, args: [], comment: "STOP" }
];

export const PROGRAM_SEARCH_TEMPLATE: Instruction[] = [
  // Initialize Incrementer R3 = 1
  { op: OpCode.MOV, args: [3, 1], comment: "R3 = 1 (Incrementer)" },
  // Setup Search
  { op: OpCode.MOV, args: [0, 42], comment: "Target value 42 -> R0" },
  { op: OpCode.MOV, args: [1, 500], comment: "Start Index 500 -> R1" },
  
  // Loop Start (Address 3)
  { op: OpCode.LOAD, args: [2, 1], comment: "Load Mem[R1] -> R2" }, 
  { op: OpCode.CMP, args: [2, 0], comment: "Compare R2, R0" },
  { op: OpCode.JEQ, args: [8], comment: "If Equal, Jump to Found (8)" },
  
  // Increment Index
  { op: OpCode.ADD, args: [1, 3], comment: "Inc R1 by R3" }, 
  { op: OpCode.JMP, args: [3], comment: "Jump back to Loop (3)" },
  
  // Found (Address 8)
  { op: OpCode.OUT, args: [1], comment: "Print Found Index" },
  { op: OpCode.HLT, args: [], comment: "Found! Stop" }
];

export const PROGRAM_SORT: Instruction[] = [
  // Initialize
  { op: OpCode.MOV, args: [3, 1], comment: "R3 = 1 (Incrementer)" },
  { op: OpCode.MOV, args: [0, 5], comment: "Limit -> R0" },
  { op: OpCode.MOV, args: [1, 200], comment: "Start Addr -> R1" },
  
  // Loop Start (3)
  { op: OpCode.LOAD, args: [2, 1], comment: "Load Mem[R1]" },
  { op: OpCode.OUT, args: [2], comment: "Inspect Value" },
  { op: OpCode.ADD, args: [1, 3], comment: "Next Address (R1+R3)" }, 
  
  // Check End
  { op: OpCode.CMP, args: [1, 205], comment: "Check End Boundary" },
  { op: OpCode.JEQ, args: [9], comment: "Done? Jump to End" },
  { op: OpCode.JMP, args: [3], comment: "Loop Back (3)" },
  
  // End (9)
  { op: OpCode.HLT, args: [], comment: "Sorted" }
];
