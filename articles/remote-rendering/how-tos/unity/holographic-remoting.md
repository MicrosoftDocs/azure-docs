---
title: Use Holographic Remoting and Remote Rendering in Unity
description: How Holographic Remoting preview can be used in combination with Azure Remote Rendering
author: christophermanthei
ms.author: chmant
ms.date: 03/23/2020
ms.topic: how-to
---

# Use Holographic Remoting and Remote Rendering in Unity

[Holographic Remoting](https://docs.microsoft.com/windows/mixed-reality/holographic-remoting-player) and Azure Remote Rendering are mutually exclusive within one application. As such, [Unity play mode](https://docs.microsoft.com/windows/mixed-reality/unity-play-mode) is also not available.

For each run of the Unity editor only one of the two can be used. To use the other one, restart Unity first.

## Use Unity play mode to preview on Hololens 2

 Unity play mode can still be used, for example to test the UI of the application. However, it is vital that ARR is never initialized. Otherwise it will crash.

## Use a WMR VR headset to preview on desktop

If a Windows Mixed Reality VR headset is present, it can be used to preview inside Unity. In this case, it is fine to initialize ARR, however it will not be possible to connect to a session while the WMR headset is used.
