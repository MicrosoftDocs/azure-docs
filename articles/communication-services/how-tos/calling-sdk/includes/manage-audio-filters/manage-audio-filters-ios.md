---
author: zehangzheng
ms.service: azure-communication-services
ms.topic: include
ms.date: 10/6/2023
ms.author: zehangzheng
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-ios.md)]

The audio filter feature allows different audio preprocessing options to be applied to outgoing audio. There are two types of audio filters: `OutgoingAudioFilters` and `LiveOutgoingAudioFilters`, with `OutgoingAudioFilters` changing settings before the call starts and `LiveOutgoingAudioFilters` changing settings while a call is in progress.

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

`LiveOutgoingAudioFilters` can be applied after a call has started. You can retrieve this object from the call object once the call has started. To change the setting in `LiveOutgoingAudioFilters`, set the members inside the class to a valid value and they're applied.

Only a subset of the filters available from `OutgoingAudioFilters` are available during an active call: music mode, echo cancellation, and noise suppression mode.

```swift
LiveOutgoingAudioFilters filters = call.liveOutgoingAudioFilters
filters.musicModeEnabled = true
filters.acousticEchoCancellationEnabled = true
filters.NoiseSuppressionMode = NoiseSuppressionMode.high
```
