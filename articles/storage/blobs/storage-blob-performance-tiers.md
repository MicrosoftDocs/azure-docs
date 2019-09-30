---
title: Azure Blob storage performance tiers - Azure Storage
description: Performance tiers for Azure blob storage.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 09/30/2019
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
ms.reviewer: clausjor
---

# Azure Blob storage performance tiers

As enterprises deploy performance sensitive cloud-native applications, it's important to have options for cost-effective data storage with different performance options.

Azure blob storage offers two different performance tiers:

- Premium: optimized for high transaction rates and single-digit consistent storage latency
- Standard: optimized for high capacity and high throughput

The following considerations apply to the different performance tiers:

- Standard performance is available in all [Azure regions](https://azure.microsoft.com/global-infrastructure/services/?products=storage)- Premium performance is available in select regions.
- Premium performance provides optimized pricing for applications with high transaction rates to help [lower total storage cost](https://azure.microsoft.com/blog/reducing-overall-storage-costs-with-azure-premium-blob-storage/) for these workloads.
- Premium performance requires using block blob storage accounts, which support block blob and append blob. Standard performance is available with general purpose v1, general purpose v2, and Blob storage accounts.
- Data can't be tiered between block blob storage accounts and general purpose v2 storage accounts.
- Premium and standard performance both support High Throughput block blobs. High Throughput block blobs are available for premium performance at greater than 256 KiB. High Throughput block blobs are available for standard performance at greater than 4 MiB Put Block or Put Blob sizes.
- Premium performance is currently available with locally redundant storage (LRS) only.

## Premium performance

Premium performance block blob storage makes data available via high-performance hardware. Data is stored on solid-state drives (SSDs) which are optimized for low latency. SSDs provide higher throughput compared to traditional hard drives.

Premium performance block blob storage is ideal for workloads that require fast and consistent response times. It's best for workloads that perform many small transactions. Example workloads include:

- Interactive editing of video, maps, and so on
- On-demand analytics and reporting
- Financial and Insurance modeling
- [Distributed training of deep learning models](https://docs.microsoft.com/azure/architecture/reference-architectures/ai/training-deep-learning)
- Static web content
- Telemetry and debug data
- Data transformation

Premium performance is only available via the block blob storage account type. It doesn't support tiering between hot, cool, or archive access tiers.

## Standard performance

Standard performance supports different [access tiers](storage-blob-storage-tiers.md) to store data in the most cost-effective manner. It's optimized for high capacity and high throughput on large data sets. Example workloads include:

- Backup and archive data
- High-performance computing (HPC) data

## Blob lifecycle management

Blob Storage lifecycle management offers a rich, rule-based policy:

- Premium - expire data at the end of its lifecycle
- Standard - transition data to the best access tier and expire data at the end of its lifecycle

See [Manage the Azure Blob storage lifecycle](storage-lifecycle-management-concepts.md) to learn more.

Data that's stored in a premium block blob storage account can't be moved between hot, cool, and archive tiers. However, you can copy blobs from a block blob storage account to the hot access tier in a *different* account. Use the [Put Block From URL](/rest/api/storageservices/put-block-from-url) API or [AzCopy v10](../common/storage-use-azcopy-v10.md) to copy data to a different account. The **Put Block From URL** API synchronously copies data on the server. The call completes only once all the data is moved from the original server location to the destination location.

## Next steps

Evaluate hot, cool, and archive in GPv2 and Blob storage accounts

- [Check availability of hot, cool, and archive by region](https://azure.microsoft.com/regions/#services)
- [Manage the Azure Blob storage lifecycle](storage-lifecycle-management-concepts.md)
- [Learn about rehydrating blob data from the archive tier](storage-blob-rehydration.md)
- [Evaluate usage of your current storage accounts by enabling Azure Storage metrics](../common/storage-enable-and-view-metrics.md)
- [Check hot, cool, and archive pricing in Blob storage and GPv2 accounts by region](https://azure.microsoft.com/pricing/details/storage/)
- [Check data transfers pricing](https://azure.microsoft.com/pricing/details/data-transfers/)
