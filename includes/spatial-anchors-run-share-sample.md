---
author: pamistel
ms.service: azure-spatial-anchors
ms.topic: include
ms.date: 11/20/2020
ms.author: pamistel
---

## [Unity - HoloLens](#tab/UnityHoloLens)

## Open Project

[!INCLUDE [Open Unity Project](spatial-anchors-open-unity-project.md)]

## Setup Build Settings
[!INCLUDE [HoloLens Unity Build Settings](spatial-anchors-unity-hololens-build-settings.md)]

## Configure the account information
[!INCLUDE [Configure Unity Scene](spatial-anchors-unity-configure-scene.md)]

Open the Scene called **AzureSpatialAnchorsLocalSharedDemo** found in `Assets/AzureSpatialAnchors.Examples/Scenes/AzureSpatialAnchorsLocalSharedDemo` by double clicking on it on the project pane

On the Project pane, go to `Assets\AzureSpatialAnchors.Examples\Resources`. 

Select **SpatialAnchorSamplesConfig**. Then, in the **Inspector** pane, enter the `Sharing Anchors Service` URL (from your ASP.NET web app Azure deployment) as the value for `Base Sharing Url`. Append the URL with `/swagger/api/anchors`. It should look like this: `https://<your_app_name>.azurewebsites.net/swagger/api/anchors`.

Save the scene by selecting **File** > **Save**.

## Export + deploy the HoloLens application

[!INCLUDE [Export Unity Project](./spatial-anchors-unity-export-project-snip.md)]

Select **Build**. In the dialog box, select a folder in which to export the HoloLens Visual Studio project.

When the export is complete, a folder containing the exported HoloLens project will appear.

In the folder, double-click **HelloAR U3D.sln** to open the project in Visual Studio.

Change the **Solution Configuration** to **Release**, change the **Solution Platform** to **x86**, and select **Device** from the deployment target options.

If using HoloLens 2, use **ARM64** as the **Solution Platform**, instead of **x86**.

   ![Visual Studio configuration](../articles/spatial-anchors/quickstarts/media/get-started-unity-hololens/visual-studio-configuration.png)

Turn on the HoloLens device, sign in, and connect the device to the PC by using a USB cable.

Select **Debug** > **Start debugging** to deploy your app and start debugging.

## Running the app
In the app, select **LocalSharedDemo** using the arrows, then press the **Go!** button to run the demo. Follow the instructions to place and recall an anchor.

[!INCLUDE [Run shared sample](spatial-anchors-run-sample.md)]






## [Unity - Android](#tab/UnityAndroid)

## Open Project

[!INCLUDE [Open Unity Project](spatial-anchors-open-unity-project.md)]

## Setup Build Settings
[!INCLUDE [Android Unity Build Settings](spatial-anchors-unity-android-build-settings.md)]

## Configure the account information
[!INCLUDE [Configure Unity Scene](spatial-anchors-unity-configure-scene.md)]

Open the Scene called **AzureSpatialAnchorsLocalSharedDemo** found in `Assets/AzureSpatialAnchors.Examples/Scenes/AzureSpatialAnchorsLocalSharedDemo` by double clicking on it on the project pane

On the Project pane, go to `Assets\AzureSpatialAnchors.Examples\Resources`. 

Select **SpatialAnchorSamplesConfig**. Then, in the **Inspector** pane, enter the `Sharing Anchors Service` URL (from your ASP.NET web app Azure deployment) as the value for `Base Sharing Url`. Append the URL with `/swagger/api/anchors`. It should look like this: `https://<your_app_name>.azurewebsites.net/swagger/api/anchors`.

Save the scene by selecting **File** > **Save**.

## Deploy 

Sign in to your Android device and connect it to your computer by using a USB cable.

Open **Build Settings** by selecting **File** > **Build Settings**.

Under **Scenes In Build**, ensure that each scene has a check mark next to it.

Ensure that **Export Project** doesn't have a check mark. Select **Build And Run**. You'll be prompted to save your *.apk* file. You can pick any name for it.

