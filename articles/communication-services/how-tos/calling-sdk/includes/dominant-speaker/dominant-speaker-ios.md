---
author: jsaurezlee-msft
ms.service: azure-communication-services
ms.topic: article
ms.date: 27/01/2022
ms.author: jsaurezlee
---

[!INCLUDE [Install SDK](../install-sdk/install-sdk-ios.md)]

[!INCLUDE [common](dominant-speaker-common.md)]

In order to use the Dominant Speakers call feature for iOS, the first step is to obtain the Dominant Speakers feature API object:

```swift
let dominantSpeakersFeature = call.feature(Features.dominantSpeakers)
```
The Dominant Speakers feature object have the following API structure:
- `didChangeDominantSpeakers`: Event for listening for changes in the dominant speakers list.
- `dominantSpeakersInfo`: Which gets the `DominantSpeakersInfo` object. This object has:
    - `speakers`: A list of participant identifiers representing the dominant speakers list.
    - `lastUpdatedAt`: The date when the dominant speakers list was updated.

To subscribe to changes in the dominant speakers list:

```swift
// Obtain the extended feature object from the call object.
let dominantSpeakersFeature = call.feature(Features.dominantSpeakers)
// Set the delegate object to obtain the event callback.
dominantSpeakersFeature.delegate = DominantSpeakersDelegate()

public class DominantSpeakersDelegate : DominantSpeakersCallFeatureDelegate
{
    public func dominantSpeakersCallFeature(_ dominantSpeakersCallFeature: DominantSpeakersCallFeature, didChangeDominantSpeakers args: PropertyChangedEventArgs) {
        // When the list changes, get the timestamp of the last change and the current list of Dominant Speakers
        let dominantSpeakersInfo = dominantSpeakersCallFeature.dominantSpeakersInfo
        let timestamp = dominantSpeakersInfo.lastUpdatedAt
        let dominantSpeakersList = dominantSpeakersInfo.speakers
    }
}
```
