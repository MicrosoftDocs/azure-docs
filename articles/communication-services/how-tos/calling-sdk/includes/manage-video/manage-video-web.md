---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Device management
To begin using video with Calling, you need to know how to manage devices. Devices allow you to control what transmits Audio and Video to the call.

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

In `deviceManager`, you can set a default device that you use to start a call. If client defaults aren't set, Communication Services uses operating system defaults.

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

### Local video stream properties

A `LocalVideoStream` has the following properties:

- `source`: The device information.

```js
const source = localVideoStream.source;
```

- `mediaStreamType`: Can be `Video`, `ScreenSharing`, or `RawMedia`.

```js
const type: MediaStreamType = localVideoStream.mediaStreamType;
```

### Local camera preview

You can use `deviceManager` and `VideoStreamRenderer` to begin rendering streams from your local camera. This stream won't be sent to other participants; it's a local preview feed.

```js
// To start viewing local camera preview
const cameras = await deviceManager.getCameras();
const camera = cameras[0];
const localVideoStream = new LocalVideoStream(camera);
const videoStreamRenderer = new VideoStreamRenderer(localVideoStream);
const view = await videoStreamRenderer.createView();
htmlElement.appendChild(view.target);

// To stop viewing local camera preview
view.dispose();
htmlElement.removeChild(view.target);
```

### Request permission to camera and microphone

Prompt a user to grant camera and/or microphone permissions:

```js
const result = await deviceManager.askDevicePermission({audio: true, video: true});
```

The output returns with an object that indicates whether `audio` and `video` permissions were granted:

```js
console.log(result.audio);
console.log(result.video);
```
#### Notes
- The 'videoDevicesUpdated' event fires when video devices are plugging-in/unplugged.
- The 'audioDevicesUpdated' event fires when audio devices are plugged
- When the DeviceManager is created, at first it doesn't know about any devices if permissions haven't been granted yet so initially its device list will be empty. If we then call the DeviceManager.askPermission() API, the user is prompted for device access. When the user clicks on 'allow' to grant the access the device manager learns about the devices on the system, update it's device lists and emit the 'audioDevicesUpdated' and 'videoDevicesUpdated' events. If a user refreshes the page and creates a device manager, the device manager will be able to learn about devices because user has already previously granted access, and so it will initially it will have its device lists filled and it will not emit 'audioDevicesUpdated' nor 'videoDevicesUpdated' events.
- Speaker enumeration/selection isn't supported on Android Chrome, iOS Safari, nor macOS Safari.

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

After you successfully start sending video, a `LocalVideoStream` instance of type `Video` is added to the `localVideoStreams` collection on a call instance.

```js
const localVideoStream = call.localVideoStreams.find( (stream) => { return stream.mediaStreamType === 'Video'} );
```

To stop local video while on a call, pass the `localVideoStream` instance that's being used for video:

```js
await call.stopVideo(localVideoStream);
```

You can switch to a different camera device while a video is sending by invoking `switchSource` on a `localVideoStream` instance:

```js
const cameras = await callClient.getDeviceManager().getCameras();
const camera = cameras[1];
localVideoStream.switchSource(camera);
```

If the specified video device is being used by another process, or if it's disabled in the system:
- While in a call, if your video is off and you start video using `call.startVideo()`, this method throws a `SourceUnavailableError` and `cameraStartFiled` will be set to true.
- A call to the `localVideoStream.switchSource()` method causes `cameraStartFailed` to be set to true.
Our Call Diagnostics guide provides additional information on how to diagnose call related issues.

To verify if the local video is on or off you can use isLocalVideoStarted API, which returns true or false:
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
To start screen sharing while on a call, you can use asynchronous API startScreenSharing:
```js
// Start screen sharing
await call.startScreenSharing();
```

After you successfully start sending screen sharing, a `LocalVideoStream` instance of type `ScreenSharing`, is added to the `localVideoStreams` collection on the call instance.
```js
const localVideoStream = call.localVideoStreams.find( (stream) => { return stream.mediaStreamType === 'ScreenSharing'} );
```

To stop screen sharing while on a call, you can use asynchronous API stoptScreenSharing:
```js
// Stop screen sharing
await call.stopScreenSharing();
```

To verify if screen sharing is on or off, you can use isScreenSharingOn API, which returns true or false:
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

[!INCLUDE [Public Preview Disclaimer](../../../../includes/public-preview-include.md)]
Local screen share preview is in public preview and available as part of version 1.15.1-beta.1+.
### Local screen share preview
You can use `VideoStreamRenderer` to begin rendering streams from your local screen share so you can see what you are sending as a screen sharing stream.
```js
// To start viewing local screen share preview
await call.startScreenSharing();
const localScreenSharingStream = call.localVideoStreams.find( (stream) => { return stream.mediaStreamType === 'ScreenSharing' });
const videoStreamRenderer = new VideoStreamRenderer(localScreenSharingStream);
const view = await videoStreamRenderer.createView();
htmlElement.appendChild(view.target);

// To stop viewing local screen share preview.
await call.stopScreenSharing();
view.dispose();
htmlElement.removeChild(view.target);

// Screen sharing can also be stoped by clicking on the native browser's "Stop sharing" button.
// The isScreenSharingOnChanged event will be triggered where you can check the value of call.isScreenSharingOn.
// If the value is false, then that means screen sharing is turned off and so we can go ahead and dispose the screen share preview.
// This event is also triggered for the case when stopping screen sharing via Call.stopScreenSharing() API.
call.on('isScreenSharingOnChanged', () => {
    if (!call.isScreenSharingOn) {
        view.dispose();
        htmlElement.removeChild(view.target);
    }
});
```

