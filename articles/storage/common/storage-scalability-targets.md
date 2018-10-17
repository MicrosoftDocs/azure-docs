---
title: Azure Storage Scalability and Performance Targets | Microsoft Docs
description: Learn about the scalability and performance targets for Azure Storage, including capacity, request rate, and inbound and outbound bandwidth for both standard and premium storage accounts. Understand performance targets for partitions within each of the Azure Storage services.
services: storage
author: roygara
ms.service: storage
ms.topic: article
ms.date: 10/24/2017
ms.author: rogarana
ms.component: common
---
# Azure Storage Scalability and Performance Targets
## Overview
This article describes the scalability and performance topics for Azure Storage. For a summary of other Azure limits, see [Azure Subscription and Service Limits, Quotas, and Constraints](../../azure-subscription-service-limits.md).

> [!NOTE]
> All storage accounts run on the new flat network topology and support the scalability and performance targets outlined in this article, regardless of when they were created. For more information on the Azure Storage flat network architecture and on scalability, see [Microsoft Azure Storage: A Highly Available Cloud Storage Service with Strong Consistency](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/11/20/windows-azure-storage-a-highly-available-cloud-storage-service-with-strong-consistency.aspx).
> 

> [!IMPORTANT]
> The scalability and performance targets listed here are high-end targets, but are achievable. In all cases, the request rate and bandwidth achieved by your storage account depends upon the size of objects stored, the access patterns utilized, and the type of workload your application performs. Be sure to test your service to determine whether its performance meets your requirements. If possible, avoid sudden spikes in the rate of traffic and ensure that traffic is well-distributed across partitions.
> 
> When your application reaches the limit of what a partition can handle for your workload, Azure Storage begins to return error code 503 (Server Busy) or error code 500 (Operation Timeout) responses. If these errors are occurring, then your application should use an exponential backoff policy for retries. The exponential backoff allows the load on the partition to decrease, and to ease out spikes in traffic to that partition.
> 
> 

If the needs of your application exceed the scalability targets of a single storage account, you can build your application to use multiple storage accounts. You can then partition your data objects across those storage accounts. See [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/) for information on volume pricing.

## Scalability targets for a storage account
[!INCLUDE [azure-storage-limits](../../../includes/azure-storage-limits.md)]

### Storage resource provider limits 

[!INCLUDE [azure-storage-limits-azure-resource-manager](../../../includes/azure-storage-limits-azure-resource-manager.md)]

## Azure Blob storage scale targets
[!INCLUDE [storage-blob-scale-targets](../../../includes/storage-blob-scale-targets.md)]

## Azure Files scale targets
For more information on the scale and performance targets for Azure Files and Azure File Sync, see [Azure Files scalability and performance targets](../files/storage-files-scale-targets.md).

[!INCLUDE [storage-files-scale-targets](../../../includes/storage-files-scale-targets.md)]

### Azure File Sync scale targets
With Azure File Sync, we have tried as much as possible to design for limitless usage, however this is not always possible. The below table indicates the boundaries of our testing and which targets are actually hard limits:

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
* [Microsoft Azure Storage: A Highly Available Cloud Storage Service with Strong Consistency](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/11/20/windows-azure-storage-a-highly-available-cloud-storage-service-with-strong-consistency.aspx)

