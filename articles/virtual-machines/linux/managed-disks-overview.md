---
title: Azure Disk Storage managed disk overview for Linux VMs| Microsoft Docs
description: Overview of Azure managed disks, which handles the storage accounts for you when using Azure Linux VMs
services: "virtual-machines-linux,storage"
author: roygara
ms.service: virtual-machines-linux
ms.tgt_pltfrm: vm-linux
ms.topic: article
ms.date: 01/11/2019
ms.author: rogarana
ms.component: disks
---
# Introduction to Azure managed disks

An Azure managed disk is a VHD (virtual hard disk). You can think of it like a physical disk like disks in an on-premises server but, virtualized.

You can select the type and size of the managed disks that you require, Azure then creates and manages the disk for you. The available types are Ultra SSD (Preview), Premium SSD, Standard SSD, and Standard HDD. You can learn more about each individual disk type in the [disk-types](disks-types.md) article.

[!INCLUDE [virtual-machines-managed-disks-overview.md](../../../includes/virtual-machines-managed-disks-overview.md)]