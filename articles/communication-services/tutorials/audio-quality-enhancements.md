---
title: Tutorial - Add audio effects to your calls (Web)
titleSuffix: An Azure Communication Services quickstart
description: Learn how to add audio effects in your calls using Azure Communication Services.
author: sloanster

ms.author: micahvivion
ms.date: 04/10/2024
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---
# Add audio quality enhancements to your WebJS calling experience
You can use the Audio effects feature to add audio enhancements to your audio in calls. This feature enables developers to turn on audio enhancements such as ML based noise suppression into their calling experience.

[!INCLUDE [Public Preview](../includes/includes/public-preview-include-document.md)]

## Using audio effects
### Install the package
Use the `npm install` command to install the Azure Communication Services Effects SDK for JavaScript.
> [!IMPORTANT]
> This quickstart uses the Azure Communication Services Calling SDK version of `1.24.1-beta.1` (or greater) and the Azure Communication Services Calling Effects SDK version greater than or equal to `1.1.0-beta.1` (or greater).
```console
npm install @azure/communication-calling-effects --save
```
> [!NOTE]
> The calling effect library cannot be used standalone and can only work when used with the Azure Communication Calling client library for WebJS (https://www.npmjs.com/package/@azure/communication-calling). 

See [here](https://www.npmjs.com/package/@azure/communication-calling-effects) for more details on the calling commmunication effects npm package page.

> [!NOTE]
> Currently browser support for adding audio effects is only available on Chrome and Edge Desktop Browsers (Windows and Mac).

> Go here to take a look at the API references - [@azure/communication-calling API reference](/javascript/api/azure-communication-services/@azure/communication-calling/?view=azure-communication-services-js&preserve-view=true)

To use audio effects with the Azure Communication Calling SDK, you need the `LocalAudioStream` that is currently in the call (more information on how to get this is in the code sample below). You need to get the `AudioEffects` feature API of the `LocalAudioStream` to start/stop audio effects:
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

### Start ML based Noise Suppression
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

### Start a call with ML based Noise Suppression already on
To start a call with DeepNoiseSuppression already on, create a new `LocalAudioStream` with a `AudioDeviceInfo` (the LocalAudioStream source should <u>not</u> be a raw `MediaStream` to use audio effects), and pass it in the `CallStartOptions.audioOptions` property as below:
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

You can also switch to browser based noise suppression if that's what you need (more information - https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings/noiseSuppression). It's worth noting though, this noise suppression is not strong enough to suppress background noises compared to our ML based Deep Noise Suppression.
```js
// Switch to browser based noise suppression
await audioEffectsFeatureApi.startEffects({
    noiseSuppression: 'BrowserNoiseSuppression'
});
```

At anytime if you want to check what effects are active, you can use the `activeEffects` property.
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
