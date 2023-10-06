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

This article explains how to calculate the cost of using AzCopy to transfer data to and from Blob Storage and presents a few example scenarios.

## Elements that impact the cost

The cost to transfer data is derived from these components:

- The REST operations used by AzCopy to complete the transfer
- The size of each blob
- The number of blobs
- The size of each blob
- Network costs

Some light weight description of how these all factor here.

## Scenarios

Brief description

- Upload blobs

- Download blobs

- Copy between containers

- Synchronize changes

- Tag, metadata, and property updates

### Upload blobs

Scenario description

Show rest operations called

Cost table (Blob Storage endpoint)

- Mention 8 MB default with up to 100MB for Blob Storage

Cost table (Data Lake Storage endpoint)

- Gen2 endpoints charge at 4MB transactions.

Tips to optimize cost

- Increase the block size of transfers to 100 Mib (which is the maximum)

### Download blobs

Scenario description

Show rest operations called

Cost table (Blob Storage endpoint)

Cost table (Data Lake Storage endpoint)

- Gen2 endpoints charge at 4MB transactions.

Tips to optimize cost

### Copy between containers

Scenario description

Show rest operations called

Cost table (Blob Storage endpoint)

Cost table (Data Lake Storage endpoint)

- Gen2 endpoints charge at 4MB transactions.

Tips to optimize cost

### Synchronize changes

Scenario description

Show rest operations called

Cost table (Blob Storage endpoint)

Cost table (Data Lake Storage endpoint)

- Gen2 endpoints charge at 4MB transactions.

Tips to optimize cost

### Tag, metadata, and property updates

Scenario description

Show rest operations called

Cost table (Blob Storage endpoint)

Cost table (Data Lake Storage endpoint)

Tips to optimize cost

## Reference: Sample prices

This article uses the fictitious prices that appear in the following tables. 

> [!IMPORTANT]
> These prices are meant only as examples, and should not be used to calculate your costs.

### Requests to the Blob service endpoint (`blob.core.windows.net`)

| Price factor                               | Hot     | Cool    | Cold    | Archive |
|--------------------------------------------|---------|---------|---------|---------|
| Price of write transactions (per 10,000)   | $0.055  | $0.10   | $0.18   | $0.10   |
| Price of read transactions (per 10,000)    | $0.0044 | $0.01   | $0.10   | $5.00   |
| Price of data retrieval (per GB)           | Free    | $0.01   | $0.03   | $0.02   |
| List and container operations (per 10,000) | $0.055  | $.055   | $.065   | $.055   |
| All other operations (per 10,000)          | $0.0044 | $0.0044 | $0.0052 | $0.0044 |


For official prices, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Requests to the Data Lake Storage endpoint (`dfs.core.windows.net`)

| Price factor                                        | Hot      | Cool     | Cold     | Archive |
|-----------------------------------------------------|----------|----------|----------|---------|
| Price of write transactions (every 4MB, per 10,000) | $0.0715  | $0.13    | $0.234   | $0.143  |
| Price of read transactions (every 4MB, per 10,000)  | $0.0057  | $0.013   | $0.13    | $7.15   |
| Price of data retrieval (every 4MB, per GB)         | Free     | $0.01    | $0.03    | $0.022  |
| Iterative Read operations (per 10,000)              | $0.0715  | $0.0715  | $0.0845  | $0.0715 |
| Iterative Write operations (per 10,000)             | $0.0715  | $0.13    | $0.234   | $0.143  |
| All other operations (per 10,000)                   | $0.00572 | $0.00572 | $0.00676 | $0.0052 |

For official prices, see [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/). 

## Reference: Table of commands to REST operations

These tables show how each AzCopy command translates to one or more REST operations. To map each operation to a price, see [Map each REST operation to a price](map-rest-apis-transaction-categories.md).

### Requests to the Blob service endpoint (`blob.core.windows.net`)

| Command      | Scenario | REST operation called   |
|--------------|----------|-------------------------|
| azcopy bench | upload   | GetBlob                 |
| azcopy bench | download | PutBlock & PutBlockList |

### Requests to the Data Lake Storage endpoint (`dfs.core.windows.net`)

| Command      | Scenario | REST operation called   |
|--------------|----------|-------------------------|
| azcopy bench | upload   | GetBlob                 |
| azcopy bench | download | PutBlock & PutBlockList |

## See also

- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
