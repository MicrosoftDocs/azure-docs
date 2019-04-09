---
author: ramonarguelles
ms.service: spatial-anchors
ms.topic: include
ms.date: 1/30/2019
ms.author: rgarcia
---
## Set up your device

### Set up an Android Device

[!INCLUDE [Android Unity Build Settings](spatial-anchors-unity-android-build-settings.md)]

### Set up an iOS Device

[!INCLUDE [iOS Unity Build Settings](spatial-anchors-unity-ios-build-settings.md)]

## Configure account identifier and key

In the **Project** pane, navigate to `Assets/AzureSpatialAnchorsPlugin/Examples` and open the `AzureSpatialAnchorsLocalSharedDemo.unity` scene file.

[!INCLUDE [Configure Unity Scene](spatial-anchors-unity-configure-scene.md)]

Also, in the **Inspector** pane, enter the `Sharing Anchors Service url` (from your ASP.NET web app Azure deployment) as the value for `Base Sharing Url`, replacing `index.html` with `api/anchors`. So, it should look like: `https://<app_name>.azurewebsites.net/api/anchors`.

Save the scene by selecting **File** -> **Save**.

## To deploy to an Android device

Sign in on your Android device, and connect it to the PC using a USB cable.

Open **Build Settings** by selecting **File** -> **Build Settings**.

Under **Scenes In Build**, place a check mark next to the `AzureSpatialAnchorsPlugin/Examples/AzureSpatialAnchorsLocalSharedDemo` scene and clear check marks from all other scenes.

Ensure the **Export Project** checkbox does not have a check mark. Click **Build And Run**. You'll be asked to save your `.apk` file, you can pick any name for it.

Follow the instructions in the app. You can choose to **Create & Share Anchor**, or **Locate Shared Anchor**. The first option allows you to create an Anchor that can be later on located on the same device or a different one. The second option, if you have previously run the app, either on the same device or a different one, allows you to locate previously shared anchors.

## To deploy to an iOS device

Open **Build Settings** by selecting **File** -> **Build Settings**.

Under **Scenes In Build**, place a check mark next to the `AzureSpatialAnchorsPlugin/Examples/AzureSpatialAnchorsLocalSharedDemo` scene and clear check marks from all other scenes.

[!INCLUDE [Configure Xcode](spatial-anchors-unity-ios-xcode.md)]

Follow the instructions in the app. You can choose to **Create & Share Anchor**, or **Locate Shared Anchor**. The first option allows you to create an Anchor that can be later on located on the same device or a different one. The second option, if you have previously run the app, either on the same device or a different one, allows you to locate previously shared anchors.

In Xcode, stop the app by pressing **Stop**.
