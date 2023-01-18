---
title: Quickstart - Add volume indicator to your Web calling app
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to add raw media access calling capabilities to your app using Azure Communication Services.
author: sloanster

ms.author: micahvivion
ms.date: 1/18/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

As a developer you can have control over checking microphone volume in Javascript

## Prerequisites
[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

>[!IMPORTANT]
> The quick start examples here are available starting on the public preview version [1.9.1-beta.1](https://www.npmjs.com/package/@azure/communication-calling/v/1.9.1-beta.1) of the calling Web SDK. Make sure to use that version or newer when trying this quickstart.

## Checking the audio stream olume
### Description

As a developer it can be nice to have the ability to check the microphone volume in Javascript. This quickstart shows examples of how to do this in ACS WebJS.

#### Architecture
##### Pre/Post Call
ACS Already has raw audio stream access api built over TsCall on Device Manager this can be used to expose audio gain for precall/incall Microphone volume.
```javascript
export interface LocalAudioStream {
    getMediaStreamTrack(): Promise<MediaStreamTrack>;
    switchSource(source: AudioDeviceInfo | MediaStreamTrack): Promise<void>;
    dispose();
}
export interface RemoteAudioStream {
    getMediaStreamTrack(): Promise<MediaStreamTrack>;
}
```
ACS will expose another API on local and remote audio streams to get Microphone volume built over Raw Audio access API, to get Volume (gain) of selected Microphone
```javascript
export interface LocalAudioStream {
     getVolume(): Promise<Volume>;
...
}

export interface RemoteAudioStream {
     getVolume(): Promise<Volume>;
...
}

export interface Volume extends Disposable{				
      off(event: 'levelChanged', listener: PropertyChangedEvent): void;		
      on(event: 'levelChanged', listener: PropertyChangedEvent): void;
      readonly level: number;		
  }
```
The volume is a number ranging from 0 to 100
It's sampled every 200ms to get near realtime value of volume
####  Example usage
Sample code to get volume of selected microphone

need call getVolume on audioSourceChanged for local audio stream

```javascript

const volumeIndicator = await new SDK.LocalAudioStream(deviceManager.selectedMicrophone).getVolume();
volumeIndicator.on('levelChanged', ()=>{
    console.log(`Volume is ${volumeIndicator.level}`)
})


const remoteAudioStream = call.remoteAudioStreams[0];
const volumeIndicator = await remoteAudioStream.getVolume();
volumeIndicator.on('levelChanged', ()=>{
    console.log(`Volume is ${volumeIndicator.level}`)
})

```

#### Telemetry for localAudioStream
best effort to send telemetry, from localAudioStream
if call client is not initialized before LocalAudioStream, no telemetry will be sent

For MediaStreamTrack telemetry only from the first created call client will be sent
cc1, new local stream ... everything works fine
cc1, new local stream gets latched to telemetry logger from cc1, cc2, new local stream will not send data
