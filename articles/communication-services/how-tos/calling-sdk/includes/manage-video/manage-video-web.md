---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Device management
To begin using video with the Calling SDK, you need to be able to manage devices. Devices allow you to control what transmits Audio and Video to the call.

With the `deviceManager`, you can enumerate local devices that can transmit your audio and video streams in a call. You can also use the `deviceManager` to request permission to access the local device's microphones and cameras.

You can access `deviceManager` by calling the `callClient.getDeviceManager()` method:

```js
const deviceManager = await callClient.getDeviceManager();
```

### Get local devices

To access local devices, you can use the `deviceManager` enumeration methods `getCameras()` and `getMicrophones`. Those methods are asynchronous actions.

```js
//  Get a list of available video devices for use.
const localCameras = await deviceManager.getCameras(); // [VideoDeviceInfo, VideoDeviceInfo...]

// Get a list of available microphone devices for use.
const localMicrophones = await deviceManager.getMicrophones(); // [AudioDeviceInfo, AudioDeviceInfo...]

// Get a list of available speaker devices for use.
const localSpeakers = await deviceManager.getSpeakers(); // [AudioDeviceInfo, AudioDeviceInfo...]
```

### Set the default devices

Once you know what devices are available to use, you can set default devices for microphone, speaker, and camera. If client defaults aren't set, the Communication Services SDK uses operating system defaults.

#### Microphone

**Access the device used**

```js
// Get the microphone device that is being used.
const defaultMicrophone = deviceManager.selectedMicrophone;
```
**Setting the device to use**

```js
// Set the microphone device to use.
await deviceManager.selectMicrophone(localMicrophones[0]);
```
#### Speaker

**Access the device used**
```js
// Get the speaker device that is being used.
const defaultSpeaker = deviceManager.selectedSpeaker;
```

**Setting the device to use**
```js
// Set the speaker device to use.
await deviceManager.selectSpeaker(localSpeakers[0]);
```

#### Camera

**Access the device used**
```js
// Get the camera device that is being used.
const defaultSpeaker = deviceManager.selectedSpeaker;
```

**Setting the device to use**
```js
// Set the speaker device to use.
await deviceManager.selectSpeaker(localCameras[0]);
```

Each `CallAgent` can choose its own microphone and speakers on its associated `DeviceManager`. We recommend that different `CallAgents` use different microphones and speakers. They shouldn't share the same microphones nor speakers. If sharing happens, then Microphone User Facing Diagnostics might be triggered and the microphone stops working depending on the browser / os.

### Local video stream

To be able to send video in a call, you need to create a `LocalVideoStream`object.

```js
const localVideoStream = new LocalVideoStream(camera);
```

The camera passed as parameter is one of the `VideoDeviceInfo` object returned by the `deviceManager.getCameras()`method.

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

You can use `deviceManager` and `VideoStreamRenderer` to begin rendering streams from your local camera.
Once a `LocalVideoStream` is created, use it to set up`VideoStreamRenderer`. Once the `VideoStreamRenderer`is
created call its `createView()` method to get a view that you can add as a child to your page.

This stream isn't sent to other participants; it's a local preview feed.

```js
// To start viewing local camera preview
const cameras = await deviceManager.getCameras();
const camera = cameras[0];
const localVideoStream = new LocalVideoStream(camera);
const videoStreamRenderer = new VideoStreamRenderer(localVideoStream);
const view = await videoStreamRenderer.createView();
htmlElement.appendChild(view.target);
```

**Stop the local preview**

To stop the local preview call, dispose on the view derived from the `VideoStreamRenderer`. 
Once the VideoStreamRenderer is disposed, remove the view from the html tree by calling 
the `removeChild()` method from the DOM Node containing your preview.

```js
// To stop viewing local camera preview
view.dispose();
htmlElement.removeChild(view.target);
```

### Request permission to camera and microphone

