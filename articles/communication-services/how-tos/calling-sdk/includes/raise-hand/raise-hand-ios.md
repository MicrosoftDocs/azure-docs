---
author: ruslanzdor
ms.service: azure-communication-services
ms.topic: include
ms.date: 02/06/2022
ms.author: ruslanzdor
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-ios.md)]

> [!NOTE]
> Raise Hand API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of Azure Communication Services Calling Web SDK

Raise Hand is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:

```swift
import AzureCommunicationCalling
```

Then you can get the feature API object from the call instance:

```swift
@State var raisehandFeature: RaiseHandCallFeature?

raiseHandFeature = self.call!.feature(Features.raiseHand)
```

### Raise and lower hand for current participant:
Raise Hand state can be used in any call type: on 1:1 calls and on calls with many participants, in ACS and in Teams calls.
If it Teams meeting - organizer will have ability to enable or disable raise hand states for all participants.
To change state for current participant, you can use methods:
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
Currently ACS calls aren't allowed to change state of other participants, for example, lower all hands. But Teams calls allow it using these methods:
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
The `Raise Hand` API allows you to subscribe to `didReceiveRaisedHand` and `didReceiveLoweredHand` events. Event comes from a `call` instance and contain information about participant and new state.
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

### List of all participants with active state
To get information about all participants that have Raise Hand state on current call, you can use this api array is sorted by order field:
```swift
raisehandFeature = self.call!.feature(Features.raiseHand)
raisehandFeature.raisedHands.forEach { raiseHand in
    os_log("Raise hand active: %s", log:log, Utilities.toMri(raiseHand.identifier))
}
```

### Order of raised Hands
It possible to get order of all raised hand states on the call, order is started from 1 and will be sorted.
There are two ways: get all raise hand state on the call or use `didReceiveRaisedHand` event subscription.
In event subscription when any participant will lower a hand - call will generate only one event, but not for all participants with order above.

```swift
raisehandFeature = self.call!.feature(Features.raiseHand)
raisehandFeature.raisedHands.forEach { raiseHand in
    os_log("Raise hand active: %s with order %d", log:log, Utilities.toMri(raiseHand.identifier), raiseHand.order)
}
```
