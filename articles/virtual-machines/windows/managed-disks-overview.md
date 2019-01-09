---
title: Azure Premium and Standard Managed Disks Overview for Windows VMs| Microsoft Docs
description: Overview of Azure Managed Disks, which handles the storage accounts for you when using Azure Windows VMs
services: "virtual-machines-windows,storage"
author: roygara
ms.service: virtual-machines-windows
ms.workload: storage
ms.tgt_pltfrm: vm-windows
ms.topic: article
ms.date: 06/15/2017
ms.author: rogarana
ms.component: disks
---
# Azure Managed Disks Overview

An Azure Managed Disk is a VHD (virtual hard disk). You can think of it like a physical disk like disks in an on-premises server but, virtualized.

You can select the type and size of the managed disks that you require, Azure then creates and manages the disk for you. The available types are Ultra SSD (Preview) , Premium SSD, Standard SSD, and Standard HDD. You can learn more about each individual disk type in the [disk-types](disks-types.md) article.

[!INCLUDE [virtual-machines-managed-disks-overview.md](../../../includes/virtual-machines-managed-disks-overview.md)]
