import { EmulatorCommand, Memory } from "./EmulatorTypes";
import { IEmulatorState } from "./IEmulatorState";

export default class Emulator {
    public static run(oldState: IEmulatorState, command: EmulatorCommand): IEmulatorState {
        if (command === "nop") {
            const partialState: Partial<IEmulatorState> = {};
            partialState.pc = oldState.pc + 1;
            return Object.assign({}, oldState, partialState);
        }

        switch(command.command) {
            case "set":
            {
                const partialState: Partial<IEmulatorState> = {};
                partialState.pc = oldState.pc + 1;
                partialState[command.register] = command.value;
                return Object.assign({}, oldState, partialState);
            }
            case "increment":
            {
                // TODO handle overflow?
                const partialState: Partial<IEmulatorState> = {};
                partialState.pc = oldState.pc + 1;
                partialState[command.register] = oldState[command.register] + command.by;
                return Object.assign({}, oldState, partialState);
            }
            case "add":
            {
                const partialState: Partial<IEmulatorState> = {};
                partialState.pc = oldState.pc + 1;
                partialState[command.to] = oldState[command.a] + oldState[command.b];
                return Object.assign({}, oldState, partialState);
            }
            case "jump":
            {
                const partialState: Partial<IEmulatorState> = {};
                partialState.pc = command.to;
                return Object.assign({}, oldState, partialState);
            }
            case "jeq":
            {
                const partialState: Partial<IEmulatorState> = {};
                if(oldState[command.a] === oldState[command.b]) {
                    partialState.pc = command.to;
                } else {
                    partialState.pc = oldState.pc + 1;
                }
                return Object.assign({}, oldState, partialState);
            }
            case "load":
            {
                throw new Error("load not implemented");
            }
            case "store":
            {
                const partialState: Partial<IEmulatorState> = {};
                partialState.pc = oldState.pc + 1;

                // Clone the memory. Note: this assumes that memory entries are
                // primitives.
                const newMemory: Memory = Object.assign([], oldState.memory);
                newMemory[command.to] = oldState[command.from];

                partialState.memory = newMemory;

                return Object.assign({}, oldState, partialState);
            }
        }
    }
}