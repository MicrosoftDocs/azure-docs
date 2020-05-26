---
title: Compare storage options for use with Azure HDInsight clusters
description: Provides an overview of storage types and how they work with Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: seoapr2020
ms.date: 04/21/2020
---

# Compare storage options for use with Azure HDInsight clusters

You can choose between a few different Azure storage services when creating HDInsight clusters:

* [Azure Storage](./overview-azure-storage.md)
* [Azure Data Lake Storage Gen2](./overview-data-lake-storage-gen2.md)
* [Azure Data Lake Storage Gen1](./overview-data-lake-storage-gen1.md)

This article provides an overview of these storage types and their unique features.

## Storage types and features

The following table summarizes the Azure Storage services that are supported with different versions of HDInsight:

| Storage service | Account type | Namespace Type | Supported services | Supported performance tiers | Supported access tiers | HDInsight Version | Cluster type |
|---|---|---|---|---|---|---|---|
|Azure Data Lake Storage Gen2| General-purpose V2 | Hierarchical (filesystem) | Blob | Standard | Hot, Cool, Archive | 3.6+ | All except Spark 2.1 and 2.2|
|Azure Storage| General-purpose V2 | Object | Blob | Standard | Hot, Cool, Archive | 3.6+ | All |
|Azure Storage| General-purpose V1 | Object | Blob | Standard | N/A | All | All |
|Azure Storage| Blob Storage** | Object | Block Blob | Standard | Hot, Cool, Archive | All | All |
|Azure Data Lake Storage Gen1| N/A | Hierarchical (filesystem) | N/A | N/A | N/A | 3.6 Only | All except HBase |

**For HDInsight clusters, only secondary storage accounts can be of type BlobStorage and Page Blob isn't a supported storage option.

For more information on Azure Storage account types, see [Azure storage account overview](../storage/common/storage-account-overview.md)

For more information on Azure Storage access tiers, see [Azure Blob storage: Premium (preview), Hot, Cool, and Archive storage tiers](../storage/blobs/storage-blob-storage-tiers.md)

You can create clusters using combinations of services for primary and optional secondary storage. The following table summarizes the cluster storage configurations that are currently supported in HDInsight:

| HDInsight Version | Primary Storage | Secondary Storage | Supported |
|---|---|---|---|
| 3.6 & 4.0 | General Purpose V1, General Purpose V2 | General Purpose V1, General Purpose V2, BlobStorage(Block Blobs) | Yes |
| 3.6 & 4.0 | General Purpose V1, General Purpose V2 | Data Lake Storage Gen2 | No |
| 3.6 & 4.0 | Data Lake Storage Gen2* | Data Lake Storage Gen2 | Yes |
| 3.6 & 4.0 | Data Lake Storage Gen2* | General Purpose V1, General Purpose V2, BlobStorage(Block Blobs) | Yes |
| 3.6 & 4.0 | Data Lake Storage Gen2 | Data Lake Storage Gen1 | No |
| 3.6 | Data Lake Storage Gen1 | Data Lake Storage Gen1 | Yes |
| 3.6 | Data Lake Storage Gen1 | General Purpose V1, General Purpose V2, BlobStorage(Block Blobs) | Yes |
| 3.6 | Data Lake Storage Gen1 | Data Lake Storage Gen2 | No |
| 4.0 | Data Lake Storage Gen1 | Any | No |
| 4.0 | General Purpose V1, General Purpose V2 | Data Lake Storage Gen1 | No |

*=This could be one or multiple Data Lake Storage Gen2 accounts, as long as they're all setup to use the same managed identity for cluster access.

> [!NOTE]
> Data Lake Storage Gen2 primary storage is not supported for Spark 2.1 or 2.2 clusters.

## Next steps

* [Azure Storage overview](./overview-azure-storage.md)
* [Azure Data Lake Storage Gen1 overview](./overview-data-lake-storage-gen1.md)
* [Azure Data Lake Storage Gen2 overview](./overview-data-lake-storage-gen2.md)
* [Introduction to Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md)
* [Introduction to Azure Storage](../storage/common/storage-introduction.md)
