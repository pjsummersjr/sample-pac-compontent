import * as React from 'react';

export interface ISampleDisplayState {
    currentLabel:string;
    currentValue:string;
}

export interface ISampleOutputProps {
    output1: string;
}

export interface ISampleDisplayProps {
    label:string;
    inputValue: string;
    outputChanged: (output:ISampleOutputProps) => void;
}


export default class SampleDisplayComponent extends React.Component<ISampleDisplayProps, ISampleDisplayState> {

    constructor(props:ISampleDisplayProps) {
        super(props);
        this.state = {
            currentLabel: this.props.label,
            currentValue: this.props.inputValue
        };
        this.dataInputChanged = this.dataInputChanged.bind(this);
    }

    private dataInputChanged(evt:any): void {
        this.props.outputChanged({output1:evt.target.value});
        this.setState({
            currentValue: evt.target.value
        })
    }

    public componentWillReceiveProps(newProps: ISampleDisplayProps){
        this.setState({
            currentLabel: newProps.label,
            currentValue: newProps.inputValue
        })
    }

    public render(): React.ReactElement {
        
        return (
            <div>
                <div>{this.state.currentLabel}</div>
                <input type="text" value={this.state.currentValue} onChange={this.dataInputChanged}/>
            </div>
        );
    }

}