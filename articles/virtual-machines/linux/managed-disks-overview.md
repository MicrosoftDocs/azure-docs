---
title: Azure Disk Storage overview for Linux VMs
description: Overview of Azure managed disks, which handle the storage accounts for you when using Linux VMs
author: roygara
ms.service: virtual-machines-linux
ms.topic: overview
ms.date: 11/06/2019
ms.author: rogarana
ms.subservice: disks
---
# Introduction to Azure managed disks

Azure managed disks are like block-level storage volumes that are managed by Azure and used with Azure Virtual Machines as virtual drives. You can think of a managed disk as if it were a physical disk in an on-premises server but, virtualized. With managed disks, all you have to do is specify the disk size, the disk type, and provision the disk, Azure handles the rest.

The available types of disks are ultra disk, premium solid state drive (SSD), standard SSD, and standard hard disk drive (HDD). For more information about each individual disk type, see [Select a disk type for IaaS VMs](disks-types.md).

[!INCLUDE [virtual-machines-managed-disks-overview.md](../../../includes/virtual-machines-managed-disks-overview.md)]

> [!div class="nextstepaction"]
> [Select a disk type for IaaS VMs](disks-types.md)
