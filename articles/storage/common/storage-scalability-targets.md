---
title: Azure storage accounts scalability and performance targets
description: Learn about the scalability and performance targets, including capacity, request rate, and inbound and outbound bandwidth, for Azure storage accounts.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 12/13/2019
ms.author: tamram
ms.subservice: common
---

# Azure Storage scalability and performance targets for storage accounts

This article details the scalability and performance targets for Azure storage accounts. The scalability and performance targets listed here are high-end targets, but are achievable. In all cases, the request rate and bandwidth achieved by your storage account depends upon the size of objects stored, the access patterns utilized, and the type of workload your application performs.

Be sure to test your service to determine whether its performance meets your requirements. If possible, avoid sudden spikes in the rate of traffic and ensure that traffic is well-distributed across partitions.

When your application reaches the limit of what a partition can handle for your workload, Azure Storage begins to return error code 503 (Server Busy) or error code 500 (Operation Timeout) responses. If 503 errors are occurring, consider modifying your application to use an exponential backoff policy for retries. The exponential backoff allows the load on the partition to decrease, and to ease out spikes in traffic to that partition.

## Storage account scale limits

[!INCLUDE [azure-storage-account-limits-standard](../../../includes/azure-storage-account-limits-standard.md)]

## Premium performance storage account scale limits

[!INCLUDE [azure-premium-limits](../../../includes/azure-storage-limits-premium.md)]

## Azure Blob storage scale targets

[!INCLUDE [storage-blob-scale-targets](../../../includes/storage-blob-scale-targets.md)]

## See also

- [Azure Storage pricing overview](https://azure.microsoft.com/pricing/details/storage/)
- [Azure Subscription and Service Limits, Quotas, and Constraints](../../azure-subscription-service-limits.md)
- [Azure Storage Replication](../storage-redundancy.md)
- [Microsoft Azure Storage Performance and Scalability Checklist](../storage-performance-checklist.md)

