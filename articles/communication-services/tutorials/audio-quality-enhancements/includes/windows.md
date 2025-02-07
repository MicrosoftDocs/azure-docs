---
title: 'Tutorial: Add audio effects suppression ability to your Windows apps'
titleSuffix: An Azure Communication Services tutorial on how to enable audio effects
description: Learn how to add audio effects in your calls by using Azure Communication Services.
author: t-leejiyoon
ms.date: 07/28/2023
ms.author: t-leejiyoon
services: azure-communication-services
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

[!INCLUDE [Audio filters options](./native-audio-filters.md)]

[!INCLUDE [Install SDK](../../../how-tos/calling-sdk/includes/install-sdk/install-sdk-windows.md)]

You can use the audio filter feature to apply different audio preprocessing to outgoing audio. The two types of audio filters are `OutgoingAudioFilters` and `LiveOutgoingAudioFilters`. Use `OutgoingAudioFilters` to change settings before the call starts. Use `LiveOutgoingAudioFilters` to change settings while a call is in progress.

You first need to import the Calling SDK:

```csharp
using Azure.Communication;
using Azure.Communication.Calling.WindowsClient;
```

## Before a call starts

You can apply `OutgoingAudioFilters` when a call starts.

Begin by creating a `OutgoingAudioFilters` property and passing it into `OutgoingAudioOptions`, as shown in the following code:

```csharp
var outgoingAudioOptions = new OutgoingAudioOptions();
var filters = new OutgoingAudioFilters()
{
    AnalogAutomaticGainControlEnabled = true,
    DigitalAutomaticGainControlEnabled = true,
    MusicModeEnabled = true,
    AcousticEchoCancellationEnabled = true,
    NoiseSuppressionMode = NoiseSuppressionMode.High
};
outgoingAudioOptions.Filters = filters;
```

## During the call

You can apply `LiveOutgoingAudioFilters` after a call begins. You can retrieve this object from the call object after the call begins. To change the setting in `LiveOutgoingAudioFilters`, set the members inside the class to a valid value and they're applied.

Only a subset of the filters available from `OutgoingAudioFilters` are available during an active call. They're music mode, echo cancellation, and noise suppression mode.

```csharp
LiveOutgoingAudioFilters filter = call.LiveOutgoingAudioFilters;
filter.MusicModeEnabled = true;
filter.AcousticEchoCancellationEnabled = true;
filter.NoiseSuppressionMode = NoiseSuppressionMode.Auto;
```
