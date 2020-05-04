import { IEmulatorState, EmulatorCommand } from "./EmulatorTypes";

export default class Emulator {
    public static run(oldState: IEmulatorState, command: EmulatorCommand): IEmulatorState {
        if (command === "nop") {
            return oldState;
        }

        switch(command.command) {
            case "set":
            {
                const partialState: Partial<IEmulatorState> = {};
                partialState[command.register] = command.value;
                return Object.assign({}, oldState, partialState);
            }
            case "increment":
            {
                const partialState: Partial<IEmulatorState> = {};
                partialState[command.register] = oldState[command.register] + command.by;
                return Object.assign({}, oldState, partialState);
            }
            case "add":
            {
                const partialState: Partial<IEmulatorState> = {};
                partialState[command.to] = oldState[command.a] + oldState[command.b];
                return Object.assign({}, oldState, partialState);
            }
            case "jump":
            {
                // uhoh.
                throw new Error("uh oh");
            }
        }
    }
}