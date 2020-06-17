---
title: Calling Client library samples
description: Learn how to manage users and authenticate them to ACS
author: mikben
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/18/2020
ms.topic: conceptual
ms.service: azure-project-spool


---

# Calling Client library samples


## Initialization
To create a `CallClient` you have to use `CallClientFactory.create` method that asynchronously returns a `CallClient` object once it's initialized

To create call client you have to pass a `CommunicationUserCredential` object.


#### [Javascript](#tab/javascript)
```ts
const userToken = '<user token>';
const fetchNewUserTokenFunc = async () => {
// return new token
};

const communicationUserCredential = new CommunicationUserCredential(fetchNewUserTokenFunc, userToken);
const callClient = await CallClientFactory.create(communicationUserCredential);
```
#### [Android (Java)](#tab/java)
```java
String userToken = "<user token>";
android.content.Context appContext = this.getApplicationContext(); // From within an Activity for instance
Future<AdHocCallClient> callClientFuture = CallClientFactory.create(userToken, appContext);
```
#### [iOS (Swift)](#tab/swift)
```swift
let userToken = "<user token>";
let callClientInstance: CallClient? = nil;
CallClientFactory.create(userToken, completionHandler: { (callClient, error) -> Void in
    if(error != nil)
    {
        // handle error
        return;
    }
    
    callClientInstance = callClient;
}));

```
--- 

## Make outgoing call

To create and start a call you need to call one of the APIs on CallClient and provide ACS Identity of a user that you've provisioned using ACS Management SDK on your trusted service or a phone number in E.164 format

Call creation and start is synchronous, as a result you'll receive call instance, allowing you to subscribe to all events on the call.

##### Make 1:1 call to user or 1:n call with users and PSTN

#### [Javascript](#tab/javascript)
```js
const placeCallOptions = {};
const oneToOneCall = callClient.call(['acsUserId'], placeCallOptions);
```
#### [Android (Java)](#tab/java)
```java
String participants[] = new String[]{ "acsUserId" };
PlaceCallOptions callOptions = new PlaceCallOptions();
call = callClient.call(participants, callOptions);
```
#### [iOS (Swift)](#tab/swift)
```swift
let placeCallOptions = ACSPlaceCallOptions();
let oneToOneCall = self.CallingApp.adHocCallClient.callWithParticipants(participants: ['acsUserId'], options: placeCallOptions);
```
---

##### Making 1:n call with users and PSTN

#### [Javascript](#tab/javascript)
```js
const placeCallOptions = {};
const groupCall = callClient.call(['acsUserId', '+1234567890'], placeCallOptions);
```
#### [Android (Java)](#tab/java)
```java
String participants[] = new String[]{ "acsUserId", "+1234567890" };
PlaceCallOptions callOptions = new PlaceCallOptions();
Call groupCall = callClient.call(participants, callOptions);
```
#### [iOS (Swift)](#tab/swift)
```swift
let placeCallOptions = ACSPlaceCallOptions();
let groupCall = self.CallingApp.adHocCallClient.callWithParticipants(participants: ['acsUserId', '+1234567890'], options: placeCallOptions);
```
---

## Handle incoming push notification
#### [Javascript](#tab/javascript)
```js
// NA
```
#### [Android (Java)](#tab/java)
```java
Future<Call> handlePushNotificationFuture = callClient.handlePushNotification(jsonPayload);
try {
    handlePushNotificationFuture.get();
    // Push Notification succeeds
} catch(ExecutionException) {
    // Push Notification fails
}
```
#### [iOS (Swift)](#tab/swift)
```swift
call.handlePushNotificationWithCompletionHandler(jsonPayload, 
                completionHandler: (call: ACSCall, error: Error?) -> Void) { 
                if (error != nil)
                {
                    print("Failed to handle the incoming call notification")
                }
                else
                {
                    self.call = call
                    self.call.delegate = self; // To get notified about call state changes
                }
});
```
---


