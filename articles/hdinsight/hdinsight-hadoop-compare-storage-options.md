---
title: Compare storage options for use with Azure HDInsight clusters
description: Provides an overview of storage types and how they work with Azure HDInsight.
ms.service: hdinsight
ms.topic: conceptual
ms.custom: seoapr2020
ms.date: 06/12/2023
---

# Compare storage options for use with Azure HDInsight clusters

You can choose between a few different Azure storage services when creating HDInsight clusters:

* [Azure Blob storage with HDInsight](./overview-azure-storage.md)
* [Azure Data Lake Storage Gen2 with HDInsight](./overview-data-lake-storage-gen2.md)
* [Azure Data Lake Storage Gen1 with HDInsight](./overview-data-lake-storage-gen1.md)

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
|Azure Storage| Block Blob| Object | Block Blob | Premium | N/A| 3.6+ | Only HBase with accelerated writes|
|Azure Data Lake Storage Gen2| Block Blob| Hierarchical (filesystem) | Block Blob | Premium | N/A| 3.6+ | Only HBase with accelerated writes|

**For HDInsight clusters, only secondary storage accounts can be of type BlobStorage and Page Blob isn't a supported storage option.

For more information on Azure Storage account types, see [Azure storage account overview](../storage/common/storage-account-overview.md)

For more information on Azure Storage access tiers, see [Azure Blob storage: Premium (preview), Hot, Cool, and Archive storage tiers](../storage/blobs/access-tiers-overview.md)

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

*=This could be one or multiple Data Lake Storage Gen2, as long as they're all setup to use the same managed identity for cluster access.

> [!NOTE]
> Data Lake Storage Gen2 primary storage is not supported for Spark 2.1 or 2.2 clusters.

## Data replication

Azure HDInsight does not store customer data. The primary means of storage for a cluster are its associated storage accounts. You can attach your cluster to an existing storage account, or create a new storage account during the cluster creation process. If a new account is created, it will be created as a locally redundant storage (LRS) account, and will satisfy in-region data residency requirements including those specified in the [Trust Center](https://azuredatacentermap.azurewebsites.net).

You can validate that HDInsight is properly configured to store data in a single region by ensuring that the storage account associated with your HDInsight is LRS or another storage option mentioned on [Trust Center](https://azuredatacentermap.azurewebsites.net).

>[!NOTE]
> Upgrading the primary or secondary storage account of a running cluster with Azure Data Lake Storage Gen2 capabilities is not supported. To change the storage type of an existing HDInsight cluster to Data Lake Storage Gen2, you will need to recreate the cluster and select an hierarchical namespace enabled storage account.
 
## Next steps

* [Azure Storage overview in HDInsight](./overview-azure-storage.md)
* [Azure Data Lake Storage Gen1 overview in HDInsight](./overview-data-lake-storage-gen1.md)
* [Azure Data Lake Storage Gen2 overview in HDInsight](./overview-data-lake-storage-gen2.md)
* [Introduction to Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md)
* [Introduction to Azure Storage](../storage/common/storage-introduction.md)
