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

These estimates are based on [sample prices](blob-storage-estimate-costs.md#sample-prices). Sample prices shouldn't be used to calculate your production costs. To find official prices, see [Find the unit price for each meter](../common/storage-plan-manage-costs.md#find-the-unit-price-for-each-meter).

## Parameters

This sample estimate shows the cost to move **1000** blobs that are each **10 GB** in size into the archive access tier. After **3** months, **20%** of the data is retrieved for analysis. 

The estimate assumes the following account configuration:

| Configuration            | Value                           |
|--------------------------|---------------------------------|
| Namespace type           | Flat                            |
| Storage account endpoint | blob.core.windows.net           |
| Redundancy configuration | Locally-redundant storage (LRS) |
| Region                   | East US                         |
| Block size configuration | 8-MiB                           |

## Estimate

| Cost meter                      | Estimate           |
|---------------------------------|--------------------|
| Write operations (archive tier) | $7.05              |
| Read operations (archive tier)  | cost goes here     |
| Data retrieval fee              | cost goes here     |
| Early deletion fee              | cost goes here     |
| Write operations (hot tier)     | cost goes here     |
| **Total cost of this use case** | **cost goes here** |

> [!NOTE]
> This estimate doesn't include the cost of data storage. Storage is billed per GB. See [The cost to store data](blob-storage-estimate-costs.md#the-cost-to-store-data).

## Breakdown

The following sections show how each line item in the above sample estimate is calculated.

### Write operations (archive tier)

The following table estimates the total number of write operations required to write blobs to the archive tier.

| Calculation                                            | Value         |
|--------------------------------------------------------|---------------|
| Number of MiB in 10 GiB                                | 10,240        |
| PutBlock operations per blob (5,120 MiB / 8-MiB block) | 1,280         |
| PutBlockList operations per blob                       | 1             |
| **Total write operations (1,000 * 1,281)**             | **1,281,000** |

The following table calculates the cost.

| Price factor                                               | Archive     |
|------------------------------------------------------------|-------------|
| Price of a single write operation (price / 10,000)         | $0.0000110  |
| Cost of write operations (1,281,000 * operation price)     | $7.0510     |
| Price of a single other operation (price / 10,000)         | $0.00000044 |
| Cost to get blob properties (1000 * other operation price) | $0.00044    |
| **Total cost (write + properties)**                        | **$7.05**   |

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
