---
author: ruslanzdor
ms.service: azure-communication-services
ms.topic: include
ms.date: 02/06/2022
ms.author: ruslanzdor
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-ios.md)]

The Raise Hand feature allows participants in a call to indicate that they have a question, comment, or concern without interrupting the speaker or other participants. This feature can be used in any call type, including 1:1 calls and calls with many participants, in Azure Communication Service and in Teams calls.
You first need to import calling Features from the Calling SDK:

```swift
import AzureCommunicationCalling
```

Then you can get the feature API object from the call instance:

```swift
@State var raisehandFeature: RaiseHandCallFeature?

raiseHandFeature = self.call!.feature(Features.raiseHand)
```

### Raise and lower hand for current participant:
To change the Raise Hand state for the current participant, you can use the `raiseHand()` and `lowerHand()` methods.
```swift
//publish raise hand state for local participant
raisehandFeature.raiseHand(completionHandler: { (error) in
    if let error = error {
        print ("Feature failed raise a hand %@", error as Error)
    }
})

//remove raise hand state for local participant
raisehandFeature.lowerHand(completionHandler: { (error) in
    if let error = error {
        print ("Feature failed lower hand %@", error as Error)
    }
})

```

### Lower hands for other participants
This feature allows users with the Organizer and Presenter roles to lower all hands for other participants on Teams calls. In Azure Communication calls, changing the state of other participants is not allowed unless roles have been added.

To use this feature, you can use the following code:
```swift

// remove raise hand states for all participants on the call
raisehandFeature.lowerAllHands(completionHandler: { (error) in
    if let error = error {
        print ("Feature failed lower all hands %@", error as Error)
    }
})

// remove raise hand states for all remote participants on the call
let identifiers = (call?.remoteParticipants.map {$0.identifier})!;
raisehandFeature.lowerHands(participants: identifiers, completionHandler: { (error) in
    if let error = error {
        print ("Feature failed lower hands %@", error as Error)
    }
})

// remove raise hand state of specific user
var identifiers : [CommunicationIdentifier] = []
identifiers.append(CommunicationUserIdentifier("<USER_ID>"))
raisehandFeature.lowerHands(participants: identifiers, completionHandler: { (error) in
    if let error = error {
        print ("Feature failed lower hands %@", error as Error)
    }
})

```

### Handle changed states
With the Raise Hand API, you can subscribe to the `RaisedHandReceived` and `LoweredHandReceived` events to handle changes in the state of participants on a call. These events are triggered by a call instance and provide information about the participant whose state has changed.

To subscribe to these events, you can use the following code:
```swift
self.callObserver = CallObserver(view:self)

raisehandFeature = self.call!.feature(Features.raiseHand)
raisehandFeature!.delegate = self.callObserver

public class CallObserver : NSObject, RaiseHandCallFeatureDelegate
{
    // event example : {identifier: CommunicationIdentifier}
    public func raiseHandCallFeature(_ raiseHandCallFeature: RaiseHandCallFeature, didReceiveRaisedHand args: RaisedHandChangedEventArgs) {
        os_log("Raise hand feature updated: %s is raised hand", log:log, Utilities.toMri(args.identifier))
        raiseHandCallFeature.raisedHands.forEach { raiseHand in
            os_log("Raise hand active: %s", log:log, Utilities.toMri(raiseHand.identifier))
        }
    }
    public func raiseHandCallFeature(_ raiseHandCallFeature: RaiseHandCallFeature, didReceiveLoweredHand args: LoweredHandChangedEventArgs) {
        os_log("Raise hand feature updated: %s is lowered hand", log:log, Utilities.toMri(args.identifier))
        raiseHandCallFeature.raisedHands.forEach { raiseHand in
            os_log("Raise hand active: %s", log:log, Utilities.toMri(raiseHand.identifier))
        }
    }
}    
```
The `RaisedHandReceived` and `LoweredHandReceived` events contain an object with the `identifier` property, which represents the participant's communication identifier. In the example above, we log a message to the console indicating that a participant has raised their hand.

To unsubscribe from the events, you can use the `off` method.


### List of all participants with active state
To get information about all participants that have raised hand state on current call, you can use the `getRaisedHands` api. he returned array is sorted by the order field.
Here's an example of how to use the `raisedHands` API:
```swift
raisehandFeature = self.call!.feature(Features.raiseHand)
raisehandFeature.raisedHands.forEach { raiseHand in
    os_log("Raise hand active: %s", log:log, Utilities.toMri(raiseHand.identifier))
}
```

### Order of raised Hands
The `raisedHands` variable will contain an array of participant objects, where each object has the following properties:
`identifier`: the communication identifier of the participant
`order`: the order in which the participant raised their hand
You can use this information to display a list of participants with the Raise Hand state and their order in the queue.```
