---
title: Quickstart - Add raw media access to your app (web)
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to add raw media access calling capabilities to your app by using Azure Communication Services.
author: sloanster

ms.author: micahvivion
ms.date: 1/26/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

As a developer, you can access the raw media for incoming and outgoing audio, video, and screen sharing content during a call so that you can capture, analyze, and process audio/video content. Access to Azure Communication Services client-side raw audio, raw video, and raw screen share, gives developers an almost unlimited ability to view and edit audio, video, and screen share content that happens within the Azure Communication Services Calling SDK. In this quickstart, you'll learn how to implement raw media access by using the Azure Communication Services Calling SDK for JavaScript.

For example,
- You can access the call's audio/video stream directly on the call object and send custom outgoing audio/video streams during the call.
- You can inspect audio and video streams to run custom AI models for analysis. Such models might include natural language processing to analyze conversations or to provide real-time insights and suggestions to boost agent productivity.
- Organizations can use audio and video media streams to analyze sentiment when providing virtual care for patients or to provide remote assistance during video calls that use mixed reality. This capability  opens a path for developers to apply innovations to enhance interaction experiences.

## Prerequisites

>[!IMPORTANT]
> The examples here are available in [1.13.1](https://www.npmjs.com/package/@azure/communication-calling/v/1.13.1) of the Calling SDK for JavaScript. Be sure to use that version or newer when you're trying this quickstart.

## Access raw audio

Accessing raw audio media gives you access to the incoming call's audio stream, along with the ability to view and send custom outgoing audio streams during a call.

### Access an incoming raw audio stream

Use the following code to access an incoming call's audio stream.

```js
const userId = 'acs_user_id';
const call = callAgent.startCall(userId);
const callStateChangedHandler = async () => {
    if (call.state === "Connected") {
        const remoteAudioStream = call.remoteAudioStreams[0];
        const mediaStream = await remoteAudioStream.getMediaStream();
	// process the incoming call's audio media stream track
    }
};

callStateChangedHandler();
call.on("stateChanged", callStateChangedHandler);
```

### Place a call with a custom audio stream

Use the following code to start a call with a custom audio stream instead of using a user's microphone device.

```js
const createBeepAudioStreamToSend = () => {
    const context = new AudioContext();
    const dest = context.createMediaStreamDestination();
    const os = context.createOscillator();
    os.type = 'sine';
    os.frequency.value = 500;
    os.connect(dest);
    os.start();
    const { stream } = dest;
    return stream;
};

...
const userId = 'acs_user_id';
const mediaStream = createBeepAudioStreamToSend();
const localAudioStream = new LocalAudioStream(mediaStream);
const callOptions = {
    audioOptions: {
        localAudioStreams: [localAudioStream]
    }
};
callAgent.startCall(userId, callOptions);
```

### Switch to a custom audio stream during a call

Use the following code to switch an input device to a custom audio stream instead of using a user's microphone device during a call.

```js
const createBeepAudioStreamToSend = () => {
    const context = new AudioContext();
    const dest = context.createMediaStreamDestination();
    const os = context.createOscillator();
    os.type = 'sine';
    os.frequency.value = 500;
    os.connect(dest);
    os.start();
    const { stream } = dest;
    return stream;
};

...

const userId = 'acs_user_id';
const mediaStream = createBeepAudioStreamToSend();
const localAudioStream = new LocalAudioStream(mediaStream);
const call = callAgent.startCall(userId);
const callStateChangedHandler = async () => {
    if (call.state === 'Connected') {
        await call.startAudio(localAudioStream);
    }
};

callStateChangedHandler();
call.on('stateChanged', callStateChangedHandler);
```

### Stop a custom audio stream

Use the following code to stop sending a custom audio stream after it has been set during a call.

```js
call.stopAudio();
```

## Access raw video

Raw video media gives you the instance of a `MediaStream` object. (For more information, see the JavaScript documentation.) Raw video media gives access specifically to the `MediaStream` object for incoming and outgoing calls. For raw video, you can use that object to apply filters by using machine learning to process frames of the video.

Processed raw outgoing video frames can be sent as an outgoing video of the sender. Processed raw incoming video frames can be rendered on the receiver side.

### Place a call with a custom video stream

You can access the raw video stream for an outgoing call. You use `MediaStream` for the outgoing raw video stream to process frames by using machine learning and to apply filters. The processed outgoing video can then be sent as a sender video stream.

This example sends canvas data to a user as outgoing video.

```js
const createVideoMediaStreamToSend = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 845;
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const colors = ['red', 'yellow', 'green'];
    window.setInterval(() => {
        if (ctx) {
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            const x = Math.floor(Math.random() * canvas.width);
            const y = Math.floor(Math.random() * canvas.height);
            const size = 100;
            ctx.fillRect(x, y, size, size);
        }
    }, 1000 / 30);

    return canvas.captureStream(30);
};

...
const userId = 'acs_user_id';
const mediaStream = createVideoMediaStreamToSend();
const localVideoStream = new LocalVideoStream(mediaStream);
const callOptions = {
    videoOptions: {
        localVideoStreams: [localVideoStream]
    }
};
callAgent.startCall(userId, callOptions);
```

### Switch to a custom video stream during a call

Use the following code to switch an input device to a custom video stream instead of using a user's camera device during a call.

```js
const createVideoMediaStreamToSend = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 845;
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const colors = ['red', 'yellow', 'green'];
    window.setInterval(() => {
        if (ctx) {
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            const x = Math.floor(Math.random() * canvas.width);
            const y = Math.floor(Math.random() * canvas.height);
            const size = 100;
            ctx.fillRect(x, y, size, size);
	 }
    }, 1000 / 30);

    return canvas.captureStream(30);
};

...

const userId = 'acs_user_id';
const call = callAgent.startCall(userId);
const callStateChangedHandler = async () => {
    if (call.state === 'Connected') {    	
        const mediaStream = createVideoMediaStreamToSend();
        const localVideoStream = this.call.localVideoStreams.find((stream) => { return stream.mediaStreamType === 'Video' });
        await localVideoStream.setMediaStream(mediaStream);
    }
};

callStateChangedHandler();
call.on('stateChanged', callStateChangedHandler);
```

### Stop a custom video stream

Use the following code to stop sending a custom video stream after it has been set during a call.

```js
// Stop video by passing the same `localVideoStream` instance that was used to start video
await call.stopVideo(localVideoStream);
```

When switching from a camera that has custom effects applied to another camera device, first stop the video, switch the source on the `LocalVideoStream`, and the start video again.
```js
const cameras = await this.deviceManager.getCameras();
const newCameraDeviceInfo = cameras.find(cameraDeviceInfo => { return cameraDeviceInfo.id === '<another camera that you want to switch to>' });
// If current camera is using custom raw media stream and video is on
if (this.localVideoStream.mediaStreamType === 'RawMedia' && this.state.videoOn) {
	// Stop raw custom video first
	await this.call.stopVideo(this.localVideoStream);
	// Switch the local video stream's source to the new camera to use
	this.localVideoStream?.switchSource(newCameraDeviceInfo);
	// Start video with the new camera device
	await this.call.startVideo(this.localVideoStream);

// Else if current camera is using normal stream from camera device and video is on
} else if (this.localVideoStream.mediaStreamType === 'Video' && this.state.videoOn) {
	// You can just switch the source, no need to stop and start again. Sent video will automatically switch to the new camera to use
	this.localVideoStream?.switchSource(newCameraDeviceInfo);
}

```

### Access incoming video stream from a remote participant

You can access the raw video stream for an incoming call. You use `MediaStream` for the incoming raw video stream to process frames by using machine learning and to apply filters. The processed incoming video can then be rendered on the receiver side.

```js
const remoteVideoStream = remoteParticipants[0].videoStreams.find((stream) => { return stream.mediaStreamType === 'Video'});
const processMediaStream = async () => {
    if (remoteVideoStream.isAvailable) {
	// remote video stream is turned on, process the video's raw media stream.
	const mediaStream = await remoteVideoStream.getMediaStream();
    } else {
	// remote video stream is turned off, handle it
    }
};

remoteVideoStream.on('isAvailableChanged', async () => {
    await processMediaStream();
});

await processMediaStream();
```

[!INCLUDE [Public Preview Disclaimer](../../../../includes/public-preview-include.md)]
Raw screen sharing access is in public preview and available as part of version 1.15.1-beta.1+.
## Access raw screen sharing

Raw screen share media gives access specifically to the `MediaStream` object for incoming and outgoing screen share streams. For raw screen sharing, you can use that object to apply filters by using machine learning to process frames of the screen share.

Processed raw screen share frames can be sent as an outgoing screen share of the sender. Processed raw incoming screen share frames can be rendered on the receiver side.

### Start screen sharing with a custom screen share stream 
```js
const createVideoMediaStreamToSend = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 845;
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const colors = ['red', 'yellow', 'green'];
    window.setInterval(() => {
        if (ctx) {
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            const x = Math.floor(Math.random() * canvas.width);
            const y = Math.floor(Math.random() * canvas.height);
            const size = 100;
            ctx.fillRect(x, y, size, size);
        }
    }, 1000 / 30);

    return canvas.captureStream(30);
};

...
const mediaStream = createVideoMediaStreamToSend();
const localScreenSharingStream = new LocalVideoStream(mediaStream);
// Will start screen sharing with custom raw media stream
await call.startScreenSharing(localScreenSharingStream);
console.log(localScreenSharingStream.mediaStreamType) // 'RawMedia'
```

### Access the raw screen share stream from a screen, browser tab, or app, and apply effects to the stream
The following is an example on how to apply a black and white effect on the raw screen sharing stream from a screen, browser tab, or app.
NOTE: The Canvas context filter = "grayscale(1)" API is not supported on Safari.
```js
let bwTimeout;
let bwVideoElem;

const applyBlackAndWhiteEffect = function (stream) {
	let width = 1280, height = 720;
	bwVideoElem = document.createElement("video");
	bwVideoElem.srcObject = stream;
	bwVideoElem.height = height;
	bwVideoElem.width = width;
	bwVideoElem.play();
	const canvas = document.createElement('canvas');
	const bwCtx = canvas.getContext('2d', { willReadFrequently: true });
	canvas.width = width;
	canvas.height = height;
	
	const FPS = 30;
	const processVideo = function () {
	    try {
		let begin = Date.now();
		// start processing.
		// NOTE: The Canvas context filter API is not supported in Safari
		bwCtx.filter = "grayscale(1)";
		bwCtx.drawImage(bwVideoElem, 0, 0, width, height);
		const imageData = bwCtx.getImageData(0, 0, width, height);
		bwCtx.putImageData(imageData, 0, 0);
		// schedule the next one.
		let delay = Math.abs(1000/FPS - (Date.now() - begin));
		bwTimeout = setTimeout(processVideo, delay);
	    } catch (err) {
		console.error(err);
	    }
	}
	
	// schedule the first one.
	bwTimeout = setTimeout(processVideo, 0);
	return canvas.captureStream(FPS);
}

// Call startScreenSharing API without passing any stream parameter. Browser will prompt the user to select the screen, browser tab, or app to share in the call.
await call.startScreenSharing();
const localScreenSharingStream = call.localVideoStreams.find( (stream) => { return stream.mediaStreamType === 'ScreenSharing' });
console.log(localScreenSharingStream.mediaStreamType); // 'ScreenSharing'
// Get the raw media stream from the screen, browser tab, or application
const rawMediaStream = await localScreenSharingStream.getMediaStream();
// Apply effects to the media stream as you wish
const blackAndWhiteMediaStream = applyBlackAndWhiteEffect(rawMediaStream);
// Set the media stream with effects no the local screen sharing stream
await localScreenSharingStream.setMediaStream(blackAndWhiteMediaStream);

// Stop screen sharing and clean up the black and white video filter
await call.stopScreenSharing();
clearTimeout(bwTimeout);
bwVideoElem.srcObject.getVideoTracks().forEach((track) => { track.stop(); });
bwVideoElem.srcObject = null;
```

### Stop sending screen share stream

Use the following code to stop sending a custom screen share stream after it has been set during a call.

```js
// Stop sending raw screen sharing stream
await call.stopScreenSharing(localScreenSharingStream);
```

### Access incoming screen share stream from a remote participant

You can access the raw screen share stream from a remote participant. You use `MediaStream` for the incoming raw screen share stream to process frames by using machine learning and to apply filters. The processed incoming screen share stream can then be rendered on the receiver side.

```js
const remoteScreenSharingStream = remoteParticipants[0].videoStreams.find((stream) => { return stream.mediaStreamType === 'ScreenSharing'});
const processMediaStream = async () => {
    if (remoteScreenSharingStream.isAvailable) {
	// remote screen sharing stream is turned on, process the stream's raw media stream.
	const mediaStream = await remoteScreenSharingStream.getMediaStream();
    } else {
	// remote video stream is turned off, handle it
    }
};

remoteScreenSharingStream.on('isAvailableChanged', async () => {
    await processMediaStream();
});

await processMediaStream();
```

