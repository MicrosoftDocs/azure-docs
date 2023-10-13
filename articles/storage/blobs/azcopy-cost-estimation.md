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

This article helps you estimate the cost to transfer blobs by using AzCopy. 

All calculations are based on a fictitious price. You can find each price in the [sample prices](#sample-prices) section at the end of this article. 

> [!IMPORTANT]
> These prices are meant only as examples, and shouldn't be used to calculate your costs. For official prices, see the [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) or [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/) pricing pages. For more information about how to choose the correct pricing page, see [Understand the full billing model for Azure Blob Storage](../common/storage-plan-manage-costs.md).

## The cost to upload

When you run the [azcopy copy](../common/storage-use-azcopy-blobs-upload.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) command, you'll specify a destination endpoint. That endpoint can be either a Blob Service endpoint (`blob.core.windows.net`) or a Data Lake Storage endpoint (`dfs.core.windows.net`) endpoint. This section calculates the cost of using each endpoint to upload **1,000** blobs that are **5 GiB** each in size.

### Cost of uploading to the Blob Service endpoint

If you upload data to the Blob Service endpoint, then AzCopy uploads each blob in 8-MiB blocks. 

AzCopy uses the [Put Block](/rest/api/storageservices/put-block) operation to upload each block. After the final block is uploaded, AzCopy commits those blocks by using the [Put Block List](/rest/api/storageservices/put-block-list) operation. Both operations are billed as write operations. 

The following table calculates the number of write operations required to upload these blobs. 

| Calculation | Value
|---|---|
| Number of MiB in 10 GiB | 5,120 |
| PutBlock operations per blob (5,120 MiB / 8-MiB block) | 640 |
| PutBlockList operations per blob | 1 |
| **Total write operations (1,000 * 641)** | **641,000** |

> [!TIP]
> You can reduce the number of operations by configuring AzCopy to use a larger block size.  

Using the [Sample prices](#sample-prices) that appear in this article, the following table calculates the cost to upload these blobs.

| Price factor                                        | Hot        | Cool      | Cold       | Archive   |
|-----------------------------------------------------|------------|-----------|------------|-----------|
| Price of a single write operation (price / 10,000)  | $0.0000055 | $0.00001  | $0.000018  | $0.00001  |
| **Total cost (641,000 * operation price)** | **$3.53**  | **$6.41** | **$11.54** | **$3.53** |

> [!NOTE]
> If you upload to the archive tier, each [Put Block](/rest/api/storageservices/put-block) operation is charged at the price of a **hot** write operation. Each [Put Block List](/rest/api/storageservices/put-block-list) operation is charged the price of an **archive** write operation.  

### Cost of uploading to the Data Lake Storage endpoint

If you upload data to the Data Lake Storage endpoint, then AzCopy uploads each blob in 4-MiB blocks. This value is nonconfigurable. 

AzCopy uses the [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) operation to upload each block, which is billed as a write operation.

The following table calculates the number of write operations required to upload these blobs. 

| Calculation | Value
|---|---|
| Number of MiB in 5 GiB | 5,120 |
| Path - Update operations per blob (5,120 MiB / 4-MiB block) | 1,280 |
| **Total write operations (1,000 * 1,280)** | **1,280,000** |

Using the [Sample prices](#sample-prices) that appear in this article, the following table calculates the cost to upload these blobs

| Price factor                                        | Hot         | Cool       | Cold       | Archive    |
|-----------------------------------------------------|-------------|------------|------------|------------|
| Price of a single write operation (price / 10,000)  | $0.00000715 | $0.000013  | $0.0000234 | $0.0000143 |
| **Total cost (1,280,000 * operation price)** | **$9.15**   | **$16.64** | **$29.95** | **$18.30** |

## The cost to download

When you run the [azcopy copy](../common/storage-use-azcopy-blobs-download.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) command,  you'll specify a source endpoint. That endpoint can be either a Blob Service endpoint (`blob.core.windows.net`) or a Data Lake Storage endpoint (`dfs.core.windows.net`) endpoint. This section calculates the cost of using each endpoint to download **1,000** blobs that are **5 GiB** each in size.

### Cost of downloading from the Blob Service endpoint

If you download blobs from the Blob Service endpoint, AzCopy uses the [List Blobs](/rest/api/storageservices/list-blobs) and [Get Blob](/rest/api/storageservices/get-blob) operation. If you download blobs from the cool or cold tier, you're also charged a data retrieval per GiB downloaded. 

Using the [Sample prices](#sample-prices) that appear in this article, the following table calculates the cost to download these blobs.

> [!NOTE]
> This table excludes the archive tier because you can't download directly from that tier. See [Blob rehydration from the archive tier](archive-rehydrate-overview.md).

| Price factor                                            | Hot          | Cool        | Cold        |
|---------------------------------------------------------|--------------|-------------|-------------|
| Price of a single list operation (price/ 10,000)        | $0.0000055   | $0.0000055  | $0.0000065  |
| **Cost of listing operations (1000 * operation price)** | **$0.0055**  | **$0.0055** | **$0.0065** |
| Price of a single read operation (price / 10,000)       | $0.00000044  | $0.000001   | $0.00001    |
| **Cost of read operations (1000 * operation price)**    | **$0.00044** | **$0.001**  | **$0.01**   |
| Price of data retrieval (per GiB)                       | Free         | $0.01       | $0.03       |
| **Cost of data retrieval (1000 * operation price)**     | **$0.00**    | **$5.00**   | **$15.00**  |
| **Total cost (list + read + retrieval)**                | **$0.0059**  | **$5.01**   | **$15.02**  |



### Cost of downloading from the Data Lake Storage endpoint

If you download blobs by using the Data Lake Storage endpoint, AzCopy reads each blob in 4-MiB blocks. This value is nonconfigurable. 

AzCopy uses the [Path - Read](/rest/api/storageservices/datalakestoragegen2/path/read) and [Path - List](/rest/api/storageservices/datalakestoragegen2/path/list) operation. If you download blobs from the cool or cold tier, you're also charged a data retrieval per GiB downloaded. 

The following table calculates the number of write operations required to upload the blobs. 

| Calculation | Value
|---|---|
| Number of MiB in 5 GiB | 5,120 |
| Path - Update operations per blob (5,120 MiB / 4-MiB block) | 1,280 |
| Total read operations (1000* 1,280) | **1,280,000** |

Using the [Sample prices](#sample-prices) that appear in this article, the following table calculates the cost to download these blobs.

> [!NOTE]
> This table excludes the archive tier because you can't download directly from that tier. See [Blob rehydration from the archive tier](archive-rehydrate-overview.md).

| Price factor                                                   | Hot         | Cool        | Cold         |
|----------------------------------------------------------------|-------------|-------------|--------------|
| Price of a single read operation (price / 10,000)              | $0.00000057 | $0.0000013  | $0.000013    |
| **Cost of read operations (1,280,000 * operation price)**      | **$0.73**   | **$1.66**   | **$16.64**   |
| Price of a single iterative read operation (price / 10,000)    | $0.00000715 | $0.00000715 | $0.00000845  |
| **Cost of iterative read operations (1000 * operation price)** | **$0.0072** | **$0.0072** | **$0.00845** |
| Price of data retrieval (per GiB)                              | Free        | $0.01       | $0.03        |
| **Cost of data retrieval (1000 * operation price)**            | **$0.00**   | **$10.00**  | **$30.00**   |
| **Total cost (read + iterative read + retrieval)**             | **$0.73**   | **$11.67**  | **$46.65**   |



## The cost to copy between containers

When you run the [azcopy copy](../common/storage-use-azcopy-blobs-copy.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) command, you'll specify a source and destination endpoint. Each endpoint must be a Blob Service endpoint (`blob.core.windows.net`). This section calculates the cost to copy **1,000** blobs that are **5 GiB** each in size.

> [!NOTE]
> Blobs in the archive tier can be copied only to an online tier. Because all of these examples assume the same tier for source and destination, the archive tier is excluded from these tables. 

### Cost of copying blobs within the same account

AzCopy uses the [Copy Blob](/rest/api/storageservices/copy-blob) operation to copy blobs to another container. You're billed only for a write operation that is based on the destination tier.

| Price factor                                       | Hot        | Cool        | Cold      |
|----------------------------------------------------|------------|-------------|-----------|
| Price of a single write operation (price / 10,000) | $0.0000055 | $0.00001    | $0.000018 |
| **Total cost (1000 * operation price)**            | **$3.53**  | **$0.0055** | **$0.01** |

### Cost of copying blobs to another account in the same region

AzCopy uses the [Copy Blob](/rest/api/storageservices/copy-blob) operation to copy blobs to a container in another account. To complete the transfer, you're billed for read operation that is based on the source tier and a write operation that is based on the destination tier. This example assumes both source and destination are in the same access tier.

| Price factor                                          | Hot          | Cool        | Cold       |
|-------------------------------------------------------|--------------|-------------|------------|
| Price of a single read operation (price / 10,000)     | $0.00000044  | $0.000001   | $0.00001   |
| **Cost of read operations (1,000 * operation price)** | **$0.00044** | **$0.001**  | **$0.01**  |
| Price of a single write operation (price / 10,000)    | $0.0000055   | $0.00001    | $0.000018  |
| **Cost to write (1000 * operation price)**            | **$3.53**    | **$0.0055** | **$0.01**  |
| Price of data retrieval (per GiB)                     | Free         | $0.01       | $0.03      |
| **Cost of data retrieval (1000 * operation price)**   | **$0.00**    | **$10.00**  | **$30.00** |
| **Total cost (read + write + retrieval)**             | **$3.53**    | **$10.01**  | **$30.02** |

### Cost of copying blobs to an account located in another region

This scenario is identical to the previous one except you are billed for network egress charges. 

| Price factor                                                    | Hot         | Cool        | Cold        |
|-----------------------------------------------------------------|-------------|-------------|-------------|
| Price of network egress (per GiB)                               | $0.02       | $0.02       | $0.02       |
| **Total cost of network egress (1000 * (5 * price of egress))** | **$100**    | **$100**    | **$100**    |
| **Total cost (read + write + retrieval + egress)**              | **$103.53** | **$110.01** | **$130.02** |

## The cost to synchronize changes

When you run the [azcopy sync](../common/storage-use-azcopy-blobs-synchronize.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) command, you'll specify a source and destination endpoint. Each endpoint must be a Blob Service endpoint (`blob.core.windows.net`).

> [!NOTE]
> Blobs in the archive tier can be copied only to an online tier. Because all of these examples assume the same tier for source and destination, the archive tier is excluded from these tables. 

### Cost to update a container with changes to a local file system

AzCopy uses the [List Blobs](/rest/api/storageservices/list-blobs) operation to find each blob at the destination. If the last modified time of a local blob is different than the last modified time of the blob in the container, then AzCopy performs the exact same tasks as described in the [Cost of uploading to the Blob Service endpoint](#cost-of-uploading-to-the-blob-service-endpoint) section in this article. 

This table takes the total cost calculated in the [Cost of uploading to the Blob Service endpoint](#cost-of-uploading-to-the-blob-service-endpoint) section, and adds the cost of the listing operation. This example assumes that all 1000 blobs listed were modified and then copied. In most cases, only some smaller portion of the total number blobs would be modified and then copied. In your model, you can use a more realistic proportion of modified blobs to total blobs. 

| Price factor                                            | Hot         | Cool         | Cold         |
|---------------------------------------------------------|-------------|--------------|--------------|
| Price of a single list operation (price/ 10,000)        | $0.0000055  | $0.0000055   | $0.0000065   |
| **Cost of listing operations (1000 * operation price)** | **$0.0055** | **$0.0055**  | **$0.0065**  |
| Cost to upload blobs (taken from previous example)      | $9.15       | $16.64       | $29.95       |
| **Total cost (listing + write)**                        | **$9.1555** | **$16.6455** | **$29.9565** |

### Cost to update a local file system with changes to a container

AzCopy uses the [List Blobs](/rest/api/storageservices/list-blobs) operation to find each blob at the destination. If the last modified time of a local blob is different than the last modified time of the blob in the container, then uses the [Get Blob](/rest/api/storageservices/get-blob) operation to download the blob to the local machine.

The costs associated with this scenario are identical to those described in the [Cost of downloading from the Blob Service endpoint](#cost-of-downloading-from-the-blob-service-endpoint) section of this article. However, only blobs that have been modified are downloaded.

### Cost to synchronize containers

AzCopy uses the [List Blobs](/rest/api/storageservices/list-blobs) operation to find each blob at the source and each blob at the destination. If the last modified times of these blobs differ from one another, then AzCopy performs the exact same tasks as described in the [The cost to copy between containers](#the-cost-to-copy-between-containers) section in this article. 

Using the [Sample prices](#sample-prices) that appear in this article, the following table calculates the cost to list 1000 blobs in each container

The following table shows the cost to list the blobs in each container.

| Price factor                                                                     | Hot        | Cool       | Cold       |
|----------------------------------------------------------------------------------|------------|------------|------------|
| Price of a single list operation (price/ 10,000)                                 | $0.0000055 | $0.0000055 | $0.0000065 |
| Cost to list blobs in the source container (1000 * price of list operation)      | $0.0055    | $0.0055    | $0.0065    |
| Cost to list blobs in the destination container (1000 * price of list operation) | $0.0055    | $0.0055    | $0.0065    |
| **Total cost to list blobs in each container**                                   | **$0.011** | **$0.011** | **$0.013** |

The following table shows the total cost of synchronizing changes for each scenario described in the [The cost to copy between containers](#the-cost-to-copy-between-containers) section. This table assumes that all 1000 blobs were modified and then copied. In your model, you can use a more realistic proportion of modified blobs to total blobs. 

| Scenario                                                                | Hot     | Cool    | Cold    |
|-------------------------------------------------------------------------|---------|---------|---------|
| Synchronize containers in the same account (listing cost + copy costs)  | $3.541  | $0.0165 | $0.023  |
| Synchronize containers in separate accounts (listing cost + copy costs) | $3.541  | $10.021 | $30.033 |
| Synchronize containers in separate regions (listing cost + copy costs)  | $107.06 | $120.02 | $160.04 |

## Summary of calculations

The following table contains all of the estimates presented in this article. All estimates are based on transferring **1000** blobs that are each **5 GiB** in size and use the sample prices listed in the next section.

| Scenario                                                           | Hot     | Cool     | Cold     | Archive |
|--------------------------------------------------------------------|---------|----------|----------|---------|
| Upload blobs (Blob Service endpoint)                               | $3.53   | $6.41    | $11.54   | $3.53   |
| Upload blobs (Data Lake Storage endpoint)                          | $9.15   | $16.64   | $29.95   | $18.30  |
| Download blobs (Blob Service endpoint)                             | $0.01   | $5.01    | $15.02   | N/A     |
| Download blobs (Data Lake Storage endpoint)                        | $0.73   | $11.67   | $46.65   | N/A     |
| Copy blobs                                                         | $3.53   | $0.0055  | $0.01    | N/A     |
| Copy blobs to another account                                      | $3.53   | $10.01   | $30.02   | N/A     |
| Copy blobs to an account in another region                         | $103.53 | $110.01  | $130.02  | N/A     |
| Update local file system with changes to a container<sup>1</sup>   | $9.1555 | $16.6455 | $29.9565 | N/A     |
| Update a container with changes to a local file system<sup>1</sup> | $0.01   | $5.01    | $15.02   | N/A     |
| Synchronize containers<sup>1</sup>                                 | $3.541  | $0.0165  | $0.023   | N/A     |
| Synchronize containers in separate accounts<sup>1</sup>            | $3.541  | $10.021  | $30.033  | N/A     |
| Synchronize containers in separate regions<sup>1</sup>             | $107.06 | $120.02  | $160.04  | N/A     |

<sup>1</sup>    To keep the example simple, the estimate assumes that all 1000 blobs listed were modified and then copied. In most cases, only some smaller portion of the total number blobs would be modified and then copied. 

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
| Iterative Write operations (per 10,000)             | $0.0715  | $0.13    | $0.234   | $0.143  |
| All other operations (per 10,000)                   | $0.00572 | $0.00572 | $0.00676 | $0.0052 |

## Operations used by AzCopy commands

The following table shows the operations that are used by each AzCopy command. To map each operation to a price, see [Map each REST operation to a price](map-rest-apis-transaction-categories.md).

> [!NOTE]
> Only commands that result to requests to the Blob Storage service appear in this table.

| Command | Scenario | REST operations (Blob Service endpoint) | REST operations (Data Lake Storage endpoint) |
|---------|----------|-----------------------------------------|----------------------------------------------|
| [azcopy bench](../common/storage-ref-azcopy-bench.md?toc=/azure/storage/blobs/toc.json) | Upload   | [Put Block](/rest/api/storageservices/put-block-list) and [Put Block from URL](/rest/api/storageservices/put-block-from-url) | [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update)   |
| [azcopy bench](../common/storage-ref-azcopy-bench.md?toc=/azure/storage/blobs/toc.json) | Download | [Put Blob](/rest/api/storageservices/put-blob) |  [Path - List](/rest/api/storageservices/datalakestoragegen2/path/list) and [Path - Read](/rest/api/storageservices/datalakestoragegen2/path/read)|
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Upload | [Put Block](/rest/api/storageservices/put-block-list) and [Put Block from URL](/rest/api/storageservices/put-block-from-url) | [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Download | [List Blobs](/rest/api/storageservices/list-blobs) and [Get Blob](/rest/api/storageservices/get-blob) | [Path - List](/rest/api/storageservices/datalakestoragegen2/path/list) and [Path - Read](/rest/api/storageservices/datalakestoragegen2/path/read) |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Perform a dry run | [List Blobs](/rest/api/storageservices/list-blobs) | [Path - List](/rest/api/storageservices/datalakestoragegen2/path/list) |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Copy from Amazon S3| [Put Blob from URL](/rest/api/storageservices/put-blob-from-url) | Not supported |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Copy from Google Cloud Storage | [Put Blob from URL](/rest/api/storageservices/put-blob-from-url) | Not supported |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Copy to another container |  [Copy Blob](/rest/api/storageservices/copy-blob) | Not supported | 
| [azcopy sync](../common/storage-ref-azcopy-sync.md?toc=/azure/storage/blobs/toc.json) | Update local with changes to container | [List Blobs](/rest/api/storageservices/list-blobs) and [Put Blob](/rest/api/storageservices/put-blob) | Not supported |
| [azcopy sync](../common/storage-ref-azcopy-sync.md?toc=/azure/storage/blobs/toc.json) | Update container with changes to local file system | [List Blobs](/rest/api/storageservices/list-blobs), [Put Block](/rest/api/storageservices/put-block-list), and [Put Block from URL](/rest/api/storageservices/put-block-from-url) | Not supported |
| [azcopy sync](../common/storage-ref-azcopy-sync.md?toc=/azure/storage/blobs/toc.json) | Synchronize containers | [List Blobs](/rest/api/storageservices/list-blobs) and [Copy Blob](/rest/api/storageservices/copy-blob) | Not supported |
| [azcopy set-properties](../common/storage-ref-azcopy-set-properties.md?toc=/azure/storage/blobs/toc.json) | Set blob tier | [Set Blob Tier](/rest/api/storageservices/set-blob-tier) | Not supported |
| [azcopy set-properties](../common/storage-ref-azcopy-set-properties.md?toc=/azure/storage/blobs/toc.json) | Set metadata | [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata)  | Not supported |
| [azcopy set-properties](../common/storage-ref-azcopy-set-properties.md?toc=/azure/storage/blobs/toc.json) | Set blob tags | [Set Blob Tags](/rest/api/storageservices/set-blob-tags)  |Not supported |
| [azcopy list](../common/storage-ref-azcopy-list.md?toc=/azure/storage/blobs/toc.json) | List blobs in a container| [List Blobs](/rest/api/storageservices/list-blobs) | [Filesystem - List](/rest/api/storageservices/datalakestoragegen2/filesystem/list)|
| [azcopy make](../common/storage-ref-azcopy-make.md?toc=/azure/storage/blobs/toc.json) | Create a container | [Create Container](/rest/api/storageservices/create-container) | [Filesystem - Create](/rest/api/storageservices/datalakestoragegen2/filesystem/create) |
| [azcopy remove](../common/storage-ref-azcopy-remove.md?toc=/azure/storage/blobs/toc.json) | Delete a container | [Delete Container](/rest/api/storageservices/delete-container) | [Filesystem - Delete](/rest/api/storageservices/datalakestoragegen2/filesystem/delete) |
| [azcopy remove](../common/storage-ref-azcopy-remove.md?toc=/azure/storage/blobs/toc.json) | Delete a blob | [Delete Blob](/rest/api/storageservices/delete-blob) | [Filesystem - Delete](/rest/api/storageservices/datalakestoragegen2/filesystem/delete) |

## See also

- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
- [Map each REST operation to a price](map-rest-apis-transaction-categories.md)
