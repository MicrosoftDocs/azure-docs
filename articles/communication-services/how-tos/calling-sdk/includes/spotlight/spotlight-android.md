---
author: cnwankwo
ms.service: azure-communication-services
ms.topic: include
ms.date: 06/20/2023
ms.author: cnwankwo
---

[!INCLUDE [Install SDK](../install-sdk/install-sdk-android.md)]

## Implement spotlight

Spotlight is an extended feature of the core `Call` API. You first need to import calling features from the Calling SDK.

```java
import com.azure.android.communication.calling.SpotlightFeature;
```

Then you can get the feature API object from the call instance.

```java
SpotlightCallFeature spotlightCallFeature;
spotlightCallFeature = call.feature(Features.SPOTLIGHT);
```

### Start spotlight for participants

Any participant in the call or meeting can be pinned. Only Microsoft 365 users who have an organizer, co-organizer, or presenter role can start spotlight for other participants. This action is idempotent, trying to start spotlight on a pinned participant does nothing

You need a list of participant identifiers to use this feature.

```java
List<CommunicationIdentifier> spotlightIdentifiers = new ArrayList<>();
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>);
spotlightIdentifiers.add(new CommunicationUserIdentifier("<USER_ID>"));
spotlightIdentifiers.add(new MicrosoftTeamsUserIdentifier("<USER_ID>"));
spotlightCallFeature.StartSpotlight(spotlightIdentifiers);
```

You can also use the following code to start a participant spotlight.

```java
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>);
spotlightCallFeature.StartSpotlight(acsUser, teamsUser);
```

### Remove spotlight from participants

Any pinned participant in the call or meeting can be unpinned. Only Microsoft 365 users who have an organizer, co-organizer, or presenter role can unpin other participants. This action is idempotent, trying to stop spotlight on an unpinned participant does nothing.

You need a list of participants identifiers to use this feature.

```java
List<CommunicationIdentifier> spotlightIdentifiers = new ArrayList<>();
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>);
spotlightIdentifiers.add(new CommunicationUserIdentifier("<USER_ID>"));
spotlightIdentifiers.add(new MicrosoftTeamsUserIdentifier("<USER_ID>"));
spotlightCallFeature.StopSpotlight(spotlightIdentifiers);
```

You can also use the following code to remove a participant spotlight.

```java
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>);
spotlightCallFeature.StopSpotlight(acsUser, teamsUser);
```

### Remove all spotlights

All pinned participants can be unpinned using this operation. Only `MicrosoftTeamsUserIdentifier` users who have an organizer, co-organizer, or presenter role can unpin all participants.

```java
spotlightCallFeature.stopAllSpotlight();
```

### Handle changed states

Spotlight mode enables you to subscribe to `SpotlightChanged` events. A `SpotlightChanged` event comes from a call instance and contains information about newly spotlighted participants and participants whose spotlight stopped. The returned array `SpotlightedParticipant` is sorted by the order the participants were spotlighted.

To get information about all participants with spotlight state changes on the current call, use the following code.

```java
import com.azure.android.communication.calling.SpotlightedParticipant;

// event : { added: SpotlightedParticipant[]; removed: SpotlightedParticipant[] }
// SpotlightedParticipant = { identifier: CommunicationIdentifier }
// where: 
//  identifier: ID of participant whos spotlight state is changed
void onSpotlightChanged(SpotlightChangedEvent args) {
    Log.i(ACTIVITY_TAG, String.format("Spotlight Changed Event"));
    for(SpotlightedParticipant participant: args.getadded()) {
        Log.i(ACTIVITY_TAG, String.format("Added ==>: %s %d", Utilities.toMRI(participant.getIdentifier())));
    }

    for(SpotlightedParticipant participant: args.getremoved()) {
        Log.i(ACTIVITY_TAG, String.format("Removed ==>: %s %d", Utilities.toMRI(participant.getIdentifier())));
    }
}
spotlightCallFeature.addOnSpotlightChangedListener(onSpotlightChanged);
```

### Get all spotlighted participants

To get information about all participants that have spotlight state on current call, use the following operation. The returned array is sorted by the order the participants were spotlighted.

``` java
List<SpotlightedParticipant> currentSpotlightedParticipants = spotlightCallFeature.getSpotlightedParticipants();
foreach (SpotlightedParticipant participant in currentSpotlightedParticipants)
{
    Trace.WriteLine("Participant " + participant.Identifier.RawId + " has spotlight");
}
```

### Get the maximum supported spotlight participants

Use the following operation to get the maximum number of participants that can be spotlighted using the Calling SDK.

``` java
spotlightCallFeature.maxSupported();
```