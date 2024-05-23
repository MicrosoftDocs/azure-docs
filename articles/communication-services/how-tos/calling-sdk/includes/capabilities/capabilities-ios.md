---
author: DaybreakQuip
ms.service: azure-communication-services
ms.topic: include
ms.date: 05/21/2024
ms.author: zehangzheng
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-ios.md)]
[!INCLUDE [Public Preview Disclaimer](../../../../includes/public-preview-include-document.md)]

Capabilities feature is an extended feature of the core `Call` API and allows you to obtain the capabilities of the local participant in the current call.

The feature allows you to register for an event listener, to listen to capability changes.

In order to use the Capabilities call feature for Windows, the first step is to obtain the Capabilities feature API object:

## Obtaining capabilities feature
```swift
let capabilitiesCallFeature =call.feature(Features.capabilities)
```

## Get the capabilities of the local participant
Capabilities object has the capabilities of the local participants and is of type `ParticipantCapability`. Properties of Capabilities include:

- *isAllowed* indicates if a capability can be used.
- *reason* indicates capability resolution reason.

```swift
var capabilities = capabilitiesCallFeature.capabilities
```

## Subscribe to `capabilitiesChanged` event
```swift

capabilitiesCallFeature.delegate = CapabilitiesCallDelegate()

public class CapabilitiesCallDelegate : CapabilitiesCallFeatureDelegate
{
    public func capabilitiesCallFeature(_ capabilitiesCallFeature: CapabilitiesCallFeature, didChangeCapabilities args: CapabilitiesChangedEventArgs) {
        let changedReason = args.reason
        let changedCapabilities = args.changedCapabilities
    }
}
```

## Capabilities Exposed
- *TurnVideoOn*: Ability to turn video on
- *UnmuteMicrophone*: Ability to unmute microphone
- *ShareScreen*: Ability to share screen
- *RemoveParticipant*: Ability to remove a participant
- *HangUpForEveryone*: Ability to hang up for everyone
- *AddCommunicationUser*: Ability to add a communication user
- *AddTeamsUser*: Ability to add Teams User
- *AddPhoneNumber*: Ability to add phone number
- *ManageLobby*: Ability to manage lobby
- *SpotlightParticipant*: Ability to spotlight Participant
- *RemoveParticipantSpotlight*: Ability to remove Participant spotlight
- *BlurBackground*: Ability to blur background
- *CustomBackground*: Ability to apply a custom background
- *StartLiveCaptions*: Ability to start live captions
- *RaiseHand*: Ability to raise hand