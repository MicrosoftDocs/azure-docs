---
title: 'Quickstart: Create an Android app'
description: In this quickstart, you learn how to build an Android app using Spatial Anchors.
author: pamistel
manager: MehranAzimi-msft
services: azure-spatial-anchors
ms.author: pamistel
ms.date: 11/20/2020
ms.topic: quickstart
ms.service: azure-spatial-anchors
ms.custom: mode-api, devx-track-azurecli, devx-track-azurepowershell, devx-track-extended-java
ms.devlang: azurecli
---

# Run the sample app: Android - Android Studio (Java or C++/NDK)

This quickstart covers how to run the [Azure Spatial Anchors](../overview.md) sample app for Android devices using Android Studio (Java or C++/NDK). Azure Spatial Anchors is a cross-platform developer service that allows you to create mixed reality experiences using objects that persist their location across devices over time. When you're finished, you'll have an ARCore Android app that can save and recall a spatial anchor.

You'll learn how to:

> [!div class="checklist"]
> * Create a Spatial Anchors account
> * Configure the Spatial Anchors account identifier and account key
> * Deploy and run on an Android device

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this quickstart, make sure you have:

- A Windows or macOS machine with <a href="https://developer.android.com/studio/" target="_blank">Android Studio 3.4+</a>.
  - If running on Windows, you'll also need <a href="https://git-scm.com/download/win" target="_blank">Git for Windows</a> and <a href="https://git-lfs.github.com/">Git LFS</a>.
  - If running on macOS, get Git installed via HomeBrew. Enter the following command into a single line of the Terminal: `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`. Then, run `brew install git` and `brew install git-lfs`.
  - To build the NDK sample, you'll also need to install the NDK and CMake 3.6 or greater SDK Tools in Android Studio.
- A <a href="https://developer.android.com/studio/debug/dev-options" target="_blank">developer enabled</a> and <a href="https://developers.google.com/ar/discover/supported-devices" target="_blank">ARCore capable</a> Android device.
  - Additional device drivers may be required for your computer to communicate with your Android device. See [here](https://developer.android.com/studio/run/device.html) for additional information and instructions.
- Your app must target ARCore **1.11.0**.

## Create a Spatial Anchors resource

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Open the sample project

# [Java](#tab/openproject-java)

[!INCLUDE [Clone Sample Repo](../../../includes/spatial-anchors-clone-sample-repository.md)]

# [NDK](#tab/openproject-ndk)

[!INCLUDE [Clone Sample Repo](../../../includes/spatial-anchors-clone-sample-repository.md)]

Download `arcore_c_api.h` from [here](https://raw.githubusercontent.com/google-ar/arcore-android-sdk/v1.11.0/libraries/include/arcore_c_api.h) and place it in `Android\NDK\libraries\include`.

From within the newly cloned repository, initialize submodules by running the following command:

```console
git submodule update --init --recursive
```

---

Open Android Studio.

# [Java](#tab/openproject-java)

Select **Open an existing Android Studio project** and select the project located at `Android/Java/`.

# [NDK](#tab/openproject-ndk)

Select **Open an existing Android Studio project** and select the project located at `Android/NDK/`.

---

## Configure account identifier and key

The next step is to configure the app to use your account identifier and account key. You copied them into a text editor when [setting up the Spatial Anchors resource](#create-a-spatial-anchors-resource).

# [Java](#tab/openproject-java)

Open `Android/Java/app/src/main/java/com/microsoft/sampleandroid/AzureSpatialAnchorsManager.java`.

Locate the `SpatialAnchorsAccountKey` field and replace `Set me` with the account key.

Locate the `SpatialAnchorsAccountId` field and replace `Set me` with the account identifier.

Locate the `SpatialAnchorsAccountDomain` field and replace `Set me` with the account domain.

# [NDK](#tab/openproject-ndk)

Open `Android/NDK/app/src/main/cpp/AzureSpatialAnchorsApplication.cpp`.

Locate the `SpatialAnchorsAccountKey` field and replace `Set me` with the account key.

Locate the `SpatialAnchorsAccountId` field and replace `Set me` with the account identifier.

Locate the `SpatialAnchorsAccountDomain` field and replace `Set me` with the account domain.

---

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
