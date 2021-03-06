import React from "react";
import ReactDOM from "react-dom";
import Color from "color";
import { RegisterValue, REGISTER_MAX, EmulatorCommand, stringify } from "./emulator/EmulatorTypes";
import { IEmulatorState, stringifyEmulatorState } from "./emulator/IEmulatorState";
import Emulator from "./emulator/Emulator";
import RadioButtonList from "./RadioButtonList";
import { times } from "./functional";
import WordBinaryDisplay from "./WordBinaryDisplay";

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

function generateProgramCounterDeltaColor(delta: number): Color {
    const DEFAULT_LIGHTNESS = 100;

    const LIGHTNESS_MAX = 80;
    const LIGHTNESS_MIN = 40;
    const SCALE = 20;

    const l = (delta != 1)
        ? LIGHTNESS_MAX - Math.min(Math.abs(delta - 1) / SCALE, 1) * (LIGHTNESS_MAX - LIGHTNESS_MIN)
        : DEFAULT_LIGHTNESS;

    return Color({ h: 40, s: 50, l: l });
}

function getProgramCounterStyle(current: RegisterValue, previous?: RegisterValue): React.CSSProperties {
    const delta = (previous === undefined)
        ? 0
        : Math.abs(current - previous);
    const backgroundColor = generateProgramCounterDeltaColor(delta);
    return {
        backgroundColor: backgroundColor.hex(),
        color: (delta === 1)
            ? backgroundColor.darken(0.2).hex()
            : backgroundColor.darken(0.9).hex()
    };
};

const GRAPHICS_HEIGHT = 16;
const GRAPHICS_WIDTH = 16;

interface IAppProps {
    code: EmulatorCommand[];
    emulatorState: IEmulatorState[];
}

enum AppViewType {
    CodeView,
    ExecutionView
}

interface IAppState {
    currentView: AppViewType
}

class App extends React.Component<IAppProps, IAppState> {
    constructor(props: IAppProps) {
        super(props);

        this.state = {
            // currentView: AppViewType.CodeView
            currentView: AppViewType.ExecutionView
        }
    }

