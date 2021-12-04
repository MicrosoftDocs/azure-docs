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

## Setup Test Device

### Prerequisites

- An Ubuntu 18.04 LTS Server VM was used to exercise this tutorial

### Install the Device Update Agent and Dependencies

- Register packages.microsoft.com in APT package repository

```sh
curl https://packages.microsoft.com/config/ubuntu/18.04/multiarch/prod.list > ~/microsoft-prod.list

sudo cp ~/microsoft-prod.list /etc/apt/sources.list.d/

curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > ~/microsoft.gpg

sudo cp ~/microsoft.gpg /etc/apt/trusted.gpg.d/

sudo apt-get update
```

- Install the **deviceupdat-agent** on the IoT device.  
e.g.

  ```sh
  sudo apt-get install deviceupdate-agent deliveryoptimization-plugin-apt 
  ```
- Enter your IoT module or device's primary connection string in /etc/adu/du-config.json.
- Ensure that /ect/adu/du-diagnostics-config.json contain correct settings.  
  e.g.  

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

- Restart `adu-agent` service

```sh
sudo systemctl restart adu-agent
```

### Setup Mock Components

For testing and demonstration purposes, we'll be creating following mock components on the device:

- 3 motors
- 2 cameras
- hostfs
- rootfs

**IMPORTANT**  
This components configuration depends on the implementation of an example Component Enuerator extension called libcontoso-component-enumerator.so, which required a mock component inventory data file `/usr/local/contoso-devices/components-inventory.json`

> Tip: you can copy [`demo`](https://github.com/Azure/iot-hub-device-update/tree/main/src/extensions/component-enumerators/examples/contoso-component-enumerator/demo) folder to your home directory on the test VM an run `~/demo/tools/reset-demo-components.sh` to copy required files to the right locations.

The reset-demo-components.sh will perform the following steps on your behalf:

#### Add /usr/local/contoso-devices/components-inventory.json

- Copy [components-inventory.json](https://github.com/Azure/iot-hub-device-update/tree/main/src/extensions/component-enumerators/examples/contoso-component-enumerator/demo/demo-devices/contoso-devices/components-inventory.json) to **/usr/local/contoso-devices** folder
  
#### Register Contoso Components Enumerator extension

- Copy libcontoso-component-enumerator.so from Assets folder [here](https://github.com/Azure/iot-hub-device-update/releases) to /var/lib/adu/extensions/sources folder
- Register the extension

```sh
sudo /usr/bin/AducIotAgent -E /var/lib/adu/extensions/sources/libcontoso-component-enumerator.so
```

#### 

**Congratulations!** Your VM should now support Proxy Updates!

## How To Import Example Updates

### Prerequisites
* If you haven't already done so, create a [Device Update account and instance](create-device-update-account.md), including configuring an IoT Hub.

1. Download the Proxy Updates import manifests and images from the [latest Device Update release](https://github.com/Azure/iot-hub-device-update/releases) under Assets. 
2. Log in to the [Azure portal](https://portal.azure.com/) and navigate to your IoT Hub with Device Update. Then, select the Updates option under Device Management from the left-hand navigation bar.
3. Select the Updates tab.
4. Select "+ Import New Update".
5. Select" + Select from storage container" and then select your Storage account and Container. 
6. Select 'Upload' to add the files you downloaded in (1) and then 'Select' to go to the next step.
7. The UI now shows the list of files that will be imported to Device Update. Select 'Import update'
8. The import process begins, and the screen changes to the "Import History" section. Select "Refresh" to view progress until the import process completes. Depending on the size of the update, this may complete in a few minutes but could take longer.
9. When the Status column indicates the import has succeeded, select the "Ready to Deploy" header. You should see your imported update in the list now.

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

1. Once the group is created, you should see a new update available for your device group, with a link to the update under Pending Updates. You may need to Refresh once. 

2. Click on the available update.

3. Confirm the correct group is selected as the target group. Schedule your deployment, then select Deploy update.

4. View the compliance chart. You should see the update is now in progress. 

5. After your device is successfully updated, you should see your compliance chart and deployment details update to reflect the same. 

## Monitor an update deployment

1. Select the 'Groups and Deployments' tab at the top of the page.

2. Select the Group you created to view the deployment details.

You have now completed a successful end-to-end image update using Device Update for IoT Hub on a Raspberry Pi 3 B+ device. 

## Clean up resources

When no longer needed, clean up your device update account, instance, IoT Hub and IoT device. 



 
