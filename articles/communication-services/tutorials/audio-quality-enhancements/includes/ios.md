---
title: Tutorial - Add audio effects suppression ability to your iOS apps
titleSuffix: An Azure Communication Services tutorial on how to enable audio effects
description: Learn how to add audio effects in your calls using Azure Communication Services.
author: zehangzheng

services: azure-communication-services
ms.date: 10/6/2023
ms.author: zehangzheng
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

[!INCLUDE [Audio filters options](./native-audio-filters.md)]

[!INCLUDE [Install SDK](../../../how-tos/calling-sdk/includes/install-sdk/install-sdk-ios.md)]

The audio filter feature enables you to apply different audio preprocessing options to outgoing audio. There are two types of audio filters: `OutgoingAudioFilters` and `LiveOutgoingAudioFilters`. Use `OutgoingAudioFilters` to change settings before the call starts and `LiveOutgoingAudioFilters` to change settings while a call is in progress.

You first need to import the Calling SDK:

```swift
import AzureCommunicationCalling
```

## Before call starts

`OutgoingAudioFilters` can be applied when a call starts. 

Begin by creating a `OutgoingAudioFilters` and passing it into OutgoingAudioOptions as shown in the following code:

```swift
let outgoingAudioOptions = OutgoingAudioOptions()
let filters = OutgoingAudioFilters()
filters.NoiseSuppressionMode = NoiseSuppressionMode.high
filters.analogAutomaticGainControlEnabled = true
filters.digitalAutomaticGainControlEnabled = true
filters.musicModeEnabled = true
filters.acousticEchoCancellationEnabled = true
outgoingAudioOptions.audioFilters = filters
```

## During the call

You can apply `LiveOutgoingAudioFilters` after a call begins. You can retrieve this object from the call object during the call. To change the setting in `LiveOutgoingAudioFilters`, set the members inside the class to a valid value and they're applied.

Only a subset of the filters available from `OutgoingAudioFilters` are available during an active call: music mode, echo cancellation, and noise suppression mode.

```swift
LiveOutgoingAudioFilters filters = call.liveOutgoingAudioFilters
filters.musicModeEnabled = true
filters.acousticEchoCancellationEnabled = true
filters.NoiseSuppressionMode = NoiseSuppressionMode.high
```
