---
author: sloanster
ms.service: azure-communication-services
ms.topic: include
ms.date: 06/10/2025
ms.author: micahvivion
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-android.md)]

## Device management

To use video with Calling, you need to manage devices. Using devices enables you to control what transmits Audio and Video to the call.

The `DeviceManager` object enables you to enumerate local devices to use in a call to transmit your audio/video streams. It also enables you to request permission from a user to access their microphone and camera using the native browser API.

To access `deviceManager`, call the `callClient.getDeviceManager()` method.

```java
Context appContext = this.getApplicationContext();
DeviceManager deviceManager = callClient.getDeviceManager(appContext).get();
```

### Enumerate local devices

To access local devices, use enumeration methods on the Device Manager. Enumeration is a synchronous action.

```java
//  Get a list of available video devices for use.
List<VideoDeviceInfo> localCameras = deviceManager.getCameras(); // [VideoDeviceInfo, VideoDeviceInfo...]
```

### Local camera preview

You can use `DeviceManager` and `Renderer` to begin rendering streams from your local camera. This stream isn't sent to other participants. It's a local preview feed. Rendering a stream is an asynchronous action.

```java
VideoDeviceInfo videoDevice = <get-video-device>; // See the `Enumerate local devices` topic above
Context appContext = this.getApplicationContext();

LocalVideoStream currentVideoStream = new LocalVideoStream(videoDevice, appContext);

LocalVideoStream[] localVideoStreams = new LocalVideoStream[1];
localVideoStreams[0] = currentVideoStream;

VideoOptions videoOptions = new VideoOptions(localVideoStreams);

RenderingOptions renderingOptions = new RenderingOptions(ScalingMode.Fit);
VideoStreamRenderer previewRenderer = new VideoStreamRenderer(currentVideoStream, appContext);

VideoStreamRendererView uiView = previewRenderer.createView(renderingOptions);

// Attach the uiView to a viewable location on the app at this point
layout.addView(uiView);
```

## Place a 1:1 call with video camera

> [!WARNING]
> Currently only one outgoing local video stream is supported. To place a call with video, you must enumerate local cameras using the `deviceManager` `getCameras` API.
> Once you select a camera, use it to construct a `LocalVideoStream` instance and pass it into `videoOptions` as an item in the `localVideoStream` array to a `call` method. Once the call connects, it automatically starts sending a video stream from the selected camera to other participants.

> [!NOTE]
> Due to privacy concerns, video isn't shared to the call if it isn't previewed locally.
> For more information, see [Local camera preview](#local-camera-preview).

```java
VideoDeviceInfo desiredCamera = <get-video-device>; // See the `Enumerate local devices` topic above
Context appContext = this.getApplicationContext();

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

To start a video, you must enumerate cameras using the `getCameraList` operation on `deviceManager` object. Then create a new instance of `LocalVideoStream` passing the desired camera, and pass it in the `startVideo` API as an argument:

```java
VideoDeviceInfo desiredCamera = <get-video-device>; // See the `Enumerate local devices` topic above
Context appContext = this.getApplicationContext();

LocalVideoStream currentLocalVideoStream = new LocalVideoStream(desiredCamera, appContext);

VideoOptions videoOptions = new VideoOptions(currentLocalVideoStream);

Future startVideoFuture = call.startVideo(appContext, currentLocalVideoStream);
startVideoFuture.get();
```

Once you successfully start sending video, a `LocalVideoStream` instance is added to the `localVideoStreams` collection on the call instance.

```java
List<LocalVideoStream> videoStreams = call.getLocalVideoStreams();
LocalVideoStream currentLocalVideoStream = videoStreams.get(0); // Please make sure there are VideoStreams in the list before calling get(0).
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
List<RemoteParticipant> remoteParticipants = call.getRemoteParticipants();
RemoteParticipant remoteParticipant = remoteParticipants.get(0); // Please make sure there are remote participants in the list before calling get(0).

List<RemoteVideoStream> remoteStreams = remoteParticipant.getVideoStreams();
RemoteVideoStream remoteParticipantStream = remoteStreams.get(0); // Please make sure there are video streams in the list before calling get(0).

MediaStreamType streamType = remoteParticipantStream.getType(); // of type MediaStreamType.Video or MediaStreamType.ScreenSharing
```
 
To render a `RemoteVideoStream` from a remote participant, you have to subscribe to a `OnVideoStreamsUpdated` event.

Within the event, the change of `isAvailable` property to true indicates that remote participant is currently sending a stream. Once that happens, create new instance of a `Renderer`, then create a new `RendererView` using asynchronous `createView` API and attach `view.target` anywhere in the UI of your application.

Whenever availability of a remote stream changes you can choose to destroy the whole `Renderer`, a specific `RendererView` or keep them, but results in displaying blank video frame.

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

Remote video stream has the following properties:

- `Id` - ID of a remote video stream.

   ```java
   int id = remoteVideoStream.getId();
   ```

- `MediaStreamType` - Can be `Video` or `ScreenSharing`.

   ```java
   MediaStreamType type = remoteVideoStream.getMediaStreamType();
   ```

- `isAvailable` - Indicates if remote participant endpoint is actively sending stream.

   ```java
   boolean availability = remoteVideoStream.isAvailable();
   ```

### Renderer methods and properties

The `Renderer` object uses the following methods.

- To render remote video stream, create a `VideoStreamRendererView` instance that can be later attached in the application UI.

   ```java
   // Create a view for a video stream
   VideoStreamRendererView.createView()
   ```
- Dispose renderer and all `VideoStreamRendererView` associated with this renderer. Call it after you remove all associated views from the UI.

   ```java
   VideoStreamRenderer.dispose()
   ```

- To set the size (width/height) of a remote video stream, use `StreamSize`.

   ```java
   StreamSize renderStreamSize = VideoStreamRenderer.getSize();
   int width = renderStreamSize.getWidth();
   int height = renderStreamSize.getHeight();
   ```

### RendererView methods and properties

When creating a `VideoStreamRendererView`, you can specify the `ScalingMode` and `mirrored` properties that apply to this view.

Scaling mode can be either one of `CROP` or `FIT`.

```java
VideoStreamRenderer remoteVideoRenderer = new VideoStreamRenderer(remoteVideoStream, appContext);
VideoStreamRendererView rendererView = remoteVideoRenderer.createView(new CreateViewOptions(ScalingMode.Fit));
```

The created RendererView can then be attached to the application UI using the following snippet:

```java
layout.addView(rendererView);
```

You can later update the scaling mode using the `updateScalingMode` operation on the `RendererView` object with an argument of either `ScalingMode.CROP` or `ScalingMode.FIT`.

   ```java
   // Update the scale mode for this view.
   rendererView.updateScalingMode(ScalingMode.CROP)
```
