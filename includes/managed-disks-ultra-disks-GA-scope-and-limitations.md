---
title: include file
description: include file
author: roygara
ms.service: azure-disk-storage
ms.topic: include
ms.date: 05/23/2024
ms.author: rogarana
ms.custom: include file
---

The following list contains Ultra Disk's limitations:
- Ultra Disks can't be used as an OS disk.
- Currently, Ultra Disks only support Single VM and Availability zone infrastructure options.
- Ultra Disks don't support availability sets.
- The size of an Ultra Disk can't be expanded without either deallocating the VM or detaching the Ultra Disk.
- Existing disks currently can't change their type to an Ultra Disk. They must be [migrated](../articles/virtual-machines/disks-convert-types.md#migrate-to-premium-ssd-v2-or-ultra-disk).
- Azure Disk Encryption isn't supported for VMs with Ultra Disks. Instead, you should use encryption at rest with platform-managed or customer-managed keys.
- Azure Site Recovery isn't supported for VMs with Ultra Disks.
- Ultra Disks don't support disk caching.
- Snapshots are supported with [other limitations](../articles/virtual-machines/disks-incremental-snapshots.md#incremental-snapshots-of-premium-ssd-v2-and-ultra-disks).
- Azure Backup support for VMs with Ultra Disks is [generally available](../articles/backup/backup-support-matrix-iaas.md#vm-storage-support). Azure Backup has limitations when using Ultra Disks, see [VM storage support](../articles/backup/backup-support-matrix-iaas.md#vm-storage-support) for details.

Ultra Disks support a 4k physical sector size by default but also supports a 512E sector size. Most applications are compatible with 4k sector sizes, but some require 512-byte sector sizes. Oracle Database, for example, requires release 12.2 or later in order to support 4k native disks. For older versions of Oracle DB, 512-byte sector size is required.

The following table outlines the regions Ultra Disks are available in, and their corresponding availability options.

> [!NOTE]
> If a region in the following list lacks availability zones that support Ultra disks, then a VM in that region must be deployed without infrastructure redundancy to attach an Ultra Disk.

| Redundancy options | Regions |
|--------------------|---------|
| **Single VMs** | Australia Central<br/>Brazil South<br/>Brazil Southeast<br/>Canada East<br/>Central India<br/>East Asia<br/>Germany West Central<br/>Korea Central<br/>Korea South<br/>UK West <br/>North Central US, South Central US, West US<br/>US Gov Arizona, US Gov Texas, US Gov Virginia |
| **One availability zone** | Poland Central <br/> UAE North |
| **Two availability zones** | China North 3 <br/> France Central <br/> Italy North <br/> Qatar Central <br/> South Africa North <br/> Switzerland North |
| **Three availability zones** | Australia East<br/>Canada Central<br/>North Europe, West Europe<br/>Japan East<br/>Southeast Asia<br/>Sweden Central<br/>UK South<br/>Central US, East US, East US 2, West US 2, West US 3 |

Not every VM size is available in every supported region with Ultra Disks. The following table lists VM series that are compatible with Ultra Disks.

|VM Type     |Sizes    |Description  |
|------------|---------|-------------|
| General purpose|[DSv3-series](../articles/virtual-machines/dv3-dsv3-series.md#dsv3-series), [Ddsv4-series](../articles/virtual-machines/ddv4-ddsv4-series.md#ddsv4-series), [Dsv4-series](../articles/virtual-machines/dv4-dsv4-series.md#dsv4-series), [Dasv4-series](../articles/virtual-machines/dav4-dasv4-series.md#dasv4-series), [Dsv5-series](../articles/virtual-machines/dv5-dsv5-series.md#dsv5-series), [Ddsv5-series](../articles/virtual-machines/ddv5-ddsv5-series.md#ddsv5-series), [Dasv5-series](../articles/virtual-machines/dasv5-dadsv5-series.md#dasv5-series)| Balanced CPU-to-memory ratio. Ideal for testing and development, small to medium databases, and low to medium traffic web servers.|
| Compute optimized|[FSv2-series](../articles/virtual-machines/fsv2-series.md)| High CPU-to-memory ratio. Good for medium traffic web servers, network appliances, batch processes, and application servers.|
| Memory optimized|[ESv3-series](../articles/virtual-machines/ev3-esv3-series.md#esv3-series), [Easv4-series](../articles/virtual-machines/eav4-easv4-series.md#easv4-series), [Edsv4-series](../articles/virtual-machines/edv4-edsv4-series.md#edsv4-series), [Esv4-series](../articles/virtual-machines/ev4-esv4-series.md#esv4-series), [Esv5-series](../articles/virtual-machines/ev5-esv5-series.md#esv5-series), [Edsv5-series](../articles/virtual-machines/edv5-edsv5-series.md#edsv5-series), [Easv5-series](../articles/virtual-machines/easv5-eadsv5-series.md#easv5-series), [Ebsv5 series](../articles/virtual-machines/ebdsv5-ebsv5-series.md#ebsv5-series), [Ebdsv5 series](../articles/virtual-machines/ebdsv5-ebsv5-series.md#ebdsv5-series), [M-series](../articles/virtual-machines/m-series.md), [Mv2-series](../articles/virtual-machines/mv2-series.md), [Msv2/Mdsv2-series](../articles/virtual-machines/msv2-mdsv2-series.md)|High memory-to-CPU ratio. Great for relational database servers, medium to large caches, and in-memory analytics.
| Storage optimized|[LSv2-series](../articles/virtual-machines/lsv2-series.md), [Lsv3-series](../articles/virtual-machines/lsv3-series.md), [Lasv3-series](../articles/virtual-machines/lasv3-series.md)|High disk throughput and IO ideal for Big Data, SQL, NoSQL databases, data warehousing, and large transactional databases.|
| GPU optimized|[NCv2-series](../articles/virtual-machines/ncv2-series.md), [NCv3-series](../articles/virtual-machines/ncv3-series.md), [NCasT4_v3-series](../articles/virtual-machines/nct4-v3-series.md), [ND-series](../articles/virtual-machines/nd-series.md), [NDv2-series](../articles/virtual-machines/ndv2-series.md), [NVv3-series](../articles/virtual-machines/nvv3-series.md), [NVv4-series](../articles/virtual-machines/nvv4-series.md), [NVadsA10 v5-series](../articles/virtual-machines/nva10v5-series.md)| Specialized virtual machines targeted for heavy graphic rendering and video editing, as well as model training and inferencing (ND) with deep learning. Available with single or multiple GPUs.|
| <nobr>Performance optimized</nobr> |[HB-series](../articles/virtual-machines/hb-series.md), [HC-series](../articles/virtual-machines/hc-series.md), [HBv2-series](../articles/virtual-machines/hbv2-series.md)|The fastest and most powerful CPU virtual machines with optional high-throughput network interfaces (RDMA).|
