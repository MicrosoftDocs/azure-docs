---
title: Device Update for Azure IoT Hub tutorial using the Ubuntu Server 18.04 x64 Package agent | Microsoft Docs
description: Get started with Device Update for Azure IoT Hub using the Ubuntu Server 18.04 x64 Package agent.
author: vimeht
ms.author: vimeht
ms.date: 2/16/2021
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Getting Started with the Ubuntu Server 18.04 x64 Package agent

Device Update for IoT Hub supports two forms of updates – image-based
and package-based.

Package-based updates are targeted updates that alter only a specific component
or application on the device. This leads to lower consumption of
bandwidth and helps reduce the time to download and install the update. Package
updates typically allow for less downtime of devices when applying an update and
avoid the overhead of creating images.

This tutorial walks you through the steps to complete an end-to-end package-based update through Device Update for IoT Hub on a device running Azure IoT Edge. For this tutorial we use the package agent for Ubuntu Server 18.04 x64 to update a sample package. Using similar steps as this tutorial you could update Azure IoT Edge itself or the container engine.

Even if you plan on using a different OS platform configuration, this tutorial is still useful to learn about the tools and concepts in Device Update for IoT Hub. Complete this introduction to an end-to-end update process, then choose your preferred form of updating and OS platform to dive into the details.

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
* A Device Update instance and account linked to your IoT Hub.
  * Follow the guide to [create and link a device update account](create-device-update-account.md) if you have not done so previously.

The next section walks you through creating a virtual Linux IoT Edge device that has the Device Update package agent installed. If you want to use your own Linux device instead, follow the installation steps in [Install the Azure IoT Edge runtime](../iot-edge/how-to-install-iot-edge.md?view=iotedge-2020-11), then return to this tutorial and install the package agent and its dependencies with the following command:

   ```bash
   sudo apt-get install deviceupdate-agent deliveryoptimization-plugin-apt 
   ```

> [!NOTE]
> The Device Update package agent relies on an IoT identity service daemon installed with IoT Edge (1.2.0 and higher) to obtain an identity and connect to IoT Hub. Although beyond the scope of this tutorial, the IoT identity service daemon and Device Update package agent can be installed on Linux-based IoT devices.

Device Update for Azure IoT Hub software packages are subject to the following license terms:
  * [Device update for IoT Hub license](https://github.com/Azure/iot-hub-device-update/blob/main/LICENSE.md)
  * [Delivery optimization client license](https://github.com/microsoft/do-client/blob/main/LICENSE.md)

Read the license terms prior to using a package. Your installation and use of a package constitutes your acceptance of these terms. If you do not agree with the license terms, do not use that package.

## Setting up your environment
Prepare your environment for the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

Cloud resources:

- You'll need a resource group to manage the VM you use in this quickstart. We use the example resource group name **IoTEdgeDeviceUpdate**.

   ```azurecli-interactive
   az group create --name IoTEdgeDeviceUpdate --location westus2
   ```

## Create a VM configured with Device Update and IoT Edge

1. Create a device identity in IoT Hub for your IoT Edge device
   ```azurecli-interactive
   az iot hub device-identity create --device-id myEdgeDevice --edge-enabled --hub-name {hub_name}
   ```

   If you get an error about iothubowner policy keys, make sure that your Cloud Shell is running the latest version of the azure-iot extension.

2. Create a new virtual machine and install both the IoT Edge runtime and Device Update package agent using an Azure Resource Manager template

   * For bash or Cloud Shell users, copy the following command into a text editor, replace the placeholder text with your information, then copy into your bash or Cloud Shell window:

      ```azurecli-interactive
      az deployment group create \
      --resource-group IoTEdgeDeviceUpdate \
      --template-uri "https://aka.ms/iotedge-vm-deploy" \
      --parameters dnsLabelPrefix='<REPLACE_WITH_VM_NAME>' \
      --parameters adminUsername='azureUser' \
      --parameters deviceConnectionString=$(az iot hub device-identity connection-string show --device-id myEdgeDevice --hub-name
      <REPLACE_WITH_HUB_NAME> -o tsv) \
      --parameters authenticationType='password' \
      --parameters adminPasswordOrKey="<REPLACE_WITH_PASSWORD>"
      ```

   * For PowerShell users, copy the following command into your PowerShell window, then replace the placeholder text with your own information:

      ```azurecli
      az deployment group create `
      --resource-group IoTEdgeDeviceUpdate `
      --template-uri "https://aka.ms/iotedge-vm-deploy" `
      --parameters dnsLabelPrefix='<REPLACE_WITH_VM_NAME>' `
      --parameters adminUsername='azureUser' `
      --parameters deviceConnectionString=$(az iot hub device-identity connection-string show --device-id myEdgeDevice --hub-name <REPLACE_WITH_HUB_NAME> -o tsv) `
      --parameters authenticationType='password' `
      --parameters adminPasswordOrKey="<REPLACE_WITH_PASSWORD>"
      ```

Be sure to update the following parameters:

| Parameter | Description |
| --------- | ----------- |
| **dnsLabelPrefix** | A string that will be used to create the virtual machine's hostname. Replace the placeholder text with a name for your virtual machine. |
| **deviceConnectionString** | The connection string from the device identity in IoT Hub, which is used to configure the IoT identity service daemon on the virtual machine. The CLI command within this parameter grabs the connection string for you. Replace the placeholder text with your IoT hub name. |
| **authenticationType** | The authentication method for the admin account. This quickstart uses **password** authentication, but you can also set this parameter to **sshPublicKey**. |
| **adminPasswordOrKey** | The password or value of the SSH key for the admin account. Replace the placeholder text with a secure password. Your password must be at least 12 characters long and have three of four of the following: lowercase characters, uppercase characters, digits, and special characters. |

   > [!TIP]
   > If you need to connect to the VM once the deployment is complete you'll find the SSH information in the JSON-formatted output in the CLI. Copy the value of the **public SSH** entry of the **outputs** section: 
   > ![Retrieve public ssh value from output](../iot-edge/media/quickstart-linux/outputs-public-ssh.png)

## Add a tag to your device

1. Log into [Azure portal](https://portal.azure.com) and navigate to the IoT Hub.

2. From 'IoT Edge' on the left navigation pane find your IoT Edge device and navigate to the Device Twin.

3. In the Device Twin, delete any existing Device Update tag value by setting them to null.

4. Add a new Device Update tag value as shown below.

```JSON
    "tags": {
            "ADUGroup": "<CustomTagValue>"
            },
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

1. Once the group is created, you should see a new update available for your device group, with a link to the update in the _Available updates_ column. You may need to Refresh once.

2. Click on the link to the available update.

3. Confirm the correct group is selected as the target group and schedule your deployment

   :::image type="content" source="media/deploy-update/select-update.png" alt-text="Select update" lightbox="media/deploy-update/select-update.png":::

   > [!TIP]
   > By default the Start date/time is 24 hrs from your current time. Be sure to select a different date/time if you want the deployment to begin earlier.

4. Select Deploy update.

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
