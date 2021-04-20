---
author: mikben
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/10/2021
ms.author: mikben
---
## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../getting-started-with-calling.md).

## Install the SDK

> [!NOTE]
> This document uses ACS Calling Web SDK.

Use the `npm install` command to install the Azure Communication Services calling and common SDKs for JavaScript.

```console
npm install @azure/communication-common --save
npm install @azure/communication-calling --save

```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name                             | Description                                                                                                                                 |
| ---------------------------------| ------------------------------------------------------------------------------------------------------------------------------------------- |
| `CallClient`                      | The main entry point to the Calling SDK.                                                                       |
| `CallAgent`                        | Used to start and manage calls.                                                                                            |
| `DeviceManager`                    | Used to manage media devices.                                                                                           |
| `AzureCommunicationTokenCredential` | Implements the `CommunicationTokenCredential` interface, which is used to instantiate `callAgent`. |

## Initialize a CallClient instance, create a CallAgent instance, and access deviceManager

Create a new `CallClient` instance. You can configure it with custom options like a Logger instance.

When you have a `CallClient` instance, you can create a `CallAgent` instance by calling the `createCallAgent` method on the `CallClient` instance. This asynchronously returns a `CallAgent` instance object.

The `createCallAgent` method uses `CommunicationTokenCredential` as an argument. It accepts a [user access token](../../access-tokens.md).

You can use the `getDeviceManager` method on the `CallClient` instance to access `deviceManager`.

```js
// Set the logger's log level
setLogLevel('verbose');
// Redirect logger output to wherever desired. By default it logs to console
AzureLogger.log = (...args) => { console.log(...args) };
const userToken = '<user token>';
callClient = new CallClient(options);
const tokenCredential = new AzureCommunicationTokenCredential(userToken);
const callAgent = await callClient.createCallAgent(tokenCredential, {displayName: 'optional ACS user name'});
const deviceManager = await callClient.getDeviceManager()
```

## Place a call

To create and start a call, use one of the APIs on `callAgent` and provide a user that you've created through the Communication Services identity SDK.

Call creation and start are synchronous. The call instance allows you to subscribe to call events.

### Place a 1:n call to a user or PSTN

To call another Communication Services user, use the `startCall` method on `callAgent` and pass the recipient's `CommunicationUserIdentifier` that you [created with the Communication Services administration library](../../access-tokens.md).

```js
const userCallee = { communicationUserId: '<ACS_USER_ID>' }
const oneToOneCall = callAgent.startCall([userCallee]);
```

To place a call to a public switched telephone network (PSTN), use the `startCall` method on `callAgent` and pass the recipient's `PhoneNumberIdentifier`. Your Communication Services resource must be configured to allow PSTN calling.

When you call a PSTN number, specify your alternate caller ID. An alternate caller ID is a phone number (based on the E.164 standard) that identifies the caller in a PSTN call. It's the phone number the call recipient sees for an incoming call.

