---
author: mikben
ms.service: azure-communication-services
ms.topic: include
ms.date: 9/1/2020
ms.author: mikben
---
> [!WARNING]
> This document is under construction and needs the following items to be addressed: 
>

Get started with Azure Communication Services by using the Communication Services client library to add video calling to your app.

## Prerequisites
To be able to place an outgoing telephone call, you need following:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- An Azure Communication Service resource. Further details can be found in the [Create an Azure Communication Resource](../../create-communication-resource.md) quickstart.
- Complete the quickstart for adding calling to your application [here](../getting-started-with-calling.md)

## Retrieve video devices

Using the `deviceManager` inside of our callClient we can choose what camera we will use to get video for the call

```javascript

const videoDeviceInfo = callClient.deviceManager.getCameraList()[0];

```

### Place a call with video

Start a call using `placeCallOptions` and specifying the camera we will use.

```javascript

const placeCallOptions = {videoOptions: {camera: videoDeviceInfo}};
const call = callClient.call(['acsUserId'], placeCallOptions);

```

This will start a call where the client's video will be streamed to other participants.

## Receive video from remote participants

While on a video call, you can then consume the video streams from other participants to render them. All remote participants are represented by `RemoteParticipant` type. To this we will:

1. Get the list of remote participants

```javascript

call.remoteParticipants;

```

1. Access a remote participants video or screen share stream using the `videoStreams` and `screenSharingStreams` collections

```javascript

const remoteVideoStream = call.remoteParticipants[0].videoStreams[0];
const remoteVideoStream = call.remoteParticipants[0].screenSharingStreams[0];

```

`RemoteVideoStream` contains the following properties:

```javascript

const type: string = remoteParticipantStream.type; // 'Video' | 'ScreenSharing';
const type: boolean = remoteParticipantStream.isAvailable; // indicates if remote stream is available
const activeRenderers: RemoteVideoRenderer[] = remoteParticipantStream.activeRenderers; // collection of active renderers rendering given stream

```

## Render video from remote participants

To render the video for a participant, we will use the `render` method for `RemoteVideoStream`. We will pass a `target` for the video which will be an html node for the video. (Optional) `scalingMode` will set whether the video is `Stretch` | `Crop` | `Fit`

```javascript

const remoteVideoRenderer = await remoteVideoStream.render(target, scalingMode?);

```

All active renders are tracked using the `activeRenderers` collection

```javascript

remoteParticipantStream.activeRenderers[0] === remoteVideoRenderer;

```

`activeRenderers` have the following properties and methods:

```javascript

//Properties
// [bool] isRendering - indicating if stream is being rendered
remoteVideoRenderer.isRendering; 
// [string] scalingMode one of 'Stretch' | 'Crop' | 'Fit'
remoteVideoRenderer.scalingMode
// HTMLNode] target an HTML node that should be used as a placeholder for stream to render in
remoteVideoRenderer.target

//Methods
remoteVideoRenderer.setScalingMode(scalingModel); // 'Stretch' | 'Crop' | 'Fit', change scaling mode
await remoteVideoRenderer.pause(); // pause rendering
await remoteVideoRenderer.resume(); // resume rendering

```

## Stop/Start sending video

Once the call starts, you can enable and disable sending video to other participants using the `startVideo` and `stopVideo` methods. You can access your local video stream using the `localVideoStreams` collection

```javascript

//Start Sending Video
const localVideoStream = await call.startVideo(videoDevice);

//Stop Sending Video
call.localVideoStreams[0] === localVideoStream;
await call.stopVideo(localVideoStream);

```


## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You can find out more about cleaning up resources [here](../../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:
- Check out our calling hero sample [here](../../../samples/calling-hero-sample.md)
- Learn more about how calling works [here](../../../concepts/voice-video-calling/about-call-types.md)