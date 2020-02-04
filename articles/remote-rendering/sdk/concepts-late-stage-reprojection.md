---
title: Late stage reprojection
description: Information on Late Stage Reprojection and how to use it.
author: sebastianpick
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: sepick
ms.date: 02/04/2020
ms.topic: conceptual
ms.service: azure-remote-rendering
---
# Late Stage Reprojection

Late Stage Reprojection (LSR) helps to reduce the amount of motion a Hologram undergoes when the user moves their head. This motion stems from discrepancies between the head poses used for rendering and at the time of presentation.

## Basics

Generally, static models are expected to visually maintain their position when you start moving around them. That is, they should look as though they're rigidly fixed to their surrounding. If they instead seem to be leaving their position or are otherwise wobbling, this behavior may hint at LSR issues. Mind that additional dynamic transformations, like animations or explosion views, might mask this behavior.

LSR is essential for maintaining a steady frame and avoiding the above artifacts. You may choose between two different modes, namely Planar or Depth LSR. Which one is active is determined by whether your Unity application has depth buffer sharing enabled in its Player Settings or not. To check if it's active, go to `File > Build Settings` from the Unity Editor, click on `Player Settings` in the lower left (you can also go to `Edit > Project Settings...`), and then check under `Player > XR Settings > Virtual Reality SDKs > Windows Mixed Reality` if `Enable Depth Buffer Sharing` is checked (see below image). If it is, your app uses Depth LSR, while it uses Planar LSR otherwise.

Both LSR modes strive to improve Hologram stability, although they have their distinct limitations. Generally, you should start by trying Depth LSR as it is arguably giving better results in most use cases.

![Depth Buffer Sharing Enabled flag](./media/unity-depth-buffer-sharing-enabled.png)

## Depth LSR

For Depth LSR to work, the Client application must supply a valid depth buffer that contains all the relevant geometry to consider during LSR. Unity will automatically supply a depth buffer when depth buffer sharing is enabled (see above). So just make sure to render the scene as intended.

Generally, Depth LSR attempts to stabilize the video frame based on the contents of the supplied depth buffer. As a consequence, content that hasn't been rendered to it, such as labels or transparent objects, isn't subject to the reprojection. Instead, it might still show instability and reprojection artifacts.

## Planar LSR

If using Planar LSR, you must supply the parameters of a plane that is then going to be used during LSR. This step is mandatory from the moment you disable depth buffer sharing as mentioned above. It must be done every frame by using the [Unity Focus Point API](https://docs.microsoft.com/windows/mixed-reality/focus-point-in-unity). The plane is defined by a so-called *focus point*. You provide it by calling to `UnityEngine.XR.WSA.HolographicSettings.SetFocusPointForFrame` supplying a position, normal, and velocity. The last two parameters are optional and will be filled in for you if you don't supply them. If you don't set a focus point at all, a fallback will be chosen.

You can calculate the focus point all by yourself. However, it might make sense to base it on the one calculated by the Remote Rendering host, that is, the remote focus point. To obtain it, you call to `RemoteManagerUnity.CurrentSession.GraphicsBinding.GetRemoteFocusPoint` providing a coordinate frame in which to express the focus point. In most cases, you'll just want to provide the result from `UnityEngine.XR.WSA.WorldManager.GetNativeISpatialCoordinateSystemPtr` here. Usually both sides, that is, the client and the host, render content that the other side isn't aware of, such as user interface elements on the client. As a result, it might often make sense to consider combining a remote focus point with a locally calculated one. In any case, you will not want to rely on the fallback, which is chosen for you if you do not specify one, as it leads to suboptimal results in most situations.

Apart from combining a remote focus point with a local one, it might also make sense to use interpolation. The focus points calculated in two successive frames might be quite different. Simply applying them can lead to Holograms looking as though they are jumping around. To prevent this behavior, interpolating between the previous and current focus points is advisable.

Planar LSR reprojects those objects best that lie within the supplied plane. The further away an object lies from the plane, however, the more unstable it will look. While Depth LSR is better at reprojecting objects at different depths, Planar LSR may work better for content aligning well with a plane.