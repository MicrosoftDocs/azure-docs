---
title: Device Update for IoT Hub tutorial using the Raspberry Pi 3 B+ reference Yocto image | Microsoft Docs
description: Get started with Device Update for Azure IoT Hub by using the Raspberry Pi 3 B+ reference Yocto image.
author: eshashah
ms.author: eshashah
ms.date: 3/8/2023
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Tutorial: Device Update for Azure IoT Hub using the Raspberry Pi 3 B+ reference image

Device Update for Azure IoT Hub supports image-based, package-based, and script-based updates.

Image updates provide a higher level of confidence in the end state of the device. It's typically easier to replicate the results of an image update between a preproduction environment and a production environment because it doesn't pose the same challenges as packages and their dependencies. Because of their atomic nature, you can also adopt an A/B failover model easily.

This tutorial walks you through the steps to complete an end-to-end image-based update by using Device Update for IoT Hub on a Raspberry Pi 3 B+ board.

In this tutorial, you'll learn how to:
> [!div class="checklist"]
>
> * Download an image.
> * Add a tag to your IoT device.
> * Import an update.
> * Deploy an image update.
> * Monitor the update deployment.

> [!NOTE]
> Image updates in this tutorial were validated on the Raspberry Pi B3 board.


## Prerequisites

If you haven't already done so, create a [Device Update account and instance](create-device-update-account.md) and configure an IoT hub. This tutorial needs the device to be connected via ethernet connection.

