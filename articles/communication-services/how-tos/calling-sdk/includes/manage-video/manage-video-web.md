---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
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
const localVideoStream = new LocalVideoStream(camera);
const videoStreamRenderer = new VideoStreamRenderer(localVideoStream);
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
- When the DeviceManager is created, at first it does not know about any devices if permissions have not been granted yet, and so initially its device list is empty. If we then call the DeviceManager.askPermission() API, the user is prompted for device access and if the user clicks on 'allow' to grant the access, then the device manager will learn about the devices on the system, update it's device lists and emit the 'audioDevicesUpdated' and 'videoDevicesUpdated' events. Lets say we then refresh the page and create device manager, the device manager will be able to learn about devices because user has already previously granted access, and so it will initially it will have it's device lists filled and it will not emit 'audioDevicesUpdated' nor 'videoDevicesUpdated' events.
- Speaker enumeration/selection is not supported on Android Chrome, iOS Safari, nor macOS Safari.

## Place a call with video camera

> [!IMPORTANT]
> Currently only one outgoing local video stream is supported.

To place a video call, you have to  enumerate local cameras by using the `getCameras()` method in `deviceManager`.

After you select a camera, use it to construct a `LocalVideoStream` instance. Pass it within `videoOptions` as an item within the `localVideoStream` array to the `startCall` method.

```js
const deviceManager = await callClient.getDeviceManager();
const cameras = await deviceManager.getCameras();
const camera = cameras[0]
const localVideoStream = new LocalVideoStream(camera);
const placeCallOptions = {videoOptions: {localVideoStreams:[localVideoStream]}};
const userCallee = { communicationUserId: '<ACS_USER_ID>' }
const call = callAgent.startCall([userCallee], placeCallOptions);
```
- You can also join a call with video with `CallAgent.join()` API, and accept and call with video with `Call.Accept()` API.
- When your call connects, it automatically starts sending a video stream from the selected camera to the other participant.

## Start and stop sending local video while on a call

To start a video while on a call, you have to enumerate cameras using the `getCameras` method on the `deviceManager` object. Then create a new instance of `LocalVideoStream` with the desired camera and then pass the `LocalVideoStream` object into the `startVideo` method of an existing call object:

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

To stop local video while on a call, pass the `localVideoStream` instance that's available in the `localVideoStreams` collection:

```js
await call.stopVideo(localVideoStream);
// or
await call.stopVideo(call.localVideoStreams[0]);
```

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

To check or verify if the local video is on or off, you can use isLocalVideoStarted API, which returns true or false:
```js
// Check if local video is on or off
call.isLocalVideoStarted;
```

To listen for changes to the local video, you can subscribe and unsubscribe to the isLocalVideoStartedChanged event
```js
// Subscribe to local video event
call.on('isLocalVideoStartedChanged', () => {
    // Callback();
});
// Unsubscribe from local video event
call.off('isLocalVideoStartedChanged', () => {
    // Callback();
});
```



## Start and stop screen sharing while on a call
To start and stop screen sharing while on a call, you can use asynchronous APIs startScreenSharing and stopScreenSharing respectively:

```js
// Start screen sharing
await call.startScreenSharing();

// Stop screen sharing
await call.stopScreenSharing();
```

To check or verify if screen sharing is on or off, you can use isScreenSharingOn API which returns true or false:
```js
// Check if screen sharing is on or off
call.isScreenSharingOn;
```

To listen for changes to the screen share, you can subscribe and unsubscribe to the isScreenSharingOnChanged event
```js
// Subscribe to screen share event
call.on('isScreenSharingOnChanged', () => {
    // Callback();
});
// Unsubscribe from screen share event
call.off('isScreenSharingOnChanged', () => {
    // Callback();
});
```

## Render remote participant video streams

To list the video streams and screen sharing streams of remote participants, inspect the `videoStreams` collections:

```js
const remoteVideoStream: RemoteVideoStream = call.remoteParticipants[0].videoStreams[0];
const streamType: MediaStreamType = remoteVideoStream.mediaStreamType;
```

To render `RemoteVideoStream`, you have to subscribe to it's `isAvailableChanged` event. If the `isAvailable` property changes to `true`, a remote participant is sending a stream. After that happens, create a new instance of `VideoStreamRenderer`, and then create a new `VideoStreamRendererView` instance by using the asynchronous `createView` method.  You can then attach `view.target` to any UI element.

Whenever availability of a remote stream changes, you can choose to destroy the whole `VideoStreamRenderer`, a specific `VideoStreamRendererView`
or keep them, but this will result in displaying blank video frame.

