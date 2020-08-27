---
author: ramonarguelles
ms.service: spatial-anchors
ms.topic: include
ms.date: 8/27/2020
ms.author: rgarcia
---

## [Android](#tab/Android)

The Java android sample supports sharing across devices.
Open the file `SharedActivity.java` from the samples folder in Android Studio. Enter the url you obtained in the previous step (from your ASP.NET web app Azure deployment) as the value for `SharingAnchorsServiceUrl` in the `SharedActivity.java` file. Replace the `index.html` in the url with `api/anchors`. It should look like this: `https://<app_name>.azurewebsites.net/api/anchors`.

[!INCLUDE [Run shared sample](spatial-anchors-run-sample.md)]

## [iOS](#tab/iOS)

The Objective-C iOS sample supports sharing across devices.
Open the file `SharedDemoViewController.m` in the samples folder. Enter the url you obtained in the previous step (from your ASP.NET web app Azure deployment) as the value for `SharingAnchorsServiceUrl` in the `SharedDemoViewController.m` file. Replace the `index.html` in the url with `api/anchors`. It should look like this: `https://<app_name>.azurewebsites.net/api/anchors`.

[!INCLUDE [Run shared sample](spatial-anchors-run-sample.md)]

## [Xamarin](#tab/Xamarin)

Both Xamarin Android and iOS samples support sharing across devices.
Open the file `AccountDetails.cs` in the samples folder. Enter the url you obtained in the previous step (from your ASP.NET web app Azure deployment) as the value for `AnchorSharingServiceUrl` in the `AccountDetails.cs` file. Replace the `index.html` in the url with `api/anchors`. It should look like this: `https://<app_name>.azurewebsites.net/api/anchors`.

[!INCLUDE [Run shared sample](spatial-anchors-run-sample.md)]

## [Unity](#tab/Unity)

[!INCLUDE [Open Unity Project](spatial-anchors-open-unity-project.md)]

### Set up an Android Device

[!INCLUDE [Android Unity Build Settings](spatial-anchors-unity-android-build-settings.md)]

### Set up an iOS Device

[!INCLUDE [iOS Unity Build Settings](spatial-anchors-unity-ios-build-settings.md)]

[!INCLUDE [Configure Unity Scene](spatial-anchors-unity-configure-scene.md)]

In the **Project** pane, navigate to `Assets\AzureSpatialAnchors.Examples\Resources`. Select `SpatialAnchorSamplesConfig`. Then, in the **Inspector** pane, enter the `Sharing Anchors Service url` (from your ASP.NET web app Azure deployment) as the value for `Base Sharing Url`, replacing `index.html` with `api/anchors`. It should look like this: `https://<app_name>.azurewebsites.net/api/anchors`.

Save the scene by selecting **File** > **Save**.

## Deploy to your device

### Deploy to Android device

Sign in on your Android device and connect it to your computer by using a USB cable.

Open **Build Settings** by selecting **File** > **Build Settings**.

Under **Scenes In Build**, ensure all the scenes have a check mark next to them.

Make sure **Export Project** doesn't have a check mark. Select **Build And Run**. You'll be prompted to save your `.apk` file. You can pick any name for it.

[!INCLUDE [Run shared sample](spatial-anchors-run-sample.md)]

### Deploy to an iOS device

Open **Build Settings** by selecting **File** > **Build Settings**.

Under **Scenes In Build**, ensure all the scenes have a check mark next to them.

[!INCLUDE [Configure Xcode](spatial-anchors-unity-ios-xcode.md)]

[!INCLUDE [Run shared sample](spatial-anchors-run-sample.md)]

In Xcode, stop the app by selecting **Stop**.
