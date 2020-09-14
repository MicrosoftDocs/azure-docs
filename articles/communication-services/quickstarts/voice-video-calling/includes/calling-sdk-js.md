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
| [CallingFactory](../../../references/overview.md) | This class is needed for all calling functionality. You instantiate it with your subscription information, and use it to start and manage calls. |

## Initialize the CallClient

To create a `CallAgent` you have to use `CallClient.createCallAgent` method that asynchronously returns a `CallAgent` object.

You have to pass a `CommunicationUserCredential` object to the `CallClient.createCallAgent` method.

```js

const userToken = '<user token>';
callClient = new CallClient(options);
const tokenCredential = new CommunicationUserCredential(userToken);
callAgent = await callClient.createCallAgent(tokenCredential);

```

## Place an outgoing call

To create and start a call you need to call one of the APIs on `CallClient` and provide Communication Services Identity of a user that you've provisioned using the Communication Services Management client library.

Call creation and start is synchronous and you'll receive a call instance, allowing you to subscribe to all events on the call.

### Place a 1:1 call to a user or a 1:n call with users and PSTN

```js

const placeCallOptions = {};
const acsUserId = CommunicationUser('8:acsUserId');
const oneToOneCall = callAgent.call([acsUserId], placeCallOptions);

```

### Place a 1:n call with users and PSTN
To place the call to PSTN you have to specify phone number acquired with Communication Services
```js

const placeCallOptions = {alternateCallerId: new PhoneNumber('+1999999999')};
const acsUser1 = CommunicationUser('8:acsUserId');
const acsUser2 = PhoneNumber('+1234567890');
const groupCall = callClient.call([acsUser1, acsUser2], placeCallOptions);

```

### Place a 1:1 call with with video camera

```js

const videoDeviceInfo = await callClient.getDeviceManager().getCameraList()[0];
localVideoStream = new LocalVideoStream(videoDeviceInfo);
const placeCallOptions = {videoOptions: {localVideoStreams:[localVideoStream]}};
const call = callClient.call(['acsUserId'], placeCallOptions);

```

## Mid-call operations

You can perform various operations during a call to manage settings related to video and audio.

### Mute and unmute

To mute or unmute the local endpoint you can use the `mute` and `unmute` asynchronous APIs:

```js

//mute local device 
await call.mute();

//unmute device 
await call.unmute();

```

### Start and stop sending local video

To start sending local video to other participants in the call, invoke `startVideo` and pass a `videoDevice` from the `deviceManager.getCameraList()` enumeration.

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

```js

const identity: CommunicationUser | PhoneNumber | CallingApplication | UnknownIdentifier = remoteParticipant.identifier;

const state: string = remoteParticipant.state; // one of 'Idle' | 'Connecting' | 'Connected' | 'Hold' | 'InLobby' | 'EarlyMedia' | 'Disconnected';

const callEndReason: CallEndReason = remoteParticipant.callEndReason; // reason why participant left the call, contains code/subcode/message

const isMuted: boolean = remoteParticipant.isMuted; // indicates if participant is muted

const isSpeaking: boolean = remoteParticipant.isSpeaking; // indicates if participant is speaking

const videoStreams: RemoteVideoStream[] = remoteParticipant.videoStreams; // collection of video streams this participants has [RemoteVideoStream, RemoteVideoStream, ...]

const screenSharingStreams: RemoteVideoStream[] = remoteParticipant.screenSharingStreams; // collection of screen sharing streams this participants has, [RemoteVideoStream, RemoteVideoStream, ...]

```

### Add a participant to a call

To add a participant to a call (either a user or a phone number) you can invoke `addParticipant`. This will synchronously return the remote participant instance.

```js
const acsUser = new CommunicationUser('8:acsId')
const acsPhone = new PhoneNumber('+123456789');
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

To list the streams of remote participants, inspect the `videoStreams` or `screenSharingStreams` collections:

```js

const remoteParticipantStream = call.remoteParticipants[0].videoStreams[0];
const remoteParticipantStream = call.remoteParticipants[0].screenSharingStreams[0];

```
 
To render a `remoteParticipantStream`:

```js
let renderer: Renderer;
const displayVideo = () => {
	renderer = new Renderer(remoteParticipantStream);
	const view = await renderer.createView();
	someVideoHtmlDiv.appendChild(view.target);
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

const type: string = remoteParticipantStream.type; // 'Video' | 'ScreenSharing';
const type: boolean = remoteParticipantStream.isAvailable; // indicates if remote stream is available

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
// The current scale mode for the video. "Stretch" | "Crop" | "Fit"
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

You can access `deviceManager` on a `callClient` or `callAgent` object:

```js

const deviceManager = callClient.getDeviceManager();
const deviceManager = callAgent.deviceManager;

```

### Enumerate local devices

To access local devices, you can use enumeration methods on the Device Manager. Enumeration is a synchronous action.

```js

// enumerate local cameras
const localCameras = deviceManager.getCameraList(); // [VideoDeviceInfo, VideoDeviceInfo...]
// enumerate local cameras
const localMicrophones = deviceManager.getMicrophoneList(); // [AudioDeviceInfo, AudioDeviceInfo...]
// enumerate local cameras
const localSpeakers = deviceManager.getSpeakerList(); // [AudioDeviceInfo, AudioDeviceInfo...]

```

### Set default microphone/speaker

Device manager allows you to set a default device that will be used when starting a call. If stack defaults are not set, Communication Services will fall back to OS defaults.

```js

// get default microphone
const defaultMicrophone = deviceManager.getMicrophone();
// [asynchronous] set default microphone
await deviceMicrophone.setMicrophone(AudioDeviceInfo);
// get default speaker
const defaultSpeaker = deviceManager.getSpeaker();
// [asynchronous] set default speaker
await deviceManager.setSpeaker(AudioDeviceInfo);

```

### Local camera preview

You can use `deviceManager` to begin rendering streams from your local camera. This stream won't be sent to other participants; it's a local preview feed. This is an asynchronous action.

```js
const localVideoDevice = deviceManager().getCameraList()[0];
const localCameraStream = new LocalVideoStream(localVideoDevice);
const renderer = new Renderer(localCameraStream);
const view = await renderer.createView();
someVideoHtmlDiv.appendChild(view.target);

```

### Request permission to camera/microphone (JavaScript only)

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
