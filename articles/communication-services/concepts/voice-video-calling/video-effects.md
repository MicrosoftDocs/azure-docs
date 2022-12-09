---
ms.author: sloanster
title: Azure Communication Services Calling video WebJS video effects
titleSuffix: An Azure Communication Services document
description: In this document you'll learn how to create video effects on a Azure Communication Services call.
author: sloanster
services: azure-communication-services

ms.date: 12/9/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Adding visual effects to a Video call

[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

The Azure Communication Calling SDK allows you to create video effects that other viewsers on a call will be able to see.

> [!NOTE]
> This library cannot be used standalone and can only work when used with the Azure Communication Calling client library for WebJS (https://www.npmjs.com/package/@azure/communication-calling). 
 

## Prerequisites
### Install the Azure Communication Services Calling SDK
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) active Long Term Support(LTS) versions are recommended.
- An active Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A User Access Token to instantiate a call client. Learn how to [create and manage user access tokens](../../quickstarts/access-tokens.md). You can also use the Azure CLI and run the command below with your connection string to create a user and an access token. (Need to grab connection string from the resource through Azure portal.)
- Azure Communication Calling client library set up (https://www.npmjs.com/package/@azure/communication-calling).

```azurecli-interactive
az communication identity token issue --scope voip --connection-string "yourConnectionString"
```
For details on using the CLI see [Use Azure CLI to Create and Manage Access Tokens](../../quickstarts/access-tokens.md?pivots=platform-azcli).


>[!IMPORTANT]
> The Calling Video effects are available starting on the public preview version [1.9.1-beta.1](https://www.npmjs.com/package/@azure/communication-calling/v/1.9.1-beta.1) of the Calling SDK. Make sure to use that version when trying the instructions below.

## Install the Calling effects SDK 
Use ‘npm install’ command to install the Azure Communication Calling Effects SDK for JavaScript. 

'npm install @azure/communication-calling-effects –save'

### Supported video effects: 
- Background blur 
- Background replacement with image 


Class model: 


Name 

Description 

BackgroundBlur 

The background blur effect class. 

BackgroundReplacement 

The background replacement with image effect class. 

 

Browser Support: 

[Add browser support table. Currently we only support desktop safari and chromium browsers.] 

 

To use video effects with the Azure Communication Calling client library, once you have created a LocalVideoStream, you need to get the VideoEffects feature API of the LocalVideoStream. 

 

import * as AzureCommunicationCallingSDK from '@azure/communication-calling'; 

import { BackgroundBlur, BackgroundReplacement } from '@azure/communication-calling-effects'; 

 

/** Assuming you have initialized the Azure Communication Calling client library and have created a LocalVideoStream 

(reference <link to main SDK npm>) 

*/ 

 

// Get the video effects feature api on the LocalVideoStream 

const videoEffectsFeatureApi = localVideoStream.features(AzureCommunicationCallingSDK.Features.VideoEffects); 

 

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

 

 

// Create the effect instance 

const backgroundBlurEffect = new BackgroundBlur(); 

 

// Recommended: Check support 

const backgroundBlurSupported = await backgroundBlurEffect.isSupported(); 

 

if (backgroundBlurSupported) { 

    // Use the video effects feature api we created to start/stop effects 

    await videoEffectsFeatureApi.startEffects(backgroundBlurEffect); 

} 

 

 

/** 

For background replacement with image: 

You need to provide the URL of the image you want as the background to this effect. 

The 'startEffects' method will fail if the URL is not of an image or is unreachable/unreadable. 

Supported image formats are – png, jpg, jpeg, tiff, bmp. 

*/ 

 

const backgroundImage = 'https://linkToImageFile'; 

 

// Create the effect instance 

const backgroundReplacementEffect = new BackgroundReplacement({ 

    backgroundImageUrl: backgroundImage 

}); 

 

// Recommended: Check support 

const backgroundReplacementSupported = await backgroundReplacementEffect.isSupported(); 

 

if (backgroundReplacementSupported) { 

    // Use the video effects feature api as before to start/stop effects 

    await videoEffectsFeatureApi.startEffects(backgroundReplacementEffect); 

} 

 

You can change the image for this effect by passing it in in the configure method: 

const newBackgroundImage = 'https://linkToNewImageFile'; 

await backgroundReplacementEffect.configure({ 

    backgroundImageUrl: newBackgroundImage 

}); 

 

You can switch the effects using the same method on the video effects feature api: 

 

// Switch to background blur 

await videoEffectsFeatureApi.startEffects(backgroundBlurEffect); 

 

// Switch to background replacement 

await videoEffectsFeatureApi.startEffects(backgroundReplacementEffect); 

 

To stop effects: 

 

await videoEffectsFeatureApi.stopEffects(); 
