---
title: Azure Device Update for IoT Hub using a Raspberry Pi image
description: Do an end-to-end image-based Azure Device Update for IoT Hub update using a Raspberry Pi 3 B+ Yocto image.
author: eshashah
ms.author: eshashah
ms.date: 12/18/2024
ms.topic: tutorial
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Tutorial: Azure Device Update for IoT Hub using a Raspberry Pi image

Device Update for Azure IoT Hub supports image-based, package-based, and script-based updates. This tutorial demonstrates an end-to-end image-based Device Update for IoT Hub update using a Yocto image on a Raspberry Pi 3 B+ board.

Image updates provide a high level of confidence in the end state of the device, and don't pose the same package and dependency management challenges as package or script based updates. It's easier to replicate the results of an image update between a preproduction and production environment, or easily adopt an A/B failover model.

In this tutorial, you:
> [!div class="checklist"]
>
> - Download and install an image update.
> - Assign a tag to your IoT device.
> - Import the image update.
> - Deploy the image update.
> - View the update deployment history.

## Prerequisites

- A [Device Update account and instance configured with an IoT hub](create-device-update-account.md).
- A Raspberry Pi 3 IoT board connected via Ethernet to hardware that can download and extract the image files and control the device.

  > [!NOTE]
  > Image updates in this tutorial were validated on a Raspberry Pi B3 board.

## Register the device and get the connection string

Add your device to the device registry in your IoT hub and get the connection string IoT Hub generates for the device.

