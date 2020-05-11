---
title: include file
description: include file
services: virtual-machines
author: roygara
ms.service: virtual-machines
ms.topic: include
ms.date: 05/11/2020
ms.author: rogarana
ms.custom: include file
---
For now, ultra disks have additional limitations, they are as follows:

The only infrastructure redundancy options currently available to ultra disks are availability zones. VMs using any other redundancy options cannot attach an ultra disk.

The following table outlines the regions ultra disks are available in, as well as their corresponding availability options:

> [!NOTE]
> If a region in the following list has no ultra disk capable availability zones, then VMs in that region must be deployed without any infrastructure redundancy options in order to attach an ultra disk.

|Regions  |Ultra disk availability zones  |
|---------|---------|
|US Gov Virginia     |No         |
|South Central US     |No         |
|Central US     |Available in three zones         |
|West US     |No         |
|West US 2    |Available in three zones         |
|East US     |Available in three zones         |
|East US 2     |Available in two zones         |
|SouthEast Asia     |Available in three zones         |
|North Europe     |Available in three zones          |
|West Europe     |Available in three zones          |
|UK South     |Available in three zones          |
|Japan East     |Available in two zones         |



- Are only supported on the following VM series:
    - [ESv3](../articles/virtual-machines/ev3-esv3-series.md#esv3-series)
    - [DSv3](../articles/virtual-machines/dv3-dsv3-series.md#dsv3-series)
    - [FSv2](../articles/virtual-machines/fsv2-series.md)
    - [LSv2](../articles/virtual-machines/lsv2-series.md)
    - [M](../articles/virtual-machines/workloads/sap/hana-vm-operations-storage.md)
    - [Mv2](../articles/virtual-machines/workloads/sap/hana-vm-operations-storage.md)
- Not every VM size is available in every supported region with ultra disks
- Are only available as data disks and only support 4k physical sector size. Due to the 4K native sector size of Ultra Disk, there are some applications that won't be compatible with ultra disks. One example would be Oracle Database, which requires release 12.2 or later in order to support ultra disks.  
- Can only be created as empty disks  
- Doesn't currently support disk snapshots, VM images, availability sets, Azure Dedicated Hosts, or Azure disk encryption
- Doesn't currently support integration with Azure Backup or Azure Site Recovery
- The current maximum limit for IOPS on GA VMs is 80,000.

Azure ultra disks offer up to 16 TiB per region per subscription by default, but ultra disks support higher capacity by request. To request an increase in capacity, contact Azure Support.