---
title: Verify if an application is active in multiple tabs of a browser
titleSuffix: An Azure Communication Services how-to guide
description: Learn how to detect if an application is active in multiple tabs of a browser using the Azure Communication Services Calling SDK for JavaScript
author: csandjon
ms.author: csandjon
ms.date: 10/17/2022
ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: template-how-to, devx-track-js
---



# How to detect if an application using Azure Communication Services' SDK is active in multiple tabs of a browser

Based on best practices, your application should not connect to calls from multiple browser tabs simultaneously. Handling multiple calls on multiple tabs of a browser on mobile can cause undefined behavior due to resource allocation for microphone and camera on the device.
In order to detect if an application is active in multiple tabs of a browser, a developer can use the method `isCallClientActiveInAnotherTab` and the event `isCallClientActiveInAnotherTabChanged` of a `CallClient` instance.


```javascript
const callClient = new CallClient();
// Check if an application is active in multiple tabs of a browser
const isCallClientActiveInAnotherTab = callClient.feature(SDK.Features.DebugInfo).isCallClientActiveInAnotherTab;
...
// Subscribe to the event to listen for changes 
callClient.feature(Features.DebugInfo).on('isCallClientActiveInAnotherTabChanged', () => {
    // callback();
});
...
// Unsubscribe from the event to stop listening for changes 
callClient.feature(Features.DebugInfo).off('isCallClientActiveInAnotherTabChanged', () => {
    // callback();
});
```
