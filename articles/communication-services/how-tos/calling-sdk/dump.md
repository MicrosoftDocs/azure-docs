TODO: Should this be here?
### Access remote participant properties

Remote participants have a set of associated properties and collections:

- `CommunicationIdentifier`: Get the identifier for a remote participant. Identity is one of the `CommunicationIdentifier` types:

```js
const identifier = remoteParticipant.identifier;
```

It can be one of the following `CommunicationIdentifier` types:

- `{ communicationUserId: '<ACS_USER_ID'> }`: Object representing the ACS user.
- `{ phoneNumber: '<E.164>' }`: Object representing the phone number in E.164 format.
- `{ microsoftTeamsUserId: '<TEAMS_USER_ID>', isAnonymous?: boolean; cloud?: "public" | "dod" | "gcch" }`: Object representing the Teams user.
- `{ id: string }`: object representing identifier that doesn't fit any of the other identifier types

- `state`: Get the state of a remote participant.

```js
const state = remoteParticipant.state;
```

The state can be:

- `Idle`: Initial state.
- `Connecting`: Transition state while a participant is connecting to the call.
- `Ringing`: Participant is ringing.
- `Connected`: Participant is connected to the call.
- `Hold`: Participant is on hold.
- `EarlyMedia`: Announcement that plays before a participant connects to the call.
- `InLobby`: Indicates that remote participant is in lobby.
- `Disconnected`: Final state. The participant is disconnected from the call. If the remote participant loses their network connectivity, their state changes to `Disconnected` after two minutes.

- `callEndReason`: To learn why a participant left the call, check the `callEndReason` property:

```js
const callEndReason = remoteParticipant.callEndReason;
const callEndReasonCode = callEndReason.code // (number) code associated with the reason
const callEndReasonSubCode = callEndReason.subCode // (number) subCode associated with the reason
```

- `isMuted` status: To find out if a remote participant is muted, check the `isMuted` property. It returns `Boolean`.

```js
const isMuted = remoteParticipant.isMuted;
```

- `isSpeaking` status: To find out if a remote participant is speaking, check the `isSpeaking` property. It returns `Boolean`.

```js
const isSpeaking = remoteParticipant.isSpeaking;
```

- `videoStreams`: To inspect all video streams that a given participant is sending in this call, check the `videoStreams` collection. It contains `RemoteVideoStream` objects.

```js
const videoStreams = remoteParticipant.videoStreams; // [RemoteVideoStream, ...]
```
- `displayName`: To get display name for this remote participant, inspect `displayName` property it return string. 

```js
const displayName = remoteParticipant.displayName;
```

## Check call properties

Get the unique ID (string) for a call:

```js
const callId: string = call.id;
```
Get information about the call:
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK
```js
const callInfo = call.info;
```

Learn about other participants in the call by inspecting the `remoteParticipants` collection on the 'call' instance:

```js
const remoteParticipants = call.remoteParticipants;
```

Identify the caller of an incoming call:
```js
const callerIdentity = call.callerInfo.identifier;
```

`identifier` is one of the `CommunicationIdentifier` types.

Get the state of a call:

```js
const callState = call.state;
```

This returns a string representing the current state of a call:

- `None`: Initial call state.
- `Connecting`: Initial transition state when a call is placed or accepted.
- `Ringing`: For an outgoing call, indicates that a call is ringing for remote participants. It is `Incoming` on their side.
- `EarlyMedia`: Indicates a state in which an announcement is played before the call is connected.
- `Connected`: Indicates that the call is connected.
- `LocalHold`: Indicates that the call is put on hold by a local participant. No media is flowing between the local endpoint and remote participants.
- `RemoteHold`: Indicates that the call was put on hold by remote participant. No media is flowing between the local endpoint and remote participants.
- `InLobby`: Indicates that user is in lobby.
- `Disconnecting`: Transition state before the call goes to a `Disconnected` state.
- `Disconnected`: Final call state. If the network connection is lost, the state changes to `Disconnected` after two minutes.

Find out why a call ended by inspecting the `callEndReason` property:

```js
const callEndReason = call.callEndReason;
const callEndReasonCode = callEndReason.code // (number) code associated with the reason
const callEndReasonSubCode = callEndReason.subCode // (number) subCode associated with the reason
```

Learn if the current call is incoming or outgoing by inspecting the `direction` property. It returns `CallDirection`.

```js
const isIncoming = call.direction == 'Incoming';
const isOutgoing = call.direction == 'Outgoing';
```

Check if the current microphone is muted. It returns `Boolean`.

```js
const muted = call.isMuted;
```

Find out if the screen sharing stream is being sent from a given endpoint by checking the `isScreenSharingOn` property. It returns `Boolean`.

```js
const isScreenSharingOn = call.isScreenSharingOn;
```

Inspect active video streams by checking the `localVideoStreams` collection. It returns `LocalVideoStream` objects.

```js
const localVideoStreams = call.localVideoStreams;
```



## Documentation support
- [Submit issues/bugs on github](https://github.com/Azure/Communication/issues)
- [Sample Applications](../../../../samples/overview.md)
- [API Reference](/javascript/api/azure-communication-services/@azure/communication-calling/?preserve-view=true&view=azure-communication-services-js)