## Render remote participant video/screensharing streams

To list the video streams and screen sharing streams of remote participants, inspect the `videoStreams` collections:

```js
const remoteVideoStream: RemoteVideoStream = call.remoteParticipants[0].videoStreams[0];
const streamType: MediaStreamType = remoteVideoStream.mediaStreamType;
```

To render `RemoteVideoStream`, you have to subscribe to its `isAvailableChanged` event. If the `isAvailable` property changes to `true`, a remote participant is sending a stream. After that happens, create a new instance of `VideoStreamRenderer`, and then create a new `VideoStreamRendererView` instance by using the asynchronous `createView` method.  You can then attach `view.target` to any UI element.

Whenever availability of a remote stream changes, you can destroy the whole `VideoStreamRenderer` or a specific `VideoStreamRendererView`. If you do decided to keep them will result in displaying blank video frame.

```js
// Reference to the html's div where we would display a grid of all remote video stream from all participants.
let remoteVideosGallery = document.getElementById('remoteVideosGallery');

subscribeToRemoteVideoStream = async (remoteVideoStream) => {
   let renderer = new VideoStreamRenderer(remoteVideoStream);
    let view;
    let remoteVideoContainer = document.createElement('div');
    remoteVideoContainer.className = 'remote-video-container';

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

### Remote video quality

Starting from 1.12(beta) version, the ACS WebJS SDK provides a new feature called OptimalVideoCount (OVC). This feature can be used to inform applications at run-time how many videos from different participants can be optimally rendered at a given moment in a group call (2+ participants). This feature exposes a property `optimalVideoCount` that is dynamically changing during the call based on the network and hardware capabilities of a local endpoint. The value of `optimalVideoCount` details how many videos from different participants application should render at a given moment. Application should handle these changes and update number of rendered videoes accordingly to the recommendation. There's a cooldown period (around 10s), between updates that to avoid too frequent of changes.

**Usage**
The `optimalVideoCount` feature is a call feature
```typescript
interface OptimalVideoCountCallFeature extends CallFeature {
    off(event: 'optimalVideoCountChanged', listener: PropertyChangedEvent): void;
    on(event: 'optimalVideoCountChanged', listener: PropertyChangedEvent): void;
    readonly optimalVideoCount: number;
}

const optimalVideoCountFeature = call.feature(Features.OptimalVideoCount);
optimalVideoCountFeature.on('optimalVideoCountChanged', () => {
    const localOptimalVideoCountVariable = optimalVideoCountFeature.optimalVideoCount;
})
```

Example usage: Application should subscribe to changes of OVC and handle it in group calls by either creating new renderer (`createView` method) or dispose views (`dispose`)
and update layout accordingly either by removing participants from the main call screen area (often called stage or roster ) or replacing their video elements with an avatar and a name of the user.


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

- `isAvailable`: Defines whether a remote participant endpoint is actively sending a stream.

```js
const isAvailable: boolean = remoteVideoStream.isAvailable;
```

- `isReceiving`:
    - Will inform the application if remote video stream data is being received or not. Such scenarios are:
        - I am viewing the video of a remote participant who is on mobile browser. The remote participant brings the mobile browser app to the background. I now see the RemoteVideoStream.isReceiving flag goes to false and I see their video with black frames / frozen. When the remote participant brings the mobile browser back to the foreground, I now see the RemoteVideoStream.isReceiving flag to back to true, and I see their video playing normally.
        - I am viewing the video of a remote participant who is on whatever platforms. There are network issues from either side, their video start to have bad quality, probably because of network issues, so I see the RemoteVideoStream.isReceiving flag goes to false.
        - I am viewing the video of a Remote participant who is On MacOS/iOS Safari, and from their address bar, they click on "Pause" / "Resume" camera. I see a black/frozen video since they paused their camera and I see the RemoteVideoStream.isReceiving flag goes to false. Once they resume playing the camera, then I see the RemoteVideoStream.isReceiving flag goes to true.
        - I am viewing the video of a remote participant who in on whatever platform. And for whatever reason their network disconnects. This will actually leave the remote participant in the call for a little while and I see their video frozen/black frame, and see RemoteVideoStream.isReceiving flag goes to false. The remote participant can get network back and reconnect and their audio/video should start flowing normally and I see the RemoteVideoStream.isReceiving flag to true.
        - I am viewing the video of a remote participant who is on mobile browser. The remote participant terminates/kills the mobile browser. Since that remote participant was on mobile, this will actually leave the participant in the call for a little while and I will still see them on the call and their video will be frozen, and so I  see the RemoteVideoStream.isReceiving flag goes to false. At some point, service will kick participant out of the call and I would just see that the participant disconnected from the call.
        - I am viewing the video of a remote participant who is on mobile browser and they lock the device. I see the RemoteVideoStream.isReceiving flag goes to false. Once the remote participant unlocks the device and navigates to the acs call, then ill see the flag go back to true. Same behavior when remote participant is on desktop and the desktop locks/sleeps
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
