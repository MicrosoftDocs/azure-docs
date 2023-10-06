---
title: Estimate the cost of AzCopy transfers (Azure Blob Storage)
description: Learn how to calculate the cost of transferring data by using AzCopy. 
services: storage
author: normesta
ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 10/05/2023
ms.author: normesta
ms.custom: subject-cost-optimization
---

# Estimate the cost of AzCopy transfers

This article explains how to calculate the cost of using AzCopy to transfer data to, from, or between Azure Blob Storage containers.

## Cost components

These components impact cost in all transfer scenarios

- The number of blobs

- The size of each blob

- The REST operations used by AzCopy to complete the transfer

- The block size used by AzCopy to upload files. This component impacts only upload scenarios.

- Network egress charges. This component applies only when you copy blobs between regions.

## Estimate the cost to upload

You upload blobs by using the `azcopy copy` command. For examples, see [Upload files to Azure Blob storage by using AzCopy](./common/storage-use-azcopy-blobs-upload.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json).

| Cost component | Value |
|--|---|
| Number of blobs | 1,000,000 |
| Size of each blob | 10 GiB |
| Network egress charge | None |

### Transfers to the Blob Service endpoint

To transfer to the Blob Storage endpoint, you use`blob.core.windows.net` URI in your command (For example: `azcopy copy 'C:\myDirectory\myTextFile.txt' 'https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt'`).

These components apply to transferring to this endpoint.

| Cost component | Value |
|--|---|
| REST operations | PutBlock & PutBlockList |
| Block size | 8 MiB |

Put calculation table here.

### Transfers to the Data Lake Storage endpoint

Put stuff here.

## Estimate the cost to download

Scenario description

Show rest operations called

Cost table (Blob Storage endpoint)

Cost table (Data Lake Storage endpoint)

- Gen2 endpoints charge at 4MB transactions.

Tips to optimize cost

## Estimate the cost to copy between containers

Scenario description

Show rest operations called

Cost table (Blob Storage endpoint)

Cost table (Data Lake Storage endpoint)

- Gen2 endpoints charge at 4MB transactions.

Tips to optimize cost

## Estimate the cost to synchronize changes

Scenario description

Show rest operations called

Cost table (Blob Storage endpoint)

Cost table (Data Lake Storage endpoint)

- Gen2 endpoints charge at 4MB transactions.

Tips to optimize cost

## Estimate the cost to update tags, metadata, and properties

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
