---
title: Azure Device Update for IoT Hub using the Ubuntu package agent
description: Perform an end-to-end package update using the Device Update Ubuntu Server 22.04 x64 package agent to update Azure IoT Edge.
author: eshashah
ms.author: eshashah
ms.date: 12/18/2024
ms.topic: tutorial
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Tutorial: Azure Device Update for IoT Hub using the Ubuntu 22.04 package agent

Device Update for Azure IoT Hub supports image-based, package-based, and script-based updates. This tutorial demonstrates an end-to-end package update using the Device Update Ubuntu Server 22.04 x64 package agent to update Azure IoT Edge.

Package-based updates are targeted to alter only a specific device component or application. These updates have lower bandwidth consumption and shorter download and install times than image-based updates, incurring less device downtime and avoiding the overhead of creating images. In a package-based update, an [APT manifest](device-update-apt-manifest.md) provides the Device Update agent the information it needs to download and install specified packages and their dependencies from a designated repository.

This tutorial walks you through installing Microsoft Defender for IoT, but you can update other packages by using similar steps, such as IoT Edge itself or the container engine it uses. The tools and concepts in this tutorial apply even if you use a different OS platform configuration.

<!-- Finish this introduction to an end-to-end update process. Then choose your preferred form of updating an OS platform to dive into the details. -->

In this tutorial, you:
> [!div class="checklist"]
>
> - Download and install the Device Update agent and its dependencies.
> - Add a group tag to your device.
> - Import the package update.
> - Deploy the package update.
> - View the update deployment history.

## Prerequisites

