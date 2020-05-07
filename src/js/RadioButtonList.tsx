import React from "react";

export interface IRadioButtonListProps {
    name: string;
    items: Array<{ text: string; value: string; }>;
    selectedValue?: string;
    onChanged?: (value: string) => void;
}

export interface IRadioButtonListState {
    
}

export default class RadioButtonList extends React.Component<IRadioButtonListProps, IRadioButtonListState> {
    render() {
        return <ul className="radio_list">
            {
                this.props.items.map((r) => <li key={r.value}>
                    <label>
                        <input
                            type="radio"
                            name={this.props.name}
                            value={r.value}
                            checked={(this.props.selectedValue === undefined)
                                ? undefined
                                : r.value === this.props.selectedValue}
                            onChange={this.handleViewChange} />
                        {r.text}
                    </label>
                </li>)
            }
        </ul>;
    }

    private handleViewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.onChanged) {
            this.props.onChanged(e.target.value)
        }
    }
}