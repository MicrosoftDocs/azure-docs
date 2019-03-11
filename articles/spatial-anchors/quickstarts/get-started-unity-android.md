---
title: Quickstart - Create Android Unity app with Azure Spatial Anchors | Microsoft Docs
description: In this quickstart, you learn how to build an Android app with Unity using Spatial Anchors.
author: craigktreasure
manager: aliemami
services: azure-spatial-anchors

ms.author: crtreasu
ms.date: 02/24/2019
ms.topic: quickstart
ms.service: azure-spatial-anchors
# ms.reviewer: MSFT-alias-of-reviewer
#Customer intent: As a Mixed Reality developer, I want to learn how to use Azure Spatial Anchors in my Android Unity app that can place and locate a 3D object that persists across devices and platforms.
---
# Quickstart: Create an Android Unity app with Azure Spatial Anchors

This quickstart covers how to create an Android Unity app using [Azure Spatial Anchors](../overview.md). Azure Spatial Anchors is a cross-platform developer service that allows you to create mixed reality experiences using objects that persist their location across devices over time. When you're finished, you'll have an ARCore Android app built with Unity that can save and recall a spatial anchor.

You'll learn how to:

> [!div class="checklist"]
> * Create a Spatial Anchors account
> * Prepare Unity build settings
> * Download and import the ARCore SDK for Unity
> * Configure the Spatial Anchors account identifier and account key
> * Export the Android Studio project
> * Deploy and run on an Android device

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this quickstart, make sure you have:

- A Windows or macOS machine with <a href="https://unity3d.com/get-unity/download" target="_blank">Unity 2018.3+</a> and <a href="https://developer.android.com/studio/" target="_blank">Android Studio 3.3+</a> installed.
- A <a href="https://developer.android.com/studio/debug/dev-options" target="_blank">developer enabled</a> and <a href="https://developers.google.com/ar/discover/supported-devices" target="_blank">ARCore capable</a> Android device.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Open the sample project in Unity

[!INCLUDE [Clone Sample Repo](../../../includes/spatial-anchors-clone-sample-repository.md)]

[!INCLUDE [Android Unity Build Settings](../../../includes/spatial-anchors-unity-android-build-settings.md)]

## Configure account identifier and key

In the **Project** pane, navigate to `Assets/AzureSpatialAnchorsPlugin/Examples` and open the `AzureSpatialAnchorsBasicDemo.unity` scene file.

[!INCLUDE [Configure Unity Scene](../../../includes/spatial-anchors-unity-configure-scene.md)]

Save the scene by selecting **File** -> **Save**.

## Export the Android Studio project

[!INCLUDE [Export Unity Project](../../../includes/spatial-anchors-unity-export-project-snip.md)]

Select **Export** to open a dialog. Then, select a folder to export the Android Studio project.

When the export is complete, a folder will be displayed containing the exported Android Studio project, with a subfolder called **HelloAR U3D**.

## Deploy the Android application

Open Android Studio and select **Open an existing Android Studio project**. Then, select the **HelloAR U3D** subfolder from the exported Android Studio project, and click **OK**.

Upon opening, a prompt will appear asking to use the Gradle wrapper. Select **OK** to use the Gradle wrapper and to open the project.

Power on the Android device, sign in, and connect it to the PC using a USB cable.

Select **Run** from the Android Studio toolbar.

![Android Studio Deploy and Run](./media/get-started-unity-android/android-studio-deploy-run.png)

Select the Android device in the **Select Deployment Target** dialog, and select **OK** to run the app on the Android device.

Follow the instructions in the app to place and recall an anchor.

> [!NOTE]
> When running the app, if you don't see the camera as the background (for instance you instead see a blank, blue or other textures) then you likely need to re-import assets in Unity. Stop the app. From the top menu in Unity, choose **Assets -> Reimport all**. Then, run the app again.

Stop the app by selecting **Stop** from the Android Studio toolbar.

![Android Studio Stop](./media/get-started-unity-android/android-studio-stop.png)

[!INCLUDE [Clean-up section](../../../includes/clean-up-section-portal.md)]

[!INCLUDE [Next steps](../../../includes/spatial-anchors-quickstarts-nextsteps.md)]

> [!div class="nextstepaction"]
> [Tutorial: Share Spatial Anchors across devices](../tutorials/tutorial-share-anchors-across-devices.md)
