---
title: Quickstart - Add volume indicator to your Web calling app
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to check call volume within your Web app when using Azure Communication Services.
author: sloanster

ms.author: micahvivion
ms.date: 1/18/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

# Accessing call volume level
As a developer you can have control over checking microphone volume in JavaScript. This quickstart shows examples of how to accomplish this within the Azure Communication Services WebJS.

## Prerequisites
>[!IMPORTANT]
> The quick start examples here are available starting in version [1.13.1](https://www.npmjs.com/package/@azure/communication-calling/v/1.13.1) of the calling Web SDK. Make sure to use that SDK version or newer when trying this quickstart.

## Checking the audio stream volume
As a developer it can be nice to have the ability to check and display to end users the current local microphone volume or the incoming microphone level. Azure Communication Services calling API exposes this information using `getVolume`. The `getVolume` value is a number ranging from 0 to 100 (with 0 noting zero audio detected, 100 as the max level detectable). This value is sampled every 200 ms to get near real time value of volume level.

### Example usage
This example shows how to generate the volume level by accessing `getVolume` of the local audio stream and of the remote incoming audio stream.

```javascript
//Get the volume of the local audio source
const volumeIndicator = await new SDK.LocalAudioStream(deviceManager.selectedMicrophone).getVolume();
volumeIndicator.on('levelChanged', ()=>{
    console.log(`Volume is ${volumeIndicator.level}`)
})

//Get the volume level of the remote incoming audio source
const remoteAudioStream = call.remoteAudioStreams[0];
const volumeIndicator = await remoteAudioStream.getVolume();
volumeIndicator.on('levelChanged', ()=>{
    console.log(`Volume is ${volumeIndicator.level}`)
})
```

For a more detailed code sample on how to create a UI display to show the local and current incominng audio level please see [here](https://github.com/Azure-Samples/communication-services-web-calling-tutorial/blob/2a3548dd4446fa2e06f5f5b2c2096174500397c9/Project/src/MakeCall/VolumeVisualizer.js).

