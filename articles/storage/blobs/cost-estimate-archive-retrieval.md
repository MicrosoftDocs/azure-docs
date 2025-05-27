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

This sample estimates the cost to retrieve a portion of data from the archive tier before the 180 day limit.

> [!IMPORTANT]
> This estimate is based on [these sample prices](blob-storage-estimate-costs.md#sample-prices). Sample prices shouldn't be used to calculate your production costs. To find official prices, see [Find the unit price for each meter](../common/storage-plan-manage-costs.md#find-the-unit-price-for-each-meter).

## Scenario

Your company has stored 20 TB of data in the archive tier for long term retention. However, after only 3 months in archive storage, 20% of that data must be retrieved for analysis. You've been asked to estimate what it will cost to get that data from archive storage and then download that data to clients for analysis. The account is located in the West US region, and is configured for locally-redundant storage (LRS), and hierarchical namespaces are not enabled.

## Cost factors

To analyze this data, you must first rehydrate data from the archive tier to the hot tier. You can accomplish this by changing the access tier of all blobs needed for analysis. Changing the tier from archive to hot is billed as a **read operation on the archive tier**. 

Moving data out of archive storage also incurs a **data retrieval fee** and because that data is retrieved before 180 days, you'll also be assessed an **early deletion fee**. 

Once data is moved into the hot tier, clients will need to read that data. Each blob read incurs a **read operation on the hot tier**. Aside from these cost components, rehydration time at standard priority can take up to 15 hours to complete.

## Estimate

Based on [these sample prices](blob-storage-estimate-costs.md#sample-prices), the following table shows how each cost component is calculated. This sample estimate doesn't include the [cost of data storage](blob-storage-estimate-costs.md#the-cost-to-store-data) which is billed per GB.

| Cost component         | Cost factor                                   | Calculation                           | Value       |
|------------------------|-----------------------------------------------|---------------------------------------|-------------|
| **Change tier to hot** | Number of SetBlobTier operations              | 2000 blobs * 20%                      | 400         |
|                        | Price of a SetBlobTier operation              | Taken from sample prices              | $0.00055    |
|                        | Cost to change tier to hot<br></br>           | 400 operations * $0.00055             | **$0.22**   |
| **Data retrieval fee** | Total file size                               | 20 TB                                 | 20,000 GB   |
|                        | Data retrieval size                           | 20,000 GB * 20%                       | 4,000       |
|                        | Price of data retrieval (per GB)              | Taken from sample prices              | $0.0220     |
|                        | Cost to retrieve data<br></br>                | 4,000 blobs * $0.0220                 | **$88.00**  |
| **Early deletion fee** | Rough number of months penalty                | (180 days - 90 days) / 30 days        | 3           |
|                        | Price per month of archive storage (per GB)   | Taken from sample prices              | $0.0020     |
|                        | Cost of early deletion<br></br>               | (4000 blobs * $0.0020) * 3            | **$24.00**  |
| **Read from hot tier** | Number of read operations on hot tier         | The number of blobs moved to hot tier | 400         |
|                        | Price of a read operation on the hot tier     | Taken from sample prices              | $0.00000044 |
|                        | Cost to read blobs from the hot tier<br></br> | 400 operations * $0.00000044          | $0.0002     |
| **Total cost**         |                                               |                                       | **$112.22** |

> [!TIP]
> You can estimate the cost of these components in your environment by using [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) .

## See also

- [Estimate the cost of archiving data](archive-cost-estimation.md)
- [Estimate the cost of using Azure Blob Storage](blob-storage-estimate-costs.md)
- [Estimate the cost of using AzCopy to transfer blobs](azcopy-cost-estimation.md)
- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