## Mid-call operations
You can perform various operations on a call

#### Mute/unmute
To mute or umute the local endpoint you can use the `mute` and `unmute` asynchronous APIs 

#### [Javascript](#tab/javascript)
```js
//mute local device 
await call.mute();

//unmute device 
await call.unmute();
```
#### [Android (Java)](#tab/java)
```java
//mute local device 
Future muteCallFuture = call.mute();

//unmute local device 
Future unmuteCallFuture = call.unmute();
```
#### [iOS (Swift)](#tab/swift)
```swift
//mute local device 
call.mute(completionHandler: nil);

//unmute local device 
call.unmute(completionHandler: nil);
```
---
 
#### Remote participants management
All remote participants are represented by `RemoteParticipant` type and available through `remoteParticipants` collection on a call instance

##### List participants in a call

#### [Javascript](#tab/javascript)

```js
call.remoteParticipants; // [remoteParticipant, remoteParticipant....]
```
#### [Android (Java)](#tab/java)
```java
RemoteParticipant[] remoteParticipants = call.getRemoteParticipants();
```
#### [iOS (Swift)](#tab/swift)
```swift
call.remoteParticipants
```
--- 

## Remote participant has set of properties

#### [Javascript](#tab/javascript)
```js
const identity: string = remoteParticipant.identity;

identity.id = 'acsId' | 'phoneNumber'; // can be either ACS Id or a phone number
identity.type = 'user' | 'phoneNumber';

const state: string = remoteParticipant.state; // one of 'Idle' | 'Connecting' | 'Connected' | 'OnHold' | 'InLobby' | 'EarlyMedia' | 'Disconnected';

const callEndReason: AcsError = remoteParticipant.callEndReason; // reason why participant left the call, contains code/subcode/message

const isMuted: boolean = remoteParticipant.isMuted; // indicates if participant is muted

const isSpeaking: boolean = remoteParticipant.isSpeaking; // indicates if participant is speaking

const videoStreams: RemoteVideoStream[] = remoteParticipant.videoStreams; // collection of video streams this participants has [RemoteVideoStream, RemoteVideoStream, ...]

const screenSharingStreams: RemoteVideoStream[] = remoteParticipant.screenSharingStreams; // collection of screen sharing streams this participants has, [RemoteVideoStream, RemoteVideoStream, ...]
```
#### [Android (Java)](#tab/java)
```java
// [String] userId - same as the one used to provision token for another user
String userId = remoteParticipant.getIdentity();

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
#### [iOS (Swift)](#tab/swift)
```swift
// [String] userId - same as the one used to provision token for another user
var userId = remoteParticipant.identity;

// ACSParticipantStateIdle = 0, ACSParticipantStateEarlyMedia = 1, ACSParticipantStateConnecting = 2, ACSParticipantStateConnected = 3, ACSParticipantStateOnHold = 4, ACSParticipantStateInLobby = 5, ACSParticipantStateDisconnected = 6
var state = remoteParticipant.state;

// [AcsError] callEndReason - reason why participant left the call, contains code/subcode/message
var callEndReason = remoteParticipant.callEndReason

// [Bool] isMuted - indicating if participant is muted
var isMuted = remoteParticipant.isMuted;

// [Bool] isSpeaking - indicating if participant is currently speaking
var isSpeaking = remoteParticipant.isSpeaking;

// ACSRemoteVideoStream[] - collection of video streams this participants has
var videoStreams = remoteParticipant.videoStreams; // [ACSRemoteVideoStream, ACSRemoteVideoStream, ...]

