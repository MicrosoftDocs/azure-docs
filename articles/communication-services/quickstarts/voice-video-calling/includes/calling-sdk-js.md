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
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../user-access-tokens.md)
- Optional: Complete the quickstart for [getting started with adding calling to your application](../getting-started-with-calling.md)

## Setting up

### Install the client library

Use the `npm install` command to install the Azure Communication Services Calling, Common and Configuration client library for JavaScript.

```console

npm install @azure/communication-calling --save

```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling client library for JavaScript.

| Name                                              | Description                                                                                                                                      |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| [CallClient](../../../references/overview.md) | The CallClient is used to create the CallAgent and to get the DeviceManager. |

## Initialize the CallClient

To create a `CallAgent` instance you have to use `CallClient.createCallAgent()` method that asynchronously returns a `CallAgent` object.
`CallClient.createCallAgent` method takes a `CommunicationUserCredential` object.
`CommunicationUserCredential` takes an auth token which should be obtained from a trusted service.
To access the `DeviceManager`, a callAgent instance must be created first, and then use the `CallClient.getDeviceManager` method to get the DeviceManager.

```js
const userToken = '<user token>';
callClient = new CallClient(options);
const tokenCredential = new CommunicationUserCredential(userToken);
const callAgent = await callClient.createCallAgent(tokenCredential);
const deviceManager = await callClient.getDeviceManager()
```

## Place an outgoing call and join a group call

To create and start a call you need to call the `CallClient.call()` method and provide the `Identifier` of the callee(s).
To join a group call you need to call the `CallClient.join()` method and provide the groupId. Group Ids must be in GUID format.

Call creation and start is synchronous and you'll receive a call instance, allowing you to subscribe to all events on the call.

### Place a 1:1 call to a user or a 1:n call with users and PSTN

```js

const acsUserId = { communicationUserId: <ACS_USER_ID> }
const oneToOneCall = callAgent.call([acsUserId], placeCallOptions);

```

### Place a 1:n call with users and PSTN
To place the call to PSTN you have to specify phone number acquired with Communication Services
```js

const acsUser1 = { communicationUserId: <ACS_USER_ID> }
const acsUser2 = { phoneNumber: <PHONE_NUMBER>};
const groupCall = callClient.call([acsUser1, acsUser2], placeCallOptions);

```

### Place a 1:1 call with with video camera
Currently only one outgoing local video stream is supported
```js

const videoDeviceInfo = await callClient.getDeviceManager().getCameraList()[0];
localVideoStream = new LocalVideoStream(videoDeviceInfo);
const placeCallOptions = {videoOptions: {localVideoStreams:[localVideoStream]}};
const call = callClient.call(['acsUserId'], placeCallOptions);

```

### Join a group call

```js

const context = { groupId: <GUID>}
const call = callClient.call(context, placeCallOptions);

```

## Call Management

You can access various call properties and perform various operations during a call to manage settings related to video and audio.

### Call properties
* Get the unique Id for this Call.
```js

const callId: string = call.id;

```

* Collection of remote participants participating in this call.
```js
const remoteParticipants: RemoteParticipants = call.remoteParticipants;
```

* The identity of caller if the call is incoming.
```js

const callerIdentity = call.callerIdentity;

```

* Get the state of this Call. One of 'None' | 'Incoming' | 'Connecting' | 'Ringing' | 'Connected' | 'Hold' | 'Disconnecting' | 'Disconnected' | 'EarlyMedia';
```js

const callState: CallState = call.state;

```

* Containing code/subcode indicating how call ended
```js

const callEndReason: CallEndReason = call.callEndReason;

```

* Whether this Call is incoming
```js

const isIncoming: boolean = call.isIncoming;

```

*  Whether this local microphone is muted
```js

const muted: boolean = call.isMicrophoneMuted;

```

* Whether screen sharing is on
```js

const isScreenSharingOn: boolean = call.isScreenSharingOn;

```

