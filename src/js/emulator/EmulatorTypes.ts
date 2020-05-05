export const REGISTER_MAX = 256;
export type RegisterValue = number;
export type Address = number;

export type RegisterName = "ra" | "rb" | "rc";
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
    } |
    {
        command: "add",
        to: RegisterName,
        a: RegisterName,
        b: RegisterName
    } |
    {
        command: "jump",
        to: Address
    };

export function stringify(command: EmulatorCommand): string {
    if (command === "nop") {
        return command;
    }
    
    switch(command.command) {
        case "set":
            return `set ${command.register} to ${command.value}`;
        case "increment":
            return `increment ${command.register} by ${command.by}`;
        case "add":
            return `${command.to} = ${command.a} + ${command.b}`;
        case "jump":
            return `jump to ${command.to}`;
    }
}