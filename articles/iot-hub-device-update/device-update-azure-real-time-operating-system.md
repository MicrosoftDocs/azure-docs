---
title: Device Update for Azure Real-time-operating-system | Microsoft Docs
description: Get started with Device Update for Azure Real-time-operating-system
author: ValOlson
ms.author: valls
ms.date: 3/18/2021
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Device Update for Azure IoT Hub tutorial using Azure Real Time Operating System (RTOS)

This tutorial walks through how to create the Device Update for IoT Hub Agent in Azure RTOS NetX Duo. It also provides simple APIs for developers to integrate the Device Update capability in their application. Explore [samples](https://github.com/azure-rtos/samples/tree/PublicPreview/ADU) of key semiconductors evaluation boards that include the get started guides to learn configure, build, and deploy the over-the-air (OTA) updates to the devices.

In this tutorial you learn how to:
> [!div class="checklist"]
> * Get started
> * Tag your device
> * Create a device group
> * Deploy an image update
> * Monitor the update deployment

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
* Access to an IoT Hub. It is recommended that you use a S1 (Standard) tier or higher.
* A Device Update instance and account linked to your IoT Hub. Follow the guide to [create and link](./create-device-update-account.md) a device update account if you have not done so previously.

## Get started

Each board-specific sample Azure RTOS project contains code and documentation on how to use Device Update for IoT Hub on it. 
1. Download the board-specific sample files from [Azure RTOS and Device Update samples](https://github.com/azure-rtos/samples/tree/PublicPreview/ADU).
2. Find the docs folder from the downloaded sample.
3. From the docs, follow the steps for how to prepare Azure Resources, Account, and register IoT devices to it.
5. Next follow the docs to build a new firmware image and import manifest for your board.
6. Next publish firmware image and manifest to Device Update for IoT Hub.
7. Finally download and run the project on your device.

Learn more about [Azure RTOS](/azure/rtos/).  

## Tag your device

1. Keep the device application running from the previous step.
2. Log into [Azure portal](https://portal.azure.com) and navigate to the IoT Hub.
3. From 'IoT Devices' on the left navigation pane, find your IoT device and navigate to the Device Twin.
4. In the Device Twin, delete any existing Device Update tag value by setting them to null.
5. Add a new Device Update tag value to the root JSON object as shown below.

```JSON
    "tags": {
            "ADUGroup": "<CustomTagValue>"
            }
```


## Create update group

1. Go to the Groups and Deployments tab at the top of the page. 
   :::image type="content" source="media/create-update-group/ungrouped-devices.png" alt-text="Screenshot of ungrouped devices." lightbox="media/create-update-group/ungrouped-devices.png":::

2. Select the "Add group" button to create a new group.
   :::image type="content" source="media/create-update-group/add-group.png" alt-text="Screenshot of device group addition." lightbox="media/create-update-group/add-group.png":::

3. Select an IoT Hub tag and Device Class from the list and then select Create group.
   :::image type="content" source="media/create-update-group/select-tag.png" alt-text="Screenshot of tag selection." lightbox="media/create-update-group/select-tag.png":::

4. Once the group is created, you will see that the update compliance chart and groups list are updated.  Update compliance chart shows the count of devices in various states of compliance: On latest update, New updates available, and Updates in Progress. [Learn  about update compliance.](device-update-compliance.md)
   :::image type="content" source="media/create-update-group/updated-view.png" alt-text="Screenshot of update compliance view." lightbox="media/create-update-group/updated-view.png":::

5. You should see your newly created group and any available updates for the devices in the new group. If there are devices that don't meet the device class requirements of the group, they will show up in a corresponding invalid group. You can deploy the best available update to the new user-defined group from this view by clicking on the "Deploy" button next to the group.

[Learn more](create-update-group.md) about adding tags and creating update groups


## Deploy new firmware

1. Once the group is created, you should see a new update available for your device group, with a link to the update under Best Update (you may need to Refresh once). [Learn More about update compliance.](device-update-compliance.md) 

2. Select the target group by clicking on the group name. You will be directed to the group details under Group basics.

  :::image type="content" source="media/deploy-update/group-basics.png" alt-text="Group details" lightbox="media/deploy-update/group-basics.png":::

3. To initiate the deployment, go to the Current deployment tab. Click the deploy link next to the desired update from the Available updates section. The best, available update for a given group will be denoted with a "Best" highlight. 

  :::image type="content" source="media/deploy-update/select-update.png" alt-text="Select update" lightbox="media/deploy-update/select-update.png":::

4. Schedule your deployment to start immediately or in the future, then select Create.
   > [!TIP]
   > By default the Start date/time is 24 hrs from your current time. Be sure to select a different date/time if you want the deployment to begin earlier.
 :::image type="content" source="media/deploy-update/create-deployment.png" alt-text="Create deployment" lightbox="media/deploy-update/create-deployment.png":::

5. The Status under Deployment details should turn to Active, and the deployed update should be marked with "(deploying)".

 :::image type="content" source="media/deploy-update/deployment-active.png" alt-text="Deployment active" lightbox="media/deploy-update/deployment-active.png":::

6. View the compliance chart. You should see the update is now in progress. 

7. After your device is successfully updated, you should see your compliance chart and deployment details update to reflect the same. 

   :::image type="content" source="media/deploy-update/update-succeeded.png" alt-text="Update succeeded" lightbox="media/deploy-update/update-succeeded.png":::

## Monitor an update deployment

1. Select the Deployment history tab at the top of the page.

   :::image type="content" source="media/deploy-update/deployments-history.png" alt-text="Deployment History" lightbox="media/deploy-update/deployments-history.png":::

2. Select the details link next to the deployment you created.

   :::image type="content" source="media/deploy-update/deployment-details.png" alt-text="Deployment details" lightbox="media/deploy-update/deployment-details.png":::

3. Select Refresh to view the latest status details.


You have now completed a successful end-to-end image update using Device Update for IoT Hub on an Azure RTOS embedded device. 

## Cleanup resources

When no longer neededn clean up your device update account, instance, IoT Hub, and IoT device. 

## Next steps

To learn more about Azure RTOS and how it works with Azure IoT, view https://azure.com/rtos.
