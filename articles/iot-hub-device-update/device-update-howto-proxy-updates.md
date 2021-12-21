---
title: Complete a proxy update by using Device Update for Azure IoT Hub | Microsoft Docs
description: Get started with Device Update for Azure IoT Hub by using the Device Update binary agent for proxy updates.
author: valls
ms.author: valls
ms.date: 11/12/2021
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

3. Copy the downloaded Debian file to the test VM. If you're using PowerShell on your computer, run the following shell command:

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
     
4. Go to Azure IoT Hub and copy the primary connection string for your IoT device's Device Update module. Replace any default value for the `connectionData` field with the primary connection string in the *du-config.json* file:

   ```sh
      sudo nano /etc/adu/du-config.json  
   ```
   
   > [!NOTE]
   > You can copy the primary connection string for the device instead, but we recommend that you use the string for the Device Update module. For information about setting up the module, see [Device Update Agent provisioning](device-update-agent-provisioning.md). 
       
5. Ensure that */etc/adu/du-diagnostics-config.json* contains the correct settings for log collection. For example: 

   ```sh
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

6. Restart the Device Update agent:

   ```sh
   sudo systemctl restart adu-agent
   ```

### Set up mock components

For testing and demonstration purposes, we'll create the following mock components on the device:

- Three motors
- Two cameras
- "hostfs"
- "rootfs"

> [!IMPORTANT]
> The preceding component configuration is based on the implementation of an example component enumerator extension called *libcontoso-component-enumerator.so*. It also requires this mock component inventory data file: */usr/local/contoso-devices/components-inventory.json*.

1. Copy the demo folder to your home directory on the test VM. Then, run the following command to copy required files to the right locations:

   ```markup
   `~/demo/tools/reset-demo-components.sh` 
   ```

   The `reset-demo-components.sh` command takes the following steps on your behalf: 

   1. It copies components-inventory.json and adds it to the */usr/local/contoso-devices* folder.

   2. It copies the Contoso component enumerator extension (*libcontoso-component-enumerator.so*) from the [Assets folder](https://github.com/Azure/iot-hub-device-update/releases) and adds it to the */var/lib/adu/extensions/sources* folder.
   
   3. It registers the extension:

      ```sh
      sudo /usr/bin/AducIotAgent -E /var/lib/adu/extensions/sources/libcontoso-component-enumerator.so
      ```

2. View and record the current components' software version by using the following command to set up the VM to support proxy updates:

   ```markup
   ~/demo/show-demo-components.sh
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
   
   In the example, the parent import manifest is *contoso.Virtual-Vacuum-virtual-camera.1.4.importmanifest.json*. The child import manifest with details for updating the camera is *Contoso.Virtual-Vacuum.3.3.importmanifest.json*. Note that both manifest file names follow the required format and end with *.importmanifest.json*. 

   :::image type="content" source="media/understand-device-update/two-containers.png" alt-text="Screenshot that shows sample files uploaded to update cameras connected to a smart vacuum cleaner device." lightbox="media/understand-device-update/two-containers.png":::

8. Choose **Select**.
9. The UI now shows the list of files that will be imported to Device Update. Select **Import update**.

   :::image type="content" source="media/understand-device-update/three-confirm-import.png" alt-text="Screenshot that shows listed files and the button for importing an update." lightbox="media/understand-device-update/three-confirm-import.png":::

10. The import process begins, and the screen changes to the **Import History** section. Select **Refresh** to view progress until the import process finishes. Depending on the size of the update, the import might finish in a few minutes or take longer.
11. When the **Status** column indicates that the import has succeeded, select the **Available Updates** tab. You should see your imported update in the list now.

    :::image type="content" source="media/understand-device-update/four-update-added.png" alt-text="Screenshot that shows the imported update added to the list." lightbox="media/understand-device-update/four-update-added.png":::

[Learn more](import-update.md) about importing updates.

## Create an update group

1. Select the **Groups and Deployments** tab at the top of the page. 

2. Select the **+ Add Group** button to create a new group by selecting the **IoT Hub** tag. Then select **Create group**. Note that you can also deploy the update to an existing group.

[Learn more](create-update-group.md) about adding tags and creating update groups.

## Deploy an update

1. In the **Groups and Deployments** view, confirm that the new update is available for your device group. You might need to refresh the page once. The following example shows the view for the example smart vacuum device:

   :::image type="content" source="media/understand-device-update/five-groups.png" alt-text="Screenshot that shows an available update." lightbox="media/understand-device-update/five-groups.png":::

2. Select **Deploy**.

3. Confirm that the correct group is selected as the target group. Select the option to schedule your deployment or the option to start immediately, and then select **Create**.

   :::image type="content" source="media/understand-device-update/six-deploy.png" alt-text="Screenshot that shows options for creating a deployment." lightbox="media/understand-device-update/six-deploy.png":::

4. View the compliance chart. You should see that the update is now in progress. 

5. After your device is successfully updated, confirm that your compliance chart and deployment details are updated to reflect that success. 

   :::image type="content" source="media/understand-device-update/seven-results.png" alt-text="Screenshot that shows the results of a successful update." lightbox="media/understand-device-update/seven-results.png":::

## Monitor an update deployment

1. Select the **Groups and Deployments** tab at the top of the page.

2. Select the group that you created to view the deployment details.

You've now completed a successful end-to-end proxy update by using Device Update for IoT Hub. 

## Clean up resources

When you no longer need them, clean up your Device Update account, instance, IoT hub, and IoT device. 

## Next steps

You can use the following tutorials for a simple demonstration of Device Update for IoT Hub:

- [Device Update for Azure IoT Hub tutorial using the Raspberry Pi 3 B+ reference image](device-update-raspberry-pi.md) (extensible via open source to build your own images for other architectures as needed)
	
- [Device Update for Azure IoT Hub tutorial using the package agent on Ubuntu Server 18.04 x64](device-update-ubuntu-agent.md)
	
- [Device Update for Azure IoT Hub tutorial using the Ubuntu (18.04 x64) Simulator Reference Agent](device-update-simulator.md)

- [Device Update for Azure IoT Hub tutorial using the Azure real-time operating system](device-update-azure-real-time-operating-system.md)
