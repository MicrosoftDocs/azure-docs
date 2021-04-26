---
title: Device Update for Azure Real-time-operating-system | Microsoft Docs
description: Get started with Device Update for Azure Real-time-operating-system
author: valls
ms.author: valls
ms.date: 3/18/2021
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Device Update for Azure IoT Hub tutorial using Azure Real Time Operating System (RTOS)

This tutorial will walk through how to create the Device Update for IoT Hub Agent in Azure RTOS NetX Duo. It also provides simple APIs for developers to integrate the Device Update capability in their application. Explore [samples](https://github.com/azure-rtos/samples/tree/PublicPreview/ADU) of key semiconductors evaluation boards that include the get started guides to learn configure, build, and deploy the over-the-air (OTA) updates to the devices.

In this tutorial you will learn how to:
> [!div class="checklist"]
> * Get started
> * Tag your device
> * Create a device group
> * Deploy an image update
> * Monitor the update deployment

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
* Access to an IoT Hub. It is recommended that you use a S1 (Standard) tier or above.
* A Device Update instance and account linked to your IoT Hub. Follow the guide to [create and link](create-device-update-account.md) a device update account if you have not done so previously.

## Get started

Each board-specific sample Azure RTOS project contains code and documentation on how to use Device Update for IoT Hub on it. 
1. Download the board-specific sample files from [Azure RTOS and Device Update samples](https://github.com/azure-rtos/samples/tree/PublicPreview/ADU).
2. Find the docs folder from the downloaded sample.
3. From the docs follow the steps for how to prepare Azure Resources, Account, and register IoT devices to it.
5. Next follow the docs to build a new firmware image and import manifest for your board.
6. Next publish firmware image and manifest to Device Update for IoT Hub.
7. Finally download and run the project on your device.

Learn more about [Azure RTOS](https://docs.microsoft.com/azure/rtos/).  

## Tag your device

1. Keep the device application running from the previous step.
2. Log into [Azure portal](https://portal.azure.com) and navigate to the IoT Hub.
3. From 'IoT Devices' on the left navigation pane, find your IoT device and navigate to the Device Twin.
4. In the Device Twin, delete any existing Device Update tag value by setting them to null.
5. Add a new Device Update tag value as shown below.

```JSON
    "tags": {
            "ADUGroup": "<CustomTagValue>"
            }
```

## Create update group

1. Go to the IoT Hub you previously connected to your Device Update instance.
2. Select the Device Updates option under Automatic Device Management from the left-hand navigation bar.
3. Select the Groups tab at the top of the page. 
4. Select the Add button to create a new group.
5. Select the IoT Hub tag you created in the previous step from the list. Select Create update group.

   :::image type="content" source="media/create-update-group/select-tag.PNG" alt-text="Screenshot showing tag selection." lightbox="media/create-update-group/select-tag.PNG":::

[Learn more](create-update-group.md) about adding tags and creating update groups

## Deploy new firmware

1. Once the group is created, you should see a new update available for your device group, with a link to the update under Pending Updates. You may need to Refresh once. 
2. Click on the available update.
3. Confirm the correct group is selected as the target group. Schedule your deployment, then select Deploy update.

   :::image type="content" source="media/deploy-update/select-update.png" alt-text="Select update" lightbox="media/deploy-update/select-update.png":::

4. View the compliance chart. You should see the update is now in progress. 

   :::image type="content" source="media/deploy-update/update-in-progress.png" alt-text="Update in progress" lightbox="media/deploy-update/update-in-progress.png":::

5. After your device is successfully updated, you should see your compliance chart and deployment details update to reflect the same. 

   :::image type="content" source="media/deploy-update/update-succeeded.png" alt-text="Update succeeded" lightbox="media/deploy-update/update-succeeded.png":::

## Monitor an update deployment

1. Select the Deployments tab at the top of the page.

   :::image type="content" source="media/deploy-update/deployments-tab.png" alt-text="Deployments tab" lightbox="media/deploy-update/deployments-tab.png":::

2. Select the deployment you created to view the deployment details.

   :::image type="content" source="media/deploy-update/deployment-details.png" alt-text="Deployment details" lightbox="media/deploy-update/deployment-details.png":::

3. Select Refresh to view the latest status details. Continue this process until the status changes to Succeeded.

You have now completed a successful end-to-end image update using Device Update for IoT Hub on a Raspberry Pi 3 B+ device. 

## Cleanup resources

When no longer needed cleanup your device update account, instance, IoT Hub and IoT device. 

## Next steps

To learn more about Azure RTOS and how it works with Azure IoT, view https://azure.com/rtos.
