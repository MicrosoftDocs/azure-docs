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

As a developer, you can access the raw media for incoming and outgoing audio and video content during a call. Access to Azure Communication Services client-side raw audio and video gives developers an almost unlimited ability to view and edit audio and video content that happens within the Azure Communication Services Calling SDK. In this quickstart, you'll learn how to implement raw media access by using the Azure Communication Services Calling SDK for JavaScript.

The API for video media access provides support for real-time access to audio and video streams so that you can capture, analyze, and process video content during active calls. You can access the incoming call's video stream directly on the call object and send custom outgoing video streams during the call.

For example, you can inspect audio and video streams to run custom AI models for analysis. Such models might include natural language processing to analyze conversations or to provide real-time insights and suggestions to boost agent productivity.

Organizations can use audio and video media streams to analyze sentiment when providing virtual care for patients or to provide remote assistance during video calls that use mixed reality. This capability  opens a path for developers to apply innovations to enhance interaction experiences.

## Prerequisites

[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

>[!IMPORTANT]
> The examples here are available starting on the public preview version [1.10.0-beta.1](https://www.npmjs.com/package/@azure/communication-calling/v/1.10.0-beta.1) of the Calling SDK for JavaScript. Be sure to use that version or newer when you're trying this quickstart.

## Access raw audio

Accessing raw audio media gives you access to the incoming call's audio stream, along with the ability to view and send custom outgoing audio streams during a call.

### Access an incoming raw audio stream

Use the following code to access an incoming call's audio stream.

```js
const call = callAgent.startCall(userId);
const callStateChangedHandler = () => {
    if (call.state === "Connected") {
        const remoteAudioStream = call.remoteAudioStreams[0];
        const mediaStream = remoteAudioStream.getMediaStream();
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
const callStateChangedHandler = () => {
    if (call.state === 'Connected') {
        call.startAudio(localAudioStream);
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
const callStateChangedHandler = () => {
    if (call.state === 'Connected') {    	
        const mediaStream = createVideoMediaStreamToSend();
        const localVideoStream = this.call.localVideoStreams[0];
        localVideoStream.setMediaStream(mediaStream);
    }
};

callStateChangedHandler();
call.on('stateChanged', callStateChangedHandler);
```

### Stop a custom video stream

Use the following code to stop sending a custom video stream after it has been set during a call.

```js
call.stopVideo();
```

### Receive a call with an incoming video stream

You can access the raw video stream for an incoming call. You use `MediaStream` for the incoming raw video stream to process frames by using machine learning and to apply filters. The processed incoming video can then be rendered on the receiver side.

```js
const userId = 'acs_user_id';
const call = callAgent.startCall(userId);
const callStateChangedHandler = () => {
    if (call.state === "Connected") {
        const remoteVideoStream = remoteParticipants[0].videoStreams[0];
        const mediaStream = remoteVideoStream.getMediaStream();
	// process the incoming call's video media stream
    }
};

callStateChangedHandler();
call.on("stateChanged", callStateChangedHandler);
```
