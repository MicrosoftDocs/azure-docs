---
title: Estimate the cost of using Azure Blob Storage
description: Learn how to estimate the cost of using Azure Blob Storage.  
services: storage
author: normesta
ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 07/03/2024
ms.author: normesta
ms.custom: subject-cost-optimization
---

# Estimate the cost of using Azure Blob Storage

This article helps you estimate the cost of Azure Blob Storage. Make clear that this article shows costs across capacity, transactions and tiers and helps you see the impact of different use and tiering flows on costs over time.

All calculations are based on a fictitious price. You can find each price in the [sample prices](#sample-prices) section at the end of this article. 

> [!IMPORTANT]
> These prices are meant only as examples, and shouldn't be used to calculate your costs. For official prices, see the [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) or [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/) pricing pages. For more information about how to choose the correct pricing page, see [Understand the full billing model for Azure Blob Storage](../common/storage-plan-manage-costs.md).

## The cost to store data

Something here about how to calculate storage costs.
Something here about the percentage of storage that goes to metadata
Something here about the percentage that goes to the index charge per GB - which is the space required to maintain HNS.
Example calculation here.
Describe storage reservations
Example of the impact of storage reservations.
Show costs across different tiers

## The cost to upload

Blobs are uploaded as blocks. Each block upload is billed as a _write_ operation. A final write operation is needed to assemble blocks into a blob that is stored in the account. 

The number of write operations that a client needs depends on the size of each block. **8 MiB** is the default block size for uploads to the Blob Service endpoint (`blob.core.windows.net`) and that size is configurable. **4 MiB** is the block size for uploads to the Data Lake Storage endpoint (`dfs.core.windows.net`) and that size is not configurable. A smaller block size performs better because blocks can upload in parallel. However, the cost is higher because more write operations are required to upload a blob.

The following tables calculates the number of write operations required to upload **1,000** blobs that are **5 GiB** to the Blob Service endpoint.

| Calculation                                                                 | Value       |
|-----------------------------------------------------------------------------|-------------|
| Number of MiB in 5 GiB                                                      | 5,120       |
| Write operations to write the blocks of each blob (5,120 MiB / 8-MiB block) | 640         |
| Write operation to commit the blocks of each blob                           | 1           |
| **Total write operations (1,000 * 641)**                                    | **641,000** |

Using the [Sample prices](#sample-prices) that appear in this article, the following table calculates the cost to upload these blobs.

| Price factor                                                     | Hot         | Cool        | Cold         | Archive     |
|------------------------------------------------------------------|-------------|-------------|--------------|-------------|
| Price of a single write operation (price / 10,000)               | $0.0000055  | $0.00001    | $0.000018    | $0.00001    |
| **Cost of write operations (641,000 * operation price)**         | **$3.5255** | **$6.4100** | **$11.5380** | **$3.5255** |

### The cost to download

When you run the [azcopy copy](../common/storage-use-azcopy-blobs-download.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) command,  you'll specify a source endpoint. That endpoint can be either a Blob Service endpoint (`blob.core.windows.net`) or a Data Lake Storage endpoint (`dfs.core.windows.net`) endpoint. This section calculates the cost of using each endpoint to download **1,000** blobs that are **5 GiB** each in size.

#### Cost of downloading from the Blob Service endpoint

If you download blobs from the Blob Service endpoint, AzCopy uses the [List Blobs](/rest/api/storageservices/list-blobs) to enumerate blobs. A [List Blobs](/rest/api/storageservices/list-blobs) is billed as a _List and create container_ operation. One [List Blobs](/rest/api/storageservices/list-blobs) operation returns up to 5,000 blobs. Therefore, in this example, only one [List Blobs](/rest/api/storageservices/list-blobs) operation is required. 

For each blob, AzCopy uses the [Get Blob Properties](/rest/api/storageservices/get-blob-properties) operation, and the [Get Blob](/rest/api/storageservices/get-blob) operation. The [Get Blob Properties](/rest/api/storageservices/get-blob-properties) operation is billed as an _All other operations_ operation and the [Get Blob](/rest/api/storageservices/get-blob) operation is billed as a _read_ operation. 

If you download blobs from the cool or cold tier, you're also charged a data retrieval per GiB downloaded. 

Using the [Sample prices](#sample-prices) that appear in this article, the following table calculates the cost to download these blobs.

> [!NOTE]
> This table excludes the archive tier because you can't download directly from that tier. See [Blob rehydration from the archive tier](archive-rehydrate-overview.md).

| Price factor                                             | Hot            | Cool           | Cold           |
|----------------------------------------------------------|----------------|----------------|----------------|
| Price of a single list operation (price/ 10,000)         | $0.0000055     | $0.0000055     | $0.0000065     |
| **Cost of listing operations (1 * operation price)**     | **$0.0000055** | **$0.0000055** | **$0.0000065** |
| Price of a single _other_ operation (price / 10,000)      | $0.00000044    | $0.00000044    | $0.00000052    |
| **Cost to get blob properties (1000 * operation price)** | **$0.00044**   | **$0.00044**   | **$0.00052**   |
| Price of a single read operation (price / 10,000)        | $0.00000044    | $0.000001      | $0.00001       |
| **Cost of read operations (1000 * operation price)**     | **$0.00044**   | **$0.001**     | **$0.01**      |
| Price of data retrieval (per GiB)                        | $0.00          | $0.01          | $0.03          |
| **Cost of data retrieval (5 * operation price)**         | **$0.00**      | **$0.05**      | **$0.15**      |
| **Total cost (list + properties + read + retrieval)**    | **$0.001**     | **$0.051**     | **$0.161**     |


#### Cost of downloading from the Data Lake Storage endpoint

If you download blobs from the Data Lake Storage endpoint, AzCopy uses the [List Blobs](/rest/api/storageservices/list-blobs) to enumerate blobs. A [List Blobs](/rest/api/storageservices/list-blobs) is billed as a _List and create container_ operation. One [List Blobs](/rest/api/storageservices/list-blobs) operation returns up to 5,000 blobs. Therefore, in this example, only one [List Blobs](/rest/api/storageservices/list-blobs) operation is required. 

For each blob, AzCopy uses the [Get Blob Properties](/rest/api/storageservices/get-blob-properties) operation which is billed as an _All other operations_ operation. AzCopy downloads each block (4 MiB in size) by using the [Path - Read](/rest/api/storageservices/datalakestoragegen2/path/read) operation. Each [Path - Read](/rest/api/storageservices/datalakestoragegen2/path/read) call is billed as a _read_ operation. 

If you download blobs from the cool or cold tier, you're also charged a data retrieval per GiB downloaded. 

The following table calculates the number of write operations required to upload the blobs. 

| Calculation                                                 | Value         |
|-------------------------------------------------------------|---------------|
| Number of MiB in 5 GiB                                      | 5,120         |
| Path - Update operations per blob (5,120 MiB / 4-MiB block) | 1,280         |
| Total read operations (1000* 1,280)                         | **1,280,000** |

Using the [Sample prices](#sample-prices) that appear in this article, the following table calculates the cost to download these blobs.

> [!NOTE]
> This table excludes the archive tier because you can't download directly from that tier. See [Blob rehydration from the archive tier](archive-rehydrate-overview.md).

| Price factor                                              | Hot            | Cool           | Cold           |
|-----------------------------------------------------------|----------------|----------------|----------------|
| Price of a single list operation (price/ 10,000)          | $0.0000055     | $0.0000055     | $0.0000065     |
| **Cost of listing operations (1 * operation price)**      | **$0.0000055** | **$0.0000055** | **$0.0000065** |
| Price of a single _other_ operation (price / 10,000)       | $0.00000044    | $0.00000044    | $0.00000052    |
| **Cost to get blob properties (1000 * operation price)**  | **$0.00044**   | **$0.00044**   | **$0.00052**   |
| Price of a single read operation (price / 10,000)         | $0.00000057    | $0.00000130    | $0.00001300    |
| **Cost of read operations (1,281,000 * operation price)** | **$0.73017**   | **$1.6653**    | **$16.653**    |
| Price of data retrieval (per GiB)                         | $0.00000000    | $0.01000000    | $0.03000000    |
| **Cost of data retrieval (5 * operation price)**          | **$0.00**      | **$0.05**      | **$0.15**      |
| **Total cost (list + properties + read + retrieval)**     | **$0.731**     | **$1.716**     | **$16.804**    |


### Copying between containers

When you run the [azcopy copy](../common/storage-use-azcopy-blobs-copy.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) command, you'll specify a source and destination endpoint. These endpoints can be either a Blob Service endpoint (`blob.core.windows.net`) or a Data Lake Storage endpoint (`dfs.core.windows.net`) endpoint. This section calculates the cost to copy **1,000** blobs that are **5 GiB** each in size.

> [!NOTE]
> Blobs in the archive tier can be copied only to an online tier. Because all of these examples assume the same tier for source and destination, the archive tier is excluded from these tables. 

#### Copying blobs within the same account

Regardless of which endpoint you specify (Blob Service or Data Lake Storage), AzCopy uses the [List Blobs](/rest/api/storageservices/list-blobs) to enumerate blobs at the source location. A [List Blobs](/rest/api/storageservices/list-blobs) is billed as a _List and create container_ operation. One [List Blobs](/rest/api/storageservices/list-blobs) operation returns up to 5,000 blobs. Therefore, in this example, only one [List Blobs](/rest/api/storageservices/list-blobs) operation is required. 

For each blob, AzCopy uses the [Get Blob Properties](/rest/api/storageservices/get-blob-properties) operation for both the source blob and the blob that is copied to the destination. The [Get Blob Properties](/rest/api/storageservices/get-blob-properties) operation is billed as an _All other operations_ operation. AzCopy uses the [Copy Blob](/rest/api/storageservices/copy-blob) operation to copy blobs to another container which is billed as a _write_ operation that is based on the destination tier.

| Price factor                                             | Hot            | Cool           | Cold           |
|----------------------------------------------------------|----------------|----------------|----------------|
| Price of a single list operation (price/ 10,000)         | $0.0000055     | $0.0000055     | $0.0000065     |
| **Cost of listing operations (1 * operation price)**     | **$0.0000055** | **$0.0000055** | **$0.0000065** |
| Price of a single other operations (price / 10,000)      | $0.00000044    | $0.00000044    | $0.00000052    |
| **Cost to get blob properties (2000 * operation price)** | **$0.00088**   | **$0.00088**   | **$0.00104**   |
| Price of a single write operation (price / 10,000)       | $0.0000055     | $0.00001       | $0.000018      |
| **Cost to write (1000 * operation price)**               | **$0.0055**    | **$0.01**      | **$0.018**     |
| **Total cost (listing + properties + write)**            | **$0.0064**    | **$0.0109**    | **$0.0190**    |

#### Copying blobs to another account in the same region

This scenario is identical to the previous one except that you're also billed for data retrieval and for read operation that is based on the source tier. 

| Price factor                                          | Hot          | Cool        | Cold        |
|-------------------------------------------------------|--------------|-------------|-------------|
| **Total from previous section**                       | **$3.5309**  | **$0.0064** | **$0.0110** |
| Price of a single read operation (price / 10,000)     | $0.00000044  | $0.000001   | $0.00001    |
| **Cost of read operations (1,000 * operation price)** | **$0.00044** | **$0.001**  | **$0.01**   |
| Price of data retrieval (per GiB)                     | Free         | $0.01       | $0.03       |
| **Cost of data retrieval (5 * operation price)**      | **$0.00**    | **$.05**    | **$.15**    |
| **Total cost (previous section + retrieval + read)**  | **$3.53134** | **$0.0574** | **$0.171**  |

#### Copying blobs to an account located in another region

This scenario is identical to the previous one except you are billed for network egress charges. 

| Price factor                                                    | Hot          | Cool        | Cold        |
|-----------------------------------------------------------------|--------------|-------------|-------------|
| **Total cost from previous section**                            | **$3.53134** | **$0.0574** | **$0.171**  |
| Price of network egress (per GiB)                               | $0.02        | $0.02       | $0.02       |
| **Total cost of network egress (5 * price of egress)** | **$.10**     | **$.10**    | **$.10**    |
| **Total cost (previous section + egress)**                      | **$3.5513**  | **$0.0774** | **$0.191** |

## The cost to rename objects

- Clearly identify which operations are used and how they are billed.
- For HNS, we show a write transaction, but it might be iterative write operations. This would be billed per 100. This is being investigated.
- For FNS, this amounts to a complete copy exercise. Show the cost of each approach.

## The cost to change access tiers

Put something here.

## Comprehensive examples

Example here that includes LCM, changing tiers, continuously reading and writing to different tiers. Storage cost and transaction costs incorporated.

## Sample prices

The following table includes sample (fictitious) prices for each request to the Blob Service endpoint (`blob.core.windows.net`). For official prices, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

| Price factor                               | Hot     | Cool    | Cold    | Archive |
|--------------------------------------------|---------|---------|---------|---------|
| Price of write transactions (per 10,000)   | $0.055  | $0.10   | $0.18   | $0.10   |
| Price of read transactions (per 10,000)    | $0.0044 | $0.01   | $0.10   | $5.00   |
| Price of data retrieval (per GiB)           | Free    | $0.01   | $0.03   | $0.02   |
| List and container operations (per 10,000) | $0.055  | $0.055  | $0.065  | $0.055  |
| All other operations (per 10,000)          | $0.0044 | $0.0044 | $0.0052 | $0.0044 |

The following table includes sample prices (fictitious) prices for each request to the Data Lake Storage endpoint (`dfs.core.windows.net`). For official prices, see [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/). 

| Price factor                                        | Hot      | Cool     | Cold     | Archive |
|-----------------------------------------------------|----------|----------|----------|---------|
| Price of write transactions (every 4MiB, per 10,000) | $0.0715  | $0.13    | $0.234   | $0.143  |
| Price of read transactions (every 4MiB, per 10,000)  | $0.0057  | $0.013   | $0.13    | $7.15   |
| Price of data retrieval (per GiB)                    | Free     | $0.01    | $0.03    | $0.022  |
| Iterative Read operations (per 10,000)              | $0.0715  | $0.0715  | $0.0845  | $0.0715 |

## Operations used for each endpoint

 Clients that upload to the Blob Service endpoint use the [Put Block](/rest/api/storageservices/put-block) operation to upload each block. After the final block is uploaded, clients commits those blocks by using the [Put Block List](/rest/api/storageservices/put-block-list) operation. Clients that use the Data Lake Storage endpoint upload each block by using the [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) operation with the action parameter set to `append`. After the final block is uploaded, clients commit those blocks by using the [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) operation with the action parameter set to `flush`. All of these operations are billed as _write_ operations.

## See also

- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
- [Map each REST operation to a price](map-rest-apis-transaction-categories.md)
- [Get started with AzCopy](../common/storage-use-azcopy-v10.md)
