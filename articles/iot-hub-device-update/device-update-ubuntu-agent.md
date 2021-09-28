---
title: Device Update for Azure IoT Hub tutorial using the Ubuntu Server 18.04 x64 Package agent | Microsoft Docs
description: Get started with Device Update for Azure IoT Hub using the Ubuntu Server 18.04 x64 Package agent.
author: vimeht
ms.author: vimeht
ms.date: 2/16/2021
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Device Update for Azure IoT Hub tutorial using the package agent on Ubuntu Server 18.04 x64

Device Update for IoT Hub supports two forms of updates – image-based and package-based.

Package-based updates are targeted updates that alter only a specific component or application on the device. Package-based updates lead to lower consumption of bandwidth and helps reduce the time to download and install the update. Package updates typically allow for less downtime of devices when applying an update and avoid the overhead of creating images.

This end-to-end tutorial walks you through updating Azure IoT Edge on Ubuntu Server 18.04 x64 by using the Device Update package agent. Although the tutorial demonstrates updating IoT Edge, using similar steps you could update other packages such as the container engine it uses.

The tools and concepts in this tutorial still apply even if you plan to use a different OS platform configuration. Complete this introduction to an end-to-end update process, then choose your preferred form of updating and OS platform to dive into the details.

In this tutorial you will learn how to:
> [!div class="checklist"]
> * Download and install the Device Update agent and its dependencies
> * Add a tag to your device
> * Import an update
> * Create a device group
> * Deploy a package update
> * Monitor the update deployment

## Prerequisites

