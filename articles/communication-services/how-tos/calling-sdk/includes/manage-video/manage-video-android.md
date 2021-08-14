## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../../access-tokens.md)
- Optional: Complete the quickstart for [getting started with adding calling to your application](../../getting-started-with-calling.md)

[!INCLUDE [Install SDK](../install-sdk/install-sdk-android.md)]

## Device management
To begin using video with Calling, you will need to know how to manage devices. Devices allow you to control what transmits Audio and Video to the call.

`DeviceManager` lets you enumerate local devices that can be used in a call to transmit your audio/video streams. It also allows you to request permission from a user to access their microphone and camera using the native browser API.

You can access `deviceManager` by calling `callClient.getDeviceManager()` method.
> [!WARNING]
> Currently a `callAgent` object must be instantiated first in order to gain access to DeviceManager

```java
Context appContext = this.getApplicationContext();
DeviceManager deviceManager = callClient.getDeviceManager(appContext).get();
```

### Enumerate local devices

To access local devices, you can use enumeration methods on the Device Manager. Enumeration is a synchronous action.

```java
//  Get a list of available video devices for use.
List<VideoDeviceInfo> localCameras = deviceManager.getCameras(); // [VideoDeviceInfo, VideoDeviceInfo...]
```

### Local camera preview

You can use `DeviceManager` and `Renderer` to begin rendering streams from your local camera. This stream won't be sent to other participants; it's a local preview feed. This is an asynchronous action.

```java
VideoDeviceInfo videoDevice = <get-video-device>;
Context appContext = this.getApplicationContext();
currentVideoStream = new LocalVideoStream(videoDevice, appContext);
LocalVideoStream[] localVideoStreams = new LocalVideoStream[1];
localVideoStreams[0] = currentVideoStream;
videoOptions = new VideoOptions(localVideoStreams);

VideoStreamRenderer previewRenderer = new VideoStreamRenderer(currentVideoStream, appContext);
VideoStreamRendererView uiView = previewRenderer.createView(new RenderingOptions(ScalingMode.Fit));

// Attach the uiView to a viewable location on the app at this point
layout.addView(uiView);
```

## Place a 1:1 call with video camera
> [!WARNING]
> Currently only one outgoing local video stream is supported
To place a call with video you have to enumerate local cameras using the `deviceManager` `getCameras` API.
Once you select a desired camera, use it to construct a `LocalVideoStream` instance and pass it into `videoOptions`
as an item in the `localVideoStream` array to a `call` method.
Once the call connects it'll automatically start sending a video stream from the selected camera to other participant(s).

