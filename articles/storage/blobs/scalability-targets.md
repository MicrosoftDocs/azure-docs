---
title: Blob Storage Scalability and Performance Targets
titleSuffix: Azure Storage
description: Learn Azure Blob Storage scalability and performance targets, understand service limits, and design applications for optimal performance.
author: normesta

ms.service: azure-blob-storage
ms.topic: concept-article
ms.date: 07/24/2026
ms.author: normesta
# Customer intent: As a cloud architect, I want to understand the scalability and performance targets for Blob storage, so that I can ensure my applications are designed to meet the required performance levels as they grow.
---

# Scalability and performance targets for Blob storage

[!INCLUDE [storage-scalability-intro-include](../../../includes/storage-scalability-intro-include.md)]

For the service-level agreement (SLA) for Azure Storage accounts, see [SLA for Storage Accounts](https://azure.microsoft.com/support/legal/sla/storage/v1_5/).

## Scale targets for Blob storage

[!INCLUDE [storage-blob-scale-targets](../../../includes/storage-blob-scale-targets.md)]

## Hot partitions: detection, monitoring, and mitigation

Azure Blob Storage distributes data and requests across partitions to help scale workloads. A storage account can have available capacity and throughput while workloads that concentrate traffic on a narrow range of partition keys experience partition-level throughput constraints. 

When a single partition receives significantly more traffic than other partitions, it becomes a *hot partition*. The partition key for a blob combines the storage account name, container name, and blob name, so sequential or append-only naming schemes can concentrate traffic on a single partition.

When a partition becomes hot, your application might observe increased latency and receive HTTP 503 (Server Busy) or HTTP 500 (Operation Timeout) responses before the storage account approaches its documented scalability limits.

To mitigate hot partitions:

- Avoid sequential or append-only blob naming schemes that concentrate traffic on a single partition.

- Use an exponential backoff retry strategy when throttling errors occur.

- Increase request rates gradually when you introduce new workloads.

To detect throttling and identify the source of excessive demand, use Azure Monitor metrics and resource logs.

For more information, see [Mitigate hot partitions in Azure Blob Storage](storage-performance-mitigate-hot-partitions.md).

## See also

- [Performance and scalability checklist for Blob storage](storage-performance-checklist.md)
- [Scalability targets for standard storage accounts](../common/scalability-targets-standard-account.md)
- [Scalability targets for premium block blob storage accounts](scalability-targets-premium-block-blobs.md)
- [Scalability targets for the Azure Storage resource provider](../common/scalability-targets-resource-provider.md)
- [Azure subscription limits and quotas](../../azure-resource-manager/management/azure-subscription-service-limits.md)
