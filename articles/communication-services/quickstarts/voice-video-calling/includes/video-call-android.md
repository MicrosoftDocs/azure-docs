> [!WARNING]
> This document is under construction and needs the following items to be addressed: 
> - note the "raw materials" located in `calling-client-samples`
> - consider possibility that this should be joined with VoIP calling, since (I think) it will just be a line or two per code snippet that changes and the addition of a DOM element to render to


Get started with Azure Communication Services by using the Communication Services client library to add video calling to your app.


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- An Azure Communication Services resource. Further details can be found in the [Create an Azure Communication Resource](../../create-communication-resource.md) quickstart.
- Complete the quickstart for adding calling to your application [here](../getting-started-with-calling.md)
- A Communication Services configured telephone number(s). Further details can be found in the [Buy a telephone number](../../telephony-sms/get-phone-number.md) quickstart.

## Retrieve video devices

Using the `deviceManager` inside of our callClient we can choose what camera we will use to get video for the call

```java

VideoDeviceInfo desiredCamera = callClient.getDeviceManager().getCameraList(0);

```

## Place a call with video

Start a call using `placeCallOptions` and specifying the camera we will use.

```java

VideoDeviceInfo desiredCamera = callClient.getDeviceManager().getCameraList(0);
VideoOptions videoOptions = new VideoOptions();
videoOptions.setCamera(desiredCamera);
PlaceCallOptions placeCallOptions = new PlaceCallOptions();
placeCallOptions.setVideoOptions(videoOptions);
String participants[] = new String[]{ "acsUserId"};
Call call = callClient.call(participants, placeCallOptions);

```

This will start a call where the client's video will be streamed to other participants.

## Receive video from remote participants

While on a video call, you can then consume the video streams from other participants to render them. All remote participants are represented by `RemoteParticipant` type. To this we will:

1. Get the list of remote participants

```java

RemoteParticipant[] remoteParticipants = call.getRemoteParticipants();

```

1. Access a remote participants video or screen share stream using the `videoStreams` and `screenSharingStreams` collections

```java

RemoteVideoStream remoteVideoStream = remoteParticipant.getVideoStreams().get(0);
RemoteVideoStream remoteScreenShareStream = remoteParticipant.getScreenSharingStreams().get(0);

```

`RemoteVideoStream` contains the following properties:

```java

// [MediaStreamType] type one of 'Video' | 'ScreenSharing';
MediaStreamType type = remoteVideoStream.getType();

// [boolean] if remote stream is available
var isAvailable = remoteScreenShareStream.getIsAvailable();

// RemoteVideoRenderer[] collection of active renderers rendering given stream
var activeRenders = remoteVideoStream.getActiveRenderers();

```

## Render video from remote participants

To render the video for a participant, we will use the `render` method for `RemoteVideoStream`. We will pass a `target` for the video which will be an html node for the video. (Optional) `scalingMode` will set whether the video is `Stretch` | `Crop` | `Fit`

```java

Future remoteVideoRenderTask = remoteVideoStream.render(ScalingMode.Fit);
RenderTarget renderingSurface = remoteVideoRenderTask.get();
// Attach the renderingSurface to a viewable location on the app at this point

```

All active renders are tracked using the `activeRenderers` collection

```java
remoteParticipantStream.activeRenderers.get(0) == remoteVideoRenderer;

```

`activeRenderers` have the following properties and methods:

```java
// [boolean] isRendering - indicating if stream is being rendered
remoteVideoRenderer.getIsRendering();
// [ScalingMode] ScalingMode.Stretch = 0, ScalingMode.Crop = 1, ScalingMode.Fit = 2
remoteVideoRenderer.getScalingMode();
// [UIView] target an UI node that should be used as a placeholder to render stream
remoteVideoRenderer.getTarget()

remoteVideoRenderer.setScalingMode(scalingMode); // 'Stretch' | 'Crop' | 'Fit', change scaling mode
// pause rendering
Future remoteVideoRendererPauseFuture = remoteVideoRenderer.pause(); 
remoteVideoRendererPauseFuture.get();
// resume rendering
Future remoteVideoRendererResumeFuture = remoteVideoRenderer.resume(); 
remoteVideoRendererResumeFuture.get();

```

## Stop/Start sending video

Once the call starts, you can enable and disable sending video to other participants using the `startVideo` and `stopVideo` methods. You can access your local video stream using the `localVideoStreams` collection

```java

VideoDeviceInfo videoDevice = <get-video-device>;
Future startVideoFuture = call.startVideo(videoDevice);
startVideoFuture.get();

```


## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You can find out more about cleaning up resources [here](../../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:
- Check out our calling hero sample [here](../../../samples/calling-hero-sample.md)
- Learn more about how calling works [here](../../../concepts/voice-video-calling/about-call-types.md)