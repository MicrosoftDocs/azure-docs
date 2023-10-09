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

## Calculate the cost to upload

The cost to upload is impacted by which endpoint you use in your `azcopy copy` command.

**The cost to upload to the Blob Service endpoint**

If you upload data to the Blob Service endpoint (`https://<storage-account>.blob.core.windows.net`), AzCopy uploads each blob in 8 MiB blocks. 

AzCopy uses the [Put Block](/rest/api/storageservices/put-block-list) operation to upload each block. After the final block is uploaded, AzCopy commits those blocks by using the [Put Block List](/rest/api/storageservices/put-block-list) operation. Both operations are billed as write operations. 

The table below calculates the number of write operations required to upload `1,000,000` blobs that are `10 GiB` each in size. 

| Calculation | Value
|---|---|
| Number of MiB in 10 Gib | 10,240 |
| PutBlock operations per per blob (10,240 MiB / 8 MiB block) | 1,280 |
| Write operations per blob (1,280 + 1 PutBlockList operation) | 1,281 |
| Total write operations (1,000,000 * 1,281) | **1,281,000,000** |

> [!TIP]
> You can reduce the number of operations by configuring AzCopy to use a larger block size.  

Using the [Sample prices](#sample-prices) that appear in this article, the following table table calculates the cost of these write operations.

| Price factor                                               | Hot           | Cool        | Cold        | Archive     |
|------------------------------------------------------------|---------------|-------------|-------------|-------------|
| Price of write transactions (per 10,000)                   | $0.055        | $0.10       | $0.18       | $0.10       |
| Price of a single write operation (price / 10,000)         | $0.0000055    | $0.00001    | $0.000018   | $0.00001    |
| Total cost (write operations * price of a write operation) | **$7,045.50** | **$12,810** | **$23,058** | **$12,810** |

**The cost to upload to the Data Lake Storage endpoint**

If you upload data to the Data Lake Storage endpoint (`https://<storage-account>.dfs.core.windows.net`), AzCopy uploads each blob in 4 MiB blocks. This value is non-configurable. 

AzCopy uses the [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) operation to upload each block which is billed as a write operation.

The table below calculates the number of write operations required to upload `1,000,000` blobs that are `10 GiB` each in size. 

| Calculation | Value
|---|---|
| Number of MiB in 10 Gib | 10,240 |
| Path - Update operations per per blob (10,240 MiB / 4 MiB block) | 2,560 |
| Total write operations (1,000,000 * 2,560) | **2,560,000,000** |

Using the [Sample prices](#sample-prices) that appear in this article, the following table table calculates the cost of these write operations.

| Price factor                                               | Hot         | Cool        | Cold        | Archive     |
|------------------------------------------------------------|-------------|-------------|-------------|-------------|
| Price of write transactions (every 4MB, per 10,000)        | $0.0715     | $0.13       | $0.234      | $0.143      |
| Price of a single write operation (price / 10,000)         | $0.00000715 | $0.000013   | $0.0000234  | $0.0000143  |
| Total cost (write operations * price of a write operation) | **$18,304** | **$33,280** | **$59,904** | **$36,608** |

## Calculate the cost to download

The cost to download is impacted by which endpoint you use in your `azcopy copy` command.

**The cost to download from the Blob Service endpoint**

If you download blobs from the Blob Service endpoint (`https://<storage-account>.blob.core.windows.net`), AzCopy uses the [Get Blob](/rest/api/storageservices/get-blob) operation which is billed as a read operation. If you read blobs from the cool, cold, and archive tiers, your also charged a data retrieval per GiB downloaded. 

Using the [Sample prices](#sample-prices) that appear in this article, the following table table calculates the cost of downloading `500` blobs that are `10 GiB` in size.

| Price factor                                                      | Hot          | Cool        | Cold        | Archive    |
|-------------------------------------------------------------------|--------------|-------------|-------------|------------|
| Price of read transactions (per 10,000)                           | $0.0044      | $0.01       | $0.10       | $5.00      |
| Price of a single read operation (price / 10,000)                 | $0.00000044  | $0.000001   | $0.00001    | $0.0005    |
| **Cost of read operations (500 * price of read operation)** | **$0.00022** | **$0.0005** | **$0.005**  | **$0.25**  |
| Price of data retrieval (per GiB)                                 | Free         | $0.01       | $0.03       | $0.02      |
| **Cost of data retrieval (500 * price of data retrieval)**        | **$0.00**    | **$5.00**   | **$15.00**  | **$10.00** |
| **Total cost (cost of read operations + cost of data retrieval)**  | **$0.00022** | **$5.0005** | **$15.005** | **$10.25** |

**The cost to download from the Data Lake Storage endpoint**

If you download blobs by using the Data Lake Storage endpoint (`https://<storage-account>.dfs.core.windows.net`), AzCopy reads each blob in 4 MiB blocks. This value is non-configurable. 

AzCopy uses the [Path - Read](/rest/api/storageservices/datalakestoragegen2/path/read) operation which is billed as a read operation.

The table below calculates the number of write operations required to upload `500` blobs that are `10 GiB` each in size. 

| Calculation | Value
|---|---|
| Number of MiB in 10 Gib | 10,240 |
| Path - Read operations per per blob (10,240 MiB / 4 MiB block) | 2,560 |
| Total read operations (500 * 2,560) | **1,280,000** |

If you read blobs from the cool, cold, and archive tiers, your charged a data retrieval fee.

Using the [Sample prices](#sample-prices) that appear in this article, the following table table calculates the cost of downloading `500` blobs that are `10 GiB` in size.

| Price factor                                                        | Hot          | Cool        | Cold       | Archive   |
|---------------------------------------------------------------------|--------------|-------------|------------|-----------|
| Price of read transactions (every 4MiB, per 10,000)                  | $0.0057      | $0.013      | $0.13      | $7.15     |
| Price of a single read operation (price / 10,000)                   | $0.00000057  | $0.0000013  | $0.000013  | $0.000715 |
| **Cost of read operations (1,280,000 * price of a read operation)** | **$0.7296** | **$1.664** | **$16.64** | **$915.2** |
| Price of data retrieval (per GiB)                         | Free         | $0.01       | $0.03      | $0.022    |
| **Cost of data retrieval (1,280,000 * price of data retrieval)** | **$0.00** | **$5.00**   | **$15.00**  | **$11.00** |
| **Total cost (cost of read operations + cost of data retrieval)**  | **$0.7296** | **$6.664** | **$31.64** | **$926.2** |

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
| Price of data retrieval (per GB)         | Free     | $0.01    | $0.03    | $0.022  |
| Iterative Read operations (per 10,000)              | $0.0715  | $0.0715  | $0.0845  | $0.0715 |
| Iterative Write operations (per 10,000)             | $0.0715  | $0.13    | $0.234   | $0.143  |
| All other operations (per 10,000)                   | $0.00572 | $0.00572 | $0.00676 | $0.0052 |

For official prices, see [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/). 

## See also

- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