* If you haven't already done so, create a [Device Update account and instance](create-device-update-account.md), including configuring an IoT Hub.
* The [connection string for an IoT Edge device](../iot-edge/how-to-register-device.md?view=iotedge-2020-11&preserve-view=true#view-registered-devices-and-retrieve-connection-strings).

## Prepare a device
### Using the Automated Deploy to Azure Button

For convenience, this tutorial uses a [cloud-init](../virtual-machines/linux/using-cloud-init.md)-based [Azure Resource Manager template](../azure-resource-manager/templates/overview.md) to help you quickly set up an Ubuntu 18.04 LTS virtual machine. It installs both the Azure IoT Edge runtime and the Device Update package agent and then automatically configures the device with provisioning information using the device connection string for an IoT Edge device (prerequisite) that you supply. The Azure Resource Manager template also avoids the need to start an SSH session to complete setup.

1. To begin, click the button below:

   [![Deploy to Azure Button for iotedge-vm-deploy](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fazure%2Fiotedge-vm-deploy%2Fdevice-update-tutorial%2FedgeDeploy.json)

1. On the newly launched window, fill in the available form fields:

    > [!div class="mx-imgBorder"]
    > [![Screenshot showing the iotedge-vm-deploy template](../iot-edge/media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-deploy.png)](../iot-edge/media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-deploy.png)

    **Subscription**: The active Azure subscription to deploy the virtual machine into.

    **Resource group**: An existing or newly created Resource Group to contain the virtual machine and it's associated resources.

    **DNS Label Prefix**: A required value of your choosing that is used to prefix the hostname of the virtual machine.

    **Admin Username**: A username, which will be provided root privileges on deployment.

    **Device Connection String**: A [device connection string](../iot-edge/how-to-register-device.md) for a device that was created within your intended [IoT Hub](../iot-hub/about-iot-hub.md).

    **VM Size**: The [size](../cloud-services/cloud-services-sizes-specs.md) of the virtual machine to be deployed

    **Ubuntu OS Version**: The version of the Ubuntu OS to be installed on the base virtual machine. Leave the default value unchanged as it will be set to Ubuntu 18.04-LTS already.

    **Location**: The [geographic region](https://azure.microsoft.com/global-infrastructure/locations/) to deploy the virtual machine into, this value defaults to the location of the selected Resource Group.

    **Authentication Type**: Choose **sshPublicKey** or **password** depending on your preference.

    **Admin Password or Key**: The value of the SSH Public Key or the value of the password depending on the choice of Authentication Type.

    When all fields have been filled in, select the checkbox at the bottom of the page to accept the terms and select **Purchase** to begin the deployment.

1. Verify that the deployment has completed successfully. Allow a few minutes after deployment completes for the post-installation and configuration to finish installing IoT Edge and the Device Package update agent.

   A virtual machine resource should have been deployed into the selected resource group.  Take note of the machine name that should be in the format `vm-0000000000000`. Also, take note of the associated **DNS Name**, which should be in the format `<dnsLabelPrefix>`.`<location>`.cloudapp.azure.com.

    The **DNS Name** can be obtained from the **Overview** section of the newly deployed virtual machine within the Azure portal.

    > [!div class="mx-imgBorder"]
    > [![Screenshot showing the dns name of the iotedge vm](../iot-edge/media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-dns-name.png)](../iot-edge/media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-dns-name.png)

   > [!TIP]
   > If you want to SSH into this VM after setup, use the associated **DNS Name** with the command:
    `ssh <adminUsername>@<DNS_Name>`

### (Optional) Manually prepare a device
Similar to the steps automated by the [cloud-init script](https://github.com/Azure/iotedge-vm-deploy/blob/1.2.0-rc4/cloud-init.txt), following are manual steps to install and configure the device. These steps can be used to prepare a physical device.

1. Follow the instructions to [Install the Azure IoT Edge runtime](../iot-edge/how-to-install-iot-edge.md?view=iotedge-2020-11&preserve-view=true).
   > [!NOTE]
   > The Device Update package agent doesn't depend on IoT Edge. But, it does rely on the IoT Identity Service daemon that is installed with IoT Edge (1.2.0 and higher) to obtain an identity and connect to IoT Hub.
   >
   > Although not covered in this tutorial, the [IoT Identity Service daemon can be installed standalone on Linux-based IoT devices](https://azure.github.io/iot-identity-service/installation.html). The sequence of installation matters. The Device Update package agent must be installed _after_ the IoT Identity Service. Otherwise, the package agent will not be registered as an authorized component to establish a connection to IoT Hub.

1. Then, install the Device Update agent .deb packages.

   ```bash
   sudo apt-get install deviceupdate-agent deliveryoptimization-plugin-apt 
   ```

Device Update for Azure IoT Hub software packages are subject to the following license terms:
  * [Device update for IoT Hub license](https://github.com/Azure/iot-hub-device-update/blob/main/LICENSE.md)
  * [Delivery optimization client license](https://github.com/microsoft/do-client/blob/main/LICENSE)

Read the license terms prior to using a package. Your installation and use of a package constitutes your acceptance of these terms. If you do not agree with the license terms, do not use that package.

## Add a tag to your device

1. Log into [Azure portal](https://portal.azure.com) and navigate to the IoT Hub.

2. From 'IoT Edge' on the left navigation pane, find your IoT Edge device and navigate to the Device Twin or Module Twin.

3. In the Module Twin of the Device Update agent module, delete any existing Device Update tag value by setting them to null. If you are using Device identity with Device Update agent make these changes on the Device Twin.

4. Add a new Device Update tag value as shown below.

```JSON
    "tags": {
            "ADUGroup": "<CustomTagValue>"
            },
```

## Import update

1. Go to [Device Update releases](https://github.com/Azure/iot-hub-device-update/releases) in GitHub and click the "Assets" drop-down.

3. Download the `Edge.package.update.samples.zip` by clicking on it.

5. Extract the contents of the folder to discover an update sample and its corresponding import manifests. 

2. In Azure portal, select the Device Updates option under Automatic Device Management from the left-hand navigation bar in your IoT Hub.

3. Select the Updates tab.

4. Select "+ Import New Update".

5. Select the folder icon or text box under "Select an Import Manifest File". You will see a file picker dialog. Select the `sample-1.0.1-aziot-edge-importManifest.json` import manifest from the folder you downloaded previously. Next, select the folder icon or text box under "Select one or more update files". You will see a file picker dialog. Select the `sample-1.0.1-aziot-edge-apt-manifest.json` apt manifest update file from the folder you downloaded previously.
This update will update the `aziot-identity-service` and the `aziot-edge` packages to version 1.2.0~rc4-1 on your device.

   :::image type="content" source="media/import-update/select-update-files.png" alt-text="Screenshot showing update file selection." lightbox="media/import-update/select-update-files.png":::

6. Select the folder icon or text box under "Select a storage container". Then select the appropriate storage account.

7. If you’ve already created a container, you can reuse it. (Otherwise, select "+ Container" to create a new storage container for updates.).  Select the container you wish to use and click "Select".

   :::image type="content" source="media/import-update/container.png" alt-text="Screenshot showing container selection." lightbox="media/import-update/container.png":::

8. Select "Submit" to start the import process.

9. The import process begins, and the screen changes to the "Import History" section. Select "Refresh" to view progress until the import process completes. Depending on the size of the update, the import process may complete in a few minutes but could take longer.

   :::image type="content" source="media/import-update/update-publishing-sequence-2.png" alt-text="Screenshot showing update import sequence." lightbox="media/import-update/update-publishing-sequence-2.png":::

10. When the Status column indicates the import has succeeded, select the "Ready to Deploy" header. You should see your imported update in the list now.

[Learn more](import-update.md) about importing updates.

## Create update group

1. Go to the IoT Hub you previously connected to your Device Update instance.

1. Select the Device Updates option under Automatic Device Management from the left-hand navigation bar.

1. Select the Groups tab at the top of the page.

1. Select the Add button to create a new group.

1. Select the IoT Hub tag you created in the previous step from the list. Select Create update group.

   :::image type="content" source="media/create-update-group/select-tag.PNG" alt-text="Screenshot showing tag selection." lightbox="media/create-update-group/select-tag.PNG":::

[Learn more](create-update-group.md) about adding tags and creating update groups

## Deploy update

1. Once the group is created, you should see a new update available for your device group, with a link to the update in the _Available updates_ column. You may need to Refresh once.

1. Click on the link to the available update.

1. Confirm the correct group is selected as the target group and schedule your deployment

   :::image type="content" source="media/deploy-update/select-update.png" alt-text="Select update" lightbox="media/deploy-update/select-update.png":::

   > [!TIP]
   > By default the Start date/time is 24 hrs from your current time. Be sure to select a different date/time if you want the deployment to begin earlier.

1. Select Deploy update.

1. View the compliance chart. You should see the update is now in progress. 

   :::image type="content" source="media/deploy-update/update-in-progress.png" alt-text="Update in progress" lightbox="media/deploy-update/update-in-progress.png":::

1. After your device is successfully updated, you should see your compliance chart and deployment details update to reflect the same. 

   :::image type="content" source="media/deploy-update/update-succeeded.png" alt-text="Update succeeded" lightbox="media/deploy-update/update-succeeded.png":::

## Monitor an update deployment

1. Select the Deployments tab at the top of the page.

   :::image type="content" source="media/deploy-update/deployments-tab.png" alt-text="Deployments tab" lightbox="media/deploy-update/deployments-tab.png":::

1. Select the deployment you created to view the deployment details.

   :::image type="content" source="media/deploy-update/deployment-details.png" alt-text="Deployment details" lightbox="media/deploy-update/deployment-details.png":::

1. Select Refresh to view the latest status details. Continue this process until the status changes to Succeeded.

You have now completed a successful end-to-end package update using Device Update for IoT Hub on an Ubuntu Server 18.04 x64 device. 

## Clean up resources

When no longer needed, clean up your device update account, instance, IoT Hub, and the IoT Edge device (if you created the VM via the Deploy to Azure button). You can do so, by going to each individual resource and selecting "Delete". You need to clean up a device update instance before cleaning up the device update account.

## Next steps

> [!div class="nextstepaction"]
> [Image Update on Raspberry Pi 3 B+ tutorial](device-update-raspberry-pi.md)
