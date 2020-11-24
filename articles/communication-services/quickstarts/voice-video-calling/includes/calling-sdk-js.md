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

Use the `npm install` command to install the Azure Communication Services Calling and Common client libraries for JavaScript.

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
| AzureCommunicationUserCredential | The AzureCommunicationUserCredential class implements the CommunicationUserCredential interface which is used to instantiate the CallAgent. |


## Initialize the CallClient, create CallAgent, and access DeviceManager

Instantiate a new `CallClient` instance. You can configure it with custom options like a Logger instance.
Once a `CallClient` is instantiated, you can create a `CallAgent` instance by calling the `createCallAgent` method on the `CallClient` instance. This asynchronously returns a `CallAgent` instance object.
The `createCallAgent` method takes a `CommunicationUserCredential` as an argument, which accepts a [user access token](../../access-tokens.md).
To access the `DeviceManager` a callAgent instance must first be created. You can then use the `getDeviceManager` method on the `CallClient` instance to get the DeviceManager.

```js
const userToken = '<user token>';
callClient = new CallClient(options);
const tokenCredential = new AzureCommunicationUserCredential(userToken);
const callAgent = await callClient.createCallAgent(tokenCredential);
const deviceManager = await callClient.getDeviceManager()
```

## Place an outgoing call

To create and start a call you need to use one of the APIs on CallAgent and provide a user that you've created through the Communication Services administration client library.

Call creation and start is synchronous. The Call instance allows you to subscribe to call events.

## Place a 1:1 call to a user or a 1:n call with users and PSTN

To place a call to another Communication Services user, invoke the `call` method on `callAgent` and pass the CommunicationUser that you've [created with the Communication Services Administration library](../../access-tokens.md).

```js
const oneToOneCall = callAgent.call([CommunicationUser]);
```

### Place a 1:n call with users and PSTN

To place a 1:n call to a user and a PSTN number you have to specify a CommunicationUser
and a Phone Number for both callees.

Your Communication Services resource must be configured to allow PSTN calling.
```js

const userCallee = { communicationUserId: <ACS_USER_ID> }
const pstnCallee = { phoneNumber: <PHONE_NUMBER>};
const groupCall = callAgent.call([userCallee, pstnCallee], placeCallOptions);

```

### Place a 1:1 call with video camera
> [!WARNING]
> There can currently be no more than one outgoing local video stream.
To place a video call, you have to enumerate local cameras using the deviceManager `getCameraList` API.
Once you select the desired camera, use it to construct a `LocalVideoStream` instance and pass it within `videoOptions`
as an item within the `localVideoStream` array to the `call` method.
Once your call connects it'll automatically start sending a video stream from the selected camera to the other participant(s)
```js
const deviceManager = await callClient.getDeviceManager();
const videoDeviceInfo = deviceManager.getCameraList()[0];
localVideoStream = new LocalVideoStream(videoDeviceInfo);
const placeCallOptions = {videoOptions: {localVideoStreams:[localVideoStream]}};
const call = callAgent.call(['acsUserId'], placeCallOptions);

```

### Join a group call
To start a new group call or join an ongoing group call, use the 'join' method
and pass an object with a `groupId` property. The value has to be a GUID.
```js

const context = { groupId: <GUID>}
const call = callAgent.join(context);

```

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

* The identity of caller if the call is incoming. Identity is one of the `Identifier` types
```js

const callerIdentity = call.callerIdentity;

```

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
* 'Hold' - call is put on hold, no media is flowing between local endpoint and remote participant(s)
* 'Disconnecting' - transition state before the call goes to 'Disconnected' state
* 'Disconnected' - final call state.
   * If network connection is lost, state goes to 'Disconnected' after about 2 minutes.


* To see why a given call ended, inspect the `callEndReason` property.
```js

const callEndReason = call.callEndReason;
// callEndReason.code (number) code associated with the reason
// callEndReason.subCode (number) subCode associated with the reason
```

* To learn if the current call is an incoming call, inspect the `isIncoming` property, it returns `Boolean`.
```js
const isIncoming = call.isIncoming;
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

### Mute and unmute

To mute or unmute the local endpoint you can use the `mute` and `unmute` asynchronous APIs:

```js

//mute local device 
await call.mute();

//unmute local device 
await call.unmute();

```

### Start and stop sending local video


To start a video, you have to enumerate cameras using the `getCameraList` method on the `deviceManager` object. Then create a new instance of `LocalVideoStream` passing the desired camera into the `startVideo` method as an argument:


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
const source callClient.getDeviceManager().getCameraList()[1];
localVideoStream.switchSource(source);

```
### FAQ
 * If network connectivity is lost, does the call state change to 'Disconnected' ?
    * Yes, if network connection is lost for more than 2 minutes, call will transition to Disconnected state and call will end.

