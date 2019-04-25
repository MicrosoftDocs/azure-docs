---
title: Azure Disk Storage managed disk overview for Linux VMs | Microsoft Docs
description: Overview of Azure managed disks, which handles the storage accounts for you when using Linux VMs
services: "virtual-machines-linux,storage"
author: roygara
ms.service: virtual-machines-linux
ms.tgt_pltfrm: vm-linux
ms.topic: overview
ms.date: 04/22/2019
ms.author: rogarana
ms.subservice: disks
---
# Introduction to Azure managed disks

An Azure managed disk is a virtual hard disk (VHD). You can think of it like a physical disk in an on-premises server but, virtualized. Azure managed disks are stored as page blobs, which are a random IO storage object in Azure. We call a managed disk ‘managed’ because it is an abstraction over page blobs, blob containers, and Azure storage accounts. With managed disks, all you have to do is provision the disk, and Azure takes care of the rest.

When you select to use Azure managed disks with your workloads, Azure creates and manages the disk for you. The available types of disks are ultra disks (Preview), premium solid-state drives (SSD), standard SSD, and standard hard disk drives (HDD). For more information about each individual disk type, see [Select a disk type for IaaS VMs](disks-types.md).

[!INCLUDE [virtual-machines-managed-disks-overview.md](../../../includes/virtual-machines-managed-disks-overview.md)]

> [!div class="nextstepaction"]
> [Select a disk type for IaaS VMs](disks-types.md)
