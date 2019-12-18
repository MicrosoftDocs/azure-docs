---
title: Scalability and performance targets for Blob storage
titleSuffix: Azure Storage
description: Learn about scalability and performance targets for Azure Storage accounts, for Blob storage, and for premium block blob and page blob storage accounts.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 12/18/2019
ms.author: tamram
ms.subservice: common
---

# Azure Storage scalability and performance targets for storage accounts

This article details the scalability and performance targets for Azure Storage accounts, for Blob storage, and for premium block blob and page blob storage accounts. The scalability and performance targets listed here are high-end targets, but are achievable. In all cases, the request rate and bandwidth achieved by your storage account depends upon the size of objects stored, the access patterns utilized, and the type of workload your application performs.

Be sure to test your application to determine whether its performance meets your requirements. If possible, avoid sudden spikes in the rate of traffic and ensure that traffic is well-distributed across partitions. For more information about how to design your application for optimal performance, see [Performance and scalability checklist for Blob storage](storage-performance-checklist.md).

## Scale targets for standard storage accounts

[!INCLUDE [azure-storage-account-limits-standard](../../../includes/azure-storage-account-limits-standard.md)]

## Scale targets for Blob storage

[!INCLUDE [storage-blob-scale-targets](../../../includes/storage-blob-scale-targets.md)]

## Scale targets for premium block blob storage accounts

A premium performance block blob storage account is optimized for applications that use smaller, kilobyte range, objects. It's ideal for applications that require high transaction rates or consistent low-latency storage. Premium performance block blob storage is designed to scale with your applications. If you plan to deploy application(s) that require hundreds of thousands of requests per second or petabytes of storage capacity, please contact Microsoft by submitting a support request in the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Scale targets for premium page blob storage accounts

Premium performance, general-purpose v1, or v2 storage accounts have the following scalability targets:

| Total account capacity                            | Total bandwidth for a locally redundant storage account                     |
| ------------------------------------------------- | --------------------------------------------------------------------------- |
| Disk capacity: 35 TB <br>Snapshot capacity: 10 TB | Up to 50 gigabits per second for inbound<sup>1</sup> + outbound<sup>2</sup> |

<sup>1</sup> All data (requests) that are sent to a storage account

<sup>2</sup> All data (responses) that are received from a storage account

If you are using premium performance storage accounts for unmanaged disks and your application exceeds the scalability targets of a single storage account, then Microsoft recommends migrating to managed disks. If you cannot migrate to managed disks, then build your application to use multiple storage accounts and partition your data across those storage accounts. For example, if you want to attach 51-TB disks across multiple VMs, spread them across two storage accounts. 35 TB is the limit for a single premium storage account. Make sure that a single premium performance storage account never has more than 35 TB of provisioned disks.

## Scale targets for the Azure Storage resource provider

[!INCLUDE [azure-storage-limits-azure-resource-manager](../../../includes/azure-storage-limits-azure-resource-manager.md)]

## See also

- [Performance and scalability checklist for Blob storage](storage-performance-checklist.md)
- [Azure Storage pricing overview](https://azure.microsoft.com/pricing/details/storage/)
