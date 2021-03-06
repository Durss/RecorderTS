# Recorder.ts

**Typescript port of [recorder.js](https://github.com/mattdiamond/Recorderjs).**

Method **exportWAVMono()** have been merged with **exportWAV()**. It now accepts a third **mono** boolean argument instead of having a dedicated method.  
  
A fourth boolean argument allows to **reverse** the audio output.
  
Finally a fith argument allows to speedup or slowdown the audio output.

I only provide the typescript class and the worker JS file. It's up to you to include these in your project the way you want.

This generates a reversed sound twice faster :
```javascript
    audioRec.exportWAV(_=>{ /*callback*/ }, "audio/wav", false, true, 2)
```
## A plugin for recording/exporting the output of Web Audio API nodes

**Note:** This repository is not being actively maintained due to lack of time and interest. If you maintain or know of a good fork, please let me know so I can direct future visitors to it. In the meantime, if this library isn't working, you can find a list of popular forks here: http://forked.yannick.io/mattdiamond/recorderjs.

My sincerest apologies to the open source community for allowing this project to stagnate. I hope it was useful for some of you as a jumping-off point.

---

### Syntax
#### Constructor
```javascript
    let rec = new Recorder(source [, config])
```
Creates a recorder instance.

- **source** - The node whose output you wish to capture
- **config** - (*optional*) A configuration object (see **config** section below)

---------
#### Config

- **workerPath** - Path to recorder.js worker script. Defaults to 'js/recorderjs/recorderWorker.js'
- **bufferLen** - The length of the buffer that the internal JavaScriptNode uses to capture the audio. Can be tweaked if experiencing performance issues. Defaults to 4096.
- **callback** - A default callback to be used with `exportWAV`.

---------
#### Instance Methods
```javascript
    rec.record()
    rec.stop()
```
Pretty self-explanatory... **record** will begin capturing audio and **stop** will cease capturing audio. Subsequent calls to **record** will add to the current recording.
```javascript
    rec.clear()
```
This will clear the recording.
```javascript
    rec.exportWAV( callback:Function, type:string = "audio/wav", mono:boolean = false, reverse:boolean = false, reverse:speed = 1 )
```
This will generate a Blob object containing the recording in WAV format. The callback will be called with the Blob as its sole argument. If a callback is not specified, the default callback (as defined in the config) will be used. If no default has been set, an error will be thrown.

In addition, you may specify the type of Blob to be returned (defaults to 'audio/wav').
```javascript
    rec.getBuffer([callback:Function])
```
This will pass the recorded stereo buffer (as an array of two Float32Arrays, for the separate left and right channels) to the callback. It can be played back by creating a new source buffer and setting these buffers as the separate channel data:
```javascript
	function getBufferCallback( buffers ) {
		let newSource = audioContext.createBufferSource();
		let newBuffer = audioContext.createBuffer( 2, buffers[0].length, audioContext.sampleRate );
		newBuffer.getChannelData(0).set(buffers[0]);
		newBuffer.getChannelData(1).set(buffers[1]);
		newSource.buffer = newBuffer;

		newSource.connect( audioContext.destination );
		newSource.start(0);
	}
```
This sample code will play back the stereo buffer.


## License (MIT)

Copyright © 2013 Matt Diamond

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
