---
title: Quickstart - Create HoloLens Unity app with Azure Spatial Anchors | Microsoft Docs
description: In this quickstart, you learn how to build a HoloLens app with Unity using Spatial Anchors.
author: craigktreasure
manager: aliemami
services: azure-spatial-anchors

ms.author: crtreasu
ms.date: 02/24/2019
ms.topic: quickstart
ms.service: azure-spatial-anchors
# ms.reviewer: MSFT-alias-of-reviewer
#Customer intent: As a Mixed Reality developer, I want to learn how to use Azure Spatial Anchors in my HoloLens Unity app that can place and locate a 3D object that persists across devices and platforms.
---
# Quickstart: Create a HoloLens Unity app using Azure Spatial Anchors

This quickstart covers how to create a HoloLens Unity app using [Azure Spatial Anchors](../overview.md). Azure Spatial Anchors is a cross-platform developer service that allows you to create mixed reality experiences using objects that persist their location across devices over time. When you're finished, you'll have a HoloLens app built with Unity that can save and recall a spatial anchor.

You'll learn how to:

> [!div class="checklist"]
> * Create a Spatial Anchors account
> * Prepare Unity build settings
> * Configure the Spatial Anchors account identifier and account key
> * Export the HoloLens Visual Studio project
> * Deploy and run on a HoloLens device

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this quickstart, make sure you have:

- A Windows machine with <a href="https://unity3d.com/get-unity/download" target="_blank">Unity 2018.3+</a>, <a href="https://www.visualstudio.com/downloads/" target="_blank">Visual Studio 2017+</a> installed with the **Universal Windows Platform development** workload, and <a href="https://git-scm.com/download/win" target="_blank">Git for Windows</a>.
- A HoloLens device with [developer mode](https://docs.microsoft.com/windows/mixed-reality/using-visual-studio) enabled. This article requires a HoloLens device with the [Windows 10 October 2018 Update](https://docs.microsoft.com/en-us/windows/mixed-reality/release-notes-october-2018) (also known as RS5). To update to the latest release on HoloLens, open the **Settings** app, go to **Update & Security**, then select the **Check for updates** button.
- Your app must set the **SpatialPerception** capability under **Build Settings**->**Player Settings**->**Publishing Settings**->**Capabilities**.
- Your app must enable **Virtual Reality Supported** with **Windows Mixed Reality SDK** under **Build Settings**->**Player Settings**->**XR Settings**.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Open the sample project in Unity

[!INCLUDE [Clone Sample Repo](../../../includes/spatial-anchors-clone-sample-repository.md)]

Open Unity and open the project at the `Unity` folder.

Open **Build Settings** by selecting **File** -> **Build Settings**.

In the **Platform** section, select **Universal Windows Platform**. Then, change the **Target Device** to **HoloLens**.

Select **Switch Platform** to change the platform to **Universal Windows Platform**. Unity may ask you to install UWP support components if they're missing.

![Unity Build Settings](./media/get-started-unity-hololens/unity-build-settings.png)

Close the **Build Settings** window.

## Configure account identifier and key

In the **Project** pane, navigate to `Assets/AzureSpatialAnchorsPlugin/Examples` and open the `AzureSpatialAnchorsBasicDemo.unity` scene file.

[!INCLUDE [Configure Unity Scene](../../../includes/spatial-anchors-unity-configure-scene.md)]

Save the scene by selecting **File** -> **Save**.

## Export the HoloLens Visual Studio project

[!INCLUDE [Export Unity Project](../../../includes/spatial-anchors-unity-export-project-snip.md)]

Select **Build** to open a dialog. Then, select a folder to export the HoloLens Visual Studio project.

When the export is complete, a folder will be displayed containing the exported HoloLens project.

## Deploy the HoloLens application

In the folder, double-click on `HelloAR U3D.sln` to open the project in Visual Studio.

Change the **Solution Configuration** to **Release**, change **Solution Platform** to **x86**, and select **Device** from the deployment target options.

![Visual Studio Configuration](./media/get-started-unity-hololens/visual-studio-configuration.png)

Power on the HoloLens device, sign in, and connect it to the PC using a USB cable.

Select **Debug** > **Start debugging** to deploy your app and start debugging.

Follow the instructions in the app to place and recall an anchor.

In Visual Studio, stop the app by either selecting **Stop Debugging** or pressing **Shift + F5**.

[!INCLUDE [Clean-up section](../../../includes/clean-up-section-portal.md)]

[!INCLUDE [Next steps](../../../includes/spatial-anchors-quickstarts-nextsteps.md)]

> [!div class="nextstepaction"]
> [Tutorial: Share Spatial Anchors across devices](../tutorials/tutorial-share-anchors-across-devices.md)
