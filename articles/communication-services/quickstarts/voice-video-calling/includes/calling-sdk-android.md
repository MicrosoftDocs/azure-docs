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

### Install the package

<!-- TODO: update with instructions on how to download, install and add package to project -->
Locate your project level build.gradle and make sure to add `mavenCentral()` to the list of repositories under `buildscript` and `allprojects`
```groovy
buildscript {
    repositories {
    ...
        mavenCentral()
    ...
    }
}
```

```groovy
allprojects {
    repositories {
    ...
        mavenCentral()
    ...
    }
}
```
Then, in your module level build.gradle add the the following lines to the dependencies section

```groovy
dependencies {
    ...
    implementation 'com.azure.android:azure-communication-calling:1.0.0-beta.1'
    ...
}

```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling client library:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| CallClient| The CallClient is the main entry point to the Calling client library.|
| CallAgent | The CallAgent is used to start and manage calls. |
| CommunicationUserCredential | The CommunicationUserCredential is used as the token credential to instantiate the CallAgent.|

## Initialize the CallClient, create a CallAgent, and access the DeviceManager

To create a `CallAgent` instance you have to call the `createCallAgent` method on a `CallClient` instance. This asynchronously returns a `CallAgent` instance object.
The `createCallAgent` method takes a `CommunicationUserCredential` as an argument, which encapsulates an [access token](../../access-tokens.md).
To access the `DeviceManager`, a callAgent instance must be created first, and then you can use the `CallClient.getDeviceManager` method to get the DeviceManager.

```java
String userToken = '<user token>';
CallClient callClient = new CallClient();
CommunicationUserCredential tokenCredential = new CommunicationUserCredential(userToken);
android.content.Context appContext = this.getApplicationContext(); // From within an Activity for instance
CallAgent callAgent = await callClient.createCallAgent((appContext, tokenCredential).get();
DeviceManage deviceManager = await callClient.getDeviceManager().get();
```

## Place an outgoing call and join a group call

To create and start a call you need to call the `CallAgent.call()` method and provide the `Identifier` of the callee(s).
To join a group call you need to call the `CallAgent.join()` method and provide the groupId. Group Ids must be in GUID or UUID format.

Call creation and start is synchronous. The call instance allows you to subscribe to all events on the call.

### Place a 1:1 call to a user
To place a call to another Communication Services user, invoke the `call` method on `callAgent` and pass an object with `communicationUserId` key.
```java
StartCallOptions startCallOptions = new StartCallOptions();
Context appContext = this.getApplicationContext();
CommunicationUser acsUserId = new CommunicationUser(<USER_ID>);
CommunicationUser participants[] = new CommunicationUser[]{ acsUserId };
call oneToOneCall = callAgent.call(appContext, participants, startCallOptions);
```

### Place a 1:n call with users and PSTN
> [!WARNING]
> Currently PSTN calling is not available
To place a 1:n call to a user and a PSTN number you have to specify the phone number of callee.
Your Communication Services resource must be configured to allow PSTN calling:
```java
CommunicationUser acsUser1 = new CommunicationUser(<USER_ID>);
PhoneNumber acsUser2 = new PhoneNumber("<PHONE_NUMBER>");
CommunicationIdentifier participants[] = new CommunicationIdentifier[]{ acsUser1, acsUser2 };
StartCallOptions startCallOptions = new StartCallOptions();
Context appContext = this.getApplicationContext();
Call groupCall = callAgent.call(participants, startCallOptions);
```

### Place a 1:1 call with with video camera
> [!WARNING]
> Currently only one outgoing local video stream is supported
To place a call with video you have to enumerate local cameras using the `deviceManager` `getCameraList` API.
Once you select a desired camera, use it to construct a `LocalVideoStream` instance and pass it into `videoOptions`
as an item in the `localVideoStream` array to a `call` method.
Once the call connects it'll automatically start sending a video stream from the selected camera to other participant(s).
```java
Context appContext = this.getApplicationContext();
VideoDeviceInfo desiredCamera = callClient.getDeviceManager().get().getCameraList().get(0);
LocalVideoStream currentVideoStream = new LocalVideoStream(desiredCamera, appContext);
VideoOptions videoOptions = new VideoOptions(currentVideoStream);

CommunicationUser[] participants = new CommunicationUser[]{ new CommunicationUser("<acs user id>") };
StartCallOptions startCallOptions = new StartCallOptions();
startCallOptions.setVideoOptions(videoOptions);
Call call = callAgent.call(context, participants, startCallOptions);
```

