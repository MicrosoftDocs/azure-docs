---
title: Migrating from Twilio Video to ACS Calling Android
description: Guide describes how to migrate Android apps from Twilio Video to Azure Communication Services Calling SDK. 
services: azure-communication-services
ms.date: 01/30/2024
ms.topic: include
author: sloanster
ms.author: micahvivion
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

## Prerequisites

1. **Azure Account:** Make sure that your Azure account is active. New users can create a free account at [Microsoft Azure](https://azure.microsoft.com/free/).
2. **Communication Services Resource:** Set up a [Communication Services Resource](../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp) via your Azure portal and note your connection string.
3. **Azure CLI:** Follow the instructions to [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows?tabs=azure-cli).
4. **User Access Token:** Generate a user access token to instantiate the call client. You can create one using the Azure CLI as follows:

```console
az communication identity token issue --scope voip --connection-string "yourConnectionString"
```

For more information, see [Use Azure CLI to Create and Manage Access Tokens](../../quickstarts/identity/access-tokens.md?pivots=platform-azcli).

For Video Calling as a Teams user:

- You can also use Teams identity. To generate an access token for a Teams User, see [Manage teams identity](../../quickstarts/manage-teams-identity.md?pivots=programming-language-javascript).
- Obtain the Teams thread ID for call operations using the [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer). For information about creating a thread ID, see [Create chat - Microsoft Graph v1.0 > Example2: Create a group chat](/graph/api/chat-post?preserve-view=true&tabs=javascript&view=graph-rest-1.0#example-2-create-a-group-chat).

## UI Library

The Azure Communication Services UI library simplifies the process of creating modern communication user interfaces using Azure Communication Services Calling. It offers a collection of ready-to-use UI components that you can easily integrate into your application.


This open source prebuilt set of controls enables you to create aesthetically pleasing designs using Fluent UI SDK components and develop high quality audio/video communication experiences. For more information, check out the Azure Communications Services [UI Library overview](../../concepts/ui-library/ui-library-overview.md?pivots=platform-mobile). The overview includes comprehensive information about both web and mobile platforms.

## Installation

To start the migration from Twilio Video, the first step is to install the Azure Communication Services Calling SDK for Android to your project. The Azure Communication Services Calling SDK can be integrated as a `gradle` dependency.

1. Add the azure-communication-calling package

```groovy
dependencies {
     ...
    implementation "com.azure.android:azure-communication-calling:<version>"
}
```

2. Check permissions in application manifest

Ensure that your application's manifest file contains the necessary permissions, and make the required adjustments.

```xml
<manifest >
   <uses-feature android:name="android.hardware.camera" /> 
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
   <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
   <uses-permission android:name="android.permission.RECORD_AUDIO" />
</manifest>
```

## Authenticating to the SDK

To be able to use the Azure Communication Services Calling SDK, you need to authenticate using an access token.

### Twilio

The following code snippets presume the availability of a valid access token for Twilio Services.

From within the Twilio Video, the access token is used to connect to a room. By passing the token to `ConnectOptions`, you can create the option to create or connect a room.

# [Java](#tab/java)

```java
ConnectOptions connectOptions = new ConnectOptions.Builder(accessToken).build();
room = Video.connect(context, connectOptions, roomListener);
```

# [Kotlin](#tab/kotlin)

```kotlin
val connectOptions = ConnectOptions.Builder(accessToken).build()
room = Video.connect(context, connectOptions, roomListener)
```
---

### Azure Communication Services

The following code snippets require a valid access token to initiate a `CallClient`.

You need a valid token. For more information, see [Create and Manage Access Tokens](../../quickstarts/identity/access-tokens.md).

# [Java](#tab/java)

```java
String userToken = "<USER_TOKEN>";
CommunicationTokenCredential tokenCredential = new CommunicationTokenCredential(accessToken);

CallClient callClient = new CallClient();
callAgent = callClient.createCallAgent(getApplicationContext(), tokenCredential).get();
```

# [Kotlin](#tab/kotlin)
```kotlin
val userToken = "<USER_TOKEN>"
val communicationCredential = CommunicationTokenCredential(accessToken)
val callAgent: CallAgent = CallClient().createCallAgent(
     applicationContext,
     communicationCredential,
     CallAgentOptions()
).get()
```
---

### Class reference

| Class Name | Description          |
|-----------|----------------------|
|[CallClient](/java/api/com.azure.android.communication.calling.callclient) | The class serving as the entry point for the Calling SDK.|
|[CommunicationTokenCredential](/java/api/com.azure.android.communication.calling) | The Azure Communication Services User token credential|
|[CallAgent](/java/api/com.azure.android.communication.calling.callagent) |The class responsible for managing calls on behalf of the authenticated user |

## Initiating an outgoing call

### Twilio

Twilio Video has a concept of `Room`, where if user Bob wants to have a call with client Alice, Bob can create a room and Alice has to connect to it by implementing a feature like push notification.

When user Bob or user Alice wants to create or connect to a room, and they have a valid access token. They can pass the room name they want to create or connect to as a parameter of `ConnectOptions`.

# [Java](#tab/java)
```java
ConnectOptions connectOptions = new ConnectOptions.Builder(accessToken)
    .roomName(roomName)
    .build()
room = Video.connect(context, connectOptions, roomListener);
```

# [Kotlin](#tab/kotlin)

```kotlin
    val connectOptions: ConnectOptions = ConnectOptions.Builder(accessToken)
        .roomName(roomName)
        .build()
    val room = Video.connect(context, connectOptions, roomListener)
```
---

### Azure Communication Services

#### Connect to a call

Initiating a call with the Azure Communication Service Calling SDK consists of the following steps:

The `CommunicationUserIdentifier` represents a user identity that was created using the [Identity SDK or REST API](../../quickstarts/identity/access-tokens.md). It's the only identifier used if your application doesn't use Microsoft Teams interoperability or Telephony features.

1. Creating an Array of `CommunicationUserIdentifier`
2. Calling `startCall` method on the previously created `CallAgent`

# [Java](#tab/java)
```java
ArrayList<CommunicationIdentifier> userCallee = new ArrayList<>();
participants.add(new CommunicationUserIdentifier(“<USER_ID>”));

Call call = callAgent.startCall(context, userCallee);
```

# [Kotlin](#tab/kotlin)
```kotlin
val call: Call = callAgent.startCall(
     applicationContext,
     listOf(CommunicationUserIdentifier(“<USER_ID>”))
)
```
---

#### Connect to a Teams call

##### With External Identity

Connecting to a Teams call is almost identical to connecting to a call. Instead of using `StartCallOptions`, the client application uses `JoinCallOptions` with a `TeamsMeetingLocator`.

The Teams meeting link can be retrieved using Graph APIs. The retrieval process is detailed in the [graph documentation](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true).

# [Java](#tab/java)
```java
JoinCallOptions options = new JoinCallOptions();
TeamsMeetingLinkLocator teamsMeetingLinkLocator = new TeamsMeetingLinkLocator(meetingLink);
Call call = callAgent.join(getApplicationContext(), teamsMeetingLinkLocator, joinCallOptions);
```

# [Kotlin](#tab/kotlin)

```kotlin
val options = JoinCallOptions()
val teamsMeetingLinkLocator = TeamsMeetingLinkLocator(meetingLink)
val call: Call = callAgent.join(getApplicationContext(), teamsMeetingLinkLocator, joinCallOptions)
```
---

## Accepting and joining a call

### Twilio

Twilio Video uses the concept of a `Room`. Different clients can establish communication by joining the same room. So accept and join a call is not straight alternative.

### Azure Communication Services

#### Receiving incoming call

To accept calls, the application must first be configured to receive incoming calls.

#### Register for push notifications and handle incoming push notification

A calling client can select to receive push notifications to receive incoming calls. This [guide](/azure/communication-services/how-tos/calling-sdk/push-notifications?pivots=platform-android#set-up-push-notifications) describes how to set up APNS for the Azure Communication Services Calling.

#### Setting up the `CallAgentListener`

The Azure Communication Services Calling SDK includes an `IncomingCallListener`. An `IncomingCallListener` is set on the `CallAgent` instance. This listener defines an `onIncomingCall(IncomingCall incomingCall)` method, which is triggered upon the arrival of an incoming call.

# [Java](#tab/java)
```java
callAgent.addOnIncomingCallListener((incomingCall) -> {
     this.incomingCall = incomingCall;

     // Get incoming call ID  
     incomingCall.getId();

     // Get information about caller
     incomingCall.getCallerInfo();

     // CallEndReason is also a property of IncomingCall
      CallEndReason callEndReason = incomingCall.getCallEndReason();
});
```

# [Kotlin](#tab/kotlin)
```kotlin
callAgent.addOnIncomingCallListener { incomingCall ->
     this.incomingCall = incomingCall

     // Get incoming call ID
     incomingCall.id

     // Get information about caller
     incomingCall.callerInfo

    // callEndReason is also a property of IncomingCall
    val callEndReason = incomingCall.callEndReason
}
```
---

Implementing the `CallAgentListener` and associating it with a `CallAgent` instance, the application is ready to receive incoming calls.

#### Accept incoming call

# [Java](#tab/java)
```java
incomingCall.accept(context);
```
# [Kotlin](#tab/kotlin)
```kotlin
incomingCall.accept(context)
```
---

#### Class reference

|Class Name | Description          |
|-----------|----------------------|
|[IncomingCallListener](/java/api/com.azure.android.communication.calling.incomingcalllistener) | Functional interface for incoming calls. |
|[IncomingCall](/java/api/com.azure.android.communication.calling.incomingcall)| Describes an incoming call |

## Video Stream

### Starting and Stopping Video

#### Twilio

##### Accessing the camera

With Twilio Video, adding video to a call consists of two steps:

1. Accessing the camera
2. Adding the video track to the list of `LocalVideoTrack`

# [Java](#tab/java)
```java
 // Access the camera
CameraCapturer cameraCapturer = new Camera2Capturer(context, frontCameraId);

  // Create a video track
LocalVideoTrack videoTrack = LocalVideoTrack.create(context, true, cameraCapturer, LOCAL_VIDEO_TRACK_NAME);

  // The VideoTrack is enabled by default. It can be enabled or disabled if necessary
videoTrack.enable(true|false);

```

# [Kotlin](#tab/kotlin)
```kotlin
// Access the camera
val cameraCapturer: CameraCapturer = Camera2Capturer(context, frontCameraId)

// Create a video track
val localVideoTrack = LocalVideoTrack.create(context, enable, cameraCapturer)

// The VideoTrack is enabled by default. It can be enabled or disabled if necessary
videoTrack.enable(true|false)
```
---

##### Adding the `LocalVideoTrack`

**At connect time** . Adding a local video track is done by passing the `LocalVideoTrack` to the `LocalVideoTrack` list that is set via `ConnectOptions`.

# [Java](#tab/java)
```java
 ConnectOptions connectOptions = new ConnectOptions.Builder(accessToken)
    .roomName(roomName)
    .videoTracks(localVideoTracks)
}
```

# [Kotlin](#tab/kotlin)
```kotlin
    val connectOptions = ConnectOptions.Builder(accessToken)
        .roomName(roomName)
        .videoTracks(localVideoTracks)
}
```
---

In an **existing room**, the local participant can publish a local video track via the `publishTrack(LocalVideoTrack localVideoTrack)` method.

# [Java](#tab/java)
```java
room.localParticipant.publishVideoTrack(localVideoTrack)
```

# [Kotlin](#tab/kotlin)
```kotlin
room.localParticipant.publishVideoTrack(localVideoTrack)
```
---

#### Azure Communication Services

##### Accessing the camera

Accessing the camera is done through the `DeviceManager`. Obtain an instance of the `DeviceManager` using the following code snippet.

# [Java](#tab/java)
```java
DeviceManager deviceManager = callClient.getDeviceManager(getApplicationContext()).get();

deviceManager.getCameras();
```

# [Kotlin](#tab/kotlin)
```kotlin
val deviceManager: DeviceManager = CallClient().getDeviceManager(applicationContext).get()

deviceManager.cameras
```
---

##### Creating the `LocalVideoStream`

The `DeviceManager` provides access to camera objects that allow the creation of a `LocalVideoStream` instance.

# [Java](#tab/java)
```java
VideoDeviceInfo camera = deviceManager.getCameras().get(0);
LocalVideoStream videoStream = new LocalVideoStream(camera, context);
```

# [Kotlin](#tab/kotlin)
```kotlin
val camera : VideoDeviceInfo? = deviceManager.cameras.firstOrNull()
val videoStream = LocalVideoStream(camera, context)
```
---

##### Adding the `LocalVideoStream`

**At connect time**. The `LocalVideoStream` is added to the streams via the OutgoingVideoOptions of the `StartCallOptions`.

# [Java](#tab/java)
```java
    StartCallOptions options = new StartCallOptions();
    LocalVideoStream[] videoStreams = new LocalVideoStream[1];
    videoStreams[0] = videoStream;
    VideoOptions videoOptions = new VideoOptions(videoStreams);
    options.setVideoOptions(videoOptions);
```

# [Kotlin](#tab/kotlin)
```kotlin
    val options = StartCallOptions()
    val videoStreams: Array<LocalVideoStream> = arrayOf(localVideoStream)
    val videoOptions = VideoOptions(videoStreams)
    options.setVideoOptions(videoOptions)
```
---

**In a call**. Initiate a video stream by invoking the `startVideo` method, which accepts a `LocalVideoStream` as its parameter.

# [Java](#tab/java)
```java
call.startVideo(context, videoStream).get();
```

# [Kotlin](#tab/kotlin)
```kotlin
call.startVideo(context, videoStream).get()
```
---

#### Class reference

|Class Name | Description          |
|-----------|----------------------|
|[DeviceManager](/java/api/com.azure.android.communication.calling.devicemanager) | Facilitates the interaction with the device |
|[LocalVideoStream](/java/api/com.azure.android.communication.calling.localvideostream) | Local video stream information |
|[VideoDeviceInfo](/java/api/com.azure.android.communication.calling.videodeviceinfo) | Information about a video device |
|[VideoOptions](/java/api/com.azure.android.communication.calling.videooptions) | Property bag class for Video Options |
|[Call](/java/api/com.azure.android.communication.calling.call)|Describes a call|

## Rendering video

### Twilio

To render video using Twilio Video, an object conforming to the `VideoSink` can be added to `VideoTrack`. The SDK provides a prebuilt `VideoSink` called `VideoView`, which subclasses `android.view.View`.

 # [Java](#tab/java)

```java
videoTrack.addSink(videoVideoView);
```

# [Kotlin](#tab/kotlin)

```kotlin
videoTrack.addSink(videoVideoView);
```
---

### Azure Communication Services

To render video with Azure Communication Services Calling, instantiate a `VideoStreamRenderer` and pass a `LocalVideoStream` or a `RemoteVideoStream` as a parameter to its constructor.

# [Java](#tab/java)

```java
VideoStreamRenderer previewRenderer = new VideoStreamRenderer(remoteStream, context);
VideoStreamRendererView preview = previewRenderer.createView(new CreateViewOptions(ScalingMode.FIT));
```

# [Kotlin](#tab/kotlin)

```kotlin
val previewRenderer = VideoStreamRenderer(localVideoStream, context)
val preview: VideoStreamRendererView = previewRenderer.createView(CreateViewOptions(ScalingMode.FIT))
videoContainer.addView(preview)
```
---

#### Class reference

|Class Name | Description          |
|-----------|----------------------|
|[ScalingMode](/java/api/com.azure.android.communication.calling.scalingmode) | Enum for local and remote video scaling mode|
|[CreateViewOptions](/java/api/com.azure.android.communication.calling.createviewoptions) | Options to be passed when rendering a Video |
|[VideoStreamRenderer](/java/api/com.azure.android.communication.calling.videostreamrenderer) | Renderer for video rendering |
|[VideoStreamRendererView](/java/api/com.azure.android.communication.calling.videostreamrendererview)|View used to render video|

## Audio Stream

### Toggling the microphone

#### Twilio

On the Twilio Video SDK, muting and unmuting the microphone is achieved by enabling or disabling the LocalAudioTrack associated with the microphone.

# [Java](#tab/java)
```java
localAudioTrack.enable(true|false);
```

# [Kotlin](#tab/kotlin)
```kotlin
localAudioTrack.enable(true|false)
```
---

#### Azure Communication Services

The `Call` object proposes methods for muting and unmuting the microphone.

# [Java](#tab/java)
```java
call.muteOutgoingAudio(context).get();
call.unmuteOutgoingAudio(context).get();

// Mute incoming audio sets the call volume to 0. To mute or unmute the incoming audio, use the muteIncomingAudio and unmuteIncomingAudio asynchronous APIs

call.muteIncomingAudio(context).get();
call.unmuteIncomingAudio(context).get();

```

# [Kotlin](#tab/kotlin)
```kotlin
call.muteOutgoingAudio(context).get()
call.unmuteOutgoingAudio(context).get()

// Mute incoming audio sets the call volume to 0. To mute or unmute the incoming audio, use the muteIncomingAudio and unmuteIncomingAudio asynchronous APIs

call.muteIncomingAudio(context).get()
call.unmuteIncomingAudio(context).get()

```
---

## Event Listeners

Twilio Video and Azure Communication Services Calling SDKs propose various listeners to listen to call events.

### Room / Call Events

#### Twilio

The `Room.Listener` allows clients to listen to events related to the `Room` object. The `Room.Listener` includes methods that are triggered for the following events:

- The client connected or failed to connect to a room
- The client is reconnecting to the room or reconnected
- A remote participant connected, disconnected, reconnected to the room
- The room recording started or stopped
- The dominant speaker changed

#### Azure Communication Services

The Azure Communication Services Calling SDK enable the `Call` object to incorporate various `PropertyChangedListener`, notifying them when a call property changes. Each event type should be subscribed to individually.  To learn more about event handling, see the [events tutorial.](../../how-tos/calling-sdk/events.md)

The various `PropertyChangedListeners` that can be assigned to a call encompass certain events covered by the Twilio `Room.Listener`, featuring methods for the following events:

- The call state changed
- The list of remote participants updated
- The local video stream updated
- The mute state changed

### Local Participant Events

#### Twilio

Twilio has a `LocalParticipant.Listener` that allows clients to receive updates about the following events:

- The local participant published or failed to publish a media track (audio, video, data).
- The network quality level for the local participant changed.

#### Azure Communication Services

The `CallAgent` receives updates regarding calls through two listeners: `CallsUpdatedListener` and the `IncomingCallListener`. These listeners are triggered respectively for the following events:

- Calls are updated. A new call is created or an existing call is disconnected.
- An incoming call is received.

### Remote Participant Events

Both SDKs offer mechanisms to handle updates from remote participants.

#### Twilio

The `RemoteParticipant.Listener` handles the following events.

- The remote participant published or unpublished a media track (video, audio, data)
- The local participant subscribed, failed to subscribe, or unsubscribed to a remote media track (video, audio, data)
- The remote participant network quality changed
- The remote participant changed the priority of a track publication
- The remote participant switched on/off its video track

#### Azure Communication Services

Add a `PropertyChangedListener` to the `RemoteParticipant` object to receive updates for the following events:

- The remote participant state changed
- The remote participant is muted or not muted
- The remote participant is speaking
- The remote participant display name changed
- The remote participant added or removed a video stream

### Camera Events

#### Twilio

Twilio proposes a `CameraCapturer.Listener` to notify client about the following events related to the camera:

- The camera source was switched
- The camera source failed
- The first frame has been captured from the camera

#### Azure Communication Services

Azure Communication Services Calling SDK proposes a `VideoDevicesUpdatedListener`. It defines a single method to notify clients when video devices are added or removed on the current `DeviceManager`.

### Class reference

| Class Name  | Description          |
|-----------|----------------------|
|[PropertyChangedListener](/java/api/com.azure.android.communication.calling.propertychangedlistener) | Informs the library that the call state changes|
|[CallsUpdatedListener](/java/api/com.azure.android.communication.calling.callsupdatedlistener) | Informs the library when the calls are updated |
|[IncomingCallListener](/java/api/com.azure.android.communication.calling.incomingcalllistener) | Informs the library about incoming call |
|[VideoDevicesUpdatedListener](/java/api/com.azure.android.communication.calling.videodevicesupdatedlistener) | Informs the library that new video devices were added or removed to the current library|

## Ending a Call

### Twilio

Ending a call (disconnecting from a room)  is done via the `room.disconnect()` method.

# [Java](#tab/java)
```java
room.disconnect();
```

# [Kotlin](#tab/kotlin)
```kotlin
room.disconnect()
```
---

### Azure Communication Services 

Hanging up a call is done through the `hangUp` method of the `Call` object.

# [Java](#tab/java)
```java
call.hangUp().get();

// Set the 'forEveryone' property to true to end call for all participants
HangUpOptions options = new HangUpOptions();
options.setForEveryone(true);
call.hangUp(options).get();
```

# [Kotlin](#tab/kotlin)
```kotlin
call.hangUp().get()

// Set the 'forEveryone' property to true to end call for all participants
call.hangUp(HangUpOptions().apply { isForEveryone = true }).get()
```
---

### Class reference

| Class Name  | Description          |
|-----------|----------------------|
|[HangUp Options](/java/api/com.azure.android.communication.calling.hangupoptions)| Property bag class for hanging up a call |

## More features from the Azure Communication Services Calling

### Dominant speaker

To register for updates about the dominant speaker, instantiate the `DominantSpeakersCallFeature` from the `Call` object. Learn more about the dominant speaker configuration in [the tutorial.](../../how-tos/calling-sdk/dominant-speaker.md)

# [Java](#tab/java)
```java
DominantSpeakersCallFeature dominantSpeakersFeature = call.feature(Features.DOMINANT_SPEAKERS);

// Subscribe to the dominant speaker change event to receive updates about the dominant speaker.

dominantSpeakersFeature.addOnDominantSpeakersChangedListener(event -> {
       dominantSpeakersFeature.getDominantSpeakersInfo();
});

```

# [Kotlin](#tab/kotlin)
```kotlin
val dominantSpeakersFeature = call.feature(Features.DOMINANT_SPEAKERS)

// Subscribe to the dominant speaker change event to receive updates about the dominant speaker.

dominantSpeakersFeature.apply {
     addOnDominantSpeakersChangedListener { event ->
         dominantSpeakersInfo
     }
}

```
---

### Media Quality Statistics

To help you understand media quality during the call, Azure Communication Services SDK provides media quality statistics. Use it to examine the low-level audio, video, and screen-sharing quality metrics for incoming and outgoing call metrics.For more information, see the [Media quality statistics](../../concepts/voice-video-calling/media-quality-sdk.md) guide.

### User Facing Diagnostics

Azure Communication Services Calling SDK offers a feature known as **User Facing Diagnostics (UFD)**, allowing clients to scrutinize diverse properties of a call to identify potential issues. To learn more about User Facing Diagnostics, see the [User Facing Diagnostics.](../../concepts/voice-video-calling/user-facing-diagnostics.md)

> [!IMPORTANT]
>Some features of the Azure Communication Services Calling SDK described in the list don’t have an equivalent in the Twilio Video SDK.

### Raise Hand

[Raise Hand](../../how-tos/calling-sdk/raise-hand.md?pivots=platform-android) feature allows participants of a call to raise or lower hands.

### Video Background

Adding [Video Background](../../quickstarts/voice-video-calling/get-started-video-effects.md?pivots=platform-android) Allow users to blur the background in the video stream.

### Video spotlights

[Spotlights](../../how-tos/calling-sdk/spotlight.md?pivots=platform-android) Allow users to pin and unpin videos.
