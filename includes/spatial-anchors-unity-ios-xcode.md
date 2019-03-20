---
author: ramonarguelles
ms.service: azure-spatial-anchors
ms.topic: include
ms.date: 1/29/2019
ms.author: rgarcia
---
Select **Build** to open a dialog. Then, select a folder to export the Xcode project.

When the export is complete, a folder will be displayed containing the exported Xcode project.

> [!NOTE]
> If a dialog pops up asking if you want to **Replace** or **Append**, **Append** is recommended, since it is faster. You should only need to perform a **Replace**
> if you are changing Assets in your Scene (adding, removing, changing parent/child relationships, adding/removing/changing properties, etc). If you are only
> making source code changes, **Append** should be enough.

### Open the Xcode project

In the exported Xcode project folder, run the following command in the Terminal to install the necessary CocoaPods for the project:

```bash
pod install --repo-update
```

Now your can open `Unity-iPhone.xcworkspace` to open the project in Xcode:

```bash
open ./Unity-iPhone.xcworkspace
```

> [!NOTE]
> If you see a `library not found for -lPods-Unity-iPhone` error, you likely opened the `.xcodeproj` file instead of the
> `.xcworkspace`. Open the `.xcworkspace` and try again.

Select the root **Unity-iPhone** node to view the project settings and select the **General** tab.

Under **Signing**, check that **Automatically manage signing** is enabled. If it is not, activate it, and select **Enable Automatic** in the dialog that appears to reset build settings.

Under **Deployment Info**, make sure the **Deployment Target** is set to `11.0`.

### Deploy the app to your iOS device

Connect the iOS device to the Mac and set the **active scheme** to your iOS device.

![Select the device](./media/spatial-anchors-unity/select-device.png)

Select **Build and then run the current scheme**.

![Deploy and run](./media/spatial-anchors-unity/deploy-run.png)