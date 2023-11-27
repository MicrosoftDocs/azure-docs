---
title: 'Estimate costs: AzCopy with Azure Blob Storage'
description: Learn how to estimate the cost to transfer data to, from, or between containers in Azure Blob Storage.  
services: storage
author: normesta
ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 11/27/2023
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

If you upload data to the Blob Service endpoint, then by default, AzCopy uploads each blob in 8-MiB blocks. This size is configurable.

AzCopy uses the [Put Block](/rest/api/storageservices/put-block) operation to upload each block. After the final block is uploaded, AzCopy commits those blocks by using the [Put Block List](/rest/api/storageservices/put-block-list) operation. Both operations are billed as _write_ operations. 

The following table calculates the number of write operations required to upload these blobs. 

| Calculation                                            | Value       |
|--------------------------------------------------------|-------------|
| Number of MiB in 5 GiB                                 | 5,120       |
| PutBlock operations per blob (5,120 MiB / 8-MiB block) | 640         |
| PutBlockList operations per blob                       | 1           |
| **Total write operations (1,000 * 641)**               | **641,000** |

> [!TIP]
> You can reduce the number of operations by configuring AzCopy to use a larger block size.  

After each blob is uploaded, AzCopy uses the [Get Blob Properties](/rest/api/storageservices/get-blob-properties) operation as part of validating the upload. The [Get Blob Properties](/rest/api/storageservices/get-blob-properties) operation is billed as an _All other operations_ operation. 

