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

### Add the client library to your app

<!--TODO --> 

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling client library for JavaScript.

| Name                                              | Description                                                                                                                                      |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| CallAgent | This class is needed for all calling functionality. You instantiate it with your subscription information, and use it to start and manage calls. |

## Initialize the CallClient and obtain a Call Agent

To create a `CallClient` you have to use the constructor `new CallClient()` a `CallClient` object. To create a `CallAgent` you have to use `CallClient.createCallAgent` method that asynchronously returns a `CallAgent` object once it is initialized.

```java

String userToken = "<user token>";
android.content.Context appContext = this.getApplicationContext(); // From within an Activity for instance
CommunicationUserCredential communicationUserCredential = new CommunicationUserCredential(userToken);
Future<CallAgent> callAgentFuture = callClient.createCallAgent(appContext, CommunicationUserCredential).get();

```

## Place an outgoing call

To create and start a call you need to call one of the APIs on `CallAgent` and provide Communication Services Identity of a user that you've provisioned using Communication Services Management client library.

Call creation and start is synchronous. The `Call` instance allows you to subscribe to call events.

### Place a 1:1 call to a user or a 1:n call with users and PSTN

```java

CommunicationUser participants[] = new CommunicationUser[]{ new CommunicationUser("<acs user id>") };
StartCallOptions startCallOptions = new StartCallOptions();
Context appContext = this.getApplicationContext();
call = callAgent.call(appContext, participants, startCallOptions);

```

### Place a 1:n call with users and PSTN
To place the call to PSTN you have to specify phone number acquired with Communication Services
```java

CommunicationIdentifier participants[] = new CommunicationIdentifier[]{ new CommunicationUser("<acs user id>"), new PhoneNumber("<phone number>") };
StartCallOptions startCallOptions = new StartCallOptions();
startCallOptions.setAlternateCallerId(new PhoneNumber("<phone number>"));
Context appContext = this.getApplicationContext();
Call groupCall = callClient.call(participants, startCallOptions);

```

### Place a 1:1 call with with video camera

```java

Context appContext = this.getApplicationContext();
VideoDeviceInfo desiredCamera = callClient.getDeviceManager().get().getCameraList().get(0);
currentVideoStream = new LocalVideoStream(desiredCamera, appContext);
videoOptions = new VideoOptions(currentVideoStream);

CommunicationUser[] participants = new CommunicationUser[]{ new CommunicationUser("<acs user id>") };
StartCallOptions startCallOptions = new StartCallOptions();
startCallOptions.setVideoOptions(videoOptions);
call = callAgent.call(context, participants, startCallOptions);

```

### Join a group call

```java

Context appContext = this.getApplicationContext();
GroupCallContext groupCallContext = new groupCallContext("<group id as guid>");
JoinCallOptions joinCallOptions = new JoinCallOptions();

call = callAgent.join(context, groupCallContext, joinCallOptions);

```

<!--
## Handle incoming push notification

```java

try {
    callAgent.handlePushNotificationFuture.get();
    // Push Notification succeeds
} catch(ExecutionException) {
    // Push Notification fails
}

```
-->

## Call Management

You can access various call properties and perform various operations during a call to manage settings related to video and audio.

### Call properties

* Get the unique Id for this Call.

```java

String callId = call.getCallId();

```

* Collection of remote participants participating in this call.

```java

List<RemoteParticipant> remoteParticipants = call.getRemoteParticipants();

```

* The identity of caller if the call is incoming.

```java

CommunicationIdentifier callerId = call.callerId();

```

* Get the state of this Call. One of 'None' | 'Incoming' | 'Connecting' | 'Ringing' | 'Connected' | 'Hold' | 'Disconnecting' | 'Disconnected' | 'EarlyMedia';

```java

CallState callState = call.getState();

```

* Retreive the pair code/subcode indicating how a call has ended

```java

CallEndReason callEndReason = call.getCallEndReason();
int code = callEndReason.getCode();
int subCode = callEndReason.getSubCode();

```

* Determine whether this Call is incoming

```java

boolean isIncoming = call.getIsIncoming();

```

*  Determine whether this local microphone is muted

```java

boolean muted = call.getIsMicrophoneMuted();

```

* Retrieve the collection of video streams sent to other participants in a call.

```java

List<LocalVideoStream> localVideoStreams = call.getLocalVideoStreams();

```

