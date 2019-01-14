---
title: Create iOS app - Azure Spatial Anchors | Microsoft Docs
description: Learn how to build an iOS app using Spatial Anchors.
author: craigktreasure
manager: aliemami
services: spatial-anchors

ms.assetid: f6441643-18a0-4620-9a30-9970cf92ccfe
ms.author: crtreasu
ms.date: 12/13/2018
ms.topic: quickstart
ms.service: spatial-anchors
# ms.reviewer: MSFT-alias-of-reviewer
---
# Quickstart: Create an iOS app with Spatial Anchors

[Spatial Anchors](overview.md) is a cross-platform developer service that makes it easy for you to create
Mixed Reality experiences.​ This quickstart shows how to create an iOS app using spatial anchors in either Swift or
Objective-C. When you're finished, you'll have an ARKit iOS app that can save and recall a spatial anchor.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

Before you get started, here's a list of prerequisites:

- A developer enabled macOS machine with <a href="https://geo.itunes.apple.com/us/app/xcode/id497799835?mt=12" target="_blank">Xcode 9.4+</a> and <a href="https://cocoapods.org" target="_blank">CocoaPods</a> installed.
- A developer enabled <a href="https://developer.apple.com/documentation/arkit/verifying_device_support_and_user_permission" target="_blank">ARKit compatible</a> iOS device.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Open the sample project

[!INCLUDE [Clone Sample Repo](../../../includes/spatial-anchors-clone-sample-repository.md)]

Install the necessary pods using CocoaPods:

# [Swift](#tab/openproject-swift)

Navigate to `native.ios/samples/SampleSwift/`.

```bash
cd ./native.ios/samples/SampleSwift/
```

# [Objective-C](#tab/openproject-objc)

Navigate to `native.ios/samples/SampleObjC/`.

```bash
cd ./native.ios/samples/SampleObjC/
```

***

Run `pod install` to install the CocoaPods for the project.

Now open the `.xcworkspace` in Xcode.

# [Swift](#tab/openproject-swift)

```bash
open ./SampleSwift.xcworkspace
```

# [Objective-C](#tab/openproject-objc)

```bash
open ./SampleObjC.xcworkspace
```

***

## Configure the Spatial Anchors endpoint and account key

**TODO**

## Deploy the app to your iOS device

Connect the iOS device to the Mac and set the **active scheme** to your iOS device.

![Select the device](./media/get-started-ios/select-device.png)

Select **Build and then run the current scheme**.

![Deploy and run](./media/get-started-ios/deploy-run.png)

> [!NOTE]
> If you see a `library not found for -lPods-SampleObjC` error, you likely opened the `.xcodeproj` file instead of the
> `.xcworkspace`. Open the `.xcworkspace` and try again.

In Xcode, stop the app by pressing **Stop**.

[!INCLUDE [Clean-up section](../../../includes/clean-up-section-portal.md)]

## Next steps

> [!div class="nextstepaction"]
> [Authentication]()

> [!div class="nextstepaction"]
> [Managing permissions]()