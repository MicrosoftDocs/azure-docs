---
title: Try Device Update for Azure IoT Hub using a simulator agent
description: Get started with Device Update for Azure IoT Hub using the Ubuntu (18.04 x64) simulator reference agent.
author: kgremban
ms.author: kgremban
ms.date: 12/16/2022
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Tutorial: Device Update for Azure IoT Hub using the Ubuntu (18.04 x64) simulator reference agent

This tutorial demonstrates an end-to-end image-based update using Device Update for IoT Hub. Device Update for Azure IoT Hub supports image-based, package-based, and script-based updates.

Image updates provide a higher level of confidence in the end state of the device. It's typically easier to replicate the results of an image update between a pre-production environment and a production environment because it doesn't pose the same challenges as managing packages and their dependencies. Because of their atomic nature, you can also adopt an A/B failover model easily.

In this tutorial, you'll learn how to:
> [!div class="checklist"]
>
> * Assign an IoT device to a Device Update group using tags.
> * Download and install an image.
> * Import an update.
> * Deploy an image update.
> * Monitor the update deployment.

## Prerequisites

* Create a [Device Update account and instance](create-device-update-account.md) configured with an IoT hub.

* Have an Ubuntu 18.04 device. This device can be either physical or a virtual machine.

* Download the zip file named `Tutorial_Simulator.zip` from [Release Assets](https://github.com/Azure/iot-hub-device-update/releases) in the latest release, and unzip it.

  If your test device is different than your development machine, download the zip file onto both.

  You can use `wget` to download the zip file. Replace `<release_version>` with the latest release, for example `1.0.0`.

  ```bash
  wget https://github.com/Azure/iot-hub-device-update/releases/download/<release_version>/Tutorial_Simulator.zip
  ```

## Register a device and configure a module identity

Add a device to the device registry in your IoT hub. Every device that connects to IoT hub needs to be registered.

In this section, we'll also create a module identity. Modules are independent identities for components that exist on an IoT device, which allows for finer granularity when you have an IoT device running multiple processes. For this tutorial, you'll use this module identity for the Device Update agent that runs on the IoT device. For more information, see [Understand and use module twins in IoT Hub](../iot-hub/iot-hub-devguide-module-twins.md).

1. From the [Azure portal](https://portal.azure.com), navigate to your IoT hub.
1. On the left pane, select **Devices**. Then select **Add Device**.
1. Under **Device ID**, enter a name for the device. Ensure that the **Autogenerate keys** checkbox is selected.
1. Select **Save**.
1. Now, you're returned to the **Devices** page and the device you created should be in the list. Select that device.
1. Select **Add Module Identity**.
1. Under **Module Identity Name**, enter a name for the module, for example, **DUAgent**.
1. Select **Save**

### Copy the module connection string

1. In the device view, you should see your new module listed under the **Module Identities** heading. Select the module name to open its details.
1. Select the **Copy** icon next to **Connection string (primary key)**. Save this connection string to use when you configure the Device Update agent. This string is your *module connection string*.

### Add a tag to your module twin

1. Still on the module identity details page, select **Module Identity Twin**
1. Add a new Device Update tag value at the same level as `modelId` and `version` in the twin file, as shown:

   ```JSON
   "tags": {
       "ADUGroup": "DU-simulator-tutorial"
   },
   ```

   :::image type="content" source="./media/device-update-simulator/add-tag-to-module-twin.png" alt-text="Screenshot of the ADUGroup tag in the module twin.":::

   Every device that's managed by Device Update needs this reserved tag, which assigns the device to a Device Update group. It can be in the device twin or in a module twin, as shown here. Each device can only be assigned to one Device Update group.

1. Select **Save**. The portal reformats the module twin to incorporate the tag into the json structure.

## Install and configure the Device Update agent

The Device Update agent runs on every device that's managed by Device Update. For this tutorial, we'll configure it to run as a simulator so that we can see how an update may be applied to a device without actually changing the device's configuration.

1. On your IoT device, add the Microsoft package repository and then add the Microsoft package signing key to your list of trusted keys.

   ```bash
   wget https://packages.microsoft.com/config/ubuntu/18.04/multiarch/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
   sudo dpkg -i packages-microsoft-prod.deb
   rm packages-microsoft-prod.deb   
   ```

1. Install the Device Update agent .deb packages.

   ```bash
   sudo apt-get update
   sudo apt-get install deviceupdate-agent
   ```

1. Open the agent's configuration file.

   ```bash
   sudo nano /etc/adu/du-config.json
   ```

1. Update the following values in the configuration file:

   * **manufacturer**: `"Contoso"` - This value is used to classify the IoT device for targeting updates.
   * **model**: `"Video"` - This value is used to classify the IoT device for targeting updates.
   * **name**: `"aduagent"`
   * **agents.connectionData**: Provide the connection string that you copied from the module identity.
   * **agents.manufacturer**: `"Contoso"`
   * **agents.model**: `"Video"`

   For more information about the parameters in this step, see [Device Update configuration file](device-update-configuration-file.md).

   > [!NOTE]
   >You can also use the IoT Identity Service to provision the device. To do, that [install the iot indentity service](https://azure.github.io/iot-identity-service/installation.html) before installing the Device Update agent. Then, configure the Device Update agent with `"connectionType": "AIS"` and `connectionData` as a blank string in the configuration file.

1. Save and close the file. `CTRL`+`X`, `Y`, and `Enter`.

1. Set up the agent to run as a simulator. Run the following command on the IoT device so that the Device Update agent invokes the simulator handler to process a package update with SWUpdate (`microsoft/swupdate:1`).

   ```bash
     sudo /usr/bin/AducIotAgent --extension-type updateContentHandler --extension-id 'microsoft/swupdate:1' --register-extension /var/lib/adu/extensions/sources/libmicrosoft_simulator_1.so
   ```

1. Unzip `Tutorial_Simulator.zip` file that you downloaded in the prerequisites and copy the `sample-du-simulator-data.json` file to the `tmp` folder.

   ```bash
   cp sample-du-simulator-data.json /tmp/du-simulator-data.json
   ```

   If /tmp doesn't exist, then run:

   ```bash
   sudo mkdir/tmp
   sudo chown root:root/tmp
   sudo chmod 1777/tmp
   ```  

1. Change permissions for the new file.

   ```bash
   sudo chown adu:adu /tmp/du-simulator-data.json
   sudo chmod 664 /tmp/du-simulator-data.json
   ```
  
1. Restart the Device Update agent to apply your changes.

   ```bash
    sudo systemctl restart deviceupdate-agent
   ```

## Import an update

In this section, you use the files `TutorialImportManifest_Sim.importmanifest.json` and `adu-update-image-raspberrypi3.swu` from the downloaded `Tutorial_Simulator.zip` in the prerequisites. The update file is reused from the Raspberry Pi tutorial. Because the update in this tutorial is simulated, the specific file content doesn't matter.

1. On your development machine, sign in to the [Azure portal](https://portal.azure.com/) and go to your IoT hub that is configured with Device Update.
1. On the navigation pane, under **Device Management**, select **Updates**.
1. Select **Import a new update**.
1. Select **Select from storage container**.
1. Select an existing storage account or create a new account by selecting **+ Storage account**. Then, select an existing container or create a new container by selecting **+ Container**. This container will be used to stage your update files for importing.

   > [!NOTE]
   > We recommend that you use a new container each time you import an update to avoid accidentally importing files from previous updates. If you don't use a new container, be sure to delete any files from the existing container before you finish this step.

   :::image type="content" source="media/import-update/storage-account-ppr.png" alt-text="Screenshot that shows Storage accounts and Containers." lightbox="media/import-update/storage-account-ppr.png":::

1. In your container, select **Upload** and go to the files you downloaded in the prerequisites. Select the **TutorialImportManifest_Sim.importmanifest.json** and the **adu-update-image-raspberrypi3.swu** files, then select **Upload**.

1. Select the checkbox by each file, then select the **Select** button to return to the **Import update** page.

   :::image type="content" source="media/device-update-simulator/select-container-files.png" alt-text="Screenshot that shows selecting uploaded files in the container.":::

1. On the **Import update** page, review the files to be imported. Then select **Import update** to start the import process.

   :::image type="content" source="media/device-update-simulator/import-update.png" alt-text="Screenshot that shows uploaded files that will be imported as an update.":::

1. The import process begins, and the screen switches to the **Import History** section. The **Status** column shows the import as **Running** while the import is in progress, and **Succeeded** when the import is complete. Use the **Refresh** button to update the status.

1. When the **Status** column indicates the import has succeeded, select the **Available updates** header. You should see your imported update in the list now.

   :::image type="content" source="media/device-update-simulator/available-updates.png" alt-text="Screenshot that shows the new update listed as an available update.":::

For more information about the import process, see [Import an update to Device Update for IoT Hub](import-update.md).

## View device groups

Device Update uses groups to organize devices. Device Update automatically sorts devices into groups based on their assigned tags and compatibility properties. Each device belongs to only one group, but groups can have multiple subgroups to sort different device classes.

1. Go to the **Groups and Deployments** tab at the top of the **Updates** page.

1. View the list of groups and the update compliance chart. The update compliance chart shows the count of devices in various states of compliance: **On latest update**, **New updates available**, and **Updates in progress**. [Learn about update compliance](device-update-compliance.md).

   :::image type="content" source="media/device-update-simulator/groups-and-deployments.png" alt-text="Screenshot that shows the update compliance view." lightbox="media/create-update-group/updated-view.png":::

   You should see a device group that contains the simulated device you set up in this tutorial along with any available updates for the devices in the new group. If there are devices that don't meet the device class requirements of the group, they'll show up in a corresponding invalid group.

For more information about tags and groups, see [Manage device groups](create-update-group.md).

## Deploy the update

1. On the **Groups and Deployments** tab, you should see a new update available for your device group. A link to the update should be under **Status**. You might need to refresh the page.

1. Select the group name to view its details.

1. On the group details page, you should see that there's one new update available. Select **Deploy** to start the deployment.

   :::image type="content" source="media/device-update-simulator/group-details.png" alt-text="Screenshot that shows starting a group update deployment." lightbox="media/deploy-update/select-update.png":::

1. The update that we imported in the previous section is listed as the best available update for this group. Select **Deploy**.

1. Schedule your deployment to start immediately, then select **Create**.

1. On the group details page, navigate to the **Current updates** tab. Under **Deployment details**, **Status** turns to **Active**.

1. After your device is successfully updated, return to the **Updates** page. You should see that your compliance chart and deployment details are updated to reflect the same.

## Monitor the update deployment

1. Return to the group details page and select the **Deployment history** tab.

1. Select **View deployment details** next to the deployment you created.

   :::image type="content" source="media/device-update-simulator/view-deployment-details.png" alt-text="Screenshot that shows Deployment details." lightbox="media/deploy-update/deployment-details.png":::

1. Select **Refresh** to view the latest status details.

You've now completed a successful end-to-end image update by using Device Update for IoT Hub using the Ubuntu (18.04 x64) simulator reference agent.

## Clean up resources

If you're going to continue to the next tutorial, keep your Device Update and IoT Hub resources.

When no longer needed, you can delete these resources in the Azure portal.

1. Navigate to your resource group in the [Azure portal](https://portal.azure.com).
1. Choose which resources to delete.

   * If you want to delete all the resources in the group, select **Delete resource group**.
   * If you only want to delete select resources, use the check boxes to select the resources then select **Delete**.

## Next steps

In this tutorial, you learned how to import and deploy an image update. Next, learn how to update device packages.

> [!div class="nextstepaction"]
> [Device Update using the package agent](device-update-ubuntu-agent.md)
