---
title: include file
description: include file
services: virtual-machines
author: roygara
ms.service: virtual-machines
ms.topic: include
ms.date: 11/18/2019
ms.author: rogarana
ms.custom: include file
---
For now, ultra disks have additional limitations, they are as follows:

The only infrastructure redundancy options currently available to ultra disks are availability zones, VMs using any other redundancy options cannot attach an ultra disk.

VMs using availability zones in the following regions can attach ultra disks, though disks are not offered in every availability zone of these regions:

- East US 2
- East US
- West US 2
- SouthEast Asia
- North Europe
- West Europe
- UK South 

> [!IMPORTANT]
> If your VMs are using no infrastructure redundancy options, then they must be in the West US region in order to attach ultra disks. 

- Are only supported on the following VM series:
    - [ESv3](https://azure.microsoft.com/blog/introducing-the-new-dv3-and-ev3-vm-sizes/)
    - [DSv3](https://azure.microsoft.com/blog/introducing-the-new-dv3-and-ev3-vm-sizes/)
    - FSv2
    - [M](../articles/virtual-machines/workloads/sap/hana-vm-operations-storage.md)
    - [Mv2](../articles/virtual-machines/workloads/sap/hana-vm-operations-storage.md)
- Not every VM size is available in every supported region with ultra disks
- Are only available as data disks and only support 4k physical sector size. Due to the 4K native sector size of Ultra Disk, there are some applications that won't be compatible with ultra disks. One example would be Oracle Database, which requires release 12.2 or later in order to support ultra disks.  
- Can only be created as empty disks  
- Doesn't currently support disk snapshots, VM images, availability sets, Azure Dedicated Hosts, or Azure disk encryption
- Doesn't currently support integration with Azure Backup or Azure Site Recovery
- The current maximum limit for IOPS on GA VMs is 80,000.