- A [Device Update account and instance configured with an IoT hub](create-device-update-account.md).
- An [Azure IoT Edge device registered in the IoT hub with the connection string copied](../iot-edge/how-to-provision-single-device-linux-symmetric.md?view=iotedge-2020-11&preserve-view=true#view-registered-devices-and-retrieve-provisioning-information).

## Prepare the device

For convenience, this tutorial uses a [cloud-init](/azure/virtual-machines/linux/using-cloud-init) based [Azure Resource Manager (ARM) template](/azure/azure-resource-manager/templates/overview) to quickly set up an Ubuntu 22.04 LTS virtual machine (VM). The template installs both the IoT Edge runtime and the Device Update package agent, and automatically configures the device with provisioning information by using the IoT Edge device connection string you supply. Using the ARM template also avoids the need to start a secure shell (SSH) session to complete setup.

1. To run the template, select the following **Deploy to Azure** button:

   [![Screenshot showing the Deploy to Azure button for iotedge-vm-deploy](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fazure%2Fiotedge-vm-deploy%2Fmain%2FedgeDeploy.json).

1. Complete the following information:

   - **Subscription**: The active Azure subscription to deploy the VM into.
   - **Resource group**: An existing or new resource group to contain the VM and its resources.
   - **Region**: The [geographic region](https://azure.microsoft.com/global-infrastructure/locations/) to deploy the VM into, which defaults to the location of the resource group.
   - **Dns Label Prefix**: A value to prefix the hostname of the VM.
   - **Admin Username**: A username to provide with root privileges at deployment.
   - **Authentication Type**: Choose **sshPublicKey** or **password**.
   - **Admin Password** or **SSH public key source**, **SSH Key Type**, **Key pair name**: The password or SSH public key information based on the choice of authentication type.
   - **VM Size**: The [size](/azure/cloud-services/cloud-services-sizes-specs) of the VM to deploy.
   - **Ubuntu OS Version**: Leave at **22_04-lts**.
   - **Device Connection String**: The IoT Edge connection string you copied previously.

1. Select **Review + create** at the bottom of the page. When validation succeeds, select **Create** to begin the template deployment.

1. Verify that the deployment completes successfully, and allow a few minutes after deployment completes for the post-installation and configuration to finish installing IoT Edge and the device package update agent.

1. You should see a VM resource in the selected resource group. Note the machine name, which is in the format `vm-0000000000000`. Select the VM name, and on the VM **Overview** page, note the **DNS name**, which is in the format `<dnsLabelPrefix>`.`<location>.cloudapp.azure.com`.

   :::image type="content" source="../iot-edge/media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-dns-name.png" alt-text="Screenshot showing the DNS name of the IoT Edge VM." lightbox="../iot-edge/media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-dns-name.png":::

> [!TIP]
> To SSH into this VM after setup, use the associated **DNS name** with the command `ssh <admin username>@<DNS name>`.

## Install the Device Update agent on the VM

>[!IMPORTANT]
>Azure Device Update for IoT Hub software is subject to the following license terms:
>
>- [Device update for IoT Hub license](https://github.com/Azure/iot-hub-device-update/blob/main/LICENSE)
>- [Delivery optimization client license](https://github.com/microsoft/do-client/blob/main/LICENSE)
>
>Read the license terms before using the agent. Agent installation and use constitutes acceptance of these terms. If you don't agree with the license terms, don't use the Device Update agent.
1. To install the Device Update agent on the VM, run the following command.

   ```bash
   sudo apt-get install deviceupdate-agent
   ```

1. Open the *du-config.json* configuration details file by using the following command.

   ```bash
   sudo nano /etc/adu/du-config.json
   ```

1. In the file, replace all `<placeholder>` values with your own configuration. Set your `connectionType` as `"AIS"` and `connectionData` as an empty string. For an example file, see [Example du-config.json file contents](device-update-configuration-file.md#example-du-configjson-file-contents).

1. Restart the Device Update agent by running the following command.

   ```bash
   sudo systemctl restart deviceupdate-agent
   ```

>[!NOTE]
>If you used the [simulator agent](device-update-simulator.md) on this device previously, run the following command to invoke the APT handler and deploy over-the-air package updates for this tutorial.
>
>```sh
>sudo /usr/bin/AducIotAgent --register-content-handler /var/lib/adu/extensions/sources/libmicrosoft_apt_1.so --update-type 'microsoft/apt:1'
>```


## Add a group tag to your device

Device Update automatically organizes devices into groups based on their assigned tags and compatibility properties. Each device can belong to only one group, but groups can have multiple subgroups to sort different device classes. For more information about tags and groups, see [Manage device groups](create-update-group.md).

1. On the [Azure portal](https://portal.azure.com) IoT hub page for your Device Update instance, select **Device management** > **Devices** from the left navigation.
1. Go to the **Device twin** or **Module Identity** twin for your device.
1. In the device twin or Device Update agent **Module Identity Twin** file, delete any existing Device Update tag values by setting them to `null`, and then add the following new Device Update group tag.

   If you're using device identity with the Device Update agent, make these changes on the device twin. If you're using a module identity with the Device Update agent module, add the tag in the **Module Identity Twin**.

   ```json
   "tags": {
       "ADUGroup": "<GroupTagValue>"
   },
   ```
   The following screenshot shows where in the file to add the tag.

   :::image type="content" source="media/import-update/device-twin-ppr.png" alt-text="Screenshot that shows twin with tag information.":::

1. Select **Save**.

## Import the update

The *Tutorial_IoTEdge_PackageUpdate.zip* file has the required files for the tutorial.

1. Download the *Tutorial_IoTEdge_PackageUpdate.zip* file from the **Assets** section of the latest release on the [GitHub Device Update Releases page](https://github.com/Azure/iot-hub-device-update/releases).
1. Unzip the file. The extracted *Tutorial_IoTEdge_PackageUpdate* folder contains the *sample-defender-iot-apt-manifest.json* sample APT manifest and its corresponding *sample-defender-iot--importManifest.json* import manifest.
1. On the [Azure portal](https://portal.azure.com) IoT hub page for your Device Update instance, select **Device Management** > **Updates** from the left navigation.
1. On the **Updates** page, select **Import a new update**.
1. On the **Import update** page, select **Select from storage container**.
1. On the **Storage accounts** page, select an existing storage account or create a new account by selecting **Storage account**.
1. On the **Containers** page, select an existing container or create a new container by selecting **Container**. You use the container to stage the update files for import.

   :::image type="content" source="media/import-update/storage-account-ppr.png" alt-text="Screenshot that shows Storage accounts and Containers.":::

   > [!TIP]
   > To avoid accidentally importing files from previous updates, use a new container each time you import an update. If you don't use a new container, be sure to delete any files from the existing container.

1. On the container page, select **Upload**, drag and drop or browse to and select the update files you downloaded, and then select **Upload**. After they upload, the files appear on the container page.

1. Review and select the files to import, and then select **Select**.

   :::image type="content" source="media/import-update/import-select-package.png" alt-text="Screenshot that shows selecting uploaded files.":::

1. On the **Import update** screen, select **Import update**.

   :::image type="content" source="media/import-update/import-start-package.png" alt-text="Screenshot that shows Import update.":::

The import process begins, and the screen switches to the **Updates** screen. After the import succeeds, it appears on the **Updates** tab. For more information about the import process, see [Import an update to Device Update](import-update.md).

:::image type="content" source="media/import-update/update-ready-package.png" alt-text="Screenshot that shows job status.":::

## Select the device group
You can use the group tag you applied to your device to deploy the update to the device group. Select the **Groups and Deployments** tab at the top of the **Updates** page to view the list of groups and deployments and the update compliance chart.

The update compliance chart shows the count of devices in various states of compliance: **On latest update**, **New updates available**, and **Updates in progress**. For more information, see [Device Update compliance](device-update-compliance.md).

Under **Group name**, you see a list of all the device groups for devices connected to this IoT hub and their available updates, with links to deploy the updates under **Status**. Any devices that don't meet the device class requirements of a group appear in a corresponding invalid group. For more information about tags and groups, see [Manage device groups](create-update-group.md).

You should see the device group that contains the device you set up in this tutorial, along with the available updates for the devices in the group. You might need to refresh the page. To deploy the best available update to the group from this view, select **Deploy** next to the group.

:::image type="content" source="media/create-update-group/updated-view.png" alt-text="Screenshot that shows the update compliance view." lightbox="media/create-update-group/updated-view.png":::

## Deploy the update

1. On the **Group details** page, select the **Current deployment** tab and then select **Deploy** next to the desired update in the **Available updates** section. The best available update for the group is denoted with a **Best** highlight.

   :::image type="content" source="media/deploy-update/select-update.png" alt-text="Screenshot that shows selecting an update." lightbox="media/deploy-update/select-update.png":::

1. On the **Create deployment** page, schedule your deployment to start immediately or in the future, and then select **Create**.

   :::image type="content" source="media/deploy-update/create-deployment.png" alt-text="Screenshot that shows creating a deployment." lightbox="media/deploy-update/create-deployment.png":::

   > [!TIP]
   > By default, the **Start** date and time is 24 hours from your current time. Be sure to select a different date and time if you want the deployment to begin sooner.

1. On the **Group details** page under **Deployment details**, **Status** turns to **Active**. Under **Available updates**, the selected update is marked with **(deploying)**.

   :::image type="content" source="media/deploy-update/deployment-active.png" alt-text="Screenshot that shows the deployment as Active." lightbox="media/deploy-update/deployment-active.png":::

1. On the **Groups and Deployments** tab of the **Updates** page, view the compliance chart to see that the update is now in progress. After your device successfully updates, the compliance chart and deployment details update to reflect that status.

   :::image type="content" source="media/deploy-update/update-succeeded.png" alt-text="Screenshot that shows the update succeeded." lightbox="media/deploy-update/update-succeeded.png":::

<a name="monitor-the-update-deployment"></a>
## View update deployment history

1. Select the **Deployment history** tab at the top of the **Group details** page, and select the **details** link next to the deployment you created.

   :::image type="content" source="media/deploy-update/deployments-history.png" alt-text="Screenshot that shows Deployment history." lightbox="media/deploy-update/deployments-history.png":::

1. On the **Deployment details** page, select the **Refresh** icon to view the latest status details.

   :::image type="content" source="media/deploy-update/deployment-details.png" alt-text="Screenshot that shows deployment details." lightbox="media/deploy-update/deployment-details.png":::

## Clean up resources

When you no longer need the resources you created for this tutorial, you can delete them.

1. In the [Azure portal](https://portal.azure.com), navigate to the resource group that contains the resources.
1. If you want to delete all the resources in the group, select **Delete resource group**.
1. If you want to delete only some of the resources, use the check boxes to select the resources and then select **Delete**.

## Related content

- [Device Update for IoT Hub using a simulator agent](device-update-raspberry-pi.md)
- [Device Update and IoT Plug and Play](device-update-plug-and-play.md)
- [Update device components or connected sensors with Device Update](device-update-howto-proxy-updates.md)
