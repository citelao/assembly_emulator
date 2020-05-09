import React from "react";
import { Memory } from "./emulator/EmulatorTypes";
import { times } from "./functional";

export interface IWordBinaryDisplayProps {
    data: Memory;

    rows: number;
    columns: number;
}

export interface IWordBinaryDisplayState {
}

/**
 * A binary display that indexes based on each Word in memory, not bytes.
 * Off if 0, on if !0.
 */
export default class WordBinaryDisplay extends React.Component<IWordBinaryDisplayProps, IWordBinaryDisplayState>
{
    render() {
        return <table>
            <caption>Data</caption>
            <tbody>
                {times(this.props.rows, (i) => {
                    return <tr>
                        {times(this.props.columns, (j) => {
                            const index = i * this.props.columns + j;
                            const value = this.props.data[index];
                            
                            const color = (value > 0)
                                ? "#000"
                                : "#fff";
                            return <td style={{ backgroundColor: color }}>{value}</td>;
                        })}
                    </tr>;
                })}
            </tbody>
        </table>;
    }
}