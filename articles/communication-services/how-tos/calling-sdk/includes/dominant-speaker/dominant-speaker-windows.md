---
author: jsaurezlee-msft
ms.service: azure-communication-services
ms.topic: article
ms.date: 27/01/2022
ms.author: jsaurezlee
---

[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

[!INCLUDE [common](dominant-speaker-common.md)]

In order to use the Dominant Speakers call feature for Windows, the first step is to obtain the Dominant Speakers feature API object:

```csharp
DominantSpeakersCallFeature dominantSpeakersFeature = call.Features.DominantSpeakers;
```

The Dominant Speakers feature object have the following API structure:
- `OnDominantSpeakersChanged`: Event for listening for changes in the dominant speakers list.
- `DominantSpeakersInfo`: Gets the `DominantSpeakersInfo` object. This object has:
    - `Speakers`: A list of participant identifiers representing the dominant speakers list.
    - `LastUpdatedAt`: The date when the dominant speakers list was updated. 

To subscribe to changes in the dominant speakers list:
```csharp
// Obtain the extended feature object from the call object.
DominantSpeakersFeature dominantSpeakersFeature = call.Features.DominantSpeakers;
// Subscribe to the OnDominantSpeakersChanged event.
dominantSpeakersFeature.OnDominantSpeakersChanged += DominantSpeakersFeature__OnDominantSpeakersChanged;

private void DominantSpeakersFeature__OnDominantSpeakersChanged(object sender, PropertyChangedEventArgs args) {
  // When the list changes, get the timestamp of the last change and the current list of Dominant Speakers
  DominantSpeakersInfo dominantSpeakersInfo = dominantSpeakersFeature.DominantSpeakersInfo;
  DateTimeOffset date = dominantSpeakersInfo.LastUpdatedAt;
  IReadOnlyList<ICommunicationIdentifier> speakersList = dominantSpeakersInfo.Speakers;
}
```