### Join a group call
To start a new group call or join an ongoing group call you have to call the 'join' method and pass an object with a `groupId` property. The value has to be a GUID.
```java
Context appContext = this.getApplicationContext();
GroupCallContext groupCallContext = new groupCallContext("<GUID>");
JoinCallOptions joinCallOptions = new JoinCallOptions();

call = callAgent.join(context, groupCallContext, joinCallOptions);
```

## Push Notification

### Overview
Mobile push notification are the pop up notification you get on a mobile device. For calling, we will be focusing on VoIP (Voice over Internet Protocol) push notifications. We will be offering you the capabilities to register for push notification, to handle push notification, and to un-register push notifications.

### Prerequisite

A Firebase account set up with Cloud Messaging (FCM) enabled and with your Firebase Cloud Messaging service connected to an Azure Notification Hub instance. See [Communication Services notifications](https://docs.microsoft.com/azure/communication-services/concepts/notifications) for more information.
Additionally, the tutorial assumes you're using Android Studio version 3.6 or higher to build your application.

A set of permissions are required for the Android application in order to be able to receive notifications messages from FCM. In your AndroidManifest.xml file, add the following set of permissions right after the *<manifest ...>* or below the *</application>* tag

```XML
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.GET_ACCOUNTS"/>
    <uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />
```

### Register for Push Notification

- In order to register for push notification, the application needs to call registerPushNotification() on a *CallAgent* instance with a device registration token.

- How to obtain the device registration token
1. Make sure to add the Firebase client library to your application module's *build.gradle* file by adding the following lines in the *dependencies* section if it's not already there:
```
    // Add the client library for Firebase Cloud Messaging
    implementation 'com.google.firebase:firebase-core:16.0.8'
    implementation 'com.google.firebase:firebase-messaging:20.2.4'
```

2. In your project level's *build.gradle* file, add the following in the *dependencies* section if it's not already there
```
    classpath 'com.google.gms:google-services:4.3.3'
```

3. Add the following plugin to the beginning of the file if it's not already there
```
apply plugin: 'com.google.gms.google-services'
```

4. Select *Sync Now* in the toolbar

5. Add the following code snippet to get the device registration token generated by the FCM client library for the client application instance 
- Add these import in the header of the main Activity for instance. They are required for the snippet to retrieve the token
```
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;
```
- Add this snippet to retrieve the token
```
        FirebaseInstanceId.getInstance().getInstanceId()
                .addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
                    @Override
                    public void onComplete(@NonNull Task<InstanceIdResult> task) {
                        if (!task.isSuccessful()) {
                            Log.w("PushNotification", "getInstanceId failed", task.getException());
                            return;
                        }

                        // Get new Instance ID token
                        String deviceToken = task.getResult().getToken();
                        // Log
                        Log.d("PushNotification", "Device Registration token retrieved successfully");
                    }
                });
```
6. Register the device registration token with the Calling Services client library for incoming calls Push Notifications

```java
String deviceRegistrationToken = "<Device Token from previous section>";
try {
    callAgent.registerPushNotification(deviceRegistrationToken).get();
}
catch(Exception e) {
    System.out.println("Something went wrong while registering for Incoming Calls Push Notifications.")
}
```

### Push Notification Handling

- In order to receive incoming call push notifications, call *handlePushNotification()* on a *CallAgent* instance with a payload.

1. To obtain the payload from FCM, here are the necessary steps:
- Create a new Service (File > New > Service > Service) that extends the *FirebaseMessagingService* Firebase client library class and make sure to override the *onMessageReceived* method. This method is the event handler called when FCM delivers the push notification to the application.

```java
public class MyFirebaseMessagingService extends FirebaseMessagingService {
    private java.util.Map<String, String> pushNotificationMessageDataFromFCM;

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        // Check if message contains a notification payload.
        if (remoteMessage.getNotification() != null) {
            Log.d("PushNotification", "Message Notification Body: " + remoteMessage.getNotification().getBody());
        }
        else {
            pushNotificationMessageDataFromFCM = remoteMessage.getData();
        }
    }
}
```
- Also Add the following service definition to the AndroidManifest.xml file, inside the <application> tag.

```
        <service
            android:name=".MyFirebaseMessagingService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>
```

- Once the payload is retrieved, it can be passed to the *Communication Services* client library to be handled by calling the *handlePushNotification* method on a *CallAgent* instance. A `CallAgent` instance is created by calling the `createCallAgent(...)` method on the `CallClient` class.

```java
try {
    callAgent.handlePushNotification(pushNotificationMessageDataFromFCM).get();
}
catch(Exception e) {
    System.out.println("Something went wrong while handling the Incoming Calls Push Notifications.");
}
```
When the handling of the Push notification message is successful, and the all events handlers are registered properly, the application will ring.

### Unregister Push Notification

- Applications can unregister push notification at any time. Call the `unregisterPushNotification()` method on callAgent to unregister.

```java
try {
    callAgent.unregisterPushNotifications().get();
}
catch(Exception e) {
    System.out.println("Something went wrong while un-registering for all Incoming Calls Push Notifications.")
}
```

## Call Management
You can access call properties and perform various operations during a call to manage settings related to video and audio.

### Call properties
* Get the unique ID for this Call.
```java
String callId = call.getCallId();
```

* To learn about other participants in the call inspect `remoteParticipant` collection on the `call` instance:
```java
List<RemoteParticipant> remoteParticipants = call.getRemoteParticipants();
```

* The identity of caller if the call is incoming.
```java
CommunicationIdentifier callerId = call.getCallerId();
```

* Get the state of the Call.
```java
CallState callState = call.getState();
```
It returns a string representing the current state of a call:
* 'None' - initial call state
* 'Incoming' - indicates that call is incoming, it has to be either accepted or rejected
* 'Connecting' - initial transition state once call is placed or accepted
* 'Ringing' - for an outgoing call - indicates call is ringing for remote participants, it's 'Incoming' oh their side
* 'EarlyMedia' - indicates a state in which an announcement is played before call is connected
* 'Connected' - call is connected
* 'Hold' - call is put on hold, no media is flowing between local endpoint and remote participant(s)
* 'Disconnecting' - transition state before call goes to 'Disconnected' state
* 'Disconnected' - final call state


* To learn why a call ended, inspect `callEndReason` property.
It contains code/subcode (TODO Link to documentation)
```java
CallEndReason callEndReason = call.getCallEndReason();
int code = callEndReason.getCode();
int subCode = callEndReason.getSubCode();
```

* To see if the current call is an incoming call, inspect `isIncoming` property:
```java
boolean isIncoming = call.getIsIncoming();
```

*  To see if the current microphone is muted, inspect the `muted` property:
```java
boolean muted = call.getIsMicrophoneMuted();
```

* To inspect active video streams, check the `localVideoStreams` collection:
```java
List<LocalVideoStream> localVideoStreams = call.getLocalVideoStreams();
```

### Mute and unmute
To mute or unmute the local endpoint you can use the `mute` and `unmute` asynchronous APIs:
```java
call.mute().get();
call.unmute().get();
```

### Start and stop sending local video
To start a video, you have to enumerate cameras using the `getCameraList` API on `deviceManager` object.
Then create a new instance of `LocalVideoStream` passing the desired camera, and pass it in the `startVideo` API as an argument
```java
VideoDeviceInfo desiredCamera = <get-video-device>;
Context appContext = this.getApplicationContext();
currentVideoStream = new LocalVideoStream(desiredCamera, appContext);
videoOptions = new VideoOptions(currentVideoStream);
Future startVideoFuture = call.startVideo(currentVideoStream);
startVideoFuture.get();
```

Once you successfully start sending video, a `LocalVideoStream` instance will be added to the `localVideoStreams` collection on the call instance.
```java
currentVideoStream == call.getLocalVideoStreams().get(0);
```

To stop local video, pass the `localVideoStream` instance available in `localVideoStreams` collection:
```java
call.stopVideo(localVideoStream).get();
```

You can switch to a different camera device while video is being sent by invoking `switchSource` on a `localVideoStream` instance:
```java
localVideoStream.switchSource(source).get();
```

## Remote participants management

All remote participants are represented by `RemoteParticipant` type and are available through the `remoteParticipants` collection on a call instance.

### List participants in a call
The `remoteParticipants` collection returns a list of remote participants in given call:
```java
List<RemoteParticipant> remoteParticipants = call.getRemoteParticipants(); // [remoteParticipant, remoteParticipant....]
```

### Remote participant properties
Any given remote participant has a set of properties and collections associated with it:

* Get the identifier for this remote participant.
Identity is one is one of the 'Identifier' types
```java
CommunicationIdentifier participantIdentity = remoteParticipant.getIdentifier();
```

* Get state of this remote participant.
```java
ParticipantState state = remoteParticipant.getState();
```
State can be one of
* 'Idle' - initial state
* 'Connecting' - transition state while participant is connecting to the call
* 'Connected' - participant is connected to the call
* 'Hold' - participant is on hold
* 'EarlyMedia' - announcement is played before participant is connected to the call
* 'Disconnected' - final state - participant is disconnected from the call


* To learn why a participant left the call, inspect `callEndReason` property:
```java
CallEndReason callEndReason = remoteParticipant.getCallEndReason();
```

* To check whether this remote participant is muted or not, inspect the `isMuted` property:
```java
boolean isParticipantMuted = remoteParticipant.getIsMuted();
```

* To check whether this remote participant is speaking or not, inspect the `isSpeaking` property:
```java
boolean isParticipantSpeaking = remoteParticipant.getIsSpeaking();
```

* To inspect all video streams that a given participant is sending in this call, check the `videoStreams` collection:
```java
List<RemoteVideoStream> videoStreams = remoteParticipant.getVideoStreams(); // [RemoteVideoStream, RemoteVideoStream, ...]
```


### Add a participant to a call

To add a participant to a call (either a user or a phone number) you can invoke `addParticipant`. 
This will synchronously return the remote participant instance.

```java
const acsUser = new CommunicationUser("<acs user id>");
const acsPhone = new PhoneNumber("<phone number>");
RemoteParticipant remoteParticipant1 = call.addParticipant(acsUser);
RemoteParticipant remoteParticipant2 = call.addParticipant(acsPhone);
```

### Remove participant from a call
To remove a participant from a call (either a user or a phone number) you can invoke `removeParticipant`.
This will resolve asynchronously once the participant is removed from the call.
The participant will also be removed from `remoteParticipants` collection.
```java
RemoteParticipant remoteParticipant = call.getParticipants().get(0);
call.removeParticipant(acsUser).get();
call.removeParticipant(acsPhone).get();
```

## Render remote participant video streams
To list the video streams and screen sharing streams of remote participants, inspect the `videoStreams` collections:
```java
RemoteParticipant remoteParticipant = call.getRemoteParticipants().get(0);
RemoteVideoStream remoteParticipantStream = remoteParticipant.getVideoStreams().get(0);
MediaStreamType streamType = remoteParticipantStream.getType(); // of type MediaStreamType.Video or MediaStreamType.ScreenSharing
```
 
To render a `RemoteVideoStream` from a remote participant, you have to subscribe to a `OnVideoStreamsUpdated` event.
Within the event, the change of `isAvailable` property to true indicates that remote participant is currently sending a stream
Once that happens, create new instance of a `Renderer`, then create a new `RendererView` using asynchronous
`createView` API and attach `view.target` anywhere in the UI of your application.
Whenever availability of a remote stream changes you can can choose to destroy the whole Renderer, a specific `RendererView`
or keep them, but this will result in displaying blank video frame.

```java
Renderer remoteVideoRenderer = new Renderer(remoteParticipantStream, appContext);
View uiView = remoteVideoRenderer.createView(new RenderingOptions(ScalingMode.Fit));
layout.addView(uiView);

remoteParticipant.addOnVideoStreamsUpdatedListener(e -> onRemoteParticipantVideoStreamsUpdated(p, e));

void onRemoteParticipantVideoStreamsUpdated(RemoteParticipant participant, RemoteVideoStreamsEvent args) {
    for(RemoteVideoStream stream : args.getAddedRemoteVideoStreams()) {
        if(stream.getIsAvailable()) {
            startRenderingVideo();
        } else {
            renderer.dispose();
        }
    }
}
```

### Remote video stream properties
Remote video stream has couple of properties

* `Id` - ID of a remote video stream
```java
int id = remoteVideoStream.getId();
```

* `MediaStreamType` - Can be 'Video' or 'ScreenSharing'
```java
MediaStreamType type = remoteVideoStream.getType();
```

* `isAvailable` - Indicates if remote participant endpoint is actively sending stream
```java
boolean availability = remoteVideoStream.getIsAvailable();
```

### Renderer methods and properties
Renderer object following APIs

* Create a `RendererView` instance that can be later attached in the application UI to render remote video stream.
```java
// Create a view for a video stream
renderer.createView()
```
* Dispose renderer and all `RendererView` associated with this renderer
```java
renderer.dispose()
```

* `StreamSize` - size ( width/height ) of a remote video stream
```java
StreamSize renderStreamSize = remoteVideoStream.getSize();
int width = renderStreamSize.getWidth();
int height = renderStreamSize.getHeight();
```


### RendererView methods and properties
When creating a `RendererView` you can specify the `scalingMode` and `mirrored` properties that will apply to this view:
Scaling mode can be either of 'Stretch' | 'Crop' | 'Fit'
If `mirrored` is set to `true`, the rendered stream will be flipped vertically.

```java
Renderer remoteVideoRenderer = new Renderer(remoteVideoStream, appContext);
RendererView rendererView = remoteVideoRenderer.createView(new RenderingOptions(ScalingMode.Fit));
```

The created RendererView can then be attached to the application UI using the following snippet:
```java
layout.addView(rendererView);
```

You can later update the scaling mode by invoking `updateScalingMode` API on the RendererView object with one of ScalingMode.Stretch | ScalingMode.Crop | ScalingMode.Fit as an argument.
```java
// Update the scale mode for this view.
rendererView.updateScalingMode(ScalingMode.Crop)
```


## Device management

`DeviceManager` lets you enumerate local devices that can be used in a call to transmit your audio/video streams. It also allows you to request permission from a user to access their microphone and camera using the native browser API.

You can access `deviceManager` by calling `callClient.getDeviceManager()` method.
> [!WARNING]
> Currently a `callAgent` object must be instantiated first in order to gain access to DeviceManager

```java
DeviceManager deviceManager = callClient.getDeviceManager().get();
```

### Enumerate local devices

To access local devices, you can use enumeration methods on the Device Manager. Enumeration is a synchronous action.

```java
//  Get a list of available video devices for use.
List<VideoDeviceInfo> localCameras = deviceManager.getCameraList(); // [VideoDeviceInfo, VideoDeviceInfo...]

// Get a list of available microphone devices for use.
List<AudioDeviceInfo> localMicrophones = deviceManager.getMicrophoneList(); // [AudioDeviceInfo, AudioDeviceInfo...]

// Get a list of available speaker devices for use.
List<AudioDeviceInfo> localSpeakers = deviceManager.getSpeakerList(); // [AudioDeviceInfo, AudioDeviceInfo...]
```

### Set default microphone/speaker

Device manager allows you to set a default device that will be used when starting a call.
If client defaults are not set, Communication Services will fall back to OS defaults.

```java

// Get the microphone device that is being used.
AudioDeviceInfo defaultMicrophone = deviceManager.getMicrophoneList().get(0);

// Set the microphone device to use.
deviceManager.setMicrophone(defaultMicrophone);

// Get the speaker device that is being used.
AudioDeviceInfo defaultSpeaker = deviceManager.getSpeakerList().get(0);

// Set the speaker device to use.
deviceManager.setSpeaker(defaultSpeaker);
```

### Local camera preview

You can use `DeviceManager` and `Renderer` to begin rendering streams from your local camera. This stream won't be sent to other participants; it's a local preview feed. This is an asynchronous action.

```java
VideoDeviceInfo videoDevice = <get-video-device>;
Context appContext = this.getApplicationContext();
currentVideoStream = new LocalVideoStream(videoDevice, appContext);
videoOptions = new VideoOptions(currentVideoStream);

Renderer previewRenderer = new Renderer(currentVideoStream, appContext);
View uiView previewRenderer.createView(new RenderingOptions(ScalingMode.Fit));

// Attach the renderingSurface to a viewable location on the app at this point
layout.addView(uiView);
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
    public void onLocalVideoStreamsUpdated(LocalVideoStreamsEvent localVideoStreamsEventArgs) {
        Log.d(localVideoStreamsEventArgs.getAddedStreams().size());
        Log.d(localVideoStreamsEventArgs.getRemovedStreams().size());
    }
}
call.addOnLocalVideoStreamsChangedListener(localVideoStreamsChangedListener);
// To unsubscribe
call.removeOnLocalVideoStreamsChangedListener(localVideoStreamsChangedListener);
```
