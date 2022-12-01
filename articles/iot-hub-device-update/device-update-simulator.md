---
title: Device Update for Azure IoT Hub tutorial using the Ubuntu (18.04 x64) simulator reference agent | Microsoft Docs
description: Get started with Device Update for Azure IoT Hub using the Ubuntu (18.04 x64) simulator reference agent.
author: kgremban
ms.author: kgremban
ms.date: 1/26/2022
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Tutorial: Device Update for Azure IoT Hub using the Ubuntu (18.04 x64) simulator reference agent

Device Update for Azure IoT Hub supports image-based, package-based, and script-based updates.

Image updates provide a higher level of confidence in the end state of the device. It's typically easier to replicate the results of an image update between a preproduction environment and a production environment because it doesn't pose the same challenges as packages and their dependencies. Because of their atomic nature, you can also adopt an A/B failover model easily.

This tutorial walks you through the steps to complete an end-to-end image-based update by using Device Update for IoT Hub.

In this tutorial, you'll learn how to:
> [!div class="checklist"]
>
> * Download and install an image.
> * Add a tag to your IoT device.
> * Import an update.
> * Deploy an image update.
> * Monitor the update deployment.

## Prerequisites

* Create a [Device Update account and instance](create-device-update-account.md) configured with an IoT hub.

* Have an Ubuntu 18.04 device. This device can be either physical or a virtual machine.

