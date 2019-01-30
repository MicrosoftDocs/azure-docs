---
author: ramonarguelles
ms.service: azure-spatial-anchors
ms.topic: include
ms.date: 1/29/2019
ms.author: rgarcia
---
Select **Build** to open a dialog. Then, select a folder to export the Xcode project.

When the export is complete, a folder will be displayed containing the exported Xcode project.

### Open the Xcode project

In the exported Xcode project folder, double-click on `Unity-iPhone.xcodeproj` to open the project in Xcode.

Open the `iOS/frameworks` folder in Finder. Drag and drop the `SpatialServiceApi.framework` file under the **Classes** node of the **Project navigator**. In the import dialog, make sure that **Copy items if needed** is checked.

![Import framework](./media/spatial-anchors-unity/import-framework.png)

Select the root **Unity-iPhone** node to view the project settings and select the **General** tab.

Under **Signing**, select **Automatically manage signing**. Select **Enable Automatic** in the dialog that appears to reset build settings.

Under **Deployment Info**, make sure the **Deployment Target** is set to `11.0`.

Under **Embedded Binaries**, select **Add items**. In the dialog, select `SpatialServicesApi.framework` and select **Add** to close the dialog.

![Import framework](./media/spatial-anchors-unity/configure-embedded-binaries.png)

### Deploy the app to your iOS device

Connect the iOS device to the Mac and set the **active scheme** to your iOS device.

![Select the device](./media/spatial-anchors-unity/select-device.png)

Select **Build and then run the current scheme**.

![Deploy and run](./media/spatial-anchors-unity/deploy-run.png)