---
title: Overview of backing up and restoring Windows VMs in Azure | Microsoft Docs
description: Overview of protecting your Windows VMs by backing them up using Azure Backup.
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 08/09/2017
ms.author: cynthn
---

# Backup and restore options for Windows virtual machines in Azure
You can protect your data by taking backups at regular intervals. There are several backup options available for VMs, depending on your use-case.



## Azure Backup

For backing up Azure VMs running production workloads, use Azure Backup. Azure Backup supports application-consistent backups for both Windows and Linux VMs.

For a simple, hands-on introduction to Azure Backup for Azure VMs, see [Back up Windows virtual machines in Azure](windows/tutorial-backup-vms.md)

For more information on how Azure Backup works, see [Plan your VM backup infrastructure in Azure](../../backup/backup-azure-vms-introduction.md)


## Managed snapshots 

In development and test environments, snapshots provide a simplified backup option.

A Managed Snapshot is a read-only full copy of a managed disk which is stored as a standard managed disk by default. With snapshots, you can back up your managed disks at any point in time. These snapshots exist independent of the source disk and can be used to create new Managed Disks. They are billed based on the used size. For example, if you create a snapshot of a managed disk with provisioned capacity of 64 GB and actual used data size of 10 GB, snapshot will be billed only for the used data size of 10 GB.  

[Incremental snapshots](storage-incremental-snapshots.md) are currently not supported for Managed Disks, but will be supported in the future.

To learn more about how to create snapshots with Managed Disks, please check out these resources:

* [Create copy of VHD stored as a Managed Disk using Snapshots in Windows](../virtual-machines/windows/snapshot-copy-managed-disk.md)
* [Create copy of VHD stored as a Managed Disk using Snapshots in Linux](../virtual-machines/linux/snapshot-copy-managed-disk.md)


