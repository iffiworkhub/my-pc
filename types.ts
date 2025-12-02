// Iffi Virtual PC Simulator
// Developed by: Iftikhar Ali (iffibaloch334@gmail.com)
// CEO, iffi.dev
// © 2025

export enum OpCode {
  NOP = 'NOP', // No Operation
  MOV = 'MOV', // Move value to register
  LOAD = 'LOAD', // Load from memory to register
  STORE = 'STORE', // Store register to memory
  ADD = 'ADD', // Add two registers
  SUB = 'SUB', // Subtract
  AND = 'AND', // Bitwise AND
  OR = 'OR', // Bitwise OR
  CMP = 'CMP', // Compare register with value
  JEQ = 'JEQ', // Jump if equal (from previous CMP)
  JMP = 'JMP', // Unconditional jump
  HLT = 'HLT', // Halt execution
  OUT = 'OUT' // Output to console
}

export interface Instruction {
  op: OpCode;
  args: number[]; // R1, R2, or R1, Value
  comment?: string;
}

export interface CpuState {
  pc: number; // Program Counter
  ir: Instruction; // Instruction Register
  registers: number[]; // R0 - R7
  flags: {
    zero: boolean;
    equal: boolean;
  };
  clockSpeed: number; // ms delay
  cycles: number;
  temperature: number;
}

export interface SystemState {
  memory: number[];
  logs: string[];
  outputConsole: string[];
  isBooting: boolean;
  isOn: boolean;
  currentProgram: string | null;
  error: string | null;
}

// --- NEW TYPES FOR UI UPGRADE ---

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    windowBg: string;
    panelBg: string;
  };
  wallpaper: 'particles' | 'gradient' | 'grid' | 'custom';
  customWallpaperUrl?: string; // For user uploaded images
  authorImageUrl?: string; // For the About section
}

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  content?: string; // For text files
  size?: number;
  createdAt: string;
  modifiedAt: string;
  owner: string;
}

export interface FileSystemState {
  items: FileSystemItem[];
}

export interface WindowState {
  id: string;
  title: string;
  appId: 'terminal' | 'file-browser' | 'log-viewer' | 'settings' | 'about' | 'cpu-monitor' | 'browser' | 'music-player' | 'image-viewer';
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { w: number; h: number };
  metadata?: any; // For passing file content or initial state
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  jobId: string;
  message: string;
}

export const MEMORY_SIZE = 1024;
export const REGISTERS_COUNT = 8;