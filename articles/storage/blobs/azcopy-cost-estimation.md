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

# Estimate the cost of using AzCopy to transfer blobs

This article helps you estimate what it will cost to transfer blobs by using AzCopy. 

Each example uses fictitious prices. You can find these sample prices in the [Sample prices](#sample-prices) section at the end of this article. These prices are meant only as examples, and shouldn't be used to calculate your costs. For official prices, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) or [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/). For more information about how to choose the correct pricing page, see [Understand the full billing model for Azure Blob Storage](../common/storage-plan-manage-costs.md).

Because all models must start with a set of assumptions, Each example in this article assumes the transfer of **1000** blobs that are **5 GiB** each in size. By using the [sample prices](#sample-prices)(#sample-prices) that appear in this article, the following table estimates the cost of each type of transfer. 

| Scenario                                    | Hot     | Cool    | Cold   | Archive       |
|---------------------------------------------|---------|---------|--------|---------------|
| Upload blobs (Blob Service endpoint)        | $3.53   | $6.41   | $11.54 | $3.53         |
| Upload blobs (Data Lake Storage endpoint)   | $9.15   | $16.64  | $29.95 | $18.30        |
| Download blobs (Blob Service endpoint)      | $0.0059 | $5.01   | $15.02 | Not supported |
| Download blobs (Data Lake Storage endpoint) | $0.73   | $11.67  | $46.65 | Not supported |
| Copy blobs                                  | $3.53   | $0.0055 | $0.01  | $0.01         |
| Copy blobs to another account               | $3.53   | $10.01  | $30.02 | $20.00        |

The sections in this article explain how each cost is calculated and explains the individual components that impact the cost estimate.

## Calculate the cost to upload

This section calculates the cost to upload `1,000` blobs that are `5 GiB` each in size. 

You upload blobs by using the `azcopy copy` command. In that command, you'll specify a destination endpoint. That endpoint can be either a Blob Service endpoint (`blob.core.windows.net`) or a Data Lake Storage endpoint (`dfs.core.windows.net`) endpoint. This section describes the cost using each.

### Cost of using the Blob Service endpoint

If you upload data to the Blob Service endpoint, then AzCopy uploads each blob in 8 MiB blocks. 

AzCopy uses the [Put Block](/rest/api/storageservices/put-block) operation to upload each block. After the final block is uploaded, AzCopy commits those blocks by using the [Put Block List](/rest/api/storageservices/put-block-list) operation. Both operations are billed as write operations. 

The table below calculates the number of write operations required to upload these blobs. 

| Calculation | Value
|---|---|
| Number of MiB in 10 GiB | 5,120 |
| PutBlock operations per per blob (5,120 MiB / 8 MiB block) | 640 |
| PutBlockList operations per blob | 1 |
| **Total write operations (1,000 * 641)** | **641,000** |

> [!TIP]
> You can reduce the number of operations by configuring AzCopy to use a larger block size.  

Using the [Sample prices](#sample-prices) that appear in this article, the following table table calculates the cost to upload these blobs.

| Price factor                                        | Hot        | Cool      | Cold       | Archive   |
|-----------------------------------------------------|------------|-----------|------------|-----------|
| Price of a single write operation (price / 10,000)  | $0.0000055 | $0.00001  | $0.000018  | $0.00001  |
| **Total cost (write operations * operation price)** | **$3.53**  | **$6.41** | **$11.54** | **$3.53** |

> [!NOTE]
> If you upload to the archive tier, each [Put Block](/rest/api/storageservices/put-block) operation is charged at the price of a **hot** write operation. Each [Put Block List](/rest/api/storageservices/put-block-list) operation is charged the price of an **archive** write operation.  

### Cost of using the Data Lake Storage endpoint

If you upload data to the Data Lake Storage endpoint, then AzCopy uploads each blob in 4 MiB blocks. This value is non-configurable. 

AzCopy uses the [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) operation to upload each block which is billed as a write operation.

The table below calculates the number of write operations required to upload these blobs. 

| Calculation | Value
|---|---|
| Number of MiB in 5 GiB | 5,120 |
| Path - Update operations per per blob (5,120 MiB / 4 MiB block) | 1,280 |
| **Total write operations (1,000 * 1,280)** | **1,280,000** |

Using the [Sample prices](#sample-prices) that appear in this article, the following table table calculates the cost to upload these blobs

| Price factor                                        | Hot         | Cool       | Cold       | Archive    |
|-----------------------------------------------------|-------------|------------|------------|------------|
| Price of a single write operation (price / 10,000)  | $0.00000715 | $0.000013  | $0.0000234 | $0.0000143 |
| **Total cost (write operations * operation price)** | **$9.15**   | **$16.64** | **$29.95** | **$18.30** |

## Calculate the cost to download

This section calculates the cost to download `1,000` blobs that are `5 GiB` each in size.

You can download blobs by using the `azcopy copy` command. In that command, you'll specify a source endpoint. That endpoint can be either a Blob Service endpoint (`blob.core.windows.net`) or a Data Lake Storage endpoint (`dfs.core.windows.net`) endpoint. This section describes the cost using each.

### Cost of using the Blob Service endpoint

If you download blobs from the Blob Service endpoint, AzCopy uses the [List Blobs](/rest/api/storageservices/list-blobs) and [Get Blob](/rest/api/storageservices/get-blob) operation. If you download blobs from the cool or cold tier, you're also charged a data retrieval per GiB downloaded. 

Using the [Sample prices](#sample-prices) that appear in this article, the following table calculates the cost to download these blobs.

| Price factor                                            | Hot          | Cool        | Cold        |
|---------------------------------------------------------|--------------|-------------|-------------|
| Price of a single read operation (price / 10,000)       | $0.00000044  | $0.000001   | $0.00001    |
| **Cost of read operations (1000 * operation price)**    | **$0.00044** | **$0.001**  | **$0.01**   |
| Price of a single list operation (price/ 10,000)        | $0.0000055   | $0.0000055  | $0.0000065  |
| **Cost of listing operations (1000 * operation price)** | **$0.0055**  | **$0.0055** | **$0.0065** |
| Price of data retrieval (per GiB)                       | Free         | $0.01       | $0.03       |
| **Cost of data retrieval (1000 * operation price)**     | **$0.00**    | **$5.00**   | **$15.00**  |
| **Total cost (read + listing + retrieval)**             | **$0.0059**  | **$5.01**   | **$15.02**  |

> [!NOTE]
> The table above excludes the archive tier because you can't download directly from that tier. See [Blob rehydration from the archive tier](archive-rehydrate-overview.md).

### Cost of using the Data Lake Storage endpoint

If you download blobs by using the Data Lake Storage endpoint, AzCopy reads each blob in 4 MiB blocks. This value is non-configurable. 

AzCopy uses the [Path - Read](/rest/api/storageservices/datalakestoragegen2/path/read) and [Path - List](/rest/api/storageservices/datalakestoragegen2/path/list) operation. If you download blobs from the cool or cold tier, you're also charged a data retrieval per GiB downloaded. 

The table below calculates the number of write operations required to upload the blobs. 

| Calculation | Value
|---|---|
| Number of MiB in 5 Gib | 5,120 |
| Path - Update operations per per blob (5,120 MiB / 4 MiB block) | 1,280 |
| Total read operations (1000* 1,280) | **1,280,000** |

Using the [Sample prices](#sample-prices) that appear in this article, the following table table calculates the cost to download these blobs.

| Price factor                                                   | Hot         | Cool        | Cold         |
|----------------------------------------------------------------|-------------|-------------|--------------|
| Price of a single read operation (price / 10,000)              | $0.00000057 | $0.0000013  | $0.000013    |
| **Cost of read operations (1,280,000 * operation price)**      | **$0.73**   | **$1.66**   | **$16.64**   |
| Price of a single iterative read operation (price / 10,000)    | $0.00000715 | $0.00000715 | $0.00000845  |
| **Cost of iterative read operations (1000 * operation price)** | **$0.0072** | **$0.0072** | **$0.00845** |
| Price of data retrieval (per GiB)                              | Free        | $0.01       | $0.03        |
| **Cost of data retrieval (1000 * operation price)**            | **$0.00**   | **$10.00**  | **$30.00**   |
| **Total cost (read + iterative read + retrieval)**             | **$0.73**   | **$11.67**  | **$46.65**   |

> [!NOTE]
> The table above excludes the archive tier because you can't download directly from that tier. See [Blob rehydration from the archive tier](archive-rehydrate-overview.md).

## Calculate the cost to copy between containers

This section calculates the cost to copy `1,000` blobs between containers. Each blob is `5 GiB` in size. 

You copy blobs by using the `azcopy copy` command.  In that command, you'll specify a source and destination endpoint. Each endpoint must be a Blob Service endpoint (`blob.core.windows.net`).

### Cost of copying blobs within the same account

AzCopy uses the [Copy Blob](/rest/api/storageservices/copy-blob) operation to upload each block which is billed as a write operation that is based on the destination tier.

| Price factor                                       | Hot        | Cool        | Cold      | Archive   |
|----------------------------------------------------|------------|-------------|-----------|-----------|
| Price of a single write operation (price / 10,000) | $0.0000055 | $0.00001    | $0.000018 | $0.00001  |
| **Total cost (1000 * operation price)**            | **$3.53**  | **$0.0055** | **$0.01** | **$0.01** |

### Cost of copying blobs to another account in the same region

AzCopy uses the [Copy Blob](/rest/api/storageservices/copy-blob) operation to upload each block. To complete the operation, you're billed for read operation that is based on the source tier and a write operation that is based on the destination tier. This example assumes both source and destination are in the same access tier.

| Price factor                                          | Hot          | Cool        | Cold       | Archive    |
|-------------------------------------------------------|--------------|-------------|------------|------------|
| Price of a single read operation (price / 10,000)     | $0.00000044  | $0.000001   | $0.00001   | $0.0005    |
| **Cost of read operations (1,000 * operation price)** | **$0.00044** | **$0.001**  | **$0.01**  | **$0.5**   |
| Price of a single write operation (price / 10,000)    | $0.0000055   | $0.00001    | $0.000018  | $0.00001   |
| **Total cost (1000 * operation price)**               | **$3.53**    | **$0.0055** | **$0.01**  | **$0.01**  |
| Price of data retrieval (per GiB)                     | Free         | $0.01       | $0.03      | $0.02      |
| **Cost of data retrieval (1000 * operation price)**   | **$0.00**    | **$10.00**  | **$30.00** | **$20.00** |
| **Total cost (read + write + retrieval)**             | **$3.53**    | **$10.01**  | **$30.02** | **$20.00** |

### Cost of copying blobs to an account located in another region

Read charge on source and write charge on destination + egress fees.

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
| List and container operations (per 10,000) | $0.055  | $0.055   | $0.065   | $0.055   |
| All other operations (per 10,000)          | $0.0044 | $0.0044 | $0.0052 | $0.0044 |


For official prices, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Commands that target the Data Lake Storage endpoint

| Price factor                                        | Hot      | Cool     | Cold     | Archive |
|-----------------------------------------------------|----------|----------|----------|---------|
| Price of write transactions (every 4MB, per 10,000) | $0.0715  | $0.13    | $0.234   | $0.143  |
| Price of read transactions (every 4MB, per 10,000)  | $0.0057  | $0.013   | $0.13    | $7.15   |
| Price of data retrieval (per GB)                    | Free     | $0.01    | $0.03    | $0.022  |
| Iterative Read operations (per 10,000)              | $0.0715  | $0.0715  | $0.0845  | $0.0715 |
| Iterative Write operations (per 10,000)             | $0.0715  | $0.13    | $0.234   | $0.143  |
| All other operations (per 10,000)                   | $0.00572 | $0.00572 | $0.00676 | $0.0052 |

For official prices, see [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/). 

## See also

- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
