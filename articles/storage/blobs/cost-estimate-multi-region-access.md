---
title: 'Cost estimate: Cross region data access (Azure Blob Storage)' 
description: This article provides a sample estimate of what it might cost to ingest and access data in Azure Blob Storage from multiple Azure regions. 
services: storage
author: normesta

ms.service: azure-blob-storage
ms.date: 05/29/2025
ms.topic: concept-article
ms.author: normesta
---

# Cost estimate: Upload and access data from multiple regions 

This sample estimates the cost to upload and download data from multiple Azure regions.

> [!IMPORTANT]
> This estimate is based on [these sample prices](blob-storage-estimate-costs.md#sample-prices). Sample prices shouldn't be used to calculate your production costs. To find official prices, see [Find the unit price for each meter](../common/storage-plan-manage-costs.md#find-the-unit-price-for-each-meter).

## Scenario

Your company plans to distribute a new client application to users located in multiple Azure regions across the continent. This application will be used to upload log files and download them for diagnostic analysis. Files are stored as blobs in the hot access tier. Based on expected usage patterns, you've been asked to create a rough estimate of costs.

The storage account is located in the West US region, is configured for Geo-redundant storage (GRS) and does not have hierarchical namespaces enabled. 

## Costs

The following table describes each cost.

| Cost | Description |
|----|----|
| **Cost to write** | During this quarter, clients will upload an estimated **50,000** log files (roughly **1 GB** each in size). Clients are configured to upload those log files in 8 MiB blocks. Each block  is billed as a write operation with one additional operation to commit those blocks. A smaller block size is very performant, but you know that a larger block size results in fewer write operations so you plan to include that suggestion along with your estimate. |
| **Cost of replication** | Because the account is configured for geo-redundant storage, all blobs are replicated to a secondary region. This replication process adds a data transfer fee per GB replicated.|
| **Cost to read** | Any blob that is downloaded for diagnostic analysis is billed as a read operation. You believe that client applications will download about half of the files uploaded for diagnostic analysis. You also learn that **75%** of client applications are not located in the same region as the storage account. Therefore, blobs downloaded by those clients incur a network bandwidth fee. |

## Estimate

Based on [these sample prices](blob-storage-estimate-costs.md#sample-prices), the following table shows how each cost component is calculated. This sample estimate doesn't include the [cost of data storage](blob-storage-estimate-costs.md#the-cost-to-store-data) which is billed per GB.

| Cost                    | Cost factor                                   | Calculation                      | Value         |
|-------------------------|-----------------------------------------------|----------------------------------|---------------|
| **Cost to write**       | PutBlock operations per blob                  | 1 GiB / 8-MiB block              | 155           |
|                         | PutBlockList operations per blob              | 1 per blob                       | 1             |
|                         | Price of a write operation on the hot tier    |                                  | $0.000021     |
|                         | **Cost to upload log files**<br></br>         | (50,000 blobs * 156) * $0.000021 | **$163.80**   |
| **Cost of replication** | Price of data transfer (per GB)               |                                  | $0.02         |
|                         | **Data transfer fee**                         | 50,000 GB * $0.02                | **$1,000.00** |
| **Cost to read**        | Number of read operations                     | 50,000 / 2                       | 25,000        |
|                         | Price a read operation on the hot tier        |                                  | $0.00440      |
|                         | Cost of read operations<br></br>              | 25,000 GB * $0.00440             | **$110.00**   |
|                         | Number of blobs downloaded from other regions | 25,000 * 75%                     | 1875          |
|                         | **Network bandwidth fee**                     | 1875 * $0.02                     | **$375.00**   |
| **Total cost**          |                                               | $163.80 + $2,000 + $110 + $750   | **$1,648.80** |

> [!TIP]
> You can estimate the cost of these components in your environment by using [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) 

## See also

- [Estimate the cost of using Azure Blob Storage](blob-storage-estimate-costs.md)
- [Estimate the cost of using AzCopy to transfer blobs](azcopy-cost-estimation.md)
- [Estimate the cost of archiving data](archive-cost-estimation.md)
- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
