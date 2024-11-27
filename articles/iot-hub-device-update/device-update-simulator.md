---
title: Azure Device Update for IoT Hub using a simulator agent
description: Get started with Device Update for Azure IoT Hub using the Ubuntu 18.04 x64 simulator agent.
author: kgremban
ms.author: kgremban
ms.date: 11/25/2024
ms.topic: tutorial
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Tutorial: Azure Device Update for IoT Hub using the Ubuntu 18.04 simulator agent

Azure Device Update for IoT Hub supports image-based, package-based, and script-based updates. This tutorial demonstrates an end-to-end image-based update for Device Update for IoT Hub that uses an Ubuntu 18.04 x64 simulator agent.

Image updates provide a high level of confidence in the end state of the device, and don't pose the same package and dependency management challenges as package or script based updates. It's easier to replicate the results of an image update between a preproduction and production environment, or easily adopt an A/B failover model.

In this tutorial, you:
> [!div class="checklist"]
>
> - Assign an IoT device to a Device Update group by using tags.
> - Download and install an image.
> - Import an update.
> - Deploy the image update.
> - Monitor the update deployment.

## Prerequisites

- A test IoT device
- A [Device Update account and instance configured with an IoT hub](create-device-update-account.md)
- An Ubuntu 18.04 x64 physical or virtual machine

## Get the simulator files

