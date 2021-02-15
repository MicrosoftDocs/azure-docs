---
title: Getting Started with Raspberry Pi 3 B+ Reference Yocto Image | Microsoft Docs
description: Getting Started with Raspberry Pi 3 B+ Reference Yocto Image.
author: vimeht
ms.author: vimeht
ms.date: 2/11/2021
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Getting Started with Raspberry Pi 3 B+ Reference Yocto Image
Device Update for IoT Hub provides Yocto reference images for testing and rollout.

## Download Yocto image

There are three Yocto images available as a part of the "Assets" in a given
[Device Update GitHub release](https://github.com/Azure/iot-hub-device-update/releases). The base image (adu-base-image) and two update images (adu-update-image) are provided so you can try rollouts to different versions without needing to flash the SD card on the
device.  To do so, you'll need to upload the update images to the Device Update for IoT Hub
Service, as a part of the import.

## Flash SD card with image

Using your favorite OS flashing tool, install the Yocto Device Update base image
(adu-base-image) on the SD Card that will be used in the Raspberry Pi 3 B+
device.

### Using bmaptool to flash SD card

1. If you have not already, install the `bmaptool` utility.

   ```shell
   sudo apt-get install bmap-tools
   ```

2. Locate the path for the SD card in `/dev`. The path should look something
   like `/dev/sd*` or `/dev/mmcblk*`. You can use the `dmesg` utility to help
   locate the correct path.

3. You will need to unmount all mounted partitions before flashing.

   ```shell
   sudo umount /dev/<device>
   ```

4. Make sure you have write permissions to the device.

   ```shell
   sudo chmod a+rw /dev/<device>
   ```

5. Optional. For faster flashing, download the bimap file along with the image
   file and place them in the same directory.

6. Flash the SD card.

   ```shell
   sudo bmaptool copy <path to image> /dev/<device>
   ```

## Create device in IoT Hub and get connection string

Now, the device needs to be added to the Azure IoT Hub.  From within Azure
IoT Hub, a connection string will be generated for the device.

1. From the Azure portal, launch the Device Update IoT Hub.
2. Create a new device.
3. On the left-hand side of the page, navigate to 'Explorers' > 'IoT Devices' >
   Select "New".
4. Provide a name for the device under 'Device ID'--Ensure that "Autogenerate
   keys" is checkbox is selected.
5. Select 'Save'.
6. Now you will be returned to the 'Devices' page and the device you created should be in the list. Select that device.
7. In the device view, select the 'Copy' icon next to 'Primary Connection
   String'.
8. Paste the copied characters somewhere for later use in the steps below.
   **This copied string is your device connection string**.

## Provision connection string on SD card

1. Remove the SD card from the Raspberry Pi3, put it in your PC, and open it in
   'File Explorer'.

   > [!NOTE]
   > You may see multiple prompts that the card is unformatted. **Cancel all of them (do not format the card)**.

2. In the remaining window, verify you see a partition or disk called `adu`.
3. **Optional**. In the `adu` partition directory, create the Device Update Configuration file "adu-conf.txt" and open it. [Learn more](device-update-configuration-file.md) about configuring "adu-conf.txt".
4. Paste your previously saved device connection string into the text file.

   **Example**:  (replace your IoT Hub name, DeviceId, and shared access key with
   those from your device connection string)

   ```markdown
   connection_string=HostName=<yourIoTHubName>;DeviceId=<yourDeviceId>;SharedAccessKey=<yourSharedAccessKey>
   ```

5. Save the text file and then remove the SD card from your PC.
6. Insert the SD card into the Raspberry Pi3 and use the power switch on the
   cord, which is plugged into the device to turn on the device.

Wait 1-2 mins to ensure the device is fully booted up.  If you have a
monitor connected to the Raspberry Pi3, it will boot to a login screen.  This behavior is
expected.  The agent will be running in the background.  There is no need for you
to log in.

## Connect to device in Device Update IoT Hub

1. On the left-hand side of the page, select 'IoT Devices' under 'Explorers'.
2. Select the link with your device name.
3. At the top of the page, select 'Device Twin'.
4. Under the 'reported' section of the device twin properties, look for the Linux kernel version.
For a new device, which hasn't received an update from Device Update, the
[DeviceManagement:DeviceInformation:1.swVersion](device-update-plug-and-play.md) value will represent
the firmware version running on the device.  Once an update has been applied to a device, Device Update will
use [AzureDeviceUpdateCore:ClientMetadata:4.installedUpdateId](device-update-plug-and-play.md) property
value to represent the firmware version running on the device.
5. The base and update image files have a version number in the filename.

   ```markdown
   adu-<image type>-image-<machine>-<version number>.<extension>
   ```

Use that version number in the step below.

**[Next Step:  Import New Update](import-update.md)**
