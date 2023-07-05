---
author: ruslanzdor
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2022
ms.author: rifox
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

The Raise Hand feature allows participants in a call to indicate that they have a question, comment, or concern without interrupting the speaker or other participants. This feature can be used in any call type, including 1:1 calls and calls with many participants, in Azure Communication Service and in Teams calls.
You first need to import calling Features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the feature API object from the call instance:

```js
const raiseHandFeature = call.feature(Features.RaiseHand );
```

### Raise and lower hand for current participant:
To change the Raise Hand state for the current participant, you can use the `raiseHand()` and `lowerHand()` methods.
This is async methods, to verify results can be used `raisedHandChanged` and `loweredHandChanged` listeners.
```js
const raiseHandFeature = call.feature(Features.RaiseHand );
//raise
raiseHandFeature.raiseHand();
//lower
raiseHandFeature.lowerHand();
```

### Lower hands for other participants
This feature allows users with the Organizer and Presenter roles to lower all hands for other participants on Teams calls. In Azure Communication calls, changing the state of other participants is not allowed unless roles have been added.

To use this feature, you can use the following code:
```js
const raiseHandFeature = call.feature(Features.RaiseHand );
//lower all hands on the call
raiseHandFeature.lowerAllHands();
//or we can provide array of CommunicationIdentifier to specify list of participants
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>)
CommunicationIdentifier participants[] = new CommunicationIdentifier[]{ acsUser, teamsUser };
raiseHandFeature.lowerHands(participants);
```

### Handle changed states
With the Raise Hand API, you can subscribe to the `raisedHandChanged` and `loweredHandChanged` events to handle changes in the state of participants on a call. These events are triggered by a call instance and provide information about the participant whose state has changed.

To subscribe to these events, you can use the following code:
```js
const raiseHandFeature = call.feature(Features.RaiseHand );

// event : {identifier: CommunicationIdentifier}
const raisedHandChangedHandler = (event) => {
    console.log(`Participant ${event.identifier} raised hand`);
};
const loweredHandChangedHandler = (event) => {
    console.log(`Participant ${event.identifier} lowered hand`);
};
raiseHandFeature.on('raisedHandChanged', raisedHandChangedHandler):
raiseHandFeature.on('loweredHandChanged', loweredHandChangedHandler):
```
The `raisedHandChanged` and `loweredHandChanged` events contain an object with the `identifier` property, which represents the participant's communication identifier. In the example above, we log a message to the console indicating that a participant has raised their hand.

To unsubscribe from the events, you can use the `off` method.

### List of all participants with active state
To get information about all participants that have raised hand state on current call, you can use the `getRaisedHands` api. he returned array is sorted by the order field.
Here's an example of how to use the `getRaisedHands` API:
```js
const raiseHandFeature = call.feature(Features.RaiseHand );
let participantsWithRaisedHands = raiseHandFeature.getRaisedHands();
```

### Order of raised Hands
The `participantsWithRaisedHands` variable will contain an array of participant objects, where each object has the following properties:
`identifier`: the communication identifier of the participant
`order`: the order in which the participant raised their hand
You can use this information to display a list of participants with the Raise Hand state and their order in the queue.