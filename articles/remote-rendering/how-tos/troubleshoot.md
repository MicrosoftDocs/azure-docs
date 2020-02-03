---
title: Troubleshooting guide
description: Troubleshooting on client side
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 01/29/2020
ms.topic: troubleshooting
ms.service: azure-remote-rendering
---

# Troubleshooting

This article has a few guidelines to troubleshoot problems that may occur on the client side when using the Remote Rendering service.

## Low video quality

The video quality can be compromised either by network quality or the missing H265 video codec.

## Black screen after successful model loading

If you are connected to the rendering runtime and loaded a model successfully, but only see a black screen afterwards, then this can have a few distinct causes.

As a rule of thumb, we recommend testing the following two things before doing a more in-depth analysis:

* Is the H265 codec installed?
Albeit there should be a fallback to the H264 codec, we have seen cases where this fallback did not work properly.
* When using a Unity project, close Unity, delete the temporary *library* and *obj* folders in the project directory and load/build the project again. In some cases cached data caused the sample to not function properly for no obvious reason.

If these two steps did not help, it is required to find out whether video frames are received by the client or not. This can be queried programmatically. The `FrameStatistics struct` has a member that indicates how many video frames have been received. If this number is larger than 0 and increasing over time, the client receives actual video frames from the server. Accordingly it must be a problem on the client side.

Common client-side issues are listed here:

### Is the model inside view frustum?

In many cases, the model is displayed correctly but located in a place outside the current camera frustum. A reason for that can be that the model has been exported with a far off-center pivot so it is clipped by the camera's far clipping plane. It helps to query the model's bounding box programmatically and visualize the box with Unity as a line box.

### Does the Unity render pipeline include the render hooks?

The remote rendering hooks into the Unity render pipeline to do the frame composition with the video and to do the reprojection. To verify, open menu `Window > Analysis > Frame debugger`. Enable it and make sure there are two entries for `HolographicRemotingCallbackPass` in the pipeline:
![Unity frame debugger](./media/troubleshoot-unity-pipeline.png)

## Unstable Holograms

Static models are expected to visually maintain their position when you start moving around them. That is, they should look as though they're rigidly fixed to their surrounding. If they instead seem to be leaving their position or are otherwise wobbling, this behavior may hint at issues with Late Stage Reprojection (LSR). Mind that additional dynamic transformations, like animations or explosion views, might mask this behavior.

LSR is essential for maintaining a steady frame and avoiding the above artifacts. In general, you may choose between two different modes, namely Planar or Depth LSR. Which one is active is determined by whether your Unity application has  depth buffer sharing enabled in its Player Settings or not. To check if it's active go to `File > Build Settings` from the Unity Editor, click on `Player Settings` in the lower left, and then check under `Player > XR Settings > Virtual Reality SDKs > Windows Mixed Reality` if `Enable Depth Buffer Sharing` is checked (see below image). If it is, your app will be using Depth LSR, while it will be using Planar LSR otherwise.

Both LSR modes are striving to improve Hologram stability, although they come with their distinct limitations. Generally, you should start by trying Depth LSR as it is arguably giving better results in most use cases.

![Depth Buffer Sharing Enabled flag](./media/unity-depth-buffer-sharing-enabled.png)

### Depth LSR

For Depth LSR to work, you must supply a valid depth buffer that contains all the relevant geometry to consider during LSR. Unity will automatically supply a depth buffer for you when depth buffer sharing is enabled (see above). So just make sure to render the scene as intended.

Generally, Depth LSR attempts to stabilize the video frame based on the data available in the supplied depth buffer. As a consequence, content that hasn't been rendered to it, such as labels or transparent objects, is still subject to reprojection artifacts.

### Planar LSR

If using Planar LSR, you must supply the parameters of a plane that is then going to be used during LSR. This step is mandatory from the moment you uncheck the depth buffer sharing flag as mentioned above. It must be done every frame by using the [Unity Focus Point API](https://docs.microsoft.com/en-us/windows/mixed-reality/focus-point-in-unity). The plane is defined by a so-called *focus point*. You provide it by calling to `UnityEngine.XR.WSA.HolographicSettings.SetFocusPointForFrame` supplying a position, normal, and velocity. The last two parameters are optional and will be filled in for you if you don't supply them. If you do not set a focus point at all, a fallback will be chosen.

You can calculate the focus point all by yourself. However, it might make sense to base it on the one calculated by the Remote Rendering host, that is, the remote focus point. To obtain it, you call to `RemoteManagerUnity.CurrentSession.GraphicsBinding.GetRemoteFocusPoint`. Usually both sides, that is, the client and the host, usually render content the other side isn't aware of. As a result, it might often make sense to consider combining a remote focus point with a locally calculated one.

Planar LSR will reproject those objects best that lie within the supplied plane. The further away an object lies from the plane, however, the more unstable it will look. While Depth LSR better reprojects objects at different depth, Planar LSR might be beneficial given the content you render.

