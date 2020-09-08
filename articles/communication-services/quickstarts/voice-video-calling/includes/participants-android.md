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
```java

Call call = callClient.call(participants, callOptions);
RemoteParticipant remoteParticipant = call.addParticipant("userId");

```

## Get all participants on call

In order to manage participants, retrieve all participants on call by using the `remoteParticipants` property of the `Call` object.
```java

RemoteParticipant[] remoteParticipants = call.getRemoteParticipants();

```

Remote participants hold the following properties:
```java

// [String] userId - same as the one used to provision token for another user
String userId = remoteParticipant.getIdentity();

// ParticipantState.Idle = 0, ParticipantState.EarlyMedia = 1, ParticipantState.Connecting = 2, ParticipantState.Connected = 3, ParticipantState.OnHold = 4, ParticipantState.InLobby = 5, ParticipantState.Disconnected = 6
ParticipantState state = remoteParticipant.getState();

// [boolean] isMuted - indicating if participant is muted
boolean isParticipantMuted = remoteParticipant.getIsMuted();

// [boolean] isSpeaking - indicating if participant is currently speaking
boolean isParticipantSpeaking = remoteParticipant.getIsSpeaking();

// List<RemoteVideoStream> - collection of video streams this participants has
List<RemoteVideoStream> videoStreams = remoteParticipant.getVideoStreams(); // [RemoteVideoStream, RemoteVideoStream, ...]

// List<RemoteVideoStream> - collection of screen sharing streams this participants has
List<RemoteVideoStream> screenSharingStreams = remoteParticipant.getScreenSharingStreams(); // [RemoteVideoStream, RemoteVideoStream, ...]

// [AcsError] callEndReason - containing code/subcode/message indicating how call ended
AcsError callEndReason = remoteParticipant.getCallEndReason();

```

## Remove participants from call

Using the list of participants above, you can take a participant from the list and remove them from the call using the `removeParticipant` method for the `Call` object
```java

RemoteParticipant remoteParticipant = call.getParticipants().get(0);
Future removeParticipantTask = call.removeParticipant(remoteParticipant);
removeParticipantTask.get();

```

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You can find out more about cleaning up resources [here](../../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:
- Check out our calling hero sample [here](../../../samples/calling-hero-sample.md)
- Learn how to add video to your calls [here](../add-video-to-app.md)
- Learn how to manage call devices [here](../manage-devices.md)
- Learn more about how calling works [here](../../../concepts/voice-video-calling/about-call-types.md)
