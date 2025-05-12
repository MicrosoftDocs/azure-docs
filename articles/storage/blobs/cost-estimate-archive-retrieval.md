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

This sample estimate shows the cost of to archive data and then retrieve that data before the 180 day limit.

> [!IMPORTANT]
> These estimates are based on [sample prices](blob-storage-estimate-costs.md#sample-prices). Sample prices shouldn't be used to calculate your production costs. To find official prices, see [Find the unit price for each meter](../common/storage-plan-manage-costs.md#find-the-unit-price-for-each-meter).

## Scenario

Your workload uploads **2000** blobs to the archive access tier by using the `blob.core.windows.net` storage endpoint. Each blob is **10 GB** in size and is uploaded in **8 MiB** blocks. After **3** months, clients retrieve **20%** of the data for analysis. Because that data is retrieved before 180 days, your assessed an early deletion fee. The account is located in the East US region, and is configured for geo-redundant storage (GRS). Hierarchical namespaces are not enabled on this account.

## Estimate

Using sample pricing, the following table estimates the cost of this scenario.

| Cost meter                           | Estimate           |
|--------------------------------------|--------------------|
| Write operations on the archive tier | $28.18             |
| Read operations on the archive tier  | $0.22              |
| Data retrieval fee                   | $22.00             |
| Early deletion fee                   | cost goes here     |
| Write operations on the hot tier     | cost goes here     |
| **Total cost of this use case**      | **cost goes here** |

> [!NOTE]
> This estimate doesn't include the cost of data storage. Storage is billed per GB. See [The cost to store data](blob-storage-estimate-costs.md#the-cost-to-store-data).

## Breakdown

The following sections show how each line item in the above sample estimate is calculated.

### Write operations on the archive tier

| Calculation                                                | Value      |
|------------------------------------------------------------|------------|
| PutBlock operations per blob (10 GiB / 8-MiB block)        | 1280       |
| PutBlockList operations per blob                           | 1          |
| Total write operations (2,000 * 1,281)                     | 2,562,000  |
| **Cost of write operations (2,562,000 * operation price)** | **$28.18** |

### Read operations on the archive tier

| Cost factor                                   | Value     |
|-----------------------------------------------|-----------|
| Number of read operations (2000 blobs * 20%)  | 400       |
| **Cost to read (operations * price to read)** | **$0.22** |

### Data retrieval fee

| Cost factor                                                     | Value      |
|-----------------------------------------------------------------|------------|
| Total file size (GB)                                            | 20,000     |
| Data retrieval size (20% of file size)                          | 200        |
| **Cost to retrieve (data retrieval size * price of retrieval)** | **$22.00** |

### Early deletion fee

Here's how the read operation cost breaks down.

| Price factor | Calculation |
|--------------|-------------|
| Factor       | number      |
| Factor       | number      |

### Write operations on the hot tier

Here's how the read operation cost breaks down.

| Price factor | Calculation |
|--------------|-------------|
| Factor       | number      |
| Factor       | number      |

## Estimate variations

Here some other factor that can influence this estimate

| Factor | Impact |
|---|---|
| Block size    | |
| Data Lake Storage Gen 2 endpoints | Cost of read and write operations |
| The tier to which data is rehydrated | Cost of the write operations |
| Replication setting of the account | Cost of the write operations |

Perhaps a table with other variations

## See also

- [Estimate the cost of archiving data](archive-cost-estimation.md)
- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
