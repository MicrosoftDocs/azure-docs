---
title: Quickstart - Create iOS Unity app with Azure Spatial Anchors | Microsoft Docs
description: In this quickstart, you learn how to build an iOS app with Unity using Spatial Anchors.
author: craigktreasure
manager: aliemami
services: azure-spatial-anchors

ms.assetid: 52062008-5641-467d-ac79-4283a87842d1
ms.author: crtreasu
ms.date: 12/13/2018
ms.topic: quickstart
ms.service: azure-spatial-anchors
# ms.reviewer: MSFT-alias-of-reviewer
#Customer intent: As a Mixed Reality developer, I want to learn how to use Spatial Anchors in my iOS Unity app that can place and locate a 3D object that persists across devices and platforms.
---
# Quickstart: Create an iOS Unity app with Spatial Anchors

[Spatial Anchors](../overview.md) is a cross-platform developer service that allows you to create Mixed Reality experiences
using objects that persist their location across devices over time. This tutorial covers how to create an iOS Unity
app using Spatial Anchors. When you're finished, you'll have an ARKit iOS app built with Unity that can save and
recall a spatial anchor.

You'll learn how to:

> [!div class="checklist"]
> * Create a Spatial Anchors account
> * Prepare Unity build settings
> * Download and import the Unity ARKit Plugin
> * Configure the Spatial Anchors endpoint and account key
> * Export the Xcode project
> * Deploy and run on an iOS device

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this quickstart, make sure you have:

- A macOS machine with <a href="https://unity3d.com/get-unity/download" target="_blank">Unity 2018.2+</a>, <a href="https://geo.itunes.apple.com/us/app/xcode/id497799835?mt=12" target="_blank">Xcode 9.4+</a>, and <a href="https://cocoapods.org" target="_blank">CocoaPods</a> installed.
- A developer enabled <a href="https://developer.apple.com/documentation/arkit/verifying_device_support_and_user_permission" target="_blank">ARKit compatible</a> iOS device.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/azure-spatial-anchors-get-started-create-resource.md)]

## Open the sample project in Unity

[!INCLUDE [Clone Sample Repo](../../../includes/azure-spatial-anchors-clone-sample-repository.md)]

Open Unity and open the project at the `Unity` folder.

Open **Build Settings** by selecting **File** -> **Build Settings**.

In the **Platform** section, select **iOS**.

Select **Switch Platform** to change the platform to **iOS**.

![Unity Build Settings](./media/get-started-unity-ios/unity-build-settings.png)

Close the **Build Settings** window.

## Download and import the Unity ARKit Plugin

Download [Unity ARKit Plugin v2.0.0](https://bitbucket.org/Unity-Technologies/unity-arkit-plugin/get/v2.0.0.zip) and extract the archive.

Copy the contents of the `Assets` folder from the extracted Unity ARKit Plugin folder to the sample's `Assets` folder.

[!INCLUDE [Configure Unity Scene](../../../includes/azure-spatial-anchors-unity-configure-scene.md)]

## Export the Xcode project

[!INCLUDE [Export Unity Project](../../../includes/azure-spatial-anchors-unity-export-project-snip.md)]

Select **Build** to open a dialog. Then, select a folder to export the Xcode project.

When the export is complete, a folder will be displayed containing the exported Xcode project.

## Open the Xcode project

In the exported Xcode project folder, double-click on `Unity-iPhone.xcodeproj` to open the project in Xcode.

Open the `iOS/frameworks` folder in Finder. Drag and drop the `SpatialServiceApi.framework` file under the **Classes** node of the **Project navigator**. In the import dialog, make sure that **Copy items if needed** is checked.

![Import framework](./media/get-started-unity-ios/import-framework.png)

Select the root **Unity-iPhone** node to view the project settings and select the **General** tab.

Under **Signing**, select **Automatically manage signing**. Select **Enable Automatic** in the dialog that appears to reset build settings.

Under **Deployment Info**, make sure the **Deployment Target** is set to `11.0`.

Under **Embedded Binaries**, select **Add items**. In the dialog, select `SpatialServicesApi.framework` and select **Add** to close the dialog.

![Import framework](./media/get-started-unity-ios/configure-embedded-binaries.png)

## Deploy the app to your iOS device

Connect the iOS device to the Mac and set the **active scheme** to your iOS device.

![Select the device](./media/get-started-unity-ios/select-device.png)

Select **Build and then run the current scheme**.

![Deploy and run](./media/get-started-unity-ios/deploy-run.png)

Follow the instructions in the app to place and recall an anchor.

In Xcode, stop the app by pressing **Stop**.

[!INCLUDE [Clean-up section](../../../includes/clean-up-section-portal.md)]