Using the [Sample prices](#sample-prices) that appear in this article, the following table calculates the cost to upload these blobs.

| Price factor                                                     | Hot         | Cool        | Cold         | Archive     |
|------------------------------------------------------------------|-------------|-------------|--------------|-------------|
| Price of a single write operation (price / 10,000)               | $0.0000055  | $0.00001    | $0.000018    | $0.00001    |
| **Cost of write operations (641,000 * operation price)**         | **$3.5255** | **$6.4100** | **$11.5380** | **$3.5255** |
| Price of a single _other_ operation (price / 10,000)             | $0.00000044 | $0.00000044 | $0.00000052  | $0.00000044 |
| **Cost to get blob properties (1000 * _other_ operation price)** | **$0.0004** | **$0.0004** | **$0.0005**  | **$0.0004** |
| **Total cost (write + properties)**                          | **$3.53**   | **$6.41**   | **$11.54**   | **$3.53**   |

> [!NOTE]
> If you upload to the archive tier, each [Put Block](/rest/api/storageservices/put-block) operation is charged at the price of a **hot** write operation. Each [Put Block List](/rest/api/storageservices/put-block-list) operation is charged the price of an **archive** write operation.  

### Cost of uploading to the Data Lake Storage endpoint

If you upload data to the Data Lake Storage endpoint, then AzCopy uploads each blob in 4-MiB blocks. This value is not configurable.

AzCopy uploads each block by using the [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) operation with the action parameter set to `append`. After the final block is uploaded, AzCopy commits those blocks by using the [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) operation with the action parameter set to `flush`. Both operations are billed as _write_ operations. 

The following table calculates the number of write operations required to upload these blobs. 

| Calculation | Value
|---|---|
| Number of MiB in 5 GiB | 5,120 |
| Path - Update (append) operations per blob (5,120 MiB / 4-MiB block) | 1,280 |
| Path - Update (flush) operations per blob | 1 |
| **Total write operations (1,000 * 1,281)** | **1,281,00** |

After each blob is uploaded, AzCopy uses the [Get Blob Properties](/rest/api/storageservices/get-blob-properties) operation as part of validating the upload. The [Get Blob Properties](/rest/api/storageservices/get-blob-properties) operation is billed as an _All other operations_ operation. 

Using the [Sample prices](#sample-prices) that appear in this article, the following table calculates the cost to upload these blobs

| Price factor                                               | Hot         | Cool         | Cold         | Archive      |
|------------------------------------------------------------|-------------|--------------|--------------|--------------|
| Price of a single write operation (price / 10,000)         | $0.00000715 | $0.000013    | $0.0000234   | $0.0000143   |
| **Cost of write operations (1,281,000 * operation price)** | **$9.1592** | **$16.6530** | **$29.9754** | **$18.3183** |
| Price of a single _other_ operation (price / 10,000)       | $0.00000044 | $0.00000044  | $0.00000052  | $0.00000044  |
| **Cost to get blob properties (1000 * operation price)**   | **$0.0004** | **$0.0004**  | **$0.0005**  | **$0.0004**  |
| **Total cost (write + properties)**                    | **$9.16**   | **$16.65**   | **$29.98**   | **$18.32**   |

## The cost to download

When you run the [azcopy copy](../common/storage-use-azcopy-blobs-download.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) command,  you'll specify a source endpoint. That endpoint can be either a Blob Service endpoint (`blob.core.windows.net`) or a Data Lake Storage endpoint (`dfs.core.windows.net`) endpoint. This section calculates the cost of using each endpoint to download **1,000** blobs that are **5 GiB** each in size.

### Cost of downloading from the Blob Service endpoint

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


### Cost of downloading from the Data Lake Storage endpoint

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


## The cost to copy between containers

When you run the [azcopy copy](../common/storage-use-azcopy-blobs-copy.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) command, you'll specify a source and destination endpoint. These endpoints can be either a Blob Service endpoint (`blob.core.windows.net`) or a Data Lake Storage endpoint (`dfs.core.windows.net`) endpoint. This section calculates the cost to copy **1,000** blobs that are **5 GiB** each in size.

> [!NOTE]
> Blobs in the archive tier can be copied only to an online tier. Because all of these examples assume the same tier for source and destination, the archive tier is excluded from these tables. 

### Cost of copying blobs within the same account

Regardless of which endpoint you specify (Blob Service or Data Lake Storage), AzCopy uses the [List Blobs](/rest/api/storageservices/list-blobs) to enumerate blobs at the source location. A [List Blobs](/rest/api/storageservices/list-blobs) is billed as a _List and create container_ operation. One [List Blobs](/rest/api/storageservices/list-blobs) operation returns up to 5,000 blobs. Therefore, in this example, only one [List Blobs](/rest/api/storageservices/list-blobs) operation is required. 

For each blob, AzCopy uses the [Get Blob Properties](/rest/api/storageservices/get-blob-properties) operation for both the source blob and the blob that is copied to the destination. The [Get Blob Properties](/rest/api/storageservices/get-blob-properties) operation is billed as an _All other operations_ operation. AzCopy uses the [Copy Blob](/rest/api/storageservices/copy-blob) operation to copy blobs to another container which is billed as a _write_ operation that is based on the destination tier.

| Price factor                                             | Hot            | Cool           | Cold           |
|----------------------------------------------------------|----------------|----------------|----------------|
| Price of a single list operation (price/ 10,000)         | $0.0000055     | $0.0000055     | $0.0000065     |
| **Cost of listing operations (1 * operation price)**     | **$0.0000055** | **$0.0000055** | **$0.0000065** |
| Price of a single other operations (price / 10,000)      | $0.00000044    | $0.00000044    | $0.00000052    |
| **Cost to get blob properties (2000 * operation price)** | **$0.00088**   | **$0.00088**   | **$0.00104**   |
| Price of a single write operation (price / 10,000)       | $0.0000055     | $0.00001       | $0.000018      |
| **Cost to write (1000 * operation price)**               | **$3.53**      | **$0.0055**    | **$0.01**      |
| **Total cost (listing + properties + write)**            | **$3.5309**    | **$0.0064**    | **$0.0110**    |

### Cost of copying blobs to another account in the same region

This scenario is identical to the previous one except that you're also billed for data retrieval and for read operation that is based on the source tier. 

| Price factor                                          | Hot          | Cool        | Cold        |
|-------------------------------------------------------|--------------|-------------|-------------|
| **Total from previous section**                       | **$3.5309**  | **$0.0064** | **$0.0110** |
| Price of a single read operation (price / 10,000)     | $0.00000044  | $0.000001   | $0.00001    |
| **Cost of read operations (1,000 * operation price)** | **$0.00044** | **$0.001**  | **$0.01**   |
| Price of data retrieval (per GiB)                     | Free         | $0.01       | $0.03       |
| **Cost of data retrieval (5 * operation price)**      | **$0.00**    | **$.05**    | **$.15**    |
| **Total cost (previous section + retrieval + read)**  | **$3.53134** | **$0.0574** | **$0.171**  |

### Cost of copying blobs to an account located in another region

This scenario is identical to the previous one except you are billed for network egress charges. 

| Price factor                                                    | Hot          | Cool        | Cold        |
|-----------------------------------------------------------------|--------------|-------------|-------------|
| **Total cost from previous section**                            | **$3.53134** | **$0.0574** | **$0.171**  |
| Price of network egress (per GiB)                               | $0.02        | $0.02       | $0.02       |
| **Total cost of network egress (5 * price of egress)** | **$.10**     | **$.10**    | **$.10**    |
| **Total cost (previous section + egress)**                      | **$3.5513**  | **$0.0774** | **$0.191** |

## The cost to synchronize changes

When you run the [azcopy sync](../common/storage-use-azcopy-blobs-synchronize.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) command, you'll specify a source and destination endpoint. These endpoints can be either a Blob Service endpoint (`blob.core.windows.net`) or a Data Lake Storage endpoint (`dfs.core.windows.net`) endpoint. 

> [!NOTE]
> Blobs in the archive tier can be copied only to an online tier. Because all of these examples assume the same tier for source and destination, the archive tier is excluded from these tables. 

### Cost to synchronize a container with a local file system

If you want to keep a container updated with changes to a local file system, then AzCopy performs the exact same tasks as described in the [Cost of uploading to the Blob Service endpoint](#cost-of-uploading-to-the-blob-service-endpoint) section in this article. Blobs are uploaded only if the last modified time of a local file is different than the last modified time of the blob in the container. Therefore, you are billed _write_ transactions only for blobs that are uploaded. 

If you want to keep a local file system updated with changes to a container, then AzCopy performs the exact same tasks as described in the [Cost of downloading from the Blob Service endpoint](#cost-of-downloading-from-the-blob-service-endpoint) section of this article. Blobs are downloaded only If the last modified time of a local blob is different than the last modified time of the blob in the container. Therefore, you are billed _read_ transactions only for blobs that are downloaded.

### Cost to synchronize containers

If you want to keep two containers synchronized, then AzCopy performs the exact same tasks as described in the [The cost to copy between containers](#the-cost-to-copy-between-containers) section in this article. A blob is copied only if the last modified time of a blob in the source container is different than the last modified time of a blob in the destination container. Therefore, you are billed _write_ and _read_ transactions only for blobs that are copied. 

The [azcopy sync](../common/storage-use-azcopy-blobs-synchronize.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) command uses the [List Blobs](/rest/api/storageservices/list-blobs) operation on both source and destination accounts when synchronizing containers that exist in separate accounts. 


## Summary of calculations

The following table contains all of the estimates presented in this article. All estimates are based on transferring **1000** blobs that are each **5 GiB** in size and use the sample prices listed in the next section.

| Scenario                                    | Hot      | Cool    | Cold    | Archive |
|---------------------------------------------|----------|---------|---------|---------|
| Upload blobs (Blob Service endpoint)        | $3.53    | $6.41   | $11.54  | $3.53   |
| Upload blobs (Data Lake Storage endpoint)   | $9.16    | $16.65  | $29.98  | $18.32  |
| Download blobs (Blob Service endpoint)      | $0.001   | $0.051  | $0.161  | N/A     |
| Download blobs (Data Lake Storage endpoint) | $0.731   | $1.716  | $16.804 | N/A     |
| Copy blobs                                  | $3.5309  | $0.0064 | $0.0110 | N/A     |
| Copy blobs to another account               | $3.53134 | $0.0574 | $0.171  | N/A     |
| Copy blobs to an account in another region  | $3.5513  | $0.0774 | $0.191  | N/A     |

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

## Operations used by AzCopy commands

The following table shows the operations that are used by each AzCopy command. To map each operation to a price, see [Map each REST operation to a price](map-rest-apis-transaction-categories.md).

### Commands that target the Blob Service Endpoint

| Command | Scenario | Operations |
|---------|----------|-----------------------------------------|
| [azcopy bench](../common/storage-ref-azcopy-bench.md?toc=/azure/storage/blobs/toc.json) | Upload   | [Put Block](/rest/api/storageservices/put-block-list) and [Put Block List](/rest/api/storageservices/put-block-list) |
| [azcopy bench](../common/storage-ref-azcopy-bench.md?toc=/azure/storage/blobs/toc.json) | Download | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Get Blob](/rest/api/storageservices/get-blob) |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Upload | [Put Block](/rest/api/storageservices/put-block-list) and [Put Block List](/rest/api/storageservices/put-block-list), [Get Blob Properties](/rest/api/storageservices/get-blob-properties) |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Download | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Get Blob](/rest/api/storageservices/get-blob) | 
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Perform a dry run | [List Blobs](/rest/api/storageservices/list-blobs) | 
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Copy from Amazon S3| [Put Blob from URL](/rest/api/storageservices/put-blob-from-url) |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Copy from Google Cloud Storage | [Put Blob from URL](/rest/api/storageservices/put-blob-from-url) |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Copy to another container |  [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Copy Blob](/rest/api/storageservices/copy-blob) |
| [azcopy sync](../common/storage-ref-azcopy-sync.md?toc=/azure/storage/blobs/toc.json) | Update local with changes to container | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Get Blob](/rest/api/storageservices/get-blob) |
| [azcopy sync](../common/storage-ref-azcopy-sync.md?toc=/azure/storage/blobs/toc.json) | Update container with changes to local file system | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), [Put Block](/rest/api/storageservices/put-block-list), and [Put Block List](/rest/api/storageservices/put-block-list) | 
| [azcopy sync](../common/storage-ref-azcopy-sync.md?toc=/azure/storage/blobs/toc.json) | Synchronize containers | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Copy Blob](/rest/api/storageservices/copy-blob) | 
| [azcopy set-properties](../common/storage-ref-azcopy-set-properties.md?toc=/azure/storage/blobs/toc.json) | Set blob tier | [Set Blob Tier](/rest/api/storageservices/set-blob-tier) |
| [azcopy set-properties](../common/storage-ref-azcopy-set-properties.md?toc=/azure/storage/blobs/toc.json) | Set metadata | [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata)  |
| [azcopy set-properties](../common/storage-ref-azcopy-set-properties.md?toc=/azure/storage/blobs/toc.json) | Set blob tags | [Set Blob Tags](/rest/api/storageservices/set-blob-tags)  |
| [azcopy list](../common/storage-ref-azcopy-list.md?toc=/azure/storage/blobs/toc.json) | List blobs in a container| [List Blobs](/rest/api/storageservices/list-blobs) |
| [azcopy make](../common/storage-ref-azcopy-make.md?toc=/azure/storage/blobs/toc.json) | Create a container | [Create Container](/rest/api/storageservices/create-container) |
| [azcopy remove](../common/storage-ref-azcopy-remove.md?toc=/azure/storage/blobs/toc.json) | Delete a container | [Delete Container](/rest/api/storageservices/delete-container) |
| [azcopy remove](../common/storage-ref-azcopy-remove.md?toc=/azure/storage/blobs/toc.json) | Delete a blob | [Delete Blob](/rest/api/storageservices/delete-blob) |