```js
// Reference to the html's div where we would display a grid of all remote video stream from all participants.
let remoteVideosGallery = document.getElementById('remoteVideosGallery');

subscribeToRemoteVideoStream = async (remoteVideoStream) => {
   let renderer = new VideoStreamRenderer(remoteVideoStream);
    let view;
    let remoteVideoContainer = document.createElement('div');
    remoteVideoContainer.className = 'remote-video-container';

    /**
     * isReceiving API is currently an @beta feature.
     * To use this api please use 'beta' version of Azure Communication Services Calling Web SDK.
     */
    let loadingSpinner = document.createElement('div');
    // See the css example below for styling the loading spinner.
    loadingSpinner.className = 'loading-spinner';
    remoteVideoStream.on('isReceivingChanged', () => {
        try {
            if (remoteVideoStream.isAvailable) {
                const isReceiving = remoteVideoStream.isReceiving;
                const isLoadingSpinnerActive = remoteVideoContainer.contains(loadingSpinner);
                if (!isReceiving && !isLoadingSpinnerActive) {
                    remoteVideoContainer.appendChild(loadingSpinner);
                } else if (isReceiving && isLoadingSpinnerActive) {
                    remoteVideoContainer.removeChild(loadingSpinner);
                }
            }
        } catch (e) {
            console.error(e);
        }
    });

    const createView = async () => {
        // Create a renderer view for the remote video stream.
        view = await renderer.createView();
        // Attach the renderer view to the UI.
        remoteVideoContainer.appendChild(view.target);
        remoteVideosGallery.appendChild(remoteVideoContainer);
    }

    // Remote participant has switched video on/off
    remoteVideoStream.on('isAvailableChanged', async () => {
        try {
            if (remoteVideoStream.isAvailable) {
                await createView();
            } else {
                view.dispose();
                remoteVideosGallery.removeChild(remoteVideoContainer);
            }
        } catch (e) {
            console.error(e);
        }
    });

    // Remote participant has video on initially.
    if (remoteVideoStream.isAvailable) {
        try {
            await createView();
        } catch (e) {
            console.error(e);
        }
    }
    
    console.log(`Initial stream size: height: ${remoteVideoStream.size.height}, width: ${remoteVideoStream.size.width}`);
    remoteVideoStream.on('sizeChanged', () => {
        console.log(`Remote video stream size changed: new height: ${remoteVideoStream.size.height}, new width: ${remoteVideoStream.size.width}`);
    });
}
```

CSS for styling the loading spinner over the remote video stream.
 ```css
.remote-video-container {
    position: relative;
}
.loading-spinner {
    border: 12px solid #f3f3f3;
    border-radius: 50%;
    border-top: 12px solid #ca5010;
    width: 100px;
    height: 100px;
    -webkit-animation: spin 2s linear infinite; /* Safari */
    animation: spin 2s linear infinite;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    transform: translate(-50%, -50%);
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
/* Safari */
@-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
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
const isAvailable: boolean = remoteVideoStream.isAvailable;
```

- `isReceiving`:

    > [!NOTE]
    > This API is provided as a preview for developers and may change based on feedback that we receive. To use this api please use 1.5.4-beta.1+ release of Azure Communication Services Calling Web SDK
    - Will inform the application if remote video stream data is being received or not. Such scenarios are:
        - I am viewing the video of a remote participant who is on mobile browser. The remote participant brings the mobile browser app to the background. I now see the RemoteVideoStream.isReceiving flag goes to false and I see his video with black frames / frozen. When the remote participant brings the mobile browser back to the foreground, I now see the RemoteVideoStream.isReceiving flag to back to true, and I see his video playing normally.
        - I am viewing the video of a remote participant who is on whatever platforms. There are network issues from either side, his video start to look pretty laggy, bad quality, probbaly because of network issues, so I see the RemoteVideoStream.isReceiving flag goes to false.
        - I am viewing the video of a Remote participant who is On MacOS/iOS Safari, and from their address bar, they click on "Pause" / "Resume" camera. I'll see a black/frozen video since they paused their camera and I'll see the RemoteVideoStream.isReceiving flag goes to false. Once they resume playing the camera, then I'll see the RemoteVideoStream.isReceiving flag goes to true.
        - I am viewing the video of a remote participant who in on whatever platform. And for whatever reason their network disconnects. This will actually leave the remote participant in the call for a little while and I'll see his video frozen/black frame, and ill see RemoteVideoStream.isReceiving flag goes to false. The remote participant can get network back and reconnect and his audio/video should start flowing normally and I'll see the RemoteVideoStream.isReceiving flag to true.
        - I am viewing the video of a remote participant who is on mobile browser. The remote participant terminates/kills the mobile browser. Since that remote participant was on mobile, this will actually leave the participant in the call for a little while and I will still see him in the call and his video will be frozen, and so I'll see the RemoteVideoStream.isReceiving flag goes to false. At some point, service will kick participant out of the call and I would just see that the participant disconnected from the call.
        - I am viewing the video of a remote participant who is on mobile browser and they locks device. I'll see the RemoteVideoStream.isReceiving flag goes to false and. Once the remote participant unlocks the device and navigates to the acs call, then ill see the flag go back to true. Same behavior when remote participant is on desktop and the desktop locks/sleeps
    - This feature improves the user experience for rendering remote video streams.
    - You can display a loading spinner over the remote video stream when isReceiving flag changes to false. You don't have to do a loading spinner, you can do anything you desire, but a loading spinner is the most common usage for better user experience.
```js
const isReceiving: boolean = remoteVideoStream.isReceiving;
```

- `size`: The stream size. The higher the stream size, the better the video quality.

```js
const size: StreamSize = remoteVideoStream.size;
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
