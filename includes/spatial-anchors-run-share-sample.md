---
author: ramonarguelles
ms.service: spatial-anchors
ms.topic: include
ms.date: 8/27/2020
ms.author: rgarcia
---

## [Android](#tab/Android)

The Java Android sample supports sharing across devices.

1. In Android Studio, open the *SharedActivity.java* file from the samples folder. 

1. Enter the URL that you copied in the previous step (from your ASP.NET web app Azure deployment) as the value for `SharingAnchorsServiceUrl` in the *SharedActivity.java* file. 

1. Replace the `index.html` in the URL with `api/anchors`. It should look like this: `https://<app_name>.azurewebsites.net/api/anchors`.

[!INCLUDE [Run shared sample](spatial-anchors-deploy-sample.md)]

[!INCLUDE [Run shared sample](spatial-anchors-run-sample.md)]

## [iOS](#tab/iOS)

The Objective-C iOS sample supports sharing across devices.

1. Open the *SharedDemoViewController.m* file in the samples folder. 

1. Enter the URL you obtained in the previous step (from your ASP.NET web app Azure deployment) as the value for `SharingAnchorsServiceUrl` in the *SharedDemoViewController.m* file. 

1. Replace the `index.html` in the URL with `api/anchors`. It should look like this: `https://<app_name>.azurewebsites.net/api/anchors`.

1. Deploy the app to your device. 

1. After the app starts, choose the **Tap to start Shared Demo** option, and then follow the instructions in the app. You can select **Tap to locate Anchor by its anchor number** or **Tap to create Anchor and save it to the service**.

[!INCLUDE [Run shared sample](spatial-anchors-run-sample.md)]

## [Xamarin](#tab/Xamarin)

Both Xamarin Android and iOS samples support sharing across devices.

1. Open the *AccountDetails.cs* file in the samples folder. 

1. Enter the URL you obtained in the previous step (from your ASP.NET web app Azure deployment) as the value for `AnchorSharingServiceUrl` in the *AccountDetails.cs* file. 

1. Replace the `index.html` in the URL with `api/anchors`. It should look like this: `https://<app_name>.azurewebsites.net/api/anchors`.

[!INCLUDE [Run shared sample](spatial-anchors-deploy-sample.md)]

[!INCLUDE [Run shared sample](spatial-anchors-run-sample.md)]

## [Unity](#tab/Unity)

[!INCLUDE [Open Unity Project](spatial-anchors-open-unity-project.md)]

### Set up an Android device

[!INCLUDE [Android Unity Build Settings](spatial-anchors-unity-android-build-settings.md)]

### Set up an iOS Device

[!INCLUDE [iOS Unity Build Settings](spatial-anchors-unity-ios-build-settings.md)]

[!INCLUDE [Configure Unity Scene](spatial-anchors-unity-configure-scene.md)]

1. In the **Project** pane, go to `Assets\AzureSpatialAnchors.Examples\Resources`. 

1. Select *SpatialAnchorSamplesConfig*, and then, in the **Inspector** pane, enter the `Sharing Anchors Service` URL (from your ASP.NET web app Azure deployment) as the value for `Base Sharing Url`, replacing `index.html` with `api/anchors`. It should look like this: `https://<app_name>.azurewebsites.net/api/anchors`.

1. Save the scene by selecting **File** > **Save**.

## Deploy to your device

### Deploy to an Android device

1. Sign in to your Android device and connect it to your computer by using a USB cable.

1. Open **Build Settings** by selecting **File** > **Build Settings**.

1. Under **Scenes In Build**, ensure that each scene has a check mark next to it.

1. Ensure that **Export Project** doesn't have a check mark. Select **Build And Run**. You'll be prompted to save your *.apk* file. You can pick any name for it.

[!INCLUDE [Run shared sample](spatial-anchors-run-sample.md)]

### Deploy to an iOS device

1. Open **Build Settings** by selecting **File** > **Build Settings**.

1. Under **Scenes In Build**, ensure that each scene has a check mark next to it.

[!INCLUDE [Configure Xcode](spatial-anchors-unity-ios-xcode.md)]

[!INCLUDE [Run shared sample](spatial-anchors-run-sample.md)]

1. In Xcode, stop the app by selecting **Stop**.
