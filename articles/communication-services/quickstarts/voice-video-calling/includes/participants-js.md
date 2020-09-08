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

```javascript

const call = callClient.call(['acsUserId'], {});
const remoteParticipant = call.addParticipant('acsId');
const remoteParticipant = call.addParticipant('+123456789');

```

## Get all participants on call

In order to manage participants, retrieve all participants on call by using the `remoteParticipants` property of the `Call` object.

```javascript

call.remoteParticipants; // [remoteParticipant, remoteParticipant....]

```

Remote participants hold the following properties:
```javascript

const identity: string = remoteParticipant.identity;

identity.id = 'acsId' | 'phoneNumber'; // can be either ACS Id or a phone number
identity.type = 'user' | 'phoneNumber';

const state: string = remoteParticipant.state; // one of 'Idle' | 'Connecting' | 'Connected' | 'OnHold' | 'InLobby' | 'EarlyMedia' | 'Disconnected';

const callEndReason: AcsEndReason = remoteParticipant.callEndReason; // reason why participant left the call, contains code/subcode/message

const isMuted: boolean = remoteParticipant.isMuted; // indicates if participant is muted

const isSpeaking: boolean = remoteParticipant.isSpeaking; // indicates if participant is speaking

const videoStreams: RemoteVideoStream[] = remoteParticipant.videoStreams; // collection of video streams this participants has [RemoteVideoStream, RemoteVideoStream, ...]

const screenSharingStreams: RemoteVideoStream[] = remoteParticipant.screenSharingStreams; // collection of screen sharing streams this participants has, [RemoteVideoStream, RemoteVideoStream, ...]

```

## Remove participants from call

Using the list of participants above, you can take a participant from the list and remove them from the call using the `removeParticipant` method for the `Call` object

```javascript

let participantToRemove = call.remoteParticipants[0];
await call.removeParticipant(participantToRemove);

```

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You can find out more about cleaning up resources [here](../../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:
- Check out our calling hero sample [here](../../../samples/calling-hero-sample.md)
- Learn how to add video to your calls [here](../add-video-to-app.md)
- Learn how to manage call devices [here](../manage-devices.md)
- Learn more about how calling works [here](../../../concepts/voice-video-calling/about-call-types.md)
