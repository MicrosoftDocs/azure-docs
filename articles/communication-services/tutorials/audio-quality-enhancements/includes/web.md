---
title: 'Tutorial: Add audio noise suppression ability to your web calls' 
titleSuffix: An Azure Communication Services tutorial on how to enable advanced noise suppression
description: Learn how to add audio effects in your calls by using Azure Communication Services.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 11/05/2024
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

The Azure Communication Services audio effects *noise suppression* abilities can improve your audio calls by filtering out unwanted background noises. Noise suppression is a technology that removes background noises from audio calls. Eliminating background noise makes it easier to talk and listen. Noise suppression can also reduce distractions and tiredness caused by noisy places. For example, if you're taking an Azure Communication Services WebJS call in a noisy coffee shop, turning on noise suppression can make the call experience better.

## Use audio effects: Install the calling effects npm package

> [!IMPORTANT]
> This tutorial employs the Azure Communication Services Calling SDK version `1.28.4` or later, alongside the Azure Communication Services Calling Effects SDK version `1.1.2` or later. The general availability (GA) stable version `1.28.4` and later of the Calling SDK support noise suppression features. Alternatively, if you opt to use the public preview version, Calling SDK versions `1.24.2-beta.1` and later also support noise suppression.
> 
> Current browser support for adding audio noise suppression effects is available only on Chrome and Edge desktop browsers.

The calling effects library can't be used standalone. It works only when used with the Azure Communication Services Calling client library for WebJS.

Use the `npm install` command to install the Azure Communication Services Audio Effects SDK for JavaScript.

If you use the GA version of the Calling SDK, you must use the [GA version](https://www.npmjs.com/package/@azure/communication-calling-effects/v/latest) of the Calling Effects SDK.

```console
@azure/communication-calling-effects/v/latest
```

If you use the public preview of the Calling SDK, you must use the [beta version](https://www.npmjs.com/package/@azure/communication-calling-effects/v/next) of the Calling Effects SDK.

```console
@azure/communication-calling-effects/v/next
```

## Load the noise suppression effects library

For information on the interface that details audio effects properties and methods, see the [Audio Effects Feature interface](/javascript/api/azure-communication-services/@azure/communication-calling/audioeffectsfeature?view=azure-communication-services-js&preserve-view=true) API documentation page.

To use noise suppression audio effects within the Azure Communication Services Calling SDK, you need the `LocalAudioStream` property that's currently in the call. You need access to the `AudioEffects` API of the `LocalAudioStream` property to start and stop audio effects.

```js
import * as AzureCommunicationCallingSDK from '@azure/communication-calling'; 
import { DeepNoiseSuppressionEffect } from '@azure/communication-calling-effects'; 

// Get LocalAudioStream from the localAudioStream collection on the call object.
// 'call' here represents the call object.
const localAudioStreamInCall = call.localAudioStreams[0];

// Get the audio effects feature API from LocalAudioStream
const audioEffectsFeatureApi = localAudioStreamInCall.feature(AzureCommunicationCallingSDK.Features.AudioEffects);

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

## Check what audio effects are active

To check what noise suppression effects are currently active, you can use the `activeEffects` property.

The `activeEffects` property returns an object with the names of the current active effects.

```js
// Use the audio effects feature API.
const currentActiveEffects = audioEffectsFeatureApi.activeEffects;

// Create the noise suppression instance.
const deepNoiseSuppression = new DeepNoiseSuppressionEffect();
// We recommend that you check support for the effect in the current environment by using the isSupported API 
// method. Remember that noise supression is only supported on desktop browsers for Chrome and Edge.

const isDeepNoiseSuppressionSupported = await audioEffectsFeatureApi.isSupported(deepNoiseSuppression);
if (isDeepNoiseSuppressionSupported) {
    console.log('Noise supression is supported in local browser environment');
}

// To start Communication Services Deep Noise Suppression
await audioEffectsFeatureApi.startEffects({
    noiseSuppression: deepNoiseSuppression
});

// To stop Communication Services Deep Noise Suppression
await audioEffectsFeatureApi.stopEffects({
    noiseSuppression: true
});

```

## Start a call with noise suppression automatically enabled

You can start a call with noise suppression turned on. Create a new `LocalAudioStream` property with `AudioDeviceInfo` (the `LocalAudioStream` source *shouldn't* be a raw `MediaStream` property to use audio effects), and pass it in `CallStartOptions.audioOptions`:

```js
// As an example, here we're simply creating LocalAudioStream by using the current selected mic on DeviceManager.
const audioDevice = deviceManager.selectedMicrophone;
const localAudioStreamWithEffects = new AzureCommunicationCallingSDK.LocalAudioStream(audioDevice);
const audioEffectsFeatureApi = localAudioStreamWithEffects.feature(AzureCommunicationCallingSDK.Features.AudioEffects);

// Start effect
await audioEffectsFeatureApi.startEffects({
    noiseSuppression: deepNoiseSuppression
});

// Pass LocalAudioStream in audioOptions in call start/accept options.
await call.startCall({
    audioOptions: {
        muted: false,
        localAudioStreams: [localAudioStreamWithEffects]
    }
});
```

## Turn on noise suppression during an ongoing call

You might start a call and not have noise suppression turned on. The environment might get noisy so that you need to turn on noise suppression. To turn on noise suppression, you can use the `audioEffectsFeatureApi.startEffects` API.

```js
// Create the noise supression instance 
const deepNoiseSuppression = new DeepNoiseSuppressionEffect();

// Get LocalAudioStream from the localAudioStream collection on the call object
// 'call' here represents the call object.
const localAudioStreamInCall = call.localAudioStreams[0];

// Get the audio effects feature API from LocalAudioStream
const audioEffectsFeatureApi = localAudioStreamInCall.feature(AzureCommunicationCallingSDK.Features.AudioEffects);

// We recommend that you check support for the effect in the current environment by using the isSupported method on the feature API. Remember that noise supression is only supported on desktop browsers for Chrome and Edge.
const isDeepNoiseSuppressionSupported = await audioEffectsFeatureApi.isSupported(deepNoiseSuppression);
if (isDeepNoiseSuppressionSupported) {
    console.log('Noise supression is supported in the current browser environment');
}

// To start Communication Services Deep Noise Suppression
await audioEffectsFeatureApi.startEffects({
    noiseSuppression: deepNoiseSuppression
});

// To stop Communication Services Deep Noise Suppression
await audioEffectsFeatureApi.stopEffects({
    noiseSuppression: true
});
```

## Related content

See the [Audio Effects Feature interface](/javascript/api/azure-communication-services/@azure/communication-calling/audioeffectsfeature?view=azure-communication-services-js&preserve-view=true) documentation page for extended API feature details.
