---
title: Enable audio effects to improve audio quality
titleSuffix: An Azure Communication Services article
description: This article describes how to add audio effects in your calls using Azure Communication Services.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 06/28/2025
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

The Azure Communication Services audio effects features can significantly enhance your audio calls by filtering out unwanted background noise and removing echo. Noise suppression works by identifying and eliminating distracting sounds like traffic, typing, or chatter, making conversations clearer and easier to follow. At the same time, echo removal ensures your voice doesn’t bounce back during the call, reducing feedback and preventing interruptions. These technologies not only improve speech clarity but also reduce listener fatigue—especially in noisy environments. For instance, if you're on an Azure Communication Services WebJS call in a busy coffee shop, enabling these audio effects can create a smoother, more focused communication experience.

## 🎧 What Are Audio Effects?
Audio effects in ACS are real-time enhancements applied to microphone input during a call. The Azure Communications Services audio effects package has multiple abilities to remove unwanted sounds from a call (from a client perspective).

**Noise suppression** (sometimes called noise reduction) focuses on eliminating unwanted background sounds. Think typing sounds, fan hums, distant conversations, or street noise. Its job is to isolate your voice so that whoever is listening hears you more clearly, and reduce or remove the distracting background sounds. It uses algorithms trained to recognize the difference between your speech and ambient noise, then reduces or removes that noise in real time. These noises can  be considered a sound that isn't human voice.
Key traits that noise suppression enables:
- Removes continuous or predictable background noises.
- Enhance speech clarity.
- Typically works on the speaker’s end before sending out the audio.

**Echo cancellation** removes echo caused when your microphone picks up audio from your speakers. For example, when someone is on speakerphone and their microphone picks up your voice from their speaker, it can loop back to you as an echo. Echo cancellation predicts and subtracts this returning sound so you don’t hear yourself talking back a fraction of a second later.
Key traits for echo cancelation:
- Reduces acoustic feedback.
- Essential in open microphone and desktop setups where the microphone picks up audio output from a local speaker.
- Reduces listener fatigue and confusion caused by hearing your own voice returned.

## Use audio effects: Install the calling effects npm package

> [!IMPORTANT]
> **Noise Suppression** features are available in GA WebJS SDK version `1.28.4` or later, alongside the Azure Communication Services Calling Effects SDK version GA `1.1.2` or later. Alternatively, if you opt to use the public preview version, Calling SDK versions `1.24.2-beta.1` and later also support noise suppression.

