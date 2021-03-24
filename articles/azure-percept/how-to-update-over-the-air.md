---
title: Update your Azure Percept DK over the air
description: Learn how to receive over the air updates to your Azure Percept DK
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 02/18/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Update your Azure Percept DK over the air

Follow this guide to learn how to update the carrier board of your Azure Percept DK over-the-air with Device Update for IoT Hub.

## Import your update file and manifest file.

> [!NOTE]
> If you have already imported the update, you can skip directly to **Create a Device Updated Group**.

1. Navigate to the Azure IoT Hub that you are using for your Azure Percept device. On the left-hand menu panel, select **Device Updates** under **Automatic Device Management**.
 
1. You will see several tabs across the top of the screen. Select the **Updates** tab.
 
1. Select **+ Import New Update** below the **Ready to Deploy** header.
 
1. Click on the boxes under **Select Import Manifest File** and **Select Update Files** to select the appropriate manifest file (.json) and one update file (.swu). You can find these update files for your Azure Percept device [here](https://go.microsoft.com/fwlink/?linkid=2155625).
 
1. Select the folder icon or text box under **Select a storage container**, then select the appropriate storage account.
 
1. If you’ve already created a storage container, you can re-use it. Otherwise, select **+ Container** to create a new storage container for OTA updates. Select the container you wish to use and click **Select**.
 
	>[!Note]
	>If you do not have a container you will be asked to create one.
 
1. Select **Submit** to start the import process. The submission process will take around 4 minutes.
 
	>[!Note]
	>You might be asked to add a Cross Origin Request (CORS) rule to access the selected storage container. Select **Add rule and retry** to proceed.
 
	>[!Note]
	>Due to the image size, you may see the page **Submitting…** For up to 5 min before seeing next step.
	
1. The import process begins, and you are redirected to the **Import History** tab of the **Device Updates** page. Click **Refresh** to monitor progress while the import process is completed. Depending on the size of the update, this may take a few minutes or longer (during peak times, please expect the import service to take up to 1hr).

1. When the Status column indicates the import has succeeded, select the **Ready to Deploy** tab and click **Refresh**. You should now see your imported update in the list.
 
## Create a Device Update Group
Device Update for IoT Hub allows you to target an update to specific groups of Azure Percept DKs. To create a group, you must add a tag to your target set of devices in Azure IoT Hub.

> [!NOTE]
> If you have already created a group, you can skip directly to the next step.

Group Tag Requirements:
- You can add any value to your tag except for **Uncategorized**, which is a reserved value.
- Tag value cannot exceed 255 characters.
- Tag value can only contain these special characters: “.”,”-“,”_”,”~”.
- Tag and group names are case sensitive.
- A device can only have one tag. Any subsequent tag added to the device will override the previous tag.
- A device can only belong to one group.

1. Add a Tag to your device(s).
	1. From **IoT Edge** on the left navigation pane, find your Azure Percept DK and navigate to its **Device Twin**.
	1. Add a new **Device Update for IoT Hub** tag value as shown below (Change ```<CustomTagValue>``` to your value, i.e. AzurePerceptGroup1). Learn more about device twin [JSON document tags](../iot-hub/iot-hub-devguide-device-twins.md#device-twins).

    ```
    "tags": {
    "ADUGroup": "<CustomTagValue>"
    },
    ```

 
1. Click **Save** and resolve any formatting issues.
 
1. Create a group by selecting an existing Azure IoT Hub tag.
	1. Navigate back to your Azure IoT Hub page.
	1. Select **Device Updates** under **Automatic Device Management** on the left-hand menu panel.
	1. Select the **Groups** tab. This page will display the number of ungrouped devices connected to Device Update.
	1. Select **+ Add** to create a new group.
	1. Select an IoT Hub tag from the list and click **Submit**.
	1. Once the group is created, the update compliance chart and groups list will update. The chart shows the number of devices in various states of compliance: **On latest update**, **New updates available**, **Updates in progress**, and **Not yet grouped**.
 

## Deploy an update
1. You should see your newly created group with a new update listed under **Available updates** (you may need to refresh once). Select the update.
 
1. Confirm that the correct device group is selected as the target device group. Select a **Start date** and **Start time** for your deployment, then click **Create deployment**. 

	>[!CAUTION]
	>Setting the start time in the past will trigger the deployment immediately.
 
1. Check the compliance chart. You should see the update is now in progress.
 
1. After your update has completed, your compliance chart will reflect your new update status.
 
1. Select the **Deployments** tab at the top of the **Device updates** page.
 
1. Select your deployment to view the deployment details. You may need to click **Refresh** until the **Status** changes to **Succeeded**.

## Next steps

Your dev kit is now successfully updated. You may continue development and operation with your devkit.