## Remote participants management

All remote participants are represented by `RemoteParticipant` type and available through `remoteParticipants` collection on a call instance.

### List participants in a call
The `remoteParticipants` collection returns a list of remote participants in given call:

```js

call.remoteParticipants; // [remoteParticipant, remoteParticipant....]

```

### Remote participant properties
Remote participant has a set of properties and collections associated with it

* Get the identifier for this remote participant.
Identity is one of the 'Identifier' types:
```js
const identifier = remoteParticipant.identifier;
//It can be one of:
// { communicationUserId: '<ACS_USER_ID'> } - object representing ACS User
// { phoneNumber: '<E.164>' } - object representing phone number in E.164 format
```

* Get state of this remote participant.
```js

const state = remoteParticipant.state;
```
State can be one of
* 'Idle' - initial state
* 'Connecting' - transition state while participant is connecting to the call
* 'Connected' - participant is connected to the call
* 'Hold' - participant is on hold
* 'EarlyMedia' - announcement is played before participant is connected to the call
* 'Disconnected' - final state - participant is disconnected from the call.
   * If remote participant loses their network connectivity, then remote participant state goes to 'Disconnected' after about 2 minutes.

To learn why participant left the call, inspect `callEndReason` property:
```js

const callEndReason = remoteParticipant.callEndReason;
// callEndReason.code (number) code associated with the reason
// callEndReason.subCode (number) subCode associated with the reason
```

* To check whether this remote participant is muted or not, inspect `isMuted` property, it returns `Boolean`
```js
const isMuted = remoteParticipant.isMuted;
```

* To check whether this remote participant is speaking or not, inspect `isSpeaking` property it returns `Boolean`
```js

const isSpeaking = remoteParticipant.isSpeaking;

```

* To inspect all video streams that a given participant is sending in this call, check `videoStreams` collection, it contains `RemoteVideoStream` objects
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
const remoteParticipant = call.addParticipant(pstnIdentifier);
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
const streamType: MediaStreamType = remoteVideoStream.type;
```
 
To render a `RemoteVideoStream`, you have to subscribe to a `isAvailableChanged` event.
If the `isAvailable` property changes to `true`, a remote participant is sending a stream.
Once that happens, create a new instance of `Renderer`, and then create a new `RendererView` instance using the asynchronous
`createView` method.  You may then attach `view.target` to any UI element.
Whenever availability of a remote stream changes you can choose to destroy the whole Renderer, a specific `RendererView`
or keep them, but this will result in displaying blank video frame.

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
Remote video streams have the following properties:

* `Id` - ID of a remote video stream
```js
const id: number = remoteVideoStream.id;
```

* `StreamSize` - size (width/height) of a remote video stream
```js
const size: {width: number; height: number} = remoteVideoStream.size;
```

* `MediaStreamType` - can be 'Video' or 'ScreenSharing'
```js
const type: MediaStreamType = remoteVideoStream.type;
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
When creating a `RendererView` you can specify `scalingMode` and `mirrored` properties.
Scaling mode can be 'Stretch', 'Crop', or 'Fit'
If `Mirrored` is specified, the rendered stream will be flipped vertically.

```js
const rendererView: RendererView = renderer.createView({ scalingMode, mirrored });
```
Any given `RendererView` instance has a `target` property that represents the rendering surface. This has to be attached in the application UI:
```js
document.body.appendChild(rendererView.target);
```

You can later update the scaling mode by invoking the `updateScalingMode` method.
```js
view.updateScalingMode('Crop')
```
### FAQ
* If a remote participant loses their network connection, does their state change to 'Disconnected' ?
    * Yes, if a remote participant loses their network connection for more than 2 minutes, their state will transition to Disconnected and they will be removed from the call.
## Device management

`DeviceManager` lets you enumerate local devices that can be used in a call to transmit your audio/video streams. It also allows you to request permission from a user to access their microphone and camera using the native browser API.

You can access the `deviceManager` by calling `callClient.getDeviceManager()` method.
> [!WARNING]
> Currently a `callAgent` object must be instantiated first in order to gain access to DeviceManager

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

Device manager allows you to set a default device that will be used when starting a call.
If client defaults are not set, Communication Services will fall back to OS defaults.

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
document.body.appendChild(view.target);

```

### Request permission to camera/microphone

Prompt a user to grant camera/microphone permissions with the following:

```js
const result = await deviceManager.askDevicePermission(audio: true, video: true);
```
This will resolve asynchronously with an object indicating if `audio` and `video` permissions were granted:
```js
console.log(result.audio);
console.log(result.video);
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
