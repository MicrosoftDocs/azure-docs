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

This article helps you estimate what it will cost to transfer data to, from, or between containers by using AzCopy commands.

Each section of this article presents a data transfer scenario. Each section describes the components that impact cost along with a calculation of the cost based on fictitious numbers. You can use these example calculations to model the cost of your planned data transfers. 

## Calculate the cost to upload

You can upload blobs by using the `azcopy copy` command. The destination endpoint of that command impacts the cost of the upload. 

### Cost to use the Blob Service endpoint

If you upload data to the Blob Service endpoint (`blob.core.windows.net`), then AzCopy uploads each blob in 8 MiB blocks. 

AzCopy uses the [Put Block](/rest/api/storageservices/put-block) operation to upload each block. After the final block is uploaded, AzCopy commits those blocks by using the [Put Block List](/rest/api/storageservices/put-block-list) operation. Both operations are billed as write operations. 

The table below calculates the number of write operations required to upload `1,000` blobs that are `5 GiB` each in size. 

| Calculation | Value
|---|---|
| Number of MiB in 10 Gib | 5,120 |
| PutBlock operations per per blob (5,120 MiB / 8 MiB block) | 640 |
| PutBlockList operations per blob | 1 |
| **Total write operations (1,000 * 641)** | **641,000** |

> [!TIP]
> You can reduce the number of operations by configuring AzCopy to use a larger block size.  

Using the [Sample prices](#sample-prices) that appear in this article, the following table table calculates the cost of these write operations.

| Price factor                                               | Hot           | Cool        | Cold        | Archive     |
|------------------------------------------------------------|---------------|-------------|-------------|-------------|
| Price of write transactions (per 10,000)                   | $0.055        | $0.10       | $0.18       | $0.10       |
| Price of a single write operation (price / 10,000)         | $0.0000055    | $0.00001    | $0.000018   | $0.00001    |
| Total cost (write operations * price of a write operation) | **$3.53** | **$6.41** | **$11.538** | **$3.53** |

> [!NOTE]
> If you upload to the archive tier, each [Put Block](/rest/api/storageservices/put-block) operation is charged at the price of a **hot** write operation. Each [Put Block List](/rest/api/storageservices/put-block-list) operation is charged the price of an **archive** write operation. In this example, there is no impact to cost.  

### Cost to use the Data Lake Storage endpoint

If you upload data to the Data Lake Storage endpoint (`https://<storage-account>.dfs.core.windows.net`), then AzCopy uploads each blob in 4 MiB blocks. This value is non-configurable. 

AzCopy uses the [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) operation to upload each block which is billed as a write operation.

The table below calculates the number of write operations required to upload `1,000` blobs that are `5 GiB` each in size. 

| Calculation | Value
|---|---|
| Number of MiB in 10 Gib | 5,120 |
| Path - Update operations per per blob (5,120 MiB / 4 MiB block) | 1,280 |
| **Total write operations (1,000 * 1,280)** | **1,280,000** |

Using the [Sample prices](#sample-prices) that appear in this article, the following table table calculates the cost of these write operations.

| Price factor                                               | Hot         | Cool        | Cold        | Archive     |
|------------------------------------------------------------|-------------|-------------|-------------|-------------|
| Price of write transactions (every 4MB, per 10,000)        | $0.0715     | $0.13       | $0.234      | $0.143      |
| Price of a single write operation (price / 10,000)         | $0.00000715 | $0.000013   | $0.0000234  | $0.0000143  |
| Total cost (write operations * price of a write operation) | **$9.152** | **$16.64** | **$29.952** | **$18.304** |

## Calculate the cost to download

You can download blobs by using the `azcopy copy` command. The source endpoint of that command impacts the cost of the upload. 

> [!NOTE]
> These examples exclude downloading from archive, because it is not possible to do so. To read a blob in archive, you must first rehydrate that blob to an online tier. Then you can download that blob from the online tier. For information about how to rehydrate a blob from archive, see [Blob rehydration from the archive tier](archive-rehydrate-overview.md). For information about what it costs to rehydrate blobs, see [The cost to rehydrate](archive-cost-estimation.md#the-cost-to-rehydrate).

### Cost to download from the Blob Service endpoint

If you download blobs from the Blob Service endpoint (`https://<storage-account>.blob.core.windows.net`), AzCopy uses the [Get Blob](/rest/api/storageservices/get-blob) operation which is billed as a read operation. If you read blobs from the cool, cold, and archive tiers, your also charged a data retrieval per GiB downloaded. 

Using the [Sample prices](#sample-prices) that appear in this article, the following table table calculates the cost of downloading `500` blobs that are `10 GiB` in size.

| Price factor                                                      | Hot          | Cool        | Cold        |
|-------------------------------------------------------------------|--------------|-------------|-------------|
| Price of read transactions (per 10,000)                           | $0.0044      | $0.01       | $0.10       |
| Price of a single read operation (price / 10,000)                 | $0.00000044  | $0.000001   | $0.00001    |
| **Cost of read operations (500 * price of read operation)** | **$0.00022** | **$0.0005** | **$0.005**  |
| Price of data retrieval (per GiB)                                 | Free         | $0.01       | $0.03       | 
| **Cost of data retrieval (500 * price of data retrieval)**        | **$0.00**    | **$5.00**   | **$15.00**  |
| **Total cost (cost of read operations + cost of data retrieval)**  | **$0.00022** | **$5.0005** | **$15.005** |

### Cost to download from the Data Lake Storage endpoint

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

## Calculate the cost to copy between containers

Scenario description

Show rest operations called

Cost table (Blob Storage endpoint)

Cost table (Data Lake Storage endpoint)

- Gen2 endpoints charge at 4MB transactions.

Tips to optimize cost

## Calculate the cost to synchronize changes

Scenario description

Show rest operations called

Cost table (Blob Storage endpoint)

Cost table (Data Lake Storage endpoint)

- Gen2 endpoints charge at 4MB transactions.

Tips to optimize cost

## Calculate the cost to update tags, metadata, and properties

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
