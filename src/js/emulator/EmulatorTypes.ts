export const REGISTER_MAX = 256;
export type RegisterValue = number;

export interface IEmulatorState {
    ra: RegisterValue;
    rb: RegisterValue;
    rc: RegisterValue;
}

export type EmulatorCommand = "nop";