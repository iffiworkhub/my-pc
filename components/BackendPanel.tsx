
import React, { useEffect, useRef } from 'react';
import { CpuState, SystemState, REGISTERS_COUNT } from '../types';
import { DEVELOPER_INFO } from '../constants';

interface BackendPanelProps {
  cpu: CpuState;
  system: SystemState;
  themeColor: string;
}

export const BackendPanel: React.FC<BackendPanelProps> = ({ cpu, system, themeColor }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [system.logs]);

  return (
    <div className={`h-full w-full bg-black/90 border-r-2 ${themeColor} p-4 flex flex-col font-mono text-xs md:text-sm overflow-hidden relative`}>
      <div className="absolute top-0 right-0 p-2 opacity-50 text-[10px] text-right">
         BACKEND ENGINE<br/>
         IFFI VIRTUAL PC v1.0
      </div>

      {/* Stats Header */}
      <div className="grid grid-cols-2 gap-4 mb-4 border-b border-gray-800 pb-2">
        <div>
            <div className="text-gray-400 text-[10px]">CYCLE COUNT</div>
            <div className={`text-2xl font-bold ${themeColor.replace('border', 'text')}`}>{cpu.cycles}</div>
        </div>
        <div>
            <div className="text-gray-400 text-[10px]">CPU TEMP</div>
            <div className={`${cpu.temperature > 80 ? 'text-red-500 animate-pulse' : 'text-green-400'} text-lg`}>
                {cpu.temperature.toFixed(1)}°C
            </div>
        </div>
      </div>

      {/* Registers */}
      <div className="mb-4">
        <h3 className="text-gray-400 mb-2 font-bold border-b border-gray-800 text-[10px]">REGISTERS (R0-R7)</h3>
        <div className="grid grid-cols-4 lg:grid-cols-4 gap-2">
          {cpu.registers.map((val, idx) => (
            <div key={idx} className="bg-gray-900 p-1.5 rounded border border-gray-700 flex justify-between items-center">
              <span className="text-gray-500 text-[10px] mr-1">R{idx}</span>
              <span className="text-white font-bold">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Instruction */}
      <div className="mb-4 bg-gray-900 p-3 border border-gray-700 rounded relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 animate-pulse"></div>
        <h3 className="text-gray-400 text-[10px] mb-1">INSTRUCTION REGISTER (IR)</h3>
        <div className="text-white text-lg font-bold">
           {cpu.ir.op} <span className="text-gray-400 font-normal">{cpu.ir.args.join(', ')}</span>
        </div>
        <div className="text-gray-500 text-[10px] italic mt-1 flex gap-3">
            <span>PC: {cpu.pc}</span>
            <span>FLAGS: [Z:{cpu.flags.zero ? 1 : 0} E:{cpu.flags.equal ? 1 : 0}]</span>
        </div>
      </div>

      {/* Execution Logs */}
      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-gray-400 mb-2 font-bold text-[10px]">KERNEL INSTRUCTION LOGS</h3>
        <div className="flex-1 overflow-y-auto bg-black border border-gray-800 p-2 font-mono text-green-500 space-y-1 shadow-inner text-xs">
          {system.logs.map((log, i) => {
            const isSysCall = log.startsWith('[SYS_CALL]');
            return (
              <div key={i} className="whitespace-nowrap flex gap-2">
                <span className="text-gray-600 select-none">[{Math.floor(Date.now()/1000) - 10000 + i}]</span> 
                {isSysCall ? (
                   <span className="text-pink-500 font-bold flex items-center gap-1">
                      <span className="text-[9px] bg-pink-900/50 px-1 rounded border border-pink-700">SYS</span>
                      {log.replace('[SYS_CALL]', '').trim()}
                   </span>
                ) : (
                   <span>{log}</span>
                )}
              </div>
            );
          })}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* Branding Footer */}
      <div className="mt-4 pt-2 border-t border-gray-800 text-[10px] text-gray-500 text-center">
         ENGINE DEVELOPED BY {DEVELOPER_INFO.name.toUpperCase()}
      </div>
    </div>
  );
};
