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
    defaultInputValue: string;
    outputChanged: (output:ISampleOutputProps) => void;
}


export default class SampleDisplayComponent extends React.Component<ISampleDisplayProps, ISampleDisplayState> {

    constructor(props:ISampleDisplayProps) {
        super(props);
        this.state = {
            currentLabel: this.props.label,
            currentValue: this.props.defaultInputValue
        };
        this.dataInputChanged = this.dataInputChanged.bind(this);
    }

    private dataInputChanged(evt:any): void {
        this.props.outputChanged({output1:evt.target.value});
        this.setState({
            currentValue: evt.target.value
        });
    }

    public componentWillReceiveProps(newProps: ISampleDisplayProps){
        this.setState({
            currentLabel: newProps.label,
            currentValue: newProps.defaultInputValue
        });
    }

    public render(): React.ReactElement {        
        console.log("Rendering react component");
        return (
            <div>
                <div>{this.state.currentLabel}</div>
                <input type="text" value={this.state.currentValue} onChange={this.dataInputChanged}/>
                <div>Something else</div>
            </div>
        );
    }

}