An application can’t use the camera or microphone without permissions.
You can use the deviceManager to prompt a user to grant camera and/or microphone permissions:

```js
const result = await deviceManager.askDevicePermission({audio: true, video: true});
```

Once the promise is resolved, the method returns with a `DeviceAccess` object that indicates whether `audio` and `video` permissions were granted:

```js
console.log(result.audio);
console.log(result.video);
```

#### Notes
- `videoDevicesUpdated` event fires when video devices are plugging-in/unplugged.
- `audioDevicesUpdated` event fires when audio devices are plugged.
- When the DeviceManager is created, at first it doesn't know about any devices if permissions aren't granted yet, so initially its device name is empty and it doesn't contain detailed device information. If we then call the DeviceManager.askPermission() API, the user is prompted for device access. When the user selects on 'allow' to grant the access the device manager learns about the devices on the system, update it's device lists and emit the 'audioDevicesUpdated' and 'videoDevicesUpdated' events. If a user refreshes the page and creates a device manager, the device manager is able to learn about devices because user granted access previously. It has its device lists filled initially and it doesn't emit 'audioDevicesUpdated' nor 'videoDevicesUpdated' events.
- Speaker enumeration/selection isn't supported on Android Chrome, iOS Safari, nor macOS Safari.

## Place a call with video camera

> [!IMPORTANT]
> Currently only one outgoing local video stream is supported.

To place a video call, you have to  enumerate local cameras by using the `getCameras()` method in `deviceManager`.

After you select a camera, use it to construct a `LocalVideoStream` instance. 
Pass it within `videoOptions` as an item within the `localVideoStream` array to the `CallAgent` `startCall` method.

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


### Start video
To start a video while on a call, you have to enumerate cameras using the `getCameras` method on the `deviceManager` object. 
Then create a new instance of `LocalVideoStream` with the desired camera and then pass the `LocalVideoStream` 
object into the `startVideo` method of an existing call object:

```js
const deviceManager = await callClient.getDeviceManager();
const cameras = await deviceManager.getCameras();
const camera = cameras[0]
const localVideoStream = new LocalVideoStream(camera);
await call.startVideo(localVideoStream);
```


### Stop Video

After you successfully start sending video, a `LocalVideoStream` instance of type `Video` is added to the `localVideoStreams` 
collection on a call instance.

**Find the video stream in the Call object**
```js
const localVideoStream = call.localVideoStreams.find( (stream) => { return stream.mediaStreamType === 'Video'} );
```

**Stop the local video**
To stop local video while on a call, pass the `localVideoStream` instance that's being used for video to the stopVideo method of the `Call`:

```js
await call.stopVideo(localVideoStream);
```

You can switch to a different camera device while having an active LocalVideoStream by invoking `switchSource` on that `LocalVideoStream` instance:

```js
const cameras = await callClient.getDeviceManager().getCameras();
const camera = cameras[1];
localVideoStream.switchSource(camera);
```

If the specified video device isn't available:
- While in a call, if your video is off and you start video using `call.startVideo()`, this method throws a `SourceUnavailableError` and `cameraStartFailed` user facing diagnostic is set to true.
- A call to the `localVideoStream.switchSource()` method causes `cameraStartFailed` to be set to true.
Our Call Diagnostics guide provides additional information on how to diagnose call related issues.

To verify if the local video is on or off you can use  the `Call` method `isLocalVideoStarted`, which returns true or false:
```js
// Check if local video is on or off
call.isLocalVideoStarted;
```

To listen for changes to the local video, you can subscribe and unsubscribe to the isLocalVideoStartedChanged event:
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
To start screen sharing while on a call, you can use the asynchronous method `startScreenSharing()` on a `Call` object:
### Start screen sharing
```js
// Start screen sharing
await call.startScreenSharing();
```
Note: Sending screenshare is only supported on desktop browser.

