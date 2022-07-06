---
title: Quickstart - Add RAW media access to your app (Web)
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to add raw media access calling capabilities to your app using Azure Communication Services.
author: Filippos Zampounis

ms.author: fizampou
ms.date: 07/05/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

Raw audio media gives access to the incoming call audio stream and send custom outgoing audio stream during a call.

## Place a call with custom audio stream

Developers can start a call with a custom audio stream instead of using user's microphone device.

```js
const createBeepAudioTrackToSend = () => {
    const context = new AudioContext();
    const dest = context.createMediaStreamDestination();
    const os = context.createOscillator();
    os.type = 'sine';
    os.frequency.value = 500;
    os.connect(dest);
    os.start();
    const { stream } = dest;
    const track = stream.getAudioTracks()[0];
    return track;
};

...
const userId = 'acs_user_id';
const mediaStreamTrack = createBeepAudioTrackToSend();
const localAudioStream = new LocalAudioStream(mediaStreamTrack);
const callOptions = {
    audioOptions: {
        localAudioStreams: [localAudioStream]
    }
};
callAgent.startCall(userId, callOptions);
```

## Switch to custom audio stream during a call

Developers can switch input device to a custom audio stream instead of using user's microphone device during a call.

```js
const createBeepAudioTrackToSend = () => {
    const context = new AudioContext();
    const dest = context.createMediaStreamDestination();
    const os = context.createOscillator();
    os.type = 'sine';
    os.frequency.value = 500;
    os.connect(dest);
    os.start();
    const { stream } = dest;
    const track = stream.getAudioTracks()[0];
    return track;
};

...

const userId = 'acs_user_id';
const mediaStreamTrack = createBeepAudioTrackToSend();
const localAudioStream = new LocalAudioStream(mediaStreamTrack);
const call = callAgent.startCall(userId);
const callStateChangedHandler = () => {
    if (call.state === 'Connected') {
        call.startAudio(localAudioStream);
    }
};

callStateChangedHandler();
call.on('stateChanged', callStateChangedHandler);
```

## Stop custom audio stream

Developers can stop sending the custom audio stream after it has been set during a call.

```js
call.stopAudio();
```

## Incoming audio stream

Developers can access the incoming call audio stream.

```js
const call = callAgent.startCall(userId);
const callStateChangedHandler = () => {
	if (call.state === "Connected") {
		const remoteAudioStream = call.remoteAudioStreams[0];
		const mediaStreamTrack = remoteAudioStream.getMediaStreamTrack();
		// process the incoming call audio media stream track
	}
};

callStateChangedHandler();
call.on("stateChanged", callStateChangedHandler);
```
