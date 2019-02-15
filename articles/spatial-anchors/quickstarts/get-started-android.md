---
title: Quickstart - Create Android app with Azure Spatial Anchors | Microsoft Docs
description: In this quickstart, you learn how to build an Android app using Spatial Anchors.
author: craigktreasure
manager: aliemami
services: azure-spatial-anchors

ms.author: crtreasu
ms.date: 12/13/2018
ms.topic: quickstart
ms.service: azure-spatial-anchors
# ms.reviewer: MSFT-alias-of-reviewer
#Customer intent: As a Mixed Reality developer, I want to learn how to use Azure Spatial Anchors in my Android app (in either Java or C++/NDK) that can place and locate a 3D object that persists across devices and platforms.
---
# Quickstart: Create an Android app with Azure Spatial Anchors, in either Java or C++/NDK

This quickstart covers how to create an Android app using [Azure Spatial Anchors](../overview.md) in either Java or C++/NDK. Azure Spatial Anchors is a cross-platform developer service that allows you to create Mixed Reality experiences using objects that persist their location across devices over time. When you're finished, you'll have an ARCore Android app that can save and recall a spatial anchor.

You'll learn how to:

> [!div class="checklist"]
> * Create a Spatial Anchors account
> * Configure the Spatial Anchors account identifier and account key
> * Deploy and run on an Android device

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this quickstart, make sure you have:

- A Windows or macOS machine with <a href="https://developer.android.com/studio/" target="_blank">Android Studio</a>.
- An <a href="https://developers.google.com/ar/discover/supported-devices" target="_blank">ARCore capable</a> Android device.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Open the sample project

[!INCLUDE [Clone Sample Repo](../../../includes/spatial-anchors-clone-sample-repository.md)]

If you're building the Android NDK sample, you'll need to download `arcore_c_api.h` from [here](https://raw.githubusercontent.com/google-ar/arcore-android-sdk/v1.5.0/libraries/include/arcore_c_api.h) and place it in `Android\NDK\libraries\include`.

Open Android Studio.

# [Java](#tab/openproject-java)

Select **Open an existing Android Studio project** and select the project located at `Android/Java/`.

# [NDK](#tab/openproject-ndk)

Select **Open an existing Android Studio project** and select the project located at `Android/NDK/`.

***

## Configure account identifier and key

The next step is to use the account identifier and account key recorded previously when setting up the Spatial Anchors resource to configure the app.

# [Java](#tab/openproject-java)

Open `Android/Java/app/src/main/java/com/microsoft/sampleandroid/ARActive.java`.

Locate the `SpatialAnchorsAccountKey` field and replace `Set me` with the account key.

Locate the `SpatialAnchorsAccountId` field and replace `Set me` with the account identifier.

# [NDK](#tab/openproject-ndk)

Open `Android/NDK/app/src/main/cpp/spatial_services_application.cc`.

Locate the `SpatialAnchorsAccountKey` field and replace `Set me` with the account key.

Locate the `SpatialAnchorsAccountId` field and replace `Set me` with the account identifier.

***

## Deploy the app to your Android device

Power on the Android device, sign in, and connect it to the PC using a USB cable.

Select **Run** from the Android Studio toolbar.

![Android Studio Deploy and Run](./media/get-started-android/android-studio-deploy-run.png)

Select the Android device in the **Select Deployment Target** dialog, and select **OK** to run the app on the Android device.

Follow the instructions in the app to place and recall an anchor.

Stop the app by selecting **Stop** from the Android Studio toolbar.

![Android Studio Stop](./media/get-started-android/android-studio-stop.png)

[!INCLUDE [Clean-up section](../../../includes/clean-up-section-portal.md)]

[!INCLUDE [Next steps](../../../includes/spatial-anchors-quickstarts-nextsteps.md)]

> [!div class="nextstepaction"]
> [Tutorial: Share Spatial Anchors across devices](../tutorials/tutorial-share-anchors-across-devices.md)
