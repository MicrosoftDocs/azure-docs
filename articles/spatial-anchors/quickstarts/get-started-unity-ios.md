---
title: 'Quickstart: Create a Unity iOS app'
description: In this quickstart, you learn how to build an iOS app with Unity using Spatial Anchors.
author: craigktreasure
manager: vriveras
services: azure-spatial-anchors

ms.author: crtreasu
ms.date: 02/24/2019
ms.topic: quickstart
ms.service: azure-spatial-anchors
---

# Quickstart: Create a Unity iOS app with Azure Spatial Anchors

This quickstart covers how to create a Unity iOS app using [Azure Spatial Anchors](../overview.md). Azure Spatial Anchors is a cross-platform developer service that allows you to create mixed reality experiences using objects that persist their location across devices over time. When you're finished, you'll have an ARKit iOS app built with Unity that can save and recall a spatial anchor.

You'll learn how to:

> [!div class="checklist"]
> * Create a Spatial Anchors account
> * Prepare Unity build settings
> * Configure the Spatial Anchors account identifier and account key
> * Export the Xcode project
> * Deploy and run on an iOS device

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this quickstart, make sure you have:

- A macOS machine with <a href="https://unity3d.com/get-unity/download" target="_blank">Unity 2019.1 or 2019.2</a>, the latest version of <a href="https://geo.itunes.apple.com/us/app/xcode/id497799835?mt=12" target="_blank">Xcode</a>, and <a href="https://cocoapods.org" target="_blank">CocoaPods</a> installed.
- Git installed via HomeBrew. Enter the following command into a single line of the Terminal: `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`. Then, run `brew install git` and `brew install git-lfs`.
- A developer enabled <a href="https://developer.apple.com/documentation/arkit/verifying_device_support_and_user_permission" target="_blank">ARKit compatible</a> iOS device.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Download and open the Unity sample project

[!INCLUDE [Clone Sample Repo](../../../includes/spatial-anchors-clone-sample-repository.md)]

[!INCLUDE [Open Unity Project](../../../includes/spatial-anchors-open-unity-project.md)]

[!INCLUDE [iOS Unity Build Settings](../../../includes/spatial-anchors-unity-ios-build-settings.md)]

## Configure account identifier and key

In the **Project** pane, navigate to `Assets/AzureSpatialAnchors.Examples/Scenes` and open the `AzureSpatialAnchorsBasicDemo.unity` scene file.

[!INCLUDE [Configure Unity Scene](../../../includes/spatial-anchors-unity-configure-scene.md)]

Save the scene by selecting **File** -> **Save**.

## Export the Xcode project

[!INCLUDE [Export Unity Project](../../../includes/spatial-anchors-unity-export-project-snip.md)]

[!INCLUDE [Configure Xcode](../../../includes/spatial-anchors-unity-ios-xcode.md)]

Follow the instructions in the app to place and recall an anchor.

When finished, stop the app by pressing **Stop** in Xcode.

## Troubleshooting

### Rendering issues

When running the app, if you don't see the camera as the background (for instance you instead see a blank, blue or other textures) then you likely need to re-import assets in Unity. Stop the app. From the top menu in Unity, choose **Assets -> Re-import all**. Then, run the app again.

### CocoaPods issues on macOS Catalina (10.15)

If you recently updated to macOS Catalina (10.15) and had CocoaPods installed beforehand, CocoaPods may be in a broken
state and fail to properly configure your pods and `.xcworkspace` project files. To resolve this issue, you'll need to
reinstall CocoaPods by running the following commands:

```shell
brew update
brew install cocoapods --build-from-source
brew link --overwrite cocoapods
```

### Unity 2019.3

Due to breaking changes, Unity 2019.3 is not currently supported. Please use Unity 2019.1 or 2019.2.

[!INCLUDE [Clean-up section](../../../includes/clean-up-section-portal.md)]

[!INCLUDE [Next steps](../../../includes/spatial-anchors-quickstarts-nextsteps.md)]

> [!div class="nextstepaction"]
> [Tutorial: Share Spatial Anchors across devices](../tutorials/tutorial-share-anchors-across-devices.md)
