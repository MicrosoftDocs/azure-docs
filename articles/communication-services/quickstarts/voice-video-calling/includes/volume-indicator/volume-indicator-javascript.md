---
title: Quickstart - Add volume indicator to your Web calling app
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you learn how to check call volume within your Web app when using Azure Communication Services.
author: sloanster

ms.author: micahvivion
ms.date: 07/28/2025
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

As a developer you can have control over checking microphone volume in JavaScript. This quickstart shows examples of how to accomplish it within the Azure Communication Services WebJS.

## Checking the audio stream volume
Developers may need to check and display the current local microphone volume or incoming microphone level to end users. The Azure Communication Services calling API provides access to this information through `getVolume`. The `getVolume` value is a number from 0 to 100, where 0 represents no audio detected and 100 is the maximum detectable level. This value is sampled every 200 ms to provide a near real-time measurement of the volume level. Microphone hardware can vary in sensitivity, which may result in different volume readings under similar environmental conditions.

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

For a more detailed code sample on how to create a UI display to show the local and current incoming audio level, see [here](https://github.com/Azure-Samples/communication-services-web-calling-tutorial/blob/2a3548dd4446fa2e06f5f5b2c2096174500397c9/Project/src/MakeCall/VolumeVisualizer.js).

