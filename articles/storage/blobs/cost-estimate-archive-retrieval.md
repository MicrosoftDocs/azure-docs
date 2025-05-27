---
title: 'Cost estimate: Early retrieval from archive (Azure Blob Storage)' 
description: This article shows an example of what it costs to archive and then retrieve data in Azure Blob Storage.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.date: 05/27/2025
ms.topic: concept-article
ms.author: normesta
---

# Cost estimate: Early data retrieval from archive 

This sample estimates the cost to archive data and then retrieve some portion of that data before the 180 day limit.

> [!IMPORTANT]
> This estimate is based on [these sample prices](blob-storage-estimate-costs.md#sample-prices). Sample prices shouldn't be used to calculate your production costs. To find official prices, see [Find the unit price for each meter](../common/storage-plan-manage-costs.md#find-the-unit-price-for-each-meter).

## Scenario

In this scenario you upload **2000** blobs to the archive access tier by using the `blob.core.windows.net` storage endpoint. Each blob is **10 GB** in size and is uploaded in **8 MiB** blocks. 

After **3** months, you must rehydrate **20%** of archived data for analysis. You choose to rehydrate data by setting the access tier of these blobs to the hot tier However, because that data is retrieved before 180 days, your assessed an early deletion fee. 

The account is located in the West US region, and is configured for locally-redundant storage (LRS), and hierarchical namespaces are not enabled.

## Estimate

Based on [these sample prices](blob-storage-estimate-costs.md#sample-prices), the following table shows how each cost component is calculated.

| Cost component     | Cost factor                                   | Calculation                           | Value       |
|--------------------|-----------------------------------------------|---------------------------------------|-------------|
| Change tier to hot | Number of SetBlobTier operations              | 2000 blobs * 20%                      | 400         |
|                    | Price of a SetBlobTier operation              | Taken from sample prices              | $0.00055    |
|                    | Cost to change tier to hot<br></br>           | 400 operations * $0.00055             | **$0.22**   |
| Data retrieval fee | Total file size                               | 20 TB                                 | 20,000 GB   |
|                    | Data retrieval size                           | 20,000 GB * 20%                       | 4,000       |
|                    | Price of data retrieval (per GB)              | Taken from sample prices              | $0.0220     |
|                    | Cost to retrieve data<br></br>                | 4,000 blobs * $0.0220                 | **$88.00**  |
| Early deletion fee | Rough number of months penalty                | (180 days - 90 days) / 30 days        | 3           |
|                    | Price per month of archive storage (per GB)   | Taken from sample prices              | $0.0020     |
|                    | Cost of early deletion<br></br>               | (4000 blobs * $0.0020) * 3            | **$24.00**  |
| Read from hot tier | Number of read operations on hot tier         | The number of blobs moved to hot tier | 400         |
|                    | Price of a read operation on the hot tier     | Taken from sample prices              | $0.00000044 |
|                    | Cost to read blobs from the hot tier<br></br> | 400 operations * $0.00000044          | $0.0002     |
| **Total cost**     |                                               |                                       | **112.22**  |

This sample estimate doesn't include the [cost of data storage](blob-storage-estimate-costs.md#the-cost-to-store-data) which is billed per GB.

## See also

- [Estimate the cost of archiving data](archive-cost-estimation.md)
- [Estimate the cost of using Azure Blob Storage](blob-storage-estimate-costs.md)
- [Estimate the cost of using AzCopy to transfer blobs](azcopy-cost-estimation.md)
- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
