---
title: Quickstart - Create a Unity Android app with Azure Spatial Anchors | Microsoft Docs
description: In this quickstart, you learn how to build an Android app with Unity using Spatial Anchors.
author: craigktreasure
manager: aliemami
services: azure-spatial-anchors

ms.author: crtreasu
ms.date: 02/24/2019
ms.topic: quickstart
ms.service: azure-spatial-anchors
# ms.reviewer: MSFT-alias-of-reviewer
#Customer intent: As a Mixed Reality developer, I want to learn how to use Azure Spatial Anchors in my Unity Android app that can place and locate a 3D object that persists across devices and platforms.
---
# Quickstart: Create a Unity Android app with Azure Spatial Anchors

This quickstart covers how to create a Unity Android app using [Azure Spatial Anchors](../overview.md). Azure Spatial Anchors is a cross-platform developer service that allows you to create mixed reality experiences using objects that persist their location across devices over time. When you're finished, you'll have an ARCore Android app built with Unity that can save and recall a spatial anchor.

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

- A Windows or macOS machine with <a href="https://unity3d.com/get-unity/download" target="_blank">Unity 2018.3+</a> and <a href="https://developer.android.com/studio/" target="_blank">Android Studio 3.3+</a>.
  - If running on Windows, you'll also need <a href="https://git-scm.com/download/win" target="_blank">Git for Windows</a>.
  - If running on macOS, get Git installed via HomeBrew. Enter the following command into a single line of the Terminal: `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`. Then, run `brew install git`.
- A <a href="https://developer.android.com/studio/debug/dev-options" target="_blank">developer enabled</a> and <a href="https://developers.google.com/ar/discover/supported-devices" target="_blank">ARCore capable</a> Android device.
- Your app must use version **1.7** of the ARCore SDK for Unity.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Download and open the Unity sample project

[!INCLUDE [Clone Sample Repo](../../../includes/spatial-anchors-clone-sample-repository.md)]

[!INCLUDE [Open Unity Project](../../../includes/spatial-anchors-open-unity-project.md)]

[!INCLUDE [Android Unity Build Settings](../../../includes/spatial-anchors-unity-android-build-settings.md)]

## Configure account identifier and key

In the **Project** pane, navigate to `Assets/AzureSpatialAnchorsPlugin/Examples` and open the `AzureSpatialAnchorsBasicDemo.unity` scene file.

[!INCLUDE [Configure Unity Scene](../../../includes/spatial-anchors-unity-configure-scene.md)]

Save the scene by selecting **File** -> **Save**.

## Export the Android Studio project

[!INCLUDE [Export Unity Project](../../../includes/spatial-anchors-unity-export-project-snip.md)]

Ensure the **Export Project** checkbox does not have a check mark. Click **Build And Run**. You'll be asked to save your `.apk` file, you can pick any name for it.

Follow the instructions in the app to place and recall an anchor.

> [!NOTE]
> When running the app, if you don't see the camera as the background (for instance you instead see a blank, blue or other textures) then you likely need to re-import assets in Unity. Stop the app. From the top menu in Unity, choose **Assets -> Reimport all**. Then, run the app again.

[!INCLUDE [Clean-up section](../../../includes/clean-up-section-portal.md)]

[!INCLUDE [Next steps](../../../includes/spatial-anchors-quickstarts-nextsteps.md)]

> [!div class="nextstepaction"]
> [Tutorial: Share Spatial Anchors across devices](../tutorials/tutorial-share-anchors-across-devices.md)
