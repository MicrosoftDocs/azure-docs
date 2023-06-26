---
title: A/B Update Systems for Image Updates with Device Update for IoT Hub | Microsoft Docs
description: Key concepts for understanding the A/B Update System used within Device Update for IoT Hub
author: nihemstr
ms.author: nihemstr
ms.date: 06/07/2023
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# What are A/B Updates ?

Image updates work by updating the device on an A and B Update Schema (shortened to A/B update). A/B updates work by splitting the flash/disk memory of a device into two main partitions: the A and B partitions. There are usually other partitions used for systems that live above the OS/RTOS of the device (eg a bootloader partition with fallbacks, a partition for Device Update for IoT Hub so data can be persisted between the two partitions, etc) but for the vast majority of the disk we can imagine it as an even split. 

One side of the disk is running the current version of the 

You can imagine the disk like the simplified diagram below: 

:::image type="content" source="media/image-update-concepts/ab-updating-partition.png" alt-text="AB Disk Usage Diagram" lightbox="media/image-update-concepts/ab-updating-partition.png":::


There are four partitions here. For right now we'll focus on the A, B, and boot partitions.

The A and B sides are sized such that they are at least as large as the maximum potential size of any OS/RTOS that needs to run on the device. On first installation the operating system will be located on either the A or B partitions (for this discussion lets assume it's located on the A partition). When the device is first flashed it the boot partition will be setup to load the A partition like in the diagram below: 

:::image type="content" source="media/image-update-concepts/ab-updating-loading-a.png" alt-text="AB Disk Usage Diagram" lightbox="media/image-update-concepts/ab-updating-partition.png":::

When a deployment for an image update is intititated DU will instruct the device to use SW Update to download the image for the deployment to the partition that is not in use (in this case the B side). After a successful download and verifying the checksum of the downloaded image SW Update uses a script to instruct the bootloader to load with the new image. Like in the below diagram: 

:::image type="content" source="media/image-update-concepts/ab-updating-loading-b.png" alt-text="AB Disk Usage Diagram" lightbox="media/image-update-concepts/ab-updating-partition.png":::

Now when the device boots it will attempt to boot the OS/RTOS loaded in the B partition. If the boot/loading  fails the device is able to fallback to the A side and report the failure. 

When a device goes through the next update cycle it will repeat the same process but using A instead of B and vice versa. 

