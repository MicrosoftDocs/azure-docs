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

## Scenario

Move 10 TiB of data into the archive tier for long-term retention. After 3 months, retrieve 20% of the data for analysis.

## Estimate

All calculations are based on these [sample prices](blob-storage-estimate-costs.md#sample-prices). These prices are meant only as examples, and shouldn't be used to calculate your production costs. To find official prices, see [Find the unit price for each meter](../common/storage-plan-manage-costs.md#find-the-unit-price-for-each-meter).

| Cost meter                     | Cost           |
|--------------------------------|----------------|
| Write operation (archive tier) | cost goes here |
| Read operation (archive tier)  | cost goes here |
| Data retrieval fee             | cost goes here |
| Early deletion fee             | cost goes here |
| Write operation (hot tier)     | cost goes here |
| Total cost                     | cost goes here |

> [!NOTE]
> This estimate includes only the cost to move data not the cost to store data. Data movement is the source of most confusion. To learn more about how storage is billed, see [The cost to store data](blob-storage-estimate-costs.md#the-cost-to-store-data).

## Breakdown

Here is a bit more detail about each line item in this estimate.

### Write operation (archive tier)

Here's how the write operation cost breaks down.

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
| Data Lake Storage Gen 2 endpoints | Impact |
| The tier to which data is rehydrated | Impact |
| Replication setting of the account | Impact |
| Object replication enabled | Impact |

## See also

- [Estimate the cost of archiving data](archive-cost-estimation.md)
- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
