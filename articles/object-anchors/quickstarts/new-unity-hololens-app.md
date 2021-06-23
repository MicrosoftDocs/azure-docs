---
title: 'Quickstart: Create a new HoloLens Unity app'
description: In this quickstart, you learn how to create a new HoloLens Unity app using Object Anchors.
author: RamonArguelles
manager: virivera

ms.author: rgarcia
ms.date: 06/23/2021
ms.topic: quickstart
ms.service: azure-object-anchors
---
# Quickstart: Step-by-step instructions to create a new HoloLens Unity app using Azure Object Anchors

This tutorial will show you how to create a new HoloLens Unity app with [Azure Object Anchors](../overview.md). Azure
Object Anchors is a managed cloud service that converts 3D assets into AI models that enable object-aware mixed
reality experiences for the HoloLens. When you're finished, you'll have a HoloLens app built with Unity that can detect
objects in the physical world.

## Prerequisites

To complete this quickstart, make sure you have:

* All prerequisites from either the [Unity HoloLens](get-started-unity-hololens.md) or the [Unity HoloLens with MRTK](get-started-unity-hololens-mrtk.md) quickstarts.
* <a href="https://unity3d.com/get-unity/download" target="_blank">Unity 2020.3.8f1 or newer</a>
* <a href="https://unity3d.com/get-unity/download" target="_blank">Unity Hub</a>

## Getting started

We'll first set up our project and Unity scene:
1. Start Unity Hub.
1. Select **New**, picking Unity 2020.3.8f1 or newer.
1. Ensure **3D** is selected.
1. Name your project and enter a save **Location**.
1. Select **Create**.
1. Save the empty default scene to a new file using: **File** > **Save As**.
1. Select the **Scenes** folder, name the new scene **Main**, and press the **Save** button.

## Configure as UWP

1. Select **File -> Building Settings**.
1. Select **Universal Windows Platform** and then select **Switch Platform**.
1. If Unity Editor says you need to download some components first, download and install them.
1. Close the **Build Settings** dialog.

## Install Open XR Plugin

1. Select **Window -> Package Manager**.
1. At the top of the window, ensure **Unity Registry** is selected as the packages source.
1. Scroll down the list of packages until you find **Open XR Plugin**.
1. Ensure the version displayed is 1.2.2 or newer, if not, select **See other versions** to locate it. 
1. Select the **Install** button.
1. You'll see a dialog asking for confirmation to enable the new input system.
1. Select the **Yes** button.
1. Once the installation process completes, close **Package Manager**.
1. In the **Hierarchy** pane, select **EventSystem** (if there's one, otherwise, you can ignore).
1. If you want to use the **EventSystem**, go to the **Inspector** pane, and select the **Replace with InputSystemUIInputModule** button.
1. If you don't want to use the **EventSystem**, right-click it and select **Delete**.
1. Select  **File** > **Save**.
1. Close **Unity**.

## Install Mixed Reality Feature Tool feature packages

1. Follow the <a a href="/windows/mixed-reality/develop/unity/welcome-to-mr-feature-tool" target="_blank">Mixed Reality Feature Tool</a> documentation to set up the tool and learn how to use it.
1. Under the **Platform Support** section, install the **Mixed Reality OpenXR Plugin** feature package, version 1.0.0 or newer, into the Unity project folder.
1. Under the **Azure Mixed Reality Services** section, install the **Microsoft Azure Object Anchors** feature package, into the Unity project folder.
1. Reopen the sample project in **Unity**. It might take a few minutes, while the **Mixed Reality Feature Tool** feature packages are installed.

## Set up the project settings

We'll now set some Unity project settings that help us target the Windows Holographic SDK for development.

First, let's set quality settings for our application.
1. Select **Edit** > **Project Settings** > **Quality**
1. In the column under the **Universal Windows Platform** logo, select on the arrow at the **Default** row and select **Very Low**. You'll know the setting is applied correctly when the box in the **Universal Windows Platform** column and **Very Low** row is green.

## Set capabilities

1. Go to **Edit** > **Project Settings** > **Player**
1. In the **Inspector Panel** for **Player Settings**, select the **Universal Windows Platform settings** icon.
1. In the **Publishing Settings** Capabilities section, check **InternetClientServer**, **WebCam**, and **SpatialPerception**.

## Configure OpenXR

1. Follow the <a href="/windows/mixed-reality/develop/unity/xr-project-setup#configuring-xr-plugin-management-for-openxr" target="_blank">Configuring XR Plugin Management for OpenXR</a> documentation to set up the **XR Plugin Management** in your **Project Settings**.
1. Follow the <a href="/windows/mixed-reality/develop/unity/xr-project-setup#optimization" target="_blank">Optimization</a> documentation to apply the recommended project settings for HoloLens 2.

## Set up the main virtual camera

1. In the **Hierarchy** pane, select **Main Camera**.
1. In the **Inspector**, set its transform position to **0,0,0**.
1. Find the **Clear Flags** property, and change the dropdown from **Skybox** to **Solid Color**.
1. Select the **Background** field to open the color picker.
1. Set **R, G, B, and A** to **0**.
1. Change the **Clipping Planes Near** property to 0.85.
1. Select **Add Component** and search for and add the **Tracked Posed Driver**.
1. Select  **File** > **Save**.

## Trying it out

To test out that everything is working, build your app in **Unity** and deploy it from **Visual Studio**. Follow Chapter 6 from the [**MR Basics 100: Getting started with Unity** course](/windows/mixed-reality/holograms-100#chapter-6---build-and-deploy-to-device-from-visual-studio) to do so. You should see the Unity start screen, and then a clear display.

## Create your script

1. In the **Project** pane, create a new folder, **Scripts**, under the **Assets** folder.
1. Right-click on the folder, then select **Create >**, **C# Script**. Name it **ObjectSearch**.
1. Go to **GameObject** -> **Create Empty**.
1. Select it, and in the **Inspector** rename it from **GameObject** to **Object Observer**.
1. Select **Add Component** and search for and add the **ObjectSearch** script.
1. Select  **File** > **Save**.

## Start implementing your app

You're ready to start adding your own code to the **ObjectSearch** script, using the Object Anchors Runtime SDK. You can reference the [SDK overview](../concepts/sdk-overview.md) as a starting point to learn the basics, and use some of the sample code to try it out.

## Next steps

> [!div class="nextstepaction"]
> [Concepts: SDK overview](../concepts/sdk-overview.md)

> [!div class="nextstepaction"]
> [FAQ](../faq.md)

> [!div class="nextstepaction"]
> [Conversion SDK](/dotnet/api/overview/azure/mixedreality.objectanchors.conversion-readme-pre)
