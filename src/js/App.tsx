import React from "react";
import ReactDOM from "react-dom";
import Color from "color";
import { IEmulatorState, RegisterValue, REGISTER_MAX, EmulatorCommand } from "./emulator/EmulatorTypes";
import Emulator from "./emulator/Emulator";

function times<T>(n: number, func: (index: number) => T): T[] {
    const ret: T[] = [];
    for (let i = 0; i < n; i++) {
        ret.push(func(i));
    }
    return ret;
}

interface IAppProps {
    code: EmulatorCommand[];
    emulatorState: IEmulatorState[];
}

// This is a terrible hash function. Love, Ben.
function generatorRegisterColor(registerValue: RegisterValue): Color {
    const COLOR_MAX = 100;

    const MAX_LIGHTNESS_OFFSET = 20;
    const LIGHTNESS_SCALE = 0.5;
    const l = (registerValue === 0)
        ? 100
        : COLOR_MAX - MAX_LIGHTNESS_OFFSET - (registerValue / REGISTER_MAX * COLOR_MAX * LIGHTNESS_SCALE);

    const SMALL_FACTOR = 20;
    const h = (registerValue % SMALL_FACTOR) * (COLOR_MAX / SMALL_FACTOR);

    return Color({ h: h, s: 50, l: l });
}

class App extends React.Component<IAppProps, {}> {
    constructor(props: IAppProps) {
        super(props);
    }

    private renderRow(index: number): JSX.Element {
        const line = (this.props.code.length <= index)
            ? ""
            : this.props.code[index].toString();
        const emulator = this.props.emulatorState[index];
        console.log(generatorRegisterColor(emulator.ra));
        return <tr>
            <td><code>{line}</code></td>
            <td style={{ backgroundColor: generatorRegisterColor(emulator.ra).hex() }}>{emulator.ra}</td>
            <td style={{ backgroundColor: generatorRegisterColor(emulator.rb).hex() }}>{emulator.rb}</td>
            <td style={{ backgroundColor: generatorRegisterColor(emulator.rc).hex() }}>{emulator.rc}</td>
        </tr>;
    }

    private renderColors(): JSX.Element {
        return <ul>
            {times(REGISTER_MAX, (index) => <li style={{ backgroundColor: generatorRegisterColor(index).hex() }}>{index}</li>)}
        </ul>;
    }

    render() {
        return <main>
            <table>
                <tbody>
                   {this.props.emulatorState.map((_, index) => this.renderRow(index))}
                </tbody>
            </table>
            {this.renderColors()}
        </main>;
    }
}

const emulatorCommands: EmulatorCommand[] = [
    "nop",
    "nop",
    { command: "set", register: "rb", value: 50 },
    { command: "set", register: "ra", value: 150 },
    { command: "set", register: "rc", value: 2 },
    { command: "set", register: "rb", value: 30 },
    "nop",
];

const DEFAULT_STATE: IEmulatorState = {
    ra: 0,
    rb: 0,
    rc: 0
};

const emulatorStates: IEmulatorState[] = [
    DEFAULT_STATE
];
for (let i = 0; i < emulatorCommands.length; i++) {
    const command: EmulatorCommand = emulatorCommands[i];
    const last_state = emulatorStates[emulatorStates.length - 1];
    emulatorStates.push(Emulator.run(last_state, command));
}

const props: IAppProps = {
    code: emulatorCommands,
    emulatorState: emulatorStates
};

const mountNode = document.getElementById("app");
ReactDOM.render(<App code={props.code} emulatorState={props.emulatorState} />, mountNode);