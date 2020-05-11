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
> Some availability zone within these regions do not offer ultra disks.

|Regions  |No infrastructure redundancy  |Availability zones  |
|---------|---------|---------|
|US Gov Virginia     |Yes         |No         |
|South Central US     |Yes         |No         |
|Central US     |No         |Yes         |
|West US     |Yes         |No         |
|West US 2    |No         |Yes         |
|East US     |No         |Yes         |
|East US 2     |No         |Yes         |
|SouthEast Asia     |No         |Yes         |
|North Europe     |No         |Yes         |
|West Europe     |No         |Yes         |
|UK South     |No         |Yes         |
|Japan East     |No         |Yes         |



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