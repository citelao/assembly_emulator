import React from "react";
import ReactDOM from "react-dom";
import Color from "color";
import { RegisterValue, REGISTER_MAX, EmulatorCommand, stringify } from "./emulator/EmulatorTypes";
import { IEmulatorState, stringifyEmulatorState } from "./emulator/IEmulatorState";
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

function generateProgramCounterDeltaColor(currentPc: RegisterValue, previousPc: RegisterValue): Color {
    const delta = currentPc - previousPc;
    console.log(`${previousPc} => ${currentPc}`);

    const DEFAULT_LIGHTNESS = 100;

    const LIGHTNESS_MAX = 80;
    const LIGHTNESS_MIN = 40;
    const SCALE = 20;

    const l = (delta != 1)
        ? LIGHTNESS_MAX - Math.min(Math.abs(delta - 1) / SCALE, 1) * (LIGHTNESS_MAX - LIGHTNESS_MIN)
        : DEFAULT_LIGHTNESS;

    return Color({ h: 40, s: 50, l: l });
}

class App extends React.Component<IAppProps, {}> {
    constructor(props: IAppProps) {
        super(props);
    }

    private renderRow(index: number): JSX.Element {
        const emulator = this.props.emulatorState[index];
        const previousState = (index > 0)
            ? this.props.emulatorState[index - 1]
            : null;
        
        const line_address = emulator.pc;
        const line = (this.props.code.length <= line_address)
            ? ""
            : stringify(this.props.code[line_address]);
        console.log(generatorRegisterColor(emulator.ra));
        return <tr>
            <td style={{ backgroundColor: generateProgramCounterDeltaColor(emulator.pc, previousState?.pc || emulator.pc ).hex() }}>{emulator.pc}</td>
            <td><code>{line}</code></td>
            <td style={{ backgroundColor: generatorRegisterColor(emulator.ra).hex() }}>{emulator.ra}</td>
            <td style={{ backgroundColor: generatorRegisterColor(emulator.rb).hex() }}>{emulator.rb}</td>
            <td style={{ backgroundColor: generatorRegisterColor(emulator.rc).hex() }}>{emulator.rc}</td>
            <td>{stringifyEmulatorState(emulator)}</td>
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
                <thead>
                    <tr>
                        <th>PC</th>
                        <th>Command</th>
                        <th>ra</th>
                        <th>rb</th>
                        <th>rc</th>
                        <th>State</th>
                    </tr>
                </thead>
                <tbody>
                   {this.props.emulatorState.map((_, index) => this.renderRow(index))}
                </tbody>
            </table>
            <p>Ignore below</p>
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
    { command: "set", register: "ra", value: 30 },
    { command: "set", register: "rc", value: 80 },
    { command: "increment", register: "rc", by: 1 },
    { command: "increment", register: "rc", by: 1 },
    { command: "increment", register: "rc", by: 1 },
    { command: "increment", register: "rc", by: 1 },
    { command: "add", to: "rc", a: "rc", b: "ra" },
    { command: "jump", to: 5 },
    { command: "increment", register: "rc", by: 1 },
    { command: "increment", register: "rc", by: 1 },
    { command: "increment", register: "rc", by: 1 },
    "nop",
];

const DEFAULT_STATE: IEmulatorState = {
    pc: 0,
    ra: 0,
    rb: 0,
    rc: 0,
};

const emulatorStates: IEmulatorState[] = [
    DEFAULT_STATE
];
const MAX_RUNS = 100;
for (let i = 0; i < MAX_RUNS; i++) {
    const last_state = emulatorStates[emulatorStates.length - 1];

    const command_address = last_state.pc;
    if (emulatorCommands.length < command_address) {
        break;
    }
    const command: EmulatorCommand = emulatorCommands[command_address];
    emulatorStates.push(Emulator.run(last_state, command));
}

const props: IAppProps = {
    code: emulatorCommands,
    emulatorState: emulatorStates
};

const mountNode = document.getElementById("app");
ReactDOM.render(<App code={props.code} emulatorState={props.emulatorState} />, mountNode);