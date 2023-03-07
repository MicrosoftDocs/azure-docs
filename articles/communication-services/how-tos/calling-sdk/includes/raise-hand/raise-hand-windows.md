---
author: ruslanzdor
ms.service: azure-communication-services
ms.topic: include
ms.date: 02/06/2022
ms.author: ruslanzdor
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

> [!NOTE]
> Raise Hand API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of Azure Communication Services Calling Web SDK

Raise Hand is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:

```csharp
using Azure.Communication.Calling.WindowsClient;
```

Then you can get the feature API object from the call instance:

```csharp
private RaiseHandCallFeature raiseHandCallFeature;

raiseHandCallFeature = (RaiseHandCallFeature)call.GetCallFeatureExtension(CallFeatureType.RaiseHand);
```

### Raise and lower hand for current participant:
Raise Hand state can be used in any call type: on 1:1 calls and on calls with many participants, in ACS and in Teams calls.
If it Teams meeting - organizer will have ability to enable or disable raise hand states for all participants.
To change state for current participant, you can use methods:
```csharp
//publish raise hand state for local participant
raiseHandCallFeature.RaiseHandAsync();

//remove raise hand state for local participant
raiseHandCallFeature.LowerHandAsync();

```

### Lower hands for other participants
Currently ACS calls aren't allowed to change state of other participants, for example, lower all hands. But Teams calls allow it using these methods:
```csharp

// remove raise hand states for all participants on the call
raiseHandCallFeature.LowerHandForEveryoneAsync();

// remove raise hand states for all remote participants on the call
var participants = call.RemoteParticipants;
var identifiers = participants.Select(p => p.Identifier).ToList().AsReadOnly();
raiseHandCallFeature.LowerHandAsync(identifiers);

// remove raise hand state of specific user
var identifiers = new List<CallIdentifier>();
identifiers.Add(new UserCallIdentifier("USER_ID"));
raiseHandCallFeature.LowerHandAsync(identifiers);
```

### Handle changed states
The `Raise Hand` API allows you to subscribe to `didReceiveRaiseHandEvent` events. A `didReceiveRaiseHandEvent` event comes from a `call` instance and contain information about participant and new state.
```swift
raiseHandCallFeature = (RaiseHandCallFeature)call.GetCallFeatureExtension(CallFeatureType.RaiseHand);
raiseHandCallFeature.OnRaiseHandReceived += OnRaiseHandChange;

private async void OnRaiseHandChange(object sender, RaiseHandEvent raiseHandEvent)
{
    Trace.WriteLine("RaiseHandEvent: participant " + raiseHandEvent.Identifier + " is raised hand " + raiseHandEvent.IsRaised);
}
```

### List of all participants with active state
To get information about all participants that have Raise Hand state on current call, you can use this api array is sorted by order field:
```swift
raiseHandCallFeature = (RaiseHandCallFeature)call.GetCallFeatureExtension(CallFeatureType.RaiseHand);
foreach (RaiseHand rh in raiseHandCallFeature.Status.ToList())
{
    Trace.WriteLine("Participant " + rh.Identifier.RawId + " has raised hand ");
}
```

### Order of raised Hands
It possible to get order of all raised hand states on the call, order is started from 1 and will be sorted.
There are two ways: get all raise hand state on the call or use `didReceiveRaiseHandEvent` event subscription.
In event subscription when any participant will lower a hand - call will generate only one event, but not for all participants with order above.

```swift
raiseHandCallFeature = (RaiseHandCallFeature)call.GetCallFeatureExtension(CallFeatureType.RaiseHand);
foreach (RaiseHand rh in raiseHandCallFeature.Status.ToList())
{
    Trace.WriteLine(rh.Order + ". " + rh.Identifier.RawId);
}
```
