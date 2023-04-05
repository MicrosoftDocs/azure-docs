---
title: 'Quickstart: Using Unity Remoting with Azure Object Anchors'
description: In this quickstart, you learn how to enable Unity Remoting in a project that uses Object Anchors.
author: RamonArguelles
manager: virivera
ms.author: rgarcia
ms.date: 06/22/2022
ms.topic: quickstart
ms.service: azure-object-anchors
ms.custom: mode-other
---
# Quickstart: Using Unity Remoting with Azure Object Anchors
In this quickstart, you'll learn how to use Unity Remoting with [Azure Object Anchors](../overview.md) to enable a more efficient
inner-loop for application development. With Unity Remoting, you can use Play Mode in the Unity Editor to preview your
changes in real time without waiting through a full build and deployment cycle. The latest versions of Unity Remoting
and the Object Anchors SDK support using Object Anchors while in Play Mode, so you can detect real physical objects
while running inside the Unity Editor.

## Prerequisites
To complete this quickstart, make sure you have:
* All prerequisites from either the [Unity HoloLens](get-started-unity-hololens.md) or the [Unity HoloLens with MRTK](get-started-unity-hololens-mrtk.md) quickstarts.
* Reviewed the general instructions for <a href="/windows/mixed-reality/develop/native/holographic-remoting-overview">Holographic remoting</a>.
* Followed the <a href="/windows/mixed-reality/develop/unity/welcome-to-mr-feature-tool" target="_blank">Mixed Reality Feature Tool</a> documentation to set up the tool and learn how to use it.

### Minimum component versions

|Component                       |Unity 2019   |Unity 2020   |
|--------------------------------|-------------|-------------|
|Unity Editor                    | 2019.4.36f1 | 2020.3.30f1 |
|Windows Mixed Reality XR Plugin | 2.9.3       | 4.6.3       |
|Holographic Remoting Player     | 2.7.5       | 2.7.5       |
|Azure Object Anchors SDK        | 0.19.0      | 0.19.0      |
|Mixed Reality WinRT Projections | 0.5.2009    | 0.5.2009    |

## One-time setup
1. On your HoloLens, install version 2.7.5 or newer of the [Holographic Remoting Player](https://www.microsoft.com/p/holographic-remoting-player/9nblggh4sv40) via the Microsoft Store.
1. In the <a href="/windows/mixed-reality/develop/unity/welcome-to-mr-feature-tool" target="_blank">Mixed Reality Feature Tool</a>, under the **Platform Support** section, install the **Mixed Reality WinRT Projections** feature package, version 0.5.2009 or newer, into your Unity project folder.
1. In the Unity **Package Manager** window, ensure that the **Windows XR Plugin** is updated to version 2.9.3 or newer for Unity 2019, or version 4.6.3 or newer for Unity 2020.
1. In the Unity **Project Settings** window, select the **XR Plug-in Management** section, select the **PC Standalone** tab, and ensure that the **Windows Mixed Reality** and **Initialize XR on Startup** checkboxes are checked.
1. Place `.ou` model files in `%USERPROFILE%\AppData\LocalLow\<companyname>\<productname>` where `<companyname>` and `<productname>` match the values in the **Player** section of your project's **Project Settings** (for example, `Microsoft\AOABasicApp`). (See the **Windows Editor and Standalone Player** section of [Unity - Scripting API: Application.persistentDataPath](https://docs.unity3d.com/ScriptReference/Application-persistentDataPath.html).)

## Using Remoting with Object Anchors
1. Launch the **Holographic Remoting Player** app on your HoloLens. Your device's IP address will be displayed for convenient reference.
1. Open your project in the Unity Editor.
1. Open the **Windows XR Plugin Remoting** window from the **Window/XR** menu, select **Remote to Device** from the drop-down, ensure your device's IP address is entered in the **Remote Machine** box, and make sure that the **Connect on Play** checkbox is checked.
1. Enter and exit Play Mode as needed - Unity will connect to the Player app running on the device, and display your scene in real time! You can iterate on changes in the Editor, use Visual Studio to debug script execution, and do all the normal Unity development activities you're used to in Play Mode!

## Known limitations
* Some Object Anchors SDK features aren't supported since they rely on access to the HoloLens cameras, which isn't currently available via Remoting. These include <a href="/dotnet/api/microsoft.azure.objectanchors.objectobservationmode">Active Observation Mode</a> and <a href="/dotnet/api/microsoft.azure.objectanchors.objectinstancetrackingmode">High Accuracy Tracking Mode</a>.
* The Object Anchors SDK currently only supports Unity Remoting while using the **Windows Mixed Reality XR Plugin**. If the **OpenXR XR Plugin** is used, <a href="/dotnet/api/microsoft.azure.objectanchors.objectobserver.issupported">`ObjectObserver.IsSupported`</a> will return `false` in **Play Mode** and other APIs may throw exceptions.
