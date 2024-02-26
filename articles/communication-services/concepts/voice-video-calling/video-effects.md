---
ms.author: micahvivion
title: Azure Communication Services Calling video WebJS video effects
titleSuffix: An Azure Communication Services document
description: In this document, you learn how to create video effects on an Azure Communication Services call.
author: sloanster
services: azure-communication-services

ms.date: 1/9/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Adding visual effects to a video call

[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

>[!IMPORTANT]
> The Calling Video effects are available starting on the public preview version [1.10.0-beta.1](https://www.npmjs.com/package/@azure/communication-calling/v/1.10.0-beta.1) of the Calling SDK. Please ensure that you use this or a newer SDK when using video effects.

> [!NOTE]
> This API is provided as a preview ('beta') for developers and may change based on feedback that we receive.

> [!NOTE]
> This library cannot be used standalone and can only work when used with the Azure Communication Calling client library for WebJS (https://www.npmjs.com/package/@azure/communication-calling).

> [!NOTE]
> Currently browser support for creating video background effects is only supported on Chrome and Edge Desktop Browser (Windows and Mac) and Mac Safari Desktop.

The Azure Communication Calling SDK allows you to create video effects that other users on a call are able to see. For example, for a user doing Azure Communication Services calling using the WebJS SDK you can now enable that the user can turn on background blur. When the background blur is enabled, a user can feel more comfortable in doing a video call that the output video just shows a user, and all other content is blurred.

## Prerequisites
### Install the Azure Communication Services Calling SDK
- An Azure account with an active subscription is required. See [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) on how to create an Azure account.
- [Node.js](https://nodejs.org/) active Long Term Support(LTS) versions are recommended.
- An active Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A User Access Token to instantiate a call client. Learn how to [create and manage user access tokens](../../quickstarts/identity/access-tokens.md). You can also use the Azure CLI and run the command with your connection string to create a user and an access token. (Need to grab connection string from the resource through Azure portal.)
- Azure Communication Calling client library is properly set up and configured (https://www.npmjs.com/package/@azure/communication-calling).

An example using the Azure CLI to
```azurecli-interactive
az communication identity token issue --scope voip --connection-string "yourConnectionString"
```
For details on using the CLI, see [Use Azure CLI to Create and Manage Access Tokens](../../quickstarts/identity/access-tokens.md?pivots=platform-azcli).

## Install the Calling effects SDK 
Use ‘npm install’ command to install the Azure Communication Calling Effects SDK for JavaScript. 

```console
npm install @azure/communication-calling-effects --save
```
For more details on the calling communication effects, visit the [npm package page](https://www.npmjs.com/package/@azure/communication-calling-effects).

## Supported video effects:
Currently the video effects support the following ability:
- Background blur 
- Replace the background with a custom image 

## Class model:

| Name  | Description  |
|---|---|
| BackgroundBlurEffect  | The background blur effect class.  |
| BackgroundReplacementEffect  | The background replacement with image effect class.  |

To use video effects with the Azure Communication Calling client library, once you've created a LocalVideoStream, you need to get the VideoEffects feature API of from the LocalVideoStream. 

### Code examples
```js
import * as AzureCommunicationCallingSDK from '@azure/communication-calling'; 
import { BackgroundBlurEffect, BackgroundReplacementEffect } from '@azure/communication-calling-effects'; 

// Ensure you have initialized the Azure Communication Calling client library and have created a LocalVideoStream 

// Get the video effects feature api on the LocalVideoStream 
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

// Create the effect instance 
const backgroundBlurEffect = new BackgroundBlurEffect(); 

// Recommended: Check if backgroundBlur is supported
const backgroundBlurSupported = await backgroundBlurEffect.isSupported(); 

if (backgroundBlurSupported) { 
    // Use the video effects feature api we created to start/stop effects 
    await videoEffectsFeatureApi.startEffects(backgroundBlurEffect); 
} 

 
/** 
To create a background replacement with a custom image you need to provide the URL of the image you want as the background to this effect. The 'startEffects' method will fail if the URL is not of an image or is unreachable/unreadable. 

Supported image formats are – png, jpg, jpeg, tiff, bmp. 
*/ 

const backgroundImage = 'https://linkToImageFile'; 

// Create the effect instance 
const backgroundReplacementEffect = new BackgroundReplacementEffect({ 
    backgroundImageUrl: backgroundImage 
}); 

// Recommended: Check if background replacement is supported:
const backgroundReplacementSupported = await backgroundReplacementEffect.isSupported(); 

if (backgroundReplacementSupported) { 
    // Use the video effects feature api as before to start/stop effects 
    await videoEffectsFeatureApi.startEffects(backgroundReplacementEffect); 
} 

//You can change the image used for this effect by passing it in the a new configure method: 

const newBackgroundImage = 'https://linkToNewImageFile';
await backgroundReplacementEffect.configure({ 
    backgroundImageUrl: newBackgroundImage 
}); 

//You can switch the effects using the same method on the video effects feature api: 

// Switch to background blur 
await videoEffectsFeatureApi.startEffects(backgroundBlurEffect); 


// Switch to background replacement 
await videoEffectsFeatureApi.startEffects(backgroundReplacementEffect); 

//To stop effects: 
await videoEffectsFeatureApi.stopEffects();

```
