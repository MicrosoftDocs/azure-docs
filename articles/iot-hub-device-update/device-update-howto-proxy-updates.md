---
title: Complete a proxy update by using Device Update for Azure IoT Hub | Microsoft Docs
description: Get started with Device Update for Azure IoT Hub by using the Device Update binary agent for proxy updates.
author: eshashah
ms.author: eshashah
ms.date: 1/26/2022
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Tutorial: Complete a proxy update by using Device Update for Azure IoT Hub

If you haven't already done so, review [Using proxy updates with Device Update for Azure IoT Hub](device-update-proxy-updates.md).

## Set up a test device or virtual machine

This tutorial uses an Ubuntu Server 18.04 LTS virtual machine (VM) as an example.

### Install the Device Update Agent and dependencies

1. Register *packages.microsoft.com* in an APT package repository:

   ```sh
   sudo apt-get update
    
   sudo apt install curl
    
   curl https://packages.microsoft.com/config/ubuntu/18.04/multiarch/prod.list > ~/microsoft-prod.list

   sudo cp ~/microsoft-prod.list /etc/apt/sources.list.d/

   curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > ~/microsoft.gpg

   sudo cp ~/microsoft.gpg /etc/apt/trusted.gpg.d/

   sudo apt-get update
   ```

2. Install the **deviceupdate-agent** on the IoT device. Download the latest Device Update Debian file from *packages.microsoft.com*:

   ```sh
   sudo apt-get install deviceupdate-agent
   ```

   Alternatively, copy the downloaded Debian file to the test VM. If you're using PowerShell on your computer, run the following shell command:

   ```sh
   scp <path to the .deb file> tester@<your vm's ip address>:~
   ```

   Then remote into your VM and run the following shell command in the *home* folder:

   ```sh
   #go to home folder 
   cd ~
   #install latest Device Update agent
   sudo apt-get install ./<debian file name from the previous step>
   ```

3. Go to Azure IoT Hub and copy the primary connection string for your IoT device's Device Update module. Replace any default value for the `connectionData` field with the primary connection string in the *du-config.json* file:

   ```sh
   sudo nano /etc/adu/du-config.json  
   ```

   > [!NOTE]
   > You can copy the primary connection string for the device instead, but we recommend that you use the string for the Device Update module. For information about setting up the module, see [Device Update Agent provisioning](device-update-agent-provisioning.md).

4. Ensure that */etc/adu/du-diagnostics-config.json* contains the correct settings for log collection. For example:

   ```json
   {
     "logComponents":[
       {
         "componentName":"adu",
          "logPath":"/var/log/adu/"
       },
       {
         "componentName":"do",
         "logPath":"/var/log/deliveryoptimization-agent/"
       }
     ],
     "maxKilobytesToUploadPerLogPath":50
   }
   ```

5. Restart the Device Update agent:

   ```sh
   sudo systemctl restart deviceupdate-agent
   ```

### Set up mock components

For testing and demonstration purposes, we'll create the following mock components on the device:

* Three motors
* Two cameras
* "hostfs"
* "rootfs"

> [!IMPORTANT]
> The preceding component configuration is based on the implementation of an example component enumerator extension called *libcontoso-component-enumerator.so*. It also requires this mock component inventory data file: */usr/local/contoso-devices/components-inventory.json*.

