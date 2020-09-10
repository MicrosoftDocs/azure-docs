---
author: mikben
ms.service: azure-communication-services
ms.topic: include
ms.date: 9/1/2020
ms.author: mikben
---
> [!WARNING]
> This document is under construction and needs the following items to be addressed: 
> - note the "raw materials" located in `calling-client-samples`

Get started with Azure Communication Services by using the Communication Services client library to manage your VoIP and PSTN call participants.

## Prerequisites
To be able to place an outgoing telephone call, you need following:
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- An Azure Communication Service resource. Further details can be found in the [Create an Azure Communication Resource](../../create-communication-resource.md) quickstart.
- Complete the quickstart for adding calling to your application [here](../getting-started-with-calling.md)

## Add participants to call

To add more participants to an ongoing call, use the `addParticipant` method. This method can be used to either add a phone number to the call or add another Azure Communication Services user.
```swift

let call = self.CallingApp.adHocCallClient.callWithParticipants(participants: ['acsUserId'], options: placeCallOptions);
ACSRemoteParticipant* remoteParticipant = self.call.addParticipant("userId"); //Using User ID
ACSRemoteParticipant* remoteParticipant = self.call.addParticipant("123456789"); // Using PSTN

```

## Get all participants on call

In order to manage participants, retrieve all participants on call by using the `remoteParticipants` property of the `Call` object.
```swift

self.call.remoteParticipants // [remoteParticipant, remoteParticipant....]

```

Remote participants hold the following properties:
```swift

// [String] userId - same as the one used to provision token for another user
var userId = remoteParticipant.identity;

// ACSParticipantStateIdle = 0, ACSParticipantStateEarlyMedia = 1, ACSParticipantStateConnecting = 2, ACSParticipantStateConnected = 3, ACSParticipantStateOnHold = 4, ACSParticipantStateInLobby = 5, ACSParticipantStateDisconnected = 6
var state = remoteParticipant.state;

// [AcsEndReason] callEndReason - reason why participant left the call, contains code/subcode/message
var callEndReason = remoteParticipant.callEndReason

// [Bool] isMuted - indicating if participant is muted
var isMuted = remoteParticipant.isMuted;

// [Bool] isSpeaking - indicating if participant is currently speaking
var isSpeaking = remoteParticipant.isSpeaking;

// ACSRemoteVideoStream[] - collection of video streams this participants has
var videoStreams = remoteParticipant.videoStreams; // [ACSRemoteVideoStream, ACSRemoteVideoStream, ...]

// ACSRemoteVideoStream[] - collection of screen sharing streams this participants has
var screenSharingStreams = remoteParticipant.screenSharingStreams; // [ACSRemoteVideoStream, Communication ServicesRemoteVideoStream, ...]

```

## Remove participants from call

Using the list of participants above, you can take a participant from the list and remove them from the call using the `removeParticipant` method for the `Call` object

```swift
let toRemove = self.call.remoteParticipants[0]
call.removeParticipant(participant: toRemove, completionHandler: ((error: Error?) -> Void))

```

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You can find out more about cleaning up resources [here](../../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:
- Check out our calling hero sample [here](../../../samples/calling-hero-sample.md)
- Learn how to add video to your calls [here](../add-video-to-app.md)
- Learn how to manage call devices [here](../manage-devices.md)
- Learn more about how calling works [here](../../../concepts/voice-video-calling/about-call-types.md)
