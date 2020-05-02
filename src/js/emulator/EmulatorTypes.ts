export const REGISTER_MAX = 256;
export type RegisterValue = number;

export type RegisterName = "ra" | "rb" | "rc";

export interface IEmulatorState {
    ra: RegisterValue;
    rb: RegisterValue;
    rc: RegisterValue;
}

export type EmulatorCommand =
    "nop" |
    {
        command: "set"
        register: RegisterName,
        value: RegisterValue
    };