---
title: Device Update for Azure IoT Hub tutorial using the Ubuntu (18.04 x64) Simulator Reference Agent | Microsoft Docs
description: Get started with Device Update for Azure IoT Hub using the Ubuntu (18.04 x64) Simulator Reference Agent.
author: valls
ms.author: valls
ms.date: 2/11/2021
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Device Update for Azure IoT Hub tutorial using the Ubuntu (18.04 x64) Simulator Reference Agent

Device Update for IoT Hub supports two forms of updates – image-based
and package-based.

Image updates provide a higher level of confidence in the end-state of the device. It is typically easier to replicate the results of an image-update between a pre-production environment and a production environment, since it doesn’t pose the same challenges as packages and their dependencies. Due to their atomic nature, one can also adopt an A/B failover model easily.

This tutorial walks you through the steps to complete an end-to-end image-based update using Device Update for IoT Hub. 

In this tutorial you will learn how to:
> [!div class="checklist"]
> * Download and install image
> * Add a tag to your IoT device
> * Import an update
> * Create a device group
> * Deploy an image update
> * Monitor the update deployment

## Prerequisites
* If you haven't already done so, create a [Device Update account and instance](create-device-update-account.md), including configuring an IoT Hub.

## Install Device Update Agent to test it as a simulator

1. Follow the instructions to [Install the Azure IoT Edge runtime](../iot-edge/how-to-provision-single-device-linux-symmetric.md?view=iotedge-2020-11&preserve-view=true).
   > [!NOTE]
   > The Device Update agent doesn't depend on IoT Edge. But, it does rely on the IoT Identity Service daemon that is installed with IoT Edge (1.2.0 and higher) to obtain an identity and connect to IoT Hub.
   >
   > Although not covered in this tutorial, the [IoT Identity Service daemon can be installed standalone on Linux-based IoT devices](https://azure.github.io/iot-identity-service/installation.html). The sequence of installation matters. The Device Update package agent must be installed _after_ the IoT Identity Service. Otherwise, the package agent will not be registered as an authorized component to establish a connection to IoT Hub.

1. Then, install the Device Update agent .deb packages.

   ```bash
   sudo apt-get install deviceupdate-agent deliveryoptimization-plugin-apt 
   ```
   
1. Enter your IoT device's module (or device, depending on how you [provisioned the device with Device Update](device-update-agent-provisioning.md)) primary connection string in the configuration file by running the command below.

   ```markdown
   /etc/adu/du-config.json
   ```
   
1. Set up the agent to run as a simulator. Run following command on the IoT device so that the Device Update agent will invoke the simulator handler to process an package update with APT ('microsoft/apt:1')

   ```sh
   sudo /usr/bin/AducIotAgent --register--content-handler <full path to the handler file> --update-type <update type name>

   # For example sudo /usr/bin/AducIotAgent --register-content-handler /var/lib/adu/extensions/sources/libmicrosoft_simulator_1.so --update-type 'microsoft/apt:1'
   ```

1. Restart the Device Update agent by running the command below.

   ```markdown
    sudo systemctl restart adu-agent
   ```
   
Device Update for Azure IoT Hub software is subject to the following license terms:
   * [Device update for IoT Hub license](https://github.com/Azure/iot-hub-device-update/blob/main/LICENSE.md)
   * [Delivery optimization client license](https://github.com/microsoft/do-client/blob/main/LICENSE)
   
Read the license terms prior to using the agent. Your installation and use constitutes your acceptance of these terms. If you do not agree with the license terms, do not use the Device update for IoT Hub agent.

> [!NOTE] 
> After your testing with the simulator run the below command to invoke the APT handler and [deploy over-the-air Package Updates](device-update-ubuntu-agent.md)

```sh
# sudo /usr/bin/AducIotAgent --register-content-handler /var/lib/adu/extensions/sources/libmicrosoft_apt_1.so --update-type 'microsoft/a pt:1'
```

## Add device to Azure IoT Hub

Once the Device Update Agent is running on an IoT device, the device needs to be added to the Azure IoT Hub.  From within Azure IoT Hub, a connection string will be generated for a particular device.

1. From the Azure portal, launch the Device Update IoT Hub.
2. Create a new device.
3. On the left-hand side of the page, navigate to 'IoT Devices' > Select "New".
4. Provide a name for the device under 'Device ID'--Ensure that "Autogenerate keys" is checkbox is selected.
5. Select 'Save'.
6. Now, you'll be returned to the 'Devices' page and the device you created should be in the list. Select that device.
7. In the device view, select the 'Copy' icon next to 'Primary Connection String'.
8. Paste the copied characters somewhere for later use in the steps below. **This copied string is your device connection string**.

## Add connection string to simulator

Start Device Update Agent on your new Software Devices.

1. Start Ubuntu.
2. Run the Device Update Agent and specify the device connection string from the previous section wrapped with apostrophes:

   Replace `<device connection string>` with your connection string
   ```shell
   sudo ./AducIotAgentSim-microsoft-swupdate "<device connection string>"
   ```

   or

   ```shell
   ./AducIotAgentSim-microsoft-apt -c '<device connection string>'
   ```

3. Scroll up and look for the string indicating that the device is in "Idle" state. An "Idle" state signifies that the device is ready for service commands:

   ```markdown
   Agent running. [main]
   ```

## Add a tag to your device

1. Log into [Azure portal](https://portal.azure.com) and navigate to the IoT Hub.

2. From 'IoT Devices' or 'IoT Edge' on the left navigation pane find your IoT device and navigate to the Device Twin or Module Twin.

3. In the Module Twin of the Device Update agent module, delete any existing Device Update tag value by setting them to null. If you are using Device identity with Device Update agent make these changes on the Device Twin.

4. Add a new Device Update tag value as shown below.

   ```JSON
       "tags": {
               "ADUGroup": "<CustomTagValue>"
               }
   ```

## Import update

1. Download the [sample import manifest](https://github.com/Azure/iot-hub-device-update/releases/download/0.7.0/TutorialImportManifest_Sim.json) and [sample image update](https://github.com/Azure/iot-hub-device-update/releases/download/0.7.0-rc1/adu-update-image-raspberrypi3-0.6.5073.1.swu). _Note_: these are re-used update files from the Raspberry Pi tutorial, because the update in this tutorial will be simulated and therefore the specific file content doesn't matter. 
2. Log in to the [Azure portal](https://portal.azure.com/) and navigate to your IoT Hub with Device Update. Then, select the Device Updates option under Automatic Device Management from the left-hand navigation bar.

3. Select the Updates tab.

4. Select "+ Import New Update".

5. Select the folder icon or text box under "Select an Import Manifest File". You will see a file picker dialog. Select the _sample import manifest_ you downloaded in step 1 above.  Next, select the folder icon or text box under "Select one or more update files". You will see a file picker dialog. Select the _sample image update_ that you downloaded in step 1 above. 

   :::image type="content" source="media/import-update/select-update-files.png" alt-text="Screenshot showing update file selection." lightbox="media/import-update/select-update-files.png":::

6. Select the folder icon or text box under "Select a storage container". Then select the appropriate storage account.

7. If you’ve already created a container, you can reuse it. (Otherwise, select "+ Container" to create a new storage container for updates.).  Select the container you wish to use and click "Select".
  
   :::image type="content" source="media/import-update/container.png" alt-text="Screenshot showing container selection." lightbox="media/import-update/container.png":::

8. Select "Submit" to start the import process.

9. The import process begins, and the screen changes to the "Import History" section. Select "Refresh" to view progress until the import process completes. Depending on the size of the update, this may complete in a few minutes but could take longer.
   
   :::image type="content" source="media/import-update/update-publishing-sequence-2.png" alt-text="Screenshot showing update import sequence." lightbox="media/import-update/update-publishing-sequence-2.png":::

10. When the Status column indicates the import has succeeded, select the "Ready to Deploy" header. You should see your imported update in the list now.

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

You have now completed a successful end-to-end image update using Device Update for IoT Hub using the Ubuntu (18.04 x64) Simulator Reference Agent.

## Clean up resources

When no longer needed, clean up your device update account, instance, IoT Hub and IoT device. 

> [!NOTE] 
> After your testing with the simulator run the below command to invoke the APT handler and [deploy over-the-air Package Updates](device-update-ubuntu-agent.md)

```sh
# sudo /usr/bin/AducIotAgent --register-content-handler /var/lib/adu/extensions/sources/libmicrosoft_apt_1.so --update-type 'microsoft/a pt:1'
```

## Next steps

You can use the following tutorials for a simple demonstration of Device Update for IoT Hub:

- [Image Update: Getting Started with Raspberry Pi 3 B+ Reference Yocto Image](device-update-raspberry-pi.md) extensible via open source to build you own images for other architecture as needed.
	
- [Package Update: Getting Started using Ubuntu Server 18.04 x64 Package agent](device-update-ubuntu-agent.md)
	
- [Proxy Update: Getting Started using Device Update binary agent for downstream devices](device-update-howto-proxy-updates.md)
	
- [Getting Started Using Ubuntu (18.04 x64) Simulator Reference Agent](device-update-simulator.md)

- [Device Update for Azure IoT Hub tutorial for Azure-Real-Time-Operating-System](device-update-azure-real-time-operating-system.md)

[Troubleshooting](troubleshoot-device-update.md)

