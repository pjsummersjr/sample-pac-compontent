import {IInputs, IOutputs} from "./generated/ManifestTypes";
import SampleReactComponent, {ISampleOutputProps, ISampleDisplayProps}  from "./components/SampleReactComponent";
import * as React from "react";
import * as ReactDOM from "react-dom"
import { isContext } from "vm";

export class SampleDisplayComponent implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _output: string;

	private _container: HTMLDivElement;
	private inputElement: HTMLInputElement;
	private outputLabelElement: HTMLDivElement;
	private _notifyOutputChanged: () => void;
	private _sampleComponentProps: ISampleDisplayProps;
	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, 
		notifyOutputChanged: () => void, 
		state: ComponentFramework.Dictionary, 
		container:HTMLDivElement)
	{
		this._notifyOutputChanged = notifyOutputChanged;
		this.componentDataChanged = this.componentDataChanged.bind(this);
		this._container = container;

		this._sampleComponentProps = {
			label: context.parameters.componentLabel.raw == null ? "Please input your content" : context.parameters.componentLabel.raw,
			defaultInputValue: context.parameters.defaultInputValue.raw == null ? "" : context.parameters.defaultInputValue.raw,
			outputChanged: this.componentDataChanged
		};

		this.renderComponent(context);
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, \
	 * lobal values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		console.log("updateView called");
		this.renderComponent(context);
	}

	/**
	 * Encapsulates any logic for comparing/validating the properties to be passed to the component and returns the ISampleDisplayProps object
	 * @param context 
	 */
	private getComponentProps(context: ComponentFramework.Context<IInputs>): ISampleDisplayProps {

		let newProps:ISampleDisplayProps = this._sampleComponentProps;
		
		// if(context.updatedProperties.includes("defaultInputValue") && context.parameters.defaultInputValue.raw !== this._sampleComponentProps.defaultInputValue) {
		// 	newProps.defaultInputValue = context.parameters.defaultInputValue.raw == null ? "" : context.parameters.defaultInputValue.raw;
		// }

		newProps.label = context.parameters.componentLabel.raw == null ? "Please input your content" : context.parameters.componentLabel.raw;
		
		return newProps;
	}

	/**
	 * Encapsulates component rendering logic
	 * @param context 
	 */
	private renderComponent(context: ComponentFramework.Context<IInputs>) {

		this._sampleComponentProps = this.getComponentProps(context);
		
		ReactDOM.render(
		 	React.createElement(
				 SampleReactComponent,
				 this._sampleComponentProps
			 ),
		 	this._container
		);
	}
	/**
	 * Callback method so the React component can send output back to the Power Apps
	 * @param data 
	 */
	public componentDataChanged(data:ISampleOutputProps) {
		this._sampleComponentProps.defaultInputValue = data.output1;
		this._output = data.output1;
		this._notifyOutputChanged();
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			componentOutput: this._output
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		ReactDOM.unmountComponentAtNode(this._container);
	}
}