import { RegisterValue, RegisterName } from "./EmulatorTypes";
export interface IEmulatorState {
    pc: RegisterValue;
    ra: RegisterValue;
    rb: RegisterValue;
    rc: RegisterValue;
}

export function stringifyEmulatorState(s: IEmulatorState): string {
    return `${s.ra}; ${s.rb}; ${s.rc};`;
}