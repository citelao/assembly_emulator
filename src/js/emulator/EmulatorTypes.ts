export const REGISTER_MAX = 256;
export type RegisterValue = number;
export type Address = number;

// TODO: can index type be an Address instead?
export type Memory = Array<RegisterValue>;

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
    } |
    {
        command: "jeq"
        to: Address,
        a: RegisterName,
        b: RegisterName
    } |
    {
        command: "load"
        from: Address,
        to: RegisterName
    } |
    {
        command: "store"
        from: RegisterName,
        to: Address
    } |
    {
        command: "storeto"
        from: RegisterName,
        toPtr: RegisterName
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
        case "jeq":
            return `jump to ${command.to} if ${command.a} == ${command.b}`;
        case "load":
            return `load from ${command.from} to ${command.to}`;
        case "store":
            return `store from ${command.from} to ${command.to}`;
        case "storeto":
            return `store from ${command.from} to ${command.toPtr}`;
    }
}