* Download the zip file named `Tutorial_Simulator.zip` from [Release Assets](https://github.com/Azure/iot-hub-device-update/releases) in the latest release, and unzip it.

  If your test device is different than your development machine, download the zip file onto both.

  You can use `wget` to download the zip file. Replace `<release_version>` with the latest release, for example `0.8.2`.

  ```bash
  wget https://github.com/Azure/iot-hub-device-update/releases/download/<release_version>/Tutorial_Simulator.zip
  ```

## Add a device to Azure IoT Hub

After the Device Update agent is running on an IoT device, you must add the device to IoT Hub. From within IoT Hub, a connection string is generated for a particular device.

1. From the [Azure portal](https://portal.azure.com), navigate to your IoT hub.
1. Create a new device.
1. On the left pane, go to **Devices**. Then select **New**.
1. Under **Device ID**, enter a name for the device. Ensure that the **Autogenerate keys** checkbox is selected.
1. Select **Save**.
1. Now, you're returned to the **Devices** page and the device you created should be in the list. Select that device.
1. In the device view, select the **Copy** icon next to **Primary Connection String**.
1. Paste the copied characters somewhere for later use in the following steps:

   **This copied string is your device connection string**.

## Add a tag to your device

1. From the Azure portal, navigate to your IoT hub.
1. From **Devices** on the left pane, find your IoT device and go to the device twin or module twin.
1. In the module twin of the Device Update agent module, delete any existing Device Update tag values by setting them to null. If you're using the device identity with a Device Update agent, make these changes on the device twin.
1. Add a new Device Update tag value, as shown:

   ```JSON
       "tags": {
               "ADUGroup": "<CustomTagValue>"
               }
   ```

## Install a Device Update agent to test it as a simulator

1. Follow the instructions to [install the Azure IoT Edge runtime](../iot-edge/how-to-provision-single-device-linux-symmetric.md?view=iotedge-2020-11&preserve-view=true) on your test device.

   > [!NOTE]
   > The Device Update agent doesn't depend on IoT Edge. But it does rely on the IoT Identity Service daemon that's installed with IoT Edge (1.2.0 and higher) to obtain an identity and connect to IoT Hub.
   >
   > Although not covered in this tutorial, the [IoT Identity Service daemon can be installed standalone on Linux-based IoT devices](https://azure.github.io/iot-identity-service/installation.html). The sequence of installation matters. The Device Update package agent must be installed _after_ the IoT Identity Service. Otherwise, the package agent won't be registered as an authorized component to establish a connection to IoT Hub.

1. Install the Device Update agent .deb packages.

   ```bash
   sudo apt-get install deviceupdate-agent
   ```

1. Enter your IoT device's module (or device, depending on how you [provisioned the device with Device Update](device-update-agent-provisioning.md)) primary connection string in the configuration file by running the following command:

   ```bash
   sudo nano /etc/adu/du-config.json
   ```

1. Set up the agent to run as a simulator. Run the following command on the IoT device so that the Device Update agent invokes the simulator handler to process a package update with APT (`microsoft/apt:1`).

   ```sh
   sudo /usr/bin/AducIotAgent --register-content-handler /var/lib/adu/extensions/sources/libmicrosoft_simulator_1.so --update-type 'microsoft/apt:1'
   ```

   To register and invoke the simulator handler, use the following format, filling in the placeholders:

   `sudo /usr/bin/AducIotAgent --register--content-handler <full path to the handler file> --update-type <update type name>`

1. Make a copy of the file `sample-du-simulator-data.json`, which is from the `Tutorial_Simulator.zip` file that you downloaded in the prerequisites, in the `tmp` folder.

   ```sh
   cp sample-du-simulator-data.json /tmp/du-simulator-data.json
   ```

1. Change permissions for the new file.

   ```sh
   sudo chown adu:adu /tmp/du-simulator-data.json
   sudo chmod 664 /tmp/du-simulator-data.json
   ```
  
   If /tmp doesn't exist, then:

   ```sh
    sudo mkdir/tmp
    sudo chown root:root/tmp
    sudo chmod 1777/tmp
   ```  

1. Restart the Device Update agent.

   ```bash
    sudo systemctl restart adu-agent
   ```

Device Update for Azure IoT Hub software is subject to the following license terms:

* [Device Update for IoT Hub license](https://github.com/Azure/iot-hub-device-update/blob/main/LICENSE)
* [Delivery optimization client license](https://github.com/microsoft/do-client/blob/main/LICENSE)

Read the license terms prior to using the agent. Your installation and use constitutes your acceptance of these terms. If you don't agree with the license terms, don't use the Device Update for IoT Hub agent.

> [!NOTE]
> After your testing with the simulator, run the following command to invoke the APT handler and [deploy over-the-air package updates](device-update-ubuntu-agent.md):
>
>```sh
>sudo /usr/bin/AducIotAgent --register-content-handler /var/lib/adu/extensions/sources/libmicrosoft_apt_1.so --update-type 'microsoft/a pt:1'
>```

## Import the update

In this section, you use the files `TutorialImportManifest_Sim.importmanifest.json` and `adu-update-image-raspberrypi3.swu` from the downloaded `Tutorial_Simulator.zip` in the prerequisites. The update file is reused from the Raspberry Pi tutorial. Because the update in this tutorial is simulated, the specific file content doesn't matter.

1. Sign in to the [Azure portal](https://portal.azure.com/) and go to your IoT hub with Device Update. On the left pane, under **Automatic Device Management**, select **Updates**.
1. Select the **Updates** tab.
1. Select **+ Import New Update**.
1. Select **+ Select from storage container**. Select an existing account or create a new account by using **+ Storage account**. Then select an existing container or create a new container by using **+ Container**. This container will be used to stage your update files for importing.

   > [!NOTE]
   > We recommend that you use a new container each time you import an update to avoid accidentally importing files from previous updates. If you don't use a new container, be sure to delete any files from the existing container before you finish this step.

   :::image type="content" source="media/import-update/storage-account-ppr.png" alt-text="Screenshot that shows Storage accounts and Containers." lightbox="media/import-update/storage-account-ppr.png":::

1. In your container, select **Upload** and go to the files you downloaded in step 1. After you've selected all your update files, select **Upload**. Then select the **Select** button to return to the **Import update** page.

   :::image type="content" source="media/import-update/import-select-ppr.png" alt-text="Screenshot that shows selecting uploaded files." lightbox="media/import-update/import-select-ppr.png":::

   _This screenshot shows the import step. File names might not match the ones used in the example._

1. On the **Import update** page, review the files to be imported. Then select **Import update** to start the import process.

   :::image type="content" source="media/import-update/import-start-2-ppr.png" alt-text="Screenshot that shows Import update." lightbox="media/import-update/import-start-2-ppr.png":::

1. The import process begins, and the screen switches to the **Import History** section. When the **Status** column indicates the import has succeeded, select the **Available updates** header. You should see your imported update in the list now.

   :::image type="content" source="media/import-update/update-ready-ppr.png" alt-text="Screenshot that shows the job status." lightbox="media/import-update/update-ready-ppr.png":::

For more information about the import process, see [Import an update to Device Update for IoT Hub](import-update.md).

## View device groups

Device Update uses groups to organize devices. Device Update automatically sorts devices into groups based on their assigned tags and compatibility properties. Each device belongs to only one group, but groups can have multiple subgroups to sort different device classes.

1. Go to the **Groups and Deployments** tab at the top of the page.

   :::image type="content" source="media/create-update-group/ungrouped-devices.png" alt-text="Screenshot that shows ungrouped devices." lightbox="media/create-update-group/ungrouped-devices.png":::

1. View the list of groups and the update compliance chart. The update compliance chart shows the count of devices in various states of compliance: **On latest update**, **New updates available**, and **Updates in progress**. [Learn about update compliance](device-update-compliance.md).

   :::image type="content" source="media/create-update-group/updated-view.png" alt-text="Screenshot that shows the update compliance view." lightbox="media/create-update-group/updated-view.png":::

1. You should see a device group that contains the simulated device you set up in this tutorial along with any available updates for the devices in the new group. If there are devices that don't meet the device class requirements of the group, they'll show up in a corresponding invalid group. To deploy the best available update to the new user-defined group from this view, select **Deploy** next to the group.

For more information about tags and groups, see [Manage device groups](create-update-group.md).

## Deploy the update

1. After the group is created, you should see a new update available for your device group. A link to the update should be under **Best update**. You might need to refresh the page.

1. Select the target group by selecting the group name. You're directed to **Group details** under **Group basics**.

   :::image type="content" source="media/deploy-update/group-basics.png" alt-text="Screenshot that shows Group details." lightbox="media/deploy-update/group-basics.png":::

1. To start the deployment, go to the **Current deployment** tab. Select the **deploy** link next to the desired update from the **Available updates** section. The best available update for a given group is denoted with a **Best** highlight.

   :::image type="content" source="media/deploy-update/select-update.png" alt-text="Screenshot that shows selecting an update." lightbox="media/deploy-update/select-update.png":::

1. Schedule your deployment to start immediately or in the future. Then select **Create**.

   :::image type="content" source="media/deploy-update/create-deployment.png" alt-text="Screenshot that shows Create deployment." lightbox="media/deploy-update/create-deployment.png":::

1. Under **Deployment details**, **Status** turns to **Active**. The deployed update is marked with **(deploying)**.

   :::image type="content" source="media/deploy-update/deployment-active.png" alt-text="Screenshot that shows the deployment is active." lightbox="media/deploy-update/deployment-active.png":::

1. View the compliance chart to see that the update is now in progress.
1. After your device is successfully updated, you see that your compliance chart and deployment details are updated to reflect the same.

   :::image type="content" source="media/deploy-update/update-succeeded.png" alt-text="Screenshot that shows Update succeeded." lightbox="media/deploy-update/update-succeeded.png":::

## Monitor the update deployment

1. Select the **Deployment history** tab at the top of the page.

   :::image type="content" source="media/deploy-update/deployments-history.png" alt-text="Screenshot that shows Deployment history." lightbox="media/deploy-update/deployments-history.png":::

1. Select **Details** next to the deployment you created.

   :::image type="content" source="media/deploy-update/deployment-details.png" alt-text="Screenshot that shows Deployment details." lightbox="media/deploy-update/deployment-details.png":::

1. Select **Refresh** to view the latest status details.

You've now completed a successful end-to-end image update by using Device Update for IoT Hub using the Ubuntu (18.04 x64) simulator reference agent.

## Clean up resources

When no longer needed, clean up your Device Update account, instance, IoT hub, and IoT device.

## Next steps

> [!div class="nextstepaction"]
> [Troubleshooting](troubleshoot-device-update.md)