> [!IMPORTANT]
> **Echo Cancellation** features are available in public preview SDK version [1.37.1](https://github.com/Azure/Communication/blob/master/releasenotes/acs-javascript-calling-library-release-notes.md#1371-beta1-2025-06-16). Also note that to use echo cancelation you must use public preview audio effects SDK version beta version [1.21.1-beta](https://www.npmjs.com/package/@azure/communication-calling-effects/v/1.2.1-beta.1) or later.

> [!NOTE]
> - Utilizing audio effects is available only on Chrome and Edge desktop browsers.

> [!NOTE]
> - The audio effects library isn't a standalone module and can't function independently. To utilize its capabilities the effects package must be integrated with the Azure Communication Services Calling client library for WebJS.
> - If you use the GA version of the Calling SDK, you must use the [GA version](https://www.npmjs.com/package/@azure/communication-calling-effects/v/latest) of the Calling audio effects package.

## Install the Audio Effects Package
Use the `npm install` command to install the Azure Communication Services Audio Effects SDK for JavaScript.

```console
@azure/communication-calling-effects/v/latest
```

If you use the **public preview** of the Calling SDK, you must use the [beta version](https://www.npmjs.com/package/@azure/communication-calling-effects/v/next) of the Calling Effects SDK. Use the `npm install` command to install the Azure Communication Services Audio Effects SDK for JavaScript.

```console 
@azure/communication-calling-effects/v/next
```

## Enable Audio Effects you wish to use
For information on the interface that details audio effects properties and methods, see the [Audio Effects Feature interface](/javascript/api/azure-communication-services/@azure/communication-calling/audioeffectsfeature?view=azure-communication-services-js&preserve-view=true) API documentation page.


### Initialize the Audio Effects Feature
To use audio effects within the Azure Communication Services Calling SDK, you need the `LocalAudioStream` property that's currently in the call. You need access to the `AudioEffects` API of the `LocalAudioStream` property to start and stop audio effects.

### Enable Noise Suppression
The following code snippet shows an example on how to enable **noise suppression** from within the WebJS environment.
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
### Enable Echo Cancellation
The following code snippet shows an example on how to enable **echo cancellation** from within the WebJS environment.
```js
import * as AzureCommunicationCallingSDK from '@azure/communication-calling'; 
import { EchoCancellationEffect } from '@azure/communication-calling-effects';

// Create the noise suppression instance 
const echoCancellationEffect = new EchoCancellationEffect();

// Get LocalAudioStream from the localAudioStream collection on the call object
// 'call' here represents the call object.
const localAudioStreamInCall = call.localAudioStreams[0];

// Get the audio effects feature API from LocalAudioStream
const audioEffectsFeatureApi = localAudioStreamInCall.feature(AzureCommunicationCallingSDK.Features.AudioEffects);

```
### Validate that the current browser environment supports audio effects
We recommend that you check support for the effect in the current browser environment by using the `isSupported` method on the feature API. Remember that audio effects are only supported on desktop browsers for Chrome and Edge.
```js

const deepNoiseSuppression = new DeepNoiseSuppressionEffect();
const echoCancellationEffect = new EchoCancellationEffect();

const isEchoCancellationSupported = await audioEffectsFeatureApi.isSupported(echoCancellationEffect);
if (isEchoCancellationSupported) {
    console.log('Echo Cancellation is supported in the current browser environment');
}

const isNoiseSuppressionSupported = await audioEffectsFeatureApi.isSupported(deepNoiseSuppression);
if (isNoiseSuppressionSupported) {
    console.log('Noise Suppression is supported in the current browser environment');
}
```

## Bring it all together: Load and start noise suppression and echo cancelation  
To initiate a call with noise suppression and echo cancelation enabled, create a new `LocalAudioStream` property using `AudioDeviceInfo`. Ensure that the `LocalAudioStream` source isn't set as a raw `MediaStream` property to support audio effects. Then, include this property within `CallStartOptions.audioOptions` when starting the call.

```js
import { EchoCancellationEffect, DeepNoiseSuppressionEffect } from '@azure/communication-calling-effects';

// Create the noise suppression instance 
const deepNoiseSuppression = new DeepNoiseSuppressionEffect();
// Create the noise suppression instance 
const echoCancellationEffect = new EchoCancellationEffect();

// Get LocalAudioStream from the localAudioStream collection on the call object
// 'call' here represents the call object.
const localAudioStreamInCall = call.localAudioStreams[0];

// Get the audio effects feature API from LocalAudioStream
const audioEffectsFeatureApi = localAudioStreamInCall.feature(AzureCommunicationCallingSDK.Features.AudioEffects);

// To start Communication Services Deep Noise Suppression
await audioEffectsFeatureApi.startEffects({
    echoCancellation: echoCancellationEffect,
    noiseSuppression: deepNoiseSuppression
}); 
```

## Turn on noise suppression during an ongoing call
You might start a call and not have noise suppression turned on. The end users room might get noisy so that they would need to turn on noise suppression. To turn on noise suppression, you can use the `audioEffectsFeatureApi.startEffects` interface.

```js
// Create the noise suppression instance 
const deepNoiseSuppression = new DeepNoiseSuppressionEffect();

// Get LocalAudioStream from the localAudioStream collection on the call object
// 'call' here represents the call object.
const localAudioStreamInCall = call.localAudioStreams[0];

// Get the audio effects feature API from LocalAudioStream
const audioEffectsFeatureApi = localAudioStreamInCall.feature(AzureCommunicationCallingSDK.Features.AudioEffects);

// We recommend that you check support for the effect in the current environment by using the isSupported method on the feature API. Remember that noise suppression is only supported on desktop browsers for Chrome and Edge.
const isDeepNoiseSuppressionSupported = await audioEffectsFeatureApi.isSupported(deepNoiseSuppression);
if (isDeepNoiseSuppressionSupported) {
    console.log('Noise suppression is supported in the current browser environment');
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
### To start or stop audio effects packages during an active  call
You might start a call and not have noise suppression turned on. The end users room might get noisy so that they would need to turn on noise suppression. To turn on noise suppression, you can use the `audioEffectsFeatureApi.startEffects` API.

#### To start Azure Communication Services  Noise Suppression
```js
await audioEffectsFeatureApi.startEffects({
    noiseSuppression: deepNoiseSuppression
});
```

#### To stop Azure Communication Services Deep Noise Suppression
```js
await audioEffectsFeatureApi.stopEffects({
    noiseSuppression: true
});
```

#### To start Azure Communication Services echo cancelation
```js
await audioEffectsFeatureApi.startEffects({
    noiseSuppression: echoCancellation
});
```

#### To stop Azure Communication Services echo cancelation
```js
await audioEffectsFeatureApi.stopEffects({
    echoCancellation: true
});
```

## Check what audio effects are active
To check what noise suppression effects are currently active, you can use the `activeEffects` property. The `activeEffects` property returns an object with the names of the current active effects.

```js
import { EchoCancellationEffect, DeepNoiseSuppressionEffect } from '@azure/communication-calling-effects';
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
## Best Practices
The Azure Communication Services WebJS audio effects package provides tools for reducing unwanted sounds. Other measures can be taken to improve audio quality, such as:
- Encouraging end users to consider using headphones to minimize the need for echo cancellation.
- Enabling noise suppression tin shared or open work environments.
- Setting noise suppression as the default option (i.e., having audio effects activated when a user initiates a call). If this feature is enabled automatically at the start of calls, users don't have to activate it manually. Enabling noise suppression and echo cancellation by default may help mitigate audio issues during calls.
- Test audio effects in different environments to optimize end user experience.

## Related content

See the [Audio Effects Feature interface](/javascript/api/azure-communication-services/@azure/communication-calling/audioeffectsfeature?view=azure-communication-services-js&preserve-view=true) documentation page for extended API feature details.
