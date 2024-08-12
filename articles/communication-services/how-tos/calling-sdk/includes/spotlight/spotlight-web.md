---
author: cnwankwo
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/01/2023
ms.author: cnwankwo
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

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
Any participant in the call or meeting can be pinned. Only Microsoft 365 users who have an organizer, coorganizer, or presenter role can start spotlight for other participants. This action is idempotent, trying to start spotlight on a pinned participant does nothing
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
Any pinned participant in the call or meeting can be unpinned. Only Microsoft 365 users who have an organizer, coorganizer, or presenter role can unpin other participants. This action is idempotent, trying to stop spotlight on an unpinned participant does nothing 
```js
// Specify list of participants to be spotlighted
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>)
spotLightFeature.stopSpotlight([acsUser, teamsUser]);
```

### Remove all spotlights
All pinned participants can be unpinned using this API. Only Microsoft 365 users who have an organizer, coorganizer, or presenter role can unpin all participants.
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
### Get the maximum supported spotlight:
The following API can be used to get the maximum number of participants that can be spotlighted using the Calling SDK
```js
spotLightFeature.maxParticipantsToSpotlight;
```

## Troubleshooting
|code| Subcode | Result Category | Reason | Resolution |
|----------------------------------------------|--------|--------|---------|----------|
|400	| 45900 | ExpectedError  | All provided participant IDs are already spotlighted  | Only participants who aren't currently spotlighted can be spotlighted |
|400 | 45902	| ExpectedError | The maximum number of participants that can be spotlighted has been reached | Only seven participants can be in the spotlight state at any given time |
|403 | 45903	| ExpectedError | Only participants with the roles of organizer, coorganizer, or presenter can initiate a spotlight. | Ensure the participant invoking the `startSpotlight` API holds the role of organizer, coorganizer or presenter |
