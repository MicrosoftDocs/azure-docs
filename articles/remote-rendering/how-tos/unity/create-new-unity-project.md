---
title: Creating a new Unity project
description: Explains the steps to create a new Unity project
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: tutorial
ms.service: azure-remote-rendering
---

# Creating a new Unity project

Make sure you have all the prerequisites in the [Unity Sample Project Documentation](run-unity-sample-project.md#prerequisites) fulfilled.

For the time being, it is advised to make a copy of the [UnitySampleProject](run-unity-sample-project.md) instead of creating a new project in Unity.

## Local Unity packages

Keep in mind that the sample project references packages via relative paths, namely the [remote rendering](install-remote-rendering-unity-package.md#manage-the-remote-rendering-packages-in-unity) and [scriptable render pipeline](install-remote-rendering-unity-package.md#scriptablerenderpipeline) packages.

You'll have to adjust these entries in your **Project/Packages/manifest.json** to be valid paths:

~~~~
    "com.microsoft.azure.remote_rendering": "file:../../com.microsoft.azure.remote_rendering",
    "com.unity.render-pipelines.core": "file:../../ScriptableRenderPipeline/com.unity.render-pipelines.core",
    "com.unity.render-pipelines.lightweight": "file:../../ScriptableRenderPipeline/com.unity.render-pipelines.lightweight",
    "com.unity.shadergraph": "file:../../ScriptableRenderPipeline/com.unity.shadergraph",
    "com.unity.render-pipelines.universal": "file:../../ScriptableRenderPipeline/com.unity.render-pipelines.universal",
~~~~

## Player settings

Go to "File->Build Settings...", switch ot UWP and click "Player Settings..." which should open them in the Unity Inspector view.

Go to the "XR Settings" group:

* Enable "Virtual Reality Support".
* In the SDKs list, add "Windows Mixed Reality".
* Switch "Depth Format" to "16-bit depth" to reduce power consumption and improve performance.
* Use "Enable Depth Buffer Sharing" to activate depth LSR for HoloLens.
* Switch "Stereo Rendering Mode" to "Single Pass Instanced" as that is the only supported mode in ARR right now.

If you want to use the [simulation graphics API](../../concepts/graphics-bindings.md#simulation) to deploy a flat UWP desktop app, you need to disable "Virtual Reality Support". If your app should support both HoloLens 2 and flat desktop, you will currently have to toggle this setting accordingly before building the app. This setting is because Unity does not distinguish between these two cases in the UI.

## Project settings

Go to "Edit->Project Settings..." and switch to the "Quality" category. Delete all quality levels except for "Low".
To use the scriptable render pipeline mentioned above, switch to the "Graphics" category and drag the asset from "Packages/Microsoft Azure Remote Rendering/Assets/RemoteRenderingPipelineAsset" from the Project view into the "Scriptable Render Pipeline Settings" slot.

## MRTK

To be able to use MRTK with ARR in the Unity editor, the MRTK [camera profile](https://github.com/Microsoft/MixedRealityToolkit-Unity/wiki/Camera-Profile) must be changed:

* Set "Clear Flags" to "Color" under "Opaque Display Settings".
* Set "Background Color" to black under "Opaque Display Settings".

## Game tab

The Unity **Game** window has multiple options at the top:

* Select the "aspect ratio" setting and change it to "Free Aspect" and if available, uncheck "Low Resolution Aspect Ratios".
* Verify that the "Scale" slider is set to 1x. This setting sometimes gets reset when the simulation starts and needs to be reset to 1x.

## Console tab

ARR may trigger errors at startup, which by default will pause the simulation, therefore it is advised for the time being to disable the "Error Pause" setting until the issue is resolved.

## Main camera

The main camera of each scene needs to be changed:

* Set "Background Type" to "Solid Color".
* Set "Background" to black.
* Set "Transform Position" to 0, 0, 0.
* Set "Transform Rotation" to 0, 0, 0.
* Set "Transform Scale" to 1, 1, 1.

## Add Tag

Go to "Edit->Project Settings...->Tags and Layers" and add the Tag "ModelRoot".