> [!NOTE]
> PSTN calling is currently in private preview. For access, [apply to the early adopter program](https://aka.ms/ACS-EarlyAdopter).

For a 1:1 call, use the following code:

```js
const pstnCalee = { phoneNumber: '<ACS_USER_ID>' }
const alternateCallerId = {alternateCallerId: '<Alternate caller Id>'};
const oneToOneCall = callAgent.startCall([pstnCallee], {alternateCallerId});
```

For a 1:n call, use the following code:

```js
const userCallee = { communicationUserId: <ACS_USER_ID> }
const pstnCallee = { phoneNumber: <PHONE_NUMBER>};
const alternateCallerId = {alternateCallerId: '<Alternate caller Id>'};
const groupCall = callAgent.startCall([userCallee, pstnCallee], {alternateCallerId});

```

### Place a 1:1 call with video camera

> [!IMPORTANT]
> There can currently be no more than one outgoing local video stream.

To place a video call, you have to  enumerate local cameras by using the `getCameras()` method in `deviceManager`.

After you select a camera, use it to construct a `LocalVideoStream` instance. Pass it within `videoOptions` as an item within the `localVideoStream` array to the `startCall` method.


```js
const deviceManager = await callClient.getDeviceManager();
const cameras = await deviceManager.getCameras();
const camera = cameras[0]
localVideoStream = new LocalVideoStream(camera);
const placeCallOptions = {videoOptions: {localVideoStreams:[localVideoStream]}};
const call = callAgent.startCall(['acsUserId'], placeCallOptions);

```

When your call connects, it automatically starts sending a video stream from the selected camera to the other participant. This also applies to the `Call.Accept()` video options and `CallAgent.join()` video options.

### Join a group call

> [!NOTE]
> The `groupId` parameter is considered system metadata and may be used by Microsoft for operations that are required to run the system. Don't include personal data in the `groupId` value. Microsoft doesn't treat this parameter as personal data and its content may be visible to Microsoft employees or stored long-term.
>
> The `groupId` parameter requires data to be in GUID format. We recommend using randomly generated GUIDs that aren't considered personal data in your systems.
>

To start a new group call or join an ongoing group call, use the `join` method and pass an object with a `groupId` property. The `groupId` value has to be a GUID.

```js

const context = { groupId: <GUID>}
const call = callAgent.join(context);

```

### Join a Teams Meeting
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK

To join a Teams meeting, use the `join` method and pass a meeting link or a meeting's coordinates.

Join by using a meeting link:

```js
const locator = { meetingLink: <meeting link>}
const call = callAgent.join(locator);
```

Join by using meeting coordinates:

```js
const locator = {
    threadId: <thread id>,
    organizerId: <organizer id>,
    tenantId: <tenant id>,
    messageId: <message id>
}
const call = callAgent.join(locator);
```

## Receive an incoming call

The `callAgent` instance emits an `incomingCall` event when the logged-in identity receives an incoming call. To listen to this event, subscribe by using one of these options:

```js
const incomingCallHander = async (args: { incomingCall: IncomingCall }) => {
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
callAgentInstance.on('incomingCall', incomingCallHander);
```

The `incomingCall` event includes an `incomingCall` instance that you can accept or reject.

## Manage calls

During a call, you can access call properties and manage video and audio settings.

### Check call properties

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




### Mute and unmute

To mute or unmute the local endpoint, you can use the `mute` and `unmute` asynchronous APIs:

```js

//mute local device
await call.mute();

//unmute local device
await call.unmute();

```

### Start and stop sending local video

To start a video, you have to enumerate cameras using the `getCameras` method on the `deviceManager` object. Then create a new instance of `LocalVideoStream` with the desired camera and then pass the `LocalVideoStream` object into the `startVideo` method:

```js
const deviceManager = await callClient.getDeviceManager();
const cameras = await deviceManager.getCameras();
const camera = cameras[0]
const localVideoStream = new LocalVideoStream(camera);
await call.startVideo(localVideoStream);
```

After you successfully start sending video, a `LocalVideoStream` instance is added to the `localVideoStreams` collection on a call instance.

```js
call.localVideoStreams[0] === localVideoStream;
```

To stop local video, pass the `localVideoStream` instance that's available in the `localVideoStreams` collection:

```js
await call.stopVideo(localVideoStream);
```

You can switch to a different camera device while a video is sending by invoking `switchSource` on a `localVideoStream` instance:

```js
const cameras = await callClient.getDeviceManager().getCameras();
const camera = cameras[1];
localVideoStream.switchSource(camera);
```

## Manage remote participants

All remote participants are represented by `RemoteParticipant` type and available through `remoteParticipants` collection on a call instance.

### List the participants in a call

The `remoteParticipants` collection returns a list of remote participants in a call:

```js
call.remoteParticipants; // [remoteParticipant, remoteParticipant....]
```

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
  - `{ id: string }`: object repredenting identifier that doesn't fit any of the other identifier types

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

### Add a participant to a call

To add a participant (either a user or a phone number) to a call, you can use `addParticipant`. Provide one of the `Identifier` types. It synchronously returns the `remoteParticipant` instance. The `remoteParticipantsUpdated` event from Call is raised when a participant is successfully added to the call.

```js
const userIdentifier = { communicationUserId: <ACS_USER_ID> };
const pstnIdentifier = { phoneNumber: <PHONE_NUMBER>}
const remoteParticipant = call.addParticipant(userIdentifier);
const remoteParticipant = call.addParticipant(pstnIdentifier, {alternateCallerId: '<Alternate Caller ID>'});
```

### Remove a participant from a call

To remove a participant (either a user or a phone number) from a call, you can invoke `removeParticipant`. You have to pass one of the `Identifier` types. This resolves asynchronously after the participant is removed from the call. The participant is also removed from the `remoteParticipants` collection.

```js
const userIdentifier = { communicationUserId: <ACS_USER_ID> };
const pstnIdentifier = { phoneNumber: <PHONE_NUMBER>}
await call.removeParticipant(userIdentifier);
await call.removeParticipant(pstnIdentifier);
```

## Render remote participant video streams

To list the video streams and screen sharing streams of remote participants, inspect the `videoStreams` collections:

```js
const remoteVideoStream: RemoteVideoStream = call.remoteParticipants[0].videoStreams[0];
const streamType: MediaStreamType = remoteVideoStream.mediaStreamType;
```

To render `RemoteVideoStream`, you have to subscribe to it's `isAvailableChanged` event. If the `isAvailable` property changes to `true`, a remote participant is sending a stream. After that happens, create a new instance of `VideoStreamRenderer`, and then create a new `VideoStreamRendererView` instance by using the asynchronous `createView` method.  You can then attach `view.target` to any UI element.

Whenever availability of a remote stream changes you can choose to destroy the whole `VideoStreamRenderer`, a specific `VideoStreamRendererView`
or keep them, but this will result in displaying blank video frame.

```js
function subscribeToRemoteVideoStream(remoteVideoStream: RemoteVideoStream) {
	let videoStreamRenderer: VideoStreamRenderer = new VideoStreamRenderer(remoteVideoStream);
	const displayVideo = () => {
		const view = await videoStreamRenderer.createView();
		htmlElement.appendChild(view.target);
	}
	remoteVideoStream.on('isAvailableChanged', async () => {
		if (remoteVideoStream.isAvailable) {
			displayVideo();
		} else {
			videoStreamRenderer.dispose();
		}
	});
	if (remoteVideoStream.isAvailable) {
		displayVideo();
	}
}
```

### Remote video stream properties

Remote video streams have the following properties:

- `id`: The ID of a remote video stream.

  ```js
  const id: number = remoteVideoStream.id;
  ```

- `mediaStreamType`: Can be `Video` or `ScreenSharing`.

  ```js
  const type: MediaStreamType = remoteVideoStream.mediaStreamType;
  ```

- `isAvailable`: Whether a remote participant endpoint is actively sending a stream.

  ```js
  const type: boolean = remoteVideoStream.isAvailable;
  ```

### VideoStreamRenderer methods and properties
Create a `VideoStreamRendererView` instance that can be attached in the application UI to render the remote video stream, use asynchronous `createView()` method, it resolves when stream is ready to render and returns an object with `target` property that represents `video` element that can be appended anywhere in the DOM tree

  ```js
  videoStreamRenderer.createView()
  ```

Dispose of `videoStreamRenderer` and all associated `VideoStreamRendererView` instances:

  ```js
  videoStreamRenderer.dispose()
  ```

### VideoStreamRendererView methods and properties

When you create a `VideoStreamRendererView`, you can specify the `scalingMode` and `isMirrored` properties. `scalingMode` can be `Stretch`, `Crop`, or `Fit`. If `isMirrored` is specified, the rendered stream is flipped vertically.

```js
const videoStreamRendererView: VideoStreamRendererView = await videoStreamRenderer.createView({ scalingMode, isMirrored });
```

Every `VideoStreamRendererView` instance has a `target` property that represents the rendering surface. Attach this property in the application UI:

```js
htmlElement.appendChild(view.target);
```

You can update `scalingMode` by invoking the `updateScalingMode` method:

```js
view.updateScalingMode('Crop')
```

## Device management

In `deviceManager`, you can enumerate local devices that can transmit your audio and video streams in a call. You can also use it to request permission to access the local device's microphones and cameras.

You can access `deviceManager` by calling the `callClient.getDeviceManager()` method:

```js
const deviceManager = await callClient.getDeviceManager();
```

### Get local devices

To access local devices, you can use enumeration methods on `deviceManager`. Enumeration is an asynchronous action

```js
//  Get a list of available video devices for use.
const localCameras = await deviceManager.getCameras(); // [VideoDeviceInfo, VideoDeviceInfo...]

// Get a list of available microphone devices for use.
const localMicrophones = await deviceManager.getMicrophones(); // [AudioDeviceInfo, AudioDeviceInfo...]

// Get a list of available speaker devices for use.
const localSpeakers = await deviceManager.getSpeakers(); // [AudioDeviceInfo, AudioDeviceInfo...]
```

### Set the default microphone and speaker

In `deviceManager`, you can set a default device that you'll use to start a call. If client defaults aren't set, Communication Services uses operating system defaults.

```js
// Get the microphone device that is being used.
const defaultMicrophone = deviceManager.selectedMicrophone;

// Set the microphone device to use.
await deviceManager.selectMicrophone(localMicrophones[0]);

// Get the speaker device that is being used.
const defaultSpeaker = deviceManager.selectedSpeaker;

// Set the speaker device to use.
await deviceManager.selectSpeaker(localSpeakers[0]);
```

### Local camera preview

You can use `deviceManager` and `VideoStreamRenderer` to begin rendering streams from your local camera. This stream won't be sent to other participants; it's a local preview feed.

```js
const cameras = await deviceManager.getCameras();
const camera = cameras[0];
const localCameraStream = new LocalVideoStream(camera);
const videoStreamRenderer = new VideoStreamRenderer(localCameraStream);
const view = await videoStreamRenderer.createView();
htmlElement.appendChild(view.target);

```

### Request permission to camera and microphone

Prompt a user to grant camera and microphone permissions:

```js
const result = await deviceManager.askDevicePermission({audio: true, video: true});
```

This resolves with an object that indicates whether `audio` and `video` permissions were granted:

```js
console.log(result.audio);
console.log(result.video);
```

## Record calls
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK

Call recording is an extended feature of the core `Call` API. You first need to obtain the recording feature API object:

```js
const callRecordingApi = call.api(Features.Recording);
```

Then, to check if the call is being recorded, inspect the `isRecordingActive` property of `callRecordingApi`. It returns `Boolean`.

```js
const isResordingActive = callRecordingApi.isRecordingActive;
```

You can also subscribe to recording changes:

```js
const isRecordingActiveChangedHandler = () => {
  console.log(callRecordingApi.isRecordingActive);
};

callRecordingApi.on('isRecordingActiveChanged', isRecordingActiveChangedHandler);

```

## Transfer calls
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK

Call transfer is an extended feature of the core `Call` API. You first need to get the transfer feature API object:

```js
const callTransferApi = call.api(Features.Transfer);
```

Call transfers involve three parties:

- *Transferor*: The person who initiates the transfer request.
- *Transferee*: The person who is being transferred.
- *Transfer target*: The person who is being transferred to.

Transfers follow these steps:

1. There's already a connected call between the *transferor* and the *transferee*. The *transferor* decides to transfer the call from the *transferee* to the *transfer target*.
1. The *transferor* calls the `transfer` API.
1. The *transferee* decides whether to `accept` or `reject` the transfer request to the *transfer target* by using a `transferRequested` event.
1. The *transfer target* receives an incoming call only if the *transferee* accepts the transfer request.

To transfer a current call, you can use the `transfer` API. `transfer` takes the optional `transferCallOptions`, which allows you to set a `disableForwardingAndUnanswered` flag:

- `disableForwardingAndUnanswered = false`: If the *transfer target* doesn't answer the transfer call, the transfer follows the *transfer target* forwarding and unanswered settings.
- `disableForwardingAndUnanswered = true`: If the *transfer target* doesn't answer the transfer call, the transfer attempt ends.

```js
// transfer target can be an ACS user
const id = { communicationUserId: <ACS_USER_ID> };
```

```js
// call transfer API
const transfer = callTransferApi.transfer({targetParticipant: id});
```

The `transfer` API allows you to subscribe to `transferStateChanged` and `transferRequested` events. A `transferRequested` event comes from a `call` instance; a `transferStateChanged` event and transfer `state` and `error` come from a `transfer` instance.

```js
// transfer state
const transferState = transfer.state; // None | Transferring | Transferred | Failed

// to check the transfer failure reason
const transferError = transfer.error; // transfer error code that describes the failure if a transfer request failed
```

The *transferee* can accept or reject the transfer request initiated by the *transferor* in the `transferRequested` event by using `accept()` or `reject()` in `transferRequestedEventArgs`. You can access `targetParticipant` information and `accept` or `reject` methods in `transferRequestedEventArgs`.

```js
// Transferee to accept the transfer request
callTransferApi.on('transferRequested', args => {
  args.accept();
});

// Transferee to reject the transfer request
callTransferApi.on('transferRequested', args => {
  args.reject();
});
```

## Learn about eventing models

Inspect current values and subscribe to update events for future values.

### Properties

```js
// Inspect the current value
console.log(object.property);

// Subscribe to value updates
object.on('propertyChanged', () => {
    // Inspect new value
    console.log(object.property)
});

// Unsubscribe from updates:
object.off('propertyChanged', () => {});



// Example for inspecting a call state
console.log(call.state);
call.on('stateChanged', () => {
    console.log(call.state);
});
call.off('stateChanged', () => {});
```

### Collections

```js
// Inspect the current collection
object.collection.forEach(v => {
    console.log(v);
});

// Subscribe to collection updates
object.on('collectionUpdated', e => {
    // Inspect new values added to the collection
    e.added.forEach(v => {
        console.log(v);
    });
    // Inspect values removed from the collection
    e.removed.forEach(v => {
        console.log(v);
    });
});

// Unsubscribe from updates:
object.off('collectionUpdated', () => {});

// Example for subscribing to remote participants and their video streams
call.remoteParticipants.forEach(p => {
    subscribeToRemoteParticipant(p);
})

call.on('remoteParticipantsUpdated', e => {
    e.added.forEach(p => { subscribeToRemoteParticipant(p) })
    e.removed.forEach(p => { unsubscribeFromRemoteParticipant(p) })
});

function subscribeToRemoteParticipant(p) {
    console.log(p.state);
    p.on('stateChanged', () => { console.log(p.state); });
    p.videoStreams.forEach(v => { subscribeToRemoteVideoStream(v) });
    p.on('videoStreamsUpdated', e => { e.added.forEach(v => { subscribeToRemoteVideoStream(v) }) })
}
```
