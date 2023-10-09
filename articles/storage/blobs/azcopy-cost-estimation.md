---
title: 'Estimate costs: AzCopy with Azure Blob Storage'
description: Learn how to estimate the cost to transfer data to, from, or between containers in Azure Blob Storage.  
services: storage
author: normesta
ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 10/05/2023
ms.author: normesta
ms.custom: subject-cost-optimization
---

# Estimate the cost to transfer data to, from, or between containers

You can estimate the cost of a transfer by knowing the number of blobs, the size of each blob, and the REST operations that AzCopy uses to complete the transfer. Block size impacts only the cost of uploading data and network egress charges impact only the movement of data between regions. 

This article provides example calculations for common data transfer scenarios.

## Uploading

This scenario assumes that you use the `azcopy copy` command to upload 1,000,000 blob, and each blob is 10 Gib in size. 

### Uploading to the Blob Service endpoint

If you upload data to the Blob Service endpoint (`https://<storage-account>.blob.core.windows.net`), AzCopy uploads each blob in 8 MiB blocks. AzCopy uses the [Put Block](/rest/api/storageservices/put-block-list) operation to upload each block. After the final block of a blob is uploaded, AzCopy commits those blocks to Blob Storage by using the [Put Block List](/rest/api/storageservices/put-block-list) operation. This means that for blobs 8 MiB or smaller, AzCopy makes two requests to the service. Larger files result in more requests. You can configure AzCopy to use a larger block size. For larger files, this can reduce the number of transactions required to upload data. 

The [Put Block](/rest/api/storageservices/put-block-list) and [Put Block List](/rest/api/storageservices/put-block-list) operations are both billed as write operations. The table below calculates the number of write operations required to upload 1M 10GiB blobs in 8MiB blocks.

| Cost element | Value
|---|---|
| Number of MiB in 10 Gib | 10,240 |
| PutBlock operations per per blob (10,240 MiB / 8 MiB) | 1,280 |
| PutBlockList operations per blob | 1 |
| Write operations per blob (1,280 + 1) | 1,281 |
| Total write operations (1,000,000 * 1,281) | **1,281,000,000** |

Using the [Sample prices](#sample-prices) that appear in this article, the following table table calculates the cost to upload these blobs to each tier.

| Price factor                                       | Hot           | Cool        | Cold        | Archive     |
|----------------------------------------------------|---------------|-------------|-------------|-------------|
| Price of write transactions (per 10,000)           | $0.055        | $0.10       | $0.18       | $0.10       |
| Price of a single write operation (price / 10,000) | $0.0000055    | $0.00001    | $0.000018   | $0.00001    |
| Total cost to upload blobs                         | **$7,045.50** | **$12,810** | **$23,058** | **$12,810** |

### Transfers to the Data Lake Storage endpoint

Put stuff here.

## Downloading

Scenario description

Show rest operations called

Cost table (Blob Storage endpoint)

Cost table (Data Lake Storage endpoint)

- Gen2 endpoints charge at 4MB transactions.

Tips to optimize cost

## Copying between containers

Scenario description

Show rest operations called

Cost table (Blob Storage endpoint)

Cost table (Data Lake Storage endpoint)

- Gen2 endpoints charge at 4MB transactions.

Tips to optimize cost

## Synchronizing changes

Scenario description

Show rest operations called

Cost table (Blob Storage endpoint)

Cost table (Data Lake Storage endpoint)

- Gen2 endpoints charge at 4MB transactions.

Tips to optimize cost

## Updating tags, metadata, and properties

Scenario description

Show rest operations called

Cost table (Blob Storage endpoint)

Cost table (Data Lake Storage endpoint)

Tips to optimize cost

## Map of commands to REST operations

These tables show how each AzCopy command translates to one or more REST operations. 

### Commands that target the Blob service endpoint

| Command      | Scenario | REST operation    |
|--------------|----------|-------------------------|
| azcopy bench | upload   | GetBlob                 |
| azcopy bench | download | PutBlock & PutBlockList |

To map each operation to a price, see [Map each REST operation to a price](map-rest-apis-transaction-categories.md).

### Commands that target the Data Lake Storage endpoint

| Command      | Scenario | REST operation   |
|--------------|----------|-------------------------|
| azcopy bench | upload   | GetBlob                 |
| azcopy bench | download | PutBlock & PutBlockList |

To map each operation to a price, see [Map each REST operation to a price](map-rest-apis-transaction-categories.md).

## Sample prices

This article uses the fictitious prices that appear in the following tables. 

> [!IMPORTANT]
> These prices are meant only as examples, and should not be used to calculate your costs.

### Commands that target the Blob service endpoint

| Price factor                               | Hot     | Cool    | Cold    | Archive |
|--------------------------------------------|---------|---------|---------|---------|
| Price of write transactions (per 10,000)   | $0.055  | $0.10   | $0.18   | $0.10   |
| Price of read transactions (per 10,000)    | $0.0044 | $0.01   | $0.10   | $5.00   |
| Price of data retrieval (per GB)           | Free    | $0.01   | $0.03   | $0.02   |
| List and container operations (per 10,000) | $0.055  | $.055   | $.065   | $.055   |
| All other operations (per 10,000)          | $0.0044 | $0.0044 | $0.0052 | $0.0044 |


For official prices, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Commands that target the Data Lake Storage endpoint

| Price factor                                        | Hot      | Cool     | Cold     | Archive |
|-----------------------------------------------------|----------|----------|----------|---------|
| Price of write transactions (every 4MB, per 10,000) | $0.0715  | $0.13    | $0.234   | $0.143  |
| Price of read transactions (every 4MB, per 10,000)  | $0.0057  | $0.013   | $0.13    | $7.15   |
| Price of data retrieval (every 4MB, per GB)         | Free     | $0.01    | $0.03    | $0.022  |
| Iterative Read operations (per 10,000)              | $0.0715  | $0.0715  | $0.0845  | $0.0715 |
| Iterative Write operations (per 10,000)             | $0.0715  | $0.13    | $0.234   | $0.143  |
| All other operations (per 10,000)                   | $0.00572 | $0.00572 | $0.00676 | $0.0052 |

For official prices, see [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/). 

## See also

- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
