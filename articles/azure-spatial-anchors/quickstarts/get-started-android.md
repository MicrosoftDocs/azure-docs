---
title: Quickstart - Create Android app with Azure Spatial Anchors | Microsoft Docs
description: In this quickstart, you learn how to build an Android app using Spatial Anchors.
author: craigktreasure
manager: aliemami
services: azure-spatial-anchors

ms.assetid: 3be3aa43-7748-40e6-a20b-f6030147baaa
ms.author: crtreasu
ms.date: 12/13/2018
ms.topic: quickstart
ms.service: azure-spatial-anchors
# ms.reviewer: MSFT-alias-of-reviewer
#Customer intent: As a Mixed Reality developer, I want to learn how to use Spatial Anchors in my Android app that can place and locate a 3D object that persists across devices and platforms.
---
# Quickstart: Create an Android app with Spatial Anchors

[Spatial Anchors](../overview.md) is a cross-platform developer service that allows you to create Mixed Reality experiences
using objects that persist their location across devices over time. This tutorial covers how to create an Android
app using Spatial Anchors. When you're finished, you'll have an ARCore Android app that can save and recall a spatial anchor.

You'll learn how to:

> [!div class="checklist"]
> * Create a Spatial Anchors account
> * Configure the Spatial Anchors endpoint and account key
> * Deploy and run on an Android device

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this quickstart, make sure you have:

- A Windows or macOS machine with <a href="https://developer.android.com/studio/" target="_blank">Android Studio</a>.
- An <a href="https://developers.google.com/ar/discover/supported-devices" target="_blank">ARCore capable</a> Android device.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/azure-spatial-anchors-get-started-create-resource.md)]

## Open the sample project

[!INCLUDE [Clone Sample Repo](../../../includes/azure-spatial-anchors-clone-sample-repository.md)]

Open Android Studio.

# [Java](#tab/openproject-java)

Select **Open an existing Android Studio project** and select the project located at `Android/Java/`.

# [NDK](#tab/openproject-ndk)

Select **Open an existing Android Studio project** and select the project located at `Android/NDK/`.

***

## Configure the Spatial Anchors endpoint and account key

The next step is to use the endpoint and account key recorded previously when setting up the Spatial Anchors resource to configure the app.

# [Java](#tab/openproject-java)

Open `Android/Java/app/src/main/java/com/microsoft/sampleandroid/ARActive.java`.

Locate the `SpatialAnchorsAccountKey` field and replace `Set me` with the account key.

Locate the `SpatialAnchorsEndpoint` field and replace `Set me` with the endpoint.

# [NDK](#tab/openproject-ndk)

Open `Android/NDK/app/src/main/cpp/spatial_anchors_application.cc`.

Locate the `SpatialAnchorsAccountKey` field and replace `Set me` with the account key.

Locate the `SpatialAnchorsEndpoint` field and replace `Set me` with the endpoint.

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
