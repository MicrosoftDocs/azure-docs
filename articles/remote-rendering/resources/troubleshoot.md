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

## H265 codec not available

There are two reasons why the server might refuse to connect with a 'codec not available' error.
* **The H265 codec is not installed.** Refer to [system requirements](../overview/system-requirements.md#development-pc) for installing latest graphics driver.
* **The codec is installed, but cannot be used.** The reason for this is wrong security settings on the dlls. This problem does not manifest when trying to watch videos encoded with H265. Furthermore, reinstalling the codec does not fix this either. To fix this problem for Remote Rendering, perform the following steps:
   1. **Find out the dll location of the codec.** For that, open a **PowerShell console in admin** mode and run
   ```PowerShell
   Get-AppxPackage -Name Microsoft.HEVCVideoExtension
   ```
   That should output the ```InstallLocation```, something like:
   ```cmd
   InstallLocation   : C:\Program Files\WindowsApps\Microsoft.HEVCVideoExtension_1.0.23254.0_x64__5wasdgertewe
   ```
   Go into that folder in file explorer.

   2. There should be a **x86** and a **x64** subfolder. Click on both folders individually with the right mouse button, and choose **Properties** from the context menu. Move to the **Security** tab and click the **Advanced** settings button. There, click **Change** for the **Owner**, type in **Administrators** in the text field, click **Check Names** and **OK**.
   1. Repeat the steps above now on each dll file individually inside the **x86** and **x64** folder (it should be four dlls altogether).
   1. To verify that the settings are now correct, select **Properties->Security->Edit** for each of the four dlls. Go through the list of all **Groups / Users** and make sure each one has the **Read & execute** right set (checkmark in the **allow** column must be ticked).

## Low video quality

The video quality can be compromised either by network quality or the missing H265 video codec.
* See steps to [identify network problems](#unstable-holograms).
* See [system requirements](../overview/system-requirements.md#development-pc) for installing latest graphics driver.

## Black screen after successful model loading

If you are connected to the rendering runtime and loaded a model successfully, but only see a black screen afterwards, then this can have a few distinct causes.

As a rule of thumb, we recommend testing the following two things before doing a more in-depth analysis:

* Is the H265 codec installed?
Albeit there should be a fallback to the H264 codec, we have seen cases where this fallback did not work properly. See [system requirements](../overview/system-requirements.md#development-pc) for installing latest graphics driver.
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
* Make sure your network connectivity matches the criteria outlined in [Guidelines for network connectivity](../reference/network-requirements.md#guidelines-for-network-connectivity)
* Make sure that you are connected to the closest Azure data center offered by Azure Remote Rendering. 
* Make sure your Wi-Fi network has good signal strength at the place where you are using your client device. If you have a large distance or obstacles such as walls between your client device and the Wi-Fi access point, move the device closer to the Wi-Fi access point.
* Verify that your Wi-Fi network is not using channels that overlap with other Wi-Fi networks. You can use a tool like [WifiInfoView](https://www.nirsoft.net/utils/wifi_information_view.html) to validate this.
* Check if you are on the 5-GHz Wi-Fi band. If not, switch to the 5-GHz band.
* Make sure you are not connecting through a Wi-Fi repeater or a LAN-over-powerline forwarding.
* Make sure you don’t have bandwidth-intense competing traffic on your network.
