---
title: Image Updating with Device Update for IoT Hub | Microsoft Docs
description: Key concepts for understanding how Device Update for IoT Hub completes image updates.
author: nihemstr
ms.author: nihemstr
ms.date: 06/07/2023
ms.topic: conceptual
ms.service: iot-hub-device-update
---
# What is an Image Update? 

In general terms an image update is an update for a device where we expect the entire operating system, including applications and firmware within the operating system, to be updated in one deployment. Applications that may make use of these updates include Operating System updates (eg moving from Debian 10 to Debian 11) or whole system updates for lightweight devices such as ones that run Real Time Operating Systems (RTOSs). These updates are, on average, larger, more expensive (in terms of time the device spends on disk), and have the potential to have far reaching impact on the device itself. As such, image updates use an aggressive system for managing the download, install, and, if there is an error, fallback of the update on disk. 

Because an image update is updating the actual operating system on the device higher level systems must exist on the device to handle the update. First this document will introduce the higher level structures above the OS/RTOS level that must exist to complete an image update. Next this document will explore how Device Update for IoT Hub will operate. Finally we'll finish with a deeper exploration of the tools Device Update for IoT Hub uses to complete an image update.

The goal of this document is not to be an exhaustive source on the tools used to complete an image update, but instead to introduce the concepts needed to understand the basic function/use of an image update as well as what Device Update for IoT Hub specifically completes these kinds of updates. 

# How is an image based update completed at the disk level?

To complete an image update Device Update for IoT Hub utilizes an A/B update scheme. In an A/B Update scheme the disk is roughly split into two sections: the A and B partition. There are always other partitions of a disk that are not apart of the A or B partition such as those used for the bootloader (the thing that tells the processor where to start loading the OS/RTOS from) and for persisting data across the A and B partitions (eg Device Update for IoTHub has a partition for persisting knowledge of a passed update using its own partition). Barring these smaller partitions, we can generally say the disk is split into two partitions of equal size. The size of the A and B partition determine the maximum possible size that an image update can be. 

You can imagine the disk like the simplified diagram below: 

:::image type="content" source="media/swupdate-explained/ab-updating-partition.png" alt-text="AB Disk Usage Diagram" lightbox="media/swupdate-explained/ab-updating-partition.png":::

There are four partitions here.  

1. The "boot" partition handles the bootstrapping of the OS/RTOS. It can be configured to load the A or B side. It also has the context to fall back to the one with the older version if there is an issue loading the newer OS on the new partition. It is always persisted through updates.
2. The "adu" partition holds the data for Device Update for IoT Hub. This includes connection information, data for the updates, and logs. It is always persisted through updates.
3. The "A" partition is the first of the two "sides" of the disk used by an A / B Update System. 
4. The "B" partition is the second of the two "sides" of the disk used by an A / B Update System. 

When the device is first flashed the boot partition will be setup to load the A partition like in the diagram below: 

:::image type="content" source="media/swupdate-explained/ab-updating-loading-a.png" alt-text="AB Disk Usage Diagram" lightbox="media/swupdate-explained/ab-updating-partition.png":::

When a deployment for an image update is intititated DU downloads the image for the deployment to the partition that is not in use (in this case the B side). After a successful download and verification of the downloaded image Device Update instructs the bootloader to load with the new image and then restarts the device. 

After restart the bootloader will load the OS on the "B" side of the disk.

:::image type="content" source="media/swupdate-explained/ab-updating-loading-b.png" alt-text="AB Disk Usage Diagram" lightbox="media/swupdate-explained/ab-updating-partition.png":::

Now when the device boots it will attempt to boot the OS/RTOS loaded in the B partition. If the boot/loading  fails the device is able to fallback to the A side and report the failure. 

When a device goes through the next update cycle it will repeat the same process but using the other partition.

# How does Device Update for IoT Hub persist itself and it's connection across the images being updated? 

When you deploy an image update you're giving yourself a blank slate to work with. Whatever applications (including Device Update for IoT Hub) you include on the new version will be the only ones you have access to unless you have configured your OS updates to expect some other shared partitions (like the one used by Device Update for IoT Hub to persist its own data). As such in the image you're updating to all necessary components (including Device Update) are included. 

When an image update is completed the new OS is booted up. As apart of the boot process the version of Device Update for IoT Hub is loaded (either as a system daemon or as a portion of the OS itself) and mounts the "adu" partition. Within the partition Device Update maintains its record of past updates, its connection information (also called provisioning information), and all configurations to do with running Device Update for IoT Hub. The configuration information for the image update compatible version of Device Update is the same as the package update version just kept in a seperate location so it can be persisted (ie not apart of the "A" or "B" side of the disk). 

# How do I create an image that can work with Device Update for IoT Hub's image update feature? 

## Yocto Build Systems
There's several levels to this. The best option, and the one the Device Update for IoT Hub team uses, is to create a build system using Yocto that incorporates the applications/processes plus hardware support for your device. Yocto build systems are powerful tools for creating bootable ISOs with layers of abstraction allowing you to fine tune what you're creating. This is the production level solution for creating images. 

You can read more about the Yocto build system the Device Update agent uses [here](). 

## Quick Start

If you're just starting to try out Device Update for IoT Hub and you want to check out what our product can do / what the image update system looks like you can use [this guide]() to setup a Raspberry Pi 3 to test out the image updating process. If you would prefer to use a virtual machine you can use [this guide](). 




