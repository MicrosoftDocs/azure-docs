---
title: How-to guides - Deploy an update | Microsoft Docs
description: Deploy an update using Device Update for IoT Hub.
author: vimeht
ms.author: vimeht
ms.date: 2/11/2021
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Deploy Update

Learn how to deploy an update to an IoT device using Device Update for IoT Hub.

## Prerequisites

* Access to an IoT Hub with Device Update for IoT Hub enabled.
* At least one update has been successfully imported for the provisioned device.
* An IoT device (or simulator) provisioned within the IoT Hub, running either Azure RTOS or Ubuntu 18.04 x64.
* A tag has been assigned to the IoT device you are trying to update, and it is part of at least one update group

## Deploy an update

1. Go to [Azure portal](https://portal.azure.com)

2. Navigate to the Device Update blade your IoT Hub.
![IoT Hub](media/deploy-update/device-update-iot-hub.png)

3. Select the Groups tab at the top of the page.
![Groups Tab](media/deploy-update/updated-view.png)

4. View the update compliance chart and groups list. You should see a new update available for your device group, with a link to the update under Pending Updates (you may need to Refresh once). [Learn More](device-update-compliance.md) about update compliance.

5. Select the available update.

6. Confirm the correct group is selected as the target group. Schedule your deployment, then select Deploy update.
![Select Update](media/deploy-update/select-update.png)

7. View the compliance chart. You should see the update is now in progress. 
![Update in progress](media/deploy-update/update-in-progress.png)

8. After your device is successfully updated, you should see your compliance chart and deployment details update to reflect the same. 
![Update succeeded](media/deploy-update/update-succeeded.png)

## Monitor an update deployment

1. Select the Deployments tab at the top of the page.
![Deployments Tab](media/deploy-update/deployments-tab.png)

2. Select the deployment you created to view the deployment details.
![Deployment Details](media/deploy-update/deployment-details.png)

3. Select Refresh to view the latest status details. Continue this process until the status changes to Succeeded.


## Retry an update deployment

If your deployment fails for some reason, you can retry the deployment for failed devices. 

1. Go to the Deployments tab, and select the deployment that has failed. 
![Deployment Details](media/deploy-update/deployment-details.png)

2. Click on the "Failed" Device Status in the detailed Deployment information pane.

3. Click on "Retry failed devices" and acknowledge the confirmation pop-up. 

