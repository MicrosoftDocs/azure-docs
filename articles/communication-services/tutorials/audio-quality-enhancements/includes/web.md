---
title: Tutorial - Add audio noise suppression ability to your Web calls 
titleSuffix: An Azure Communication Services tutorial on how to enable advanced noise suppression
description: Learn how to add audio effects in your calls using Azure Communication Services.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 05/02/2024
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

The Azure Communication Services audio effects **noise suppression** abilities can improve your audio calls by filtering out unwanted background noises. **Noise suppression** is a technology that removes background noises from audio calls. It makes audio calls clearer and better by eliminating background noise, making it easier to talk and listen. Noise suppression can also reduce distractions and tiredness caused by noisy places. For example, if you're taking an Azure Communication Services WebJS call in a coffee shop with considerable noise, turning on noise suppression can make the call experience better.

[!INCLUDE [Public Preview Disclaimer](../../../includes/public-preview-include-document.md)]

## Using audio effects - **noise suppression**
### Install the npm package
Use the `npm install` command to install the Azure Communication Services Audio Effects SDK for JavaScript.
> [!IMPORTANT]
> This tutorial uses the Azure Communication Services Calling SDK version of **`1.24.2-beta.1`** (or greater) and the Azure Communication Services Calling Audio Effects SDK version greater than or equal to **`1.1.1-beta.1`** (or greater).

```console
@azure/communication-calling-effects@1.1.1-beta
```

> [!NOTE]
> The calling effect library cannot be used standalone and can only work when used with the Azure Communication Calling client library for WebJS (https://www.npmjs.com/package/@azure/communication-calling). 

You can find more [details ](https://www.npmjs.com/package/@azure/communication-calling-effects/v/next) on the calling effects npm package page.

> [!NOTE]
> Current browser support for adding audio noise suppression effects is only available on Chrome and Edge Desktop Browsers.

> You can learn about the specifics of the [calling API](/javascript/api/azure-communication-services/@azure/communication-calling/?view=azure-communication-services-js&preserve-view=true).

To use `noise suppression` audio effects within the Azure Communication Calling SDK, you need the `LocalAudioStream` that is currently in the call. You need access to the `AudioEffects` API of the `LocalAudioStream` to start and stop audio effects.
```js
import * as AzureCommunicationCallingSDK from '@azure/communication-calling'; 
import { DeepNoiseSuppressionEffect } from '@azure/communication-calling-effects'; 

// Get the LocalAudioStream from the localAudioStream collection on the call object
// 'call' here represents the call object.
const localAudioStreamInCall = call.localAudioStreams[0];

// Get the audio effects feature API from LocalAudioStream
const audioEffectsFeatureApi = localAudioStreamInCall.feature(SDK.Features.AudioEffects);

// Subscribe to useful events that show audio effects status
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

At anytime if you want to check what **noise suppression** effects are currently active, you can use the `activeEffects` property.
The `activeEffects` property returns an object with the names of the current active effects.
```js
// Using the audio effects feature api
const currentActiveEffects = audioEffectsFeatureApi.activeEffects;
```

### Start a call with Noise Suppression enabled
To start a call with **noise suppression** turned on, you can create a new `LocalAudioStream` with a `AudioDeviceInfo` (the LocalAudioStream source <u>shouldn't</u> be a raw `MediaStream` to use audio effects), and pass it in the `CallStartOptions.audioOptions`:
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
```

### How to turn on Noise Suppression during an ongoing call
There are situations where a user might start a call and not have **noise suppression** turned on, but their current environment might get noisy resulting in them needing to turn on **noise suppression**. To turn on **noise suppression**, you can use the `audioEffectsFeatureApi.startEffects` API.
```js
// Create the noise supression instance 
const deepNoiseSuppression = new DeepNoiseSuppressionEffect();

// Its recommened to check support for the effect in the current environment using the isSupported method on the feature API. Remember that Noise Supression is only supported on Desktop Browsers for Chrome and Edge
const isDeepNoiseSuppressionSupported = await audioEffectsFeatureApi.isSupported(deepNoiseSuppression);
if (isDeepNoiseSuppressionSupported) {
    console.log('Noise supression is supported in browser environment');
}

// To start ACS Deep Noise Suppression,
await audioEffectsFeatureApi.startEffects({
    noiseSuppression: deepNoiseSuppression
});

// To stop ACS Deep Noise Suppression
await audioEffectsFeatureApi.stopEffects({
    noiseSuppression: true
});
```
