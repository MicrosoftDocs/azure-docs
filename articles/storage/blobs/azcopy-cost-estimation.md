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

Each section in this article contains an example and explains how cost is calculated along with the individual components that impact the cost estimate. Each calculation is based on fictitious prices. You can find these prices in the [sample prices](#sample-prices) section at the end of this article. 

> [!IMPORTANT]
> These prices are meant only as examples, and shouldn't be used to calculate your costs. For official prices, see the [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) or [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/) pricing pages. For more information about how to choose the correct pricing page, see [Understand the full billing model for Azure Blob Storage](../common/storage-plan-manage-costs.md).

## Calculate the cost to upload

The examples in this section calculates the cost to upload **1,000** blobs that are **5 GiB** each in size. 

When you run the [azcopy copy](../common/storage-use-azcopy-blobs-upload.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) command, you'll specify a destination endpoint. That endpoint can be either a Blob Service endpoint (`blob.core.windows.net`) or a Data Lake Storage endpoint (`dfs.core.windows.net`) endpoint. 

### Cost of uploading to the Blob Service endpoint

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

### Cost of uploading to the Data Lake Storage endpoint

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

The examples in this section calculate the cost to download **1,000** blobs that are **5 GiB** each in size.

When you run the [azcopy copy](../common/storage-use-azcopy-blobs-download.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) command,  you'll specify a source endpoint. That endpoint can be either a Blob Service endpoint (`blob.core.windows.net`) or a Data Lake Storage endpoint (`dfs.core.windows.net`) endpoint.

### Cost of downloading from the Blob Service endpoint

If you download blobs from the Blob Service endpoint, AzCopy uses the [List Blobs](/rest/api/storageservices/list-blobs) and [Get Blob](/rest/api/storageservices/get-blob) operation. If you download blobs from the cool or cold tier, you're also charged a data retrieval per GiB downloaded. 

Using the [Sample prices](#sample-prices) that appear in this article, the following table calculates the cost to download these blobs.

| Price factor                                            | Hot          | Cool        | Cold        |
|---------------------------------------------------------|--------------|-------------|-------------|
| Price of a single list operation (price/ 10,000)        | $0.0000055   | $0.0000055  | $0.0000065  |
| **Cost of listing operations (1000 * operation price)** | **$0.0055**  | **$0.0055** | **$0.0065** |
| Price of a single read operation (price / 10,000)       | $0.00000044  | $0.000001   | $0.00001    |
| **Cost of read operations (1000 * operation price)**    | **$0.00044** | **$0.001**  | **$0.01**   |
| Price of data retrieval (per GiB)                       | Free         | $0.01       | $0.03       |
| **Cost of data retrieval (1000 * operation price)**     | **$0.00**    | **$5.00**   | **$15.00**  |
| **Total cost (list + read + retrieval)**                | **$0.0059**  | **$5.01**   | **$15.02**  |

> [!NOTE]
> The table above excludes the archive tier because you can't download directly from that tier. See [Blob rehydration from the archive tier](archive-rehydrate-overview.md).

### Cost of downloading from the Data Lake Storage endpoint

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

The examples in this section calculate the cost to copy **1,000** blobs between containers. Each blob is **5 GiB** in size. 

When you run the [azcopy copy](../common/storage-use-azcopy-blobs-copy.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) command, you'll specify a source and destination endpoint. Each endpoint must be a Blob Service endpoint (`blob.core.windows.net`). 

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

## Calculate the cost to synchronize changes

When you run the [azcopy sync](../common/storage-use-azcopy-blobs-synchronize?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) command, you'll specify a source and destination endpoint. Each endpoint must be a Blob Service endpoint (`blob.core.windows.net`).

> [!NOTE]
> Blobs in the archive tier can be copied only to an online tier. Because all of these examples assume the same tier for source and destination, the archive tier is excluded from these tables. 

## Cost to update a container with changes to a local file system

AzCopy uses the [List Blobs](/rest/api/storageservices/list-blobs) operation to find each blob at the destination. If the last modified time of a local blob is different than the last modified time of the blob in the container, then AzCopy performs the exact same tasks as described in the [Cost of uploading to the Blob Service endpoint](#cost-of-uploading-to-the-blob-service-endpoint) section in this article. 

This table takes the total cost calculated in the [Cost of uploading to the Blob Service endpoint](#cost-of-uploading-to-the-blob-service-endpoint) section, and adds the cost of the listing operation. In your model, you can use a more realistic proportion of modified blobs to total blobs. 

| Price factor                                            | Hot         | Cool         | Cold         |
|---------------------------------------------------------|-------------|--------------|--------------|
| Price of a single list operation (price/ 10,000)        | $0.0000055  | $0.0000055   | $0.0000065   |
| **Cost of listing operations (1000 * operation price)** | **$0.0055** | **$0.0055**  | **$0.0065**  |
| Cost to upload blobs (taken from previous example)      | $9.15       | $16.64       | $29.95       |
| **Total cost (listing + write)**                        | **$9.1555** | **$16.6455** | **$29.9565** |

## Cost to update a local file system with changes to a container

AzCopy uses the [List Blobs](/rest/api/storageservices/list-blobs) operation to find each blob at the destination. If the last modified time of a local blob is different than the last modified time of the blob in the container, then uses the [Get Blob](/rest/api/storageservices/get-blob) operation to download the blob to the local machine.

The costs associated with this scenario are identical to those described in the [Cost of downloading from the Blob Service endpoint](#cost-of-downloading-from-the-blob-service-endpoint) section of this article. However, only blobs that have been modified are downloaded.

## Cost to update a container with changes to another container

AzCopy uses the [List Blobs](/rest/api/storageservices/list-blobs) operation to find each blob at the source and each blob at the destination. If the last modified time of these blobs differ from one another, then AzCopy performs the exact same tasks as described in the [Calculate the cost to copy between containers](#calculate-the-cost-to-copy-between-containers) section in this article. 

Using the [Sample prices](#sample-prices) that appear in this article, the following table calculates the cost to list 1000 blobs in each container

The following table shows the cost to list blobs in each container.

| Price factor                                                                     | Hot        | Cool       | Cold       |
|----------------------------------------------------------------------------------|------------|------------|------------|
| Price of a single list operation (price/ 10,000)                                 | $0.0000055 | $0.0000055 | $0.0000065 |
| Cost to list blobs in the source container (1000 * price of list operation)      | $0.0055    | $0.0055    | $0.0065    |
| Cost to list blobs in the destination container (1000 * price of list operation) | $0.0055    | $0.0055    | $0.0065    |
| **Total cost to list blobs in each container**                                   | **$0.011** | **$0.011** | **$0.013** |

The following table shows the total cost of synchronizing changes for each scenario described in the [Calculate the cost to copy between containers](#calculate-the-cost-to-copy-between-containers) section. This table assumes that all 1000 blobs were modified and then copied. In your model, you can use a more realistic proportion of modified blobs to total blobs. 

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

<sup>1</sup>    To keep these examples, these estimate assumes that all 1000 blobs listed were modified and then copied. In most cases, only some smaller portion of the total number blobs would be modified and then copied. 

## Sample prices

The following table includes sample (fictitious) prices for each request to the Blob Service endpoint (`blob.core.windows.net`). For official prices, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

| Price factor                               | Hot     | Cool    | Cold    | Archive |
|--------------------------------------------|---------|---------|---------|---------|
| Price of write transactions (per 10,000)   | $0.055  | $0.10   | $0.18   | $0.10   |
| Price of read transactions (per 10,000)    | $0.0044 | $0.01   | $0.10   | $5.00   |
| Price of data retrieval (per GB)           | Free    | $0.01   | $0.03   | $0.02   |
| List and container operations (per 10,000) | $0.055  | $0.055  | $0.065  | $0.055  |
| All other operations (per 10,000)          | $0.0044 | $0.0044 | $0.0052 | $0.0044 |

The following table includes sample prices (fictitious) prices for each request to the Data Lake Storage endpoint (`dfs.core.windows.net`). For official prices, see [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/). 

| Price factor                                        | Hot      | Cool     | Cold     | Archive |
|-----------------------------------------------------|----------|----------|----------|---------|
| Price of write transactions (every 4MB, per 10,000) | $0.0715  | $0.13    | $0.234   | $0.143  |
| Price of read transactions (every 4MB, per 10,000)  | $0.0057  | $0.013   | $0.13    | $7.15   |
| Price of data retrieval (per GB)                    | Free     | $0.01    | $0.03    | $0.022  |
| Iterative Read operations (per 10,000)              | $0.0715  | $0.0715  | $0.0845  | $0.0715 |
| Iterative Write operations (per 10,000)             | $0.0715  | $0.13    | $0.234   | $0.143  |
| All other operations (per 10,000)                   | $0.00572 | $0.00572 | $0.00676 | $0.0052 |

## Operations used by AzCopy commands

Each request made by AzCopy arrives to the service in the form of a REST operation. By knowing which operations AzCopy uses when you run an AzCopy command, you can determine the cost associated with running a command. The tables below map each AzCopy command to the operations that are called when you run that command. 

To determine the price of each operation, you must first determine how that operation is classified in terms of its type. That's because the pricing pages list prices only by operation type and not by each individual operation. To determine the type of each operation and map that operation to a price, see [Map each REST operation to a price](map-rest-apis-transaction-categories.md).

> [!NOTE]
> Only commands that result to requests to the Blob Storage service appear in this table. All other commands don't incur a charge from the Blob Storage service.

| Command      | Scenario | REST operations (Blob Service endpoint) | REST operations (Data Lake Storage endpoint) |
|--------------|----------|-------------------------|-----|
| azcopy bench | Upload   | [Put Block](/rest/api/storageservices/put-block-list) and [Put Block from URL](/rest/api/storageservices/put-block-from-url) | ?  |
| azcopy bench | Download | [Put Blob](/rest/api/storageservices/put-blob) |  ? |
| azcopy copy | Upload | [Put Block](/rest/api/storageservices/put-block-list) and [Put Block from URL](/rest/api/storageservices/put-block-from-url) | ? |
| azcopy copy | Download | GetBlock | ? |
| azcopy copy | Copy from Amazon S3| GetBlobFromUrl | ? |
| azcopy copy | Copy from Google Cloud Storage | GetBlobFromUrl | ?|
| azcopy copy | Copy to another container |  CopyBlob | ? | 
| azcopy copy | Perform a dry run | ListBlobs | ? |
| azcopy sync | Update local with changes to container | ListBlobs and [Put Blob](/rest/api/storageservices/put-blob) |
| azcopy sync | Update container with changes to local file system | ListBlobs, [Put Block](/rest/api/storageservices/put-block-list), and [Put Block from URL](/rest/api/storageservices/put-block-from-url) |
| azcopy sync | Synchronize containers | ListBlobs and CopyBlob |
| azcopy set-properties | Set blob tier | SetBlobTier |
| azcopy set-properties | Set metadata | SetBlobMetadata |
| azcopy set-properties | Set blob tags | SetBlobTags |
| azcopy list | ListContainers or ListBlobs |
| azcopy make | CreateContainer |
| azcopy remove | DeleteContainer or DeleteBlob |

## See also

- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