Download files in **Assets** on the [Device Update GitHub releases page](https://github.com/Azure/iot-hub-device-update/releases). The Tutorial_RaspberryPi.zip has all the required files for the tutorial.

## Create a device in IoT Hub and get a connection string

Now, add the device to IoT Hub. From within IoT Hub, a connection string is generated for the device.

1. From the [Azure portal](https://portal.azure.com), navigate to your IoT hub.
1. On the left pane, select **Devices**. Then select **New**.
1. Under **Device ID**, enter a name for the device. Ensure that the **Autogenerate keys** checkbox is selected.
1. Select **Save**. On the **Devices** page, the device you created should be in the list.
1. Get the device connection string by navigating to the device view, select the **Copy** icon next to **Primary Connection String**.
1. Paste the copied characters somewhere for later use in the following steps:

   **This copied string is your device connection string**.
   
> [!NOTE]
> This tutorial uses a device connection string to authenticate and connect with the IoT Hub for ease of set-up. For production scenarios, we recommend using module identity and leveraging AIS([IoT Identity Service](https://azure.github.io/iot-identity-service/)) to provision devices. [Learn more ](device-update-agent-provisioning.md) 
   
## Set up Raspberry Pi

We provide base image and update files in **Assets** on the [Device Update GitHub releases page](https://github.com/Azure/iot-hub-device-update/releases). The Tutorial_RaspberryPi.zip has all the required files for the tutorial. 
The .wic file is the base image that you can flash on to a Raspberry Pi 3 B+ board. The swUpdate(.swu) file, custom swupdate script and manifest are the update files you would import through Device Update for IoT Hub.

This base image uses a Yocto build(based on 3.4.4 release) with: 
* SWUpdate which enables the dual partition update with DU
* Device Update agent

To learn more about the Yocto layers used, refer to [Device Update Yocto GitHub.](https://github.com/Azure/iot-hub-device-update-yocto).

You can use your favorite OS flashing tool to install the Device Update base image (adu-base-image) on the SD card that will be used in the Raspberry Pi 3 B+ device. Below are the instructions for using bmaptool to flash to the SD card.

### Use bmaptool to flash the SD card

1. Install the `bmaptool` utility, if you haven't done so already.

   ```shell
   sudo apt-get install bmap-tools
   ```

1. Locate the path for the SD card in `/dev`. The path should look something like `/dev/sd*` or `/dev/mmcblk*`. You can use the `dmesg` utility to help locate the correct path.
1. Unmount all mounted partitions before flashing.

   ```shell
   sudo umount /dev/<device>
   ```

1. Make sure you have write permissions to the device.

   ```shell
   sudo chmod a+rw /dev/<device>
   ```

1. Optional: For faster flashing, download the bimap file and the image file and put them in the same directory.
1. Flash the SD card.

   ```shell
   sudo bmaptool copy <path to image> /dev/<device>
   ```

Device Update for Azure IoT Hub software is subject to the following license terms:

* [Device update for IoT Hub license](https://github.com/Azure/iot-hub-device-update/blob/main/LICENSE)
* [Delivery optimization client license](https://github.com/microsoft/do-client/blob/main/LICENSE)

Read the license terms prior to using the agent. Your installation and use constitutes your acceptance of these terms. If you don't agree with the license terms, don't use the Device Update for IoT Hub agent.

## Configure the Device Update agent on Raspberry Pi

1. Make sure that Raspberry Pi 3 is connected to the network.
1. SSH into the Raspberry Pi 3 by using the following command in the PowerShell window:

   ```shell
     ssh raspberrypi3 -l root
    ```

1. The DU configuration files (du-config.json and du-diagnostics-config.json) must be on the device so that Device Update for IoT Hub configures properly. 

    1. To create or open the `du-config.json` file for editing by using:

      ```bash
        nano /adu/du-config.json
      ```

   2. After you run the command, you should see an open editor with the file. If you've never created the file, it will be empty. Now copy the below du-config.json contents, and substitute the configurations required for your device. Then replace the example connection string with the one for the device you created in the preceding steps.

      ### du-config.json

     ```JSON
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
              "connectionData": "HostName=example-connection-string.azure-devices.net;DeviceId=example-device;SharedAccessKey=M5oK/rOP12aB5678YMWv5vFWHFGJFwE8YU6u0uTnrmU=" 
           },
           "manufacturer": "contoso",
           "model": "virtual-vacuum-v2"
           }
        ]
     }  
     ```
  
      3. After you finish your changes, select `Ctrl+X` to exit the editor. Then enter `y` to save the changes.
      
1. Now you need to create the `du-diagnostics-config.json` file by using similar commands. 

      1. Start by creating or opening the `du-diagnostics-config.json` file for editing by using:

      ```bash
        nano /adu/du-diagnostics-config.json
      ```

      2. Copy the du-diagnostics-config.json contents provided below, and substitute any configurations that differ from the default build. The example du-diagnostics-config.json file represents the default log locations for Device Update for IoT Hub. You only need to change these default values if your implementation differs.

   ### du-diagnostics-config.json

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
     
      3. After you finish your changes, select `Ctrl+X` to exit the editor. Then enter `y` to save the changes.
     
1. Use the following command to show the files located in the `/adu/` directory. You should see both of your configuration files.du-diagnostics-config.json files for editing by using:

      ```bash
        ls -la /adu/
      ```

1. Restart the Device Update system daemon to make sure that the configurations were applied. Use the following command within the terminal logged in to the `raspberrypi`:

      ```bash
        systemctl start deviceupdate-agent
      ```

1. Check that the agent is live by using the following command:
  
      ```bash
        systemctl status deviceupdate-agent
      ```

   You should see the status appear as alive and green.

## Connect the device in Device Update for IoT Hub

1. On the left pane, select **Devices**.
1. Select the link with your device name.
1. At the top of the page, select **Device Twin**.
1. Under the **reported** section of the **Device Twin** properties, look for the Linux kernel version.

   For a new device, which hasn't received an update from Device Update, the [DeviceManagement:DeviceInformation:1.swVersion](device-update-plug-and-play.md) value represents the firmware version running on the device. After an update has been applied to a device, Device Update uses the [AzureDeviceUpdateCore:ClientMetadata:4.installedUpdateId](device-update-plug-and-play.md) property value to represent the firmware version running on the device.

1. The base and update image files have a version number in the file name.

   ```markdown
    adu-<image type>-image-<machine>-<version number>.<extension>
   ```
   Use that version number in the later "Import the update" section.

## Add a Device Update group tag to your device

1. In the Azure portal, navigate to your IoT hub.
1. On the left pane, under **Devices**, find your IoT device and go to the device twin or module twin.
1. In the module twin of the Device Update agent module, delete any existing Device Update tag values by setting them to null. If you're using the device identity with the Device Update agent, make these changes on the device twin.
1. Add a new Device Update tag value, as shown:

    ```JSON
        "tags": {
                "ADUGroup": "<CustomTagValue>"
                }
    ```

   :::image type="content" source="media/import-update/device-twin-ppr.png" alt-text="Screenshot that shows twin with tag information." lightbox="media/import-update/device-twin-ppr.png":::

   _This screenshot shows the section where the tag needs to be added in the twin._
   

## Import the update

1. Download the sample tutorial manifest and sample update (.swu file) and the sample A/B script from [Tutorial_RaspberryPi.zip](https://github.com/Azure/iot-hub-device-update/releases/download/1.0.2/Tutorial_RaspberryPi.zip) under **Release Assets** for the latest agent.
1. Sign in to the [Azure portal](https://portal.azure.com/) and go to your IoT hub with Device Update. On the left pane, under **Automatic Device Management**, select **Updates**.
1. Select the **Updates** tab.
1. Select **+ Import New Update**.
1. Select **+ Select from storage container**. Select an existing account or create a new account by using **+ Storage account**. Then select an existing container or create a new container by using **+ Container**. This container will be used to stage your update files for importing.

   > [!NOTE]
   > We recommend that you use a new container each time you import an update to avoid accidentally importing files from previous updates. If you don't use a new container, be sure to delete any files from the existing container before you finish this step.

   :::image type="content" source="media/import-update/storage-account-ppr.png" alt-text="Screenshot that shows Storage accounts and Containers." lightbox="media/import-update/storage-account-ppr.png":::

1. In your container, select **Upload** and go to the files you downloaded in step 1. After you've selected all your update files, select **Upload**. Then select the **Select** button to return to the **Import update** page.

   :::image type="content" source="media/import-update/import-select-ppr.png" alt-text="Screenshot that shows selecting uploaded files." lightbox="media/import-update/import-select-ppr.png":::

   *This screenshot shows the import step. File names might not match the ones used in the example.*

1. On the **Import update** page, review the files to be imported. Then select **Import update** to start the import process. For the tutorial, import the sample tutorial manifest and sample update (.swu file) and the sample A/B script downloaded earlier.

   :::image type="content" source="media/import-update/import-start-2-ppr.png" alt-text="Screenshot that shows Import update." lightbox="media/import-update/import-start-2-ppr.png":::

1. The import process begins, and the screen switches to the **Import history** section. When the **Status** column indicates the import has succeeded, select the **Available updates** header. You should see your imported update in the list now.

   :::image type="content" source="media/import-update/update-ready-ppr.png" alt-text="Screenshot that shows job status." lightbox="media/import-update/update-ready-ppr.png":::

For more information about the import process, see [Import an update to Device Update](import-update.md).

## View device groups

Device Update uses groups to organize devices. Device Update automatically sorts devices into groups based on their assigned tags and compatibility properties. Each device belongs to only one group, but groups can have multiple subgroups to sort different device classes.

1. Go to the **Groups and Deployments** tab at the top of the page.

   :::image type="content" source="media/create-update-group/ungrouped-devices.png" alt-text="Screenshot that shows ungrouped devices." lightbox="media/create-update-group/ungrouped-devices.png":::

1. View the list of groups and the update compliance chart. The update compliance chart shows the count of devices in various states of compliance: **On latest update**, **New updates available**, and **Updates in progress**. [Learn about update compliance](device-update-compliance.md).

   :::image type="content" source="media/create-update-group/updated-view.png" alt-text="Screenshot that shows the update compliance view." lightbox="media/create-update-group/updated-view.png":::

1. You should see a device group that contains the simulated device you set up in this tutorial along with any available updates for the devices in the new group. If there are devices that don't meet the device class requirements of the group, they'll show up in a corresponding invalid group. To deploy the best available update to the new user-defined group from this view, select **Deploy** next to the group.

For more information about tags and groups, see [Manage device groups](create-update-group.md).

## Deploy the update

1. After the group is created, you should see a new update available for your device group with a link to the update under **Best update**. You might need to refresh once.

   For more information about compliance, see [Device Update compliance](device-update-compliance.md).

1. Select the target group by selecting the group name. You're directed to the group details under **Group basics**.

   :::image type="content" source="media/deploy-update/group-basics.png" alt-text="Screenshot that shows Group details." lightbox="media/deploy-update/group-basics.png":::

1. To initiate the deployment, go to the **Current deployment** tab. Select the **deploy** link next to the desired update from the **Available updates** section. The best available update for a given group is denoted with a **Best** highlight.

   :::image type="content" source="media/deploy-update/select-update.png" alt-text="Screenshot that shows selecting an update." lightbox="media/deploy-update/select-update.png":::

1. Schedule your deployment to start immediately or in the future. Then select **Create**.

   > [!TIP]
   > By default, the **Start** date and time is 24 hours from your current time. Be sure to select a different date and time if you want the deployment to begin earlier.

   :::image type="content" source="media/deploy-update/create-deployment.png" alt-text="Screenshot that shows creating a deployment." lightbox="media/deploy-update/create-deployment.png":::

1. Under **Deployment details**, **Status** turns to **Active**. The deployed update is marked with **(deploying)**.

   :::image type="content" source="media/deploy-update/deployment-active.png" alt-text="Screenshot that shows the deployment as Active." lightbox="media/deploy-update/deployment-active.png":::

1. View the compliance chart to see that the update is now in progress.

1. After your device is successfully updated, you see that your compliance chart and deployment details are updated to reflect the same.

   :::image type="content" source="media/deploy-update/update-succeeded.png" alt-text="Screenshot that shows the update succeeded." lightbox="media/deploy-update/update-succeeded.png":::

## Monitor the update deployment

1. Select the **Deployment history** tab at the top of the page.

   :::image type="content" source="media/deploy-update/deployments-history.png" alt-text="Screenshot that shows Deployment history." lightbox="media/deploy-update/deployments-history.png":::

1. Select the **details** link next to the deployment you created.

   :::image type="content" source="media/deploy-update/deployment-details.png" alt-text="Screenshot that shows deployment details." lightbox="media/deploy-update/deployment-details.png":::

1. Select **Refresh** to view the latest status details.

You've now completed a successful end-to-end image update by using Device Update for IoT Hub on a Raspberry Pi 3 B+ device.

## Clean up resources

When no longer needed, clean up your Device Update account, instance, IoT hub, and IoT device.

## Next steps

> [!div class="nextstepaction"]
> [Update device packages with Device Update](device-update-ubuntu-agent.md)
