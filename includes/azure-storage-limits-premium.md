---
title: include file
description: include file
services: storage
author: roygara
ms.service: storage
ms.topic: include
ms.date: 07/01/2019
ms.author: rogarana
ms.custom: include file
---

### Premium performance block blob storage

A premium performance block blob storage account is optimized for applications that use smaller, kilobyte range, objects. It's ideal for applications that require high transaction rates or consistent low-latency storage. Premium performance block blob storage is designed to scale with your applications. If you plan to deploy application(s) that require hundreds of thousands of requests per second or petabytes of storage capacity, please contact us by submitting a support request in the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

### Premium performance FileStorage

[!INCLUDE [azure-storage-limits-filestorage](azure-storage-limits-filestorage.md)]

 For premium file share scale targets, see the [Premium files scale targets](../articles/storage/common/storage-scalability-targets.md#premium-files-scale-targets) section.

### Premium performance page blob storage

Premium performance, general-purpose v1, or v2 storage accounts have the following scalability targets:

| Total account capacity                            | Total bandwidth for a locally redundant storage account                     |
| ------------------------------------------------- | --------------------------------------------------------------------------- |
| Disk capacity: 35 TB <br>Snapshot capacity: 10 TB | Up to 50 gigabits per second for inbound<sup>1</sup> + outbound<sup>2</sup> |

<sup>1</sup> All data (requests) that are sent to a storage account

<sup>2</sup> All data (responses) that are received from a storage account

If you are using premium performance storage accounts for unmanaged disks and your application exceeds the scalability targets of a single storage account, you might want to migrate to managed disks. If you don't want to migrate to managed disks, build your application to use multiple storage accounts. Then, partition your data across those storage accounts. For example, if you want to attach 51-TB disks across multiple VMs, spread them across two storage accounts. 35 TB is the limit for a single premium storage account. Make sure that a single premium performance storage account never has more than 35 TB of provisioned disks.