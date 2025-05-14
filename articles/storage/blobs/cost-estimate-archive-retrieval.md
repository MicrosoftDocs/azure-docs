---
title: 'Cost estimate: Archival & retrieval (Azure Blob Storage)' 
description: This article shows an example of what it costs to archive and then retrieve data in Azure Blob Storage.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.date: 05/07/2025
ms.topic: concept-article
ms.author: normesta
---

# Cost estimate: Large-scale data archival and retrieval 

This sample estimate shows the cost of to archive data and then retrieve some portion of that data before the 180 day limit.

> [!IMPORTANT]
> This estimate is based on [these sample prices](blob-storage-estimate-costs.md#sample-prices). Sample prices shouldn't be used to calculate your production costs. To find official prices, see [Find the unit price for each meter](../common/storage-plan-manage-costs.md#find-the-unit-price-for-each-meter).

## Scenario

In this scenario you upload **2000** blobs to the archive access tier by using the `blob.core.windows.net` storage endpoint. Each blob is **10 GB** in size and is uploaded in **8 MiB** blocks. 

After **3** months, you must rehydrate **20%** of archived data for analysis. You choose to rehydrate data by setting the access tier of these blobs to the hot tier However, because that data is retrieved before 180 days, your assessed an early deletion fee. 

The account is located in the East US region, and is configured for locally-redundant storage (LRS), and hierarchical namespaces are not enabled.

## Estimate

The following table shows the sample estimate at a glance. 

| Cost component               | Estimate    |
|--------------------------|-------------|
| Cost of write operations | $28.18      |
| Cost of read operations  | $0.22       |
| Data retrieval fee       | $88.00      |
| Early deletion penalty   | $24.00      |
| **Total cost**           | **$140.40** |

This sample estimate doesn't include the [cost of data storage](blob-storage-estimate-costs.md#the-cost-to-store-data) which is billed per GB.

## Breakdown

The following table shows how each cost component is calculated.

| Cost factor                      | Calculation                                   | Value      |
|----------------------------------|-----------------------------------------------|------------|
| PutBlock operations per blob     | 10 GiB / 8-MiB block                          | 1280       |
| PutBlockList operations per blob | 1 per blob                                    | 1          |
| **Cost of write operations**     | (2,000 blobs * 1,281) * write operation price | **$28.18** |
| SetBlobTier operations           | 2000 blobs * 20%                              | 400        |
| **Cost of read operations**      | 400 operations * read operation price         | **$0.22**  |
| Total file size (GB)             |                                               | 20,000     |
| Data retrieval size              | 20,000 GB * 20%                               | 4,000      |
| **Data retrieval fee**           | 4,000 blobs * price of data retrieval         | **$88.00** |
| Rough number of months penalty   | (180 days - 90 days) / 30 days                | 3          |
| **Early deletion penalty**       | 4000 blobs * price of archive storage / 3     | **$24.00** |

## Factors that can impact the cost

The following table describes factors that can impact the cost of this scenario. 

| Factor | Impact | Learn more |
|---|---|----|
| Copying blobs instead of changing their tier | Adds a cost to write to the target tier, but avoids the early deletion penalty.| [Blob rehydration from the archive tier](archive-rehydrate-overview.md) |
| Block size    | Larger block size reduces the number of write operations required to upload data. | [The cost to upload data](blob-storage-estimate-costs.md) |
| Uploading data by using the Data Lake Storage endpoint | Smaller fixed block sizes of 4 MiB increases the number of write operations. | [Cost of uploading to the Data Lake Storage endpoint](azcopy-cost-estimation.md#cost-of-uploading-to-the-data-lake-storage-endpoint) |
| Redundancy configuration of the account | Storage redundancy configuration impacts the cost of certain operations. | [Azure Storage redundancy](../common/storage-redundancy.md) | 

## See also

- [Estimate the cost of archiving data](archive-cost-estimation.md)
- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
