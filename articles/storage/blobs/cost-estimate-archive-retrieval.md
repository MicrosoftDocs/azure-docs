---
title: 'Cost estimate: Archive & retrieve data (Azure Blob Storage)' 
description: This article shows an example of what it costs to archive and then retrieve data in Azure Blob Storage.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.date: 05/07/2025
ms.topic: concept-article
ms.author: normesta
---

# Cost estimate: Archive and retrieve data in Azure Blob Storage 

This sample estimate shows the cost of to archive data and then retrieve some portion of that data before the 180 day limit.

> [!IMPORTANT]
> These estimates are based on [sample prices](blob-storage-estimate-costs.md#sample-prices). Sample prices shouldn't be used to calculate your production costs. To find official prices, see [Find the unit price for each meter](../common/storage-plan-manage-costs.md#find-the-unit-price-for-each-meter).

## Scenario

In this scenario you upload **2000** blobs to the archive access tier by using the `blob.core.windows.net` storage endpoint. Each blob is **10 GB** in size and is uploaded in **8 MiB** blocks. 

After **3** months, you must rehydrate **20%** of archived data for analysis. You choose to rehydrate data by setting the access tier of these blobs to the hot tier However, because that data is retrieved before 180 days, your assessed an early deletion fee. 

The account is located in the East US region, and is configured for locally-redundant storage (LRS), and hierarchical namespaces are not enabled.

## Estimate

| Cost meter                      | Estimate    |
|---------------------------------|-------------|
| Write operations (archive tier) | $28.18      |
| Read operations (archive tier)  | $0.22       |
| Data retrieval fee              | $88.00      |
| Early deletion fee              | $24.00      |
| Total cost                      | **$140.40** |

This estimate doesn't include the cost of data storage. Storage is billed per GB. See [The cost to store data](blob-storage-estimate-costs.md#the-cost-to-store-data).

## Breakdown

The following table itemizes the cost of write operations on the archive tier.

| Calculation                                                | Value      |
|------------------------------------------------------------|------------|
| PutBlock operations per blob (10 GiB / 8-MiB block)        | 1280       |
| PutBlockList operations per blob                           | 1          |
| Total write operations (2,000 * 1,281)                     | 2,562,000  |
| **Cost of write operations (2,562,000 * operation price)** | **$28.18** |

The following table itemizes the cost of read operations on the archive tier.

| Calculation                                   | Value     |
|-----------------------------------------------|-----------|
| Number of read operations (2000 blobs * 20%)  | 400       |
| **Cost to read (operations * price to read)** | **$0.22** |

The following table itemizes the cost of data retrieval.

| Calculation                                                     | Value      |
|-----------------------------------------------------------------|------------|
| Total file size (GB)                                            | 20,000     |
| Data retrieval size (20% of file size)                          | 4,000      |
| **Cost to retrieve (data retrieval size * price of retrieval)** | **$88.00** |

The following table itemizes the cost early deletion

| Calculation                                                     | Value     |
|-----------------------------------------------------------------|-----------|
| Total file size (GB)                                            | 20,000    |
| Data retrieval size (20% of file size)                          | 4,000     |
| Rough number of months penalty (180 days - 90 days) / 30 days   | 3         |
| **Early deletion penalty (200 * price of archive storage) / 3** | **24.00** |


## Estimate variations

| Factor | Impact |
|---|---|
| Copying blobs to an online tier instead of changing the blob's tier | Adds the cost of write operations on the target tier, but avoids the early deletion penalty. |
| Block size    | Decreases the number of write operations required to upload blobs to the archive tier. |
| Data Lake Storage Gen 2 endpoints | Increases the cost of both uploading and reading data because data is uploaded and read in 4 MiB blocks. |
| Replication setting of the account | The cost of write and read operations is affected by redundancy setting. |

## See also

- [Estimate the cost of archiving data](archive-cost-estimation.md)
- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
