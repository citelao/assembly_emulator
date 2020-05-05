import { RegisterValue } from "./EmulatorTypes";
export interface IEmulatorState {
    ra: RegisterValue;
    rb: RegisterValue;
    rc: RegisterValue;
}

export function stringifyEmulatorState(s: IEmulatorState): string {
    return `${s.ra}; ${s.rb}; ${s.rc};`;
}