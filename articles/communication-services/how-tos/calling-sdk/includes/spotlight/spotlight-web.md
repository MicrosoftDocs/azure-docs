---
author: cnwankwo
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/01/2023
ms.author: cnwankwo
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

> [!NOTE]
> Spotlight API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of Azure Communication Services Calling Web SDK

Spotlight is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the feature API object from the call instance:

```js
const spotLightFeature = call.feature(Features.Spotlight);
```

### Start spotlight for current participant:
To set the spotlight state of the current/local participant, use the following code
```js
const spotLightFeature = call.feature(Features.Spotlight);
spotLightFeature.startSpotlight();
```

### Stop spotlight for current participant:
To remove the spotlight state of the current/local participant, use the following code
```js
const spotLightFeature = call.feature(Features.Spotlight);
spotLightFeature.stopSpotlight();
```

### start spotlight some remote participants
Only MicrosoftTeamsUserIdentifier users who have an organizer or presenter role can set the spotlight state of other participants
```js
const spotLightFeature = call.feature(Features.Spotlight);

// Specify list of participants to be spotlighted
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>)
spotLightFeature.startParticipantSpotLight([acsUser, teamsUser]);
```

### stop spotlight for some remote participants
Only MicrosoftTeamsUserIdentifier users who have an organizer or presenter role can remove the spotlight state of other participants
```js
const spotLightFeature = call.feature(Features.Spotlight);

// Specify list of participants to be spotlighted
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>)
spotLightFeature.startParticipantSpotLight([acsUser, teamsUser]);
```

### stop spotlight for all  participants
Only MicrosoftTeamsUserIdentifier users who have an organizer or presenter role can remove the spotlight state of all participants
```js
const spotLightFeature = call.feature(Features.Spotlight);
spotLightFeature.stopAllSpotLight();
```



### Handle changed states
The `Spotlight` API allows you to subscribe to `spotLightUpdated` events. A `spotLightUpdated` event comes from a `call` instance and contains information about newly spotlighted participants and participants whose spotlight state were removed
```js
const spotLightFeature = call.feature(Features.Spotlight);

// event : { added: spotLightChange[]; removed: spotLightChange[] }
// where spotLightChange = { identifier: CommunicationIdentifier }

const spotlightChangedHandler = (event) => {
    console.log(`Newly added spotlight state ${JSON.stringify(event.added)}`);
    console.log(`Newly removed spotlight state ${JSON.stringify(event.removed)}`);
};
spotLightFeature.on('spotLightUpdated', spotlightChangedHandler):
```

### Get List of all participants currently spotlighted
To get information about all participants that have Spotlight state on current call, use the following API call
```js
const spotLightFeature = call.feature(Features.Spotlight);
let spotlightedParticipants = spotLightFeature.spotLightStatus();
```
