---
title: 'Cost estimate: Analyze archived data (Azure Blob Storage)' 
description: This article shows an example of what it costs to retrieve and analyze archived data in Azure Blob Storage.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.date: 06/13/2025
ms.topic: concept-article
ms.author: normesta
---

# Cost estimate: Retrieve data from archive storage for analysis 

This sample estimates the cost to retrieve a portion of data from the archive tier before the 180 day limit.

> [!IMPORTANT]
> This estimate is based on [these sample prices](blob-storage-estimate-costs.md#sample-prices). Sample prices shouldn't be used to calculate your production costs. To find official prices, see [Find the unit price for each meter](../common/storage-plan-manage-costs.md#find-the-unit-price-for-each-meter).

## Scenario

Your company stores 20 TB of data in the archive tier for long term retention. However, after only three months in archive storage, 20% of that data must be retrieved for analysis.  You've been asked to estimate what it will cost to get that data from archive storage and then download that data to clients. 

Because the data is needed only temporarily, you decide not to rehydrate blobs by changing their tier. That way, your company avoids the early deletion fee. You already estimated the cost of that approach by reviewing the [Cost estimate: Move data out of archive storage](cost-estimate-archive-retrieval-set-tier.md) article. Instead, you decide that it's more cost-effective to copy blobs into the hot tier for analysis. You know that data in the hot tier can be deleted at no charge when the analysis is complete. 

The storage account is located in the West US region, is configured for locally-redundant storage (LRS), and does not have hierarchical namespaces.

## Costs

The following table describes each cost.

| Cost | Description |
|----|----|
| **Copy blobs to the hot tier** | First, blobs must be moved out of archive storage for analysis. All tools and SDKs use the [Copy Blob](/rest/api/storageservices/copy-blob) operation to accomplish this task. The [Copy Blob](/rest/api/storageservices/copy-blob) operation is billed as a read operation on the source account and a write operation on the destination account. |
| **Data retrieval fee** | This meter applies to each GB moved from the archive tier and into an online tier such as the hot tier. |
| **Read from the hot tier** | Once data is moved into the hot tier, clients will need to download that data. Each download is billed as a read operation. |

## Estimate

Based on [these sample prices](blob-storage-estimate-costs.md#sample-prices), the following table shows how each cost component is calculated. This sample estimate doesn't include the [cost of data storage](blob-storage-estimate-costs.md#the-cost-to-store-data) which is billed per GB.

| Cost                           | Cost factor                                | Calculation                           | Value       |
|--------------------------------|--------------------------------------------|---------------------------------------|-------------|
| **Copy blobs to the hot tier** | Number of Copy Blob operations             | 2000 blobs * 20%                      | 400         |
|                                | Price of an archive read operation         |                                       | $0.00055    |
|                                | Cost to read from the archive              | 400 operations * $0.00055             | $0.22       |
|                                | Price of a hot tier write operation        |                                       | $0.0000055  |
|                                | Cost to write to the hot tier              | 400 operations * $0.0000055           | $0.0022     |
|                                | **Cost to copy blobs to hot tier**<br><br> | $0.22 + $0.0022                       | **$0.22**   |
| **Data retrieval fee**         | Total file size                            |                                       | 20,000 GB   |
|                                | Data retrieval size                        | 20,000 GB * 20%                       | 4,000       |
|                                | Price of data retrieval (per GB)           |                                       | $0.0220     |
|                                | **Cost to retrieve**<br></br>              | 4,000 blobs * $0.0220                 | **$88.00**  |
| **Read from hot tier**         | Number of read operations on hot tier      | The number of blobs moved to hot tier | 400         |
|                                | Price of a read operation on the hot tier  |                                       | $0.00000044 |
|                                | **Cost to read from hot tier**<br></br>    | 400 operations * $0.00000044          | **$0.0002** |
| **Total cost**                 |                                            | $0.22 + $88 + $24 + $0.0002           | **$88.22**  |

> [!TIP]
> This scenario does not model the amount of time that data exists in the storage, so the table does not include [cost of data storage](blob-storage-estimate-costs.md#the-cost-to-store-data) which is billed per GB. You can estimate the cost storage and the cost of transactions in your environment by using [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

## See also

- [Cost estimate: Move data out of archive storage](cost-estimate-archive-retrieval-set-tier.md)
- [Estimate the cost of archiving data](archive-cost-estimation.md)
- [Estimate the cost of using Azure Blob Storage](blob-storage-estimate-costs.md)
- [Estimate the cost of using AzCopy to transfer blobs](azcopy-cost-estimation.md)
- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
