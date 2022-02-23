---
title: Deploy an update using Device Update for Azure IoT Hub | Microsoft Docs
description: Deploy an update using Device Update for Azure IoT Hub.
author: vimeht
ms.author: vimeht
ms.date: 2/11/2021
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Deploy an Update using Device Update for IoT Hub

Learn how to deploy an update to an IoT device using Device Update for IoT Hub.

## Prerequisites

* [Access to an IoT Hub with Device Update for IoT Hub enabled](create-device-update-account.md). It is recommended that you use a S1 (Standard) tier or above for your IoT Hub. 
* [At least one update has been successfully imported for the provisioned device.](import-update.md) 
* An IoT device (or simulator) provisioned for Device Update within IoT Hub.
* [The device is part of at least one default group or user-created update group.](create-update-group.md)
* Supported browsers:
  * [Microsoft Edge](https://www.microsoft.com/edge)
  * Google Chrome

## Deploy an update

1. Go to [Azure portal](https://portal.azure.com)

2. Navigate to the Device Update blade of your IoT Hub.

  :::image type="content" source="media/deploy-update/device-update-iot-hub.png" alt-text="IoT Hub" lightbox="media/deploy-update/device-update-iot-hub.png":::

3. Select the Groups and Deployments tab at the top of the page. [Learn More](device-update-groups.md) about device groups. 

  :::image type="content" source="media/deploy-update/updated-view.png" alt-text="Groups and Deployments tab" lightbox="media/deploy-update/updated-view.png":::

4. View the update compliance chart and groups list. You should see a new update available for your device group listed under Best Update (you may need to Refresh once). [Learn More about update compliance.](device-update-compliance.md) 

5. Select the target group by clicking on the group name. You will be directed to the group details under Group basics.

  :::image type="content" source="media/deploy-update/group-basics.png" alt-text="Group details" lightbox="media/deploy-update/group-basics.png":::

6. To initiate the deployment, go to the Current deployment tab. Click the deploy link next to the desired update from the Available updates section. The best, available update for a given group will be denoted with a "Best" highlight. 

  :::image type="content" source="media/deploy-update/select-update.png" alt-text="Select update" lightbox="media/deploy-update/select-update.png":::

7. Schedule your deployment to start immediately or in the future, then select Create.
   > [!TIP]
   > By default the Start date/time is 24 hrs from your current time. Be sure to select a different date/time if you want the deployment to begin earlier.
 :::image type="content" source="media/deploy-update/create-deployment.png" alt-text="Create deployment" lightbox="media/deploy-update/create-deployment.png":::

8. The Status under Deployment details should turn to Active, and the deployed update should be marked with "(deploying)".

 :::image type="content" source="media/deploy-update/deployment-active.png" alt-text="Deployment active" lightbox="media/deploy-update/deployment-active.png":::

9. View the compliance chart. You should see the update is now in progress. 

   :::image type="content" source="media/deploy-update/update-in-progress.png" alt-text="Update in progress" lightbox="media/deploy-update/update-in-progress.png":::

10. After your device is successfully updated, you should see your compliance chart and deployment details update to reflect the same. 

   :::image type="content" source="media/deploy-update/update-succeeded.png" alt-text="Update succeeded" lightbox="media/deploy-update/update-succeeded.png":::

## Monitor an update deployment

1. Select the Deployment history tab at the top of the page.

   :::image type="content" source="media/deploy-update/deployments-history.png" alt-text="Deployment History" lightbox="media/deploy-update/deployments-history.png":::

2. Select the details link next to the deployment you created.

   :::image type="content" source="media/deploy-update/deployment-details.png" alt-text="Deployment details" lightbox="media/deploy-update/deployment-details.png":::

3. Select Refresh to view the latest status details. 


## Retry an update deployment

If your deployment fails for some reason, you can retry the deployment for failed devices. 

1. Go to the Current deployment tab from the group details.  

    :::image type="content" source="media/deploy-update/deployment-active.png" alt-text="Deployment active" lightbox="media/deploy-update/deployment-active.png":::

2. Click on "Retry failed devices" and acknowledge the confirmation notification. 

## Next steps

[Troubleshoot common issues](troubleshoot-device-update.md)
