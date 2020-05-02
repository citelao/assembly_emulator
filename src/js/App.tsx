import React from "react";
import ReactDOM from "react-dom";
import Color from "color";

const REGISTER_MAX = 256;
type RegisterValue = number;

interface IEmulatorState {
    ra: RegisterValue;
    rb: RegisterValue;
    rc: RegisterValue;
}

interface IAppProps {
    code: string[];
    emulatorState: IEmulatorState[];
}

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
            : this.props.code[index];
        const emulator = this.props.emulatorState[index];
        console.log(generatorRegisterColor(emulator.ra));
        return <tr>
            <td><code>{line}</code></td>
            <td style={{ backgroundColor: generatorRegisterColor(emulator.ra).hex() }}>{emulator.ra}</td>
            <td style={{ backgroundColor: generatorRegisterColor(emulator.rb).hex() }}>{emulator.rb}</td>
            <td style={{ backgroundColor: generatorRegisterColor(emulator.rc).hex() }}>{emulator.rc}</td>
        </tr>;
    }

    render() {
        return <main>
            <table>
                <tbody>
                   {this.props.emulatorState.map((_, index) => this.renderRow(index))}
                </tbody>
            </table>
        </main>;
    }
}

const props: IAppProps = {
    code: [
        "set rb to 240",
        "set rc to 12",
    ],
    emulatorState: [
        { ra: 0, rb: 0, rc: 0 },
        { ra: 0, rb: 240, rc: 0 },
        { ra: 0, rb: 240, rc: 12 },
    ]
};

const mountNode = document.getElementById("app");
ReactDOM.render(<App code={props.code} emulatorState={props.emulatorState} />, mountNode);