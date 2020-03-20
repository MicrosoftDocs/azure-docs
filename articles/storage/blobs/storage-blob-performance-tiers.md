---
title: Block blob storage performance tiers — Azure Storage
description: Discusses the difference between premium and standard performance tiers for Azure block blob storage.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 11/12/2019
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
ms.reviewer: clausjor
---

# Performance tiers for block blob storage

As enterprises deploy performance sensitive cloud-native applications, it's important to have options for cost-effective data storage at different performance levels.

Azure block blob storage offers two different performance tiers:

- **Premium**: optimized for high transaction rates and single-digit consistent storage latency
- **Standard**: optimized for high capacity and high throughput

The following considerations apply to the different performance tiers:

| Area |Standard performance  |Premium performance  |
|---------|---------|---------|
|Region availability     |   All  regions      | In [select regions](https://azure.microsoft.com/global-infrastructure/services/?products=storage)       |
|Supported [storage account types](../common/storage-account-overview.md#types-of-storage-accounts)     |     General purpose v2, BlobStorage, General purpose v1    |    BlockBlobStorage     |
|Supports [high throughput block blobs](https://azure.microsoft.com/blog/high-throughput-with-azure-blob-storage/)     |    Yes, at greater than 4 MiB PutBlock or PutBlob sizes     |    Yes, at greater than 256 KiB PutBlock or PutBlob sizes    |
|Redundancy     |     See [Types of storage accounts](../common/storage-account-overview.md#types-of-storage-accounts)   |  Currently supports only locally-redundant storage (LRS) and zone-redudant storage (ZRS)<div role="complementary" aria-labelledby="zone-redundant-storage"><sup>1</sup></div>     |

<div id="zone-redundant-storage"><sup>1</sup>Zone-redundant storage (ZRS) is available in select regions for premium performance block blob storage accounts.</div>

Regarding cost, premium performance provides optimized pricing for applications with high transaction rates to help [lower total storage cost](https://azure.microsoft.com/blog/reducing-overall-storage-costs-with-azure-premium-blob-storage/) for these workloads.

## Premium performance

Premium performance block blob storage makes data available via high-performance hardware. Data is stored on solid-state drives (SSDs) which are optimized for low latency. SSDs provide higher throughput compared to traditional hard drives.

Premium performance storage is ideal for workloads that require fast and consistent response times. It's best for workloads that perform many small transactions. Example workloads include:

- **Interactive workloads**. These workloads require instant updates and user feedback, such as e-commerce and mapping applications. For example, in an e-commerce application, less frequently viewed items are likely not cached. However, they must be instantly displayed to the customer on demand.

- **Analytics**. In an IoT scenario, lots of smaller write operations might be pushed to the cloud every second. Large amounts of data might be taken in, aggregated for analysis purposes, and then deleted almost immediately. The high ingestion capabilities of premium block blob storage make it efficient for this type of workload.

- **Artificial intelligence/machine learning (AI/ML)**. AI/ML deals with the consumption and processing of different data types like visuals, speech, and text. This high-performance computing type of workload deals with large amounts of data that requires rapid response and efficient ingestion times for data analysis.

- **Data transformation**. Processes that require constant editing, modification, and conversion of data require instant updates. For accurate data representation, consumers of this data must see these changes reflected immediately.

## Standard performance

Standard performance supports different [access tiers](storage-blob-storage-tiers.md) to store data in the most cost-effective manner. It's optimized for high capacity and high throughput on large data sets.

- **Backup and disaster recovery datasets**. Standard performance storage offers cost-efficient tiers, making it a perfect use case for both short-term and long-term disaster recovery datasets, secondary backups, and compliance data archiving.

- **Media content**. Images and videos often are accessed frequently when first created and stored, but this content type is used less often as it gets older. Standard performance storage offers suitable tiers for media content needs. 

- **Bulk data processing**. These kinds of workloads are suitable for standard storage because they require cost-effective high-throughput storage instead of consistent low latency. Large, raw datasets are staged for processing and eventually migrate to cooler tiers.

## Migrate from standard to premium

You can't convert an existing standard performance storage account to a block blob storage account with premium performance. To migrate to a premium performance storage account, you must create a BlockBlobStorage account, and migrate the data to the new account. For more information, see [Create a BlockBlobStorage account](storage-blob-create-account-block-blob.md).

To copy blobs between storage accounts, you can use the latest version of the [AzCopy](../common/storage-use-azcopy-blobs.md) command-line tool. Other tools such as Azure Data Factory are also available for data movement and transformation.

## Blob lifecycle management

Blob storage lifecycle management offers a rich, rule-based policy:

- **Premium**: Expire data at the end of its lifecycle.
- **Standard**: Transition data to the best access tier and expire data at the end of its lifecycle.

To learn more, see [Manage the Azure Blob storage lifecycle](storage-lifecycle-management-concepts.md).

You can't move data that's stored in a premium block blob storage account between hot, cool, and archive tiers. However, you can copy blobs from a block blob storage account to the hot access tier in a *different* account. To copy data to a different account, use the [Put Block From URL](/rest/api/storageservices/put-block-from-url) API or [AzCopy v10](../common/storage-use-azcopy-v10.md). The **Put Block From URL** API synchronously copies data on the server. The call completes only after all the data is moved from the original server location to the destination location.

## Next steps

Evaluate hot, cool, and archive in GPv2 and Blob storage accounts.

- [Learn about rehydrating blob data from the archive tier](storage-blob-rehydration.md)
- [Evaluate usage of your current storage accounts by enabling Azure Storage metrics](../common/storage-enable-and-view-metrics.md)
- [Check hot, cool, and archive pricing in Blob storage and GPv2 accounts by region](https://azure.microsoft.com/pricing/details/storage/)
- [Check data transfers pricing](https://azure.microsoft.com/pricing/details/data-transfers/)