* Collection of video streams sent to other participants in a call.
```js

const localVideoStreams: LocalVideoStream[] = call.localVideoStreams;

```

### Mute and unmute

To mute or unmute the local endpoint you can use the `mute` and `unmute` asynchronous APIs:

```js

//mute local device 
await call.mute();

//unmute device 
await call.unmute();

```

### Start and stop sending local video

To start a video, one has to enumerate cameras via `DeviceManager`, create local video stream, and pass it in startVideo as an argument

```js
const localVideoStream = new SDK.LocalVideoStream(videoDeviceInfo);
await call.startVideo(localVideoStream);

```

Once you start sending video, a `LocalVideoStream` instance is added to the `localVideoStreams` collection on a call instance.

```js

call.localVideoStreams[0] === localVideoStream;

```

To stop local video, pass the `localVideoStream` returned from the `call.startVideo()` invocation.

```js

await call.stopVideo(localVideoStream);

```

You can switch to a different camera device:

```js
const source callClient.getDeviceManager().getCameraList()[1];
localVideoStream.switchSource(source);

```

## Remote participants management

All remote participants are represented by `RemoteParticipant` type and available through `remoteParticipants` collection on a call instance.

### List participants in a call

```js

call.remoteParticipants; // [remoteParticipant, remoteParticipant....]

```

### Remote participant properties
* Get the identifier for this remote participant.
```js

const identity: CommunicationUser | PhoneNumber | CallingApplication | UnknownIdentifier = remoteParticipant.identifier;

```

* Get state of this remote participant. One of 'Idle' | 'Connecting' | 'Connected' | 'Hold' | 'EarlyMedia' | 'Disconnected'
```js

const state: string = remoteParticipant.state;

```

* Reason why participant left the call, contains code/subcode/message.
```js

const callEndReason: CallEndReason = remoteParticipant.callEndReason;

```

* Whether this remote participant is muted or not
```js

const isMuted: boolean = remoteParticipant.isMuted;

```

* Whether this remote participant is speaking or not. 
```js

const isSpeaking: boolean = remoteParticipant.isSpeaking;

```

* Collection of video streams this participants has. 
```js

const videoStreams: RemoteVideoStream[] = remoteParticipant.videoStreams; // [RemoteVideoStream, RemoteVideoStream, ...]

```


### Add a participant to a call

To add a participant to a call (either a user or a phone number) you can invoke `addParticipant`. This will synchronously return the remote participant instance.

```js
const acsUser = { communicationUserId: <ACS_USER_ID> };
const acsPhone = { phoneNumber: <PHONE_NUMBER>}
const remoteParticipant = call.addParticipant(acsUser);
const remoteParticipant = call.addParticipant(acsPhone);

```

### Remove participant from a call

To remove participant from a call (either a user or a phone number) you can invoke `removeParticipant`. This will resolve asynchronously.

```js

await call.removeParticipant(acsUser);
await call.removeParticipant(acsPhone);

```

## Render remote participant video streams

To list the video streams and screen sharing streams of remote participants, inspect the `videoStreams` collections:

```js

const remoteVideoStream = call.remoteParticipants[0].videoStreams[0];
const streamType = remoteVideoStream.type;
```
 
To render a `remoteParticipantStream` use `Renderer`:

```js
let renderer: Renderer;
const displayVideo = () => {
	renderer = new Renderer(remoteParticipantStream);
	const view = await renderer.createView();
	htmlElement.appendChild(view.target);
}
remoteParticipantStream.on('availabilityChanged', async () => {
	if (remoteParticipantStream.isAvailable) {
		displayVideo();
	} else {
		renderer.dispose();
	}
});
if (remoteParticipantStream.isAvailable) {
	displayVideo();
}
```

### Remote video stream properties

```js
// The type of video stream. Can be 'Video' or 'ScreenSharing'
const type: string = remoteParticipantStream.type;

// Whether the stream is available or not.
const type: boolean = remoteParticipantStream.isAvailable;

```