// ACSRemoteVideoStream[] - collection of screen sharing streams this participants has
var screenSharingStreams = remoteParticipant.screenSharingStreams; // [ACSRemoteVideoStream, ACSRemoteVideoStream, ...]
```
--- 

#### Add participant to a call
To add a participant to a call, either a user or a phone number you have to call 'addParticipant' API
It will synchronously return remote participant instance

#### [Javascript](#tab/javascript)
```js
const remoteParticipant = call.addParticipant('acsId');
const remoteParticipant = call.addParticipant(utils.normalizePhoneNumber('+123456789'));
```
#### [Android (Java)](#tab/java)
```java
RemoteParticipant remoteParticipant = call.addParticipant("userId");
```
#### [iOS (Swift)](#tab/swift)
```swift
ACSRemoteParticipant* remoteParticipant = self.call.addParticipant("userId");
```
--- 

#### Remove participant from a call
To remove participant from a call, either a user or a phone number you have to call 'removeParticipant' API
It will resolve asynchronously

#### [Javascript](#tab/javascript)
```js
await call.removeParticipant(remoteParticipant);
```
#### [Android (Java)](#tab/java)
```java
// Get and remove first participant from a call
RemoteParticipant remoteParticipant = call.getParticipants().get(0);
Future removeParticipantTask = call.removeParticipant(remoteParticipant);
removeParticipantTask.get();
```
#### [iOS (Swift)](#tab/swift)
```swift
call.removeParticipant(participant: remoteParticipant,
                       completionHandler: ((error: Error?) -> Void)
```
--- 

### Start/stop sending local video
To start sending local video to other participants in the call,
use 'startVideo' api and pass videoDevice from deviceManager.getCameraList() API enumeration call

#### [Javascript](#tab/javascript)
```js
const localVideoStream = await call.startVideo(videoDevice);
```
#### [Android (Java)](#tab/java)
```java
VideoDeviceInfo videoDevice = <get-video-device>;
Future startVideoFuture = call.startVideo(videoDevice);
startVideoFuture.get();
```
#### [iOS (Swift)](#tab/swift)
```swift
call.startVideo(device: ACSVideoDeviceInfo(),
                completionHandleFuture stopVideoTask = call.stopVideo(localVideoStream);
stopVideoTask.get();r: ((error: Error?) -> Void) { 
    if(error == nil)
    {
        print("Video was started successfully.");
    }
    else
    {
        print("Video failed to start.");
    }   
});
```
--- 

Once you start sending video 'LocalVideoStream' instance is added to localVideoStreams collection on a call instance

#### [Javascript](#tab/javascript)
```js
call.localVideoStreams[0] === localVideoStream;
```
#### [Android (Java)](#tab/java)
```java
call.getLocalVideoStreams().get(0) == localVideoStream;
```
#### [iOS (Swift)](#tab/swift)
```swift
call.localVideoStreams
```
--- 

* [Asynchronous] stop local video, pass localVideoStream you got from call.startVideo() API call

#### [Javascript](#tab/javascript)
```js
await call.stopVideo(localVideoStream);
```
#### [Android (Java)](#tab/java)
```java
Future stopVideoTask = call.stopVideo(localVideoStream);
stopVideoTask.get();
```
#### [iOS (Swift)](#tab/swift)
```swift
call.stopVideo(completionHandler: ((error: Error?) -> Void) { 
    if(error == nil)
    {
        print("Video was stopped successfully.");
    }
    else
    {
        print("Video failed to stop.");
    }   
});
```
--- 

## Handle remote participant video streams
Remote participant may send video or screen sharing during a call, this sections coves how to discover and handle remote streams

#### Handle remote participant video/screen sharing streams
List streams
To list streams of remote participants inspect his videoStreams or screenSharingStreams collections

#### [Javascript](#tab/javascript)
```js
const remoteParticipantStream = call.remoteParticipants[0].videoStreams[0];
const remoteParticipantStream = call.remoteParticipants[0].screenSharingStreams[0];
```
#### [Android (Java)](#tab/java)
```java
RemoteVideoStream remoteVideoStream = remoteParticipant.getVideoStreams().get(0);
RemoteVideoStream remoteScreenShareStream = remoteParticipant.getScreenSharingStreams().get(0);
```
#### [iOS (Swift)](#tab/swift)
```swift
var remoteParticipantStream = call.remoteParticipants[0].videoStreams[0];
var remoteParticipantStream = call.remoteParticipants[0].screenSharingStreams[0];
```
--- 
It has following properties:

#### [Javascript](#tab/javascript)
```js
const type: string = remoteParticipantStream.type; // 'Video' | 'ScreenSharing';
const type: boolean = remoteParticipantStream.isAvailable; // indicates if remote stream is available
const activeRenderers: RemoteVideoRenderer[] = remoteParticipantStream.activeRenderers; // collection of active renderers rendering given stream
```
#### [Android (Java)](#tab/java)
```java
// [MediaStreamType] type one of 'Video' | 'ScreenSharing';
MediaStreamType type = remoteVideoStream.getType();

// [boolean] if remote stream is available
var isAvailable = remoteScreenShareStream.getIsAvailable();

// RemoteVideoRenderer[] collection of active renderers rendering given stream
var activeRenders = remoteVideoStream.getActiveRenderers();
```
#### [iOS (Swift)](#tab/swift)
```swift
// [ACSMediaStreamType] type one of 'Video' | 'ScreenSharing';
var type = remoteParticipantStream.type;

// [Bool] if remote stream is available
var isAvailable = remoteParticipantStream.isAvailable;

// RemoteVideoRenderer[] collection of active renderers rendering given stream
var activeRenders = remoteParticipantStream.activeRenderers;
```
--- 

You can subscribe to 'availabilityChanged' and 'activeRenderersChanged' events 

## Render remote participant stream
To start rendering remote participant stream


#### [Javascript](#tab/javascript)
```js
const remoteVideoRenderer = await remoteParticipantStream.render(target, scalingMode?);
```
#### [Android (Java)](#tab/java)
```java
Future remoteVideoRenderTask = remoteVideoStream.render(ScalingMode.Fit);
RenderTarget renderingSurface = remoteVideoRenderTask.get();
// Attach the renderingSurface to a viewable location on the app at this point
```
#### [iOS (Swift)](#tab/swift)
```swift
let renderer: ASARemoteVideoRenderer = remoteVideoStream.render(ScalingMode.Stretch);
let targetSurface: UIView = renderer.target;
```
--- 
Where:
* [HTMLNode] target - an HTML node that should be used as a placeholder for stream to render in
* [string] scalingMode - one of 'Stretch' | 'Crop' | 'Fit'

As a result of this call remoteVideoRenderer is added to activeRenderers collection

#### [Javascript](#tab/javascript)
```js
remoteParticipantStream.activeRenderers[0] === remoteVideoRenderer;
```
#### [Android (Java)](#tab/java)
```java
remoteParticipantStream.activeRenderers.get(0) == remoteVideoRenderer;
```
#### [iOS (Swift)](#tab/swift)
```swift
remoteParticipantStream.activeRenderers[0] == remoteVideoRenderer
```
--- 

### RemoteVideoRenderer
Represents remote video stream renderer, it has following properties

#### [Javascript](#tab/javascript)
```js
// [bool] isRendering - indicating if stream is being rendered
remoteVideoRenderer.isRendering; 
// [string] scalingMode one of 'Stretch' | 'Crop' | 'Fit'
remoteVideoRenderer.scalingMode
// HTMLNode] target an HTML node that should be used as a placeholder for stream to render in
remoteVideoRenderer.target
```
#### [Android (Java)](#tab/java)
```java
// [boolean] isRendering - indicating if stream is being rendered
remoteVideoRenderer.getIsRendering();
// [ScalingMode] ScalingMode.Stretch = 0, ScalingMode.Crop = 1, ScalingMode.Fit = 2
remoteVideoRenderer.getScalingMode();
// [UIView] target an UI node that should be used as a placeholder to render stream
remoteVideoRenderer.getTarget()
```
#### [iOS (Swift)](#tab/swift)
```swift
// [Bool] isRendering - indicating if stream is being rendered
remoteVideoRenderer.isRendering; 
// [ACSScalingMode] ACSScalingModeStretch = 0, ACSScalingModeCrop = 1, ACSScalingModeFit = 2
remoteVideoRenderer.scalingMode
// [UIView] target an HTML node that should be used as a placeholder for stream to render in
remoteVideoRenderer.target
```
--- 

RemoteVideoRenderer instance has following methods

#### [Javascript](#tab/javascript)
```js
remoteVideoRenderer.setScalingMode(scalingModel); // 'Stretch' | 'Crop' | 'Fit', change scaling mode
await remoteVideoRenderer.pause(); // pause rendering
await remoteVideoRenderer.resume(); // resume rendering
```
#### [Android (Java)](#tab/java)
```java
// [boolean] isRendering - indicating if stream is being rendered
remoteVideoRenderer.getIsRendering();
// [ScalingMode] ScalingMode.Stretch = 0, ScalingMode.Crop = 1, ScalingMode.Fit = 2
remoteVideoRenderer.getScalingMode();
// [UIView] target an UI node that should be used as a placeholder to render stream
remoteVideoRenderer.getTarget()
```
#### [iOS (Swift)](#tab/swift)
```swift
// [Bool] isRendering - indicating if stream is being rendered
remoteVideoRenderer.isRendering; 
// [ACSScalingMode] ACSScalingModeStretch = 0, ACSScalingModeCrop = 1, ACSScalingModeFit = 2
remoteVideoRenderer.scalingMode
// [UIView] target an HTML node that should be used as a placeholder for stream to render in
remoteVideoRenderer.target
```
--- 

### DeviceManager
Device manager lets you enumerate local devices that can be used in a call to send your audio/video streams
It also allows you to request permission from user to access microphone/camera using native browser API
You can access deviceManager on a callClient object

#### [Javascript](#tab/javascript)
```js
const deviceManager = callClient.deviceManager;
```
#### [Android (Java)](#tab/java)
```java
// NA
```
#### [iOS (Swift)](#tab/swift)
```swift
// NA
```
--- 

#### Request permission to camera/microphone
To prompt user to grant permission to his camera/microphone call

#### [Javascript](#tab/javascript)
```js
const result = await deviceManager.askDevicePermission(audio: true, video: true); // resolves with Promise<IDeviceAccess>;
// result.audio = true|false
// result.video = true|false
```
#### [Android (Java)](#tab/java)
```java
// NA
```
#### [iOS (Swift)](#tab/swift)
```swift
// NA
```
--- 

You can check what's the current permission state for a given type by calling

#### [Javascript](#tab/javascript)
```js
const result = deviceManager.getPermissionState('Microphone'); // for microphone permission state
const result = deviceManager.getPermissionState('Camera'); // for camera permission state

console.log(result); // 'Granted' | 'Denied' | 'Prompt' | 'Unknown';
```
#### [Android (Java)](#tab/java)
```java
// NA
```
#### [iOS (Swift)](#tab/swift)
```swift
// NA
```
--- 

#### Enumerate local devices
Enumeration is asynchronous

#### [Javascript](#tab/javascript)
```js
// enumerate local cameras
const localCameras = await deviceManager.getCameraList(); // [VideoDeviceInfo, VideoDeviceInfo...]
// enumerate local cameras
const localMicrophones = await deviceManager.getMicrophoneList(); // [AudioDeviceInfo, AudioDeviceInfo...]
// enumerate local cameras
const localSpeakers = await deviceManager.getSpeakerList(); // [AudioDeviceInfo, AudioDeviceInfo...]
```
#### [Android (Java)](#tab/java)
```java
// enumerate local cameras
List<VideoDeviceInfo> localCameras = deviceManager.getCameraList(); // [VideoDeviceInfo, VideoDeviceInfo...]
// enumerate local cameras
List<AudioDeviceInfo> localMicrophones = deviceManager.getMicrophoneList(); // [AudioDeviceInfo, AudioDeviceInfo...]
// enumerate local cameras
List<AudioDeviceInfo> localSpeakers = deviceManager.getSpeakerList(); // [AudioDeviceInfo, AudioDeviceInfo...]
```
#### [iOS (Swift)](#tab/swift)
```swift
// enumerate local cameras
var localCameras = deviceManager.getCameraList(); // [ACSVideoDeviceInfo, ACSVideoDeviceInfo...]
// enumerate local cameras
var localMicrophones = deviceManager.getMicrophoneList(); // [ACSAudioDeviceInfo, ACSAudioDeviceInfo...]
// enumerate local cameras
var localSpeakers = deviceManager.getSpeakerList(); // [ACSAudioDeviceInfo, ACSAudioDeviceInfo...]
```
--- 
#### Set default camera/microphone/speaker
Device mananager allows you to set a default device that will be used when starting a call
If not ACS will fallback to OS defaults

* get/select default devices

#### [Javascript](#tab/javascript)
```js
// get default camera
const defaultCamera = deviceManager.getCamera();
// [asynchronous] set default camera
await deviceManager.setCamera(VideoDeviceInfo);
// get default microphone
const defaulttMicrophone = deviceManager.gettMicrophone();
// [asynchronous] set default microphone
await devicetMicrophone.settMicrophone(AudioDeviceInfo);
// get default speaker
const defaultSpeaker = deviceManager.getSpeaker();
// [asynchronous] set default speaker
await deviceManager.setSpeaker(AudioDeviceInfo);
```
#### [Android (Java)](#tab/java)
```java
// get default camera
VideoDeviceInfo defaultCamera = deviceManager.getCamera();
// get default microphone
AudioDeviceInfo defaultMicrophone = deviceManager.getMicrophone();
// get default speaker
AudioDeviceInfo defaultSpeaker = deviceManager.getSpeaker();
// [Synchronous] set default microphone
defaultMicrophone.setMicrophone(new AudioDeviceInfo());
// [Synchronous] set default speaker
deviceManager.setSpeakers(new AudioDeviceInfo());
```
#### [iOS (Swift)](#tab/swift)
```swift
// get default camera
var defaultCamera = deviceManager.getCamera();
// [Synchronous] set default camera
var deviceManager.setCamera(VideoDeviceInfo);
// get default microphone
var defaultMicrophone = deviceManager.getMicrophone();
// [Synchronous] set default microphone
defaultMicrophone.setDefaultMicrophone(AudioDeviceInfo);
// get default speaker
var defaultSpeaker = deviceManager.getSpeaker();
// [Synchronous] set default speaker
deviceManager.setDefaultSpeakers(AudioDeviceInfo);
```
--- 
#### Local camera preview
You can use deviceManager to start render stream from your local camera, this stream won't be send to other participants, it's local preview feed
* [asynchronous] start local video preview

#### [Javascript](#tab/javascript)
```js
const previewRenderer = await deviceManager.renderPreviewVideo(VideoDeviceInfo, HTMLNode, ScalingModel);
await previewRenderer.start();
```
#### [Android (Java)](#tab/java)
```java
PreviewRenderer previewRenderer = deviceManager.renderPreviewVideo(new VideoDeviceInfo(), ScalingMode.Fit);
Future renderTask = previewRenderer.start();
RenderTarget renderingSurface = renderTask.get();
// Attach the renderingSurface to a viewable location on the app at this point
```
#### [iOS (Swift)](#tab/swift)
```swift
var previewRenderer = deviceManager.renderPreviewVideoWithCameraDevice(defaultCamera, target, remoteVideoRenderer.scalingMode);
previewRenderer.start();
```
--- 
Preview renderer has set of properties and methods that allows you to control it:

#### [Javascript](#tab/javascript)
```js
// [bool] isRendering
previewRenderer.isRendering
// [HTMLNode] target
previewRenderer.target
// [string] scalingMode
previewRenderer.scalingMode
// [VideoDeviceInfo] videoDeviceInfo
previewRenderer.videoDeviceInfo
// [asynchronous] start
previewRenderer.start();
// [asynchronous] stop
previewRenderer.stop();
// [asynchronous] switchDevice
previewRenderer.switchDevice(VideoDeviceInfo);
// setScalingMode
previewRenderer.setScalingMode(ScalingMode);
```
#### [Android (Java)](#tab/java)
```java
// [boolean] isRendering
previewRenderer.getIsRendering()
// [RenderTarget] target
previewRenderer.getTarget()
// [ScalingMode] scalingMode
previewRenderer.getScalingMode()
// [VideoDeviceInfo] videoDeviceInfo
previewRenderer.getVideoDeviceInfo()
// [Asynchronous] start
previewRenderer.start().get();
// [Asynchronous] stop
previewRenderer.stop().get();
// [Asynchronous] switchDevice
previewRenderer.switchDevice(new VideoDeviceInfo()).get();
// setScalingMode
previewRenderer.setScalingMode(ScalingMode);
```
#### [iOS (Swift)](#tab/swift)
```swift
// [Bool] isRendering
previewRenderer.isRendering
// [UIView] target
previewRenderer.target
// [ACSScalingMode] scalingMode
previewRenderer.scalingMode
// [ACSVideoDeviceInfo] videoDeviceInfo
previewRenderer.videoDeviceInfo
// [Synchronous] start
previewRenderer.start();
// [Synchronous] stop
previewRenderer.stop();
// [Synchronous] switchDevice
previewRenderer.switchDevice(ACSVideoDeviceInfo);
// setScalingMode
previewRenderer.setScalingMode(ACSScalingMode);
```
--- 
 

## Eventing model
Most of properties and collections can change it's value.
To subscribe to these changes you can use following:
#### Properties
To subscribe to property change event:

#### [Javascript](#tab/javascript)
```js
const eventHandler = () => {
    // check current value of a property, value is not passed to callback
    console.log(object.property);
};
object.on('propertyNameChanged',eventHandler);

// To unsubscribe:

object.off('propertyNameChanged',eventHandler);
```
#### [Android (Java)](#tab/java)
```java
// subscribe
PropertyChangedListener callIdChangeListener = new PropertyChangedListener()
{
    @Override
    public void onPropertyChanged(PropertyChangedEvent args)
    {
        Log.d("The call id has changed.");
    }
}
call.addOnCallIdChangedListener(callIdChangeListener);

//unsubscribe
call.removeOnCallIdChangedListener(callIdChangeListener);
```
#### [iOS (Swift)](#tab/swift)
```swift
self.adHocCallClient.delegate = self
    // Get the property of the call state by doing get on the call's state member
    public func onCallStateChanged(_ call: ACSCall!,
                            _ args: ACSPropertyChangedEventArgs!)
    {
        print("Callback from SDK when the call state changes, current state: " + call.state.rawValue);
    }
 // to unsubscribe
 self.adHocCallClient.delegate = nil

```
--- 
#### Collections
To subscribe to collection updated event:

#### [Javascript](#tab/javascript)
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
#### [Android (Java)](#tab/java)
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
#### [iOS (Swift)](#tab/swift)
```swift
self.adHocCallClient.delegate = self
    // Collection contains the streams that were added or removed only
    public func onLocalVideoStreamsChanged(_ call: ACSCall!,
                                    _ args: ACSLocalVideoStreamsUpdatedEventArgs!)
    {
        print(args.addedStreams.count);
        print(args.removeStreams.count);
    }
     // to unsubscribe
 self.adHocCallClient.delegate = nil
```
--- 




