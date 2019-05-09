---
author: ramonarguelles
ms.service: spatial-anchors
ms.topic: include
ms.date: 1/30/2019
ms.author: rgarcia
---
## Set up your device

In Unity, open the project in the `Unity` folder.

![Unity window](./media/spatial-anchors-unity/unity-window.png)

### Set up an Android Device

[!INCLUDE [Android Unity Build Settings](spatial-anchors-unity-android-build-settings.md)]

### Set up an iOS Device

[!INCLUDE [iOS Unity Build Settings](spatial-anchors-unity-ios-build-settings.md)]

## Configure the account identifier and key

In the **Project** pane, navigate to `Assets/AzureSpatialAnchorsPlugin/Examples` and open the `AzureSpatialAnchorsLocalSharedDemo.unity` scene file.

[!INCLUDE [Configure Unity Scene](spatial-anchors-unity-configure-scene.md)]

In the **Inspector** pane, enter the `Sharing Anchors Service url` (from your ASP.NET web app Azure deployment) as the value for `Base Sharing Url`, replacing `index.html` with `api/anchors`. It should look like this: `https://<app_name>.azurewebsites.net/api/anchors`.

Save the scene by selecting **File** > **Save**.

## Deploy to your device

### Deploy to Android device

Sign in on your Android device and connect it to your computer by using a USB cable.

Open **Build Settings** by selecting **File** > **Build Settings**.

Under **Scenes In Build**, place a check mark next to the `AzureSpatialAnchorsPlugin/Examples/AzureSpatialAnchorsLocalSharedDemo` scene and clear the check marks from all other scenes.

Make sure **Export Project** doesn't have a check mark. Select **Build And Run**. You'll be prompted to save your `.apk` file. You can pick any name for it.

Follow the instructions in the app. You can select **Create & Share Anchor** or **Locate Shared Anchor**. The first scenario lets you create an anchor that can be located later on the same device or on a different one. The second scenario, if you've already run the app, either on the same device or on a different one, allows you to locate previously shared anchors. After you pick your scenario, the app will guide you with further instructions around what do to. For example, you'll be asked to move around your device to collect environment information. Later on, you'll place an anchor in the world, will wait while it uploads, and so on.

### Deploy to an iOS device

Open **Build Settings** by selecting **File** > **Build Settings**.

Under **Scenes In Build**, place a check mark next to the `AzureSpatialAnchorsPlugin/Examples/AzureSpatialAnchorsLocalSharedDemo` scene and clear the check marks from all other scenes.

[!INCLUDE [Configure Xcode](spatial-anchors-unity-ios-xcode.md)]

Follow the instructions in the app. You can select **Create & Share Anchor** or **Locate Shared Anchor**. The first scenario lets you create an anchor that can be located later on the same device or on a different one. The second scenario, if you've already run the app, either on the same device or on a different one, allows you to locate previously shared anchors. After you pick your scenario, the app will guide you with further instructions around what do to. For example, you'll be asked to move around your device to collect environment information. Later on, you'll place an anchor in the world, will wait while it uploads, and so on.

In Xcode, stop the app by selecting **Stop**.
