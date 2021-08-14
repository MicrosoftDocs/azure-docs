## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../../../quickstarts/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../../../quickstarts/voice-video-calling/getting-started-with-calling.md)

[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

### Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name                                | Description                                                                                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `CallClient`                        | The main entry point to the Calling SDK.                                                                                                 |
| `AzureCommunicationTokenCredential` | Implements the `CommunicationTokenCredential` interface, which is used to instantiate `callAgent`.                                       |
| `CallAgent`                         | Used to start and manage calls.                                                                                                          |
| `DeviceManager`                     | Used to manage media devices.                                                                                                            |
| `Call`                              | Used for representing a Call                                                                                                              |
| `LocalVideoStream`                  | Used for creating a local video stream for a camera device on the local system.                                                          |
| `RemoteParticipant`                 | Used for representing a remote participant in the Call                                                                                   |
| `RemoteVideoStream`                 | Used for representing a remote video stream from a Remote Participant.                                                                  |

> [!NOTE]
> The Calling SDK object instances shouldn't be considered to be a plain JavaScript objects. These are actual instances of various classes and therefore can't be serialized.

## Place a call

To create and start a call, use one of the APIs on `callAgent` and provide a user that you've created through the Communication Services identity SDK.

Call creation and start are synchronous. The `call` instance allows you to subscribe to call events.

### Place a 1:n call to a user or PSTN

To call another Communication Services user, use the `startCall` method on `callAgent` and pass the recipient's `CommunicationUserIdentifier` that you [created with the Communication Services administration library](../../../../quickstarts/access-tokens.md).

For a 1:1 call to a user, use the following code:

```js
const userCallee = { communicationUserId: '<ACS_USER_ID>' }
const oneToOneCall = callAgent.startCall([userCallee]);
```

To place a call to a public switched telephone network (PSTN), use the `startCall` method on `callAgent` and pass the recipient's `PhoneNumberIdentifier`. Your Communication Services resource must be configured to allow PSTN calling.

When you call a PSTN number, specify your alternate caller ID. An alternate caller ID is a phone number (based on the E.164 standard) that identifies the caller in a PSTN call. It's the phone number the call recipient sees for an incoming call.

> [!NOTE]
> PSTN calling is currently in private preview. For access, [apply to the early adopter program](https://aka.ms/ACS-EarlyAdopter).

For a 1:1 call to a PSTN number, use the following code:
```js
const pstnCallee = { phoneNumber: '<ACS_USER_ID>' }
const alternateCallerId = {alternateCallerId: '<ALTERNATE_CALLER_ID>'};
const oneToOneCall = callAgent.startCall([pstnCallee], {alternateCallerId});
```

For a 1:n call to a user and a PSTN number, use the following code:

```js
const userCallee = { communicationUserId: '<ACS_USER_ID>' }
const pstnCallee = { phoneNumber: '<PHONE_NUMBER>'};
const alternateCallerId = {alternateCallerId: '<ALTERNATE_CALLER_ID>'};
const groupCall = callAgent.startCall([userCallee, pstnCallee], {alternateCallerId});
```

### Join a group call

> [!NOTE]
> The `groupId` parameter is considered system metadata and may be used by Microsoft for operations that are required to run the system. Don't include personal data in the `groupId` value. Microsoft doesn't treat this parameter as personal data and its content may be visible to Microsoft employees or stored long-term.
>
> The `groupId` parameter requires data to be in GUID format. We recommend using randomly generated GUIDs that aren't considered personal data in your systems.
>

To start a new group call or join an ongoing group call, use the `join` method and pass an object with a `groupId` property. The `groupId` value has to be a GUID.

```js
const context = { groupId: '<GUID>'}
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
    // To use this api please use 'beta' release of ACS Calling Web SDK
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

TODO: See Call Diagnostics section to see how to handle this call diagnostic.

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
