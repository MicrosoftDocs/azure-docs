---
title: Azure Storage scalability and performance targets
description: Learn about the scalability and performance targets, including capacity, request rate, and inbound and outbound bandwidth, for standard Azure storage accounts.
services: storage
author: roygara
ms.service: storage
ms.topic: article
ms.date: 11/08/2018
ms.author: rogarana
ms.component: common
---

# Azure Storage scalability and performance targets for standard storage accounts

This article details the scalability and performance targets for standard Azure storage accounts. The scalability and performance targets listed here are high-end targets, but are achievable. In all cases, the request rate and bandwidth achieved by your storage account depends upon the size of objects stored, the access patterns utilized, and the type of workload your application performs. 

Be sure to test your service to determine whether its performance meets your requirements. If possible, avoid sudden spikes in the rate of traffic and ensure that traffic is well-distributed across partitions.

When your application reaches the limit of what a partition can handle for your workload, Azure Storage begins to return error code 503 (Server Busy) or error code 500 (Operation Timeout) responses. If 503 errors are occurring, consider modifying your application to use an exponential backoff policy for retries. The exponential backoff allows the load on the partition to decrease, and to ease out spikes in traffic to that partition.

## Standard storage account scale limits
[!INCLUDE [azure-storage-limits](../../../includes/azure-storage-limits.md)]

## Storage resource provider scale limits 

[!INCLUDE [azure-storage-limits-azure-resource-manager](../../../includes/azure-storage-limits-azure-resource-manager.md)]

## Azure Blob storage scale targets
[!INCLUDE [storage-blob-scale-targets](../../../includes/storage-blob-scale-targets.md)]

## Azure Files scale targets
For more information on the scale and performance targets for Azure Files and Azure File Sync, see [Azure Files scalability and performance targets](../files/storage-files-scale-targets.md).

[!INCLUDE [storage-files-scale-targets](../../../includes/storage-files-scale-targets.md)]

### Azure File Sync scale targets
Azure File Sync has been designed with the goal of limitless usage, but limitless usage is not always possible. The following table indicates the boundaries of Microsoft's testing and also indicates which targets are hard limits:

[!INCLUDE [storage-sync-files-scale-targets](../../../includes/storage-sync-files-scale-targets.md)]

## Azure Queue storage scale targets
[!INCLUDE [storage-queues-scale-targets](../../../includes/storage-queues-scale-targets.md)]

## Azure Table storage scale targets
[!INCLUDE [storage-table-scale-targets](../../../includes/storage-tables-scale-targets.md)]

## See Also
* [Storage Pricing Details](https://azure.microsoft.com/pricing/details/storage/)
* [Azure Subscription and Service Limits, Quotas, and Constraints](../../azure-subscription-service-limits.md)
* [Azure Storage Replication](../storage-redundancy.md)
* [Microsoft Azure Storage Performance and Scalability Checklist](../storage-performance-checklist.md)

