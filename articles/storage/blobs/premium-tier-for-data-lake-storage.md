---
title: Premium tier for Azure Data Lake Storage
description: Use the premium performance tier with Azure Data Lake Storage Gen2
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 01/11/2021
ms.author: normesta
---

# Premium tier for Azure Data Lake Storage

Azure Data Lake Storage Gen2 now supports [premium block blob storage accounts](storage-blob-block-blob-premium.md). Premium block blob storage accounts are ideal for big data analytics applications and workloads that require low consistent latency and have a high number of transactions.

Example workloads include interactive workloads, IoT, streaming analytics, artificial intelligence, and machine learning. To learn more about the performance and cost advantages of using a premium block blob storage account, and to read about real world examples of how other customers that have used this type of account, see [Premium block blob storage accounts](storage-blob-block-blob-premium.md).

## Feature availability

Some Blob storage features might not be available or might only have partial support with premium block blob storage accounts. For a complete list, see [Blob storage features available in Azure Data Lake Storage Gen2](./storage-feature-support-in-storage-accounts.md). Then, review a list of [known issues](data-lake-storage-known-issues.md) to assess any gaps in functionality.

## Getting started

You can use the premium tier for Azure Data Lake Storage by creating a premium block blob storage account with the **Hierarchical namespace** setting **enabled**. 

Make sure to choose the **Premium** performance option and the **Block blobs** account type as you create the account.

> [!div class="mx-imgBorder"]
> ![Create block blob storage account](./media/storage-blob-block-blob-premium/create-block-blob-storage-account.png)

To unlock Azure Data Lake Storage Gen2 capabilities, enable the **Hierarchical namespace** setting in the **Advanced** tab of the **Create storage account** page. 

The following image shows this setting in the **Create storage account** page.

> [!div class="mx-imgBorder"]
> ![Hierarchical namespace setting](./media/create-data-lake-storage-account/hierarchical-namespace-feature.png)

For complete guidance, see [Create a storage account](../common/storage-account-create.md) account.

You can't convert an existing standard general-purpose v2 storage account to a premium block blob storage account. To migrate to a premium block blob storage account, you must create a premium block blob storage account, and migrate the data to the new account. To copy blobs between storage accounts, you can use the latest version of the [AzCopy](../common/storage-use-azcopy-v10.md#transfer-data) command-line tool. Other tools such as Azure Data Factory are also available for data movement and transformation.

## Next steps

Use the premium tier for Azure Data Lake Storage with your favorite analytics service such as Azure Databricks, Azure HDInsight and Azure Synapse Analytics. See [Tutorials that use Azure services with Azure Data Lake Storage Gen2](data-lake-storage-integrate-with-services-tutorials.md).
