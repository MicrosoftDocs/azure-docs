---
title: Create Android app - Azure Spatial Anchors | Microsoft Docs
description: Learn how to build an Android app using Spatial Anchors.
author: craigktreasure
manager: aliemami
services: spatial-anchors

ms.assetid: 3be3aa43-7748-40e6-a20b-f6030147baaa
ms.author: crtreasu
ms.date: 12/13/2018
ms.topic: quickstart
ms.service: spatial-anchors
# ms.reviewer: MSFT-alias-of-reviewer
---
# Quickstart: Create an Android app with Spatial Anchors

[Spatial Anchors](overview.md) is a cross-platform developer service that makes it easy for you to create
Mixed Reality experiences.​ This quickstart shows how to create an Android app using spatial anchors. When you're finished,
you'll have an ARCore Android app that can save and recall a spatial anchor.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

Before you get started, here's a list of prerequisites:

- A macOS or Windows machine with <a href="https://developer.android.com/studio/" target="_blank">Android Studio</a>.
- An <a href="https://developers.google.com/ar/discover/supported-devices" target="_blank">ARCore capable</a> Android device.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Open the sample project

[!INCLUDE [Clone Sample Repo](../../../includes/spatial-anchors-clone-sample-repository.md)]

Open Android Studio.

# [Java](#tab/openproject-java)

Select **Open an existing Android Studio project** and select the project located at `java.android/samples/SampleAndroidJava/`.

# [NDK](#tab/openproject-ndk)

Select **Open an existing Android Studio project** and select the project located at `java.android/samples/SampleAndroidNDK/`.

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