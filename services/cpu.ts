
import { OpCode, Instruction, CpuState, SystemState } from '../types';

export class CPU {
  static initialCpuState(): CpuState {
    return {
      pc: 0,
      ir: { op: OpCode.NOP, args: [] },
      registers: new Array(8).fill(0),
      flags: { zero: false, equal: false },
      clockSpeed: 500,
      cycles: 0,
      temperature: 35
    };
  }

  static executeCycle(cpu: CpuState, system: SystemState, program: Instruction[]): { cpu: CpuState, system: SystemState } {
    // Deep copy state to ensure immutability for React
    const newCpu = { 
        ...cpu, 
        registers: [...cpu.registers],
        flags: { ...cpu.flags },
        cycles: cpu.cycles + 1, 
        temperature: Math.min(85, cpu.temperature + Math.random() * 2) 
    };
    
    // Explicitly copy logs and console arrays
    const newSystem = { 
        ...system, 
        logs: [...system.logs],
        outputConsole: [...system.outputConsole]
    };

    // Fetch
    if (newCpu.pc >= program.length) {
      // Program ended or out of bounds
      newSystem.logs.push(`CPU HALT: End of instructions.`);
      return { cpu: newCpu, system: newSystem };
    }

    const instruction = program[newCpu.pc];
    newCpu.ir = instruction;
    
    // Decode & Execute
    switch (instruction.op) {
      case OpCode.MOV: {
        const [reg, val] = instruction.args;
        newCpu.registers[reg] = val;
        newSystem.logs.push(`MOV: R${reg} = ${val}`);
        newCpu.pc++;
        break;
      }
      case OpCode.LOAD: {
        // LOAD R_dest, R_addr_ptr (register holding the address)
        const [rDest, rPtr] = instruction.args;
        let addr = rPtr;
        // If second arg is a register index (0-7), use its value as address
        if (rPtr < 8) {
             addr = newCpu.registers[rPtr];
        }
        
        if (addr >= 0 && addr < newSystem.memory.length) {
            newCpu.registers[rDest] = newSystem.memory[addr];
            newSystem.logs.push(`LOAD: R${rDest} = MEM[${addr}] (${newSystem.memory[addr]})`);
        } else {
            newSystem.logs.push(`ERR: SegFault at ${addr}`);
        }
        newCpu.pc++;
        break;
      }
      case OpCode.STORE: {
         // STORE R_src, Address
         const [rSrc, addr] = instruction.args;
         if (addr >= 0 && addr < newSystem.memory.length) {
             const newMem = [...newSystem.memory];
             newMem[addr] = newCpu.registers[rSrc];
             newSystem.memory = newMem;
             newSystem.logs.push(`STORE: MEM[${addr}] = R${rSrc} (${newCpu.registers[rSrc]})`);
         }
         newCpu.pc++;
         break;
      }
      case OpCode.ADD: {
        const [rDest, rSrc] = instruction.args;
        // Check if rSrc is a register or value. In this simple ISA we assume register if < 8, but for ADD instruction usually it's ADD R1, R2.
        // Let's support immediate value if needed, but for now strict Register-Register addition
        const result = newCpu.registers[rDest] + newCpu.registers[rSrc];
        newCpu.registers[rDest] = result;
        newSystem.logs.push(`ADD: R${rDest} = ${result}`);
        newCpu.pc++;
        break;
      }
      case OpCode.CMP: {
        const [r1, r2OrVal] = instruction.args;
        const val1 = newCpu.registers[r1];
        // Use R2 value if it is a register index, otherwise treat as immediate
        // For search program, we are doing CMP R2, R0 (reg, reg)
        // For sort program, CMP R1, 205 (reg, val)
        let val2 = r2OrVal;
        if (r2OrVal < 8) val2 = newCpu.registers[r2OrVal];

        newCpu.flags.equal = (val1 === val2);
        newSystem.logs.push(`CMP: R${r1}(${val1}) == ${val2} ? ${newCpu.flags.equal}`);
        newCpu.pc++;
        break;
      }
      case OpCode.JEQ: {
        const [targetAddr] = instruction.args;
        if (newCpu.flags.equal) {
            newCpu.pc = targetAddr;
            newSystem.logs.push(`JEQ: Jumping to ${targetAddr}`);
        } else {
            newCpu.pc++;
        }
        break;
      }
      case OpCode.JMP: {
        const [targetAddr] = instruction.args;
        newCpu.pc = targetAddr;
        newSystem.logs.push(`JMP: Jumping to ${targetAddr}`);
        break;
      }
      case OpCode.OUT: {
        const [reg] = instruction.args;
        const val = newCpu.registers[reg];
        const msg = `[SYS_CALL] sys_write(1, R${reg}:${val})`;
        
        // Strict new array creation for React detection
        const updatedConsole = [...newSystem.outputConsole, `> OUTPUT: ${val}`];
        newSystem.outputConsole = updatedConsole;
        
        newSystem.logs.push(msg);
        newCpu.pc++;
        break;
      }
      case OpCode.HLT: {
        newSystem.logs.push(`CPU HALT triggered.`);
        // Do not increment PC
        break;
      }
      case OpCode.NOP:
      default:
        newCpu.pc++;
        break;
    }

    // Truncate logs if too long
    if (newSystem.logs.length > 50) newSystem.logs = newSystem.logs.slice(-50);

    return { cpu: newCpu, system: newSystem };
  }
}
