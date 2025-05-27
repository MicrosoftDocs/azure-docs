---
title: 'Cost estimate: Multiregion data access (Azure Blob Storage)' 
description: This article provides a sample estimate of what it might cost to ingest and access data in Azure Blob Storage from multiple Azure regions. 
services: storage
author: normesta

ms.service: azure-blob-storage
ms.date: 05/14/2025
ms.topic: concept-article
ms.author: normesta
---

# Cost estimate: Upload and access data from multiple regions 

This sample estimates the costs associated with uploading and downloading data from multiple Azure regions.

> [!IMPORTANT]
> This estimate is based on [these sample prices](blob-storage-estimate-costs.md#sample-prices). Sample prices shouldn't be used to calculate your production costs. To find official prices, see [Find the unit price for each meter](../common/storage-plan-manage-costs.md#find-the-unit-price-for-each-meter).

## Scenario

In this scenario, client applications are located in different Azure regions across the continent. These client applications generate and upload **50,000** log files. Each file is **1 GB** in size. Because the account is configured for Geo-redundant storage (GRS), each file that is uploaded incurs a data transfer fee and a network bandwidth fee. 

Client applications download about half of those log files for diagnostic analysis. However, **75%** of those client applications are not located in the same region as the storage account so they incur a data transfer fee and a network bandwidth fee for each download. 

The account is located in the West US region and hierarchical namespaces are not enabled.

## Estimate

Based on [these sample prices](blob-storage-estimate-costs.md#sample-prices), the following table shows how each cost component is calculated.

| Cost factor                                           | Calculation                                  | Value       |
|-------------------------------------------------------|----------------------------------------------|-------------|
| PutBlock operations per blob                          | 1 GiB / 8-MiB block                          | 155         |
| PutBlockList operations per blob                      | 1 per blob                                   | 1           |
| **Cost of write operations**                          | (50,000 blobs * 156) * write operation price | **$163.80** |
| Data transfer fee (replication)                       | 50,000 GB * data transfer fee                | $1,000.00   |
| Network bandwidth fee (replication)                   | 50,000 GB * network bandwidth fee            | $1,000.00   |
| **Cost to transfer data out of region (replication)** | data transfer fee + network bandwidth fee    | **$2,000**  |
| Number of read operations                             | 50,000 / 2                                   | 25,000      |
| **Cost of read operations**                           | 25,000 GB * read operation price             | **$110.00** |
| Number of blobs downloaded from other regions         | 25,000 * 75%                                 | 1875        |
| Data transfer fee (downloads)                         | 1875 * data transfer fee                     | $375.00     |
| Network bandwidth fee (downloads)                     | 1875 * network bandwidth fee                 | $375.00     |
| **Cost to transfer data out of region (download)**    | data transfer fee + network bandwidth fee    | **$750.00** |
| **Total cost**                                        | write + read + data transfer                 | **860.00**  |

This sample estimate doesn't include the [cost of data storage](blob-storage-estimate-costs.md#the-cost-to-store-data) which is billed per GB.

## Factors that can impact the cost

The following table describes factors that can impact the cost of this scenario. 

| Factor | Impact | Learn more |
|---|---|----|
| Block size    | Larger block size reduces the number of write operations required to upload data. | [The cost to upload data](blob-storage-estimate-costs.md) |
| Uploading data by using the Data Lake Storage endpoint | Smaller fixed block sizes of 4 MiB increases the number of write operations. | [Cost of uploading to the Data Lake Storage endpoint](azcopy-cost-estimation.md#cost-of-uploading-to-the-data-lake-storage-endpoint) |
| Redundancy configuration of the account | Storage redundancy configuration impacts the cost of certain operations. For example, you could configure your account for read-access geo-zone-redundant storage (RA-GZRS) which enables clients to download from either the primary or secondary regions. However, moving the RA-GZRS changes the price of certain operations. | [Azure Storage redundancy](../common/storage-redundancy.md) | 

## See also

- [Estimate the cost of using Azure Blob Storage](blob-storage-estimate-costs.md)
- [Estimate the cost of using AzCopy to transfer blobs](azcopy-cost-estimation.md)
- [Estimate the cost of archiving data](archive-cost-estimation.md)
- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
