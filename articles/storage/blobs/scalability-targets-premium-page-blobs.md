---
title: Scalability targets for premium page blob storage accounts
titleSuffix: Azure Storage
description: A premium performance page blob storage account is optimized for read/write operations. This type of storage account backs an unmanaged disk for an Azure virtual machine.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 12/18/2019
ms.author: tamram
ms.subservice: common
---

# Scalability and performance targets for premium page blob storage accounts

[!INCLUDE [storage-scalability-intro-include](../../../includes/storage-scalability-intro-include.md)]

## Scale targets for premium page blob accounts

A premium-performance page blob storage account is optimized for read/write operations. This type of storage account backs an unmanaged disk for an Azure virtual machine.

> [!NOTE]
> Microsoft recommends using managed disks with Azure virtual machines (VMs) if possible. For more information about managed disks, see [Azure Disk Storage overview for Windows VMs](../../virtual-machines/windows/managed-disks-overview.md).

Premium page blob storage accounts have the following scalability targets:

| Total account capacity                            | Total bandwidth for a locally redundant storage account                     |
| ------------------------------------------------- | --------------------------------------------------------------------------- |
| Disk capacity: 4 TB (individual disk)/ 35 TB (cumulative total of all disks) <br>Snapshot capacity: 10 TB | Up to 50 gigabits per second for inbound<sup>1</sup> + outbound<sup>2</sup> |

<sup>1</sup> All data (requests) that are sent to a storage account

<sup>2</sup> All data (responses) that are received from a storage account

A premium page blob account is be a general-purpose account configured for premium performance. General-purpose v2 storage accounts are recommended.

If you are using premium page blob storage accounts for unmanaged disks and your application exceeds the scalability targets of a single storage account, then Microsoft recommends migrating to managed disks. For more information about managed disks, see [Azure Disk Storage overview for Windows VMs](../../virtual-machines/windows/managed-disks-overview.md) or [Azure Disk Storage overview for Linux VMs](../../virtual-machines/linux/managed-disks-overview.md).

If you cannot migrate to managed disks, then build your application to use multiple storage accounts and partition your data across those storage accounts. For example, if you want to attach 51-TB disks across multiple VMs, spread them across two storage accounts. 35 TB is the limit for a single premium storage account. Make sure that a single premium performance storage account never has more than 35 TB of provisioned disks.

## See also

- [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md)
- [Scalability targets for premium block blob storage accounts](../blobs/scalability-targets-premium-block-blobs.md)
- [Azure subscription limits and quotas](../../azure-resource-manager/management/azure-subscription-service-limits.md)