### Mute and unmute

To mute or unmute the local endpoint you can use the `mute` and `unmute` asynchronous APIs:

```java

//mute local device 
Future muteCallFuture = call.mute();

//unmute local device 
Future unmuteCallFuture = call.unmute();

```

### Start and stop sending local video

To start sending local video to other participants in the call, invoke `startVideo` and pass a `LocalVideoStream` obtained from creating a `LocalVideoStream` object with a video device retrieved from the `deviceManager.getCameraList()` enumeration.

```java

VideoDeviceInfo desiredCamera = <get-video-device>;
Context appContext = this.getApplicationContext();
currentVideoStream = new LocalVideoStream(desiredCamera, appContext);
videoOptions = new VideoOptions(currentVideoStream);
Future startVideoFuture = call.startVideo(currentVideoStream);
startVideoFuture.get();

```

Once you start sending video, a `LocalVideoStream` instance is added to the `localVideoStreams` collection on a call instance.

```java

currentVideoStream == call.getLocalVideoStreams().get(0);

```

To stop local video, pass the `localVideoStream` returned from the `call.startVideo()` invocation.

```java

Future stopVideoFuture = call.stopVideo(localVideoStream);
stopVideoFuture.get();

```

## Remote participants management

All remote participants are represented by the `RemoteParticipant` type and available through the `remoteParticipants` collection on a call instance.

### List participants in a call

```java

List<RemoteParticipant> remoteParticipants = call.getRemoteParticipants();

```

### Remote participant properties

* Get the identifier for this remote participant.

```java

CommunicationIdentifier participantIdentity = remoteParticipant.getId();

```

* Get state of this remote participant. One of ParticipantState.Idle | ParticipantState.EarlyMedia | ParticipantState.Connecting | ParticipantState.Connected | ParticipantState.OnHold | ParticipantState.InLobby | ParticipantState.Disconnected

```java

ParticipantState state = remoteParticipant.getState();

```

* Get whether the participant is muted or not.

```java

boolean isParticipantMuted = remoteParticipant.getIsMuted();

```

* Get whether the participant is speaking or not.

```java

boolean isParticipantSpeaking = remoteParticipant.getIsSpeaking();

```

* Get the collection of video streams the participant is sharing.

```java

List<RemoteVideoStream> videoStreams = remoteParticipant.getVideoStreams(); // [RemoteVideoStream, RemoteVideoStream, ...]

```

* Get the participant reason for leaving the call.

```java

CallEndReason callEndReason = remoteParticipant.getCallEndReason();

```

### Add a participant to a call

To add a participant to a call (either a user or a phone number) you can invoke `addParticipant`. This will synchronously return the remote participant instance.

```java

RemoteParticipant remoteParticipant1 = call.addParticipant(new CommunicationUser("<acs user id>"));
RemoteParticipant remoteParticipant2 = call.addParticipant(new PhoneNumber("<phone number>"));

```

### Remove participant from a call
To remove participant from a call (either a user or a phone number) you can invoke `removeParticipant`. This will resolve asynchronously.

```java

// Get and remove first participant from a call
RemoteParticipant remoteParticipant = call.getParticipants().get(0);
Future removeParticipantFuture = call.removeParticipant(remoteParticipant);
removeParticipantFuture.get();

```

## Render remote participant video streams

Remote participants may send video or screen sharing during a call. To list them, inspect the `type` property on the `RemoteVideoStream` object.

```java

RemoteVideoStream remoteVideoStream = call.getRemoteParticipants().get(0)..getVideoStreams().get(0);
MediaStreamType streamType = remoteVideoStream.getType(); // of type MediaStreamType.Video or MediaStreamType.ScreenSharing

```

### Handle remote participant video/screen sharing streams

To list streams of remote participants, inspect the `videoStreams` or `screenSharingStreams` collections:

```java

RemoteVideoStream remoteVideoStream = remoteParticipant.getVideoStreams().get(0);

```

### Remote video stream properties

```java

// [MediaStreamType] type one of 'Video' | 'ScreenSharing';
MediaStreamType type = remoteVideoStream.getType();

// [boolean] if remote stream is available
boolean isAvailable = remoteScreenShareStream.getIsAvailable();

```

### Render remote participant video stream

To start rendering remote participant streams:

