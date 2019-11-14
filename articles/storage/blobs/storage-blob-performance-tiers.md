---
title: Azure Block Blob storage performance tiers - Azure Storage
description: Performance tiers for Azure blob storage.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 10/02/2019
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
ms.reviewer: clausjor
---

# Azure Block Blob storage performance tiers

As enterprises deploy performance sensitive cloud-native applications, it's important to have options for cost-effective data storage at different performance levels.

Azure block blob storage offers two different performance tiers:

- Premium: optimized for high transaction rates and single-digit consistent storage latency
- Standard: optimized for high capacity and high throughput

The following considerations apply to the different performance tiers:

- Standard performance is available in all [Azure regions](https://azure.microsoft.com/global-infrastructure/services/?products=storage). Premium performance is available in [select regions](https://azure.microsoft.com/global-infrastructure/services/?products=storage).
- Premium performance provides optimized pricing for applications with high transaction rates to help [lower total storage cost](https://azure.microsoft.com/blog/reducing-overall-storage-costs-with-azure-premium-blob-storage/) for these workloads.
- To get premium performance for block blobs, you must use the BlockBlobStorage account type.
- Standard performance is available with General Purpose v1, General Purpose v2, and Blob storage accounts.
- Premium and standard performance both support [high throughput block blobs](https://azure.microsoft.com/blog/high-throughput-with-azure-blob-storage/). High throughput block blobs are available for premium performance at greater than 256 KiB. High throughput block blobs are available for standard performance at greater than 4 MiB Put Block or Put Blob sizes.
- Premium performance is currently available with locally redundant storage (LRS) only.

## Premium performance

Premium performance block blob storage makes data available via high-performance hardware. Data is stored on solid-state drives (SSDs) which are optimized for low latency. SSDs provide higher throughput compared to traditional hard drives.

Premium performance block blob storage is ideal for workloads that require fast and consistent response times. It's best for workloads that perform many small transactions.

## Standard performance

Standard performance supports different [access tiers](storage-blob-storage-tiers.md) to store data in the most cost-effective manner. It's optimized for high capacity and high throughput on large data sets.

## Blob lifecycle management

Blob Storage lifecycle management offers a rich, rule-based policy:

- Premium - expire data at the end of its lifecycle
- Standard - transition data to the best access tier and expire data at the end of its lifecycle

To learn more, see [Manage the Azure Blob storage lifecycle](storage-lifecycle-management-concepts.md).

Data that's stored in a premium block blob storage account can't be moved between hot, cool, and archive tiers. However, you can copy blobs from a block blob storage account to the hot access tier in a *different* account. Use the [Put Block From URL](/rest/api/storageservices/put-block-from-url) API or [AzCopy v10](../common/storage-use-azcopy-v10.md) to copy data to a different account. The **Put Block From URL** API synchronously copies data on the server. The call completes only after all the data is moved from the original server location to the destination location.

## Next steps

Evaluate hot, cool, and archive in GPv2 and Blob storage accounts

- [Check availability of hot, cool, and archive by region](https://azure.microsoft.com/regions/#services)
- [Manage the Azure Blob storage lifecycle](storage-lifecycle-management-concepts.md)
- [Learn about rehydrating blob data from the archive tier](storage-blob-rehydration.md)
- [Evaluate usage of your current storage accounts by enabling Azure Storage metrics](../common/storage-enable-and-view-metrics.md)
- [Check hot, cool, and archive pricing in Blob storage and GPv2 accounts by region](https://azure.microsoft.com/pricing/details/storage/)
- [Check data transfers pricing](https://azure.microsoft.com/pricing/details/data-transfers/)
