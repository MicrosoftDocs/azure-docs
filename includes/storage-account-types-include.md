---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: include
ms.date: 03/23/2019
ms.author: tamram
ms.custom: "include file"
---

Azure Storage offers several types of storage accounts. Each type supports different features and has its own pricing model. Consider these differences before you create a storage account to determine the type of account that is best for your applications. The types of storage accounts are:

- **General-purpose v2 accounts**: Basic storage account type for blobs, files, queues, and tables. Recommended for most scenarios using Azure Storage.
- **General-purpose v1 accounts**: Legacy account type for blobs, files, queues, and tables. Use general-purpose v2 accounts instead when possible.
- **Block blob storage accounts**: Blob-only storage accounts with premium performance characteristics. Recommended for scenarios with high transactions rates, using smaller objects, or requiring consistently low storage latency.
- **FileStorage (preview) storage accounts**: Files-only storage accounts with premium performance characteristics. Recommended for enterprise or high performance scale applications.
- **Blob storage accounts**: Blob-only storage accounts. Use general-purpose v2 accounts instead when possible.

The following table describes the types of storage accounts and their capabilities:

| Storage account type | Supported services                       | Supported performance tiers      | Supported access tiers         | Replication options               | Deployment model<sup>1</sup> | Encryption<sup>2</sup> |
|----------------------|------------------------------------------|-----------------------------|--------------------------------|-----------------------------------|------------------------------|------------------------|
| General-purpose V2   | Blob, File, Queue, Table, and Disk       | Standard, Premium<sup>5</sup> | Hot, Cool, Archive<sup>3</sup> | LRS, ZRS<sup>4</sup>, GRS, RA-GRS | Resource Manager             | Encrypted              |
| General-purpose V1   | Blob, File, Queue, Table, and Disk       | Standard, Premium<sup>5</sup> | N/A                            | LRS, GRS, RA-GRS                  | Resource Manager, Classic    | Encrypted              |
| Block blob storage   | Blob (block blobs and append blobs only) | Premium                       | N/A                            | LRS                               | Resource Manager             | Encrypted              |
| FileStorage (preview)   | Files only | Premium                       | N/A                            | LRS                               | Resource Manager             | Encrypted              |
| Blob storage         | Blob (block blobs and append blobs only) | Standard                      | Hot, Cool, Archive<sup>3</sup> | LRS, GRS, RA-GRS                  | Resource Manager             | Encrypted              |

<sup>1</sup>Using the Azure Resource Manager deployment model is recommended. Storage accounts using the classic deployment model can still be created in some locations, and existing classic accounts continue to be supported. For more information, see [Azure Resource Manager vs. classic deployment: Understand deployment models and the state of your resources](../articles/azure-resource-manager/resource-manager-deployment-model.md).

<sup>2</sup>All storage accounts are encrypted using Storage Service Encryption (SSE) for data at rest. For more information, see [Azure Storage Service Encryption for Data at Rest](../articles/storage/common/storage-service-encryption.md).

<sup>3</sup>The Archive tier is available at level of an individual blob only, not at the storage account level. Only block blobs and append blobs can be archived. For more information, see [Azure Blob storage: Hot, Cool, and Archive storage tiers](../articles/storage/blobs/storage-blob-storage-tiers.md).

<sup>4</sup>Zone-redundant storage (ZRS) is available only for standard general-purpose v2 storage accounts. For more information about ZRS, see [Zone-redundant storage (ZRS): Highly available Azure Storage applications](../articles/storage/common/storage-redundancy-zrs.md). For more information about other replication options, see [Azure Storage replication](../articles/storage/common/storage-redundancy.md).

<sup>5</sup> Premium performance for general-purpose v2 and general-purpose v1 accounts is available for disk and page blob only.