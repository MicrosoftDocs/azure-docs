---
author: ruslanzdor
ms.service: azure-communication-services
ms.topic: include
ms.date: 06/15/2025
ms.author: chpalm
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

The Raise Hand feature enables participants in a call to indicate that they have a question, comment, or concern without interrupting the speaker or other participants. You can use this feature in any call type, including 1:1 calls and calls with many participants, in Azure Communication Service and in Teams calls.

First you need to import calling Features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the feature API object from the call instance:

```js
const raiseHandFeature = call.feature(Features.RaiseHand );
```

### Raise and lower hand for current participant

To change the Raise Hand state for the current participant, you can use the `raiseHand()` and `lowerHand()` methods.

These methods are async. To verify results, use `raisedHandChanged` and `loweredHandChanged` listeners.

```js
const raiseHandFeature = call.feature(Features.RaiseHand );
//raise
raiseHandFeature.raiseHand();
//lower
raiseHandFeature.lowerHand();
```

### Lower hands for other participants

This feature enables users with the Organizer and Presenter roles to lower all hands for other participants on Teams calls. In Azure Communication calls, you can't change the state of other participants unless adding the roles first.

To use this feature, implement the following code:

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

With the Raise Hand API, you can subscribe to the `raisedHandChanged` and `loweredHandChanged` events to handle changes in the state of participants on a call. The call instance triggers these events and provides information about the participant whose state changed.

To subscribe to these events, use the following code:

```js
const raiseHandFeature = call.feature(Features.RaiseHand );

// event : {identifier: CommunicationIdentifier}
const raisedHandChangedHandler = (event) => {
    console.log(`Participant ${event.identifier} raised hand`);
};
const loweredHandChangedHandler = (event) => {
    console.log(`Participant ${event.identifier} lowered hand`);
};
raiseHandFeature.on('raisedHandEvent', raisedHandChangedHandler):
raiseHandFeature.on('loweredHandEvent', loweredHandChangedHandler):
```

The `raisedHandChanged` and `loweredHandChanged` events contain an object with the `identifier` property, which represents the participant's communication identifier. In the preceding example, we log a message to the console indicating that a participant raised their hand.

To unsubscribe from the events, use the `off` method.

### List of all participants with active state

To get information about all participants with raised hand state on current call, you can use `getRaisedHands`. The returned array is sorted by the order field.

Here's an example of how to use `getRaisedHands`:

```js
const raiseHandFeature = call.feature(Features.RaiseHand );
let participantsWithRaisedHands = raiseHandFeature.getRaisedHands();
```

### Order of raised Hands

The `participantsWithRaisedHands` variable contains an array of participant objects, where each object has the following properties:

- `identifier`: the communication identifier of the participant.
- `order`: the order in which the participant raised their hand.

You can use this information to display a list of participants with the Raise Hand state and their order in the queue.
