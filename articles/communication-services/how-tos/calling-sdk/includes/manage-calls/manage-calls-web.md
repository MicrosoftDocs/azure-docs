---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Place a call

To create and start a call, use one of the APIs on `callAgent` and provide a user that you've created through the Communication Services identity SDK.

Call creation and start are synchronous. The `call` instance allows you to subscribe to call events.

### Place a 1:n call to a user or PSTN

To call another Communication Services user, use the `startCall` method on `callAgent` and pass the recipient's `CommunicationUserIdentifier` that you [created with the Communication Services administration library](../../../../quickstarts/identity/access-tokens.md).

For a 1:1 call to a user, use the following code:

```js
const userCallee = { communicationUserId: '<ACS_USER_ID>' }
const oneToOneCall = callAgent.startCall([userCallee]);
```

To place a call to a public switched telephone network (PSTN), use the `startCall` method on `callAgent` and pass the recipient's `PhoneNumberIdentifier`. Your Communication Services resource must be configured to allow PSTN calling.

When you call a PSTN number, specify your alternate caller ID. An alternate caller ID is a phone number (based on the E.164 standard) that identifies the caller in a PSTN call. It's the phone number the call recipient sees for an incoming call.

> [!NOTE]
> Please check [details of PSTN calling offering](../../../../concepts/numbers/sub-eligibility-number-capability.md). For preview program access, [apply to the early adopter program](https://aka.ms/ACS-EarlyAdopter).

For a 1:1 call to a PSTN number, use the following code:
```js
const pstnCallee = { phoneNumber: '<ACS_USER_ID>' }
const alternateCallerId = {phoneNumber: '<ALTERNATE_CALLER_ID>'};
const oneToOneCall = callAgent.startCall([pstnCallee], {alternateCallerId});
```

For a 1:n call to a user and a PSTN number, use the following code:

```js
const userCallee = { communicationUserId: '<ACS_USER_ID>' }
const pstnCallee = { phoneNumber: '<PHONE_NUMBER>'};
const alternateCallerId = {phoneNumber: '<ALTERNATE_CALLER_ID>'};
const groupCall = callAgent.startCall([userCallee, pstnCallee], {alternateCallerId});
```

### Join a room call

To join a `room` call, you can instantiate a context object with the `roomId` property as the `room` identifier. To join the call, use the `join` method and pass the context instance.

```js
const context = { roomId: '<RoomId>' }
const call = callAgent.join(context);
```

A `room` offers application developers better control over **who** can join a call, **when** they meet and **how** they collaborate. To learn more about `rooms`, you can read the [conceptual documentation](../../../../concepts/rooms/room-concept.md) or follow the [quick start guide](../../../../quickstarts/rooms/join-rooms-call.md).

### Join a group call

> [!NOTE]
> The `groupId` parameter is considered system metadata and may be used by Microsoft for operations that are required to run the system. Don't include personal data in the `groupId` value. Microsoft doesn't treat this parameter as personal data and its content may be visible to Microsoft employees or stored long-term.
>
> The `groupId` parameter requires data to be in GUID format. We recommend using randomly generated GUIDs that aren't considered personal data in your systems.
>

To start a new group call or join an ongoing group call, use the `join` method and pass an object with a `groupId` property. The `groupId` value has to be a GUID.

```js
const context = { groupId: '<GUID>'};
const call = callAgent.join(context);
```

## Receive an incoming call

The `callAgent` instance emits an `incomingCall` event when the logged-in identity receives an incoming call. To listen to this event, subscribe by using one of these options:

```js
const incomingCallHandler = async (args: { incomingCall: IncomingCall }) => {
    const incomingCall = args.incomingCall;

    // Get incoming call ID
    var incomingCallId = incomingCall.id

    // Get information about this Call. This API is provided as a preview for developers
    // and may change based on feedback that we receive. Do not use this API in a production environment.
    // To use this api please use 'beta' release of Azure Communication Services Calling Web SDK
    var callInfo = incomingCall.info;

    // Get information about caller
    var callerInfo = incomingCall.callerInfo

    // Accept the call
    var call = await incomingCall.accept();

    // Reject the call
    incomingCall.reject();

    // Subscribe to callEnded event and get the call end reason
     incomingCall.on('callEnded', args => {
        console.log(args.callEndReason);
    });

    // callEndReason is also a property of IncomingCall
    var callEndReason = incomingCall.callEndReason;
};
callAgentInstance.on('incomingCall', incomingCallHandler);
```

The `incomingCall` event includes an `incomingCall` instance that you can accept or reject.

When starting/joining/accepting a call with video on, if the specified video camera device is being used by another process or if it's disabled in the system, the call starts with video off, and a cameraStartFailed: true call diagnostic will be raised.

## Hold and resume call

> [!NOTE]
> At any given moment of time, there should be only 1 active call (in `Connected` state, with active media). All other calls should be put on hold by a user, or programatically by application. This is common in scenarios like contact centers, where a user may need to handle multiple outbound and inbound calls, all inactive calls should be put on hold, and user should interact with others only in active call

To hold or resume the call, you can use the `hold` and `resume` asynchronous APIs:

To hold the call
```js
await call.hold();
```
When `hold` API will resolve, call state will be set to 'LocalHold' , if this is a 1:1 call, other participant will be also put on hold, and state of the call from the perspective of that participant will be set to 'RemoteHold', That participant may further put its call on hold, which would result in state change to 'LocalHold'
If this is a group call - hold is just a local operation, it won't hold the call for other participants of that call.
To fully resume that call all users who initiated hold must resume it.

To resume call from hold:
```
await call.resume();
```
When `resume` API will resolve, call state will be set again to 'Connected'

## Mute and unmute

To mute or unmute the local endpoint, you can use the `mute` and `unmute` asynchronous APIs:

```js
//mute local device (microphone / sent audio)
await call.mute();

//unmute local device (microphone / sent audio)
await call.unmute();
```

## Mute and unmute incoming audio

Mute incoming audio sets the call volume to 0. To mute or unmute the incoming audio, you can use the `muteIncomingAudio` and `unmuteIncomingAudio` asynchronous APIs:

```js
//mute local device (speaker)
await call.muteIncomingAudio();

//unmute local device (speaker)
await call.unmuteIncomingAudio();
```

When incoming audio is muted, the participant will still receive the call audio (remote participant's audio). The call audio won't play in the speaker and the participant won't be able to listen until 'call.unmuteIncomingAudio()' is called. However, we can apply filter on call audio and play the filtered audio.

## Mute other participants
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. To use this api please use 'beta' release of Azure Communication Services Calling Web SDK version 1.18.1 or higher

To mute all other participants or mute a specific participant, you can use the asynchronous APIs `muteAllRemoteParticipants` on the call and `mute` on the remote participant:

```js
//mute all participants except yourself
await call.muteAllRemoteParticipants();

//mute a specific participant
await call.remoteParticipants[0].mute();
```

## Manage remote participants

All remote participants are represented by `RemoteParticipant` type and available through `remoteParticipants` collection on a call instance.

### List the participants in a call

The `remoteParticipants` collection returns a list of remote participants in a call:

```js
call.remoteParticipants; // [remoteParticipant, remoteParticipant....]
```

### Add a participant to a call

To add a participant (either a user or a phone number) to a call, you can use `addParticipant`. Provide one of the `Identifier` types. It synchronously returns the `remoteParticipant` instance. The `remoteParticipantsUpdated` event from Call is raised when a participant is successfully added to the call.

```js
const userIdentifier = { communicationUserId: '<ACS_USER_ID>' };
const pstnIdentifier = { phoneNumber: '<PHONE_NUMBER>' }
const remoteParticipant = call.addParticipant(userIdentifier);
const remoteParticipant = call.addParticipant(pstnIdentifier, {alternateCallerId: '<ALTERNATE_CALLER_ID>'});
```

### Remove a participant from a call

To remove a participant (either a user or a phone number) from a call, you can invoke `removeParticipant`. You have to pass one of the `Identifier` types. This method resolves asynchronously after the participant is removed from the call. The participant is also removed from the `remoteParticipants` collection.

```js
const userIdentifier = { communicationUserId: '<ACS_USER_ID>' };
const pstnIdentifier = { phoneNumber: '<PHONE_NUMBER>' }
await call.removeParticipant(userIdentifier);
await call.removeParticipant(pstnIdentifier);
```

### Access remote participant properties

Remote participants have a set of associated properties and collections:

- `CommunicationIdentifier`: Get the identifier for a remote participant. Identity is one of the `CommunicationIdentifier` types:

    ```js
    const identifier = remoteParticipant.identifier;
    ```

It can be one of the following `CommunicationIdentifier` types:

- `{ communicationUserId: '<ACS_USER_ID'> }`: Object representing the Azure Communication Services user.
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
    Note:
    - This property is only set when adding a remote participant via the Call.addParticipant() API, and the remote participant declines for example.
    - In the scenario, where for example, UserB kicks UserC, from UserA's perspective, UserA won't see this flag get set for UserC. In other words UserA won't see UserC's callEndReason property get set at all.

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

Retrieve the thread ID if joining a Teams meeting:

```js
const threadId: string | undefined = call.threadId;
```

Get information about the call:
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. To use this api please use 'beta' release of Azure Communication Services Calling Web SDK
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
- `Ringing`: For an outgoing call, indicates that a call is ringing for remote participants. It's `Incoming` on their side.
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

Inspect active video streams and active screen sharing streams by checking the `localVideoStreams` collection. It returns `LocalVideoStream` objects or type `Video`, `ScreenSharing` or `RawMedia`.

```js
const localVideoStreams = call.localVideoStreams;
```

Check if the current microphone is muted. It returns `Boolean`.

```js
const muted = call.isMuted;
```

Check if the current incoming audio (speaker) is muted. It returns `Boolean`.

```js
const incomingAudioMuted = call._isIncomingAudioMuted;
```

Check if video is on. It returns `Boolean`.

```js
const isLocalVideoStarted = call.isLocalVideoStarted;
```

Check is screen sharing is on. It returns `Boolean`.

```js
const isScreenSharingOn = call.isScreenSharingOn;
```
## Send or receive a reaction from other participants
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. To use this api please use 'beta' release of Azure Communication Services Calling Web SDK version 1.18.1 or higher

Within ACS you can send and receive reactions when on a group call:
- Like :+1:
- Love :heart:
- Applause :clap:
- Laugh :smile:
- Surprise :open_mouth:

To send a reaction you'll use the `sendReaction(reactionMessage)` API. To receive a reaction message will be built with Type `ReactionMessage` which uses `Reaction` enums as an attribute. 

You'll need to subscribe for events which provide the subscriber event data as:
```javascript
export interface ReactionEventPayload {
    /**
     * identifier for a participant
     */
    identifier: CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier;
    /**
     * reaction type received
     */
    reactionMessage: ReactionMessage;
}
```

You can determine which reaction is coming from which participant with `identifier` attribute and gets the reaction type from `ReactionMessage`. 

### Sample on how to send a reaction in a meeting
```javascript
const reaction = call.feature(SDK.Features.Reaction);
const reactionMessage: SDK.ReactionMessage = {
       reactionType: 'like'
};
await reaction.sendReaction(reactionMessage);
```

### Sample on how to receive a reaction in a meeting
```javascript
const reaction = call.feature(SDK.Features.Reaction);
reaction.on('reaction', event => {
    // user identifier
    console.log("User Mri - " + event.identifier);
    // received reaction
    console.log("User Mri - " + event.reactionMessage.name);
    // reaction message
    console.log("reaction message - " + JSON.stringify(event.reactionMessage));
}
```

### Key things to note about using Reactions:
- Reactions won't work if the meeting organizer updates the meeting policy to disallow the reaction in a Teams interop call.
- Sending of reactions doesn't work on 1:1 calls.
