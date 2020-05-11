export default class Recorder {

	private WORKER_PATH = 'recorderWorker.js';

	private bufferLen: number;
	private node: ScriptProcessorNode;
	private context: BaseAudioContext;
	private worker: Worker;
	private workerPath: string;
	private recording: boolean;
	private currCallback: Function;
	private source: GainNode;

	constructor(source: GainNode, config: any = {}) {
		this.source = source;
		this.bufferLen = config.bufferLen || 4096;
		this.context = source.context;
		this.workerPath = config.workerPath || this.WORKER_PATH;
		this.currCallback = config.currCallback;
		this.initialize();
	}



	/********************
	 * GETTER / SETTERS *
	 ********************/
	public get isRecording():boolean { return this.recording; }



	/******************
	 * PUBLIC METHODS *
	 ******************/

	public start(): void {
		this.recording = true;
	}

	public stop(): void {
		this.recording = false;
	}

	public clear(): void {
		this.worker.postMessage({ command: 'clear' });
	}

	public getBuffers(callback: Function): void {
		if (!this.currCallback && !callback) {
			throw new Error("No callback have been defined");
		}
		if (callback) this.currCallback = callback;

		this.worker.postMessage({ command: 'getBuffers' })
	}

	public exportWAV(callback:Function, type:string = "audio/wav", mono:boolean = false, reverse:boolean = false, speed:number = 1): void {
		if(callback) this.currCallback = callback;
		if (!this.currCallback) throw new Error("No callback have been defined");
		
		this.worker.postMessage({
			command: 'exportWAV',
			type,
			mono,
			speed,
			reverse,
		});
	}

	public dispose(): void {
		this.source.disconnect(this.node);
		this.node.disconnect(this.context.destination);
		this.worker.terminate();
	}



	/*******************
	 * PRIVATE METHODS *
	 *******************/
	/**
	 * Initializes the class
	 */
	private initialize(): void {
		if (!this.context.createScriptProcessor) {
			//@ts-ignore
			this.node = this.context.createJavaScriptNode(this.bufferLen, 2, 2);
		} else {
			this.node = this.context.createScriptProcessor(this.bufferLen, 2, 2);
		}

		this.worker = new Worker(this.workerPath);

		this.worker.onmessage = (e:MessageEvent) => this.onWorkerMessage(e);

		this.worker.postMessage({
			command: 'init',
			config: {
				sampleRate: this.context.sampleRate
			}
		});

		this.node.onaudioprocess = (e) => this.onAudioProcess(e);

		this.source.connect(this.node);
		this.node.connect(this.context.destination); // if the script node is not connected to an output the "onaudioprocess" event is not triggered in chrome.
	}

	private onAudioProcess(e) {
		if (!this.recording) return;
		this.worker.postMessage({
			command: 'record',
			buffer: [
				e.inputBuffer.getChannelData(0),
				e.inputBuffer.getChannelData(1)
			]
		});
	}

	private onWorkerMessage(e:MessageEvent):void {
		let blob = e.data;
		this.currCallback(blob);
	}

}