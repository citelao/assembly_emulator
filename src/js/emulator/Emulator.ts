import { IEmulatorState, EmulatorCommand } from "./EmulatorTypes";

export default class Emulator {
    public static run(oldState: IEmulatorState, command: EmulatorCommand): IEmulatorState {
        return oldState;
    }
}