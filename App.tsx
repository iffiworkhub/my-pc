
// Iffi Virtual PC Simulator
// Developed by: Iftikhar Ali (iffibaloch334@gmail.com)
// CEO, iffi.dev
// © 2025

import React, { useState, useEffect, useRef } from 'react';
import { CPU } from './services/cpu';
import { Monitor } from './components/Monitor';
import { BackendPanel } from './components/BackendPanel';
import { MemoryMap } from './components/MemoryMap';
import { CpuState, SystemState, OpCode, MEMORY_SIZE, Instruction, WindowState, LogEntry, FileSystemItem, Theme } from './types';
import { PROGRAM_ADDITION, PROGRAM_SEARCH_TEMPLATE, PROGRAM_SORT, THEMES, INITIAL_FILE_SYSTEM } from './constants';
import { Power, Activity } from 'lucide-react';

// Utility hook for stable intervals
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const App: React.FC = () => {
  // --- CORE SYSTEM STATE ---
  const [isOn, setIsOn] = useState(false);
  const [cpuState, setCpuState] = useState<CpuState>(CPU.initialCpuState());
  const [systemState, setSystemState] = useState<SystemState>({
    memory: new Array(MEMORY_SIZE).fill(0),
    logs: [],
    outputConsole: [],
    isBooting: false,
    isOn: false,
    currentProgram: null,
    error: null
  });
  
  // --- UI STATE (THEME & WINDOWS) ---
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  
  // --- APP DATA STATE ---
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(INITIAL_FILE_SYSTEM);
  const [appLogs, setAppLogs] = useState<LogEntry[]>([]); 
  const [programQueue, setProgramQueue] = useState<Instruction[]>([]);

  // --- LOGGING HELPER ---
  const addLog = (level: LogEntry['level'], message: string, jobId = 'SYSTEM') => {
      const newLog: LogEntry = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString().split('T')[1].slice(0, -1),
          level,
          jobId,
          message
      };
      setAppLogs(prev => {
          const newLogs = [...prev, newLog];
          if (newLogs.length > 1000) return newLogs.slice(-1000);
          return newLogs;
      });
  };

  // Helper to push to Kernel Logs (Backend Panel)
  const logToKernel = (action: string) => {
    setSystemState(prev => {
        const newLogs = [...prev.logs, `[SYS_CALL] ${action}`];
        if (newLogs.length > 50) return { ...prev, logs: newLogs.slice(-50) };
        return { ...prev, logs: newLogs };
    });
  };

  // --- POWER TOGGLE ---
  const togglePower = () => {
    if (isOn) {
      logToKernel('ACPI_SHUTDOWN_SIGNAL');
      setTimeout(() => {
        setIsOn(false);
        setSystemState(prev => ({ ...prev, isOn: false, isBooting: false, logs: [] }));
        setWindows([]);
        setAppLogs([]);
        setProgramQueue([]);
        setCpuState(CPU.initialCpuState());
      }, 500);
    } else {
      setIsOn(true);
      setSystemState(prev => ({ ...prev, isOn: true, isBooting: true }));
      logToKernel('BIOS_POST_INIT');
      
      // Boot Sequence
      setTimeout(() => logToKernel('KERNEL_LOAD_IMAGE...'), 1000);
      setTimeout(() => logToKernel('MOUNT_VFS_ROOT...'), 2000);
      
      setTimeout(() => {
        setSystemState(prev => ({ ...prev, isBooting: false }));
        logToKernel('INIT_USER_SESSION(iffi)');
        addLog('INFO', 'System Boot Completed', 'KERNEL');
        addLog('INFO', 'User iffi logged in', 'AUTH');
        handleOpenWindow('about', 'Welcome');
      }, 3500);
    }
  };

  // --- CPU TICK ---
  useInterval(() => {
    if (!isOn) return;

    // Cycle Count should always increment if powered on (Idle tick)
    setCpuState(prev => ({
        ...prev,
        cycles: prev.cycles + 1,
        temperature: Math.max(30, Math.min(85, prev.temperature + (Math.random() - 0.5)))
    }));

    if (systemState.isBooting) return;

    // Check if we have a program loaded and running
    if (programQueue.length > 0) {
        
        // Check if CPU halted
        if (cpuState.ir.op === OpCode.HLT) {
             addLog('INFO', `Process ${systemState.currentProgram || 'Unknown'} finished successfully.`, 'SCHEDULER');
             logToKernel(`PROC_EXIT(${systemState.currentProgram}, 0)`);
             // STOP EXECUTION
             setProgramQueue([]); 
             setSystemState(prev => ({...prev, currentProgram: null}));
             return;
        }

        // Check Bounds
        if (cpuState.pc < programQueue.length) {
             // --- ACTIVE EXECUTION ---
             const { cpu, system } = CPU.executeCycle(cpuState, systemState, programQueue);
             // Merge CPU state but preserve the cycle count we just incremented
             setCpuState(prev => ({ ...cpu, cycles: prev.cycles })); 
             setSystemState(system);

             // Sync logs
             const latestCpuLog = system.logs[system.logs.length - 1];
             if (latestCpuLog && latestCpuLog !== appLogs[appLogs.length - 1]?.message) {
                 addLog('DEBUG', latestCpuLog, 'CPU_CORE');
             }
        } else {
            // Out of bounds - Stop
            setProgramQueue([]);
            setSystemState(prev => ({...prev, currentProgram: null}));
        }
    }
    // Else: Idle state handled by generic cycle increment above
  }, isOn ? cpuState.clockSpeed : null);

  // --- PROGRAM LOADERS ---
  const loadProgram = (type: 'add' | 'search' | 'sort') => {
      const resetCpu = { ...cpuState, pc: 0, flags: { zero: false, equal: false }, ir: { op: OpCode.NOP, args: [] } };
      let instructions: Instruction[] = [];
      let newMemory = [...systemState.memory];
      let consoleLog = [...systemState.outputConsole];
      let progName = "";

      if (type === 'add') {
          instructions = PROGRAM_ADDITION;
          progName = "ADDITION.EXE";
          consoleLog.push("Loading ADDITION.EXE...");
      } else if (type === 'search') {
          progName = "SEARCH.EXE";
          consoleLog.push("Loading SEARCH.EXE...");
          addLog('INFO', 'Initializing Memory Search Job...', 'JOB_MANAGER');
          // Inject random data
          const startIdx = 500;
          const targetVal = 42;
          const targetLoc = startIdx + Math.floor(Math.random() * 10) + 1; // Ensure it's not at 500
          
          for(let i=0; i<20; i++) newMemory[startIdx + i] = Math.floor(Math.random() * 100);
          newMemory[targetLoc] = targetVal;
          consoleLog.push(`(DEBUG) Hiding value ${targetVal} at Mem[${targetLoc}]`);
          
          instructions = PROGRAM_SEARCH_TEMPLATE;
      } else if (type === 'sort') {
          progName = "SORT_VISUALIZER.EXE";
          consoleLog.push("Loading SORT.EXE...");
          addLog('INFO', 'Initializing Sort Visualization...', 'JOB_MANAGER');
          for(let i=0; i<10; i++) newMemory[200 + i] = Math.floor(Math.random() * 255);
          instructions = PROGRAM_SORT;
      }

      logToKernel(`exec_image('${progName}')`);
      setSystemState(prev => ({ ...prev, memory: newMemory, outputConsole: consoleLog, currentProgram: progName }));
      setProgramQueue(instructions);
      setCpuState(resetCpu);
      
      if (!windows.some(w => w.appId === 'terminal')) {
          handleOpenWindow('terminal', 'Iffi Shell');
      } else {
          // Focus existing terminal
          const term = windows.find(w => w.appId === 'terminal');
          if (term) handleFocusWindow(term.id);
      }
  };

  const formatDisk = () => {
      logToKernel('ioctl_fmt(DISK_0)');
      setSystemState(prev => ({
          ...prev,
          memory: new Array(MEMORY_SIZE).fill(0),
          logs: [...prev.logs, '[SYS_CALL] ioctl_fmt(DISK_0) success'],
          outputConsole: ["DISK FORMATTED.", "SYSTEM RESET."],
          currentProgram: null
      }));
      // Reset CPU but keep cycles/temp
      setCpuState(prev => ({...CPU.initialCpuState(), cycles: prev.cycles, temperature: prev.temperature}));
      setProgramQueue([]);
      addLog('WARN', 'Disk Formatted by User', 'DISK_IO');
  };

  // --- WINDOW MANAGEMENT HANDLERS ---
  const handleOpenWindow = (appId: WindowState['appId'], title: string, metadata?: any) => {
      const existing = windows.find(w => w.appId === appId);
      if (existing) {
          handleFocusWindow(existing.id);
          if (metadata) {
              setWindows(prev => prev.map(w => w.id === existing.id ? { ...w, metadata } : w));
              logToKernel(`ipc_msg_send('${appId}', 'UPDATE_META')`);
          }
          return;
      }
      
      logToKernel(`ui_create_window('${appId}')`);
      const newWindow: WindowState = {
          id: Math.random().toString(36).substr(2, 9),
          appId,
          title,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZIndex,
          position: { x: 50 + (windows.length * 20), y: 50 + (windows.length * 20) },
          size: { w: 600, h: 400 },
          metadata
      };
      setWindows(prev => [...prev, newWindow]);
      setNextZIndex(prev => prev + 1);
      addLog('DEBUG', `Process Started: ${appId}`, 'WINDOW_MGR');
  };

  const handleCloseWindow = (id: string) => {
      const win = windows.find(w => w.id === id);
      if (win) logToKernel(`ui_destroy_window('${win.appId}')`);
      setWindows(prev => prev.filter(w => w.id !== id));
  };

  const handleFocusWindow = (id: string) => {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w));
      setNextZIndex(prev => prev + 1);
  };

  const handleUpdateWindow = (id: string, updates: Partial<WindowState>) => {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const handleMinimizeWindow = (id: string) => {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };

  const handleMaximizeWindow = (id: string) => {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  return (
    <div className={`w-screen h-screen flex items-center justify-center select-none font-sans bg-neutral-900 overflow-hidden`}>
      {/* Physical PC Case Wrapper - Full Screen */}
      <div 
        className={`relative w-full h-full flex flex-col md:flex-row overflow-hidden transition-colors duration-500`}
        style={{ backgroundColor: theme.colors.panelBg }}
      >
          {/* Left Panel: Monitor / OS Interface (Expanded) */}
          <div className="flex-1 relative bg-black flex flex-col min-w-0">
             <Monitor 
                system={systemState} 
                cpu={cpuState}
                theme={theme}
                windows={windows}
                fileSystem={fileSystem}
                logs={appLogs}
                onOpenWindow={handleOpenWindow}
                onCloseWindow={handleCloseWindow}
                onMinimizeWindow={handleMinimizeWindow}
                onMaximizeWindow={handleMaximizeWindow}
                onFocusWindow={handleFocusWindow}
                onUpdateWindow={handleUpdateWindow}
                onRunProgram={loadProgram} 
                onFormat={formatDisk}
                setTheme={setTheme}
                onClearLogs={() => setAppLogs([])}
             />
             
             {/* Hardware Power Button (Overlay) */}
             <button 
                onClick={togglePower}
                className="absolute bottom-6 right-6 z-[100] text-gray-600 hover:text-white transition-colors bg-black/50 p-2 rounded-full"
                title="Power Button"
             >
                <Power size={24} className={isOn ? "drop-shadow-[0_0_8px_cyan]" : ""} style={{ color: isOn ? theme.colors.primary : undefined }} />
             </button>
          </div>

          {/* Right Panel: Physical Hardware Monitor (Compact Side Panel) */}
          <div className="hidden md:flex w-80 flex-col border-l border-gray-800 transition-all duration-300 bg-[#0a0a0a] z-50 shadow-2xl">
             {/* Header */}
             <div className="p-3 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-widest" style={{ color: theme.colors.primary }}>IFFI CORE</span>
                    <span className="text-[9px] text-gray-500">BACKEND MONITOR</span>
                 </div>
                 <Activity size={16} className="text-gray-600" />
             </div>

             {/* Upper Half: CPU Stats & Logs */}
             <div className="flex-1 overflow-hidden border-b border-gray-800 relative bg-[#0a0a0a] flex flex-col">
                 {!isOn ? (
                     <div className="w-full h-full flex items-center justify-center text-gray-700 font-mono text-xs">
                         SYSTEM OFFLINE
                     </div>
                 ) : (
                     <BackendPanel cpu={cpuState} system={systemState} themeColor={`border-${theme.colors.secondary}`} />
                 )}
             </div>

             {/* Lower Half: RAM Map (Fixed small height) */}
             <div className="h-48 p-2 bg-[#050508] relative shrink-0">
                 {!isOn ? (
                      <div className="w-full h-full flex items-center justify-center text-gray-700 font-mono text-xs">
                        MEMORY UNPOWERED
                      </div>
                 ) : (
                      <MemoryMap memory={systemState.memory} lastAccessedAddress={cpuState.ir.args && cpuState.ir.args[1]} />
                 )}
                 
                 {/* Speed Controls */}
                 <div className="absolute bottom-0 left-0 w-full bg-gray-900 p-2 flex justify-between items-center border-t border-gray-800">
                    <span className="text-[10px] text-gray-400">CLOCK</span>
                    <div className="flex gap-1">
                        {[1000, 500, 100].map((speed) => (
                           <button 
                             key={speed}
                             onClick={() => setCpuState(prev => ({...prev, clockSpeed: speed}))}
                             className={`px-2 py-1 text-[10px] rounded border ${cpuState.clockSpeed === speed ? 'bg-white text-black font-bold' : 'bg-transparent text-gray-500 border-gray-700'}`}
                           >
                             {speed === 1000 ? '1x' : speed === 500 ? '2x' : 'MAX'}
                           </button>
                        ))}
                    </div>
                 </div>
             </div>
          </div>
      </div>
    </div>
  );
};

export default App;
