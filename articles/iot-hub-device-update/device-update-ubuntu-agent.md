---
title: Device Update for Azure IoT Hub tutorial using the Ubuntu Server 18.04 x64 Package agent | Microsoft Docs
description: Get started with Device Update for Azure IoT Hub using the Ubuntu Server 18.04 x64 Package agent.
author: vimeht
ms.author: vimeht
ms.date: 1/26/2022
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Device Update for Azure IoT Hub tutorial using the package agent on Ubuntu Server 18.04 x64

Device Update for IoT Hub supports image-based, package-based and script-based updates.

Package-based updates are targeted updates that alter only a specific component or application on the device. They lead to lower consumption of bandwidth and helps reduce the time to download and install the update. Package-based updates also typically allow for less downtime of devices when applying an update and avoid the overhead of creating images. They use an [APT manifest](device-update-apt-manifest.md) which provides the Device Update Agent with the information it needs to download and install the packages specified in the APT Manifest file (as well as their dependencies) from a designated repository.

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
* The [connection string for an IoT Edge device](../iot-edge/how-to-provision-single-device-linux-symmetric.md?view=iotedge-2020-11&preserve-view=true#view-registered-devices-and-retrieve-provisioning-information).
* If you used the [Simulator agent tutorial](device-update-simulator.md) for testing prior to this, run the below command to invoke the APT handler and can deploy over-the-air Package Updates in this tutorial.

```sh
# sudo /usr/bin/AducIotAgent --register-content-handler /var/lib/adu/extensions/sources/libmicrosoft_apt_1.so --update-type 'microsoft/a pt:1'
```

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

    **Device Connection String**: A [device connection string](../iot-edge/how-to-provision-single-device-linux-symmetric.md#view-registered-devices-and-retrieve-provisioning-information) for a device that was created within your intended [IoT Hub](../iot-hub/about-iot-hub.md).

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
### Manually prepare a device
Similar to the steps automated by the [cloud-init script](https://github.com/Azure/iotedge-vm-deploy/blob/1.2.0-rc4/cloud-init.txt), following are manual steps to install and configure the device. These steps can be used to prepare a physical device.

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
   
1. Finally restart the Device Update agent by running the command below.

   ```markdown
    sudo systemctl restart adu-agent
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

1. Go to [Device Update releases](https://github.com/Azure/iot-hub-device-update/releases) in GitHub and click the "Assets" drop-down. Download the `Edge.package.update.samples.zip` by clicking on it. Extract the contents of the folder to discover a sample APT manifest(sample-1.0.1-aziot-edge-apt-manifest.json) and its corresponding import manifest(sample-1.0.1-aziot-edge-importManifest.json). 

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
   > [!TIP]
   > By default the Start date/time is 24 hrs from your current time. Be sure to select a different date/time if you want the deployment to begin earlier.
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


You have now completed a successful end-to-end package update using Device Update for IoT Hub on an Ubuntu Server 18.04 x64 device. 

## Clean up resources

When no longer needed, clean up your device update account, instance, IoT Hub, and the IoT Edge device (if you created the VM via the Deploy to Azure button). You can do so, by going to each individual resource and selecting "Delete". You need to clean up a device update instance before cleaning up the device update account.

## Next steps

You can use the following tutorials for a simple demonstration of Device Update for IoT Hub:

- [Image Update: Getting Started with Raspberry Pi 3 B+ Reference Yocto Image](device-update-raspberry-pi.md) extensible via open source to build you own images for other architecture as needed.
		
- [Proxy Update: Getting Started using Device Update binary agent for downstream devices](device-update-howto-proxy-updates.md)
	
- [Getting Started Using Ubuntu (18.04 x64) Simulator Reference Agent](device-update-simulator.md)

- [Device Update for Azure IoT Hub tutorial for Azure-Real-Time-Operating-System](device-update-azure-real-time-operating-system.md)
