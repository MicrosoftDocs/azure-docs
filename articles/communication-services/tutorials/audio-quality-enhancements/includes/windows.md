---
title: Tutorial - Add audio effects suppression ability to your Windows Apps
titleSuffix: An Azure Communication Services tutorial on how to enable audio effects
description: Learn how to add audio effects in your calls using Azure Communication Services.
author: t-leejiyoon
ms.date: 07/28/2023
ms.author: t-leejiyoon
services: azure-communication-services
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

Learn how to manage audio processing features with the Azure Communication Services SDK's. You learn how to apply different audio features before and during calls using audio filters.

Currently, there are five different filters available to control.

## Echo cancellation powered by DeepVQE

Echo cancellation is a filter available before and during a call. You can only toggle echo cancellation only if music mode is enabled. By default, this filter is enabled.

**DeepVQE** is a feature that can improve the quality of voice calls. It can suppress background noise, echo, and reverberation, as well as enhance the speech intelligibility and naturalness.

DeepVQE uses of **AI-model** trained on vast datasets, allowing the system to adapt to a wide range of acoustic scenarios. The core of DeepVQE's technology is its ability to distinguish between speech and nonspeech components within an audio signal in real-time. This discrimination is achieved through a combination of Convolutional Neural Networks (CNNs) and Recurrent Neural Networks (RNNs), which analyze the temporal and spectral characteristics of audio signals.

In compliance with Microsoft’s strict privacy standards, no customer data is collected for this data set. Instead, we either used publicly available data or crowdsourcing to collect specific scenarios. We also ensured that we had a balance of female and male speech, and 74 different languages.

## Noise suppression

Noise suppression is a filter available before and during a call. The currently available modes are `Off`, `Auto`, `Low`, and `High`. By default, this feature is set to `High` mode.

## Analog Automatic gain control

Analog automatic gain control is a filter available before a call. By default, this filter is enabled.

## Digital Automatic gain control

Digital automatic gain control is a filter available before a call. By default, this filter is enabled.

## Music Mode

Music mode is a filter available before and during a call. Learn more about music mode [here](../../../concepts/voice-video-calling/music-mode.md). Music mode only works in 1:1 calls on native platforms and group calls. Currently, music mode doesn't work in 1:1 calls between native and web. By default, music mode is disabled.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- A deployed Communication Services resource. [Create a Communication Services resource](../../../quickstarts/create-communication-resource.md)
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../../quickstarts/voice-video-calling/getting-started-with-calling.md)

[!INCLUDE [Install SDK](../../../how-tos/calling-sdk/includes/install-sdk/install-sdk-windows.md)]

The audio filter feature allows different audio preprocessing options to be applied to outgoing audio. There are two types of audio filters: `OutgoingAudioFilters` and `LiveOutgoingAudioFilters`, with `OutgoingAudioFilters` changing settings before the call starts and `LiveOutgoingAudioFilters` changing settings while a call is in progress.

You first need to import the Calling SDK:

```csharp
using Azure.Communication;
using Azure.Communication.Calling.WindowsClient;
```

## Before call starts

`OutgoingAudioFilters` can be applied when a call starts.

Begin by creating a `OutgoingAudioFilters` and passing it into OutgoingAudioOptions as shown in the following code:

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

`LiveOutgoingAudioFilters` can be applied after a call has started. You can retrieve this object from the call object once the call has started. To change the setting in `LiveOutgoingAudioFilters`, set the members inside the class to a valid value and they're applied.

Only a subset of the filters available from `OutgoingAudioFilters` are available during an active call: music mode, echo cancellation, and noise suppression mode.

```csharp
LiveOutgoingAudioFilters filter = call.LiveOutgoingAudioFilters;
filter.MusicModeEnabled = true;
filter.AcousticEchoCancellationEnabled = true;
filter.NoiseSuppressionMode = NoiseSuppressionMode.Auto;
```