    render() {
        return <main className="main">
            <aside className="view_chooser">
                <RadioButtonList
                    name="view"
                    items={[
                        { value: "code", text: "Code view" },
                        { value: "execute", text: "Execution view" }
                    ]}
                    selectedValue={(this.state.currentView === AppViewType.CodeView)
                        ? "code"
                        : "execute" }
                    onChanged={this.handleViewChange} />
            </aside>
            {(this.state.currentView === AppViewType.ExecutionView)
                ? this.renderExecutionView()
                : this.renderCodeView()}
            <aside className="sidebar">
                {/* TODO: make this work */}
                <RadioButtonList
                    name="numbers"
                    items={[
                        { value: "dec", text: "Decimal" },
                        { value: "hex", text: "Hexidecimal" },
                        { value: "binary", text: "Binary" }
                    ]} />
                <WordBinaryDisplay
                    rows={GRAPHICS_HEIGHT}
                    columns={GRAPHICS_WIDTH}
                    data={this.props
                        .emulatorState[this.props.emulatorState.length - 1]
                        .memory} />
                {/* TODO! */}
                <table>
                    <caption>Memory</caption>
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.emulatorState[this.props.emulatorState.length - 1].memory.map((m, index) => <tr>
                            <td>{index}</td>
                            <td>{m}</td>
                        </tr>)}
                    </tbody>
                </table>
            </aside>
            <p>Ignore below</p>
            {this.renderColors()}
        </main>;
    }

    private handleViewChange = (value: string) => {
        console.log(`Setting view to '${value}'`);
        this.setState({
            currentView: (value == "code")
                ? AppViewType.CodeView
                : AppViewType.ExecutionView
        });
    }

    private renderExecutionView(): JSX.Element {
        return <table className="code">
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
                {this.props.emulatorState.map((_, index) => this.renderExecutionViewRow(index))}
            </tbody>
        </table>;
    }

    private renderExecutionViewRow(index: number): JSX.Element {
        const emulator = this.props.emulatorState[index];
        const previousState = (index > 0)
            ? this.props.emulatorState[index - 1]
            : null;

        const line_address = emulator.pc;
        const line = (this.props.code.length <= line_address)
            ? ""
            : stringify(this.props.code[line_address]);

        const getRegisterStyle = (current: RegisterValue, previous?: RegisterValue): React.CSSProperties => {
            const delta = (previous === undefined)
                ? 0
                : Math.abs(current - previous);
            const backgroundColor = generatorRegisterColor(current);
            return {
                backgroundColor: backgroundColor.hex(),
                color: (delta === 0)
                    ? backgroundColor.darken(0.2).hex()
                    : backgroundColor.darken(0.9).hex()
            };
        };

        // console.log(generatorRegisterColor(emulator.ra));
        return <tr>
            <td style={getProgramCounterStyle(emulator.pc, previousState?.pc)}>{emulator.pc}</td>
            <td><code>{line}</code></td>
            <td style={getRegisterStyle(emulator.ra, previousState?.ra)}>{emulator.ra}</td>
            <td style={getRegisterStyle(emulator.rb, previousState?.rb)}>{emulator.rb}</td>
            <td style={getRegisterStyle(emulator.rc, previousState?.rc)}>{emulator.rc}</td>
            <td>{stringifyEmulatorState(emulator)}</td>
        </tr>;
    }

    private renderCodeView(): JSX.Element {
        return <table className="code">
            <thead>
                <tr>
                    <th>{""}</th>
                    <th>PC</th>
                    <th>Command</th>
                    <th>Calls</th>
                    {/* <th>rb</th>
                    <th>rc</th> */}
                </tr>
            </thead>
            <tbody>
                {this.props.code.map((code, index) => {
                    const relevantLines = this.props.emulatorState.filter((s) => s.pc === index);

                    const isUnreached = (relevantLines.length === 0);
                    const UNREACHABLE_STYLE: React.CSSProperties = {
                        color: "#ddd",
                        textDecoration: "line-through"
                    };

                    // Visualize loops!
                    const firstLineIndex = this.props.emulatorState.findIndex((s) => s.pc === index);
                    let continuationChar = "";
                    if (firstLineIndex !== -1 && firstLineIndex > 0) {
                        if (relevantLines.length > 1) {
                            const previousLine = this.props.emulatorState[firstLineIndex - 1];
                            const nextLine = (firstLineIndex + 1 < this.props.emulatorState.length)
                                ? this.props.emulatorState[firstLineIndex + 1]
                                : null;
    
                            // TODO: this is *really* bad at actually visualizing code flow.
                            // TODO: handle if any previous lines come from elsewhere.
                            // TODO: handle if any next lines go elsewhere.
                            // TODO: handle first item in loop
                            const isContinuedFromPrevious = previousLine.pc === index - 1;
                            const isContinuedToNext = nextLine && nextLine.pc === index + 1;
                            if (isContinuedToNext) {
                                continuationChar = "┃";
                            } else if (isContinuedFromPrevious) {
                                continuationChar = "┗";
                            }
                        }
                    }

                    return <tr key={index} style={(isUnreached) ? UNREACHABLE_STYLE : undefined}>
                        <td>{continuationChar}</td>
                        <td style={getProgramCounterStyle(index, index - 1)}>{index}</td>
                        <td><code>{stringify(code)}</code></td>
                        <td>{relevantLines.length}</td>
                        {/* <td>baz</td>
                        <td>f</td> */}
                    </tr>;
                })}
            </tbody>
        </table>;
    }

    private renderColors(): JSX.Element {
        return <ul>
            {times(REGISTER_MAX, (index) => <li style={{ backgroundColor: generatorRegisterColor(index).hex() }}>{index}</li>)}
        </ul>;
    }
}

