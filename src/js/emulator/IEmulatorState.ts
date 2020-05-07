import { RegisterValue, RegisterName, Address, Memory } from "./EmulatorTypes";
export interface IEmulatorState {
    pc: RegisterValue;
    ra: RegisterValue;
    rb: RegisterValue;
    rc: RegisterValue;
    memory: Memory;
}

export function stringifyEmulatorState(s: IEmulatorState): string {
    return `r: (${s.ra}, ${s.rb}, ${s.rc}); mem: [${s.memory}]`;
}