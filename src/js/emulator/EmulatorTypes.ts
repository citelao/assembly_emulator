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
    } |
    {
        command: "increment"
        register: RegisterName,
        by: RegisterValue
    };

export function stringify(command: EmulatorCommand): string {
    if (command === "nop") {
        return command;
    } else if (command.command === "set") {
        return `set ${command.register} to ${command.value}`;
    } else if (command.command === "increment") {
        return `increment ${command.register} by ${command.by}`;
    }
}