---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-ios.md)]

## Manage devices
To begin using video with Calling, you will need to know how to manage devices. Devices allow you to control what transmits Audio and Video to the call.

`DeviceManager` lets you enumerate local devices that can be used in a call to transmit audio or video streams. It also allows you to request permission from a user to access a microphone or camera. You can access `deviceManager` on the `callClient` object.

```swift
self.callClient!.getDeviceManager { (deviceManager, error) in
        if (error == nil) {
            print("Got device manager instance")
            self.deviceManager = deviceManager
        } else {
            print("Failed to get device manager instance")
        }
    }
```

### Enumerate local devices

To access local devices, you can use enumeration methods on the device manager. Enumeration is a synchronous action.

```swift
// enumerate local cameras
var localCameras = deviceManager.cameras // [VideoDeviceInfo, VideoDeviceInfo...]
```

### Get a local camera preview

You can use `Renderer` to begin rendering a stream from your local camera. This stream won't be sent to other participants; it's a local preview feed. This is an asynchronous action.

```swift
let camera: VideoDeviceInfo = self.deviceManager!.cameras.first!
let localVideoStream = LocalVideoStream(camera: camera)
let localRenderer = try! VideoStreamRenderer(localVideoStream: localVideoStream)
self.view = try! localRenderer.createView()
```

### Get local camera preview properties

The renderer has set of properties and methods that allow you to control the rendering.

```swift
// Constructor can take in LocalVideoStream or RemoteVideoStream
let localRenderer = VideoStreamRenderer(localVideoStream:localVideoStream)
let remoteRenderer = VideoStreamRenderer(remoteVideoStream:remoteVideoStream)

// [StreamSize] size of the rendering view
localRenderer.size

// [VideoStreamRendererDelegate] an object you provide to receive events from this Renderer instance
localRenderer.delegate

// [Synchronous] create view
try! localRenderer.createView()

// [Synchronous] create view with rendering options
try! localRenderer!.createView(withOptions: CreateViewOptions(scalingMode: ScalingMode.fit))

// [Synchronous] dispose rendering view
localRenderer.dispose()
```

## Place a 1:1 call with video
To get a device manager instance, see the section about [managing devices](#manage-devices).

```swift
let firstCamera = self.deviceManager!.cameras.first
self.localVideoStreams = [LocalVideoStream]()
self.localVideoStreams!.append(LocalVideoStream(camera: firstCamera!))
let videoOptions = VideoOptions(localVideoStreams: self.localVideoStreams!)

let startCallOptions = StartCallOptions()
startCallOptions.videoOptions = videoOptions

let callee = CommunicationUserIdentifier('UserId')
self.callAgent?.startCall(participants: [callee], options: startCallOptions) { (call, error) in
    if error == nil {
        print("Successfully started outgoing video call")
        self.call = call
    } else {
        print("Failed to start outgoing video call")
    }
}
```

## Render remote participant video streams

Remote participants can initiate video or screen sharing during a call.

### Handle video-sharing or screen-sharing streams of remote participants

To list the streams of remote participants, inspect the `videoStreams` collections.

```swift
var remoteParticipantVideoStream = call.remoteParticipants[0].videoStreams[0]
```

### Get remote video stream properties

```swift
var type: MediaStreamType = remoteParticipantVideoStream.type // 'MediaStreamTypeVideo'
var isAvailable: Bool = remoteParticipantVideoStream.isAvailable // indicates if remote stream is available
var id: Int = remoteParticipantVideoStream.id // id of remoteParticipantStream
```

### Render remote participant streams

To start rendering remote participant streams, use the following code.

```swift
let renderer = VideoStreamRenderer(remoteVideoStream: remoteParticipantVideoStream)
let targetRemoteParticipantView = renderer?.createView(withOptions: CreateViewOptions(scalingMode: ScalingMode.crop))
// To update the scaling mode later
targetRemoteParticipantView.update(scalingMode: ScalingMode.fit)
```

### Get remote video renderer methods and properties

```swift
// [Synchronous] dispose() - dispose renderer and all `RendererView` associated with this renderer. To be called when you have removed all associated views from the UI.
remoteVideoRenderer.dispose()
```