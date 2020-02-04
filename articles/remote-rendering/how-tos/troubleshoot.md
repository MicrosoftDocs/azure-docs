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

In case rendered objects seem to be moving along with head movements, that is, they seem to wobble, you might be encountering issues with Late Stage Reprojection. Refer to the section on [Late Stage Reprojection](../sdk/concepts-late-stage-reprojection.md) for guidance on how to approach such a situation.
