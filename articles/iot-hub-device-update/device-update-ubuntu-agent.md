---
title: Device Update for Azure IoT Hub tutorial using the Ubuntu Server 18.04 x64 package agent | Microsoft Docs
description: Get started with Device Update for Azure IoT Hub by using the Ubuntu Server 18.04 x64 package agent.
author: vimeht
ms.author: vimeht
ms.date: 1/26/2022
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Tutorial: Device Update for Azure IoT Hub using the package agent on Ubuntu Server 18.04 x64

Device Update for Azure IoT Hub supports image-based, package-based, and script-based updates.

Package-based updates are targeted updates that alter only a specific component or application on the device. They lead to lower consumption of bandwidth and help reduce the time to download and install the update. Package-based updates also typically allow for less downtime of devices when you apply an update and avoid the overhead of creating images. They use an [APT manifest](device-update-apt-manifest.md), which provides the Device Update agent with the information it needs to download and install the packages specified in the APT manifest file (and their dependencies) from a designated repository.

This tutorial walks you through updating Azure IoT Edge on Ubuntu Server 18.04 x64 by using the Device Update package agent. Although the tutorial demonstrates updating IoT Edge, by using similar steps you could update other packages, such as the container engine it uses.

The tools and concepts in this tutorial still apply even if you plan to use a different OS platform configuration. Finish this introduction to an end-to-end update process. Then choose your preferred form of updating an OS platform to dive into the details.

In this tutorial, you'll learn how to:
> [!div class="checklist"]
>
> * Download and install the Device Update agent and its dependencies.
> * Add a tag to your device.
> * Import an update.
> * Deploy a package update.
> * Monitor the update deployment.

## Prerequisites

