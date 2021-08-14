## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../../../quickstarts/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../../../quickstarts/voice-video-calling/getting-started-with-calling.md)

[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Device management
To begin using video with Calling, you will need to know how to manage devices. Devices allow you to control what transmits Audio and Video to the call.

In `deviceManager`, you can enumerate local devices that can transmit your audio and video streams in a call. You can also use it to request permission to access the local device's microphones and cameras.

You can access `deviceManager` by calling the `callClient.getDeviceManager()` method:

```js
const deviceManager = await callClient.getDeviceManager();
```

### Get local devices

To access local devices, you can use enumeration methods on `deviceManager`. Enumeration is an asynchronous action

```js
//  Get a list of available video devices for use.
const localCameras = await deviceManager.getCameras(); // [VideoDeviceInfo, VideoDeviceInfo...]

// Get a list of available microphone devices for use.
const localMicrophones = await deviceManager.getMicrophones(); // [AudioDeviceInfo, AudioDeviceInfo...]

// Get a list of available speaker devices for use.
const localSpeakers = await deviceManager.getSpeakers(); // [AudioDeviceInfo, AudioDeviceInfo...]
```

### Set the default microphone and speaker

In `deviceManager`, you can set a default device that you'll use to start a call. If client defaults aren't set, Communication Services uses operating system defaults.

```js
// Get the microphone device that is being used.
const defaultMicrophone = deviceManager.selectedMicrophone;

// Set the microphone device to use.
await deviceManager.selectMicrophone(localMicrophones[0]);

// Get the speaker device that is being used.
const defaultSpeaker = deviceManager.selectedSpeaker;

// Set the speaker device to use.
await deviceManager.selectSpeaker(localSpeakers[0]);
```

### Local camera preview

You can use `deviceManager` and `VideoStreamRenderer` to begin rendering streams from your local camera. This stream won't be sent to other participants; it's a local preview feed.

```js
const cameras = await deviceManager.getCameras();
const camera = cameras[0];
const localCameraStream = new LocalVideoStream(camera);
const videoStreamRenderer = new VideoStreamRenderer(localCameraStream);
const view = await videoStreamRenderer.createView();
htmlElement.appendChild(view.target);

```

### Request permission to camera and microphone

Prompt a user to grant camera and/or microphone permissions:

```js
const result = await deviceManager.askDevicePermission({audio: true, video: true});
```

This resolves with an object that indicates whether `audio` and `video` permissions were granted:

```js
console.log(result.audio);
console.log(result.video);
```
#### Notes
- The 'videoDevicesUpdated' event fires when video devices are plugging-in/unplugged.
- The 'audioDevicesUpdated' event fires when audio devices are plugged
- When the DeviceManager is created, at first it does not know about any devices if permissions have not been granted yet and so initially it's device lists are empty. If we then call the DeviceManager.askPermission() API, the user is prompted for device access and if the user clicks on 'allow' to grant the access, then the device manager will learn about the devices on the system, update it's device lists and emit the 'audioDevicesUpdated' and 'videoDevicesUpdated' events. Lets say we then refresh the page and create device manager, the device manager will be able to learn about devices because user has already previously granted access, and so it will initially it will have it's device lists filled and it will not emit 'audioDevicesUpdated' nor 'videoDevicesUpdated' events.
- Speaker enumeration/selection is not supported on Android Chrome, iOS Safari, nor macOS Safari.


## Start and stop sending local video

To start a video, you have to enumerate cameras using the `getCameras` method on the `deviceManager` object. Then create a new instance of `LocalVideoStream` with the desired camera and then pass the `LocalVideoStream` object into the `startVideo` method of an existing call object:

```js
const deviceManager = await callClient.getDeviceManager();
const cameras = await deviceManager.getCameras();
const camera = cameras[0]
const localVideoStream = new LocalVideoStream(camera);
await call.startVideo(localVideoStream);
```

After you successfully start sending video, a `LocalVideoStream` instance is added to the `localVideoStreams` collection on a call instance.

```js
call.localVideoStreams[0] === localVideoStream;
```

To stop local video, pass the `localVideoStream` instance that's available in the `localVideoStreams` collection:

```js
await call.stopVideo(localVideoStream);
// or
await call.stopVideo(call.localVideoStreams[0]);
```

There are 4 methods in which you can pass a `localVideoStream` instance to start video in a call, `callAgent.startCall()`, `callAgent.join()`, `call.accept()`, and `call.startVideo()`. To use `call.stopVideo()`, you must pass that same `localVideoStream` instance that you passed to the original method used to start video.

You can switch to a different camera device while a video is sending by invoking `switchSource` on a `localVideoStream` instance:

```js
const cameras = await callClient.getDeviceManager().getCameras();
const camera = cameras[1];
localVideoStream.switchSource(camera);
```

If the specified video device is being used by another process, or if it is disabled in the system:
- While in a call, if your video is off and you start video using `call.startVideo()`, this method will throw with a `SourceUnavailableError` and `cameraStartFiled` will be set to true.
- A call to the `localVideoStream.switchSource()` method will cause `cameraStartFailed` to be set to true.
Our Call Diagnostics guide provides additional information on how to diagnose call related issues.

## Place a 1:1 call with video camera

> [!IMPORTANT]
> Currently only one outgoing local video stream is supported.

To place a video call, you have to  enumerate local cameras by using the `getCameras()` method in `deviceManager`.

After you select a camera, use it to construct a `LocalVideoStream` instance. Pass it within `videoOptions` as an item within the `localVideoStream` array to the `startCall` method.

```js
const deviceManager = await callClient.getDeviceManager();
const cameras = await deviceManager.getCameras();
const camera = cameras[0]
localVideoStream = new LocalVideoStream(camera);
const placeCallOptions = {videoOptions: {localVideoStreams:[localVideoStream]}};
const userCallee = { communicationUserId: '<ACS_USER_ID>' }
const call = callAgent.startCall([userCallee], placeCallOptions);
```

- When your call connects, it automatically starts sending a video stream from the selected camera to the other participant. This also applies to the `Call.Accept()` video options and `CallAgent.join()` video options.

## Render remote participant video streams

To list the video streams and screen sharing streams of remote participants, inspect the `videoStreams` collections:

```js
const remoteVideoStream: RemoteVideoStream = call.remoteParticipants[0].videoStreams[0];
const streamType: MediaStreamType = remoteVideoStream.mediaStreamType;
```

To render `RemoteVideoStream`, you have to subscribe to it's `isAvailableChanged` event. If the `isAvailable` property changes to `true`, a remote participant is sending a stream. After that happens, create a new instance of `VideoStreamRenderer`, and then create a new `VideoStreamRendererView` instance by using the asynchronous `createView` method.  You can then attach `view.target` to any UI element.

Whenever availability of a remote stream changes you can choose to destroy the whole `VideoStreamRenderer`, a specific `VideoStreamRendererView`
or keep them, but this will result in displaying blank video frame.

```js
subscribeToRemoteVideoStream = async (remoteVideoStream) => {
    // Create a video stream renderer for the remote video stream.
    let videoStreamRenderer = new VideoStreamRenderer(remoteVideoStream);
    let view;
    const remoteVideoContainer = document.getElementById('remoteVideoContainer');
    const renderVideo = async () => {
        try {
            // Create a renderer view for the remote video stream.
            view = await videoStreamRenderer.createView();
            // Attach the renderer view to the UI.
            remoteVideoContainer.appendChild(view.target);
        } catch (e) {
            console.warn(`Failed to createView, reason=${e.message}, code=${e.code}`);
        }
    }
    remoteVideoStream.on('isAvailableChanged', async () => {
        // Participant has switched video on.
        if (remoteVideoStream.isAvailable) {
            await renderVideo();

        // Participant has switched video off.
        } else {
            if (view) {
                view.dispose();
                view = undefined;
            }
        }
    });

    // Participant has video on initially.
    if (remoteVideoStream.isAvailable) {
        await renderVideo();
    }
}
```

### Remote video stream properties

Remote video streams have the following properties:

- `id`: The ID of a remote video stream.

```js
const id: number = remoteVideoStream.id;
```

- `mediaStreamType`: Can be `Video` or `ScreenSharing`.

```js
const type: MediaStreamType = remoteVideoStream.mediaStreamType;
```

- `isAvailable`: Whether a remote participant endpoint is actively sending a stream.

```js
const type: boolean = remoteVideoStream.isAvailable;
```

## VideoStreamRenderer methods and properties
Create a `VideoStreamRendererView` instance that can be attached in the application UI to render the remote video stream, use asynchronous `createView()` method, it resolves when stream is ready to render and returns an object with `target` property that represents `video` element that can be appended anywhere in the DOM tree

```js
await videoStreamRenderer.createView();
```

Dispose of `videoStreamRenderer` and all associated `VideoStreamRendererView` instances:
```js
videoStreamRenderer.dispose();
```

## VideoStreamRendererView methods and properties

When you create a `VideoStreamRendererView`, you can specify the `scalingMode` and `isMirrored` properties. `scalingMode` can be `Stretch`, `Crop`, or `Fit`. If `isMirrored` is specified, the rendered stream is flipped vertically.

```js
const videoStreamRendererView: VideoStreamRendererView = await videoStreamRenderer.createView({ scalingMode, isMirrored });
```
Every `VideoStreamRendererView` instance has a `target` property that represents the rendering surface. Attach this property in the application UI:

```js
htmlElement.appendChild(view.target);
```

You can update `scalingMode` by invoking the `updateScalingMode` method:

```js
view.updateScalingMode('Crop');
```