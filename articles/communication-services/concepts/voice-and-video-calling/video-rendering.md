---
title: QuickStart - Hello Android
description: TODO
author: mariusu-msft
services: azure-communication-services

ms.author: mariusu
ms.date: 07/29/2020
ms.topic: quickstart
ms.service: azure-communication-services

---
# Video rendering

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

## Overview of this article
Video rendering APIs can be divided into 3 groups
 1. Previewing local video
 2. Rendering incoming video
 3. Sharing local video to the call

While the third group is not necessarily related to rendering, it is included here for completeness. We will be discussing all 3 API groups in this articles.

## Previewing local video
Calling SDK allows you to preview local video from a device both inside a call and outside of it in exactly the same way. Previewing video inside a call lets user know what is being sent and previewing outside the context of a call is useful for letting configure your app settings e.g. set default camera.

### Steps for previewing
 1. For previewing, you need to first pick a camera. You can get list of all cameras by using [DeviceManager.getCameraList()](device-manager.md) API which returns objects of type `VideoDeviceInfo`. You can pick `FrontFacing` or `BackFacing` camera by default and let the user switch, this logic is totally dependent on your app's logic.
 2. Open the selected camera by creating instance of `LocalVideoStream` class.
 3. Create a `Renderer` object to start reading frames
 4. Ask `Renderer` to start drawing frames to a surface/view.
### Object model
We will be using following APIs to achieve our goals. Please not the class definitions below are trimmed to show only the relevant APIs. If you are interested in knowing full 
```Java
public enum CameraFacing {
    Front,
    Back
}
public enum ScalingMode {
    Crop,
    Fit
}
public class VideoDeviceInfo {
    public CameraFacing getCameraFacing();
    public String getName();
    public String getId();
}

public class DeviceManager {
    public IReadOnlyList<VideoDeviceInfo> getCameraList();
}

public class LocalVideoStream {
    public LocalVideoStream(VideoDeviceInfo cameraToOpen);
    public void SwitchSource(VideoDeviceInfo newCameraToOpen);
}
public class ACSView extends View {
  public ScalingMode getScalingMode();
  public void setScalingMode();
}
public class Renderer {
    public Renderer(LocalVideoStream streamToRender);
    public ACSView createView();
}
```
## Sample code
```Java
// ... Initialize SDK and get reference to DeviceManager as deviceManager ...

// 1. Get front facing camera
// Get all cameras
VideoDeviceInfo[] allCameras = deviceManager.getCameraList();
// Find front facing camera
VideoDeviceInfo frontFacingCamera = null;
for (VideoDeviceInfo camera : allCameras) {
    if (camera.getFacing() == CameraFacing.Front) {
        frontFacingCamera = camera;
    }
}
if (frontFacingCamera == null) {
    // ... Handle ...
}

// 2. Open camera
LocalVideoStream cameraStream = new LocalVideoStream(frontFacingCamera);

// 3. Create renderer
Renderer renderer = new Renderer(cameraStream);

// 4. Create surface and ask renderer to start drawing on it
ACSView view = renderer.createView();

// ... attach view on your application's UI ...
```

## Rendering incoming video
### Incoming video related events
### Steps for rendering incoming video
### Object model
### Sample code

## Sharing local video to the call
### Object model
### Start and stop video during a call
### Initiate a call with video
### Answering a call with video enabled
