---
title: 'Cost estimate: Move data from archive (Azure Blob Storage)' 
description: This article shows an example of what it costs to move data out of archive storage.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.date: 06/13/2025
ms.topic: concept-article
ms.author: normesta
# Customer intent: As a data administrator, I want to estimate the costs associated with moving data from archive storage to hot storage, so that I can manage my budget and ensure compliance with storage policies.
---

# Cost estimate: Move data out of archive storage 

This sample estimates the cost to move a portion of data from the archive tier to the hot tier before the 180 day limit.

> [!IMPORTANT]
> This estimate is based on [these sample prices](blob-storage-estimate-costs.md#sample-prices). Sample prices shouldn't be used to calculate your production costs. To find official prices, see [Find the unit price for each meter](../common/storage-plan-manage-costs.md#find-the-unit-price-for-each-meter).

## Scenario

Your company stores 20 TB of data in the archive tier for long term retention. However, after only three months in archive storage, 20% of that data must be moved back to the hot tier. You are asked to estimate the cost to get that data from archive storage.

The storage account is located in the West US region, is configured for locally-redundant storage (LRS), and doesn't have hierarchical namespaces.

## Costs

The following table describes each cost.

| Cost | Description |
|----|----|
| **Change tier to hot** | First, blobs must be moved out of archive storage. To do this, administrators change the tier of each blob from `archive` to `hot`. All tools and SDKs use the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation to accomplish this task. That operation is billed as a read operation on the archive tier. |
| **Data retrieval fee** | This meter applies to each GB moved from the archive tier and into an online tier such as the hot tier. |
| **Early deletion fee** | If data is moved out of the archive tier before 180 days have transpired, a prorated early deletion fee is applied to the bill. |

## Estimate

Based on [these sample prices](blob-storage-estimate-costs.md#sample-prices), the following table shows how each cost component is calculated. 

| Cost                   | Cost factor                                 | Calculation                    | Value       |
|------------------------|---------------------------------------------|--------------------------------|-------------|
| **Change tier to hot** | Number of Set Blob Tier operations          | 2000 blobs * 20%               | 400         |
|                        | Price of an archive read operation          |                                | $0.00055    |
|                        | **Cost to change tier to hot**<br></br>     | 400 operations * $0.00055      | **$0.22**   |
| **Data retrieval fee** | Total file size                             |                                | 20,000 GB   |
|                        | Data retrieval size                         | 20,000 GB * 20%                | 4,000       |
|                        | Price of data retrieval (per GB)            |                                | $0.0220     |
|                        | **Cost to retrieve**<br></br>               | 4,000 blobs * $0.0220          | **$88.00**  |
| **Early deletion fee** | Rough number of months penalty              | (180 days - 90 days) / 30 days | 3           |
|                        | Price per month of archive storage (per GB) |                                | $0.0020     |
|                        | **Cost of early deletion**<br></br>         | (4,000 blobs * $0.0020) * 3     | **$24.00**  |
| **Total cost**         |                                             | $0.22 + $88 + $24              | **$112.22** |

> [!TIP]
> This scenario doesn't model the amount of time that data exists in storage, so the table doesn't include [cost of data storage](blob-storage-estimate-costs.md#the-cost-to-store-data) which is billed per GB. You can estimate the cost storage and the cost of transactions in your environment by using [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

## See also

- [Cost estimate: Retrieve data from archive storage for analysis](cost-estimate-archive-retrieval-copy-blob.md)
- [Estimate the cost of archiving data](archive-cost-estimation.md)
- [Estimate the cost of using Azure Blob Storage](blob-storage-estimate-costs.md)
- [Estimate the cost of using AzCopy to transfer blobs](azcopy-cost-estimation.md)
- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
