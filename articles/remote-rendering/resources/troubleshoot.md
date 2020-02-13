---
title: Troubleshoot
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

# Troubleshoot

This article has a few guidelines to troubleshoot problems that may occur on the client side when using the Remote Rendering service.

## Low video quality

The video quality can be compromised either by network quality or the missing H265 video codec.

## Black screen after successful model loading

If you are connected to the rendering runtime and loaded a model successfully, but only see a black screen afterwards, then this can have a few distinct causes.

As a rule of thumb, we recommend testing the following two things before doing a more in-depth analysis:

* Is the H265 codec installed?
Albeit there should be a fallback to the H264 codec, we have seen cases where this fallback did not work properly.
* When using a Unity project, close Unity, delete the temporary *library* and *obj* folders in the project directory and load/build the project again. In some cases cached data caused the sample to not function properly for no obvious reason.

If these two steps did not help, it is required to find out whether video frames are received by the client or not. This can be queried programmatically as explained in the [server-side performance queries](../overview/features/performance-queries.md) chapter. The `FrameStatistics struct` has a member that indicates how many video frames have been received. If this number is larger than 0 and increasing over time, the client receives actual video frames from the server. Accordingly it must be a problem on the client side.

Common client-side issues are listed here:

### Is the model inside view frustum?

In many cases, the model is displayed correctly but located in a place outside the current camera frustum. A reason for that can be that the model has been exported with a far off-center pivot so it is clipped by the camera's far clipping plane. It helps to query the model's bounding box programmatically and visualize the box with Unity as a line box.

### Does the Unity render pipeline include the render hooks?

The remote rendering hooks into the Unity render pipeline to do the frame composition with the video and to do the reprojection. To verify, open menu `Window > Analysis > Frame debugger`. Enable it and make sure there are two entries for `HolographicRemotingCallbackPass` in the pipeline:
![Unity frame debugger](./media/troubleshoot-unity-pipeline.png)

## Unstable Holograms

In case rendered objects seem to be moving along with head movements, that is, they seem to wobble, you might be encountering issues with Late Stage Reprojection. Refer to the section on [Late Stage Reprojection](../overview/features/late-stage-reprojection.md) for guidance on how to approach such a situation.

Another reason for unstable holograms (wobbling, warping, jittering, or jumping holograms) can be poor network connectivity, in particular insufficient network bandwidth, or too high latency. A good indication for the quality of your network connection is the [performance statistics](../overview/features/performance-queries.md) value `ARRServiceStats.VideoFramesReused`. Reused frames indicate situations where an old video frame needed to be reused on the client side because no new video frame was available – for example because of packet loss or because of variations in network latencies. If `ARRServiceStats.VideoFramesReused` is often or even consistently higher than 0, this indicates a network problem.

Another value to look at is `ARRServiceStats.LatencyPoseToReceiveAvg`. This value should consistently be below 100 ms. If you see significantly higher values, this indicates that you are connected to a data center that is too far away.

Possible mitigations are:
* Make sure your network connectivity matches the criteria outlined in [Guidelines for network connectivity](../reference/network-requirements#guidelines-for-network-connectivity)
* Make sure that you are connected to the closest Azure data center offered by Azure Remote Rendering. 
* Make sure your Wi-Fi network has good signal strength at the place where you are using your client device. If you have a large distance or obstacles such as walls between your client device and the Wi-Fi access point, move the device closer to the Wi-Fi access point.
* Verify that your Wi-Fi network is not using channels that overlap with other Wi-Fi networks. You can use a tool like [WifiInfoView](https://www.nirsoft.net/utils/wifi_information_view.html) to validate this.
* Check if you are on the 5-GHz Wi-Fi band. If not, switch to the 5-GHz band.
* Make sure you are not connecting through a Wi-Fi repeater or a LAN-over-powerline forwarding.
* Make sure you don’t have bandwidth-intense competing traffic on your network.
