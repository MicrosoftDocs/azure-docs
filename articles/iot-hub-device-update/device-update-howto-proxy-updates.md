---
title: Device Update for Azure IoT Hub tutorial using the Device Update binary agent| Microsoft Docs
description: Get started with Device Update for Azure IoT Hub using the Device Update binary agent for Proxy Updates.
author: valls
ms.author: valls
ms.date: 11/12/2021
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Device Update for Azure IoT Hub tutorial using the Device Update binary agent for Proxy Updates
If you haven't already done so, review [Using Proxy Updates with Device Update for Azure IoT Hub](device-update-proxy-updates.md).

## Setup Test Device or Virtual Machine (VM)

### Assumption

- An Ubuntu 18.04 LTS Server VM is used to exercise this tutorial

### Install the Device Update Agent and Dependencies

1. Register packages.microsoft.com in APT package repository

    ```sh
    curl https://packages.microsoft.com/config/ubuntu/18.04/multiarch/prod.list > ~/microsoft-prod.list

    sudo cp ~/microsoft-prod.list /etc/apt/sources.list.d/

    curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > ~/microsoft.gpg

    sudo cp ~/microsoft.gpg /etc/apt/trusted.gpg.d/

    sudo apt-get update
    ```

2. Install the **deviceupdate-agent** on the IoT device.  
   - Download the latest Device Update debian file from packages.microsoft.com 
   ```sh
   sudo apt-get install deviceupdate-agent
   ```

   - If you downloaded the file on your pc/laptop, follow these steps to add it to the test VM

   Copy the latest Device Update debian file to the test VM. If using PowerShell on your pc/laptop, run the following shell command
   ```sh 
     scp <path to the .deb file> tester@<your vm's ip address>:~
   ```

   Then remote into your VM and run following shell command in the home folder

   ```sh
         #go to home folder 
         cd ~
         #install latest Device Update agent
         sudo apt-get install ./<debian file name from the previous step>
   ```
   
  
3. Go to IoT Hub and copy your IoT device's Device Update module (or device) primary connection string. Replace any default value for the "connectionData" field with the primary connection string in the du-config.json file. See below command for how to make changes to the du-config.json file.            
   ```sh
      sudo nano /etc/adu/du-config.json  
   ```
       
4. Ensure that /etc/adu/du-diagnostics-config.json contains correct settings for log collection as well. For example, 

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

5. Restart the Device Update agent

   ```sh
   sudo systemctl restart adu-agent
   ```

### Setup Mock Components

For testing and demonstration purposes, we'll be creating following mock components on the device:

- Three motors
- Two cameras
- "hostfs"
- "rootfs"

> [!IMPORTANT]
> The above component configuration depends on the implementation of an example Component Enumerator extension called libcontoso-component-enumerator.so. It also requires a mock component inventory data file `/usr/local/contoso-devices/components-inventory.json`

