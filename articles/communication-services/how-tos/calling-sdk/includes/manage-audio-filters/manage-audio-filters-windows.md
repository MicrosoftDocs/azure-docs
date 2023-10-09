---
author: t-leejiyoon
ms.service: azure-communication-services
ms.topic: include
ms.date: 07/28/2023
ms.author: t-leejiyoon
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

The audio filter feature allows different audio preprocessing options to be applied to outgoing audio. There are two types of audio filters: OutgoingAudioFilters and LiveOutgoingAudioFilters, with OutgoingAudioFilters changing settings before the call starts and LiveOutgoingAudioFilters changing settings while a call is in progress. 

You first need import the Calling SDK:

```csharp
using Azure.Communication;
using Azure.Communication.Calling.WindowsClient;
```

## OutgoingAudioFilters
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

## LiveOutgoingAudioFilters
`LiveOutgoingAudioFilters` can be applied after a call has started. You can retrieve this object from the call object once the call has started. To change the setting in `LiveOutgoingAudioFilters`, set the members inside the class to a valid value and they're applied.

Only a subset of the filters available from `OutgoingAudioFilters` are available during an active call: music mode, echo cancellation, and noise suppression mode.

```csharp
LiveOutgoingAudioFilters filter = call.LiveOutgoingAudioFilters;
filter.MusicModeEnabled = true;
filter.AcousticEchoCancellationEnabled = true;
filter.NoiseSuppressionMode = NoiseSuppressionMode.Auto;
```

## Available Filters

Currently, there are five different filters available to control.

### Analog Automatic gain control
Analog automatic gain control is a filter available before a call. By default, this filter is enabled.

### Digital Automatic gain control
Digital automatic gain control is a filter available before a call. By default, this filter is enabled.

### Music Mode
Music mode is a filter available before and during a call. Learn more about music mode [here](https://support.microsoft.com/en-us/office/use-high-fidelity-music-mode-to-play-music-in-microsoft-teams-c1550582-2f76-4b31-9f72-e98c7167a18e). Please note that music mode only works in 1:1 calls on native platforms and group calls. Currently, music mode doesn't work in 1:1 calls between native and web. By default, music mode is disabled.

### Echo cancellation
Echo cancellation is a filter available before and during a call. You can only toggle echo cancellation only if music mode is enabled. By default, this filter is enabled. 

### Noise suppression
Noise suppression is a filter available before and during a call. The currently available modes are `Off`, `Auto`, `Low`, and `High`. By default, this feature is set to `High` mode. 
