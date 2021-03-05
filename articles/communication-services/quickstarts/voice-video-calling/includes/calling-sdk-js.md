---
author: mikben
ms.service: azure-communication-services
ms.topic: include
ms.date: 9/1/2020
ms.author: mikben
---
## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../access-tokens.md)
- Optional: Complete the quickstart for [getting started with adding calling to your application](../getting-started-with-calling.md)

## Setting up

### Install the client library

> [!NOTE]
> This document uses version 1.0.0-beta.6 of the calling client library.

Use the `npm install` command to install the Azure Communication Services Calling and Common client libraries for JavaScript.
This document is referencing types in version 1.0.0-beta.5 of calling library.

```console
npm install @azure/communication-common --save
npm install @azure/communication-calling --save

```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling client library:

| Name                             | Description                                                                                                                                 |
| ---------------------------------| ------------------------------------------------------------------------------------------------------------------------------------------- |
| CallClient                       | The CallClient is the main entry point to the Calling client library.                                                                       |
| CallAgent                        | The CallAgent is used to start and manage calls.                                                                                            |
| DeviceManager                    | The DeviceManager is used to manage media devices                                                                                           |
| AzureCommunicationTokenCredential | The AzureCommunicationTokenCredential class implements the CommunicationTokenCredential interface which is used to instantiate the CallAgent. |


## Initialize the CallClient, create CallAgent, and access DeviceManager

Instantiate a new `CallClient` instance. You can configure it with custom options like a Logger instance.
Once a `CallClient` is instantiated, you can create a `CallAgent` instance by calling the `createCallAgent` method on the `CallClient` instance. This asynchronously returns a `CallAgent` instance object.
The `createCallAgent` method takes a `CommunicationTokenCredential` as an argument, which accepts a [user access token](../../access-tokens.md).
To access the `DeviceManager` a callAgent instance must first be created. You can then use the `getDeviceManager` method on the `CallClient` instance to get the DeviceManager.

```js
const userToken = '<user token>';
callClient = new CallClient(options);
const tokenCredential = new AzureCommunicationTokenCredential(userToken);
const callAgent = await callClient.createCallAgent(tokenCredential, {displayName: 'optional ACS user name'});
const deviceManager = await callClient.getDeviceManager()
```

## Place an outgoing call

To create and start a call you need to use one of the APIs on CallAgent and provide a user that you've created through the Communication Services administration client library.

Call creation and start is synchronous. The Call instance allows you to subscribe to call events.

## Place a call

