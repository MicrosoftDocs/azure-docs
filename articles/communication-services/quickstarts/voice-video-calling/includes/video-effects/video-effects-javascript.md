---
title: Quickstart - Add video effects to your video calls (Web)
titleSuffix: An Azure Communication Services quickstart
description: Learn how to add video effects in your video calls using Azure Communication Services.
author: sloanster

ms.author: micahvivion
ms.date: 02/14/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

The Video effects feature allows users to incorporate visual effects into their video calls, providing developers with the ability to integrate background visual effects and background video replacement into their calling experience. Background blur offers users a way to eliminate distractions behind them, facilitating communication without disruptive activities or confidential information appearing in the background. This is helpful in telehealth contexts, where providers or patients may wish to obscure their surroundings to protect sensitive or personally identifiable information. Background blur can be applied across various virtual appointment scenarios, such as telebanking and virtual hearings, to enhance user privacy or to hide a messy office. In addition to improving confidentiality, background blur enables greater creative expression by allowing users to upload custom backgrounds for a more engaging and personalized calling experience.lows for more creativity of expression, allowing users to upload custom backgrounds to host a more fun, personalized calling experience.

> [!NOTE]
> The calling effect library can't be used standalone and can only work when used with the Azure Communication Calling client library for WebJS (https://www.npmjs.com/package/@azure/communication-calling). 

## Using video effects
### Install the package
> [!IMPORTANT]
> Background blur and background replacement for **Web Desktop browsers** is in GA availability. This quickstart uses the Azure Communication Services Calling SDK version of `1.13.1` (or greater) and the Azure Communication Services Calling Effects SDK version greater than or equal to `1.0.1`. Currently desktop browser support for creating video background effects is only supported on Chrome and Edge Desktop Browser (Windows and Mac) and Mac Safari Desktop.


> [!NOTE]
> Background blur and background replacement for **Android Chrome and Android Edge mobile browser** is available in public preview starting in build [1.29.1](https://github.com/Azure/Communication/blob/master/releasenotes/acs-javascript-calling-library-release-notes.md#1291-beta1-2024-08-26) and later beta WebJS SDK versions.

Use the `npm install` command to install the Azure Communication Services Effects SDK for JavaScript.

```console
npm install @azure/communication-calling-effects --save
```
For more information, see [here](https://www.npmjs.com/package/@azure/communication-calling-effects) for more details on the calling communication effects npm package page.

> [!NOTE]
> Currently there are two available video effects:
> - Background blur
> - Background replacement with an image (the aspect ratio should be 16:9 to be compatible)

To use video effects with the Azure Communication Calling SDK, once you create a `LocalVideoStream`, you need to get the `VideoEffects` feature API of the `LocalVideoStream` to start/stop video effects:
```js
import * as AzureCommunicationCallingSDK from '@azure/communication-calling'; 

import { BackgroundBlurEffect, BackgroundReplacementEffect } from '@azure/communication-calling-effects'; 

// Get the video effects feature API on the LocalVideoStream 
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

// Recommended: Check support by using the isSupported method on the feature API
const backgroundBlurSupported = await videoEffectsFeatureApi.isSupported(backgroundBlurEffect);

if (backgroundBlurSupported) { 
    // Use the video effects feature API we created to start effects
    await videoEffectsFeatureApi.startEffects(backgroundBlurEffect); 
}
```


### Background replacement with an image
You need to provide the URL of the image you want as the background to this effect.
> [!IMPORTANT]
> The `startEffects` method fails if the URL isn't of an image or is unreachable/unreadable.
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

// Recommended: Check support by using the isSupported method on the feature API
const backgroundReplacementSupported = await videoEffectsFeatureApi.isSupported(backgroundReplacementEffect);

if (backgroundReplacementSupported) { 
    // Use the video effects feature API as before to start/stop effects 
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

Switching effects can be done using the same method on the video effects feature API:
```js
// Switch to background blur 
await videoEffectsFeatureApi.startEffects(backgroundBlurEffect); 

// Switch to background replacement 
await videoEffectsFeatureApi.startEffects(backgroundReplacementEffect);
```

At any time if you want to check what effects are active, you can use the `activeEffects` property.
The `activeEffects` property returns an array with the names of the current active effects, and returns an empty array if there are no effects active.
```js
// Using the video effects feature API
const currentActiveEffects = videoEffectsFeatureApi.activeEffects;
```

To stop effects:
```js
await videoEffectsFeatureApi.stopEffects();
```

### Add a frosted glass background effect
Frosted glass backgrounds combine the privacy of a blurred background with the customization of your selected image to produce a sophisticated effect resembling frosted glass windows. To achieve this effect, upload a transparent PNG image as your custom background. This image could be your company logo or a unique design. The frosted glass effect blurs the transparent areas of your image, while preserving the graphic as part of the background. To use a frosted glass appearance, you must use version `1.1.3` or higher of the [Azure Communication Calling Effects library for JavaScript](https://www.npmjs.com/package/@azure/communication-calling-effects) package.

For best results when preparing the frosted PNG image, keep in mind:

* **Resolution**: Use 1920x1080 pixels for a high-quality background
* **Avoid full opacity**: Colored content such as logos looks best with a little transparency. We recommend 75% opacity
* **Defocus the image**: A Gaussian blur of radius 2 works well to simulate a bit of depth of field in the scene.
* **Stencil mid-gray foreground**: For grayscale PNG with transparency, we recommend having the full image in mid-gray (value 128) so that the transparency pattern is visible on both light and dark backgrounds.