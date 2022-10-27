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

* [Access to an IoT hub with Device Update for IoT Hub enabled](create-device-update-account.md). We recommend that you use an S1 (Standard) tier or above for your IoT Hub instance.
* [At least one update has been successfully imported for the provisioned device](import-update.md).
* An IoT device (or simulator) provisioned for Device Update within IoT Hub.
* [The device is part of at least one default group or user-created update group](create-update-group.md).
* Supported browsers:
  * [Microsoft Edge](https://www.microsoft.com/edge)
  * Google Chrome

## Deploy the update

1. Go to the [Azure portal](https://portal.azure.com).

1. Go to the **Device Update** pane of your IoT Hub instance.

    :::image type="content" source="media/deploy-update/device-update-iot-hub.png" alt-text="Screenshot that shows the Get started with the Device Update for IoT Hub page." lightbox="media/deploy-update/device-update-iot-hub.png":::

1. Select the **Groups and Deployments** tab at the top of the page. [Learn more](device-update-groups.md) about device groups.

   :::image type="content" source="media/deploy-update/updated-view.png" alt-text="Screenshot that shows the Groups and Deployments tab." lightbox="media/deploy-update/updated-view.png":::

1. View the update compliance chart and groups list. You should see a new update available for your device group listed under **Best update**. You might need to refresh once. [Learn more about update compliance](device-update-compliance.md).

1. Select the target group by selecting the group name. You're directed to the group details under **Group basics**.

   :::image type="content" source="media/deploy-update/group-basics.png" alt-text="Screenshot that shows the Group details." lightbox="media/deploy-update/group-basics.png":::

1. To start the deployment, go to the **Current deployment** tab. Select the deploy link next to the desired update from the **Available updates** section. The best available update for a given group is denoted with a **Best** highlight.

   :::image type="content" source="media/deploy-update/select-update.png" alt-text="Screenshot that shows Best highlighted." lightbox="media/deploy-update/select-update.png":::

1. Schedule your deployment to start immediately or in the future. Then select **Create**.

   > [!TIP]
   > By default, the **Start** date and time is 24 hours from your current time. Be sure to select a different date and time if you want the deployment to begin earlier.

   :::image type="content" source="media/deploy-update/create-deployment.png" alt-text="Screenshot that shows the Create deployment screen" lightbox="media/deploy-update/create-deployment.png":::

1. Under **Deployment details**, **Status** turns to **Active**. The deployed update is marked with **(deploying)**.

   :::image type="content" source="media/deploy-update/deployment-active.png" alt-text="Screenshot that shows deployment as Active." lightbox="media/deploy-update/deployment-active.png":::

1. View the compliance chart to see that the update is now in progress.

   :::image type="content" source="media/deploy-update/update-in-progress.png" alt-text="Screenshot that shows Updates in progress." lightbox="media/deploy-update/update-in-progress.png":::

1. After your device is successfully updated, you see that your compliance chart and deployment details updated to reflect the same.

   :::image type="content" source="media/deploy-update/update-succeeded.png" alt-text="Screenshot that shows the update succeeded." lightbox="media/deploy-update/update-succeeded.png":::

## Monitor the update deployment

1. Select the **Deployment history** tab at the top of the page.

   :::image type="content" source="media/deploy-update/deployments-history.png" alt-text="Screenshot that shows the Deployment history tab." lightbox="media/deploy-update/deployments-history.png":::

1. Select **Details** next to the deployment you created.

   :::image type="content" source="media/deploy-update/deployment-details.png" alt-text="Screenshot that shows deployment details." lightbox="media/deploy-update/deployment-details.png":::

1. Select **Refresh** to view the latest status details.

## Retry an update deployment

If your deployment fails for some reason, you can retry the deployment for failed devices.

1. Go to the **Current deployment** tab on the **Group details** screen.

    :::image type="content" source="media/deploy-update/deployment-active.png" alt-text="Screenshot that shows the deployment as Active." lightbox="media/deploy-update/deployment-active.png":::

1. Select **Retry failed devices** and acknowledge the confirmation notification.

## Next steps

[Troubleshoot common issues](troubleshoot-device-update.md)