1. Copy the [demo](https://github.com/Azure/iot-hub-device-update/blob/main/src/extensions/component_enumerators/examples/contoso_component_enumerator/demo) folder to your home directory on the test VM. Then, run the following command to copy required files to the right locations:

   ```sh
   `~/demo/tools/reset-demo-components.sh` 
   ```

   The `reset-demo-components.sh` command takes the following steps on your behalf:

   * It copies [components-inventory.json](https://github.com/Azure/iot-hub-device-update/blob/main/src/extensions/component_enumerators/examples/contoso_component_enumerator/demo/demo-devices/contoso-devices/components-inventory.json) and adds it to the */usr/local/contoso-devices* folder.

   * It copies the Contoso component enumerator extension (*libcontoso-component-enumerator.so*) from the [Assets folder](https://github.com/Azure/iot-hub-device-update/releases) and adds it to the */var/lib/adu/extensions/sources* folder.

   * It registers the extension:

     ```sh
     sudo /usr/bin/AducIotAgent -E /var/lib/adu/extensions/sources/libcontoso-component-enumerator.so
     ```

## Import an example update

If you haven't already done so, create a [Device Update account and instance](create-device-update-account.md), including configuring an IoT hub. Then start the following procedure.

1. From the [latest Device Update release](https://github.com/Azure/iot-hub-device-update/releases), under **Assets**, download the import manifests and images for proxy updates.
2. Sign in to the [Azure portal](https://portal.azure.com/) and go to your IoT hub with Device Update. On the left pane, select **Device Management** > **Updates**.
3. Select the **Updates** tab.
4. Select **+ Import New Update**.
5. Select **+ Select from storage container**, and then choose your storage account and container.

   :::image type="content" source="media/understand-device-update/one-import.png" alt-text="Screenshot that shows the button for selecting to import from a storage container." lightbox="media/understand-device-update/one-import.png":::

6. Select **Upload** to add the files that you downloaded in step 1.
7. Upload the parent import manifest, child import manifest, and payload files to your container.

   The following example shows sample files uploaded to update cameras connected to a smart vacuum cleaner device. It also includes a pre-installation script to turn off the cameras before the over-the-air update.

   In the example, the parent import manifest is *contoso.Virtual-Vacuum-virtual-camera.1.4.importmanifest.json*. The child import manifest with details for updating the camera is *Contoso.Virtual-Vacuum.3.3.importmanifest.json*. Both manifest file names follow the required format and end with *.importmanifest.json*.

   :::image type="content" source="media/understand-device-update/two-containers.png" alt-text="Screenshot that shows sample files uploaded to update cameras connected to a smart vacuum cleaner device." lightbox="media/understand-device-update/two-containers.png":::

8. Choose **Select**.
9. The UI now shows the list of files that will be imported to Device Update. Select **Import update**.

   :::image type="content" source="media/understand-device-update/three-confirm-import.png" alt-text="Screenshot that shows listed files and the button for importing an update." lightbox="media/understand-device-update/three-confirm-import.png":::

10. The import process begins, and the screen changes to the **Import History** section. Select **Refresh** to view progress until the import process finishes. Depending on the size of the update, the import might finish in a few minutes or take longer.

11. When the **Status** column indicates that the import has succeeded, select the **Available Updates** tab. You should see your imported update in the list now.

    :::image type="content" source="media/understand-device-update/four-update-added.png" alt-text="Screenshot that shows the imported update added to the list." lightbox="media/understand-device-update/four-update-added.png":::

For more information about the import process, see [Import an update to Device Update](import-update.md).

## View device groups

Device Update uses groups to organize devices. Device Update automatically sorts devices into groups based on their assigned tags and compatibility properties. Each device belongs to only one group, but groups can have multiple subgroups to sort different device classes.

1. Go to the **Groups and Deployments** tab at the top of the page.

   :::image type="content" source="media/create-update-group/ungrouped-devices.png" alt-text="Screenshot that shows ungrouped devices." lightbox="media/create-update-group/ungrouped-devices.png":::

1. View the list of groups and the update compliance chart. The update compliance chart shows the count of devices in various states of compliance: **On latest update**, **New updates available**, and **Updates in progress**. [Learn about update compliance](device-update-compliance.md).

   :::image type="content" source="media/create-update-group/updated-view.png" alt-text="Screenshot that shows the update compliance view." lightbox="media/create-update-group/updated-view.png":::

1. You should see a device group that contains the simulated device you set up in this tutorial along with any available updates for the devices in the new group. If there are devices that don't meet the device class requirements of the group, they'll show up in a corresponding invalid group. To deploy the best available update to the new user-defined group from this view, select **Deploy** next to the group.

For more information about tags and groups, see [Manage device groups](create-update-group.md).

## Deploy update

1. Once the group is created, you should see a new update available for your device group, with a link to the update under Best Update (you may need to Refresh once).

   For more information about compliance, see [Device Update compliance](device-update-compliance.md).

1. Select the target group by clicking on the group name. You'll be directed to the group details under Group basics.

   :::image type="content" source="media/deploy-update/group-basics.png" alt-text="Group details" lightbox="media/deploy-update/group-basics.png":::

1. To initiate the deployment, go to the Current deployment tab. Select the deploy link next to the desired update from the Available updates section. The best, available update for a given group will be denoted with a "Best" highlight.

   :::image type="content" source="media/deploy-update/select-update.png" alt-text="Select update" lightbox="media/deploy-update/select-update.png":::

1. Schedule your deployment to start immediately or in the future, then select Create.

   :::image type="content" source="media/deploy-update/create-deployment.png" alt-text="Create deployment" lightbox="media/deploy-update/create-deployment.png":::

1. The Status under Deployment details should turn to Active, and the deployed update should be marked with "(deploying)".

   :::image type="content" source="media/deploy-update/deployment-active.png" alt-text="Deployment active" lightbox="media/deploy-update/deployment-active.png":::

1. View the compliance chart. You should see the update is now in progress.

1. After your device is successfully updated, you should see your compliance chart and deployment details are updated to reflect the same.

   :::image type="content" source="media/deploy-update/update-succeeded.png" alt-text="Update succeeded" lightbox="media/deploy-update/update-succeeded.png":::

## Monitor an update deployment

1. Select the Deployment history tab at the top of the page.

   :::image type="content" source="media/deploy-update/deployments-history.png" alt-text="Deployment History" lightbox="media/deploy-update/deployments-history.png":::

2. Select the details link next to the deployment you created.

   :::image type="content" source="media/deploy-update/deployment-details.png" alt-text="Deployment details" lightbox="media/deploy-update/deployment-details.png":::

3. Select Refresh to view the latest status details.

You've now completed a successful end-to-end proxy update by using Device Update for IoT Hub.

## Clean up resources

When you no longer need them, clean up your Device Update account, instance, IoT hub, and IoT device.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about proxy updates and multi-component updating](device-update-proxy-updates.md)
