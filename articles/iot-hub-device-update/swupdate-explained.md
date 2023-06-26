---
title: Understand SwUpdate's use within Device Update for IoT Hub | Microsoft Docs
description: Key concepts for using SwUpdate with Device Update for IoT Hub.
author: nihemstr
ms.author: nihemstr
ms.date: 06/07/2023
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# What is SW Update ?

SW Update is an update system for embedded applications. It is able to deliver image updates (meaning whole system updates) to devices from a variety of mediums, however for Device Update it is used for over-the-air updates (OTA updates). 

SW Update includes means for packaging images for updating, streaming the download of images for updating the system, and provides the gears for running the update. It is similar in premise to how APT is used within some Linux distributions for updating packages. 

You can read more about SW Update, it's configurations and options, and how it the entire stack works [here](). 

# What are A/B Update Systems and how do they work with SW Update to complete image based updates?

SW Update works by updating the device on an A and B Update Schema (shortened to A/B update). A/B updates work by splitting the flash/disk memory of a device into two main partitions: the A and B partitions. There are usually other partitions used for systems that live above the OS/RTOS of the device (eg a bootloader partition with fallbacks, a partition for Device Update for IoT Hub so data can be persisted between the two partitions, etc) but for the vast majority of the disk we can imagine it as an even split. 


You can imagine the disk like the simplified diagram below: 

:::image type="content" source="media/image-update-concepts/ab-updating-partition.png" alt-text="AB Disk Usage Diagram" lightbox="media/swupdate-explained/ab-updating-partition.png":::


There are four partitions here. For right now we'll focus on the A, B, and boot partitions.

The A and B sides are sized such that they are at least as large as the maximum potential size of any OS/RTOS that needs to run on the device. On first installation the operating system will be located on either the A or B partitions (for this discussion lets assume it's located on the A partition). When the device is first flashed it the boot partition will be setup to load the A partition like in the diagram below: 

:::image type="content" source="media/image-update-concepts/ab-updating-loading-a.png" alt-text="AB Disk Usage Diagram" lightbox="media/swupdate-explained/ab-updating-partition.png":::

When a deployment for an image update is intititated DU will instruct the device to use SW Update to download the image for the deployment to the partition that is not in use (in this case the B side). After a successful download and verifying the checksum of the downloaded image SW Update uses a script to instruct the bootloader to load with the new image. Like in the below diagram: 

:::image type="content" source="media/image-update-concepts/ab-updating-loading-b.png" alt-text="AB Disk Usage Diagram" lightbox="media/swupdate-explained/ab-updating-partition.png":::

Now when the device boots it will attempt to boot the OS/RTOS loaded in the B partition. If the boot/loading  fails the device is able to fallback to the A side and report the failure. 

When a device goes through the next update cycle it will repeat the same process but using A instead of B and vice versa. 

