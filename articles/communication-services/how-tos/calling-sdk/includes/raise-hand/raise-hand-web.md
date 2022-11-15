---
author: ruslanzdor
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2022
ms.author: rifox
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

> [!NOTE]
> Raise Hand API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of Azure Communication Services Calling Web SDK

Raise Hand is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the feature API object from the call instance:

```js
const raiseHandFeature = call.feature(Features.RaiseHand );
```

### Raise and lower hand for current participant:
Raise Hand state can be used in any call type: on 1:1 calls and on calls with many participants, in ACS and in Teams calls.
If it Teams meeting - organizer will have ability to enable or disable raise hand states for all participants.
To change state for current participant, you can use methods:
```js
const raiseHandFeature = call.feature(Features.RaiseHand );
//raise
raiseHandFeature.raiseHand();
//lower
raiseHandFeature.lowerHand();
```

### Lower hands for other participants
Currently ACS calls aren't allowed to change state of other participants, for example, lower all hands. But Teams calls allow it using these methods:
```js
const raiseHandFeature = call.feature(Features.RaiseHand );
//lower all hands on the call
raiseHandFeature.lowerHandForEveryone();
//or we can provide array of CommunicationIdentifier to specify list of participants
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>)
CommunicationIdentifier participants[] = new CommunicationIdentifier[]{ acsUser, teamsUser };
raiseHandFeature.lowerHand(participants);
```

### Handle changed states
The `Raise Hand` API allows you to subscribe to `raiseHandChanged` events. A `raiseHandChanged` event comes from a `call` instance and contain information about participant and new state.
```js
const raiseHandFeature = call.feature(Features.RaiseHand );

// event : {identifier: CommunicationIdentifier, isRaised: true, order:1}
const isRaiseHandChangedHandler = (event) => {
    console.log(`Participant ${event.identifier} ${event.isRaised ? "Raised" : "Lower"} hand`);
};
raiseHandFeature.feature(SDK.Features.RaiseHand).on('raiseHandChanged', isRaiseHandChangedHandler):
```

### List of all participants with active state
To get information about all participants that have Raise Hand state on current call, you can use this api array is sorted by order field:
```js
const raiseHandFeature = call.feature(Features.RaiseHand );
let activeStates = raiseHandFeature.getStatus();
```

### Order of raised Hands
It possible to get order of all raised hand states on the call, this order is started from 1.
There are two ways: get all raise hand state on the call or use `raiseHandChanged` event subscription.
In event subscription when any participant will lower a hand - call will generate only one event, but not for all participants with order above.

```js
const raiseHandFeature = call.feature(Features.RaiseHand );

// event : {identifier: CommunicationIdentifier, isRaised: true, order:1}
const isRaiseHandChangedHandler = (event) => {
    console.log(`List of participants with raised hand`);
    for (let state : raiseHandFeature.getStatus()) {
        console.log(`Participant ${state.identifier} has order ${state.order}`);
    }
};
raiseHandFeature.feature(SDK.Features.RaiseHand).on('raiseHandChanged', isRaiseHandChangedHandler):
```