const emulatorCommands: EmulatorCommand[] = [
    { command: "set", register: "ra", value: GRAPHICS_WIDTH * 4 },
    { command: "set", register: "rb", value: GRAPHICS_WIDTH * 5 },
    { command: "set", register: "rc", value: 1 },
    { command: "storeto", from: "rc", toPtr: "ra" },
    { command: "increment", register: "ra", by: 1 },
    { command: "jeq", to: 7, a: "ra", b: "rb"},
    { command: "jump", to: 3 },
    { command: "set", register: "ra", value: GRAPHICS_WIDTH * 5 + 1 },
    { command: "set", register: "rb", value: GRAPHICS_WIDTH * 6 - 1 },
    { command: "set", register: "rc", value: 1 },
    { command: "storeto", from: "rc", toPtr: "ra" },
    { command: "increment", register: "ra", by: 1 },
    { command: "jeq", to: 14, a: "ra", b: "rb"},
    { command: "jump", to: 10 },
    { command: "set", register: "ra", value: GRAPHICS_WIDTH * 6 + 2 },
    { command: "set", register: "rb", value: GRAPHICS_WIDTH * 7 - 2 },
    { command: "set", register: "rc", value: 1 },
    { command: "storeto", from: "rc", toPtr: "ra" },
    { command: "increment", register: "ra", by: 1 },
    { command: "jeq", to: 21, a: "ra", b: "rb"},
    { command: "jump", to: 17 },
    { command: "set", register: "ra", value: GRAPHICS_WIDTH * 7 + 3 },
    { command: "set", register: "rb", value: GRAPHICS_WIDTH * 8 - 3 },
    { command: "set", register: "rc", value: 1 },
    { command: "storeto", from: "rc", toPtr: "ra" },
    { command: "increment", register: "ra", by: 1 },
    { command: "jeq", to: 28, a: "ra", b: "rb"},
    { command: "jump", to: 24 },
    { command: "set", register: "ra", value: GRAPHICS_WIDTH * 8 + 4 },
    { command: "set", register: "rb", value: GRAPHICS_WIDTH * 9 - 4 },
    { command: "set", register: "rc", value: 1 },
    { command: "storeto", from: "rc", toPtr: "ra" },
    { command: "increment", register: "ra", by: 1 },
    { command: "jeq", to: 35, a: "ra", b: "rb"},
    { command: "jump", to: 31 },
    { command: "set", register: "ra", value: GRAPHICS_WIDTH * 9 + 5 },
    { command: "set", register: "rb", value: GRAPHICS_WIDTH * 10 - 5 },
    { command: "set", register: "rc", value: 1 },
    { command: "storeto", from: "rc", toPtr: "ra" },
    { command: "increment", register: "ra", by: 1 },
    { command: "jeq", to: 42, a: "ra", b: "rb"},
    { command: "jump", to: 38 },
    { command: "set", register: "ra", value: GRAPHICS_WIDTH * 10 + 6 },
    { command: "set", register: "rb", value: GRAPHICS_WIDTH * 11 - 6 },
    { command: "set", register: "rc", value: 1 },
    { command: "storeto", from: "rc", toPtr: "ra" },
    { command: "increment", register: "ra", by: 1 },
    { command: "jeq", to: 49, a: "ra", b: "rb"},
    { command: "jump", to: 45 },
    { command: "set", register: "ra", value: GRAPHICS_WIDTH * 11 + 7 },
    { command: "set", register: "rb", value: GRAPHICS_WIDTH * 12 - 7 },
    { command: "set", register: "rc", value: 1 },
    { command: "storeto", from: "rc", toPtr: "ra" },
    { command: "increment", register: "ra", by: 1 },
    { command: "jeq", to: 56, a: "ra", b: "rb"},
    { command: "jump", to: 52 },
    { command: "set", register: "ra", value: GRAPHICS_WIDTH * 3 + 1 },
    { command: "set", register: "rb", value: GRAPHICS_WIDTH * 4 - 1 },
    { command: "set", register: "rc", value: 1 },
    { command: "storeto", from: "rc", toPtr: "ra" },
    { command: "increment", register: "ra", by: 1 },
    { command: "jeq", to: 63, a: "ra", b: "rb"},
    { command: "jump", to: 59 },
    { command: "set", register: "ra", value: GRAPHICS_WIDTH * 2 + 1 },
    { command: "set", register: "rb", value: GRAPHICS_WIDTH * 3 - 9 },
    { command: "set", register: "rc", value: 1 },
    { command: "storeto", from: "rc", toPtr: "ra" },
    { command: "increment", register: "ra", by: 1 },
    { command: "jeq", to: 70, a: "ra", b: "rb"},
    { command: "jump", to: 66 },
    { command: "set", register: "ra", value: GRAPHICS_WIDTH * 1 + 2 },
    { command: "set", register: "rb", value: GRAPHICS_WIDTH * 2 - 10 },
    { command: "set", register: "rc", value: 1 },
    { command: "storeto", from: "rc", toPtr: "ra" },
    { command: "increment", register: "ra", by: 1 },
    { command: "jeq", to: 77, a: "ra", b: "rb"},
    { command: "jump", to: 73 },
    
    { command: "set", register: "ra", value: GRAPHICS_WIDTH * 2 + 9 },
    { command: "set", register: "rb", value: GRAPHICS_WIDTH * 3 - 1 },
    { command: "set", register: "rc", value: 1 },
    { command: "storeto", from: "rc", toPtr: "ra" },
    { command: "increment", register: "ra", by: 1 },
    { command: "jeq", to: 84, a: "ra", b: "rb"},
    { command: "jump", to: 80 },
    { command: "set", register: "ra", value: GRAPHICS_WIDTH * 1 + 10 },
    { command: "set", register: "rb", value: GRAPHICS_WIDTH * 2 - 2 },
    { command: "set", register: "rc", value: 1 },
    { command: "storeto", from: "rc", toPtr: "ra" },
    { command: "increment", register: "ra", by: 1 },
    { command: "jeq", to: 91, a: "ra", b: "rb"},
    { command: "jump", to: 87 },
];

const DEFAULT_STATE: IEmulatorState = {
    pc: 0,
    ra: 0,
    rb: 0,
    rc: 0,
    // TODO: use bit mapping, not byte addressing, but I'm lazy.
    memory: Array.from({ length: GRAPHICS_HEIGHT * GRAPHICS_WIDTH }, () => 0)
};

const emulatorStates: IEmulatorState[] = [
    DEFAULT_STATE
];
const MAX_RUNS = 500;
for (let i = 0; i < MAX_RUNS; i++) {
    const last_state = emulatorStates[emulatorStates.length - 1];

    const command_address = last_state.pc;
    if (emulatorCommands.length <= command_address) {
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