### Renderer methods and properties

```js

// Dimensions of the renderer
renderer.size; 

// Create a view for a video stream
renderer.createView()

// Dispose of this renderer
renderer.dispose()

```


### RendererView methods and properties

```js
// The current scale mode for the video. 'Stretch' | 'Crop' | 'Fit'
view.scalingMode

// Weather to display the video stream mirrored.
view.mirrored

// The target html element in which the video is rendering on.
// Use this property and attach it to any UI html element. Example:
//		document.getElement('someDiv').appendChild(rendererView.target);
view.target: HTMLElement;

// Update the scale mode for this view.
view.updateScalingMode('crop')
```


## Device management

`DeviceManager` lets you enumerate local devices that can be used in a call to transmit your audio/video streams. It also allows you to request permission from a user to access their microphone and camera using the native browser API.

You can access `deviceManager` by calling `callClient.getDeviceManager()` method. A `callAgent` object must be instantiated first in order to call this method.

```js

const deviceManager = await callClient.getDeviceManager();

```

### Enumerate local devices

To access local devices, you can use enumeration methods on the Device Manager. Enumeration is a synchronous action.

```js

//  Get a list of available video devices for use.
const localCameras = deviceManager.getCameraList(); // [VideoDeviceInfo, VideoDeviceInfo...]

// Get a list of available microphone devices for use.
const localMicrophones = deviceManager.getMicrophoneList(); // [AudioDeviceInfo, AudioDeviceInfo...]

// Get a list of available speaker devices for use.
const localSpeakers = deviceManager.getSpeakerList(); // [AudioDeviceInfo, AudioDeviceInfo...]

```

### Set default microphone/speaker

Device manager allows you to set a default device that will be used when starting a call. If stack defaults are not set, Communication Services will fall back to OS defaults.

```js

// Get the microphone device that is being used.
const defaultMicrophone = deviceManager.getMicrophone();

// Set the microphone device to use.
await deviceMicrophone.setMicrophone(AudioDeviceInfo);

// Get the speaker device that is being used.
const defaultSpeaker = deviceManager.getSpeaker();

// Set the speaker device to use.
await deviceManager.setSpeaker(AudioDeviceInfo);

```

### Local camera preview

You can use `DeviceManager` and `Renderer` to begin rendering streams from your local camera. This stream won't be sent to other participants; it's a local preview feed. This is an asynchronous action.

```js
const localVideoDevice = deviceManager().getCameraList()[0];
const localCameraStream = new LocalVideoStream(localVideoDevice);
const renderer = new Renderer(localCameraStream);
const view = await renderer.createView();
someVideoHtmlDiv.appendChild(view.target);

```

### Request permission to camera/microphone

To prompt a user to grant permission to his camera/microphone call:

```js

const result = await deviceManager.askDevicePermission(audio: true, video: true); // resolves with Promise<IDeviceAccess>;
// result.audio = true|false
// result.video = true|false

```

You can inspect the current permission state for a given type by calling `getPermissionState`:

```js

const result = deviceManager.getPermissionState('Microphone'); // for microphone permission state
const result = deviceManager.getPermissionState('Camera'); // for camera permission state

console.log(result); // 'Granted' | 'Denied' | 'Prompt' | 'Unknown';

```

## Eventing model

You can subscribe to most of the properties and collections to be notified when values change.

### Properties
To subscribe to `property changed` events:

```js

const eventHandler = () => {
    // check current value of a property, value is not passed to callback
    console.log(object.property);
};
object.on('propertyNameChanged',eventHandler);

// To unsubscribe:

object.off('propertyNameChanged',eventHandler);

```

### Collections
To subscribe to `collection updated` events:

```js

const eventHandler = (e) => {
    // check added elements
    console.log(e.added);
    // check removed elements
    console.log(e.removed);
};
object.on('collectionNameUpdated',eventHandler);

// To unsubscribe:

object.off('collectionNameUpdated',eventHandler);

```