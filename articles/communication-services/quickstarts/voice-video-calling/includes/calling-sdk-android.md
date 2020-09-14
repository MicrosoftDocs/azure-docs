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
TODO

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling client library for JavaScript.

| Name                                              | Description                                                                                                                                      |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| [CallClient](../../../references/overview.md) | This class is needed for all calling functionality. You instantiate it with your subscription information, and use it to start and manage calls. |

## Initialize the CallClient

To create a `CallClient` you have to use the constructor `new CallClient()` method that asynchronously returns a `CallClient` object once it's initialized.

<!--To create call agent you have to pass a `CommunicationUserCredential` object. -->

```java

String userToken = "<user token>";
android.content.Context appContext = this.getApplicationContext(); // From within an Activity for instance
CommunicationUserCredential communicationUserCredential = new CommunicationUserCredential(userToken);
Future<CallAgent> callAgentFuture = callClient.createCallAgent(appContext, CommunicationUserCredential).get();

```

## Place an outgoing call

To create and start a call you need to call one of the APIs on CallClient and provide Communication Services Identity of a user that you've provisioned using Communication Services Management client library.

Call creation and start is synchronous. The `call` instance allows you to subscribe to call events.

### Place a 1:1 call to a user or a 1:n call with users and PSTN

```java

CommunicationUser participants[] = new CommunicationUser[]{ new CommunicationUser("acsUserId") };
StartCallOptions startCallOptions = new StartCallOptions();
Context appContext = this.getApplicationContext();
call = callAgent.call(appContext, participants, startCallOptions);

```

### Place a 1:n call with users and PSTN
To place the call to PSTN you have to specify phone number acquired with Communication Services
```java

CommunicationIdentifier participants[] = new CommunicationIdentifier[]{ new CommunicationUser("acsUserId"), new PhoneNumber("+1234567890") };
StartCallOptions startCallOptions = new StartCallOptions(alternateCallerId: new PhoneNumber("+1999999999"));
Context appContext = this.getApplicationContext();
Call groupCall = callClient.call(participants, callOptions);

```

### Place a 1:1 call with with video camera

```java

Context appContext = this.getApplicationContext();
currentVideoStream = new LocalVideoStream(desiredCamera, appContext);
videoOptions = new VideoOptions(currentVideoStream);

CommunicationUser[] participants = new CommunicationUser[]{ new CommunicationUser(callee) };
StartCallOptions startCallOptions = new StartCallOptions();
startCallOptions.setVideoOptions(videoOptions);
call = callAgent.call(context, participants, startCallOptions);

```

## Handle incoming push notification

```java

try {
    callAgent.handlePushNotificationFuture.get();
    // Push Notification succeeds
} catch(ExecutionException) {
    // Push Notification fails
}

```

## Mid-call operations

You can perform various operations during a call to manage settings related to video and audio.

### Mute and unmute

To mute or unmute the local endpoint you can use the `mute` and `unmute` asynchronous APIs:

```java

//mute local device 
Future muteCallFuture = call.mute();

//unmute local device 
Future unmuteCallFuture = call.unmute();

```

### Start and stop sending local video

To start sending local video to other participants in the call, invoke `startVideo` and pass a `videoDevice` from the `deviceManager.getCameraList()` enumeration.

```java

VideoDeviceInfo videoDevice = <get-video-device>;
Context appContext = this.getApplicationContext();
currentVideoStream = new LocalVideoStream(desiredCamera, appContext);
videoOptions = new VideoOptions(currentVideoStream);
call.startVideo(currentVideoStream).get();

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

RemoteParticipant[] remoteParticipants = call.getRemoteParticipants();

```

### Remote participant properties

```java

// [CommunicationIdentifier] userId - same as the one used to provision token for another user
CommunicationIdentifier participantIdentity = remoteParticipant.getId();

// ParticipantState.Idle = 0, ParticipantState.EarlyMedia = 1, ParticipantState.Connecting = 2, ParticipantState.Connected = 3, ParticipantState.OnHold = 4, ParticipantState.InLobby = 5, ParticipantState.Disconnected = 6
ParticipantState state = remoteParticipant.getState();

// [boolean] isMuted - indicating if participant is muted
boolean isParticipantMuted = remoteParticipant.getIsMuted();

// [boolean] isSpeaking - indicating if participant is currently speaking
boolean isParticipantSpeaking = remoteParticipant.getIsSpeaking();

// List<RemoteVideoStream> - collection of video streams this participants has
List<RemoteVideoStream> videoStreams = remoteParticipant.getVideoStreams(); // [RemoteVideoStream, RemoteVideoStream, ...]

// List<RemoteVideoStream> - collection of screen sharing streams this participants has
List<RemoteVideoStream> screenSharingStreams = remoteParticipant.getScreenSharingStreams(); // [RemoteVideoStream, RemoteVideoStream, ...]

// [AcsError] callEndReason - containing code/subcode/message indicating how call ended
AcsError callEndReason = remoteParticipant.getCallEndReason();

```

### Add a participant to a call

To add a participant to a call (either a user or a phone number) you can invoke `addParticipant`. This will synchronously return the remote participant instance.

```java

RemoteParticipant remoteParticipant = call.addParticipant(new CommunicationUSer("userId"));

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

Remote participants may send video or screen sharing during a call.

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
var isAvailable = remoteScreenShareStream.getIsAvailable();

```

You can subscribe to `availabilityChanged` and `activeRenderersChanged` events 

### Render remote participant stream

To start rendering remote participant streams:

```java

Renderer remoteVideoRenderer = new Renderer(remoteVideoStream, appContext);
View uiView = remoteVideoRenderer.createView(new RenderingOptions(ScalingMode.Fit));
// Attach the renderingSurface to a viewable location on the app at this point
layout.addView(uiView);

```

### Remote video renderer methods and properties

```java

// [boolean] isRendering - indicating if stream is being rendered
remoteVideoRenderer.getIsRendering();
// [ScalingMode] ScalingMode.Stretch = 0, ScalingMode.Crop = 1, ScalingMode.Fit = 2
remoteVideoRenderer.getScalingMode();
// [UIView] target an UI node that should be used as a placeholder to render stream
remoteVideoRenderer.createView(...)

```

The `RemoteVideoRenderer` instance has the following methods:

```java

remoteVideoRenderer.setScalingMode(scalingMode); // 'Stretch' | 'Crop' | 'Fit', change scaling mode
// pause rendering
Future remoteVideoRendererPauseFuture = remoteVideoRenderer.pause(); 
remoteVideoRendererPauseFuture.get();
// resume rendering
Future remoteVideoRendererResumeFuture = remoteVideoRenderer.resume(); 
remoteVideoRendererResumeFuture.get();

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
AudioDeviceInfo defaultMicrophone = deviceManager.getMicrophone();
// get default speaker
AudioDeviceInfo defaultSpeaker = deviceManager.getSpeaker();
// [Synchronous] set default microphone
defaultMicrophone.setMicrophone(new AudioDeviceInfo());
// [Synchronous] set default speaker
deviceManager.setSpeakers(new AudioDeviceInfo());

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
