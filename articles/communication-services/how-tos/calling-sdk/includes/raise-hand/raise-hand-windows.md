---
author: ruslanzdor
ms.service: azure-communication-services
ms.topic: include
ms.date: 02/06/2022
ms.author: ruslanzdor
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

The Raise Hand feature allows participants in a call to indicate that they have a question, comment, or concern without interrupting the speaker or other participants. This feature can be used in any call type, including 1:1 calls and calls with many participants, in Azure Communication Service and in Teams calls.
You first need to import calling Features from the Calling SDK:

```csharp
using Azure.Communication.Calling.WindowsClient;
```

Then you can get the feature API object from the call instance:

```csharp
private RaiseHandCallFeature raiseHandCallFeature;

raiseHandCallFeature = (RaiseHandCallFeature)call.GetCallFeatureExtension(CallFeatureType.RaiseHand);
```

### Raise and lower hand for current participant:
To change the Raise Hand state for the current participant, you can use the `raiseHand()` and `lowerHand()` methods.
This is async methods, to verify results can be used `RaisedHandReceived` and `LoweredhandReceived` listeners.
```csharp
//publish raise hand state for local participant
raiseHandCallFeature.RaiseHandAsync();

//remove raise hand state for local participant
raiseHandCallFeature.LowerHandAsync();

```

### Lower hands for other participants
This feature allows users with the Organizer and Presenter roles to lower all hands for other participants on Teams calls. In Azure Communication calls, changing the state of other participants is not allowed unless roles have been added.

To use this feature, you can use the following code:
```csharp

// remove raise hand states for all participants on the call
raiseHandCallFeature.LowerAllHandsAsync();

// remove raise hand states for all remote participants on the call
var participants = call.RemoteParticipants;
var identifiers = participants.Select(p => p.Identifier).ToList().AsReadOnly();
raiseHandCallFeature.LowerHandsAsync(identifiers);

// remove raise hand state of specific user
var identifiers = new List<CallIdentifier>();
identifiers.Add(new UserCallIdentifier("USER_ID"));
raiseHandCallFeature.LowerHandsAsync(identifiers);
```

### Handle changed states
With the Raise Hand API, you can subscribe to the `RaisedHandReceived` and `LoweredHandReceived` events to handle changes in the state of participants on a call. These events are triggered by a call instance and provide information about the participant whose state has changed.

To subscribe to these events, you can use the following code:
```swift
raiseHandCallFeature = (RaiseHandCallFeature)call.GetCallFeatureExtension(CallFeatureType.RaiseHand);
raiseHandCallFeature.RaisedHandReceived += OnRaisedHandChange;
raiseHandCallFeature.LoweredHandReceived += OnLoweredHandChange;

private async void OnRaisedHandChange(object sender, RaisedHandChangedEventArgs args)
{
    Trace.WriteLine("RaiseHandEvent: participant " + args.Identifier + " is raised hand");
}

private async void OnLoweredHandChange(object sender, RaisedHandChangedEventArgs args)
{
    Trace.WriteLine("RaiseHandEvent: participant " + args.Identifier + " is lowered hand");
}
```
The `RaisedHandReceived` and `LoweredHandReceived` events contain an object with the `identifier` property, which represents the participant's communication identifier. In the example above, we log a message to the console indicating that a participant has raised their hand.

To unsubscribe from the events, you can use the `off` method.


### List of all participants with active state
To get information about all participants that have raised hand state on current call, you can use the `getRaisedHands` api. he returned array is sorted by the order field.
Here's an example of how to use the `RaisedHands` API:
```swift
raiseHandCallFeature = (RaiseHandCallFeature)call.GetCallFeatureExtension(CallFeatureType.RaiseHand);
foreach (RaiseHand rh in raiseHandCallFeature.RaisedHands.ToList())
{
    Trace.WriteLine("Participant " + rh.Identifier.RawId + " has raised hand ");
}
```

### Order of raised Hands
The `RaisedHands` variable will contain an array of participant objects, where each object has the following properties:
`identifier`: the communication identifier of the participant
`order`: the order in which the participant raised their hand
You can use this information to display a list of participants with the Raise Hand state and their order in the queue.