> [!NOTE]
> Due to privacy concerns, video will not be shared to the call if it is not being previewed locally.
See [Local camera preview](#local-camera-preview) for more details.
```java
Context appContext = this.getApplicationContext();
VideoDeviceInfo desiredCamera = callClient.getDeviceManager(appContext).get().getCameras().get(0);
LocalVideoStream currentVideoStream = new LocalVideoStream(desiredCamera, appContext);
LocalVideoStream[] localVideoStreams = new LocalVideoStream[1];
localVideoStreams[0] = currentVideoStream;
VideoOptions videoOptions = new VideoOptions(localVideoStreams);

// Render a local preview of video so the user knows that their video is being shared
Renderer previewRenderer = new VideoStreamRenderer(currentVideoStream, appContext);
View uiView = previewRenderer.createView(new CreateViewOptions(ScalingMode.FIT));
// Attach the uiView to a viewable location on the app at this point
layout.addView(uiView);

CommunicationUserIdentifier[] participants = new CommunicationUserIdentifier[]{ new CommunicationUserIdentifier("<acs user id>") };
StartCallOptions startCallOptions = new StartCallOptions();
startCallOptions.setVideoOptions(videoOptions);
Call call = callAgent.startCall(context, participants, startCallOptions);
```

## Start and stop sending local video

To start a video, you have to enumerate cameras using the `getCameraList` API on `deviceManager` object. Then create a new instance of `LocalVideoStream` passing the desired camera, and pass it in the `startVideo` API as an argument:

```java
VideoDeviceInfo desiredCamera = <get-video-device>;
Context appContext = this.getApplicationContext();
LocalVideoStream currentLocalVideoStream = new LocalVideoStream(desiredCamera, appContext);
VideoOptions videoOptions = new VideoOptions(currentLocalVideoStream);
Future startVideoFuture = call.startVideo(appContext, currentLocalVideoStream);
startVideoFuture.get();
```

Once you successfully start sending video, a `LocalVideoStream` instance will be added to the `localVideoStreams` collection on the call instance.

```java
currentLocalVideoStream == call.getLocalVideoStreams().get(0);
```

To stop local video, pass the `LocalVideoStream` instance available in `localVideoStreams` collection:

```java
call.stopVideo(appContext, currentLocalVideoStream).get();
```

You can switch to a different camera device while video is being sent by invoking `switchSource` on a `LocalVideoStream` instance:
```java
currentLocalVideoStream.switchSource(source).get();
```

## Render remote participant video streams
To list the video streams and screen sharing streams of remote participants, inspect the `videoStreams` collections:
```java
RemoteParticipant remoteParticipant = call.getRemoteParticipants().get(0);
RemoteVideoStream remoteParticipantStream = remoteParticipant.getVideoStreams().get(0);
MediaStreamType streamType = remoteParticipantStream.getType(); // of type MediaStreamType.Video or MediaStreamType.ScreenSharing
```
 
To render a `RemoteVideoStream` from a remote participant, you have to subscribe to a `OnVideoStreamsUpdated` event.

Within the event, the change of `isAvailable` property to true indicates that remote participant is currently sending a stream. Once that happens, create new instance of a `Renderer`, then create a new `RendererView` using asynchronous `createView` API and attach `view.target` anywhere in the UI of your application.

Whenever availability of a remote stream changes you can choose to destroy the whole Renderer, a specific `RendererView` or keep them, but this will result in displaying blank video frame.

```java
VideoStreamRenderer remoteVideoRenderer = new VideoStreamRenderer(remoteParticipantStream, appContext);
VideoStreamRendererView uiView = remoteVideoRenderer.createView(new RenderingOptions(ScalingMode.FIT));
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
MediaStreamType type = remoteVideoStream.getMediaStreamType();
```

* `isAvailable` - Indicates if remote participant endpoint is actively sending stream
```java
boolean availability = remoteVideoStream.isAvailable();
```

### Renderer methods and properties
Renderer object following APIs

* Create a `VideoStreamRendererView` instance that can be later attached in the application UI to render remote video stream.
```java
// Create a view for a video stream
VideoStreamRendererView.createView()
```
* Dispose renderer and all `VideoStreamRendererView` associated with this renderer. To be called when you have removed all associated views from the UI.
```java
VideoStreamRenderer.dispose()
```

* `StreamSize` - size (width/height) of a remote video stream
```java
StreamSize renderStreamSize = VideoStreamRenderer.getSize();
int width = renderStreamSize.getWidth();
int height = renderStreamSize.getHeight();
```

### RendererView methods and properties
When creating a `VideoStreamRendererView` you can specify the `ScalingMode` and `mirrored` properties that will apply to this view:
Scaling mode can be either of 'CROP' | 'FIT'

```java
VideoStreamRenderer remoteVideoRenderer = new VideoStreamRenderer(remoteVideoStream, appContext);
VideoStreamRendererView rendererView = remoteVideoRenderer.createView(new CreateViewOptions(ScalingMode.Fit));
```

The created RendererView can then be attached to the application UI using the following snippet:
```java
layout.addView(rendererView);
```

You can later update the scaling mode by invoking `updateScalingMode` API on the RendererView object with one of ScalingMode.CROP | ScalingMode.FIT as an argument.
```java
// Update the scale mode for this view.
rendererView.updateScalingMode(ScalingMode.CROP)
```
