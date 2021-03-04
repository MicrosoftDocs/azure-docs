---
title: Device Update for Azure IoT Hub tutorial using the Ubuntu Server 18.04 x64 Package agent | Microsoft Docs
description: Get started with Device Update for Azure IoT Hub using the Ubuntu Server 18.04 x64 Package agent.
author: vimeht
ms.author: vimeht
ms.date: 2/16/2021
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Device Update for Azure IoT Hub tutorial using the Ubuntu Server 18.04 x64 Package agent

Device Update for IoT Hub supports two forms of updates – image-based
and package-based.

Package-based updates are targeted updates that alter only a specific component
or application on the device. This leads to lower consumption of
bandwidth and helps reduce the time to download and install the update. Package
updates typically allow for less downtime of devices when applying an update and
avoid the overhead of creating images.

This tutorial walks you through the steps to complete an end-to-end package-based update through Device Update for IoT Hub. We will use a sample package agent for Ubuntu Server 18.04 x64 for this tutorial. Even if you plan on using a different OS platform configuration, this tutorial is still useful to learn about the tools and concepts in Device Update for IoT Hub. Complete this introduction to an end-to-end update process, then choose your preferred form of updating and OS platform to dive into the details. You can use Device Update for IoT Hub to update an Azure IoT or Azure IoT Edge device using this tutorial. 

In this tutorial you will learn how to:
> [!div class="checklist"]
> * Configure device update package repository
> * Download and install device update agent and its dependencies
> * Add a tag to your IoT device
> * Import an update
> * Create a device group
> * Deploy a package update
> * Monitor the update deployment

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
* Access to an IoT Hub. It is recommended that you use a S1 (Standard) tier or above.
* An Azure IoT or Azure IoT Edge device running Ubuntu Server 18.04 x64, connected to IoT Hub.
   * If you are using an Azure IoT Edge device, make sure it is on v1.2.0 of the Edge runtime or higher 
* If you are not using an Azure IoT Edge device, then [install the latest `aziot-identity-service` package (preview) on your IoT device](https://github.com/Azure/iot-identity-service/actions/runs/575919358) 
* [Device Update account and instance linked to the same IoT Hub as above.](create-device-update-account.md)

## Configure device update package repository

1. Install the repository configuration that matches your device operating system. For this tutorial, this will be Ubuntu Server 18.04. 
   
   ```shell
      curl https://packages.microsoft.com/config/ubuntu/18.04/multiarch/prod.list > ./microsoft-prod.list
   ```

2. Copy the generated list to the sources.list.d directory.

   ```shell
      sudo cp ./microsoft-prod.list /etc/apt/sources.list.d/
   ```
   
3. Install the Microsoft GPG public key.

   ```shell
      curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
      sudo cp ./microsoft.gpg /etc/apt/trusted.gpg.d/
   ```

## Install Device Update .deb agent packages

1. Update package lists on your device

   ```shell
      sudo apt-get update
   ```

2. Install the deviceupdate-agent package and its dependencies

   ```shell
      sudo apt-get install deviceupdate-agent deliveryoptimization-plugin-apt
   ```

Device Update for Azure IoT Hub software packages are subject to the following license terms:
   * [Device update for IoT Hub license](https://github.com/Azure/iot-hub-device-update/blob/main/LICENSE.md)
   * [Delivery optimization client license](https://github.com/microsoft/do-client/blob/main/LICENSE.md)
   
Read the license terms prior to using a package. Your installation and use of a package constitutes your acceptance of these terms. If you do not agree with the license terms, do not use that package.

## Configure Device Update Agent using Azure IoT Identity service (Preview)

Once you have the required packages installed, you need to provision the device with its cloud identity and authentication information.

1. Open the configuration file

   ```shell
      sudo nano /etc/aziot/config.toml
   ```

2. Find the provisioning configuration section of the file. Uncomment the "Manual provisioning with connection string" section. Update the value of the connection_string with the connection string for your IoT (Edge) device. Ensure that all other provisioning sections are commented out.


   ```toml
      # Manual provisioning configuration using a connection string
      [provisioning]
      source = "manual"
      iothub_hostname = "<REQUIRED IOTHUB HOSTNAME>"
      device_id = "<REQUIRED DEVICE ID PROVISIONED IN IOTHUB>"
      dynamic_reprovisioning = false 
   ```

3. Save and close the file using Ctrl+X, Y

4. Apply the configuration. 

   If you are using an IoT Edge device, use the following command. 
   
   ```shell
      sudo iotedge config apply
   ```
   
   If you are using an IoT device, with the `aziot-identity-service` package installed, then use the following command. 
      
   ```shell
      sudo aziotctl config apply
   ```

5. Optionally, you can verify that the services are running by

    ```shell
       sudo systemctl list-units --type=service | grep 'adu-agent\.service\|deliveryoptimization-agent\.service'
    ```

    The output should read:

    ```markdown
       adu-agent.service                   loaded active running Device Update for IoT Hub Agent daemon.

       deliveryoptimization-agent.service               loaded active running deliveryoptimization-agent.service: Performs content delivery optimization tasks   `
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

1. Download the following [apt manifest file](https://github.com/Azure/iot-hub-device-update/tree/main/docs/sample-artifacts/libcurl4-doc-apt-manifest.json) and [import manifest file](https://github.com/Azure/iot-hub-device-update/tree/main/docs/sample-artifacts/sample-package-update-1.0.1-importManifest.json). This apt manifest will install the latest available version of `libcurl4-doc package` to your IoT device. 

   Alternatively, you can download this [apt manifest file](https://github.com/Azure/iot-hub-device-update/tree/main/docs/sample-artifacts/libcurl4-doc-7.58-apt-manifest.json) and [import manifest file](https://github.com/Azure/iot-hub-device-update/tree/main/docs/sample-artifacts/sample-package-update-2-2.0.1-importManifest.json). This will install specific version v7.58.0 of the `libcurl4-doc package` to your IoT device. 

2. In Azure portal, select the Device Updates option under Automatic Device Management from the left-hand navigation bar in your IoT Hub.

3. Select the Updates tab.

4. Select "+ Import New Update".

5. Select the folder icon or text box under "Select an Import Manifest File". You will see a file picker dialog. Select the Import Manifest you downloaded previously. Next, select the folder icon or text box under "Select one or more update files". You will see a file picker dialog. Select the apt manifest update file you downloaded previously.
   
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

You have now completed a successful end-to-end package update using Device Update for IoT Hub on a Ubuntu Server 18.04 x64 device. 

## Bonus steps

1. Download the following [apt manifest file](https://github.com/Azure/iot-hub-device-update/tree/main/docs/sample-artifacts/libcurl4-doc-remove-apt-manifest.json) and [import manifest file](https://github.com/Azure/iot-hub-device-update/tree/main/docs/sample-artifacts/sample-package-update-1.0.2-importManifest.json). This apt manifest will remove the installed `libcurl4-doc package` from your IoT device. 

2. Repeat the "Import update" and "Deploy update" sections

## Clean up resources

When no longer needed, clean up your device update account, instance, IoT Hub and IoT device. You can do so, by going to each individual resource and selecting "Delete". Note that you need to clean up a device update instance before cleaning up the device update account. 

## Next steps

> [!div class="nextstepaction"]
> [Image Update on Raspberry Pi 3 B+ tutorial](device-update-raspberry-pi.md)

