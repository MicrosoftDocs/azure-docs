---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: include
ms.date: 01/17/2020
ms.author: tamram
ms.custom: "include file"
---

Azure Storage offers several types of storage accounts. Each type supports different features and has its own pricing model. Consider these differences before you create a storage account to determine the type of account that is best for your applications. The types of storage accounts are:

- **General-purpose v2 accounts**: Basic storage account type for blobs, files, queues, and tables. Recommended for most scenarios using Azure Storage.
- **General-purpose v1 accounts**: Legacy account type for blobs, files, queues, and tables. Use general-purpose v2 accounts instead when possible.
- **BlockBlobStorage accounts**: Storage accounts with premium performance characteristics for block blobs and append blobs. Recommended for scenarios with high transactions rates, or scenarios that use smaller objects or require consistently low storage latency.
- **FileStorage accounts**: Files-only storage accounts with premium performance characteristics. Recommended for enterprise or high performance scale applications.
- **BlobStorage accounts**: Legacy Blob-only storage accounts. Use general-purpose v2 accounts instead when possible.

The following table describes the types of storage accounts and their capabilities:

| Storage account type | Supported services                       | Supported performance tiers      | Supported access tiers         | Replication options               | Deployment model<div role="complementary" aria-labelledby="deployment-model"><sup>1</sup></div> | Encryption<div role="complementary" aria-labelledby="encryption"><sup>2</sup></div> |
|----------------------|------------------------------------------|-----------------------------|--------------------------------|-----------------------------------|------------------------------|------------------------|
| General-purpose V2   | Blob, File, Queue, Table, Disk, and Data Lake Gen2<div role="complementary" aria-labelledby="data-lake-gen2"><sup>6</sup></div>      | Standard, Premium<div role="complementary" aria-labelledby="premium-performance"><sup>5</sup></div> | Hot, Cool, Archive<div role="complementary" aria-labelledby="archive"><sup>3</sup></div> | LRS, GRS, RA-GRS, ZRS, GZRS (preview), RA-GZRS (preview)<div role="complementary" aria-labelledby="zone-redundant-storage"><sup>4</sup></div> | Resource Manager             | Encrypted              |
| General-purpose V1   | Blob, File, Queue, Table, and Disk       | Standard, Premium<div role="complementary" aria-labelledby="premium-performance"><sup>5</sup></div> | N/A                            | LRS, GRS, RA-GRS                  | Resource Manager, Classic    | Encrypted              |
| BlockBlobStorage   | Blob (block blobs and append blobs only) | Premium                       | N/A                            | LRS, ZRS<div role="complementary" aria-labelledby="zone-redundant-storage"><sup>4</sup></div>                               | Resource Manager             | Encrypted              |
| FileStorage   | File only | Premium                       | N/A                            | LRS, ZRS<div role="complementary" aria-labelledby="zone-redundant-storage"><sup>4</sup></div>                               | Resource Manager             | Encrypted              |
| BlobStorage         | Blob (block blobs and append blobs only) | Standard                      | Hot, Cool, Archive<div role="complementary" aria-labelledby="archive"><sup>3</sup></div> | LRS, GRS, RA-GRS                  | Resource Manager             | Encrypted              |

<div id="deployment-model"><sup>1</sup>Using the Azure Resource Manager deployment model is recommended. Storage accounts using the classic deployment model can still be created in some locations, and existing classic accounts continue to be supported. For more information, see <a href="https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-deployment-model">Azure Resource Manager vs. classic deployment: Understand deployment models and the state of your resources</a>.</div>

<div id="encryption"><sup>2</sup>All storage accounts are encrypted using Storage Service Encryption (SSE) for data at rest. For more information, see <a href="https://docs.microsoft.com/azure/storage/common/storage-service-encryption">Azure Storage Service Encryption for Data at Rest</a>.</div>

<div id="archive"><sup>3</sup>The Archive tier is available at level of an individual blob only, not at the storage account level. Only block blobs and append blobs can be archived. For more information, see <a href="https://docs.microsoft.com/azure/storage/blobs/storage-blob-storage-tiers">Azure Blob storage: Hot, Cool, and Archive storage tiers</a>.</div>

<div id="zone-redundant-storage"><sup>4</sup>Zone-redundant storage (ZRS) and geo-zone-redundant storage (GZRS/RA-GZRS) (preview) are available only for standard General-purpose V2, BlockBlobStorage, and FileStorage accounts in certain regions. For more information about ZRS, see <a href="https://docs.microsoft.com/azure/storage/common/storage-redundancy-zrs">Zone-redundant storage (ZRS): Highly available Azure Storage applications</a>. For more information about GZRS/RA-GZRS, see <a href="https://docs.microsoft.com/azure/storage/common/storage-redundancy-gzrs">Geo-zone-redundant storage for highly availability and maximum durability (preview)</a>. For more information about other replication options, see <a href="https://docs.microsoft.com/azure/storage/common/storage-redundancy">Azure Storage replication</a>.</div>

<div id="premium-performance"><sup>5</sup>Premium performance for general-purpose v2 and general-purpose v1 accounts is available for disk and page blob only. Premium performance for block or append blobs are only available on BlockBlobStorage accounts. Premium performance for files are only available on FileStorage accounts.</div>

<div id="data-lake-gen2"><sup>6</sup>Azure Data Lake Storage Gen2 is a set of capabilities dedicated to big data analytics, built on Azure Blob storage. Data Lake Storage Gen2 is only supported on General-purpose V2 storage accounts with Hierarchical namespace enabled. For more information on Data Lake Storage Gen2, see <a href="https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-introduction">Introduction to Azure Data Lake Storage Gen2</a>.</div>
