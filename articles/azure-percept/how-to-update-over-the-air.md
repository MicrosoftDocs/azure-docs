---
title: Update your Azure Percept DK over-the-air (OTA)
description: Learn how to receive over-the air (OTA) updates to your Azure Percept DK
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 03/30/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Update your Azure Percept DK over-the-air (OTA)

Follow this guide to learn how to update the OS and firmware of the carrier board of your Azure Percept DK over-the-air (OTA) with Device Update for IoT Hub.

## Prerequisites

- Azure Percept DK (devkit)
- [Azure subscription](https://azure.microsoft.com/free/)
- [Azure Percept DK setup experience](./quickstart-percept-dk-set-up.md): you connected your dev kit to a Wi-Fi network, created an IoT Hub, and connected your dev kit to the IoT Hub
- [Device Update for IoT Hub has been successfully configured](./how-to-set-up-over-the-air-updates.md)

## Import your update file and manifest file

> [!NOTE]
> If you have already imported the update, you can skip directly to **Create a device update group**.

1. [Download the latest manifest file (.json)](https://go.microsoft.com/fwlink/?linkid=2155625) and [update file (.swu)](https://go.microsoft.com/fwlink/?linkid=2161538) for your Azure Percept device.

1. Navigate to the Azure IoT Hub that you are using for your Azure Percept device. On the left-hand menu panel, select **Device Updates** under **Automatic Device Management**.

1. You will see several tabs across the top of the screen. Select the **Updates** tab.

1. Select **+ Import New Update** below the **Ready to Deploy** header.

1. Click on the boxes under **Select Import Manifest File** and **Select Update Files** to select your manifest file (.json) and update file (.swu).

1. Select the folder icon or text box under **Select a storage container** and select the appropriate storage account. If you’ve already created a storage container, you may re-use it. Otherwise, select **+ Container** to create a new storage container for OTA updates. Select the container you wish to use and click **Select**.

1. Select **Submit** to start the import process. Due to the image size, the submission process may take up to 5 minutes.

    > [!NOTE]
    > You may be asked to add a Cross Origin Request (CORS) rule to access the selected storage container. Select **Add rule and retry** to proceed.

1. When the import process begins, you will be redirected to the **Import History** tab of the **Device Updates** page. Click **Refresh** to monitor progress while the import process is completed. Depending on the size of the update, this may take a few minutes or longer (during peak times, the import service may to take up to 1 hour).

1. When the **Status** column indicates that the import has succeeded, select the **Ready to Deploy** tab and click **Refresh**. You should now see your imported update in the list.

## Create a device update group

Device Update for IoT Hub allows you to target an update to specific groups of Azure Percept DKs. To create a group, you must add a tag to your target set of devices in Azure IoT Hub.

> [!NOTE]
> If you have already created a group, you can skip to the next section.

Group Tag Requirements:

- You can add any value to your tag except for "Uncategorized", which is a reserved value.
- Tag value cannot exceed 255 characters.
- Tag value can only contain these special characters: “.”,”-“,”_”,”~”.
- Tag and group names are case sensitive.
- A device can only have one tag. Any subsequent tag added to the device will override the previous tag.
- A device can only belong to one group.

1. Add a Tag to your device(s):

	1. From **IoT Edge** on the left navigation pane, find your Azure Percept DK and navigate to its **Device Twin**.

	1. Add a new **Device Update for IoT Hub** tag value as shown below (```<CustomTagValue>``` refers to your tag value/name, e.g. AzurePerceptGroup1). Learn more about device twin [JSON document tags](../iot-hub/iot-hub-devguide-device-twins.md#device-twins).

        ```
        "tags": {
        "ADUGroup": "<CustomTagValue>"
        },
        ```

1. Click **Save** and resolve any formatting issues.

1. Create a group by selecting an existing Azure IoT Hub tag:

	1. Navigate back to your Azure IoT Hub page.

	1. Select **Device Updates** under **Automatic Device Management** on the left-hand menu panel.

	1. Select the **Groups** tab. This page will display the number of ungrouped devices connected to Device Update.

	1. Select **+ Add** to create a new group.

	1. Select an IoT Hub tag from the list and click **Submit**.

	1. Once the group is created, the update compliance chart and groups list will update. The chart shows the number of devices in various states of compliance: **On latest update**, **New updates available**, **Updates in progress**, and **Not yet grouped**.

## Deploy an update

1. You should see your newly created group with a new update listed under **Available updates** (you may need to refresh once). Select the update.

1. Confirm that the correct device group is selected as the target device group. Select a **Start date** and **Start time** for your deployment, then click **Create deployment**.

    > [!CAUTION]
    > Setting the start time in the past will trigger the deployment immediately.

1. Check the compliance chart. You should see the update is now in progress.

1. After your update has completed, your compliance chart will reflect your new update status.

1. Select the **Deployments** tab at the top of the **Device updates** page.

1. Select your deployment to view the deployment details. You may need to click **Refresh** until the **Status** changes to **Succeeded**.

## Next steps

Your dev kit is now successfully updated. You may continue development and operation with your dev kit.
