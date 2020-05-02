import React from "react";
import ReactDOM from "react-dom";

interface IAppProps {
    code: string[];
}

class App extends React.Component<IAppProps, {}> {
    constructor(props: IAppProps) {
        super(props);
    }

    render() {
        return <main>
            <pre>
                {this.props.code.map(line => <>{line + "\r\n"}</>)}
            </pre>
        </main>;
    }
}

const props: IAppProps = {
    code: [
        "foo",
        "bar"
    ]
};

const mountNode = document.getElementById("app");
ReactDOM.render(<App code={props.code} />, mountNode);