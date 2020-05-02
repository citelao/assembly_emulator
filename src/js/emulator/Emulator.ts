import { IEmulatorState, EmulatorCommand } from "./EmulatorTypes";

export default class Emulator {
    public static run(oldState: IEmulatorState, command: EmulatorCommand): IEmulatorState {
        if (command === "nop") {
            return oldState;
        } else if (command.command === "set") {
            const partialState: Partial<IEmulatorState> = {};
            partialState[command.register] = command.value;
            return Object.assign({}, oldState, partialState);
        }
    }
}