---
title: Device Update for Azure IoT Hub tutorial using the Ubuntu Server 18.04 x64 Package agent | Microsoft Docs
description: Get started with Device Update for Azure IoT Hub using the Ubuntu Server 18.04 x64 Package agent.
author: vimeht
ms.author: vimeht
ms.date: 2/16/2021
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Getting Started using Ubuntu Server 18.04 x64 Package agent
This tutorial walks you through the steps to complete an end-to-end package-based update through Device Update for IoT Hub. We will use a sample package agent for Ubuntu Server 18.04 x64 for this tutorial. 

Pre-requisites:
* A VM or an IoT device running Ubuntu Server 18.04 x64, connected to IoT Hub. 
* Device Update account and instance linked to the same IoT Hub as above. [Learn more](create-device-update-account.md) about creating device update account

## Download update agent packages

Download the latest .deb packages from the specified location and copy them to
your pre-provisioned Azure IoT or Azure IoT Edge device running Ubuntu Server 18.04 x64.

Delivery Optimization Plugin: Download [here](https://github.com/microsoft/do-client/releases)

Delivery Optimization SDK: Download [here](https://github.com/microsoft/do-client/releases)

Delivery Optimization Simple Client: Download [here](https://github.com/microsoft/do-client/releases)

Device Update Agent: Download [here](https://github.com/Azure/iot-hub-device-update)

## Install Device Update .deb agent packages

1. Copy over your downloaded .deb packages to your IoT device from your host machine using PowerShell.

   ```shell
   PS> scp '<PATH_TO_DOWNLOADED_FILES>\*.deb' <USERNAME>@<EDGE IP ADDRESS>:~
   ```

2. Use apt-get to install the packages in the specified order

   * Delivery Optimization Simple Client (ms-doclient-lite)
   * Delivery Optimization SDK (ms-dosdkcpp)
   * Delivery Optimization Plugin for APT (ms-dopapt)
   * ADU Agent (adu-agent)

   ```shell
   sudo apt-get -y install ./<NAME_OF_PACKAGE>.deb
   ```

## Configure Device Update Agent

1. Open the Device Update configuration file

   ```shell
   sudo nano /etc/adu/adu-conf.txt
   ```

2. Provide your primary connection string in the configuration file. To find a device's connection string go to Azure Portal. Go to IoT device blade in IoT Hub. Click on device details page after clicking on the device name.

3. Press Ctrl+X, Y, Enter to save and close the file

4. Restart the Device Update Agent daemon

   ```shell
   sudo systemctl restart adu-agent
   ```

5. Optionally, you can verify that the services are running by

   ```shell
   sudo systemctl list-units --type=service | grep 'adu-agent\.service\|do-client-lite\.service'
   ```

The output should read:

```markdown
adu-agent.service                   loaded active running Device Update for IoT Hub Agent daemon.

do-client-lite.service               loaded active running do-client-lite.service: Performs content delivery optimization tasks   `
```

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

1. Download the following apt manifest and import manifest files. This apt manifest will install v1.0.0 of foo package to your IoT device. 

2. In Azure Portal, select the Device Updates option under Automatic Device Management from the left-hand navigation bar in your IoT Hub.

2. Select the Updates tab.

3. Select "+ Import New Update".

4. Select the folder icon or text box under "Select an Import Manifest File". You will see a file picker dialog. Select the Import Manifest you downloaded previously. Next, select the folder icon or text box under "Select one or more update files". You will see a file picker dialog. Select the apt manifest update file you downloaded previously.
   ::image type="content" source="media/import-update/select-update-files.png" alt-text="Screenshot showing update file selection." lightbox="media/import-update/select-update-files.png":::

5. Select the folder icon or text box under "Select a storage container". Then select the appropriate storage account.

6. If you’ve already created a container, you can reuse it. (Otherwise, select "+ Container" to create a new storage container for updates.).  Select the container you wish to use and click "Select".
   ::image type="content" source="media/import-update/container.png" alt-text="Screenshot showing container selection." lightbox="media/import-update/container.png":::

7. Select "Submit" to start the import process.

8. The import process begins, and the screen changes to the "Import History" section. Select "Refresh" to view progress until the import process completes. Depending on the size of the update, this may complete in a few minutes but could take longer.
   ::image type="content" source="media/import-update/update-publishing-sequence-2.png" alt-text="Screenshot showing update import sequence." lightbox="media/import-update/update-publishing-sequence-2.png":::

9. When the Status column indicates the import has succeeded, select the "Ready to Deploy" header. You should see your imported update in the list now.

[Learn more](import-update.md) about importing updates.

## Create update group

1. Go to the IoT Hub you previously connected to your Device Update instance.

2. Select the Device Updates option under Automatic Device Management from the left-hand navigation bar.

3. Select the Groups tab at the top of the page. 

4. Select the Add button to create a new group.

5. Select the IoT Hub tag you created in the previous step from the list. Select Create update group.
   ::image type="content" source="media/create-update-group/select-tag.PNG" alt-text="Screenshot showing tag selection." lightbox="media/create-update-group/select-tag.PNG":::

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

You have now completed a successful end-to-end package update using Device Update for IoT Hub on a Ubuntu Server 18.04 x64 device. 

## Next steps

[Image Update on Raspberry Pi 3 B+ tutorial](device-update-raspberry-pi.md)

[Image Update on Ubuntu 18.04 x64 simulator tutorial](device-update-simulator.md)
