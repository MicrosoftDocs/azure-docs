---
title: Deploy an update by using Device Update for Azure IoT Hub | Microsoft Docs
description: Deploy an update by using Device Update for Azure IoT Hub.
author: vimeht
ms.author: vimeht
ms.date: 2/11/2021
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Deploy an update by using Device Update for Azure IoT Hub

Learn how to deploy an update to an IoT device by using Device Update for Azure IoT Hub.

## Prerequisites

* [Access to an IoT Hub with Device Update for IoT Hub enabled](create-device-update-account.md). We recommend that you use an S1 (Standard) tier or above for your IoT Hub.
* An [imported update for the provisioned device](import-update.md).
* An IoT device (or simulator) provisioned for Device Update within IoT Hub.
* The device is part of at least one default group or [user-created update group](create-update-group.md).
* Supported browsers:
  * [Microsoft Edge](https://www.microsoft.com/edge)
  * Google Chrome

## Deploy the update

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.

1. Select **Updates** from the navigation menu to open the **Device Update** page of your IoT Hub instance.

    :::image type="content" source="media/deploy-update/device-update-iot-hub.png" alt-text="Screenshot that shows the Get started with the Device Update for IoT Hub page." lightbox="media/deploy-update/device-update-iot-hub.png":::

1. Select the **Groups and Deployments** tab at the top of the page. For more information, see [Device groups](device-update-groups.md).

   :::image type="content" source="media/deploy-update/updated-view.png" alt-text="Screenshot that shows the Groups and Deployments tab." lightbox="media/deploy-update/updated-view.png":::

1. View the update compliance chart and group list. You should see a new update available for your tag based or default group. You might need to refresh once. For more information, see [Device Update compliance](device-update-compliance.md).

1. Select Deploy next to the **one or more updates available**, and confirm that the descriptive label you added when importing is present and looks correct.

1. Confirm that the correct group is selected as the target group and select **Deploy**.

1. To start the deployment, go to the **Current deployment** tab. Select the **Deploy** link next to the desired update from the **Available updates** section. The best available update for a given group is denoted with a **Best** highlight.

   :::image type="content" source="media/deploy-update/select-update.png" alt-text="Screenshot that shows Best highlighted." lightbox="media/deploy-update/select-update.png":::

1. Schedule your deployment to start immediately or in the future.

   > [!TIP]
   > By default, the **Start** date and time is 24 hours from your current time. Be sure to select a different date and time if you want the deployment to begin earlier.

   :::image type="content" source="media/deploy-update/create-deployment.png" alt-text="Screenshot that shows the Create deployment screen" lightbox="media/deploy-update/create-deployment.png":::

1. Create an automatic rollback policy if needed. Then select **Create**.

1. In the deployment details, **Status** turns to **Active**. The deployed update is marked with **(deploying)**.

   :::image type="content" source="media/deploy-update/deployment-active.png" alt-text="Screenshot that shows deployment as Active." lightbox="media/deploy-update/deployment-active.png":::

1. View the compliance chart to see that the update is now in progress.

   :::image type="content" source="media/deploy-update/update-in-progress.png" alt-text="Screenshot that shows Updates in progress." lightbox="media/deploy-update/update-in-progress.png":::

1. After your device is successfully updated, you see that your compliance chart and deployment details updated to reflect the same.

   :::image type="content" source="media/deploy-update/update-succeeded.png" alt-text="Screenshot that shows the update succeeded." lightbox="media/deploy-update/update-succeeded.png":::

## Monitor the update deployment

1. Select the group you deployed to, and go to the **Current updates** or **Deployment history** tab to confirm that the deployment is in progress

   :::image type="content" source="media/deploy-update/deployments-history.png" alt-text="Screenshot that shows the Deployment history tab." lightbox="media/deploy-update/deployments-history.png":::

1. Select **Details** next to the deployment you created. Here you can view the deployment details, update details, and target device class details. You can optionally add a friendly name for the device class.

   :::image type="content" source="media/deploy-update/deployment-details.png" alt-text="Screenshot that shows deployment details." lightbox="media/deploy-update/deployment-details.png":::

1. Select **Refresh** to view the latest status details.

1. You can go to the group basics view to search the status for a particular device, or filter to view devices that have failed the deployment

## Retry an update deployment

If your deployment fails for some reason, you can retry the deployment for failed devices.

1. Go to the **Current deployment** tab on the **Group details** screen.

    :::image type="content" source="media/deploy-update/deployment-active.png" alt-text="Screenshot that shows the deployment as Active." lightbox="media/deploy-update/deployment-active.png":::

1. Select **Retry failed devices** and acknowledge the confirmation notification.

## Next steps

[Troubleshoot common issues](troubleshoot-device-update.md)
