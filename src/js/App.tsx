import React from "react";
import ReactDOM from "react-dom";

interface IEmulatorState {
    ra: number;
    rb: number;
    rc: number;
}

interface IAppProps {
    code: string[];
    emulatorState: IEmulatorState[];
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
        return <tr>
            <td><code>{line}</code></td>
            <td>{emulator.ra}</td>
            <td>{emulator.rb}</td>
            <td>{emulator.rc}</td>
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