---
author: jsaurezlee-msft
ms.service: azure-communication-services
ms.topic: article
ms.date: 27/01/2022
ms.author: jsaurezlee
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-android.md)]

[!INCLUDE [common](dominant-speaker-common.md)]

In order to use the Dominant Speakers call feature for Android, the first step is to obtain the Dominant Speakers feature API object:

```java
DominantSpeakersFeature dominantSpeakersFeature = call.feature(Features.DOMINANT_SPEAKERS);
```
The Dominant Speakers feature object have the following API structure:
- `OnDominantSpeakersChanged`: Event for listening for changes in the dominant speakers list.
- `getDominantSpeakersInfo()`: Gets the `DominantSpeakersInfo` object. This object has:
    - `getSpeakers()`: A list of participant identifiers representing the dominant speakers list.
    - `getLastUpdatedAt()`: The date when the dominant speakers list was updated. 

To subscribe to changes in the Dominant Speakers list:

```java

// Obtain the extended feature object from the call object.
DominantSpeakersFeature dominantSpeakersFeature = call.feature(Features.DOMINANT_SPEAKERS);
// Subscribe to the OnDominantSpeakersChanged event.
dominantSpeakersFeature.addOnDominantSpeakersChangedListener(handleDominantSpeakersChangedlistener);

private void handleCallOnDominantSpeakersChanged(PropertyChangedEvent args) {
    // When the list changes, get the timestamp of the last change and the current list of Dominant Speakers
    DominantSpeakersInfo dominantSpeakersInfo = dominantSpeakersFeature.getDominantSpeakersInfo();
    Date timestamp = dominantSpeakersInfo.getLastUpdatedAt();
    List<CommunicationIdentifier> dominantSpeakers = dominantSpeakersInfo.getSpeakers();
}
```
