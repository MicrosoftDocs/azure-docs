---
author: xixian73
ms.service: azure-communication-services
ms.topic: include
ms.date: 12/02/2021
ms.author: xixian
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Place a call

To create and start a call, use one of the APIs on `callAgent` and provide a user that you want to place a call with. 

Call creation and start are synchronous. The `call` instance allows you to subscribe to call events.

> [!NOTE]
> Place a call with custom Teams application requires chat `threadId` when calling `startCall` method on `callAgent`. Each call in Teams has an associated chat thread. When Teams user accepts the call, the property `threadId` defines, which chat is displayed as part of the call. Read more on [how to create chat thread Id](/graph/api/chat-post?preserve-view=true&tabs=javascript&view=graph-rest-1.0#example-2-create-a-group-chat). The chat's roster is not managed by Calling SDK and must be managed by developers to be in sync with Calling roster. Learn how to [manage chat thread](#manage-chat-thread). 
### Place a 1:n call to a user or PSTN

To call another Teams user, use the `startCall` method on `callAgent` and pass the recipient's `MicrosoftTeamsUserIdentifier` that you [created with the Communication Services administration library](../../../../quickstarts/manage-teams-identity.md).

For a 1:1 call to a user, use the following code:

```js
const userCallee = { microsoftTeamsUserId: '<MICROSOFT_TEAMS_USER_ID>' }
const oneToOneCall = callAgent.startCall([userCallee], { threadId: '<THREAD_ID>' });
```

To place a call to a public switched telephone network (PSTN), use the `startCall` method on `callAgent` and pass the recipient's `PhoneNumberIdentifier` and `threadId` for a chat thread between caller and recipient. Your Communication Services resource must be configured to allow PSTN calling.

> [!NOTE]
> PSTN calling is currently in public preview with the Azure terms of use. The startCall method requires a chat ID to be provided. For 1:1 PSTN calls, use the string "00000000-0000-0000-0000-000000000000" as chat ID. If you escalate the call by adding another PSTN participant, or if you start a group call with only PSTN participants uses Graph API to create a group chat. The group chat would have 2 participants: Teams user ID and "00000000-0000-0000-0000-000000000000". This will result in a group chat with only 1 participant, the Teams user. If you start a call with at least 1 other Teams user, create a 1:1 or group chat with Teams users (don't include "00000000-0000-0000-0000-000000000000"). You can learn more about chat ID in the section Manage chat thread.
 
For a 1:1 call to a PSTN number, use the following code:
```js
const pstnCallee = { phoneNumber: '<PHONE_NUMBER_E164_FORMAT>' }
const oneToOneCall = callAgent.startCall([pstnCallee], { threadId: 'THREAD_ID' });
```

For a 1:n call to a user and a PSTN number, use the following code:

```js
const userCallee = { microsoftTeamsUserId: '<MICROSOFT_TEAMS_USER_ID>' }
const pstnCallee = { phoneNumber: '<PHONE_NUMBER_E164_FORMAT>'};
const groupCall = callAgent.startCall([userCallee, pstnCallee], { threadId: '<THREAD_ID>' });
```

## Join a call

### Join a group call

> [!NOTE]
> Join a group call is not supported for custom Teams application at the moment.
### Join a Teams meeting

To join a Teams meeting, use the `join` method on `callAgent` and pass either one of the following:
1. `meetingLink`
2. Combination of `threadId`, `organizerId`, `tenantId`, `messageId`

#### Join using `meetingLink`
```js
const meetingCall = callAgent.join({ meetingLink: '<MEETING_LINK>' });
```

#### Join using the combination of `threadId`, `organizerId`, `tenantId`, and `messageId`
```js
const meetingCall = callAgent.join({ threadId: '<THREAD_ID>', organizerId: '<ORGANIZER_ID>', tenantId: '<TENANT_ID>', messageId: '<MESSAGE_ID>' });
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

When starting/joining/accepting a call with video on, if the specified video camera device is being used by another process or if it is disabled in the system, the call will start with video off, and a cameraStartFailed: true call diagnostic will be raised.

## Mute and unmute

To mute or unmute the local endpoint, you can use the `mute` and `unmute` asynchronous APIs:

```js
//mute local device
await call.mute();
//unmute local device
await call.unmute();
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

> [!NOTE]
> Chat `threadId` is required when adding a participant to a call. Learn more about [how to get chat thread id](/graph/api/chat-post?preserve-view=true&tabs=javascript&view=graph-rest-1.0#example-2-create-a-group-chat). Applications will need to manage their chat thread participants separate from call participants. Learn how to [manage chat thread](#manage-chat-thread).

```js
const userIdentifier = { microsoftTeamsUserId: '<MICROSOFT_TEAMS_USER_ID>' };
const pstnIdentifier = { phoneNumber: '<PHONE_NUMBER_E164_FORMAT>' }
const remoteParticipant = call.addParticipant(userIdentifier, { threadId: '<THREAD_ID>' });
const remoteParticipant = call.addParticipant(pstnIdentifier, { threadId: '<THREAD_ID>' });
```

### Remove a participant from a call

To remove a participant (either a user or a phone number) from a call, you can invoke `removeParticipant`. Pass one of the `Identifier` types as a parameter. This method resolves asynchronously after the participant is removed from the call. The participant is also removed from the `remoteParticipants` collection.

```js
const userIdentifier = { microsoftTeamsUserId: '<MICROSOFT_TEAMS_USER_ID>' };
const pstnIdentifier = { phoneNumber: '<PHONE_NUMBER_E164_FORMAT>' }
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
- `{ id: string }`: an object representing the identifier that doesn't fit any of the other identifier types

- `state`: Get the state of a remote participant.

    ```js
    const state = remoteParticipant.state;
    ```

The state can be:

- `Idle`: Initial state.
- `Connecting`: Transition state while a participant is connecting to the call.
- `Ringing`: Participant is ringing.
- `Connected`: The participant is connected to the call.
- `Hold`: Participant is on hold.
- `EarlyMedia`: Announcement that plays before a participant connects to the call.
- `InLobby`: Indicates that remote participant is in the lobby.
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
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this API please use the 'beta' release of Azure Communication Services Calling Web SDK
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

This property returns a string representing the current state of a call:

- `None`: Initial call state.
- `Connecting`: Initial transition state when a call is placed or accepted.
- `Ringing`: For an outgoing call, indicates that a call is ringing for remote participants. It is `Incoming` on their side.
- `EarlyMedia`: Indicates a state in which an announcement is played before the call is connected.
- `Connected`: Indicates that the call is connected.
- `LocalHold`: Indicates that the call is put on hold by a local participant. No media is flowing between the local endpoint and remote participants.
- `RemoteHold`: Indicates that the call was put on hold by the remote participant. No media is flowing between the local endpoint and remote participants.
- `InLobby`: Indicates that the user is in the lobby.
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

## Manage chat thread
Providing a chat ID is mandatory for making calls and adding participants to an existing call. Developers keep chat and call rosters in sync. Consider the following scenario, where Alice makes a call to Bob, then Alice adds Charlie, and 3 minutes later, Alice removes Charlie from the call.

1. Create a chat thread between Alice and Bob, record `threadId`
1. Alice calls Bob using `startCall` method on `callAgent` and specifies the `threadId`
1. Add Charlie to chat thread with `threadId` using [Chat Graph API to add member](/graph/api/chat-post-members?tabs=http&view=graph-rest-1.0)
1. Alice adds Charlie to the call using `addParticipant` method on `call` and specifies the `threadId`
1. Alice removes Charlie from the call using `removeParticipant` method on `call` and specifies the `threadId`
1. Remove Charlie from chat thread with `threadId` using [Chat Graph API to remove member](/graph/api/chat-delete-members?tabs=http&view=graph-rest-1.0)

If Teams user stops call recording, the recording is placed into chat associated with the thread. Provided chat ID impacts the experience of Teams users in Teams clients.

Recommendations for the management of chat ID:
- 1:1 PSTN calls: Use string "00000000-0000-0000-0000-000000000000" as chat ID. 
- Escalation of the 1:1 PSTN call by adding another PSTN participant: Use Graph API to get existing chat ID with only Teams user as a participant or create a new group chat with participants: Teams user ID and "00000000-0000-0000-0000-000000000000"
- Group call with only 1 Teams user and N PSTN participant: Use Graph API to get existing chat ID with only Teams user as a participant or create a new group chat with participants: Teams user ID and "00000000-0000-0000-0000-000000000000"
- 1:1 VoIP call: Use Graph API to get or create 1:1 chat with the Teams users
- Group call with more than 2 Teams users: Use Graph API to get or create a group chat with the Teams users 