1. In the [Azure portal](https://portal.azure.com), open the IoT hub page associated with your Device Update instance.
1. In the left navigation pane, select **Device management** > **Devices**.
1. On the **Devices** page, select **Add Device**.
1. Under **Device ID**, enter a name for the device. Ensure that **Autogenerate keys** checkbox is selected.
1. Select **Save**. The device appears in the list on the **Devices** page.
1. On the **Devices** page, select the device you registered.
1. On the device page, select the **Copy** icon next to **Connection string (primary key)**. Save this *device connection string* to use when you configure the Device Update agent.

> [!NOTE]
> For demonstration purposes, this tutorial uses a device connection string to authenticate and connect with the IoT hub. For production scenarios, it's better to use module identity and [IoT Identity Service](https://azure.github.io/iot-identity-service/) to provision devices. For more information, see [Device Update agent provisioning](device-update-agent-provisioning.md).
   
## Set up Raspberry Pi

The *Tutorial_RaspberryPi3.zip* file has all the required files for the tutorial. Download the file from the **Assets** section of the latest release on the [GitHub Device Update Releases page](https://github.com/Azure/iot-hub-device-update/releases), and unzip it.

In the extracted *Tutorial_RaspberryPi3* folder, the base image that you can flash onto the Raspberry Pi board is *adu-base-image-raspberrypi3.wic*. The base image uses a Yocto build based on the 3.4.4 release. The image has the Device Update agent and SWUpdate, which enables the Device Update dual partition update. For more information about the Yocto layers, see [Build a custom Linux-based system with Device Update agent using the Yocto Project](https://github.com/Azure/iot-hub-device-update-yocto).

The update files you import through Device Update are:

- SWUpdate file *adu-update-image-raspberrypi3-1.2.0.swu* 
- Custom SWUpdate script *example-a-b-update.sh* 
- Manifest *EDS-ADUClient.yocto-update.1.2.0.importmanifest.json*

### Use bmaptool to flash the SD card

>[!IMPORTANT]
>Azure Device Update for IoT Hub software is subject to the following license terms:
>
>- [Device update for IoT Hub license](https://github.com/Azure/iot-hub-device-update/blob/main/LICENSE)
>- [Delivery optimization client license](https://github.com/microsoft/do-client/blob/main/LICENSE)
>
>Read the license terms before using the agent. Agent installation and use constitutes acceptance of these terms. If you don't agree with the license terms, don't use the Device Update agent.

Use an OS flashing tool to install the Device Update base image on the SD card you use in the Raspberry Pi device. The following instructions use `bmaptool` to flash to the SD card. Replace the `<device>` placeholder with your device name and the `<path to image>` placeholder with the path to the downloaded image file.

1. Install the `bmap-tools` utility if you don't have it.

   ```shell
   sudo apt-get install bmap-tools
   ```

1. Locate the SD card path in */dev*. The path should look something like */dev/sd\** or */dev/mmcblk\**. You can use the `dmesg` utility to help locate the correct path.
1. Unmount all mounted partitions before flashing.

   ```shell
   sudo umount /dev/<device>
   ```

1. Make sure you have write permissions to the device.

   ```shell
   sudo chmod a+rw /dev/<device>
   ```

1. Flash the SD card.

   ```shell
   sudo bmaptool copy <path to image> /dev/<device>
   ```

   >[!TIP]
   >For faster flashing, you can download the bimap file and the image file and put them in the same directory.

## Configure the Device Update agent on Raspberry Pi

1. Make sure that the Raspberry Pi is connected to the network.

1. Secure shell (SSH) into the Raspberry Pi by using the following command in a PowerShell window:

   ```shell
   ssh raspberrypi3 -l root
   ```

### Create the Device Update configuration files

The Device Update *du-config.json* and *du-diagnostics-config.json* configuration files must be on the device. To create the files, run the following commands in the terminal signed in to the Raspberry Pi.

1. To create the *du-config.json* file or open it for editing, run the following command:

   ```bash
   nano /adu/du-config.json
   ```

1. The editor opens the *du-config.json* file. If you're creating the file, it's empty. Copy and paste the following code into the file, replacing the example values with any required configurations for your device. Replace the example `connectionData` string with the device connection string you copied in the device registration step.

   ```json
   {
      "schemaVersion": "1.0",
      "aduShellTrustedUsers": [
         "adu",
         "do"
      ],
      "manufacturer": "contoso",
      "model": "virtual-vacuum-v2",
      "agents": [
         {
         "name": "main",
         "runas": "adu",
         "connectionSource": {
            "connectionType": "string",
            "connectionData": "HostName=<hub_name>.azure-devices.net;DeviceId=<device_id>;SharedAccessKey=<device_key>" 
         },
         "manufacturer": "contoso",
         "model": "virtual-vacuum-v2"
         }
      ]
   }  
   ```

1. Press **Ctrl**+**X** to exit the editor, and enter *y* to save your changes.

1. Create the *du-diagnostics-config.json* file by using similar commands. Create and open the file:

   ```bash
   nano /adu/du-diagnostics-config.json
   ```

1. Copy and paste the following *du-diagnostics-config.json* code into the file. The values are the default Device Update log locations, and you need to change them only if your configuration differs from the default.

   ```JSON
   {
      "logComponents":[
         {
            "componentName":"adu",
            "logPath":"/adu/logs/"
         },
         {
            "componentName":"do",
            "logPath":"/var/log/deliveryoptimization-agent/"
         }
      ],
      "maxKilobytesToUploadPerLogPath":50
   }
   ```

1. Press **Ctrl**+**X** to exit the editor, and enter *y* to save your changes.

1. Use the following command to show the files located in the */adu/* directory. You should see both configuration files.

   ```bash
   ls -la /adu/
   ```

1. Use the following command to restart the Device Update system daemon and ensure configurations are applied.

   ```bash
   systemctl start deviceupdate-agent
   ```

1. Check that the agent is live by running the following command:
  
   ```bash
   systemctl status deviceupdate-agent
   ```

   Status should appear as alive and green.

## Connect to the device in IoT Hub and add a group tag

1. On the [Azure portal](https://portal.azure.com) IoT hub page for your Device Update instance, select **Device management** > **Devices** from the left navigation.
1. On the **Devices** page, select your device's name.
1. At the top of the device page, select **Device twin**.
1. On the **Device twin** page, under the `"reported"` section of the device twin `"properties"` section, look for the Linux kernel version for your device.

   For a new device that hasn't received an update from Device Update, the [DeviceManagement:DeviceInformation:1.swVersion](device-update-plug-and-play.md#device-information-interface) property value represents the firmware version running on the device. After the device has an update applied, the [AzureDeviceUpdateCore:ClientMetadata:4.installedUpdateId](device-update-plug-and-play.md#agent-metadata) property value represents the firmware version.

   The base and update image file names have the format *adu-\<image type>-image-\<machine>-\<version number>.\<extension>*. Note the version numbers to use when you import the update.

### Add a group tag

Device Update automatically organizes devices into groups based on their assigned tags and compatibility properties. Each device can belong to only one group, but groups can have multiple subgroups to sort different device classes. For more information about tags and groups, see [Manage device groups](create-update-group.md).

1. In the device twin, delete any existing Device Update tag values by setting them to null, and then add the following new Device Update group tag. If you're using a Module Identity with the Device Update agent, add the tag in the **Module Identity Twin** instead of the device twin.

   ```json
   "tags": {
       "ADUGroup": "<CustomTagValue>"
   },
   ```
   The following screenshot shows where in the file to add the tag.

   :::image type="content" source="media/import-update/device-twin-ppr.png" alt-text="Screenshot that shows twin with tag information.":::

   
1. Select **Save**.

## Import the update

1. On the [Azure portal](https://portal.azure.com) IoT hub page for your Device Update instance, select **Device Management** > **Updates** from the left navigation.
1. On the **Updates** page, select **Import a new update**.
1. On the **Import update** page, select **Select from storage container**.
1. On the **Storage accounts** page, select an existing storage account or create a new account by selecting **Storage account**.
1. On the **Containers** page, select an existing container or create a new container by selecting **Container**. You use the container to stage the update files for import.

   :::image type="content" source="media/import-update/storage-account-ppr.png" alt-text="Screenshot that shows Storage accounts and Containers.":::

   > [!TIP]
   > To avoid accidentally importing files from previous updates, use a new container each time you import an update. If you don't use a new container, be sure to delete any files from the existing container.

1. On the container page, select **Upload**. Drag and drop, or browse to and select, the following update files from the *Tutorial_RaspberryPi3* folder you downloaded:

   - *adu-update-image-raspberrypi3-1.2.0.swu* 
   - *example-a-b-update.sh* 
   - *EDS-ADUClient.yocto-update.1.2.0.importmanifest.json*

1. Select **Upload**. After they upload, the files appear on the container page.

1. On the container page, review and select the files to import, and then select **Select**.

   :::image type="content" source="media/import-update/import-select-ppr.png" alt-text="Screenshot that shows selecting uploaded files.":::

1. On the **Import update** screen, select **Import update**.

   :::image type="content" source="media/import-update/import-start-2-ppr.png" alt-text="Screenshot that shows Import update.":::

The import process begins, and the screen switches to the **Updates** screen. After the import succeeds, it appears on the **Updates** tab. For more information about the import process, see [Import an update to Device Update](import-update.md).

:::image type="content" source="media/import-update/update-ready-ppr.png" alt-text="Screenshot that shows job status.":::

## Select the device group

You can use the group tag you applied to your device to deploy the update to the device group. Select the **Groups and Deployments** tab at the top of the **Updates** page to view the list of groups and deployments and the update compliance chart.

The update compliance chart shows the count of devices in various states of compliance: **On latest update**, **New updates available**, and **Updates in progress**. For more information, see [Device Update compliance](device-update-compliance.md).

Under **Group name**, you see a list of all the device groups for devices connected to this IoT hub and their available updates, with links to deploy the updates under **Status**. Any devices that don't meet the device class requirements of a group appear in a corresponding invalid group. For more information about tags and groups, see [Manage device groups](create-update-group.md).

You should see the device group that contains the device you set up in this tutorial, along with the available updates for the devices in the group. You might need to refresh the page. To deploy the best available update to a group from this view, select **Deploy** next to the group.

:::image type="content" source="media/create-update-group/updated-view.png" alt-text="Screenshot that shows the update compliance view." lightbox="media/create-update-group/updated-view.png":::

## Deploy the update

1. On the **Group details** page, select the **Current deployment** tab, and then select **Deploy** next to the desired update in the **Available updates** section. The best available update for the group is denoted with a **Best** highlight.

   :::image type="content" source="media/deploy-update/select-update.png" alt-text="Screenshot that shows selecting an update." lightbox="media/deploy-update/select-update.png":::

1. On the **Create deployment** page, schedule your deployment to start immediately or in the future, and then select **Create**.

   :::image type="content" source="media/deploy-update/create-deployment.png" alt-text="Screenshot that shows creating a deployment." lightbox="media/deploy-update/create-deployment.png":::

   > [!TIP]
   > By default, the **Start** date and time is 24 hours from your current time. Be sure to select a different date and time if you want the deployment to begin sooner.

1. Under **Deployment details**, **Status** turns to **Active**. Under **Available updates**, the selected update is marked with **(deploying)**.

   :::image type="content" source="media/deploy-update/deployment-active.png" alt-text="Screenshot that shows the deployment as Active." lightbox="media/deploy-update/deployment-active.png":::

1. On the **Updates** page, view the compliance chart to see that the update is now in progress. After your device successfully updates, your compliance chart and deployment details update to reflect that status.

   :::image type="content" source="media/deploy-update/update-succeeded.png" alt-text="Screenshot that shows the update succeeded." lightbox="media/deploy-update/update-succeeded.png":::

## View update deployment history

To view deployment history:

1. Select the **Deployment history** tab at the top of the **Group details** page, and select the **details** link next to the deployment you created.

   :::image type="content" source="media/deploy-update/deployments-history.png" alt-text="Screenshot that shows Deployment history." lightbox="media/deploy-update/deployments-history.png":::

1. On the **Deployment details** page, select **Refresh** to view the latest status details.

   :::image type="content" source="media/deploy-update/deployment-details.png" alt-text="Screenshot that shows deployment details." lightbox="media/deploy-update/deployment-details.png":::

## Clean up resources

When you no longer need the resources you created for this tutorial, you can delete them.

1. In the [Azure portal](https://portal.azure.com), navigate to the resource group that contains the resources.
1. If you want to delete all the resources in the group, select **Delete resource group**.
1. If you want to delete only some of the resources, use the check boxes to select the resources and then select **Delete**.

## Next steps

- [Device Update for IoT Hub using a simulator agent](device-update-raspberry-pi.md)
- [Device Update for IoT Hub using a package agent](device-update-ubuntu-agent.md)

## Related content

- [Device Update accounts and instances](device-update-resources.md)
- [Device Update access control roles](device-update-control-access.md)
- [Device Update and IoT Plug and Play](device-update-plug-and-play.md)
