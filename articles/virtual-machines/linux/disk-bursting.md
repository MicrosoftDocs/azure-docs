---
title: Benchmarking your application on Azure Disk Storage - managed disks
description: Learn about the process of benchmarking your application on Azure.
author: roygara
ms.author: rogarana
ms.date: 10/16/2019
ms.topic: conceptual
ms.service: virtual-machines-linux
ms.subservice: disks
---

Premium SSD Disks support bursting on any disk sizes <= 512 GiB (P20 or below). Disk bursting is best effort and based on a credit system. You will accumulate credits in a burst bucket whenever disk traffic is below the provisioned performance target and consume credits when traffic burst beyond the target. Disk traffic is tracked against both IOPS and bandwidth in the provisioned target. For example, a P1 4 GiB disk has a provisioned target of 120 IOPS and 25 MBps. If the actual traffic on the disk was 100 IOPS and 20 MBps in the past 1 second interval, then the unused 20 IOs and 5 MB are credited to the burst bucket of the disk. Credits in the burst bucket can be later be consumedused when the traffic exceeds the provisioned target up to the max burst caplimit. The max burst cap limit defines the ceiling of disk traffic even if you have burst credits to consume from. In this case, even if you have 10,000 IOs in the credit bucket, your a P1 disk cannot issue more than the max burst cap of 3,500 IO per sec.  

One common scenario that can benefit from disk bursting is the OS disks for faster VM boot and application launch. Let’s take a Linux VM with an 8 GiB OS image as an example. If we use a P2 8 GiB disk as the OS disk, the provisioned target is 120 IOPS and 25 MBps. When VM starts, there will be a read spike to the OS disk loading the boot files. With the introduction of bursting, you can read at the max burst speed of 3500 IOPS and 170 MBps accelerating the load time by at least 6x. After VM boot, the traffic level on the OS disk is usually low as most data operations by the application will be against the attached data disks. If you are hosting a Remote Virtual Desktop environment, whenever an active user launches an application like AutoCAD, read to OS disk significantly increases. In this case, burst traffic will consume the accumulated credits going beyond the provisioned target accelerating the application launch experience.   

Disks bursting support will be enabled on new deployments of applicable disk sizes by default with no user action required. For existing disks of the applicable sizes, you can enable bursting with either of two the options: detach and re-attach the disk or stop and restart the attached VM. All burst applicable disk sizes will start with a full burst credit bucket when the disk is attached to a Virtual Machine. The max duration of bursting is determined by the size of the burst credit bucket. You can only accumulate unused credits up to the size of the credit bucket. At any point of time, your disk burst credit bucket can be on one of the three states: 

Accruing, when the disk traffic is using less than the provisioned performance target. You can accumulate credit if disk traffic is beyond IOPS or bandwidth targets or both. You can still accumulate IO credits when you are consuming full disk bandwidth, vice versa.  

Declining, when the disk traffic is using more than the provisioned performance target. The burst traffic will independently consume credits from IOPS or bandwidth. 

Remaining constant, when the disk traffic is exactly at the provisioned performance target. 

The disk sizes that provide bursting support along with the burst specifications are summarized in the table below. You can also find the Preview regions on Azure Disks FAQ.  

[!INCLUDE [disk-storage-premium-ssd-sizes](../../../includes/disk-storage-premium-ssd-sizes.md)]