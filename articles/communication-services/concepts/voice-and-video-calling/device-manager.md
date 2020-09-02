---
title: SDK Fundamentals - Device Manager
description: TODO
author: mathowar
services: azure-communication-services

ms.author: mathowar
ms.date: 07/29/2020
ms.topic: conceptual
ms.service: azure-communication-services

---
# Calling SDK Concepts: Device Manager

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

## Overview

The device manager provides APIs for accessing cameras, microphones, and speakers that are connected to the computer or smartphone. With the device manager, you can enumerate your connected devices, set your default devices, listen for when a device is connected or disconnected, and render a preview of your local video. The device manager is automatically created on User login, and can be accessed from the `CallClientManager`.

## Setting a Microphone and Speaker

The device manager enables the user to choose default microphones and speakers. Make sure to use a value from the enumerated list as shown below.

### [JavaScript](#tab/javascript)
```typescript
/** Set the default microphone **/
// Enumerate all of the microphones
const microphoneDevices = this.state.callClient.deviceManager.getMicrophoneList();
// Set the first microphone in the list to be the default
this.state.callClient.deviceManager.setMicrophone(microphoneDevices[0]);

/** Set the default speaker **/
// Enumerate all of the speakers
const speakerDevices = this.state.callClient.deviceManager.getSpeakerList();
// Set the first speaker in the list to be the default
this.state.callClient.deviceManager.setSpeaker(speakerDevices[0]);
```

### [Android (Java)](#tab/java)

```java
/** Set the default microphone **/
// Enumerate all of the microphones
List<AudioDeviceInfo> microphones = deviceManager.getMicrophoneList();
// Set the first microphone in the list to be the default
deviceManager.setMicrophone(microphones.get(0));

/** Set the default speaker **/
// Enumerate all of the speakers
List<AudioDeviceInfo> speakers = deviceManager.getSpeakerList();
// Set the first speakers in the list to be the default
deviceManager.setSpeakers(speakers.get(0));
```

### [iOS (Swift)](#tab/swift)

```swift
//TODO
```

### [.NET](#tab/dotnet)

```cs
/** Set the default microphone **/
// Enumerate all of the microphones
IReadOnlyList<AudioDeviceInfo> microphones = deviceManager.GetMicrophoneList();
// Set the first microphone in the list to be the default
deviceManager.SetMicrophone(microphones.First());

/** Set the default speaker **/
// Enumerate all of the speakers
IReadOnlyList<AudioDeviceInfo> speakers = deviceManager.GetSpeakerList();
// Set the first speakers in the list to be the default
deviceManager.SetSpeakers(speakers.First());
```

## Subscribing to DevicesUpdated Events

code snippets for each platform

## Creating Preview Video

code snippets for each platform

## APIs

## next steps (quickstart on using DM/reading video rendering)

// might make sense to look at WebRTC DM
// how do events work (next steps)
