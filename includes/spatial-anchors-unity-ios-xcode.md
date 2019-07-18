---
author: ramonarguelles
ms.service: azure-spatial-anchors
ms.topic: include
ms.date: 1/29/2019
ms.author: rgarcia
---
Select **Build**. In the dialog box that opens, select a folder to export the Xcode project to.

When the export is complete, a folder that contains the exported Xcode project will appear.

> [!NOTE]
> If a window asking you if you want to replace or append appears, we recommend that you select **Append** because it's faster. You should only need to select **Replace**
> if you're changing assets in your scene. (For example, if you're adding, removing, or changing parent/child relationships, or if you're adding, removing, or changing properties.) If you're only
> making source code changes, **Append** should be enough.

### Open the Xcode project

In the exported Xcode project folder, run this command in the Terminal to install the necessary CocoaPods for the project:

```bash
pod install --repo-update
```

Now you can open `Unity-iPhone.xcworkspace` to open the project in Xcode:

```bash
open ./Unity-iPhone.xcworkspace
```

> [!NOTE]
> If you see a `library not found for -lPods-Unity-iPhone` error, you probably opened the `.xcodeproj` file instead of the
> `.xcworkspace` file. 

Select the root **Unity-iPhone** node to view the project settings, and then select the **General** tab.

Under **Signing**, make sure **Automatically manage signing** is enabled. If it's not, enable it, and then select **Enable Automatic** in the dialog box that appears to reset the build settings.

Under **Deployment Info**, make sure the **Deployment Target** is set to `11.0`.

### Deploy the app to your iOS device

Connect the iOS device to the Mac and set the **active scheme** to your iOS device.

![Select the device](./media/spatial-anchors-unity/select-device.png)

Select **Build and then run the current scheme**.

![Deploy and run](./media/spatial-anchors-unity/deploy-run.png)