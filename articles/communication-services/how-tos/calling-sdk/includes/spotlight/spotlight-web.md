---
author: cnwankwo
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/01/2023
ms.author: cnwankwo
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

Communication Services or Microsoft 365 users can call the spotlight APIs based on role type and conversation type

**In a one to one call or group call scenario, the following APIs are supported for both Communication Services and Microsoft 365 users**

|APIs| Organizer | Presenter | Attendee |
|----------------------------------------------|--------|--------|--------|
| startSpotlight | ✔️ | ✔️  | ✔️ |
| stopSpotlight | ✔️ | ✔️ | ✔️ |
| stopAllSpotlight |  ✔️ | ✔️ | ✔️ |
| getSpotlightedParticipants |  ✔️ | ✔️ | ✔️ |

**For meeting scenario the following APIs are supported for both Communication Services and Microsoft 365 users**

|APIs| Organizer | Presenter | Attendee |
|----------------------------------------------|--------|--------|--------|
| startSpotlight | ✔️ | ✔️  |  |
| stopSpotlight | ✔️ | ✔️ | ✔️ |
| stopAllSpotlight |  ✔️ | ✔️ |  |
| getSpotlightedParticipants |  ✔️ | ✔️ | ✔️ |

Spotlight is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the feature API object from the call instance:

```js
const spotLightFeature = call.feature(Features.Spotlight);
```

### Start spotlight for current participant:
To pin the video of the current/local participant, use the following code. This action is idempotent, trying to start spotlight on a pinned participant does nothing
```js
spotLightFeature.startSpotlight();
```

### Spotlight specific participants
Any participant in the call or meeting can be pinned. Only Microsoft 365 users who have an organizer, co-organizer or presenter role can start spotlight for other participants. This action is idempotent, trying to start spotlight on a pinned participant does nothing
```js
// Specify list of participants to be spotlighted
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>)
spotLightFeature.startSpotlight([acsUser, teamsUser]);
```

### Stop spotlight for current participant:
To unpin the video of the current/local participant, use the following code. This action is idempotent, trying to stop spotlight on an unpinned participant does nothing
```js
spotLightFeature.stopSpotlight();
```



### Remove spotlight from participants
Any pinned participant in the call or meeting can be unpinned. Only Microsoft 365 users who have an organizer, co-organizer or presenter role can unpin other participants. This action is idempotent, trying to stop spotlight on an unpinned participant does nothing 
```js
// Specify list of participants to be spotlighted
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>)
spotLightFeature.stopSpotlight([acsUser, teamsUser]);
```

### Remove all spotlights
All pinned participants can be unpinned using this API. Only MicrosoftTeamsUserIdentifier users who have an organizer, co-organizer or presenter role can unpin all participants.
```js
spotLightFeature.stopAllSpotLight();
```



### Handle changed states
The `Spotlight` API allows you to subscribe to `spotlightChanged` events. A `spotlightChanged` event comes from a `call` instance and contains information about newly spotlighted participants and participants whose spotlight were stopped
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

Use the following to stop receiving spotlightUpdated events
```js
spotLightFeature.off('spotlightChanged', spotlightChangedHandler);
```
### Get List of all participants currently spotlighted
To get information about all participants that are spotlighted on the current call, use the following API call. It returns an array of SpotlightedParticipant
```js
let spotlightedParticipants = spotLightFeature.getSpotlightedParticipants();
```
