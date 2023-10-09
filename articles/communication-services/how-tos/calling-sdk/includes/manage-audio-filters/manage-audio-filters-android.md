---
author: zehangzheng
ms.service: azure-communication-services
ms.topic: include
ms.date: 10/6/2023
ms.author: zehangzheng
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-android.md)]

The audio filter feature allows different audio preprocessing options to be applied to outgoing audio. There are 2 types of audio filters: OutgoingAudioFilters and LiveOutgoingAudioFilters, with OutgoingAudioFilters changing settings before the call starts and LiveOutgoingAudioFilters changing settings while a call is in progress. 

You first need import the Calling SDK and the associated classes:

```csharp
import com.azure.android.communication.calling.OutgoingAudioOptions;
import com.azure.android.communication.calling.OutgoingAudioFilters;
import com.azure.android.communication.calling.LiveOutgoingAudioFilters;
```

## OutgoingAudioFilters
`OutgoingAudioFilters` can be applied when a call starts. 

Begin by creating a `OutgoingAudioFilters` and passing it into OutgoingAudioOptions as shown in the following code:

```java
OutgoingAudioOptions outgoingAudioOptions = new OutgoingAudioOptions();
OutgoingAudioFilters filters = new OutgoingAudioFilters();
filters.setNoiseSuppressionMode(NoiseSuppressionMode.HIGH);
filters.setAnalogAutomaticGainControlEnabled(true);
filters.setDigitalAutomaticGainControlEnabled(true);
filters.setMusicModeEnabled(true);
filters.setAcousticEchoCancellationEnabled(true); 
outgoingAudioOptions.setAudioFilters(filters);
```

## LiveOutgoingAudioFilters
`LiveOutgoingAudioFilters` can be applied after a call has started. You can retrieve this object from the call object once the call has started. To change the setting in `LiveOutgoingAudioFilters`, set the members inside the class to a valid value and they will be applied.

Only a subset of the filters available from `OutgoingAudioFilters` will be available during an active call. These include: music mode, echo cancellation, and noise suppression mode.

```java
LiveOutgoingAudioFilters filters = call.getLiveOutgoingAudioFilters();
filters.setMusicModeEnabled(false);
filters.setAcousticEchoCancellationEnabled(false);
filters.setNoiseSuppressionMode(NoiseSuppressionMode.HIGH);
```

## Available Filters

Currently, there are five different filters available to control.

### Analog Automatic gain control
Analog automatic gain control is a filter available before a call. By default, this filter is enabled.

### Digital Automatic gain control
Digital automatic gain control is a filter available before a call. By default, this filter is enabled.

### Music Mode
Music mode is a filter available before and during a call. Learn more about music mode [here](https://support.microsoft.com/en-us/office/use-high-fidelity-music-mode-to-play-music-in-microsoft-teams-c1550582-2f76-4b31-9f72-e98c7167a18e). Please note that music mode will only work in 1:1 calls on native platforms and group calls. Currently, music mode will not work in 1:1 calls between native and web. By default, music mode is disabled.

### Echo cancellation
Echo cancellation is a filter available before and during a call. You can only toggle echo cancellation only if music mode is enabled. By default, this filter is enabled. 

### Noise suppression
Noise suppression is a filter available before and during a call. The currently available modes are `Off`, `Auto`, `Low`, and `High`. By default, this feature is set to `High` mode. 
