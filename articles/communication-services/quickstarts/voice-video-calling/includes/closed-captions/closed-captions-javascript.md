---
title: Get started with Azure Communication Services closed caption on web
titleSuffix: An Azure Communication Services quickstart document
description: Learn about the Azure Communication Services Closed Captions in web apps
author: RinaRish
manager: visho
services: azure-communication-services

ms.author: ektrishi
ms.date: 02/03/2022
ms.topic: include
ms.service: azure-communication-services
---

## Prerequisites

Refer to the [Voice Calling Quickstart](../../getting-started-with-calling.md?pivots=platform-web) to set up a sample app with voice calling.

## Models

| Name | Description |
| - | - |
| CaptionsCallFeature | API for call captions. |
| StartCaptionsOptions | Used for representing options to start closed captions |
| CaptionsHandler | Callback definition for handling the CaptionsReceivedEventType event. |
| CaptionsInfo | Data structure received for each CaptionsReceivedEventType event. |

## Methods

### Start captions

1. Get the ongoing call object established during the prerequisite steps.
2. Get the captions feature object.
3. Set the `captionsReceived` event handler via the `on` API.
4. Call `startCaptions` on the feature object with the desired options.
```js
const captionsHandler = (data: CaptionsInfo) => { /* USER CODE HERE - E.G. RENDER TO DOM */ };

try {
    const callCaptionsApi = call.feature(Features.Captions);
    callCaptionsApi.on('captionsReceived', captionsHandler);
    if (!callCaptionsApi.isCaptionsActive) {
        await callCaptionsApi.startCaptions({ spokenLanguage: 'en-us' });
    }
} catch (e) {
    console.log('Internal error occurred when Starting Captions');
}
```

### Stopping captions

1. Get the captions feature object.
2. Call `off` with the previous specified handler.

> [!NOTE]
> Captions will still be processed, but this client will stop handling them.

```js
const callCaptionsApi = call.feature(Features.Captions);
callCaptionsApi.off('captionsReceived', captionsHandler);
```

### Get available languages

Access the `availableLanguages` property on the `call.feature(Features.Captions)` API.

```js
const callCaptionsApi = call.feature(Features.Captions);
const availableLanguages = callCaptionsApi.availableLanguages;
```

### Update language

Pass a value in from the available languages array to ensure that the requested language is supported. 

```js
await callCaptionsApi.selectLanguage(availableLanguages[0]);
```

## Clean up

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.
Learn more about [cleaning up resources here.](../../../create-communication-resource.md?pivots=platform-azp&tabs=windows#clean-up-resources)