1. Copy the folder [`demo`](https://github.com/Azure/iot-hub-device-update/tree/main/src/extensions/component-enumerators/examples/contoso-component-enumerator/demo) folder to your home directory on the test VM and then run the following command to copy required files to the right locations.

   ```markup
   `~/demo/tools/reset-demo-components.sh` 
   ```
2. View and record the current components' software version by using the following command to set up the VM to support Proxy Updates.

   ```markup
   ~/demo/show-demo-components.sh
   ```

## How to import example updates

### Prerequisites
If you haven't already done so, create a [Device Update account and instance](create-device-update-account.md), including configuring an IoT Hub.

1. Download the Proxy Updates import manifests and images from the [latest Device Update release](https://github.com/Azure/iot-hub-device-update/releases) under Assets. 
2. Log in to the [Azure portal](https://portal.azure.com/) and navigate to your IoT Hub with Device Update. Then, select the Updates option under Device Management from the left-hand navigation bar.

   :::image type="content" source="media/understand-device-update/one-import.png" alt-text="Start import." lightbox="media/understand-device-update/one-import.png":::

3. Select the Updates tab.
4. Select '+ Import New Update'.
5. Select '+ Select from storage container' and then choose your Storage account and Container. 
6. Select 'Upload' to add the files you downloaded in (1).
7. Upload the parent import manifest, child import manifest, and payload files to your container. The example below shows sample files uploaded to update cameras connected to a smart vacuum cleaner device. It also includes a pre-install script to turn-off the cameras before the over-the-air update. The parent import manifest  is "contoso.Virtual-Vacuum-virtual-camera.1.4.importmanifest.json". The child import manifest with details for updating the camera is "Contoso.Virtual-Vacuum.3.3.importmanifest.json". Note both manifest file names follow the required format and end with *.importmanifest.json. 

   :::image type="content" source="media/understand-device-update/two-containers.png" alt-text="Containers" lightbox="media/understand-device-update/two-containers.png":::

8. Then choose 'Select' to go to the next step.
9. The UI now shows the list of files that will be imported to Device Update. Select 'Import update'.

   :::image type="content" source="media/understand-device-update/three-confirm-import.png" alt-text="Import" lightbox="media/understand-device-update/three-confirm-import.png":::

10. The import process begins, and the screen changes to the 'Import History' section. Select "Refresh" to view progress until the import process completes. Depending on the size of the update, the import may complete in a few minutes but could take longer.
11. When the Status column indicates the import has succeeded, select the 'Available Updates' header. You should see your imported update in the list now.

   :::image type="content" source="media/understand-device-update/four-update-added.png" alt-text="Update Added" lightbox="media/understand-device-update/four-update-added.png":::

[Learn more](import-update.md) about importing updates.

## Create update group

1. Select the 'Groups and Deployments' tab at the top of the page. 

2. Select the '+ Add Group' button to create a new group by selecting the IoT Hub tag. Then select 'Create group'. Note, you can also deploy the update to an existing Group.

[Learn more](create-update-group.md) about adding tags and creating update groups

## Deploy update

1. In the 'Groups and Deployments' view, you should see the new update available for your device group with a link to 'deploy'. You may need to Refresh once. For the example Smart Vacuum device you should see the below view:

   :::image type="content" source="media/understand-device-update/five-groups.png" alt-text="Groups" lightbox="media/understand-device-update/five-groups.png":::

2. Click on 'Deploy'

3. Confirm the correct group is selected as the target group. Schedule your deployment or start immediately, then select 'Create'.

   :::image type="content" source="media/understand-device-update/six-deploy.png" alt-text="Deploy" lightbox="media/understand-device-update/six-deploy.png":::

4. View the compliance chart. You should see the update is now in progress. 

5. After your device is successfully updated, you should see your compliance chart and deployment details update to reflect the same. 

   :::image type="content" source="media/understand-device-update/seven-results.png" alt-text="Results" lightbox="media/understand-device-update/seven-results.png":::

## Monitor an update deployment

1. Select the 'Groups and Deployments' tab at the top of the page.

2. Click on the Group you created to view the deployment details.

This completes a successful end-to-end proxy update using Device Update for IoT Hub. 

## More details
The reset-demo-components.sh command above will do the following steps on your behalf 

1. Add /usr/local/contoso-devices/components-inventory.json

   - Copy [components-inventory.json](https://github.com/Azure/iot-hub-device-update/tree/main/src/extensions/component-enumerators/examples/contoso-component-enumerator/demo/demo-devices/contoso-devices/components-inventory.json) to **/usr/local/contoso-devices** folder

 2. Register Contoso Components Enumerator extension

    - Copy libcontoso-component-enumerator.so from Assets folder [here](https://github.com/Azure/iot-hub-device-update/releases) to /var/lib/adu/extensions/sources folder
    - Register the extension

    ```sh
    sudo /usr/bin/AducIotAgent -E /var/lib/adu/extensions/sources/libcontoso-component-enumerator.so
    ```
   		
## Clean up resources

When no longer needed, clean up your device update account, instance, IoT Hub, and IoT device. 

## Next steps

You can use the following tutorials for a simple demonstration of Device Update for IoT Hub:

- [Image Update: Getting Started with Raspberry Pi 3 B+ Reference Yocto Image](device-update-raspberry-pi.md) extensible via open source to build you own images for other architecture as needed.
	
- [Package Update: Getting Started using Ubuntu Server 18.04 x64 Package agent](device-update-ubuntu-agent.md)
	
- [Getting Started Using Ubuntu (18.04 x64) Simulator Reference Agent](device-update-simulator.md)

- [Device Update for Azure IoT Hub tutorial for Azure-Real-Time-Operating-System](device-update-azure-real-time-operating-system.md)
