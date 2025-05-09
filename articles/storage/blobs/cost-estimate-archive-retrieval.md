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

This estimate is one of many in a collection of estimates. You can use them to understand how a specific use case is priced. For greater detail, see [Estimate the cost of archiving data](archive-cost-estimation.md).

## Parameters

This sample estimate shows the cost to move **10 TiB** of data into the archive access tier. After **3** months, retrieve **20%** of the data for analysis.

## Estimate

These estimates are based on [sample prices](blob-storage-estimate-costs.md#sample-prices). Sample prices shouldn't be used to calculate your production costs. To find official prices, see [Find the unit price for each meter](../common/storage-plan-manage-costs.md#find-the-unit-price-for-each-meter).

| Cost meter                     | Cost           |
|--------------------------------|----------------|
| Write operation (archive tier) | cost goes here |
| Read operation (archive tier)  | cost goes here |
| Data retrieval fee             | cost goes here |
| Early deletion fee             | cost goes here |
| Write operation (hot tier)     | cost goes here |
| Total cost of this use case    | cost goes here |

> [!NOTE]
> This estimate doesn't include the cost of data storage. Storage is billed per GB. See [The cost to store data](blob-storage-estimate-costs.md#the-cost-to-store-data).

## Breakdown

The following sections show how each line item in the above sample estimate is calculated.

### Write operation (archive tier)

Assuming an **8-MiB** block size, the following table estimates the cost to upload **10 TiB** to the archive tier.

| Price factor                                             | Value          |
|----------------------------------------------------------|----------------|
| Number of MiB in 10 TiB                                   | 10,485,760          |
| Write operations per blob (10,485,760 MiB / 8-MiB block)      | 1,310,720            |
| Write operation to commit the blocks                     | 1              |
| **Total write operations (1,000 * 641)**                   | 641,000        |
| Price of a single write operation (price / 10,000)       | $0.0000055     |
| **Cost of write operations (641,000 * price of a single operation)** | **$3.5255**    |
| **Total cost (write + properties)**                      | **$3.5250055** |


| Price factor                                                            | Calculation |
|-------------------------------------------------------------------------|-------------|
| Number of write operations to the archive tier (10 TiB / 8 MiB blocks)  | 1,310,720   |
| Cost to write 10 TB of data to the archive tier ($0.000011 * 1,310,720) | $14.42      |

### Read operation (archive tier)

Here's how the read operation cost breaks down.

| Price factor | Calculation |
|--------------|-------------|
| Factor       | number      |
| Factor       | number      |

### Data retrieval fee

Here's how the read operation cost breaks down.

| Price factor | Calculation |
|--------------|-------------|
| Factor       | number      |
| Factor       | number      |

### Early deletion fee

Here's how the read operation cost breaks down.

| Price factor | Calculation |
|--------------|-------------|
| Factor       | number      |
| Factor       | number      |

### Write operation (hot tier)

Here's how the read operation cost breaks down.

| Price factor | Calculation |
|--------------|-------------|
| Factor       | number      |
| Factor       | number      |

## Other factors

Here some other factor that can influence this estimate

| Factor | Impact |
|---|---|
| Block size    | |
| Data Lake Storage Gen 2 endpoints | Cost of read and write operations |
| The tier to which data is rehydrated | Cost of the write operations |
| Replication setting of the account | Cost of the write operations |

## See also

- [Estimate the cost of archiving data](archive-cost-estimation.md)
- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
