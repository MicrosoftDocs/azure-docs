---
title: Device Update for Azure IoT Hub tutorial using the Ubuntu (18.04 x64) Simulator Reference Agent | Microsoft Docs
description: Get started with Device Update for Azure IoT Hub using the Ubuntu (18.04 x64) Simulator Reference Agent.
author: valls
ms.author: valls
ms.date: 1/26/2022
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Device Update for Azure IoT Hub tutorial using the Ubuntu (18.04 x64) Simulator Reference Agent

Device Update for IoT Hub supports image-based, package-based and script-based updates.

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

## Add device to Azure IoT Hub

Once the Device Update agent is running on an IoT device, the device needs to be added to the Azure IoT Hub.  From within Azure IoT Hub, a connection string will be generated for a particular device.

1. From the Azure portal, launch the Device Update IoT Hub.
2. Create a new device.
3. On the left-hand side of the page, navigate to 'IoT Devices' > Select "New".
4. Provide a name for the device under 'Device ID'--Ensure that "Autogenerate keys" is checkbox is selected.
5. Select 'Save'.
6. Now, you'll be returned to the 'Devices' page and the device you created should be in the list. Select that device.
7. In the device view, select the 'Copy' icon next to 'Primary Connection String'.
8. Paste the copied characters somewhere for later use in the steps below. **This copied string is your device connection string**.

## Install Device Update agent to test it as a simulator

