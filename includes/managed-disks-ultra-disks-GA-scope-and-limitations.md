---
title: include file
description: include file
services: virtual-machines
author: roygara
ms.service: virtual-machines
ms.topic: include
ms.date: 04/21/2021
ms.author: rogarana
ms.custom: include file
---
For now, ultra disks have additional limitations, they are as follows:

The only infrastructure redundancy options currently available to ultra disks are availability zones. VMs using any other redundancy options cannot attach an ultra disk.

The following table outlines the regions ultra disks are available in, as well as their corresponding availability options:

> [!NOTE]
> If a region in the following list has no ultra disk capable availability zones, then VMs in that region must be deployed without any infrastructure redundancy options in order to attach an ultra disk.

|Regions  |Redundancy options  |
|---------|---------|
|Brazil South     |Single VMs only (Availability sets and virtual machine scale sets are not supported)|
|Central India     |Single VMs only (Availability sets and virtual machine scale sets are not supported)|
|East Asia     |Single VMs only (Availability sets and virtual machine scale sets are not supported)|
|Germany West Central     |Single VMs only (Availability sets and virtual machine scale sets are not supported)|
|Korea Central     |Single VMs only (Availability sets and virtual machine scale sets are not supported)|
|North Central US    |Single VMs only (Availability sets and virtual machine scale sets are not supported)|
|South Central US    |Single VMs only (Availability sets and virtual machine scale sets are not supported)|
|US Gov Arizona     |Single VMs only (Availability sets and virtual machine scale sets are not supported)|
|US Gov Virginia     |Single VMs only (Availability sets and virtual machine scale sets are not supported)|
|US Gov Texas     |Single VMs only (Availability sets and virtual machine scale sets are not supported)|
|West US     |Single VMs only (Availability sets and virtual machine scale sets are not supported)        |
|Australia Central    |Single VMs only (Availability sets and virtual machine scale sets are not supported)|
|Australia East     |Three availability zones         |
|Southeast Asia    |Three availability zones        |
|Canada Central     |Three availability zones          |
|Central US     |Three availability zones          |
|East US     |Three availability zones          |
|East US 2     |Three availability zones         |
|France Central    |Two availability zones        |
|Japan East    |Three availability zones        |
|North Europe    |Three availability zones        |
|UK South    |Three availability zones        |
|West Europe    | Three availability zones|
|West US 2    |Three availability zones|

- Are only supported on the following VM series:
    - [ESv3](../articles/virtual-machines/ev3-esv3-series.md#esv3-series)
    - [Easv4](../articles/virtual-machines/eav4-easv4-series.md#easv4-series)
    - [Edsv4](../articles/virtual-machines/edv4-edsv4-series.md#edsv4-series)
    - [Esv4](../articles/virtual-machines/ev4-esv4-series.md#esv4-series)
    - [DSv3](../articles/virtual-machines/dv3-dsv3-series.md#dsv3-series)
    - [Dasv4](../articles/virtual-machines/dav4-dasv4-series.md#dasv4-series)
    - [Ddsv4](../articles/virtual-machines/ddv4-ddsv4-series.md#ddsv4-series)
    - [Dsv4](../articles/virtual-machines/dv4-dsv4-series.md#dsv4-series)
    - [FSv2](../articles/virtual-machines/fsv2-series.md)
    - [LSv2](../articles/virtual-machines/lsv2-series.md)
    - [M](../articles/virtual-machines/workloads/sap/hana-vm-operations-storage.md)
    - [Mv2](../articles/virtual-machines/workloads/sap/hana-vm-operations-storage.md)
    - [HBv2](../articles/virtual-machines/hbv2-series.md)
    - [HB](../articles/virtual-machines/hb-series.md)
    - [HC](../articles/virtual-machines/hc-series.md)
    - [NDv2](../articles/virtual-machines/ndv2-series.md)
    - [ND](../articles/virtual-machines/nd-series.md)
    - [NC_T4_v3](../articles/virtual-machines/nct4-v3-series.md)
    - [NCv2](../articles/virtual-machines/ncv2-series.md)
    - [NCv3](../articles/virtual-machines/ncv3-series.md)
    - [NVv3](../articles/virtual-machines/nvv3-series.md)
    - [NVv4](../articles/virtual-machines/nvv4-series.md)
    
- Not every VM size is available in every supported region with ultra disks.
- Are only available as data disks. 
- Support 4k physical sector size by default. 512E sector size is available as a generally available offering (no signup required). Most applications are compatible with 4k sector sizes but, some require 512 byte sector sizes. One example would be Oracle Database, which requires release 12.2 or later in order to support the 4k native disks. For older versions of Oracle DB, 512 byte sector size is required.
- Can only be created as empty disks.
- Doesn't currently support disk snapshots, VM images, availability sets, Azure Dedicated Hosts, or Azure disk encryption.
- Doesn't currently support integration with Azure Backup or Azure Site Recovery.
- Only supports un-cached reads and un-cached writes.
- The current maximum limit for IOPS on GA VMs is 80,000.

Azure ultra disks offer up to 32 TiB per region per subscription by default, but ultra disks support higher capacity by request. To request an increase in capacity, request a quota increase or contact Azure Support.