```java

Renderer remoteVideoRenderer = new Renderer(remoteVideoStream, appContext);
View uiView = remoteVideoRenderer.createView(new RenderingOptions(ScalingMode.Fit));

```

* Attach the renderingSurface to a viewable location on the app at this point

```java

layout.addView(uiView);

```

### Remote video renderer methods and properties

The `RemoteVideoRenderer` instance has the following properties:

```java

// [boolean] isRendering - indicating if stream is being rendered
remoteVideoRenderer.getIsRendering();

// [StreamSize] streamSize
remoteVideoRenderer.getSize();

```

The `RemoteVideoRenderer` instance has the following methods:

```java

// [UIView] target an UI node that should be used as a placeholder to render stream
remoteVideoRenderer.createView(...)

```

## Device management

`DeviceManager` lets you enumerate local devices that can be used in a call to transmit your audio/video streams. It also allows you to request permission from a user to access their microphone and camera using the native browser API.

You can access `deviceManager` on a `callClient` object:

```java

DeviceManager deviceManager = callClient.getDeviceManager();

```

### Enumerate local devices

To access local devices, you can use enumeration methods on the Device Manager. Enumeration is a synchronous action.

```java

// enumerate local cameras
List<VideoDeviceInfo> localCameras = deviceManager.getCameraList(); // [VideoDeviceInfo, VideoDeviceInfo...]
// enumerate local cameras
List<AudioDeviceInfo> localMicrophones = deviceManager.getMicrophoneList(); // [AudioDeviceInfo, AudioDeviceInfo...]
// enumerate local cameras
List<AudioDeviceInfo> localSpeakers = deviceManager.getSpeakerList(); // [AudioDeviceInfo, AudioDeviceInfo...]

```

### Set default microphone/speaker

Device manager allows you to set a default device that will be used when starting a call. If stack defaults are not set, Communication Services will fall back to OS defaults.

```java

// get default microphone
AudioDeviceInfo defaultMicrophone = deviceManager.getMicrophoneList().get(0);
// get default speaker
AudioDeviceInfo defaultSpeaker = deviceManager.getSpeakerList().get(0);

// [Synchronous] set default microphone
deviceManager.setMicrophone(new AudioDeviceInfo());

// [Synchronous] set default speaker
deviceManager.setSpeaker(new AudioDeviceInfo());

```

### Local camera preview

You can use `deviceManager` to begin rendering streams from your local camera. This stream won't be sent to other participants; it's a local preview feed. This is an asynchronous action.

```java

VideoDeviceInfo videoDevice = <get-video-device>;
Context appContext = this.getApplicationContext();
currentVideoStream = new LocalVideoStream(desiredCamera, appContext);
videoOptions = new VideoOptions(currentVideoStream);

Renderer previewRenderer = new Renderer(currentVideoStream, appContext);
View uiView previewRenderer.createView(new RenderingOptions(ScalingMode.Fit));

// Attach the renderingSurface to a viewable location on the app at this point
layout.addView(uiView);

```

### Local camera preview properties

Preview renderer has set of properties and methods that allows you to control it:

```java

// [boolean] isRendering
previewRenderer.getIsRendering();
// [StreamSize] streamSize
previewRenderer.getSize();

```

## Eventing model

You can subscribe to most of the properties and collections to be notified when values change.

### Properties

To subscribe to `property changed` events:

```java

// subscribe
PropertyChangedListener callStateChangeListener = new PropertyChangedListener()
{
    @Override
    public void onPropertyChanged(PropertyChangedEvent args)
    {
        Log.d("The call state has changed.");
    }
}
call.addOnCallStateChangedListener(callStateChangeListener);

//unsubscribe
call.removeOnCallStateChangedListener(callStateChangeListener);

```

### Collections

To subscribe to `collection updated` events:

```java

LocalVideoStreamsChangedListener localVideoStreamsChangedListener = new LocalVideoStreamsChangedListener()
{
    @Override
    @Override
    public void onLocalVideoStreamsUpdated(LocalVideoStreamsEvent localVideoStreamsEventArgs) {
        Log.d(localVideoStreamsEventArgs.getAddedStreams().size());
        Log.d(localVideoStreamsEventArgs.getRemovedStreams().size());
    }
}
call.addOnLocalVideoStreamsChangedListener(localVideoStreamsChangedListener);
// To unsubscribe
call.removeOnLocalVideoStreamsChangedListener(localVideoStreamsChangedListener);

```
