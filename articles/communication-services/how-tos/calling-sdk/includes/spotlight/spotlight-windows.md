---
author: cnwankwo
ms.service: azure-communication-services
ms.topic: include
ms.date: 06/20/2023
ms.author: cnwankwo
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

Communication Services or Microsoft 365 users can call the spotlight APIs based on role type and conversation type

**In a one to one call or group call scenario, the following APIs are supported for both Communication Services and Microsoft 365 users**

|APIs| Organizer | Presenter | Attendee |
|----------------------------------------------|--------|--------|--------|
| StartSpotlightAsync | ✔️ | ✔️  | ✔️ |
| StopSpotlightAsync | ✔️ | ✔️ | ✔️ |
| StopAllSpotlightAsync |  ✔️ | ✔️ | ✔️ |
| SpotlightedParticipants |  ✔️ | ✔️ | ✔️ |
| MaxSupported |  ✔️ | ✔️ | ✔️ |

**For meeting scenario the following APIs are supported for both Communication Services and Microsoft 365 users**

|APIs| Organizer | Presenter | Attendee |
|----------------------------------------------|--------|--------|--------|
| StartSpotlightAsync | ✔️ | ✔️  |  |
| StopSpotlightAsync | ✔️ | ✔️ | ✔️ |
| StopAllSpotlightAsync |  ✔️ | ✔️ |  |
| SpotlightedParticipants |  ✔️ | ✔️ | ✔️ |
| MaxSupported |  ✔️ | ✔️ | ✔️ |

Spotlight is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:


```csharp
using Azure.Communication.Calling.WindowsClient;
```

Then you can get the feature API object from the call instance:

```csharp
private SpotlightCallFeature spotlightCallFeature;
spotlightCallFeature = call.Features.Spotlight;
```

### Start spotlight for participants:
Any participant in the call or meeting can be pinned. Only Microsoft 365 users who have an organizer, co-organizer or presenter role can start spotlight for other participants. This action is idempotent, trying to start spotlight on a pinned participant does nothing

To use this feature, a list of participants identifiers is required
```csharp
List<CallIdentifier> spotlightIdentifiers= new List<CallIdentifier>();
spotlightIdentifiers.Add("USER_ID");
spotlightIdentifiers.Add("USER_ID");
spotlightCallFeature.StartSpotlightAsync(spotlightIdentifiers);
```

### Remove spotlight from participants
Any pinned participant in the call or meeting can be unpinned. Only Microsoft 365 users who have an organizer, co-organizer or presenter role can unpin other participants. This action is idempotent, trying to stop spotlight on an unpinned participant does nothing 

To use this feature, a list of participants identifiers is required
```csharp
List<CallIdentifier> spotlightIdentifiers= new List<CallIdentifier>();
spotlightIdentifiers.Add("USER_ID");
spotlightIdentifiers.Add("USER_ID");
spotlightCallFeature.StopSpotlightAsync(spotlightIdentifiers);
```


### Remove all spotlights
All pinned participants can be unpinned using this API. Only MicrosoftTeamsUserIdentifier users who have an organizer, co-organizer or presenter role can unpin all participants.
```csharp
spotlightCallFeature.StopAllSpotlightAsync();
```

### Handle changed states
The `Spotlight` API allows you to subscribe to `SpotlightChanged` events. A `SpotlightChanged` event comes from a `call` instance and contains information about newly spotlighted participants and participants whose spotlight were stopped
```csharp
// event : { added: SpotlightedParticipant[]; removed: SpotlightedParticipant[] }
// SpotlightedParticipant = { identifier: CommunicationIdentifier }
// where: 
//  identifier: ID of participant whos spotlight state is changed
private void OnSpotlightChange(object sender, SpotlightChangedEventArgs args)
{
    foreach (SpotlightedParticipant rh in args.added)
    {
        Trace.WriteLine("Added ===========> " + rh.Identifier.RawId);
    }
    foreach (SpotlightedParticipant rh in args.removed)
    {
        Trace.WriteLine("Removed =========> " + rh.Identifier.RawId);
    }
}
spotlightCallFeature.SpotlightChanged += OnSpotlightChange;
```

### Get all spotlighted participants:
To get information about all participants that have spotlight state on current call, you can use the following API. The returned array is sorted by the order the participants were spotlighted.

``` csharp
List<SpotlightedParticipant> currentSpotlightedParticipants = spotlightCallFeature.SpotlightedParticipants();
foreach (SpotlightedParticipant participant in currentSpotlightedParticipants)
{
    Trace.WriteLine("Participant " + participant.Identifier.RawId + " has spotlight");
}
```

### Get the maximum supported spotlight:
The following API can be used to get the maximum number of participants that can be spotlighted using the Calling SDK
``` csharp
spotlightCallFeature.MaxSupported();
```