1. Follow the instructions to [Install the Azure IoT Edge runtime](../iot-edge/how-to-provision-single-device-linux-symmetric.md?view=iotedge-2020-11&preserve-view=true).
   > [!NOTE]
   > The Device Update agent doesn't depend on IoT Edge. But, it does rely on the IoT Identity Service daemon that is installed with IoT Edge (1.2.0 and higher) to obtain an identity and connect to IoT Hub.
   >
   > Although not covered in this tutorial, the [IoT Identity Service daemon can be installed standalone on Linux-based IoT devices](https://azure.github.io/iot-identity-service/installation.html). The sequence of installation matters. The Device Update package agent must be installed _after_ the IoT Identity Service. Otherwise, the package agent will not be registered as an authorized component to establish a connection to IoT Hub.
1. Then, install the Device Update agent .deb packages.

   ```bash
   sudo apt-get install deviceupdate-agent deliveryoptimization-plugin-apt 
   ```
   
2. Enter your IoT device's module (or device, depending on how you [provisioned the device with Device Update](device-update-agent-provisioning.md)) primary connection string in the configuration file by running the command below.

   ```bash
   sudo nano /etc/adu/du-config.json
   ```
   
3. Set up the agent to run as a simulator. Run following command on the IoT device so that the Device Update agent will invoke the simulator handler to process an package update with APT ('microsoft/apt:1').

   ```sh
   sudo /usr/bin/AducIotAgent --register-content-handler /var/lib/adu/extensions/sources/libmicrosoft_simulator_1.so --update-type 'microsoft/apt:1'
   ```
   
   To register and invoke the simulator handler the command must follow the below format:
   
   sudo /usr/bin/AducIotAgent --register--content-handler <full path to the handler file> --update-type <update type name>

4. Download the sample-du-simulator-data.json from [Release Assets](https://github.com/Azure/iot-hub-device-update/releases). Run the command below to create and edit the du-simulator-data.json in the tmp folder. 

   ```sh
   sudo nano /tmp/du-simulator-data.json
   sudo chown adu:adu /tmp/du-simulator-data.json
   sudo chmod 664 /tmp/du-simulator-data.json
   ```
   Copy the contents from the downloaded file into the du-simulator-data.json. Press Ctrl + X to save the changes.
  
   If /tmp doesn't exist then

   ```sh
    sudo mkdir/tmp
    sudo chown root:root/tmp
    sudo chmod 1777/tmp
   ```  
   
5. Restart the Device Update agent by running the command below.

   ```bash
    sudo systemctl restart adu-agent
   ```
   
Device Update for Azure IoT Hub software is subject to the following license terms:
   * [Device Update for IoT Hub license](https://github.com/Azure/iot-hub-device-update/blob/main/LICENSE.md)
   * [Delivery optimization client license](https://github.com/microsoft/do-client/blob/main/LICENSE)
   
Read the license terms prior to using the agent. Your installation and use constitutes your acceptance of these terms. If you do not agree with the license terms, do not use the Device Update for IoT Hub agent.

> [!NOTE] 
> After your testing with the simulator run the below command to invoke the APT handler and [deploy over-the-air Package Updates](device-update-ubuntu-agent.md)
```sh
# sudo /usr/bin/AducIotAgent --register-content-handler /var/lib/adu/extensions/sources/libmicrosoft_apt_1.so --update-type 'microsoft/a pt:1'
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

1. Download the sample tutorial manifest (Tutorial Import Manifest_Sim.json) and sample update (adu-update-image-raspberrypi3-0.6.5073.1.swu) from [Release Assets](https://github.com/Azure/iot-hub-device-update/releases) for the latest agent. _Note_: the update file is re-used update files from the Raspberry Pi tutorial, because the update in this tutorial will be simulated and therefore the specific file content doesn't matter. 

2. Log in to the [Azure portal](https://portal.azure.com/) and navigate to your IoT Hub with Device Update. Then, select the Updates option under Automatic Device Management from the left-hand navigation bar.

3. Select the Updates tab.

4. Select "+ Import New Update".

5. Select "+ Select from storage container". Select an existing account or create a new account using "+ Storage account". Then select an existing container or create a new container using "+ Container". This container will be used to stage your update files for importing.
   > [!NOTE]
   > We recommend using a new container each time you import an update to avoid accidentally importing files from previous updates. If you don't use a new container, be sure to delete any files from the existing container before completing this step.
   
   :::image type="content" source="media/import-update/storage-account-ppr.png" alt-text="Storage Account" lightbox="media/import-update/storage-account-ppr.png":::

6. In your container, select "Upload" and navigate to files downloaded in **Step 1**. When you've selected all your update files, select "Upload" Then click the "Select" button to return to the "Import update" page.

   :::image type="content" source="media/import-update/import-select-ppr.png" alt-text="Select Uploaded Files" lightbox="media/import-update/import-select-ppr.png":::
   _This screenshot shows the import step and file names may not match the ones used in the example_

8. On the Import update page, review the files to be imported. Then select "Import update" to start the import process.

   :::image type="content" source="media/import-update/import-start-2-ppr.png" alt-text="Import Start" lightbox="media/import-update/import-start-2-ppr.png":::

9. The import process begins, and the screen switches to the "Import History" section. When the `Status` column indicates the import has succeeded, select the "Available Updates" header. You should see your imported update in the list now.

   :::image type="content" source="media/import-update/update-ready-ppr.png" alt-text="Job Status" lightbox="media/import-update/update-ready-ppr.png":::
       
[Learn more](import-update.md) about importing updates.

## Create update group

1. Go to the Groups and Deployments tab at the top of the page. 
   :::image type="content" source="media/create-update-group/ungrouped-devices.png" alt-text="Screenshot of ungrouped devices." lightbox="media/create-update-group/ungrouped-devices.png":::

2. Select the "Add group" button to create a new group.
   :::image type="content" source="media/create-update-group/add-group.png" alt-text="Screenshot of device group addition." lightbox="media/create-update-group/add-group.png":::

3. Select an IoT Hub tag and Device Class from the list and then select Create group.
   :::image type="content" source="media/create-update-group/select-tag.png" alt-text="Screenshot of tag selection." lightbox="media/create-update-group/select-tag.png":::

4. Once the group is created, you will see that the update compliance chart and groups list are updated.  Update compliance chart shows the count of devices in various states of compliance: On latest update, New updates available, and Updates in Progress. [Learn  about update compliance.](device-update-compliance.md)
   :::image type="content" source="media/create-update-group/updated-view.png" alt-text="Screenshot of update compliance view." lightbox="media/create-update-group/updated-view.png":::

5. You should see your newly created group and any available updates for the devices in the new group. If there are devices that don't meet the device class requirements of the group, they will show up in a corresponding invalid group. You can deploy the best available update to the new user-defined group from this view by clicking on the "Deploy" button next to the group.

[Learn more](create-update-group.md) about adding tags and creating update groups


## Deploy update

1. Once the group is created, you should see a new update available for your device group, with a link to the update under Best Update (you may need to Refresh once). [Learn More about update compliance.](device-update-compliance.md) 

2. Select the target group by clicking on the group name. You will be directed to the group details under Group basics.

  :::image type="content" source="media/deploy-update/group-basics.png" alt-text="Group details" lightbox="media/deploy-update/group-basics.png":::

3. To initiate the deployment, go to the Current deployment tab. Click the deploy link next to the desired update from the Available updates section. The best, available update for a given group will be denoted with a "Best" highlight. 

  :::image type="content" source="media/deploy-update/select-update.png" alt-text="Select update" lightbox="media/deploy-update/select-update.png":::

4. Schedule your deployment to start immediately or in the future, then select Create.

 :::image type="content" source="media/deploy-update/create-deployment.png" alt-text="Create deployment" lightbox="media/deploy-update/create-deployment.png":::

5. The Status under Deployment details should turn to Active, and the deployed update should be marked with "(deploying)".

 :::image type="content" source="media/deploy-update/deployment-active.png" alt-text="Deployment active" lightbox="media/deploy-update/deployment-active.png":::

6. View the compliance chart. You should see the update is now in progress. 

7. After your device is successfully updated, you should see your compliance chart and deployment details update to reflect the same. 

   :::image type="content" source="media/deploy-update/update-succeeded.png" alt-text="Update succeeded" lightbox="media/deploy-update/update-succeeded.png":::

## Monitor an update deployment

1. Select the Deployment history tab at the top of the page.

   :::image type="content" source="media/deploy-update/deployments-history.png" alt-text="Deployment History" lightbox="media/deploy-update/deployments-history.png":::

2. Select the details link next to the deployment you created.

   :::image type="content" source="media/deploy-update/deployment-details.png" alt-text="Deployment details" lightbox="media/deploy-update/deployment-details.png":::

3. Select Refresh to view the latest status details.

You have now completed a successful end-to-end image update using Device Update for IoT Hub using the Ubuntu (18.04 x64) Simulator Reference Agent.

## Clean up resources

When no longer needed, clean up your Device Update account, instance, IoT Hub and IoT device. 

## Next steps

> [!div class="nextstepaction"]
> [Troubleshooting](troubleshoot-device-update.md)