### Commands that target the Data Lake Storage endpoint

| Command | Scenario | Operations |
|---------|----------|-----------------------------------------|
| [azcopy bench](../common/storage-ref-azcopy-bench.md?toc=/azure/storage/blobs/toc.json) | Upload   | [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) (Append), and [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) (Flush)   |
| [azcopy bench](../common/storage-ref-azcopy-bench.md?toc=/azure/storage/blobs/toc.json) | Download | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Path - Read](/rest/api/storageservices/datalakestoragegen2/path/read)|
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Upload | [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update), and [Get Blob Properties](/rest/api/storageservices/get-blob-properties) |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Download |[List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Path - Read](/rest/api/storageservices/datalakestoragegen2/path/read) |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Perform a dry run | [List Blobs](/rest/api/storageservices/list-blobs) |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Copy from Amazon S3| Not supported |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Copy from Google Cloud Storage | Not supported |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Copy to another container | [List Blobs](/rest/api/storageservices/list-blobs), and [Copy Blob](/rest/api/storageservices/copy-blob). if --preserve-permissions-true, then [Path - Get Properties](/rest/api/storageservices/datalakestoragegen2/path/get-properties) (Get Access Control List) and [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) (Set access control) otherwise, [Get Blob Properties](/rest/api/storageservices/get-blob-properties). | 
| [azcopy sync](../common/storage-ref-azcopy-sync.md?toc=/azure/storage/blobs/toc.json) | Update local with changes to container | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Get Blob](/rest/api/storageservices/get-blob) |
| [azcopy sync](../common/storage-ref-azcopy-sync.md?toc=/azure/storage/blobs/toc.json) | Update container with changes to local file system | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) (Append), and [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) (Flush)|
| [azcopy sync](../common/storage-ref-azcopy-sync.md?toc=/azure/storage/blobs/toc.json) | Synchronize containers | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Copy Blob](/rest/api/storageservices/copy-blob) |
| [azcopy set-properties](../common/storage-ref-azcopy-set-properties.md?toc=/azure/storage/blobs/toc.json) | Set blob tier | Not supported |
| [azcopy set-properties](../common/storage-ref-azcopy-set-properties.md?toc=/azure/storage/blobs/toc.json) | Set metadata | Not supported |
| [azcopy set-properties](../common/storage-ref-azcopy-set-properties.md?toc=/azure/storage/blobs/toc.json) | Set blob tags | Not supported |
| [azcopy list](../common/storage-ref-azcopy-list.md?toc=/azure/storage/blobs/toc.json) | List blobs in a container| [List Blobs](/rest/api/storageservices/list-blobs)|
| [azcopy make](../common/storage-ref-azcopy-make.md?toc=/azure/storage/blobs/toc.json) | Create a container | [Filesystem - Create](/rest/api/storageservices/datalakestoragegen2/filesystem/create) |
| [azcopy remove](../common/storage-ref-azcopy-remove.md?toc=/azure/storage/blobs/toc.json) | Delete a container | [Filesystem - Delete](/rest/api/storageservices/datalakestoragegen2/filesystem/delete) |
| [azcopy remove](../common/storage-ref-azcopy-remove.md?toc=/azure/storage/blobs/toc.json) | Delete a blob | [Filesystem - Delete](/rest/api/storageservices/datalakestoragegen2/filesystem/delete) |

## See also

- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
- [Map each REST operation to a price](map-rest-apis-transaction-categories.md)
- [Get started with AzCopy](../common/storage-use-azcopy-v10.md)
