---
author: cnwankwo
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/01/2023
ms.author: cnwankwo
---

[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Implement spotlight

Spotlight is an extended feature of the core `Call` API. You first need to import calling features from the Calling SDK.

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the feature API object from the call instance.

```js
const spotLightFeature = call.feature(Features.Spotlight);
```

### Start spotlight for current participant

To pin the video of the current/local participant, use the following code. This action is idempotent, trying to start spotlight on a pinned participant does nothing.

```js
spotLightFeature.startSpotlight();
```

### Spotlight specific participants

Any participant in the call or meeting can be pinned. Only Microsoft 365 users who have an organizer, co-organizer, or presenter role can start spotlight for other participants. This action is idempotent, trying to start spotlight on a pinned participant does nothing.

```js
// Specify list of participants to be spotlighted
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>)
spotLightFeature.startSpotlight([acsUser, teamsUser]);
```

### Stop spotlight for current participant

To unpin the video of the current/local participant, use the following code. This action is idempotent, trying to stop spotlight on an unpinned participant does nothing.

```js
spotLightFeature.stopSpotlight();
```

### Remove spotlight from participants

Any pinned participant in the call or meeting can be unpinned. Only Microsoft 365 users who have an organizer, co-organizer, or presenter role can unpin other participants. This action is idempotent, trying to stop spotlight on an unpinned participant does nothing.

You need a list of participants identifiers to use this feature.

```js
// Specify list of participants to be spotlighted
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>)
spotLightFeature.stopSpotlight([acsUser, teamsUser]);
```

### Remove all spotlights

All pinned participants can be unpinned using this operation. Only `MicrosoftTeamsUserIdentifier` users who have an organizer, co-organizer, or presenter role can unpin all participants.

```js
spotLightFeature.stopAllSpotLight();
```

### Handle changed states

Spotlight mode enables you to subscribe to `SpotlightChanged` events. A `SpotlightChanged` event comes from a call instance and contains information about newly spotlighted participants and participants whose spotlight stopped. The returned array `SpotlightedParticipant` is sorted by the order the participants were spotlighted.

To get information about all participants with spotlight state changes on the current call, use the following code.

```js
// event : { added: SpotlightedParticipant[]; removed: SpotlightedParticipant[] }
// SpotlightedParticipant = { identifier: CommunicationIdentifier, order?: number }
// where: 
//  identifier: ID of participant whos spotlight state is changed
//  order: sequence of the event

const spotlightChangedHandler = (event) => {
    console.log(`Newly added spotlight state ${JSON.stringify(event.added)}`);
    console.log(`Newly removed spotlight state ${JSON.stringify(event.removed)}`);
};
spotLightFeature.on('spotlightChanged', spotlightChangedHandler);
```

Use the following to stop receiving `spotlightUpdated` events.

```js
spotLightFeature.off('spotlightChanged', spotlightChangedHandler);
```

### Get List of all participants currently spotlighted

To get information about all participants that have spotlight state on current call, use the following operation. The returned array `SpotlightedParticipant` is sorted by the order the participants were spotlighted.

```js
let spotlightedParticipants = spotLightFeature.getSpotlightedParticipants();
```

### Get the maximum supported spotlight participants

Use the following operation to get the maximum number of participants that can be spotlighted using the Calling SDK.

```js
spotLightFeature.maxParticipantsToSpotlight;
```
