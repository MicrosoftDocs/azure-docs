---
title: include file
description: include file
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

1.  **Azure Account:** Make sure that your Azure account is active. New users can create a free account at [Microsoft Azure](https://azure.microsoft.com/free/).
2.  **Communication Services Resource:** Set up a [Communication Services Resource](../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp) via your Azure portal and note your connection string.
3.  **Azure CLI:** Follow the instructions to [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows?tabs=azure-cli)..
4.  **User Access Token:** Generate a user access token to instantiate the call client. You can create one using the Azure CLI as follows:
```console
az communication identity token issue --scope voip --connection-string "yourConnectionString"
```

For more information, see [Use Azure CLI to Create and Manage Access Tokens](../../quickstarts/identity/access-tokens.md?pivots=platform-azcli).

For Video Calling as a Teams user:

-   You can also use Teams identity. To generate an access token for a Teams User, see [Manage teams identity](../../quickstarts/manage-teams-identity.md?pivots=programming-language-javascript).
-   Obtain the Teams thread ID for call operations using the [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer). For information about creating a thread ID, see [Create chat - Microsoft Graph v1.0 > Example2: Create a group chat](/graph/api/chat-post?preserve-view=true&tabs=javascript&view=graph-rest-1.0#example-2-create-a-group-chat).

## Installation

To start the migration from Twilio Android Video SDK, the first step is to install the Azure Communication Services Calling Android SDK to your project. The Azure Communication Services Calling framework can be integrated as a `gradle` dependency.

1. Add the azure-communication-calling package
```groovy
dependencies {
     ...
    implementation "com.azure.android:azure-communication-calling:<version>"
}
```
2. Remove the Twilio SDK:
`implementation "com.twilio:video-android:<version>"`

3. Check permissions in application manifest

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

To be able to use the Azure Communication Services Calling SDK, you need to authenticate to the SDK using an access token.

### Twilio

The following code snippets presume the availability of a valid access token for Twilio Services.

The authentication to Twilio Video SDK allows a client to connect to a Room. 
This is achieved in two steps:

1. Provide the access token to the ConnectOptions constructor
2. Use the ConnectOptions instance as a parameter of the `TwilioVideoSDK.connect` method

**Java**
```java
ConnectOptions connectOptions = new ConnectOptions.Builder(accessToken).build();
room = Video.connect(context, connectOptions, roomListener);
```

**Kotlin**
```kotlin
val connectOptions = ConnectOptions.Builder(accessToken).build()
room = Video.connect(context, connectOptions, roomListener)
```

### Azure Communication Services
The following code snippets require a valid access token for Azure Communication Services Calling services.

**Java**
```java
String userToken = "<USER_TOKEN>";
CommunicationTokenCredential tokenCredential = new CommunicationTokenCredential(accessToken);

CallClient callClient = new CallClient();
callAgent = callClient.createCallAgent(getApplicationContext(), tokenCredential).get();
```

**Kotlin**
```kotlin
val userToken = "<USER_TOKEN>"
val communicationCredential = CommunicationTokenCredential(accessToken)
val callAgent: CallAgent = CallClient().createCallAgent(
     applicationContext,
     communicationCredential,
     CallAgentOptions()
).get()
```

#### Class reference

| Class Name | Description          |
|-----------|----------------------|
|[CallClient](/java/api/com.azure.android.communication.calling.callclient?view=communication-services-java-android) | The class serving as the entry point for the Calling SDK.|
| CommunicationTokenCredential | The Azure Communication Services User token credential|
|[CallAgent](/java/api/com.azure.android.communication.calling.callagent?view=communication-services-java-android) |The class responsible for managing calls on behalf of the authenticated user |



## Initiating an outgoing call 

### Twilio
Twilio Video Android SDK doesn't have a concept of Call. Twilio Video SDK uses the concept of Room. 
In scenarios where client A wishes to establish communication with client B, client A can create a room; B needs to connect to it. Developers can emulate a call-like experience with Twilio by incorporating features such as push notifications. 
In this setup, client A notifies client B about the desire to initiate communication by joining a room. 
Twilio Video Android SDK doesn't support this particular concept directly.

When A or B intend to create or connect to a room with a valid access token, they can specify the room name by passing it as a parameter of the ConnectOptions Builder

**Java**
```java
ConnectOptions connectOptions = new ConnectOptions.Builder(accessToken)
    .roomName(roomName)
    .build()
room = Video.connect(context, connectOptions, roomListener);
```

**Kotlin**
```kotlin
    val connectOptions: ConnectOptions = ConnectOptions.Builder(accessToken)
        .roomName(roomName)
        .build()
    val room = Video.connect(context, connectOptions, roomListener)
```

### Azure Communication Services Calling 

Initiating a call with the calling SDK involves: 

1. Creating a StartCallOption object 
2. Creating an Array of Communication Identifiers 
3. Calling startCall method on the previously created CallAgent

**Java**
```java
ArrayList<CommunicationIdentifier> userCallee = new ArrayList<>();
participants.add(new CommunicationUserIdentifier(“<Azure_Communication_Services_USER_ID>”));

Call call = callAgent.startCall(context, userCallee);
```

**Kotlin**
```kotlin
val call: Call = callAgent.startCall(
     applicationContext,
     listOf(CommunicationUserIdentifier(“<Azure_Communication_Services_USER_ID>”))
)
```

#### Connect to a team call

##### With External Identity

Connecting to a team call is almost identical to connecting to a call. Instead of using StartCallOptions, the client application uses JoinCallOptions with a TeamsMeetingLocator.

The Teams meeting link can be retrieved using Graph APIs. The retrieval process is detailed in the [graph documentation](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true).

**Java**
```java
JoinCallOptions options = new JoinCallOptions();
TeamsMeetingLinkLocator teamsMeetingLinkLocator = new TeamsMeetingLinkLocator(meetingLink);
Call call = callAgent.join(getApplicationContext(), teamsMeetingLinkLocator, joinCallOptions);
```

**Kotlin**
```kotlin
val options = JoinCallOptions()
val teamsMeetingLinkLocator = TeamsMeetingLinkLocator(meetingLink)
val call: Call = callAgent.join(getApplicationContext(), teamsMeetingLinkLocator, joinCallOptions)
```

## Accepting / Joining a call

### Twilio 
As mentioned previously, Twilio Video Android SDK doesn't have a concept of Call. Twilio uses the concept of a room. Different clients can establish communication by joining the same room.

### Azure Communication Services Calling

#### Receiving incoming call
To accept calls, the application must first be configured to receive incoming calls.

#### Register for push notifications and handle incoming push notification 
An ACS client can opt in to receive push notifications to receive incoming calls. This [guide](../../how-tos/calling-sdk/push-notifications.md?pivots=platform-android) describes how to set up push notifications for the Azure Communication Services Calling framework.

#### Setting up the CallAgentListener

The Azure Communication Services Calling SDK includes an `IncomingCallListener`. An `IncomingCallListener` is set on the CallAgent instance. This listener defines an `onIncomingCall(IncomingCall incomingCall)` method, which is triggered upon the arrival of an incoming call.

**Java**
```java
callAgent.addOnIncomingCallListener((incomingCall) -> {
     this.incomingCall = incomingCall;

     // Get incoming call ID  
     incomingCall.getId();

     // Get information about caller
     incomingCall.getCallerInfo();

     // callEndReason is also a property of IncomingCall
      CallEndReason callEndReason = incomingCall.getCallEndReason();
});
```
**Kotlin**
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
By implementing the CallAgentListener and associating it with a CallAgent instance, the application is ready to receive incoming calls.

#### Accept incoming call
**Java**
```java
incomingCall.accept(context);
```
**Kotlin**
```kotlin
incomingCall.accept(context)
```

#### Class reference

|Class Name | Description          |
|-----------|----------------------|
|[IncomingCallListener](/java/api/com.azure.android.communication.calling.incomingcalllistener?view=communication-services-java-android) | Functional interface for incoming calls. |
|[IncomingCall](/java/api/com.azure.android.communication.calling.incomingcall?view=communication-services-java-android)| Describes an incoming call |


## Video 

### Starting and Stopping Video 

#### Twilio 

##### Accessing the camera 

With Twilio Video Android SDK, adding video to a call consists of two steps: 

1. Accessing the camera
2. Adding the video track to the list of LocalVideoTrack

**Java**
```java
 // Access the camera
CameraCapturer cameraCapturer = new Camera2Capturer(context, frontCameraId);
  // Create a video track
LocalVideoTrack videoTrack = LocalVideoTrack.create(context, true, cameraCapturer, LOCAL_VIDEO_TRACK_NAME);
```

**Kotlin**
```kotlin
// Access the camera
val cameraCapturer: CameraCapturer = Camera2Capturer(context, frontCameraId)

// Create a video track
val localVideoTrack = LocalVideoTrack.create(context, enable, cameraCapturer)
```
The VideoTrack is enabled by default. It can be enabled or disabled if necessary:

**Java**
```java
videoTrack.enable(true|false);
```
**Kotlin**
```kotlin
videoTrack.enable(true|false)
```

##### Adding the LocalVideoTrack to the call

**At connect time**

At connect time, adding a local video track is done by passing the LocalVideoTrack to the LocalVideoTrack list that is set via ConnectOptions.

**Java**
```java
 ConnectOptions connectOptions = new ConnectOptions.Builder(accessToken)
    .roomName(roomName)
    .videoTracks(localVideoTracks)
}
```

**Kotlin**
```kotlin
    val connectOptions = ConnectOptions.Builder(accessToken)
        .roomName(roomName)
        .videoTracks(localVideoTracks)
}
```

**In an existing room**

In an existing room, the local participant can publish a local video track via the `
publishTrack(LocalVideoTrack localVideoTrack)` method.

**Java**
```java
room.localParticipant.publishVideoTrack(localVideoTrack)
```

**Kotlin**
```kotlin
room.localParticipant.publishVideoTrack(localVideoTrack)
```

#### Azure Communication Services Calling

##### Accessing the camera

Accessing the camera is done through the DeviceManager. Obtain an instance of the DeviceManager using the following code snippet.

**Java**
```java
DeviceManager deviceManager = callClient.getDeviceManager(getApplicationContext()).get();
deviceManager.getCameras();
```

**Kotlin**
```kotlin
val deviceManager: DeviceManager = CallClient().getDeviceManager(applicationContext).get()

deviceManager.cameras
```
##### Creating the LocalVideoStream

The DeviceManager provides access to camera objects that allow the creation of a LocalVideoStream instance.

```java
VideoDeviceInfo camera = deviceManager.getCameras().get(0);
LocalVideoStream videoStream = new LocalVideoStream(camera, context);
```

```kotlin
val camera : VideoDeviceInfo? = deviceManager.cameras.firstOrNull()
val videoStream = LocalVideoStream(camera, context)
```


##### Adding the LocalVideoStream to an existing call or while creating a room

**At connect time**

The LocalVideoStream is added to the streams via the OutgoingVideoOptions of the StartCallOptions.

**Java**
```java
    StartCallOptions options = new StartCallOptions();
    LocalVideoStream[] videoStreams = new LocalVideoStream[1];
    videoStreams[0] = videoStream;
    VideoOptions videoOptions = new VideoOptions(videoStreams);
    options.setVideoOptions(videoOptions);
```

**Kotlin**
```kotlin
    val options = StartCallOptions()
    val videoStreams: Array<LocalVideoStream> = arrayOf(localVideoStream)
    val videoOptions = VideoOptions(videoStreams)
    options.setVideoOptions(videoOptions)
```

**In a call**

Initiate a video stream by invoking the `startVideo` method, which accepts a LocalVideoStream as its parameter.

```java
call.startVideo(context, videoStream).get();
```
**Kotlin**
```kotlin
call.startVideo(context, videoStream).get()
```

#### Class reference

|Class Name | Description          |
|-----------|----------------------|
|[DeviceManager](/java/api/com.azure.android.communication.calling.devicemanager?view=communication-services-java-android) | Facilitates the interaction with the device |
|[LocalVideoStream](/java/api/com.azure.android.communication.calling.localvideostream?view=communication-services-java-android) | Local video stream information |
|[VideoDeviceInfo](/java/api/com.azure.android.communication.calling.videodeviceinfo?view=communication-services-java-android) | Information about a video device |
|[VideoOptions](/java/api/com.azure.android.communication.calling.videooptions?view=communication-services-java-android) | Property bag class for Video Options |
|[Call](/java/api/com.azure.android.communication.calling.call?view=communication-services-java-android)|Describes a call|


## Rendering Video

### Twilio
To render video using the TwilioVideo Android SDK, an object conforming to the VideoSink can be added to VideoTrack.
TwilioVideo Android provides a pre-built VideoSink called VideoView, which subclasses `android.view.View`.

**Java**
```java
videoTrack.addSink(videoVideoView);
```
**Kotlin**
```kotlin
videoTrack.addSink(videoVideoView);
```

### Azure Communication Services Calling

To render video with Azure Communication Services Calling, instantiate a VideoStreamRenderer and pass a LocalVideoStream or a RemoteVideoStream as a parameter to its constructor.
**Java**
```java
VideoStreamRenderer previewRenderer = new VideoStreamRenderer(remoteStream, context);
VideoStreamRendererView preview = previewRenderer.createView(new CreateViewOptions(ScalingMode.FIT));
```
**Kotlin**
```kotlin
val previewRenderer = VideoStreamRenderer(localVideoStream, context)
val preview: VideoStreamRendererView = previewRenderer.createView(CreateViewOptions(ScalingMode.FIT))
videoContainer.addView(preview)
```

#### Class reference

|Class Name | Description          |
|-----------|----------------------|
|[SaclingMode](/java/api/com.azure.android.communication.calling.scalingmode?view=communication-services-java-android) | Enum for local and remote video scaling mode|
|[CreateViewOptions](/java/api/com.azure.android.communication.calling.createviewoptions?view=communication-services-java-android) | Options to be passed when rendering a Video |
|[VideoStreamRenderer](/java/api/com.azure.android.communication.calling.videostreamrenderer?view=communication-services-java-android) | Renderer for video rendering |
|[VideoStreamRendererView](/java/api/com.azure.android.communication.calling.videostreamrendererview?view=communication-services-java-android)|View used to render video|


## Audio

### Toggling the microphone

#### Twilio

On the Twilio Video SDK, muting and unmuting the microphone is achieved by enabling or disabling the LocalAudioTrack associated with the microphone.

**Java**
```java
localAudioTrack.enable(true|false);
```

**Kotlin**
```kotlin
localAudioTrack.enable(true|false)
```

### Azure Communication Services Calling

The Call object proposes methods for muting and unmuting the microphone.

```java
call.muteOutgoingAudio(context).get();

call.unmuteOutgoingAudio(context).get();
```

**Kotlin**
```kotlin
call.muteOutgoingAudio(context).get()
call.unmuteOutgoingAudio(context).get()
```
Mute incoming audio sets the call volume to 0. To mute or unmute the incoming audio, use the muteIncomingAudio and unmuteIncomingAudio asynchronous APIs:

```java
call.muteIncomingAudio(context).get();
call.unmuteIncomingAudio(context).get();
```

**Kotlin**
```kotlin
call.muteIncomingAudio(context).get()
call.unmuteIncomingAudio(context).get()
```

## Dominant speaker feature

### Twilio
The `Room.Listener` receives dominant speaker updates via its `onDominantSpeakerChanged` method.

**Java**
``` java
@Override
public void onDominantSpeakerChanged(@NonNull Room room, @Nullable RemoteParticipant remoteParticipant) {
    Room.Listener.super.onDominantSpeakerChanged(room, remoteParticipant);
    // Highlight the dominant speaker
}
```
**Kotlin**
```kotlin
override fun onDominantSpeakerChanged(room: Room, remoteParticipant: RemoteParticipant?) {
    super.onDominantSpeakerChanged(room, remoteParticipant)
    // Highlighting the loudest speaker
}
```
### ACS Calling

To register for updates about the dominant speaker, instantiate the DominantSpeakerFeature from the Call object.

**Java**
``` java
DominantSpeakersCallFeature dominantSpeakersFeature = call.feature(Features.DOMINANT_SPEAKERS);
```
**Kotlin**
```kotlin
val dominantSpeakersFeature = call.feature(Features.DOMINANT_SPEAKERS)
```

Subscribe to the dominant speaker change event to receive updates about the dominant speaker.

**Java**
``` java
dominantSpeakersFeature.addOnDominantSpeakersChangedListener(event -> {
       dominantSpeakersFeature.getDominantSpeakersInfo();
});
```
**Kotlin**
```kotlin
dominantSpeakersFeature.apply {
     addOnDominantSpeakersChangedListener { event ->
         dominantSpeakersInfo
     }
}
```

## Media quality statistics

Azure Communication Services Calling and the Twilio Video SDK offer APIs to collect call statistics.

### Twilio
Use the getStats method to obtain real-time statistics about a Room.

**Java**
``` java
room.getStats(statsReports -> {
    // Use the stats report
});

```
**Kotlin**
```kotlin
room.getStats { statsReports ->
    // Use the stats report
}
```
### Azure Communication Services
To access media statistics, instantiate the MediaStatsCallFeature from the Call object.

**Java**
``` java
MediaStatsCallFeature mediaStatsCallFeature = call.feature(Features.MEDIA_STATS);
```
**Kotlin**
```kotlin
val mediaStatsCallFeature = call.feature(Features.MEDIA_STATS)
```

Subscribe to the `sampleReported` event to receive updates on media statistics. The default sampling interval is set to one second. Adjust the interval by using the `setSampleIntervalInSeconds` method within the MediaStatsCallFeature.
**Java**
```java
mediaStatsCallFeature.setSampleIntervalInSeconds(5);

mediaStatsCallFeature.addOnSampleReportedListener(event -> {
    // Stats are available
});

```
**Kotlin**
```kotlin
mediaStatsCallFeature.apply {
        sampleIntervalInSeconds = 5
        addOnSampleReportedListener { event ->
             // Stats are available
        }
}
```

For more information, see the [Media quality statistics](../../concepts/voice-video-calling/media-quality-sdk.md?pivots=platform-android) guide.


## Diagnostics
Both Azure Communication Services Calling and Twilio SDKs offer features to assist clients in diagnosing various issues that may arise during a video call.

### Twilio

Enable the Twilio diagnostic API via the connect options.

**Java**
```java
ConnectOptions.Builder connectOptionsBuilder =
                new ConnectOptions.Builder(accessToken).roomName("roomName");
connectOptionsBuilder.enableNetworkQuality(true);
room = Video.connect(context, connectOptionsBuilder.build(), roomListener);
```
**Kotlin**
```kotlin
val room = connect(this, accessToken, roomListener) {
    roomName("roomName")
    enableNetworkQuality(true)
}
```

Receive notifications regarding changes in network quality for remote participants by setting a `RemoteParticipant.Listener` on `RemoteParticipant` instances.

**Java**
```java
remoteParticipant.setListener(new RemoteParticipant.Listener() {

  @Override
  public void onNetworkQualityLevelChanged(@NonNull RemoteParticipant remoteParticipant, @NonNull NetworkQualityLevel networkQualityLevel) {
            RemoteParticipant.Listener.super.onNetworkQualityLevelChanged(remoteParticipant, networkQualityLevel);
}
```
**Kotlin**
```kotlin
remoteParticipant.setListener(object : RemoteParticipant.Listener {   
     override fun onNetworkQualityLevelChanged(
         remoteParticipant: RemoteParticipant,
         networkQualityLevel: NetworkQualityLevel
         ) {
         super.onNetworkQualityLevelChanged(remoteParticipant, networkQualityLevel)
                // Callback
            }
        })
```

Information about network quality updates is also accessible about the LocalParticipant.

**Java**
```java
localParticipant.setListener(new LocalParticipant.Listener() {
  @Override
  public void onNetworkQualityLevelChanged(@NonNull LocalParticipant localParticipant, @NonNull NetworkQualityLevel networkQualityLevel) {
           LocalParticipant.Listener.super.onNetworkQualityLevelChanged(localParticipant, networkQualityLevel);
}

```
**Kotlin**
```kotlin
localParticipant?.setListener(object : LocalParticipant.Listener {
     override fun onNetworkQualityLevelChanged(
         localParticipant: LocalParticipant,
         networkQualityLevel: NetworkQualityLevel
     ) {
         super.onNetworkQualityLevelChanged(localParticipant, networkQualityLevel)
         // Callback
         }
})
```
### ACS Calling
Azure Communication Services offers a feature known as "User Facing Diagnostics" (UFD), allowing clients to scrutinize diverse properties of a call to identify potential issues. 

To access the "User Facing Diagnostics" feature, instantiate the LocalUserDiagnosticsCallFeature from the Call object.

**Java**
```java
LocalUserDiagnosticsCallFeature localUserDiagnosticsCallFeature = call.feature(Features.LOCAL_USER_DIAGNOSTICS);
```
**Kotlin**
```kotlin
val localUserDiagnosticsCallFeature = call.feature(Features.LOCAL_USER_DIAGNOSTICS)
```


Subscribe to diagnostic events to monitor changes in user-facing diagnostics. Add listeners to track network and media diagnostic statistics.

**Java**
```java
localUserDiagnosticsCallFeature.getNetworkDiagnostics();
localUserDiagnosticsCallFeature.getMediaDiagnostics();
```
**Kotlin**
```kotlin
localUserDiagnosticsCallFeature.networkDiagnostics
localUserDiagnosticsCallFeature.mediaDiagnostics
```
To learn more about User Facing Diagnostics, see the [User Facing Diagnostics](../../concepts/voice-video-calling/user-facing-diagnostics.md?pivots=platform-android)


## Event Listeners

Twilio and ACS propose various listeners to listen to call events. 

### Room / Call Events

#### Twilio
The `Room.Listener` allows clients to listen to events related to the Room object. The `Room.Listener` includes methods that are triggered for the following events:
* the client connected or failed to connect to a room
* the client is reconnecting to the room or reconnected
* a remote participant connected, disconnected, reconnected to the room
* the room recording started or stopped
* the dominant speaker changed

#### Azure Communication Services Calling

The Azure Communication Services Calling Call object enables clients to incorporate various `PropertyChangedListener`, notifying them when a call property changes. Each event type should be subscribed to individually.

The various `PropertyChangedListeners` that can be assigned to a call encompass certain events covered by the Twilio `Room.Listener`, featuring methods for the following events:

* the call ID changed
* the call state changed
* the list of remote participants updated
* the local video stream updated
* the mute state changed

### RemoteParticipant Event

The Twilio Video and Azure Communication Services Calling SDKs offer mechanisms to handle updates from remote participants.

#### Twilio

The `RemoteParticipant.Listener` handles the following events.

* the remote participant published or unpublished a media track (video, audio, data)
* the local participant subscribed, failed to subscribe, or unsubscribed to a remote media track (video, audio, data)
* the remote participant network quality changed
* the remote participant changed the priority of a track publication
* the remote participant switched on/off its video track

#### Azure Communication Services Calling

Add a `PropertyChangedListener` to the `RemoteParticipant` object to receive updates for the following events:

* the remote participant state changed
* the remote participant is muted or not muted
* the remote participant is speaking
* the remote participant display name changed
* the remote participant added or removed a video stream

### Camera Events

#### Twilio
Twilio proposes a `CameraCapturer.Listener` to notify client about the following events related to the camera:

* The camera source was switched
* The camera source failed
* The first frame has been captured from the camera

#### Azure Communication Services Calling
Azure Communication Services Calling proposes a `VideoDevicesUpdatedListener`. It defines a single method to notify clients when video devices are added or removed on the current DeviceManager.

### Local Participant Events

#### Twilio
Twilio has a `LocalParticipant.Listener` that allows clients to receive updates about the following events:
* The local participant published or failed to publish a media track (audio, video, data)
* The network quality level for the local participant changed

#### Azure Communication Services Calling
The CallAgent receives updates regarding calls through two listeners: `CallsUpdatedListener` and the `IncomingCallListener`. These listeners are triggered respectively for the following events:

*  calls are updated, a new call is created, an existing call is disconnected
*  an incoming call is received

#### Class reference
| Class Name  | Description          |
|-----------|----------------------|
|[PropertyChangedListener](/java/api/com.azure.android.communication.calling.propertychangedlistener?view=communication-services-java-android) | Informs the library that the call state has changed|
|[CallsUpdatedListener](/java/api/com.azure.android.communication.calling.callsupdatedlistener?view=communication-services-java-android) | Informs the library when the calls are updated |
|[IncomingCallListener](/java/api/com.azure.android.communication.calling.incomingcalllistener?view=communication-services-java-android) | Informs the library about incoming call |
|[VideoDevicesUpdatedListener](/java/api/com.azure.android.communication.calling.videodevicesupdatedlistener?view=communication-services-java-android) | Informs the library that new video devices were added or removed to the current library|


## Ending a Call

### Twilio
Ending a call (disconnecting from a room) is done via the `room.disconnect()` method.

**Java**
```java
room.disconnect();
```
**Kotlin**
```kotlin
room.disconnect()
```

### ACS Calling

Hanging up a call is done through the `hangUp` method of the call object.

**Java**
```java
call.hangUp().get();

// Set the 'forEveryone' property to true to end call for all participants
HangUpOptions options = new HangUpOptions();
options.setForEveryone(true);
call.hangUp(options).get();
```
**Kotlin**
```kotlin
call.hangUp().get()

// Set the 'forEveryone' property to true to end call for all participants
call.hangUp(HangUpOptions().apply { isForEveryone = true }).get()
```

#### Class reference
| Class Name  | Description          |
|-----------|----------------------|
|[Call](/java/api/com.azure.android.communication.calling.call?view=communication-services-java-android) | Describes a call |
|[HangUp Options](/java/api/com.azure.android.communication.calling.hangupoptions?view=communication-services-java-android)| Property bag class for hanging up a call |

## Cleaning Up
If you want to [clean up and remove a Communication Services subscription](../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp#clean-up-resources), you can delete the resource or resource group.
