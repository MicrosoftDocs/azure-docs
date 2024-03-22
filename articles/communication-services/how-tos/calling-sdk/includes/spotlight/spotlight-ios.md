---
author: cnwankwo
ms.service: azure-communication-services
ms.topic: include
ms.date: 08/06/2023
ms.author: cnwankwo
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-ios.md)]

Communication Services or Microsoft 365 users can call the spotlight APIs based on role type and conversation type

**In a one to one call or group call scenario, the following APIs are supported for both Communication Services and Microsoft 365 users**

|APIs| Organizer | Presenter | Attendee |
|----------------------------------------------|--------|--------|--------|
| startSpotlight | ✔️ | ✔️  | ✔️ |
| stopSpotlight | ✔️ | ✔️ | ✔️ |
| stopAllSpotlight |  ✔️ | ✔️ | ✔️ |
| spotlightedParticipants |  ✔️ | ✔️ | ✔️ |
| maxSupported |  ✔️ | ✔️ | ✔️ |

**For meeting scenario the following APIs are supported for both Communication Services and Microsoft 365 users**

|APIs| Organizer | Presenter | Attendee |
|----------------------------------------------|--------|--------|--------|
| startSpotlight | ✔️ | ✔️  |  |
| stopSpotlight | ✔️ | ✔️ | ✔️ |
| stopAllSpotlight |  ✔️ | ✔️ |  |
| spotlightedParticipants |  ✔️ | ✔️ | ✔️ |
| maxSupported |  ✔️ | ✔️ | ✔️ |

Spotlight is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:

```swift
import AzureCommunicationCalling
```

Then you can get the feature API object from the call instance:

```swift
@State var spotlightFeature: SpotlightCallFeature?

spotlightFeature = self.call!.feature(Features.spotlight)
```

### Start spotlight for participants:
Any participant in the call or meeting can be pinned. Only Microsoft 365 users who have an organizer, co-organizer or presenter role can start spotlight for other participants. This action is idempotent, trying to start spotlight on a pinned participant does nothing

To use this feature, a list of participants identifiers is required

```swift 
var identifiers : [CommunicationIdentifier] = []
identifiers.append(CommunicationUserIdentifier("<USER_ID>"))
identifiers.append(MicrosoftTeamsUserIdentifier("<USER_ID>"))
spotlightFeature.startSpotlight(participants: identifiers, completionHandler: { (error) in
    if let error = error {
        print ("startSpotlight failed %@", error as Error)
    }
})
```

### Remove spotlight from participants
Any pinned participant in the call or meeting can be unpinned. Only Microsoft 365 users who have an organizer, co-organizer or presenter role can unpin other participants. This action is idempotent, trying to stop spotlight on an unpinned participant does nothing 

To use this feature, a list of participants identifiers is required
```swift
var identifiers : [CommunicationIdentifier] = []
identifiers.append(CommunicationUserIdentifier("<USER_ID>"))
identifiers.append(MicrosoftTeamsUserIdentifier("<USER_ID>"))
spotlightFeature.stopSpotlight(participants: identifiers, completionHandler: { (error) in
    if let error = error {
        print ("stopSpotlight failed %@", error as Error)
    }
})
```

### Remove all spotlights
All pinned participants can be unpinned using this API. Only MicrosoftTeamsUserIdentifier users who have an organizer, co-organizer or presenter role can unpin all participants.
```swift
spotlightFeature.stopAllSpotlight(completionHandler: { (error) in
    if let error = error {
        print ("stopAllSpotlight failed %@", error as Error)
    }
})
```

### Handle changed states
The `Spotlight` API allows you to subscribe to `SpotlightChanged` events. A `SpotlightChanged` event comes from a `call` instance and contains information about newly spotlighted participants and participants whose spotlight were stopped
```swift
// event : { added: SpotlightedParticipant[]; removed: SpotlightedParticipant[] }
// SpotlightedParticipant = { identifier: CommunicationIdentifier }
// where: 
//  identifier: ID of participant whos spotlight state is changed

spotlightFeature = self.call!.feature(Features.spotlight)
spotlightFeature!.delegate = self.SpotlightDelegate

public class SpotlightDelegate: SpotlightCallFeatureDelegate {
    public func SpotlightCallFeature(_ spotlightCallFeature: SpotlightCallFeature, didChangeSpotlight args: SpotlightChangedEventArgs) {
        args.added.forEach { participant in
            print("Spotlight participant " + Utilities.toMri(participant.identifier) +  "is ON")
        }
        args.removed.forEach { participant in
            print("Spotlight participant " + Utilities.toMri(participant.identifier) +  "is OFF")
        }
    }
}
```

### Get all spotlighted participants:
To get information about all participants that have spotlight state on current call, you can use the following API. The returned array is sorted by the order the participants were spotlighted.

``` swift
spotlightCallFeature.spotlightedParticipants.forEach { participant in
    print("Spotlight active for participant: " + Utilities.toMri(participant.identifier))
}
```

### Get the maximum supported spotlight:
The following API can be used to get the maximum number of participants that can be spotlighted using the Calling SDK
``` swift
spotlightCallFeature.maxSupported();
```