1. Download the *Tutorial_Simulator.zip* ZIP archive from the **Assets** section of the latest release on the [GitHub Device Update Releases](https://github.com/Azure/iot-hub-device-update/releases) page. If your test device is different than your development machine, download the ZIP file onto both devices.

   You can use `wget` to download the ZIP file. Replace `<release_version>` with the latest release, for example `1.0.0`.

   ```bash
   wget https://github.com/Azure/iot-hub-device-update/releases/download/<release_version>/Tutorial_Simulator.zip
   ```

1. Unzip the file.

## Register and configure a device and module

Add a device to the device registry in your IoT hub. Every device that connects to IoT Hub must be registered.

1. In the [Azure portal](https://portal.azure.com), open the IoT hub page associated with your Device Update instance.
1. In the navigation pane, select **Device management** > **Devices**.
1. On the **Devices** page, select **Add Device**.
1. Under **Device ID**, enter a name for the device. Ensure that **Autogenerate keys** checkbox is selected.
1. Select **Save**.

### Create a module identity

After you register the device, create a module identity. Modules are independent identities for components that exist on an IoT device, which allow for finer granularity when an IoT device runs multiple processes.

For this tutorial, you create a module identity for the Device Update agent that runs on the IoT device. For more information, see [Understand and use module twins in IoT Hub](../iot-hub/iot-hub-devguide-module-twins.md).

1. On the **Devices** page, select the device you registered.
1. On the device page, select **Add Module Identity**.
1. On the **Add Module Identity** page, under **Module Identity Name**, enter a name for the module such as **DeviceUpdateAgent**.
1. Select **Save**. The new module identity appears under **Module Identities**. 
1. Select the module name, and on the **Module Identity Details** page, select the **Copy** icon next to **Connection string (primary key)**. Save this *module connection string* to use when you configure the Device Update agent.

### Add a tag to your module twin

Every device that's managed by Device Update needs a reserved tag that assigns the device to a Device Update group. The tag can be in the device twin or in a module twin, as shown here. Each device can be assigned to only one Device Update group.

1. On the **Module Identity Details** page, select **Module Identity Twin**.
1. On the **Module Identity Twin** page, add a new Device Update tag to the JSON code at the same level as `modelId` and `version`, as follows:

   ```json
   "tags": {
       "DeviceUpdateGroup": "simulator-tutorial"
   },
   ```

1. Select **Save**. The portal reformats the module twin to incorporate the tag into the JSON structure.

## Install and configure the Device Update agent

The Device Update agent runs on every device that Device Update manages. In this tutorial, you configure the Device Update agent to run as a simulator on your device, demonstrating how you can apply an update to a device without changing the device configuration.

1. On your IoT device, add the Microsoft package repository, and then add the Microsoft package signing key to your list of trusted keys.

   ```bash
   wget https://packages.microsoft.com/config/ubuntu/18.04/multiarch/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
   sudo dpkg -i packages-microsoft-prod.deb
   rm packages-microsoft-prod.deb   
   ```

1. Install the Device Update agent *.deb* packages.

   ```bash
   sudo apt-get update
   sudo apt-get install deviceupdate-agent
   ```

1. Open the *du-config.json* agent configuration file.

   ```bash
   sudo nano /etc/adu/du-config.json
   ```

1. Update *du-config.json*  with the following example values:

   - `manufacturer: "contoso"`
   - `model: "video"`
   - `agents.name: "aduagent"`
   - `agents.connectionData: <connection string>` - Replace this placeholder with the connection string you copied from the module identity.
   - `agents.manufacturer: "contoso"`
   - `agents.model: "video"`

   For more information about these parameters, see [Device Update configuration file](device-update-configuration-file.md).

The edited *du-config.json* file should look like this:

```json
{
   "schemaVersion": "1.0",
   "aduShellTrustedUsers": [
      "adu",
      "do"
   ],
   "manufacturer": "contoso",
   "model": "video",
   "agents": [
      {
      "name": "aduagent",
      "runas": "adu",
      "connectionSource": {
         "connectionType": "string",
         "connectionData": <connection string>
      },
      "manufacturer": "contoso",
      "model": "video"
      }
   ]
   }```

1. Press **Ctrl+X** to exit the editor, and **y** to save your changes.

   >[!NOTE]
   >You can also use the Azure IoT Identity Service to provision the device. To do that, [install the Azure IoT Identity Service](https://azure.github.io/iot-identity-service/installation.html) before installing the Device Update agent. Then configure the Device Update agent with `"connectionType": "AIS"` and leave `connectionData` as a blank string in the configuration file.

1. To set up the agent to run as a simulator, run the following command on the IoT device. The Device Update agent invokes the simulator handler to process a package update with the Microsoft SWUpdate extension.

   ```bash
     sudo /usr/bin/AducIotAgent --extension-type updateContentHandler --extension-id 'microsoft/swupdate:1' --register-extension /var/lib/adu/extensions/sources/libmicrosoft_simulator_1.so
   ```

1. Copy the *sample-du-simulator-data.json* file from the extracted *Tutorial_Simulator* folder to the *tmp* folder.

   ```bash
   cp sample-du-simulator-data.json /tmp/du-simulator-data.json
   ```

   >[!NOTE]
   >If the *tmp* folder doesn't exist, create it as follows:
   >
   >```bash
   >sudo mkdir/tmp
   >sudo chown root:root/tmp
   >sudo chmod 1777/tmp
   >```  

1. Change the permissions for the */tmp/sample-du-simulator-data.json* file.

   ```bash
   sudo chown adu:adu /tmp/du-simulator-data.json
   sudo chmod 664 /tmp/du-simulator-data.json
   ```
  
1. Restart the Device Update agent to apply your changes.

   ```bash
    sudo systemctl restart deviceupdate-agent
   ```

## Import the update

This section uses the *TutorialImportManifest_Sim.importmanifest.json* and *adu-update-image-raspberrypi3.swu* files from the downloaded *Tutorial_Simulator* folder. The update file is the same one as in the [Raspberry Pi tutorial](device-update-raspberry-pi.md). Because the update in this tutorial is simulated, the specific file content doesn't matter.

1. From your development machine, 1. In the [Azure portal](https://portal.azure.com), open the IoT hub page associated with your Device Update instance.
sign in to the [Azure portal](https://portal.azure.com/) and go to your IoT hub that is configured with Device Update.
1. In the navigation pane, select **Device Management** > **Updates**.
1. On the **Updates** page, select **Import a new update**.
1. On the **Import update** page, select **Select from storage container**.
1. Select an existing storage account, or create a new account by selecting **+ Storage account**. Then, select an existing container or create a new container by selecting **+ Container**. This container is used to stage the update files for importing.

   > [!NOTE]
   > To avoid accidentally importing files from previous updates, it's best to use a new container each time you import an update. If you don't use a new container, be sure to delete any files from the existing container.

1. On the container page, select **Upload**, browse to and select the *TutorialImportManifest_Sim.importmanifest.json* and *adu-update-image-raspberrypi3.swu* files, and then select **Upload**.

1. Select the checkboxes by both files and then select **Select** to return to the **Import update** page.

   :::image type="content" source="media/device-update-simulator/select-container-files.png" alt-text="Screenshot that shows selecting uploaded files in the container.":::

1. On the **Import update** page, review the files to be imported, and then select **Import update**.

   :::image type="content" source="media/device-update-simulator/import-update.png" alt-text="Screenshot that shows uploaded files to be imported as an update.":::

   The import process begins, and you can select **View import history** to view import history and status. On the **Update history** page, the **Status** field shows **Succeeded** when the import is complete. You can select **Refresh** to update the status.

The imported update now appears on the **Updates** page.

   :::image type="content" source="media/device-update-simulator/available-updates.png" alt-text="Screenshot that shows the new update listed as an available update.":::

For more information about the import process, see [Import an update to Device Update for IoT Hub](import-update.md).

## View device groups

Device Update uses groups to organize devices. Device Update automatically sorts devices into groups based on their assigned tags and compatibility properties. Each device belongs to only one group, but groups can have multiple subgroups to sort different device classes.

On the **Updates** page for your IoT hub, select the **Groups and Deployments** tab to view the list of groups and the update compliance chart. The update compliance chart shows the count of devices in various states of compliance: **On latest update**, **New updates available**, and **Updates in progress**. For more information, see [Device Update compliance](device-update-compliance.md).

:::image type="content" source="media/device-update-simulator/groups-and-deployments.png" alt-text="Screenshot that shows the update compliance view." lightbox="media/create-update-group/updated-view.png":::

You should see a device group that contains the simulated device you set up in this tutorial, along with any available updates for the devices in the group. If there are devices that don't meet the device class requirements of the group, they appeaer in a corresponding invalid group.

For more information about tags and groups, see [Manage device groups](create-update-group.md).

## Deploy the update

1. On the **Groups and Deployments** tab, you should see the new update available for your device group, with a link to the update under **Status**. You might need to refresh the page.

1. Select the group name to view its details.

1. On the group details page, you should see that there's one new update available. Select **Deploy** to start the deployment.

   :::image type="content" source="media/device-update-simulator/group-details.png" alt-text="Screenshot that shows starting a group update deployment." lightbox="media/deploy-update/select-update.png":::

1. The update you imported is listed as the best available update for this group. Select **Deploy**.

1. Schedule your deployment to start immediately, and then select **Create**.

On the group details page, navigate to the **Current updates** tab. Under **Deployment details**, **Status** turns to **Active**. After your device successfully updates, return to the **Updates** page. You should see that your compliance chart and deployment details updated to include the installed update.

## Monitor the update deployment

1. Return to the group details page and select the **Deployment history** tab.

1. Select **View deployment details** next to the deployment you created. Select **Refresh** to view the latest status details.

   :::image type="content" source="media/device-update-simulator/view-deployment-details.png" alt-text="Screenshot that shows Deployment details." lightbox="media/deploy-update/deployment-details.png":::

You successfully completed an end-to-end image-based update for Device Update for IoT Hub that used an Ubuntu 18.04 x64 simulator agent.

## Clean up resources

When you no longer need the resources you created for this tutorial, you can delete them.

1. In the [Azure portal](https://portal.azure.com), navigate to the resource group that contains the resources.
1. If you want to delete all the resources in the group, select **Delete resource group**.
1. If you want to delete only some of the resources, use the check boxes to select the resources and then select **Delete**.

## Next steps

In this tutorial, you learned how to import and deploy an image update. Next, learn how to update device packages.

> [!div class="nextstepaction"]
> [Device Update using the package agent](device-update-ubuntu-agent.md)