* If you haven't already done so, create a [Device Update account and instance](create-device-update-account.md). Configure an IoT hub.
* You need the [connection string for an IoT Edge device](../iot-edge/how-to-provision-single-device-linux-symmetric.md?view=iotedge-2020-11&preserve-view=true#view-registered-devices-and-retrieve-provisioning-information).
* If you used the [Simulator agent tutorial](device-update-simulator.md) for prior testing, run the following command to invoke the APT handler and deploy over-the-air package updates in this tutorial:

  ```sh
  sudo /usr/bin/AducIotAgent --register-content-handler /var/lib/adu/extensions/sources/libmicrosoft_apt_1.so --update-type 'microsoft/apt:1'
  ```

## Prepare a device

Prepare a device automatically or manually.

### Use the automated Deploy to Azure button

For convenience, this tutorial uses a [cloud-init](../virtual-machines/linux/using-cloud-init.md)-based [Azure Resource Manager template](../azure-resource-manager/templates/overview.md) to help you quickly set up an Ubuntu 18.04 LTS virtual machine. It installs both the Azure IoT Edge runtime and the Device Update package agent. Then it automatically configures the device with provisioning information by using the device connection string for an IoT Edge device (prerequisite) that you supply. The Resource Manager template also avoids the need to start an SSH session to complete setup.

1. To begin, select the button:

   [![Screenshot showing the Deploy to Azure button for iotedge-vm-deploy](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fazure%2Fiotedge-vm-deploy%2Fdevice-update-tutorial%2FedgeDeploy.json).

1. Fill in the available text boxes:

   > [!div class="mx-imgBorder"]
   > [![Screenshot showing the iotedge-vm-deploy template.](../iot-edge/media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-deploy.png)](../iot-edge/media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-deploy.png)

   * **Subscription**: The active Azure subscription to deploy the virtual machine into.
   * **Resource group**: An existing or newly created resource group to contain the virtual machine and its associated resources.
   * **Region**: The [geographic region](https://azure.microsoft.com/global-infrastructure/locations/) to deploy the virtual machine into. This value defaults to the location of the selected resource group.
   * **DNS Label Prefix**: A required value of your choosing that's used to prefix the hostname of the virtual machine.
   * **Admin Username**: A username, which is provided root privileges on deployment.
   * **Device Connection String**: A [device connection string](../iot-edge/how-to-provision-single-device-linux-symmetric.md#view-registered-devices-and-retrieve-provisioning-information) for a device that was created within your intended [IoT hub](../iot-hub/about-iot-hub.md).
   * **VM Size**: The [size](../cloud-services/cloud-services-sizes-specs.md) of the virtual machine to be deployed.
   * **Ubuntu OS Version**: The version of the Ubuntu OS to be installed on the base virtual machine. Leave the default value unchanged because it will be set to Ubuntu 18.04-LTS already.
   * **Authentication Type**: Choose **sshPublicKey** or **password** based on your preference.
   * **Admin Password or Key**: The value of the SSH Public Key or the value of the password based on the choice of authentication type.

   After all the boxes are filled in, select the checkbox at the bottom of the page to accept the terms. Select **Purchase** to begin the deployment.

1. Verify that the deployment has completed successfully. Allow a few minutes after deployment completes for the post-installation and configuration to finish installing IoT Edge and the device package update agent.

   A virtual machine resource should have been deployed into the selected resource group. Note the machine name, which is in the format `vm-0000000000000`. Also note the associated **DNS name**, which is in the format `<dnsLabelPrefix>`.`<location>`.cloudapp.azure.com.

   You can obtain the **DNS name** from the **Overview** section of the newly deployed virtual machine in the Azure portal.

   > [!div class="mx-imgBorder"]
   > [![Screenshot showing the DNS name of the iotedge vm.](../iot-edge/media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-dns-name.png)](../iot-edge/media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-dns-name.png)

   > [!TIP]
   > To SSH into this VM after setup, use the associated **DNS name** with the following command:
    `ssh <adminUsername>@<DNS_Name>`.

1. Open the configuration details (See how to [set up configuration file here](device-update-configuration-file.md) with the command below. Set your connectionType as 'AIS' and connectionData as empty string. Please note that all values with the 'Place value here' tag must be set. See [Configuring a DU agent](./device-update-configuration-file.md#example-du-configjson-file-contents).

   ```bash
   sudo nano /etc/adu/du-config.json
   ```

1. Restart the Device Update agent.

   ```bash
   sudo systemctl restart deviceupdate-agent
   ```

Device Update for Azure IoT Hub software packages are subject to the following license terms:

* [Device update for IoT Hub license](https://github.com/Azure/iot-hub-device-update/blob/main/LICENSE)
* [Delivery optimization client license](https://github.com/microsoft/do-client/blob/main/LICENSE)

Read the license terms before you use a package. Your installation and use of a package constitutes your acceptance of these terms. If you don't agree with the license terms, don't use that package.

### Manually prepare a device

Similar to the steps automated by the [cloud-init script](https://github.com/Azure/iotedge-vm-deploy/blob/1.2.0-rc4/cloud-init.txt), the following manual steps are used to install and configure a device. Use these steps to prepare a physical device.

1. Follow the instructions to [install the Azure IoT Edge runtime](../iot-edge/how-to-provision-single-device-linux-symmetric.md?view=iotedge-2020-11&preserve-view=true).

   > [!NOTE]
   > The Device Update agent doesn't depend on IoT Edge. But it does rely on the IoT Identity Service daemon that's installed with IoT Edge (1.2.0 and higher) to obtain an identity and connect to IoT Hub.
   >
   > Although not covered in this tutorial, the [IoT Identity Service daemon can be installed standalone on Linux-based IoT devices](https://azure.github.io/iot-identity-service/installation.html). The sequence of installation matters. The Device Update package agent must be installed _after_ the IoT Identity Service. Otherwise, the package agent won't be registered as an authorized component to establish a connection to IoT Hub.

1. Install the Device Update agent .deb packages:

   ```bash
   sudo apt-get install deviceupdate-agent 
   ```

1. Enter your IoT device's module (or device, depending on how you [provisioned the device with Device Update](device-update-agent-provisioning.md)) primary connection string in the configuration file. Please note that all values with the 'Place value here' tag must be set. See [Configuring a DU agent](./device-update-configuration-file.md#example-du-configjson-file-contents).

   ```bash
   sudo /etc/adu/du-config.json
   ```

1. Restart the Device Update agent.

   ```bash
   sudo systemctl restart deviceupdate-agent
   ```

Device Update for Azure IoT Hub software packages are subject to the following license terms:

* [Device update for IoT Hub license](https://github.com/Azure/iot-hub-device-update/blob/main/LICENSE)
* [Delivery optimization client license](https://github.com/microsoft/do-client/blob/main/LICENSE)

Read the license terms before you use a package. Your installation and use of a package constitutes your acceptance of these terms. If you don't agree with the license terms, don't use that package.

## Add a tag to your device

1. Sign in to the [Azure portal](https://portal.azure.com) and go to the IoT hub.
1. On the left pane, under **Devices**, find your IoT Edge device and go to the device twin or module twin.
1. In the module twin of the Device Update agent module, delete any existing Device Update tag values by setting them to null. If you're using Device identity with Device Update agent, make these changes on the device twin.
1. Add a new Device Update tag value, as shown:

   ```JSON
       "tags": {
           "ADUGroup": "<CustomTagValue>"
       },
   ```

   :::image type="content" source="media/import-update/device-twin-ppr.png" alt-text="Screenshot that shows twin with tag information." lightbox="media/import-update/device-twin-ppr.png":::

   _This screenshot shows the section where the tag needs to be added in the twin._

## Import the update

1. Go to [Device Update releases](https://github.com/Azure/iot-hub-device-update/releases) in GitHub and select the **Assets** dropdown list. Download `Tutorial_IoTEdge_PackageUpdate.zip` by selecting it. Extract the contents of the folder to discover a sample APT manifest (sample-1.0.2-aziot-edge-apt-manifest.json) and its corresponding import manifest (sample-1.0.2-aziot-edge-importManifest.json).
1. Sign in to the [Azure portal](https://portal.azure.com/) and go to your IoT hub with Device Update. On the left pane, under **Automatic Device Management**, select **Updates**.
1. Select the **Updates** tab.
1. Select **+ Import New Update**.
1. Select **+ Select from storage container**. Select an existing account or create a new account by using **+ Storage account**. Then select an existing container or create a new container by using **+ Container**. This container is used to stage your update files for importing.

   > [!NOTE]
   > We recommend that you use a new container each time you import an update to avoid accidentally importing files from previous updates. If you don't use a new container, be sure to delete any files from the existing container before you finish this step.

   :::image type="content" source="media/import-update/storage-account-ppr.png" alt-text="Screenshot that shows Storage account." lightbox="media/import-update/storage-account-ppr.png":::

1. In your container, select **Upload** and go to the files you downloaded in step 1. After you select all your update files, select **Upload**. Then select the **Select** button to return to the **Import update** page.

   :::image type="content" source="media/import-update/import-select-ppr.png" alt-text="Screenshot that shows selecting uploaded files." lightbox="media/import-update/import-select-ppr.png":::

   _This screenshot shows the import step. File names might not match the ones used in the example._

1. On the **Import update** page, review the files to be imported. Then select **Import update** to start the import process.

   :::image type="content" source="media/import-update/import-start-2-ppr.png" alt-text="Screenshot that shows starting the Import process." lightbox="media/import-update/import-start-2-ppr.png":::

1. The import process begins, and the screen switches to the **Import History** section. When the **Status** column indicates that the import succeeded, select the **Available updates** header. You should see your imported update in the list now.

   :::image type="content" source="media/import-update/update-ready-ppr.png" alt-text="Screenshot that shows the job status." lightbox="media/import-update/update-ready-ppr.png":::

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

You've now completed a successful end-to-end package update by using Device Update for IoT Hub on an Ubuntu Server 18.04 x64 device.

## Clean up resources

When no longer needed, clean up your device update account, instance, and IoT hub. Also clean up the IoT Edge device if you created the VM via the **Deploy to Azure** button. To clean up resources, go to each individual resource and select **Delete**. Clean up a device update instance before you clean up the device update account.

## Next steps

> [!div class="nextstepaction"]
> [Update device components or connected sensors with Device Update](device-update-howto-proxy-updates.md)
