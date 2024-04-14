---
title: Tutorial - Add audio effects to your calls (Web)
titleSuffix: An Azure Communication Services quickstart
description: Learn how to add audio effects in your calls using Azure Communication Services.
author: sloanster

ms.author: micahvivion
ms.date: 04/13/2024
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---
# Add audio quality enhancements to your audio calling experience
You can use the audio effects **noise suppression** feature to add audio enhancements to your audio experience. Noise suppression is a technology that reduces unwanted background noises from audio calls. It helps on audio calls by improving the clarity and quality of the call by removing background noise, making it easier to understand and communicate. Noise suppression can also enhance the all callers experience by reducing distractions and fatigue caused by noisy environments. A sample use case is when trying to take an Azure Communication Services WebJS call in a coffee shop. In these type of calling situations there is a lot of background ambiaent noise. By enabling noise suppression this can greatly improve the calling experience for someone that has their audio enabled (unmuted) and talking in a noisy room.

[!INCLUDE [Public Preview](../includes/public-preview-include-document.md)]

## Using audio effects packages **noise suppression**
### Install the npm package
Use the `npm install` command to install the Azure Communication Services Audio Effects SDK for JavaScript.
> [!IMPORTANT]
> This tutorial uses the Azure Communication Services Calling SDK version of `1.24.1-beta.1` (or greater) and the Azure Communication Services Calling Audio Effects SDK version greater than or equal to `1.1.0-beta.1` (or greater).
```console
npm install @azure/communication-calling-effects --save
```
> [!NOTE]
> The calling effect library cannot be used standalone and can only work when used with the Azure Communication Calling client library for WebJS (https://www.npmjs.com/package/@azure/communication-calling). 

See [here](https://www.npmjs.com/package/@azure/communication-calling-effects) for more details on the calling commmunication effects npm package page.

> [!NOTE]
> Current browser support for adding audio noise suppression effects is only available on Chrome and Edge Desktop Browsers for [Windows and macOS](../concepts/voice-video-calling/calling-sdk-features#javascript-calling-sdk-support-by-os-and-browser). 

> You can learn about the specifics of the [calling API](/javascript/api/azure-communication-services/@azure/communication-calling/?view=azure-communication-services-js&preserve-view=true).

To use `noise suppression` audio effects within the Azure Communication Calling SDK, you need the `LocalAudioStream` that is currently in the call. You will also need to the `AudioEffects` API of the `LocalAudioStream` to start and stop audio effects.
```js
import * as AzureCommunicationCallingSDK from '@azure/communication-calling'; 
import { DeepNoiseSuppressionEffect } from '@azure/communication-calling-effects'; 

// Get the LocalAudioStream from the localAudioStream collection on the call object
// 'call' here represents the call object.
const localAudioStreamInCall = call.localAudioStreams[0];

// Get the audio effects feature API on the LocalAudioStream
const audioEffectsFeatureApi = localAudioStreamInCall.feature(SDK.Features.AudioEffects);

// Subscribe to useful events
audioEffectsFeatureApi.on('effectsStarted', (activeEffects: ActiveAudioEffects) => {
    console.log(`Current status audio effects: ${activeEffects}`);
});

audioEffectsFeatureApi.on('effectsStopped', (activeEffects: ActiveAudioEffects) => {
    console.log(`Current status audio effects: ${activeEffects}`);
});

audioEffectsFeatureApi.on('effectsError', (error: AudioEffectErrorPayload) => {
    console.log(`Error with audio effects: ${error.message}`);
});
```

### How to turn on Noise Suppression effect when a call has already started
There are situations where are user might start a call and feel a need to turn on noise suppresion, but then experience their current environment get noisy resulting in them needing to turn on **noise suppression** after a call has started. To turn on **noise suppression** after a call has started:
```js
// Create the effect instance 
const deepNoiseSuppression = new DeepNoiseSuppressionEffect();

// Recommended: check support for the effect in the current environment using the isSupported method on the feature API
const isDeepNoiseSuppressionSupported = await audioEffectsFeatureApi.isSupported(deepNoiseSuppression);
if (isDeepNoiseSuppressionSupported) {
    console.log('awesome!');
}

// To start ML based Deep Noise Suppression,
await audioEffectsFeatureApi.startEffects({
    noiseSuppression: deepNoiseSuppression
});
```

### Start a call with Noise Suppression enabled
To start a call with **noise suppression** turned on, you can create a new `LocalAudioStream` with a `AudioDeviceInfo` (the LocalAudioStream source should <u>not</u> be a raw `MediaStream` to use audio effects), and pass it in the `CallStartOptions.audioOptions` property as below:
```js
// As an example, here we are simply creating a LocalAudioStream using the current selected mic on the DeviceManager
const audioDevice = deviceManager.selectedMicrophone;
const localAudioStreamWithEffects = new SDK.LocalAudioStream(audioDevice);
const audioEffectsFeatureApi = localAudioStreamWithEffects.feature(SDK.Features.AudioEffects);

// Start effect
await audioEffectsFeatureApi.startEffects({
    noiseSuppression: deepNoiseSuppression
});

// Pass the LocalAudioStream in audioOptions in call start/accept options.
await call.startCall({
    audioOptions: {
        muted: false,
        localAudioStreams: [localAudioStreamWithEffects]
    }
});
// Do the same for join().
// And similarly pass it in CallAcceptOptions.audioOptions in case of accept().
```
### Turn off browser based noise suppression
Current [Desktop browsers]( https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings/noiseSuppression) have some noise suppression capabilities. While this might be a OK solution for many users, the **noise suppresion** available as a plugin for Azure Communicaton Services WebJS calling SDK will likly be more optimized and can give better results to end users.

To turn off browser based noise suppression you can do the following:
```js
// Switch to browser based noise suppression
await audioEffectsFeatureApi.startEffects({
    noiseSuppression: 'BrowserNoiseSuppression'
});
```

At anytime if you want to check what **noise suppression** effects are currently active, you can use the `activeEffects` property.
The `activeEffects` property returns an object with the names of the current active effects.
```js
// Using the video effects feature api
const currentActiveEffects = audioEffectsFeatureApi.activeEffects;
```

To stop effects:
```js
// Stops noise suppression
await lasFeatureApi.stopEffects({
    noiseSuppression: true
});
```