### Find the screen sharing in the collection of LocalVideoStream
After you successfully start sending screen sharing, a `LocalVideoStream` instance of type `ScreenSharing`, is added to the `localVideoStreams` collection on the call instance.
```js
const localVideoStream = call.localVideoStreams.find( (stream) => { return stream.mediaStreamType === 'ScreenSharing'} );
```

### Stop screen sharing
To stop screen sharing while on a call, you can use asynchronous API stoptScreenSharing:
```js
// Stop screen sharing
await call.stopScreenSharing();
```

### Check the screen sharing status
To verify if screen sharing is on or off, you can use isScreenSharingOn API, which returns true or false:
```js
// Check if screen sharing is on or off
call.isScreenSharingOn;
```

To listen for changes to the screen share, you can subscribe and unsubscribe to the isScreenSharingOnChanged event:
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
You can use a `VideoStreamRenderer` to begin rendering streams from your local screen share so you can see what you are sending as a screen sharing stream.

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

To render a remote participant video or screen sharing, the first step is to get a reference on the RemoteVideoStream you want to render.
This can be done by going through the array or video stream (`videoStreams`) of the `RemoteParticipant`. The remote participants collection 
is accessed via the `Call` object.

```js
const remoteVideoStream = call.remoteParticipants[0].videoStreams[0];
const streamType = remoteVideoStream.mediaStreamType;
```

To render `RemoteVideoStream`, you have to subscribe to its `isAvailableChanged` event. If the `isAvailable` property changes to `true`,
a remote participant is sending a video stream. 
After that happens, create a new instance of `VideoStreamRenderer`, and then create a new `VideoStreamRendererView` 
instance by using the asynchronous `createView` method.  
You can then attach `view.target` to any UI element.

Whenever the availability of a remote stream changes, you can destroy the whole `VideoStreamRenderer` or a specific `VideoStreamRendererView`. 
If you decide to keep them, then the view displays a blank video frame.

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

