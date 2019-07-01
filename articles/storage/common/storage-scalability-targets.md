---
title: Azure Storage scalability and performance targets - storage accounts
description: Learn about the scalability and performance targets, including capacity, request rate, and inbound and outbound bandwidth, for Azure storage accounts.
services: storage
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 03/23/2019
ms.author: rogarana
ms.subservice: common
---

# Azure Storage scalability and performance targets for storage accounts

This article details the scalability and performance targets for Azure storage accounts. The scalability and performance targets listed here are high-end targets, but are achievable. In all cases, the request rate and bandwidth achieved by your storage account depends upon the size of objects stored, the access patterns utilized, and the type of workload your application performs.

Be sure to test your service to determine whether its performance meets your requirements. If possible, avoid sudden spikes in the rate of traffic and ensure that traffic is well-distributed across partitions.

When your application reaches the limit of what a partition can handle for your workload, Azure Storage begins to return error code 503 (Server Busy) or error code 500 (Operation Timeout) responses. If 503 errors are occurring, consider modifying your application to use an exponential backoff policy for retries. The exponential backoff allows the load on the partition to decrease, and to ease out spikes in traffic to that partition.

## Storage account scale limits

[!INCLUDE [azure-storage-limits](../../../includes/azure-storage-limits.md)]

## Premium performance storage account scale limits

[!INCLUDE [azure-premium-limits](../../../includes/azure-storage-limits-premium.md)]

## Storage resource provider scale limits

[!INCLUDE [azure-storage-limits-azure-resource-manager](../../../includes/azure-storage-limits-azure-resource-manager.md)]

## Azure Blob storage scale targets

[!INCLUDE [storage-blob-scale-targets](../../../includes/storage-blob-scale-targets.md)]

## Azure Files scale targets

For more information on the scale and performance targets for Azure Files and Azure File Sync, see [Azure Files scalability and performance targets](../files/storage-files-scale-targets.md).

> [!IMPORTANT]
> Storage account limits apply to all shares. Scaling up to the max for storage accounts is only achievable if there is only one share per storage account.
>
> Standard file shares larger than 5 TiB are in preview and have certain limitations.
> For a list of limitations and to onboard to the preview of these larger file share sizes, see the [Standard file shares](../files/storage-files-planning.md#standard-file-shares) section of the Azure Files planning guide.

[!INCLUDE [storage-files-scale-targets](../../../includes/storage-files-scale-targets.md)]

### Premium files scale targets

There are three categories of limitations to consider for premium files: storage accounts, shares, and files.

For example: A single share can achieve 100,000 IOPS and a single file can scale up to 5,000 IOPS. So, for example, if you have three files in one share, the max IOPs you can get from that share is 15,000.

#### Premium file share limits

[!INCLUDE [storage-files-premium-scale-targets](../../../includes/storage-files-premium-scale-targets.md)]

### Azure File Sync scale targets

Azure File Sync has been designed with the goal of limitless usage, but limitless usage is not always possible. The following table indicates the boundaries of Microsoft's testing and also indicates which targets are hard limits:

[!INCLUDE [storage-sync-files-scale-targets](../../../includes/storage-sync-files-scale-targets.md)]

## Azure Queue storage scale targets

[!INCLUDE [storage-queues-scale-targets](../../../includes/storage-queues-scale-targets.md)]

## Azure Table storage scale targets

[!INCLUDE [storage-table-scale-targets](../../../includes/storage-tables-scale-targets.md)]

## See also

- [Storage Pricing Details](https://azure.microsoft.com/pricing/details/storage/)
- [Azure Subscription and Service Limits, Quotas, and Constraints](../../azure-subscription-service-limits.md)
- [Azure Storage Replication](../storage-redundancy.md)
- [Microsoft Azure Storage Performance and Scalability Checklist](../storage-performance-checklist.md)