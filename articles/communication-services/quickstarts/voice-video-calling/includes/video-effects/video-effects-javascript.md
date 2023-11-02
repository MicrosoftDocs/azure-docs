---
title: Quickstart - Add video effects to your video calls (Web)
titleSuffix: An Azure Communication Services quickstart
description: Learn how to add video effects in your video calls using Azure Communication Services.
author: sloanster

ms.author: micahvivion
ms.date: 01/20/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

You can use the Video effects feature to add effects to your video in video calls. This feature enables developers to build background visual effects and background video replacement into the calling experience. Background blur provides users with the mechanism to remove distractions behind a participant so that participants can communicate without disruptive activity or confidential information in the background. This is especially useful the context of telehealth, where a provider or patient might want to obscure their surroundings to protect sensitive information or personally identifiable information. Background blur can be applied across all virtual appointment scenarios, including telebanking and virtual hearings, to protect user privacy. In addition to enhanced confidentiality, background blur allows for more creativity of expression, allowing users to upload custom backgrounds to host a more fun, personalized calling experience.

> [!NOTE]
> The calling effect library cannot be used standalone and can only work when used with the Azure Communication Calling client library for WebJS (https://www.npmjs.com/package/@azure/communication-calling). 

## Using video effects
### Install the package
Use the `npm install` command to install the Azure Communication Services Effects SDK for JavaScript.
> [!IMPORTANT]
> This quickstart uses the Azure Communication Services Calling SDK version of `1.13.1` (or greater) and the Azure Communication Services Calling Effects SDK version greater than or equil to `1.0.1`.
```console
npm install @azure/communication-calling-effects --save
```
See [here](https://www.npmjs.com/package/@azure/communication-calling-effects) for more details on the calling commmunication effects npm package page.

> [!NOTE]
> Currently browser support for creating video background effects is only supported on Chrome and Edge Desktop Browser (Windows and Mac) and Mac Safari Desktop.

> [!NOTE]
> Currently there are two available video effects:
> - Background blur
> - Background replacement with an image (the aspect ratio should be 16:9 to be compatible)

To use video effects with the Azure Communication Calling SDK, once you've created a `LocalVideoStream`, you need to get the `VideoEffects` feature API of the `LocalVideoStream` to start/stop video effects:
```js
import * as AzureCommunicationCallingSDK from '@azure/communication-calling'; 

import { BackgroundBlurEffect, BackgroundReplacementEffect } from '@azure/communication-calling-effects'; 

// Get the video effects feature api on the LocalVideoStream 
// (here, localVideoStream is the LocalVideoStream object you created while setting up video calling)
const videoEffectsFeatureApi = localVideoStream.feature(AzureCommunicationCallingSDK.Features.VideoEffects); 


// Subscribe to useful events 
videoEffectsFeatureApi.on(‘effectsStarted’, () => { 
    // Effects started
});

videoEffectsFeatureApi.on(‘effectsStopped’, () => { 
    // Effects stopped
}); 

videoEffectsFeatureApi.on(‘effectsError’, (error) => { 
    // Effects error
});
```

### Background blur
```js
// Create the effect instance 
const backgroundBlurEffect = new BackgroundBlurEffect(); 

// Recommended: Check support 
const backgroundBlurSupported = await backgroundBlurEffect.isSupported(); 

if (backgroundBlurSupported) { 
    // Use the video effects feature api we created to start effects
    await videoEffectsFeatureApi.startEffects(backgroundBlurEffect); 
}
```

### Background replacement with an image
You need to provide the URL of the image you want as the background to this effect.
> [!IMPORTANT]
> The `startEffects` method will fail if the URL is not of an image or is unreachable/unreadable.
>

> [!NOTE]
> Current supported image formats are: png, jpg, jpeg, tiff, bmp.
>
> Current supported aspect ratio is 16:9.

```js
const backgroundImage = 'https://linkToImageFile'; 

// Create the effect instance 
const backgroundReplacementEffect = new BackgroundReplacementEffect({ 
    backgroundImageUrl: backgroundImage
}); 

// Recommended: Check support
const backgroundReplacementSupported = await backgroundReplacementEffect.isSupported(); 

if (backgroundReplacementSupported) { 
    // Use the video effects feature api as before to start/stop effects 
    await videoEffectsFeatureApi.startEffects(backgroundReplacementEffect); 
}
```

Changing the image for this effect can be done by passing it via the configure method:
```js
const newBackgroundImage = 'https://linkToNewImageFile'; 

await backgroundReplacementEffect.configure({ 
    backgroundImageUrl: newBackgroundImage
});
```

Switching effects can be done using the same method on the video effects feature api:
```js
// Switch to background blur 
await videoEffectsFeatureApi.startEffects(backgroundBlurEffect); 

// Switch to background replacement 
await videoEffectsFeatureApi.startEffects(backgroundReplacementEffect);
```

At anytime if you want to check what effects are active, you can use the `activeEffects` property.
The `activeEffects` property returns an array with the names of the current active effects, and returns an empty array if there are no effects active.
```js
// Using the video effects feature api
const currentActiveEffects = videoEffectsFeatureApi.activeEffects;
```

To stop effects:
```js
await videoEffectsFeatureApi.stopEffects();
```
