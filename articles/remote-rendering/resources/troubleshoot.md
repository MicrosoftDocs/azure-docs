---
title: Troubleshoot
description: Troubleshooting information for Azure Remote Rendering
author: florianborn71
ms.author: flborn
ms.date: 02/25/2020
ms.topic: troubleshooting
---

# Troubleshoot

This page lists common issues interfering with Azure Remote Rendering, and ways to resolve them.

## Can't link storage account to ARR account

Sometimes during [linking of a storage account](../how-tos/create-an-account.md#link-storage-accounts) the Remote Rendering account isn't listed. To fix this issue, go to the ARR account in the Azure portal and select **Identity** under the **Settings** group on the left. Make sure **Status** is set to **On**.
![Unity frame debugger](./media/troubleshoot-portal-identity.png)

## Client can't connect to server

Make sure that your firewalls (on device, inside routers, etc.) don't block the following ports:

* **50051 (TCP)** - required for initial connection (HTTP handshake)
* **8266 (TCP+UDP)** - required for data transfer
* **5000 (TCP)**, **5433 (TCP)**, **8443 (TCP)** - required for [ArrInspector](tools/arr-inspector.md)

## Error '`Disconnected: VideoFormatNotAvailable`'

Check that your GPU supports hardware video decoding. See [Development PC](../overview/system-requirements.md#development-pc).

If you are working on a laptop with two GPUs, it is possible that the GPU you are running on by default, does not provide hardware video decoding functionality. If so, try to force your app to use the other GPU. This is often possible in the GPU driver settings.

## H265 codec not available

There are two reasons why the server might refuse to connect with a `codec not available` error.

**The H265 codec isn't installed:**

First make sure to install the **HEVC Video Extensions** as mentioned in the [Software](../overview/system-requirements.md#software) section of the system requirements.

If you still encounter problems, make sure that your graphics card supports H265 and you have the latest graphics driver installed. See the [Development PC](../overview/system-requirements.md#development-pc) section of the system requirements for vendor-specific information.

**The codec is installed, but can't be used:**

The reason for this issue is an incorrect security setting on the DLLs. This problem doesn't manifest when trying to watch videos encoded with H265. Reinstalling the codec doesn't fix the problem either. Instead, perform the following steps:

1. Open a **PowerShell with admin rights** and run

    ```PowerShell
    Get-AppxPackage -Name Microsoft.HEVCVideoExtension
    ```
  
    That command should output the `InstallLocation` of the codec, something like:
  
    ```cmd
    InstallLocation   : C:\Program Files\WindowsApps\Microsoft.HEVCVideoExtension_1.0.23254.0_x64__5wasdgertewe
    ```

1. Open that folder in Windows Explorer
1. There should be an **x86** and an **x64** subfolder. Right-click on one of the folders and choose **Properties**
    1. Select the **Security** tab and click the **Advanced** settings button
    1. Click **Change** for the **Owner**
    1. Type **Administrators** into the text field
    1. Click **Check Names** and **OK**
1. Repeat the steps above for the other folder
1. Also repeat the steps above on each DLL file inside both folders. There should be four DLLs altogether.

To verify that the settings are now correct, do this for each of the four DLLs:

1. Select **Properties > Security > Edit**
1. Go through the list of all **Groups / Users** and make sure each one has the **Read & Execute** right set (the checkmark in the **allow** column must be ticked)

## Low video quality

The video quality can be compromised either by network quality or the missing H265 video codec.

* See the steps to [identify network problems](#unstable-holograms).
* See the [system requirements](../overview/system-requirements.md#development-pc) for installing the latest graphics driver.

## Video recorded with MRC does not reflect the quality of the live experience

A video can be recorded on Hololens through [Mixed Reality Capture (MRC)](https://docs.microsoft.com/windows/mixed-reality/mixed-reality-capture-for-developers). However the resulting video has worse quality than the live experience for two reasons:
* The video framerate is capped at 30 Hz as opposed to 60 Hz.
* The video images do not go through the [late stage reprojection](../overview/features/late-stage-reprojection.md) processing step, so the video appears to be choppier.

Both are inherent limitations of the recording technique.

## Black screen after successful model loading

If you are connected to the rendering runtime and loaded a model successfully, but only see a black screen afterwards, then this can have a few distinct causes.

We recommend testing the following things before doing a more in-depth analysis:

* Is the H265 codec installed? Although there should be a fallback to the H264 codec, we have seen cases where this fallback did not work properly. See the [system requirements](../overview/system-requirements.md#development-pc) for installing the latest graphics driver.
* When using a Unity project, close Unity, delete the temporary *library* and *obj* folders in the project directory and load/build the project again. In some cases cached data caused the sample to not function properly for no obvious reason.

If these two steps did not help, it is required to find out whether video frames are received by the client or not. This can be queried programmatically as explained in the [server-side performance queries](../overview/features/performance-queries.md) chapter. The `FrameStatistics struct` has a member that indicates how many video frames have been received. If this number is larger than 0 and increasing over time, the client receives actual video frames from the server. Consequently it must be a problem on the client side.

### Common client-side issues

**The model exceeds the limits of the selected VM, specifically the maximum number of polygons:**

See specific [VM size limitations](../reference/limits.md#overall-number-of-polygons).

**The model is not inside the camera frustum:**

In many cases, the model is displayed correctly but located outside the camera frustum. A common reason is that the model has been exported with a far off-center pivot so it is clipped by the camera's far clipping plane. It helps to query the model's bounding box programmatically and visualize the box with Unity as a line box or print its values to the debug log.

Furthermore the conversion process generates an [output json file](../how-tos/conversion/get-information.md) alongside with the converted model. To debug model positioning issues, it is worth looking at the `boundingBox` entry in the [outputStatistics section](../how-tos/conversion/get-information.md#the-outputstatistics-section):

```JSON
{
    ...
    "outputStatistics": {
        ...
        "boundingBox": {
            "min": [
                -43.52,
                -61.775,
                -79.6416
            ],
            "max": [
                43.52,
                61.775,
                79.6416
            ]
        }
    }
}
```

The bounding box is described as a `min` and `max` position in 3D space, in meters. So a coordinate of 1000.0 means it is 1 kilometer away from the origin.

There can be two problems with this bounding box that lead to invisible geometry:
* **The box can be far off-center**, so the object is clipped altogether due to far plane clipping. The `boundingBox` values in this case would look like this: `min = [-2000, -5,-5], max = [-1990, 5,5]`, using a large offset on the x-axis as an example here. To resolve this type of issue, enable the `recenterToOrigin` option in the [model conversion configuration](../how-tos/conversion/configure-model-conversion.md).
* **The box can be centered but be orders of magnitude too large**. That means that albeit the camera starts in the center of the model, its geometry is clipped in all directions. Typical `boundingBox` values in this case would look like this: `min = [-1000,-1000,-1000], max = [1000,1000,1000]`. The reason for this type of issue is usually a unit scale mismatch. To compensate, specify a [scaling value during conversion](../how-tos/conversion/configure-model-conversion.md#geometry-parameters) or mark up the source model with the correct units. Scaling can also be applied to the root node when loading the model at runtime.

**The Unity render pipeline doesn't include the render hooks:**

Azure Remote Rendering hooks into the Unity render pipeline to do the frame composition with the video, and to do the reprojection. To verify that these hooks exist, open the menu *:::no-loc text="Window > Analysis > Frame debugger":::*. Enable it and make sure there are two entries for the `HolographicRemotingCallbackPass` in the pipeline:

![Unity frame debugger](./media/troubleshoot-unity-pipeline.png)

## The rendered image in Unity is upside-down

Make sure to follow the [project setup guide](../tutorials/unity/project-setup.md) exactly. An upside down image indicates that Unity is required to create an off-screen render target. This behavior is currently not supported and creates a huge performance impact on HoloLens 2.

Reasons for this issue could be MSAA, HDR, or enabling post processing. Make sure that the low-quality profile is selected and set as default in the Unity. To do so go to *Edit > Project Settings... > Quality*.

## Unity code using the Remote Rendering API doesn't compile

### Use Debug when compiling for Unity Editor

Switch the *build type* of the Unity solution to **Debug**. When testing ARR in the Unity editor the define `UNITY_EDITOR` is only available in 'Debug' builds. Note that this is unrelated to the build type used for [deployed applications](../quickstarts/deploy-to-hololens.md), where you should prefer 'Release' builds.

### Compile failures when compiling Unity samples for HoloLens 2

We have seen spurious failures when trying to compile Unity samples (quickstart, ShowCaseApp, ..) for HoloLens 2. Visual Studio complains about not being able to copy some files albeit they are there. If you hit this problem:
* Remove all temporary Unity files from the project and try again. That is, close Unity, delete the temporary *library* and *obj* folders in the project directory and load/build the project again.
* Make sure the projects are located in a directory on disk with reasonably short path, since the copy step sometimes seems to run into problems with long filenames.
* If that does not help, it could be that MS Sense interferes with the copy step. To set up an exception, run this registry command from command line (requires admin rights):
    ```cmd
    reg.exe ADD "HKLM\SOFTWARE\Policies\Microsoft\Windows Advanced Threat Protection" /v groupIds /t REG_SZ /d "Unity”
    ```
    
### Arm64 builds for Unity projects fail because AudioPluginMsHRTF.dll is missing

The `AudioPluginMsHRTF.dll` for Arm64 was added to the *Windows Mixed Reality* package *(com.unity.xr.windowsmr.metro)* in version 3.0.1. Ensure that you have version 3.0.1 or later installed via the Unity Package Manager. From the Unity menu bar, navigate to *Window > Package Manager* and look for the *Windows Mixed Reality* package.

## Unstable Holograms

In case rendered objects seem to be moving along with head movements, you might be encountering issues with *Late Stage Reprojection* (LSR). Refer to the section on [Late Stage Reprojection](../overview/features/late-stage-reprojection.md) for guidance on how to approach such a situation.

Another reason for unstable holograms (wobbling, warping, jittering, or jumping holograms) can be poor network connectivity, in particular insufficient network bandwidth, or too high latency. A good indicator for the quality of your network connection is the [performance statistics](../overview/features/performance-queries.md) value `ARRServiceStats.VideoFramesReused`. Reused frames indicate situations where an old video frame needed to be reused on the client side because no new video frame was available – for example because of packet loss or because of variations in network latency. If `ARRServiceStats.VideoFramesReused` is frequently larger than zero, this indicates a network problem.

Another value to look at is `ARRServiceStats.LatencyPoseToReceiveAvg`. It should consistently be below 100 ms. If you see higher values, this indicates that you are connected to a data center that is too far away.

For a list of potential mitigations, see the [guidelines for network connectivity](../reference/network-requirements.md#guidelines-for-network-connectivity).

## Z-fighting

While ARR offers [z-fighting mitigation functionality](../overview/features/z-fighting-mitigation.md), z-fighting can still show up in the scene. This guide aims at troubleshooting these remaining problems.

### Recommended steps

Use the following workflow to mitigate z-fighting:

1. Test the scene with the default settings of ARR (z-fighting mitigation on)

1. Disable the z-fighting mitigation via its [API](../overview/features/z-fighting-mitigation.md) 

1. Change the camera near and far plane to a closer range

1. Troubleshoot the scene via the next section

### Investigating remaining z-fighting

If the above steps have been exhausted and the remaining z-fighting is unacceptable, the underlying cause of the z-fighting needs to be investigated. As stated in the [z-fighting mitigation feature page](../overview/features/z-fighting-mitigation.md), there are two main reasons for z-fighting: depth precision loss at the far end of the depth range, and surfaces that intersect while being coplanar. Depth precision loss is a mathematical eventuality and can only be mitigated by following step 3 above. Coplanar surfaces indicate a source asset flaw and are better fixed in the source data.

ARR has a feature for determining if surfaces could z-fight: [Checkerboard highlighting](../overview/features/z-fighting-mitigation.md). You can also determine visually what causes the z-fighting. The following first animation shows an example of depth-precision loss in the distance, and the second one shows an example of nearly coplanar surfaces:

![depth-precision-z-fighting](./media/depth-precision-z-fighting.gif)  ![coplanar-z-fighting](./media/coplanar-z-fighting.gif)

Compare these examples with your z-fighting to determine the cause or optionally follow this step-by-step workflow:

1. Position the camera above the z-fighting surfaces to look directly at the surface.
1. Slowly move the camera backwards, away from the surfaces.
1. If the z-fighting is visible all of the time, the surfaces are perfectly coplanar. 
1. If the z-fighting is visible most of the time, the surfaces are nearly coplanar.
1. If the z-fighting is only visible from far away, the cause is lack of depth precision.

Coplanar surfaces can have a number of different causes:

* An object was duplicated by the exporting application because of an error or different workflow approaches.

    Check these problems with the respective application and application support.

* Surfaces are duplicated and flipped to appear double-sided in renderers that use front-face or back-face culling.

    Import via the [model conversion](../how-tos/conversion/model-conversion.md) determines the principal sidedness of the model. Double-sidedness is assumed as the default. The surface will be rendered as a thin wall with physically correct lighting from both sides. Single-sidedness can be implied by flags in the source asset, or explicitly forced during the [model conversion](../how-tos/conversion/model-conversion.md). Additionally but optionally, the [single sided mode](../overview/features/single-sided-rendering.md) can be set to "normal".

* Objects intersect in the source assets.

     Objects transformed in a way that some of their surfaces overlap also creates z-fighting. Transforming parts of the scene tree in the imported scene in ARR can also create this problem.

* Surfaces are purposefully authored to touch, like decals or text on walls.



## Next steps

* [System requirements](../overview/system-requirements.md)
* [Network requirements](../reference/network-requirements.md)
