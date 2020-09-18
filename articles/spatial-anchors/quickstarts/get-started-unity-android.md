---
title: 'Quickstart: Create a Unity Android app'
description: In this quickstart, you learn how to build an Android app with Unity using Spatial Anchors.
author: craigktreasure
manager: vriveras
services: azure-spatial-anchors

ms.author: crtreasu
ms.date: 07/31/2020
ms.topic: quickstart
ms.service: azure-spatial-anchors
---
# Quickstart: Create a Unity Android app with Azure Spatial Anchors

This quickstart covers how to create a Unity Android app using [Azure Spatial Anchors](../overview.md). Azure Spatial Anchors is a cross-platform developer service that allows you to create mixed reality experiences using objects that persist their location across devices over time. When you're finished, you'll have an ARCore Android app built with Unity that can save and recall a spatial anchor.

You'll learn how to:

> [!div class="checklist"]
> * Create a Spatial Anchors account
> * Prepare Unity build settings
> * Configure the Spatial Anchors account identifier and account key
> * Export the Android Studio project
> * Deploy and run on an Android device

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this quickstart, make sure you have:

- A Windows or macOS machine with <a href="https://unity3d.com/get-unity/download" target="_blank">Unity 2019.4 (LTS)</a> including the Android Build Support and Android SDK & NDK Tools modules.
  - If running on Windows, you'll also need <a href="https://git-scm.com/download/win" target="_blank">Git for Windows</a> and <a href="https://git-lfs.github.com/">Git LFS</a>.
  - If running on macOS, get Git installed via HomeBrew. Enter the following command into a single line of the Terminal: `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`. Then, run `brew install git` and `brew install git-lfs`.
- A <a href="https://developer.android.com/studio/debug/dev-options" target="_blank">developer enabled</a> and <a href="https://developers.google.com/ar/discover/supported-devices" target="_blank">ARCore capable</a> Android device.
  - Additional device drivers may be required for your computer to communicate with your Android device. For more additional information and instructions, see [here](https://developer.android.com/studio/run/device.html).

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Download and open the Unity sample project

[!INCLUDE [Clone Sample Repo](../../../includes/spatial-anchors-clone-sample-repository.md)]

[!INCLUDE [Open Unity Project](../../../includes/spatial-anchors-open-unity-project.md)]

[!INCLUDE [Android Unity Build Settings](../../../includes/spatial-anchors-unity-android-build-settings.md)]

[!INCLUDE [Configure Unity Scene](../../../includes/spatial-anchors-unity-configure-scene.md)]

## Export the Android Studio project

[!INCLUDE [Export Unity Project](../../../includes/spatial-anchors-unity-export-project-snip.md)]

Select your device in **Run Device** and then select **Build And Run**. You'll be asked to save an `.apk` file, which you can pick any name for.

Follow the instructions in the app to place and recall an anchor.

## Troubleshooting

### Rendering issues

When running the app, if you don't see the camera as the background (for instance you instead see a blank, blue, or other texture) then you likely need to reimport assets in Unity. Stop the app. From the top menu in Unity, choose **Assets -> Reimport all**. Then, run the app again.

[!INCLUDE [Clean-up section](../../../includes/clean-up-section-portal.md)]

[!INCLUDE [Next steps](../../../includes/spatial-anchors-quickstarts-nextsteps.md)]

> [!div class="nextstepaction"]
> [Tutorial: Share Spatial Anchors across devices](../tutorials/tutorial-share-anchors-across-devices.md)

> [!div class="nextstepaction"]
> [How To: Configure Azure Spatial Anchors in a Unity project](../how-tos/setup-unity-project.md)
