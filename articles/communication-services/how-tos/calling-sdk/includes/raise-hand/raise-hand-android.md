---
author: ruslanzdor
ms.service: azure-communication-services
ms.topic: include
ms.date: 11/01/2022
ms.author: ruslanzdor
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-android.md)]

The Raise Hand feature allows participants in a call to indicate that they have a question, comment, or concern without interrupting the speaker or other participants. This feature can be used in any call type, including 1:1 calls and calls with many participants, in Azure Communication Service and in Teams calls.
You first need to import calling Features from the Calling SDK:

```java
import com.azure.android.communication.calling.RaiseHandFeature;
```

Then you can get the feature API object from the call instance:

```java
RaiseHandFeature raiseHandFeature = call.feature(Features.RAISE_HAND);
```

### Raise and lower hand for current participant:
To change the Raise Hand state for the current participant, you can use the `raiseHand()` and `lowerHand()` methods.
This is async methods, to verify results can be used `RaisedHandReceived` and `LoweredHandReceived` listeners.
```java
RaiseHandFeature raiseHandFeature = call.feature(Features.RAISE_HAND);
//raise
raiseHandFeature.raiseHand();
//lower
raiseHandFeature.lowerHand();
```

### Lower hands for other participants
This feature allows users with the Organizer and Presenter roles to lower all hands for other participants on Teams calls. In Azure Communication calls, changing the state of other participants is not allowed unless roles have been added.

To use this feature, you can use the following code:
```java
RaiseHandFeature raiseHandFeature = call.feature(Features.RAISE_HAND);
//lower all hands on the call
raiseHandFeature.lowerAllHands();
//or we can provide array of CommunicationIdentifier to specify list of participants
List<CommunicationIdentifier> identifiers = new ArrayList<>();
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>);
identifiers.add(new CommunicationUserIdentifier("<USER_ID>"));
identifiers.add(new MicrosoftTeamsUserIdentifier("<USER_ID>"));
raiseHandFeature.lowerHands(identifiers);
```

### Handle changed states
With the Raise Hand API, you can subscribe to the `RaisedHandReceived` and `LoweredHandReceived` events to handle changes in the state of participants on a call. These events are triggered by a call instance and provide information about the participant whose state has changed.

To subscribe to these events, you can use the following code:
```java
RaiseHandFeature raiseHandFeature = call.feature(Features.RAISE_HAND)

// event example : {identifier: CommunicationIdentifier, isRaised: true, order:1}
call.feature(Features.RAISE_HAND).addOnRaisedHandReceivedListener(raiseHandEvent -> {
    Log.i(TAG, String.format("Raise Hand: %s : %s", Utilities.toMRI(raiseHandEvent.getIdentifier()), raiseHandEvent.isRaised()));
});
```
The `RaisedHandReceived` and `LoweredHandReceived` events contain an object with the `identifier` property, which represents the participant's communication identifier. In the example above, we log a message to the console indicating that a participant has raised their hand.

To unsubscribe from the events, you can use the `off` method.


### List of all participants with active state
To get information about all participants that have raised hand state on current call, you can use the `getRaisedHands` api. he returned array is sorted by the order field.
Here's an example of how to use the `getRaisedHands` API:
```java
RaiseHandFeature raiseHandFeature = call.feature(Features.RAISE_HAND);
List<RaiseHand> participantsWithRaisedHands = raiseHandFeature.getRaisedHands();
```

### Order of raised Hands
The `participantsWithRaisedHands` variable will contain an array of participant objects, where each object has the following properties:
`identifier`: the communication identifier of the participant
`order`: the order in which the participant raised their hand
You can use this information to display a list of participants with the Raise Hand state and their order in the queue.```