## Running the app
In the app, select the **LocalShare** demo using the arrows, then press the **Go!** button to run the demo. Follow the instructions to place and recall an anchor.

[!INCLUDE [Run shared sample](spatial-anchors-run-sample.md)]





## [Unity - iOS](#tab/UnityIOS)

## Open Project
[!INCLUDE [Open Unity Project](spatial-anchors-open-unity-project.md)]

## Setup Build Settings

[!INCLUDE [iOS Unity Build Settings](spatial-anchors-unity-ios-build-settings.md)]

## Configure the account information
[!INCLUDE [Configure Unity Scene](spatial-anchors-unity-configure-scene.md)]

Open the Scene called **AzureSpatialAnchorsLocalSharedDemo** found in `Assets/AzureSpatialAnchors.Examples/Scenes/AzureSpatialAnchorsLocalSharedDemo` by double clicking on it on the project pane

On the Project pane, go to `Assets\AzureSpatialAnchors.Examples\Resources`. 

Select **SpatialAnchorSamplesConfig**. Then, in the **Inspector** pane, enter the `Sharing Anchors Service` URL (from your ASP.NET web app Azure deployment) as the value for `Base Sharing Url`. Append the URL with `/swagger/api/anchors`. It should look like this: `https://<your_app_name>.azurewebsites.net/swagger/api/anchors`.

Save the scene by selecting **File** > **Save**.

### Deploy to an iOS device

Open **Build Settings** by selecting **File** > **Build Settings**.

Under **Scenes In Build**, ensure that each scene has a check mark next to it.

[!INCLUDE [Configure Xcode](spatial-anchors-unity-ios-xcode.md)]

## Running the app
In the app, select the **LocalShare** demo using the arrows, then press the **Go!** button to run the demo. Follow the instructions to place and recall an anchor.

[!INCLUDE [Run shared sample](spatial-anchors-run-sample.md)]

In Xcode, stop the app by selecting **Stop**.





## [Android](#tab/Android)

The Java Android sample supports sharing across devices.

In Android Studio, open the *SharedActivity.java* file from the samples folder. 

Enter the URL that you copied in the previous step (from your ASP.NET web app Azure deployment) as the value for `SharingAnchorsServiceUrl` in the *SharedActivity.java* file. 

Replace the `index.html` in the URL with `api/anchors`. It should look like this: `https://<app_name>.azurewebsites.net/api/anchors`.

[!INCLUDE [Run shared sample](spatial-anchors-deploy-sample.md)]

[!INCLUDE [Run shared sample](spatial-anchors-run-sample.md)]





## [iOS](#tab/iOS)

The Objective-C iOS sample supports sharing across devices.

Open the *SharedDemoViewController.m* file in the samples folder. 

Enter the URL you obtained in the previous step (from your ASP.NET web app Azure deployment) as the value for `SharingAnchorsServiceUrl` in the *SharedDemoViewController.m* file. 

Replace the `index.html` in the URL with `api/anchors`. It should look like this: `https://<app_name>.azurewebsites.net/api/anchors`.

Deploy the app to your device. 

After the app starts, select the **Tap to start Shared Demo** option, and then follow the instructions in the app. You can select **Tap to locate Anchor by its anchor number** or **Tap to create Anchor and save it to the service**.

[!INCLUDE [Run shared sample](spatial-anchors-run-sample.md)]





## [Xamarin](#tab/Xamarin)

Both Xamarin Android and iOS samples support sharing across devices.

Open the *AccountDetails.cs* file in the samples folder. 

Enter the URL you obtained in the previous step (from your ASP.NET web app Azure deployment) as the value for `AnchorSharingServiceUrl` in the *AccountDetails.cs* file. 

Replace the `index.html` in the URL with `api/anchors`. It should look like this: `https://<app_name>.azurewebsites.net/api/anchors`.

[!INCLUDE [Run shared sample](spatial-anchors-deploy-sample.md)]

[!INCLUDE [Run shared sample](spatial-anchors-run-sample.md)]