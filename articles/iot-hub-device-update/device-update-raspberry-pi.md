---
title: Device Update for Azure IoT Hub tutorial using the Raspberry Pi 3 B+ Reference Yocto Image | Microsoft Docs
description: Get started with Device Update for Azure IoT Hub using the Raspberry Pi 3 B+ Reference Yocto Image.
author: valls
ms.author: valls
ms.date: 2/11/2021
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Device Update for Azure IoT Hub tutorial using the Raspberry Pi 3 B+ Reference Image

Device Update for IoT Hub supports two forms of updates – image-based
and package-based.

Image updates provide a higher level of confidence in the end-state of the device. It is typically easier to replicate the results of an image-update between a pre-production environment and a production environment, since it doesn’t pose the same challenges as packages and their dependencies. Due to their atomic nature, one can also adopt an A/B failover model easily.

This tutorial walks you through the steps to complete an end-to-end image-based update using Device Update for IoT Hub. 

In this tutorial you will learn how to:
> [!div class="checklist"]
> * Download image
> * Add a tag to your IoT device
> * Import an update
> * Create a device group
> * Deploy an image update
> * Monitor the update deployment

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
* Access to an IoT Hub. It is recommended that you use a S1 (Standard) tier or above.

## Download image

There are three images available as a part of the "Assets" in a given
[Device Update GitHub release](https://github.com/Azure/iot-hub-device-update/releases). The base image (adu-base-image) and one update image (adu-update-image) are provided so you can try rollouts to different versions without needing to flash the SD card on the device. To do so, you'll need to upload the update images to the Device Update for IoT Hub
Service, as a part of the import.

## Flash SD card with image

Using your favorite OS flashing tool, install the Device Update base image
(adu-base-image) on the SD Card that will be used in the Raspberry Pi 3 B+
device.

### Using bmaptool to flash SD card

1. If you have not already, install the `bmaptool` utility.

   ```shell
   sudo apt-get install bmap-tools
   ```

2. Locate the path for the SD card in `/dev`. The path should look something
   like `/dev/sd*` or `/dev/mmcblk*`. You can use the `dmesg` utility to help
   locate the correct path.

3. You will need to unmount all mounted partitions before flashing.

   ```shell
   sudo umount /dev/<device>
   ```

4. Make sure you have write permissions to the device.

   ```shell
   sudo chmod a+rw /dev/<device>
   ```

5. Optional. For faster flashing, download the bimap file along with the image
   file and place them in the same directory.

6. Flash the SD card.

   ```shell
   sudo bmaptool copy <path to image> /dev/<device>
   ```
   
Device Update for Azure IoT Hub software is subject to the following license terms:
   * [Device update for IoT Hub license](https://github.com/Azure/iot-hub-device-update/blob/main/LICENSE.md)
   * [Delivery optimization client license](https://github.com/microsoft/do-client/blob/main/LICENSE.md)
   
Read the license terms prior to using the agent. Your installation and use constitutes your acceptance of these terms. If you do not agree with the license terms, do not use the Device update for IoT Hub agent.

## Create device in IoT Hub and get connection string

Now, the device needs to be added to the Azure IoT Hub.  From within Azure
IoT Hub, a connection string will be generated for the device.

1. From the Azure portal, launch the Device Update IoT Hub.
2. Create a new device.
3. On the left-hand side of the page, navigate to 'Explorers' > 'IoT Devices' >
   Select "New".
4. Provide a name for the device under 'Device ID'--Ensure that "Autogenerate
   keys" is checkbox is selected.
5. Select 'Save'.
6. Now you will be returned to the 'Devices' page and the device you created should be in the list. Select that device.
7. In the device view, select the 'Copy' icon next to 'Primary Connection
   String'.
8. Paste the copied characters somewhere for later use in the steps below.
   **This copied string is your device connection string**.

## Provision connection string on SD card

1. Make sure that the Raspberry Pi3 is connected to the network.
2. In PowerShell, use the below command to ssh into the device
   ```markdown
   ssh raspberrypi3 -l root
      ```
4. Enter login as 'root', and password should be left as empty.
5. After you successfully ssh into the device, run the below commands
 
Replace `<device connection string>` with your connection string
 ```markdown
	echo "connection_string=<device connection string>" > adu-conf.txt  
	echo "aduc_manufacturer=ADUTeam" >> adu-conf.txt
	echo "aduc_model=RefDevice" >> adu-conf.txt
   ```

## Connect the device in Device Update IoT Hub

1. On the left-hand side of the page, select 'IoT Devices' under 'Explorers'.
2. Select the link with your device name.
3. At the top of the page, select 'Device Twin'.
4. Under the 'reported' section of the device twin properties, look for the Linux kernel version.
For a new device, which hasn't received an update from Device Update, the
[DeviceManagement:DeviceInformation:1.swVersion](device-update-plug-and-play.md) value will represent
the firmware version running on the device.  Once an update has been applied to a device, Device Update will
use [AzureDeviceUpdateCore:ClientMetadata:4.installedUpdateId](device-update-plug-and-play.md) property
value to represent the firmware version running on the device.
5. The base and update image files have a version number in the filename.

   ```markdown
   adu-<image type>-image-<machine>-<version number>.<extension>
   ```

Use that version number in the Import Update step below.

## Add a tag to your device

1. Log into [Azure portal](https://portal.azure.com) and navigate to the IoT Hub.

2. From 'IoT Devices' or 'IoT Edge' on the left navigation pane find your IoT device and navigate to the Device Twin.

3. In the Device Twin, delete any existing Device Update tag value by setting them to null.

4. Add a new Device Update tag value as shown below.

```JSON
    "tags": {
            "ADUGroup": "<CustomTagValue>"
            }
```

## Import update

1. Create an Import Manifest following these [instructions](import-update.md).
2. Select the Device Updates option under Automatic Device Management from the left-hand navigation bar.
3. Select the Updates tab.
4. Select "+ Import New Update".
5. Select the folder icon or text box under "Select an Import Manifest File". You will see a file picker dialog. Select the Import Manifest you created above.  Next, select the folder icon or text box under "Select one or more update files". You will see a file picker dialog. Select the update file that you wish to deploy to your IoT devices.
   
   :::image type="content" source="media/import-update/select-update-files.png" alt-text="Screenshot showing update file selection." lightbox="media/import-update/select-update-files.png":::

5. Select the folder icon or text box under "Select a storage container". Then select the appropriate storage account.

6. If you’ve already created a container, you can reuse it. (Otherwise, select "+ Container" to create a new storage container for updates.).  Select the container you wish to use and click "Select".
  
  :::image type="content" source="media/import-update/container.png" alt-text="Screenshot showing container selection." lightbox="media/import-update/container.png":::

7. Select "Submit" to start the import process.

8. The import process begins, and the screen changes to the "Import History" section. Select "Refresh" to view progress until the import process completes. Depending on the size of the update, this may complete in a few minutes but could take longer.
   
   :::image type="content" source="media/import-update/update-publishing-sequence-2.png" alt-text="Screenshot showing update import sequence." lightbox="media/import-update/update-publishing-sequence-2.png":::

9. When the Status column indicates the import has succeeded, select the "Ready to Deploy" header. You should see your imported update in the list now.

[Learn more](import-update.md) about importing updates.

## Create update group

1. Go to the IoT Hub you previously connected to your Device Update instance.

2. Select the Device Updates option under Automatic Device Management from the left-hand navigation bar.

3. Select the Groups tab at the top of the page. 

4. Select the Add button to create a new group.

5. Select the IoT Hub tag you created in the previous step from the list. Select Create update group.

   :::image type="content" source="media/create-update-group/select-tag.PNG" alt-text="Screenshot showing tag selection." lightbox="media/create-update-group/select-tag.PNG":::

[Learn more](create-update-group.md) about adding tags and creating update groups


## Deploy update

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

## Clean up resources

When no longer needed, clean up your device update account, instance, IoT Hub and IoT device. 

## Next steps

> [!div class="nextstepaction"]
> [Simulator Reference Agent](device-update-simulator.md)
