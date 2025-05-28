---
title: 'Cost estimate: Multiregion data access (Azure Blob Storage)' 
description: This article provides a sample estimate of what it might cost to ingest and access data in Azure Blob Storage from multiple Azure regions. 
services: storage
author: normesta

ms.service: azure-blob-storage
ms.date: 05/28/2025
ms.topic: concept-article
ms.author: normesta
---

# Cost estimate: Upload and access data from multiple regions 

This sample estimates the cost to upload and download data from multiple Azure regions.

> [!IMPORTANT]
> This estimate is based on [these sample prices](blob-storage-estimate-costs.md#sample-prices). Sample prices shouldn't be used to calculate your production costs. To find official prices, see [Find the unit price for each meter](../common/storage-plan-manage-costs.md#find-the-unit-price-for-each-meter).

## Scenario

Your company has a storage account that is located in the West US region, is configured for Geo-redundant storage (GRS) and does not have hierarchical namespaces enabled. This year, a new client application is being distributed to users located in multiple Azure regions across the continent. Users are distributed across the continent and will upload log files and download them for diagnostic analysis. Files are stored as blobs in the hot access tier. Based on expected usage patterns, you've been asked to create a rough estimate of costs.

## Costs

The clients will generate and upload an estimated **50,000** log files (roughly 1 GB each in size) this quarter. During this time, your company estimates that client applications will download about half of those log files for diagnostic analysis. You've been asked to create an estimate.

| Cost component | Explanation |
|----|----|
| **Cost to write** | Based on your estimates for this quarter, clients will upload an estimated **50,000** log files (roughly **1 GB** each in size). Clients are configured to upload those log files in 8 MiB blocks. Each block uploaded is billed as a write operation on the hot tier. A final operation is used by the clients to commit those blocks. That operation is also billed as a write operation. A smaller block size is very performant, but you know that a larger block size results in fewer write operations so you plan to include that suggestion along with your estimate. |
| **Cost of replication** | Because the account is configured for Geo-redundant storage, all blobs uploaded are replicated to a secondary region. This replication process adds a data transfer fee and a network bandwidth fee. This fee is charged per GB.|
| **Cost to read** | Any blob that is downloaded for diagnostic analysis is billed as a read operation on the hot tier. You believe that client applications will download about half of the files uploaded for diagnostic analysis. You also learn that **75%** of client applications are not located in the same region as the storage account so downloads from those clients incur a data transfer fee and a network bandwidth fee. |

## Estimate

Based on [these sample prices](blob-storage-estimate-costs.md#sample-prices), the following table shows how each cost component is calculated. This sample estimate doesn't include the [cost of data storage](blob-storage-estimate-costs.md#the-cost-to-store-data) which is billed per GB.

| Cost                    | Cost factor                                   | Calculation                      | Value       |
|-------------------------|-----------------------------------------------|----------------------------------|-------------|
| **Cost to write**       | PutBlock operations per blob                  | 1 GiB / 8-MiB block              | 155         |
|                         | PutBlockList operations per blob              | 1 per blob                       | 1           |
|                         | Price of a write operation on the hot tier    |                                  | $0.000021   |
|                         | Cost to upload log files<br></br>             | (50,000 blobs * 156) * $0.000021 | **$163.80** |
| **Cost of replication** | Price of data transfer (per GB)               |                                  | $0.02       |
|                         | Data transfer fee                             | 50,000 GB * $0.02                | $1,000.00   |
|                         | Price of network bandwidth (per GB)           |                                  | $0.02       |
|                         | Network bandwidth fee                         | 50,000 GB * $0.02$               | $1,000.00   |
|                         | Cost to replicate<br></br>                    | $1,000 + $1,000                  | **$2,000**  |
| **Cost to read**        | Number of read operations                     | 50,000 / 2                       | 25,000      |
|                         | Price a read operation on the hot tier        |                                  | $0.00440    |
|                         | Cost of read operations<br></br>              | 25,000 GB * $0.00440             | **$110.00** |
|                         | Number of blobs downloaded from other regions | 25,000 * 75%                     | 1875        |
|                         | Data transfer fee                             | 1875 * $0.02                     | $375.00     |
|                         | Network bandwidth fee                         | 1875 * $0.02                     | $375.00     |
|                         | Cost to transfer data out of region<br></br>  | $375 + $375                      | **$750.00** |
| **Total cost**          |                                               | $163.80 + $2,000 + $110 + $750   | **860.00**  |

> [!TIP]
> You can estimate the cost of these components in your environment by using [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) 

## See also

- [Estimate the cost of using Azure Blob Storage](blob-storage-estimate-costs.md)
- [Estimate the cost of using AzCopy to transfer blobs](azcopy-cost-estimation.md)
- [Estimate the cost of archiving data](archive-cost-estimation.md)
- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