### Place a 1:1 call to a user or PSTN
To place a call to another Communication Services user, invoke the `startCall` method on `callAgent` and pass the callee's CommunicationUserIdentifier that you've [created with the Communication Services Administration library](https://docs.microsoft.com/azure/communication-services/quickstarts/access-tokens).

```js
const userCallee = { communicationUserId: '<ACS_USER_ID>' }
const oneToOneCall = callAgent.startCall([userCallee]);
```

To place a call to a PSTN, invoke the `startCall` method on `callAgent` and pass the callee's PhoneNumberIdentifier.
Your Communication Services resource must be configured to allow PSTN calling.
When calling a PSTN number, you must specify your alternate caller ID. An alternate caller ID refers to a phone number (based on the E.164 standard) identifying the caller in a PSTN Call. For example, when you supply an alternate caller ID to the PSTN call, that phone number will be the one shown to the callee when the call is incoming.

> [!WARNING]
> PSTN calling is currently in private preview. For access, [apply to early adopter program](https://aka.ms/ACS-EarlyAdopter).
```js
const pstnCalee = { phoneNumber: '<ACS_USER_ID>' }
const alternateCallerId = {alternateCallerId: '<Alternate caller Id>'};
const oneToOneCall = callAgent.startCall([pstnCallee], {alternateCallerId});
```

### Place a 1:n call with users and PSTN
```js
const userCallee = { communicationUserId: <ACS_USER_ID> }
const pstnCallee = { phoneNumber: <PHONE_NUMBER>};
const alternateCallerId = {alternateCallerId: '<Alternate caller Id>'};
const groupCall = callAgent.startCall([userCallee, pstnCallee], {alternateCallerId});

```

### Place a 1:1 call with video camera
> [!WARNING]
> There can currently be no more than one outgoing local video stream.
To place a video call, you have to enumerate local cameras using the deviceManager `getCameras()` API.
Once you select the desired camera, use it to construct a `LocalVideoStream` instance and pass it within `videoOptions`
as an item within the `localVideoStream` array to the `startCall` method.
Once your call connects it'll automatically start sending a video stream from the selected camera to the other participant(s). This also applies to the Call.Accept() video options and CallAgent.join() video options.
```js
const deviceManager = await callClient.getDeviceManager();
const cameras = await deviceManager.getCameras();
videoDeviceInfo = cameras[0];
localVideoStream = new LocalVideoStream(videoDeviceInfo);
const placeCallOptions = {videoOptions: {localVideoStreams:[localVideoStream]}};
const call = callAgent.startCall(['acsUserId'], placeCallOptions);

```

### Join a group call
To start a new group call or join an ongoing group call, use the 'join' method
and pass an object with a `groupId` property. The value has to be a GUID.
```js

const context = { groupId: <GUID>}
const call = callAgent.join(context);

```
### Join a Teams Meeting
To join a Teams meeting, use 'join' method and pass a meeting link or a meeting's coordinates
```js
// Join using meeting link
const locator = { meetingLink: <meeting link>}
const call = callAgent.join(locator);

// Join using meeting coordinates
const locator = {
	threadId: <thread id>,
	organizerId: <organizer id>,
	tenantId: <tenant id>,
	messageId: <message id>
}
const call = callAgent.join(locator);
```

## Receiving an incoming call

The `CallAgent` instance emits an `incomingCall` event when the logged in identity is receiving an incoming call. To listen to this event, subscribe in the following way:

```js
const incomingCallHander = async (args: { incomingCall: IncomingCall }) => {
	//Get information about caller
	var callerInfo = incomingCall.callerInfo
	
	//accept the call
	var call = await incomingCall.accept();

	//reject the call
	incomingCall.reject();
};
callAgentInstance.on('incomingCall', incomingCallHander);
```

The `incomingCall` event will provide with an instance of `IncomingCall` on which you can accept or reject a call.


## Call Management

You can access call properties and perform various operations during a call to manage settings related to video and audio.

### Call properties
* Get the unique ID (string) for this Call.
```js

const callId: string = call.id;

```

* To learn about other participants in the call, inspect the `remoteParticipant` collection on the `call` instance. Array contains list `RemoteParticipant` objects
```js
const remoteParticipants = call.remoteParticipants;
```

* The identifier of caller if the call is incoming. Identifier is one of the `CommunicationIdentifier` types
```js

const callerIdentity = call.callerInfo.identifier;

* Get the state of the Call.
```js

const callState = call.state;

```
This returns a string representing the current state of a call:
* 'None' - initial call state
* 'Incoming' - indicates that a call is incoming, it has to be either accepted or rejected
* 'Connecting' - initial transition state once call is placed or accepted
* 'Ringing' - for an outgoing call - indicates call is ringing for remote participants, it's 'Incoming' on their side
* 'EarlyMedia' - indicates a state in which an announcement is played before the call is connected
* 'Connected' - call is connected
* 'LocalHold' - call is put on hold by local participant, no media is flowing between local endpoint and remote participant(s)
* 'RemoteHold' - call is put on hold by remote participant, no media is flowing between local endpoint and remote participant(s)
* 'Disconnecting' - transition state before the call goes to 'Disconnected' state
* 'Disconnected' - final call state
  * If network connection is lost, state goes to 'Disconnected' after about 2 minutes.

* To see why a given call ended, inspect the `callEndReason` property.
```js

const callEndReason = call.callEndReason;
// callEndReason.code (number) code associated with the reason
// callEndReason.subCode (number) subCode associated with the reason
```

* To learn if the current call is an incoming or outgoing call, inspect the `direction` property, it returns `CallDirection`.
```js
const isIncoming = call.direction == 'Incoming';
const isOutgoing = call.direction == 'Outgoing';
```

*  To check if the current microphone is muted, inspect the `muted` property, it returns `Boolean`.
```js

const muted = call.isMicrophoneMuted;

```

* To see if the screen sharing stream is being sent from a given endpoint, check the `isScreenSharingOn` property, it returns `Boolean`.
```js

const isScreenSharingOn = call.isScreenSharingOn;

```

* To inspect active video streams, check the `localVideoStreams` collection, it contains `LocalVideoStream` objects
```js

const localVideoStreams = call.localVideoStreams;

```

### Call ended event

The `Call` instance emits a `callEnded` event when the call ends. To listen to this event subscribe in the following way:

```js
const callEndHander = async (args: { callEndReason: CallEndReason }) => {
	console.log(args.callEndReason)
};

call.on('callEnded', callEndHander);
```

### Mute and unmute

To mute or unmute the local endpoint you can use the `mute` and `unmute` asynchronous APIs:

```js

//mute local device 
await call.mute();

//unmute local device 
await call.unmute();

```

### Start and stop sending local video


To start a video, you have to enumerate cameras using the `getCameras` method on the `deviceManager` object. Then create a new instance of `LocalVideoStream` passing the desired camera into the `startVideo` method as an argument:


```js
const localVideoStream = new LocalVideoStream(videoDeviceInfo);
await call.startVideo(localVideoStream);

```

Once you successfully start sending video, a `LocalVideoStream` instance will be added to the `localVideoStreams` collection on a call instance.

```js

call.localVideoStreams[0] === localVideoStream;

```

To stop local video, pass the `localVideoStream` instance available in the `localVideoStreams` collection:

```js

await call.stopVideo(localVideoStream);

```

You can switch to a different camera device while video is being sent by invoking `switchSource` on a `localVideoStream` instance:

```js
const cameras = await callClient.getDeviceManager().getCameras();
localVideoStream.switchSource(cameras[1]);

```

## Remote participants management

All remote participants are represented by `RemoteParticipant` type and available through `remoteParticipants` collection on a call instance.

### List participants in a call
The `remoteParticipants` collection returns a list of remote participants in given call:

```js

call.remoteParticipants; // [remoteParticipant, remoteParticipant....]

```

### Remote participant properties
Remote participant has a set of properties and collections associated with it
#### CommunicationIdentifier
Get the identifier for this remote participant.
Identity is one of the 'CommunicationIdentifier' types:
```js
const identifier = remoteParticipant.identifier;
```
It can be one of 'CommunicationIdentifier' types:
  * { communicationUserId: '<ACS_USER_ID'> } - object representing ACS User
  * { phoneNumber: '<E.164>' } - object representing phone number in E.164 format
  * { microsoftTeamsUserId: '<TEAMS_USER_ID>', isAnonymous?: boolean; cloud?: "public" | "dod" | "gcch" } - object representing Teams user

#### State
Get state of this remote participant.
```js

const state = remoteParticipant.state;
```
State can be one of
* 'Idle' - initial state
* 'Connecting' - transition state while participant is connecting to the call
* 'Ringing' - participant is ringing
* 'Connected' - participant is connected to the call
* 'Hold' - participant is on hold
* 'EarlyMedia' - announcement is played before participant is connected to the call
* 'Disconnected' - final state - participant is disconnected from the call
  * If remote participant loses their network connectivity, then remote participant state goes to 'Disconnected' after about 2 minutes.

#### Call End reason
To learn why participant left the call, inspect `callEndReason` property:
```js
const callEndReason = remoteParticipant.callEndReason;
// callEndReason.code (number) code associated with the reason
// callEndReason.subCode (number) subCode associated with the reason
```
#### Is Muted
To check whether this remote participant is muted or not, inspect `isMuted` property, it returns `Boolean`
```js
const isMuted = remoteParticipant.isMuted;
```
#### Is Speaking
To check whether this remote participant is speaking or not, inspect `isSpeaking` property it returns `Boolean`
```js
const isSpeaking = remoteParticipant.isSpeaking;
```

#### Video Streams
To inspect all video streams that a given participant is sending in this call, check `videoStreams` collection, it contains `RemoteVideoStream` objects
```js

const videoStreams = remoteParticipant.videoStreams; // [RemoteVideoStream, ...]

```


### Add a participant to a call

To add a participant to a call (either a user or a phone number) you can invoke `addParticipant`.
Provide one of the 'Identifier' types.
This will synchronously return the remote participant instance.

```js
const userIdentifier = { communicationUserId: <ACS_USER_ID> };
const pstnIdentifier = { phoneNumber: <PHONE_NUMBER>}
const remoteParticipant = call.addParticipant(userIdentifier);
const remoteParticipant = call.addParticipant(pstnIdentifier, {alternateCallerId: '<Alternate Caller ID>'});
```

### Remove participant from a call

To remove a participant from a call (either a user or a phone number) you can invoke `removeParticipant`.
You have to pass one of the 'Identifier' types
This will resolve asynchronously once the participant is removed from the call.
The participant will also be removed from the `remoteParticipants` collection.

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
 
To render a `RemoteVideoStream`, you have to subscribe to a `isAvailableChanged` event.
If the `isAvailable` property changes to `true`, a remote participant is sending a stream.
Once that happens, create a new instance of `Renderer`, and then create a new `RendererView` instance using the asynchronous
`createView` method.  You may then attach `view.target` to any UI element.
Whenever availability of a remote stream changes you can choose to destroy the whole Renderer, a specific `RendererView`
or keep them, but this will result in displaying blank video frame.

```js
function subscribeToRemoteVideoStream(remoteVideoStream: RemoteVideoStream) {
	let renderer: Renderer = new Renderer(remoteVideoStream);
	const displayVideo = () => {
		const view = await renderer.createView();
		htmlElement.appendChild(view.target);
	}
	remoteVideoStream.on('availabilityChanged', async () => {
		if (remoteVideoStream.isAvailable) {
			displayVideo();
		} else {
			renderer.dispose();
		}
	});
	if (remoteVideoStream.isAvailable) {
		displayVideo();
	}
}
```

### Remote video stream properties
Remote video streams have the following properties:

* `Id` - ID of a remote video stream
```js
const id: number = remoteVideoStream.id;
```

* `StreamSize` - size ( width/height ) of a remote video stream
```js
const size: {width: number; height: number} = remoteVideoStream.size;
```

* `MediaStreamType` - can be 'Video' or 'ScreenSharing'
```js
const type: MediaStreamType = remoteVideoStream.mediaStreamType;
```
* `isAvailable` - Indicates if remote participant endpoint is actively sending stream
```js
const type: boolean = remoteVideoStream.isAvailable;
```

### Renderer methods and properties

* Create a `RendererView` instance that can be later attached in the application UI to render the remote video stream.
```js
renderer.createView()
```

* Dispose of the renderer and all associated `RendererView` instances.
```js
renderer.dispose()
```


### RendererView methods and properties
When creating a `RendererView` you can specify `scalingMode` and `isMirrored` properties.
Scaling mode can be 'Stretch', 'Crop', or 'Fit'
If `isMirrored` is specified, the rendered stream will be flipped vertically.

```js
const rendererView: RendererView = renderer.createView({ scalingMode, isMirrored });
```
Any given `RendererView` instance has a `target` property that represents the rendering surface. This has to be attached in the application UI:
```js
document.body.appendChild(rendererView.target);
```

You can later update the scaling mode by invoking the `updateScalingMode` method.
```js
view.updateScalingMode('Crop')
```

## Device management

`DeviceManager` lets you enumerate local devices that can be used in a call to transmit your audio/video streams. It also allows you to request permission from a user to access their microphone and camera using the native browser API.

You can access the `deviceManager` by calling `callClient.getDeviceManager()` method.
> [!WARNING]
> Currently a `callAgent` object must be instantiated first in order to gain access to DeviceManager

```js

const deviceManager = await callClient.getDeviceManager();

```

### Enumerate local devices

To access local devices, you can use enumeration methods on the Device Manager. Enumeration is an asynchronous action.

```js

//  Get a list of available video devices for use.
const localCameras = await deviceManager.getCameras(); // [VideoDeviceInfo, VideoDeviceInfo...]

// Get a list of available microphone devices for use.
const localMicrophones = await deviceManager.getMicrophones(); // [AudioDeviceInfo, AudioDeviceInfo...]

// Get a list of available speaker devices for use.
const localSpeakers = await deviceManager.getSpeakers(); // [AudioDeviceInfo, AudioDeviceInfo...]

```

### Set default microphone/speaker

Device manager allows you to set a default device that will be used when starting a call.
If client defaults are not set, Communication Services will fall back to OS defaults.

```js

// Get the microphone device that is being used.
const defaultMicrophone = deviceManager.selectedMicrophone;

// Set the microphone device to use.
await deviceManager.selectMicrophone(AudioDeviceInfo);

// Get the speaker device that is being used.
const defaultSpeaker = deviceManager.selectedSpeaker;

// Set the speaker device to use.
await deviceManager.selectSpeaker(AudioDeviceInfo);

```

### Local camera preview

You can use `DeviceManager` and `Renderer` to begin rendering streams from your local camera. This stream won't be sent to other participants; it's a local preview feed. This is an asynchronous action.

```js
const cameras = await deviceManager.getCameras();
const localVideoDevice = cameras[0];
const localCameraStream = new LocalVideoStream(localVideoDevice);
const renderer = new Renderer(localCameraStream);
const view = await renderer.createView();
document.body.appendChild(view.target);

```

### Request permission to camera/microphone

Prompt a user to grant camera/microphone permissions with the following:

```js
const result = await deviceManager.askDevicePermission({audio: true, video: true});
```
This will resolve asynchronously with an object indicating if `audio` and `video` permissions were granted:
```js
console.log(result.audio);
console.log(result.video);
```


## Call recording management

Call recording is an extended feature of the core `Call` API. You first need to obtain the recording feature API object:

```js
const callRecordingApi = call.api(Features.Recording);
```

Then, to can check if the call is being recorded, inspect the `isRecordingActive` property of `callRecordingApi`, it returns `Boolean`.

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

## Call Transfer management

Call transfer is an extended feature of the core `Call` API. You first need to obtain the transfer feature API object:

```js
const callTransferApi = call.api(Features.Transfer);
```

Call transfer involves three parties *transferor*, *transferee*, and *transfer target*. Transfer flow is working as following:

1. There is already a connected call between *transferor* and *transferee*
2. *transferor* decide to transfer the call (*transferee* -> *transfer target*)
3. *transferor* call `transfer` API
4. *transferee* decide to whether `accept` or `reject` the transfer request to *transfer target* via `transferRequested` event.
5. *transfer target* will receive an incoming call only if *transferee* did `accept` the transfer request

### Transfer terminology

- Transferor - The one who initiates the transfer request
- Transferee - The one who is being transferred by the transferor to the transfer target
- Transfer target - The one who is the target that is being transferred to

To transfer current call, you can use `transfer` synchronous API. `transfer` takes optional `TransferCallOptions` which allows you to set `disableForwardingAndUnanswered` flag:

- `disableForwardingAndUnanswered` = false - if *transfer target* doesn't answer the transfer call, then it will follow the *transfer target* forwarding and unanswered settings
- `disableForwardingAndUnanswered` = true - if *transfer target* doesn't answer the transfer call, then the transfer attempt will end

```js
// transfer target can be ACS user
const id = { communicationUserId: <ACS_USER_ID> };
```

```js
// call transfer API
const transfer = callTransferApi.transfer({targetParticipant: id});
```

Transfer allows you to subscribe to `transferStateChanged` and `transferRequested` events. `transferRequsted` event comes from `call` instance, `transferStateChanged` event and transfer `state` and `error` comes from `transfer` instance

```js
// transfer state
const transferState = transfer.state; // None | Transferring | Transferred | Failed

// to check the transfer failure reason
const transferError = transfer.error; // transfer error code that describes the failure if transfer request failed
```

Transferee can accept or reject the transfer request initiated by transferor in `transferRequested` event via `accept()` or `reject()` in `transferRequestedEventArgs`. You can access `targetParticipant` information, `accept`, `reject` methods in `transferRequestedEventArgs`.

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

## Eventing model
You have to inspect current values and subscribe to update events for future values.

### Properties

```js
// Inspect current value
console.log(object.property);

// Subscribe to value updates
object.on('propertyChanged', () => {
	// Inspect new value
	console.log(object.property)
});

// Unsubscribe from updates:
object.off('propertyChanged', () => {});



// Example for inspecting call state
console.log(call.state);
call.on('stateChanged', () => {
	console.log(call.state);
});
call.off('stateChanged', () => {});
```

### Collections
```js
// Inspect current collection
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