The Azure Communication Services WebJS SDK, provides a feature called Optimal Video Count (OVC), starting in version [1.15.1](https://github.com/Azure/Communication/blob/master/releasenotes/acs-javascript-calling-library-release-notes.md#1153-stable-2023-08-18). 
This feature can be used to inform applications at run-time about how many incoming videos from different participants can be optimally rendered at a given moment in a group call (2+ participants).
This feature exposes a property `optimalVideoCount` that is dynamically changing during the call based on the network and 
hardware capabilities of a local endpoint. The value of `optimalVideoCount` details how many videos from different participant
application should render at a given moment. Applications should handle these changes and update number of rendered videos
accordingly to the recommendation. There's a debounce period (around 10 s) between each update.

**Usage**
The `optimalVideoCount` feature is a call feature. You need to reference the feature `OptimalVideoCount` via the `feature` method of the `Call` object. You can then set a listener via the `on` method of the `OptimalVideoCountCallFeature` to be notified when the optimalVideoCount changes. To unsubscribe from the changes, you can call the `off` method.

```javascript
const optimalVideoCountFeature = call.feature(Features.OptimalVideoCount);
optimalVideoCountFeature.on('optimalVideoCountChanged', () => {
    const localOptimalVideoCountVariable = optimalVideoCountFeature.optimalVideoCount;
})
```

Example usage: Application should subscribe to changes of Optimal Video Count in group calls. A change in the optimal video count can be handled
by either creating new renderer (`createView` method) or dispose views (`dispose`) and update the application layout accordingly.

### Remote video stream properties

Remote video streams have the following properties:

```js
const id: number = remoteVideoStream.id;
```
- `id`: The ID of a remote video stream.

```js
const type: MediaStreamType = remoteVideoStream.mediaStreamType;
```
- `mediaStreamType`: Can be `Video` or `ScreenSharing`.

```js
const isAvailable: boolean = remoteVideoStream.isAvailable;
```

- `isAvailable`: Defines whether a remote participant endpoint is actively sending a stream.

```js
const isReceiving: boolean = remoteVideoStream.isReceiving;
```

- `isReceiving`:
  - Informs the application if remote video stream data is being received or not.
  - The flag moves to `false` in the following scenarios:
    - A remote participant who is on mobile browser brings the browser app to the background. 
    - A remote participant or the user receiving the video has network issue that affects video quality drastically.
    - A remote participant who is On macOS/iOS Safari selects  "Pause" from their address bar.
    - A remote participant has a network disconnection. 
    - A remote participant on mobile kills or terminate the browser. 
    - A remote participant on mobile or desktop locks its device. This scenario applies also if the remote participant is on a desktop computer and it goes to sleep.

  - The flag moves to `true` in the following scenarios:
    - A remote participant who is on mobile browser and has its browser backgrounded brings it back to foreground.
    - A remote participant who is On macOS/iOS Safari selects on "Resume" from their address bar after having paused its video.
    - A remote participant reconnects to the network after a temporary disconnection.
    - A remote participant on mobile unlock its device and return to the call on its mobile browser.
        
  - This feature improves the user experience for rendering remote video streams.
  - You can display a loading spinner over the remote video stream when isReceiving flag changes to false. You don't have to implement loading spinner, but a loading spinner is the most common usage for better user experience.

```js
const size: StreamSize = remoteVideoStream.size;
```

- `size`: The stream size with information about the width and height of the video.

## VideoStreamRenderer methods and properties

```js
await videoStreamRenderer.createView();
```

Create a `VideoStreamRendererView` instance that can be attached in the application UI to render the remote video stream,
use asynchronous `createView()` method, it resolves when stream is ready to render and returns an object with `target`
property that represents `video` element that can be inserted anywhere in the DOM tree.

```js
videoStreamRenderer.dispose();
```
Dispose of `videoStreamRenderer` and all associated `VideoStreamRendererView` instances.

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

## Send video streams from two different cameras, in the same call from the same desktop device.
[!INCLUDE [Public Preview Disclaimer](../../../../includes/public-preview-include.md)]
Send video streams from two different cameras in the same call is supported as part of version 1.17.1-beta.1+ on desktop supported browsers.
- You can send video streams from two different cameras from a single desktop browser tab/app, in the same call, with the following code snippet:
```js
// Create your first CallAgent with identity A
const callClient1 = new CallClient();
const callAgent1 = await callClient1.createCallAgent(tokenCredentialA);
const deviceManager1 = await callClient1.getDeviceManager();

// Create your second CallAgent with identity B
const callClient2 = new CallClient();
const callAgent2 = await callClient2.createCallAgent(tokenCredentialB);
const deviceManager2 = await callClient2.getDeviceManager();

// Join the call with your first CallAgent
const camera1 = await deviceManager1.getCameras()[0];
const callObj1 = callAgent1.join({ groupId: ‘123’}, { videoOptions: { localVideoStreams: [new LocalVideoStream(camera1)] } });

// Join the same call with your second CallAgent and make it use a different camera
const camera2 = (await deviceManager2.getCameras()).filter((camera) => { return camera !== camera1 })[0];
const callObj2 = callAgent2.join({ groupId: '123' }, { videoOptions: { localVideoStreams: [new LocalVideoStream(camera2)] } });

//Mute the microphone and speakers of your second CallAgent’s Call, so that there is no echos/noises.
await callObj2.muteIncomingAudio();
await callObj2.mute();
```
Limitations:
- This must be done with two different `CallAgent` instances using different identities. The code snippet shows two call agents being used, each with its own Call object.
- In the code example, both CallAgents are joining the same call (same call Ids). You can also join different calls with each agent and send one video on one call and a different video on the other call. 
- Sending the same camera in both CallAgent, isn't supported. They must be two different cameras.
- Sending two different cameras with one CallAgent is currently not supported.
- On macOS Safari, background blur video effects (from @azure/communication-effects), can only be applied to one camera, and not both at the same time.
