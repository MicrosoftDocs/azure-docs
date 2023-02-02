---
title: Quickstart - Add RAW media access to your app (Web)
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to add raw media access calling capabilities to your app using Azure Communication Services.
author: sloanster

ms.author: micahvivion
ms.date: 1/26/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

As a developer you can access the raw media for incoming and outgoing audio and video media content during a call. Access to ACS client side Raw audio and video enables developers an almost unlimited array of ability to view and edit audio and video content that happens within the ACS calling SDK. In this quickstart, you'll learn how to implement raw media access using the Azure Communication Services calling SDK for WebJS.

The video media access API provides support for developers to get real-time access to audio and video streams to capture, analyze, and process video content during active calls. Developers can access the incoming call video stream directly on the call object and send custom outgoing video stream during the call. For example the audio and video streams can be inspected to run custom AI models for analysis such as your homegrown NLP for conversation analysis or provide real-time insights and suggestions to boost agent productivity. Audio and video media streams can be used to analyze sentiment when providing virtual care for patients or provide remote assistance during video calls leveraging Mixed Reality capabilities. This also opens a path for developers to apply newer innovations with endless possibilities to enhance interaction experiences. 

## Prerequisites
[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

>[!IMPORTANT]
> The quick start examples here are available starting on the public preview version [1.10.0-beta.1](https://www.npmjs.com/package/@azure/communication-calling/v/1.10.0-beta.1) of the calling Web SDK. Make sure to use that version or newer when trying this quickstart.

## Accessing Raw audio
Accessing Raw audio media gives access to the incoming call audio stream and the ability to view and send custom outgoing audio stream during a call.

### Place a call with custom audio stream
Developers can start a call with a custom audio stream instead of using user's microphone device.

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

### How to switch to a custom audio stream during a call
Developers can switch input device to a custom audio stream instead of using user's microphone device during a call.

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

### Stopping the custom audio stream
Developers can stop sending the custom audio stream after it has been set during a call.

```js
call.stopAudio();
```

### Accessing the incoming raw audio stream
Developers can access the incoming call audio stream.

```js
const call = callAgent.startCall(userId);
const callStateChangedHandler = () => {
    if (call.state === "Connected") {
        const remoteAudioStream = call.remoteAudioStreams[0];
        const mediaStream = remoteAudioStream.getMediaStream();
	// process the incoming call audio media stream track
    }
};

callStateChangedHandler();
call.on("stateChanged", callStateChangedHandler);
```

## Accessing Raw video
Raw video media gives you the instance of MediaStream object (See JavaScript documentation for further reference). Raw video media gives access specifically to incoming and outgoing call MediaStream object. For Raw Video, developers can use the incoming and outgoing raw MediaStream to apply filters by using Machine Learning to process frames of the video.

Processed Raw outgoing video frames can be sent as an outgoing video of the sender. Processed Raw incoming video frames can be rendered on receiver side.

### Place a call with custom video stream

Developers can access the raw outgoing call video stream. Developers have access to MediaStream of the outgoing raw video stream on which they can process frames using Machine Learning and apply filters. 
The processed outgoing video can then be sent as sender video stream.

In this example, a user is sent canvas data as outgoing video.

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

### Switch to custom video stream during a call
Developers can switch input device to a custom video stream instead of using user's camera device during a call.

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

### Stop custom video stream
Developers can stop sending the custom video stream after it has been set during a call.

```js
call.stopVideo();
```

### Incoming video stream
Developers can access the raw incoming call video stream. Developers can also access the MediaStream of the incoming raw video stream and process frames using Machine Learning and apply filters. 
The processed incoming video can then be rendered on receiver side.

```js
const userId = 'acs_user_id';
const call = callAgent.startCall(userId);
const callStateChangedHandler = () => {
    if (call.state === "Connected") {
        const remoteVideoStream = remoteParticipants[0].videoStreams[0];
        const mediaStream = remoteVideoStream.getMediaStream();
	// process the incoming call video media stream
    }
};

callStateChangedHandler();
call.on("stateChanged", callStateChangedHandler);
```
