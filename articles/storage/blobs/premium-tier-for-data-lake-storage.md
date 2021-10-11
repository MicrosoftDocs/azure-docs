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

Azure Data Lake Storage Gen2 now supports the [premium performance tier](storage-blob-performance-tiers.md#premium-performance). The premium performance tier is ideal for big data analytics applications and workloads that require low consistent latency and have a high number of transactions.

## Workloads that can benefit from the premium performance tier

Example workloads include interactive workloads, IoT, streaming analytics, artificial intelligence, and machine learning. To learn more about the performance and cost advantages of using this tier, and to read about real world examples of how other customers that have used the premium tier, see [Premium performance tier for Azure block blob storage](storage-blob-block-blob-premium.md).

## Feature availability

Some Blob storage features might not be available or might only have partial support with the premium performance tier. For a complete list, see [Blob storage features available in Azure Data Lake Storage Gen2](./storage-feature-support-in-storage-accounts.md). Then, review a list of [known issues](data-lake-storage-known-issues.md) to assess any gaps in functionality.

## Enabling the premium performance tier

You can use the premium tier for Azure Data Lake Storage by creating a BlockBlobStorage account with the **Hierarchical namespace** setting **enabled**. For complete guidance, see [Create a BlockBlobStorage account](../common/storage-account-create.md) account.

When you create the account, make sure to choose the **Premium** performance option and the **BlockBlobStorage** account kind.

> [!div class="mx-imgBorder"]
> ![Create blockblobstorageacount](./media/premium-tier-for-data-lake-storage/create-block-blob-storage-account.png)

Enable the **Hierarchical namespace** setting in the **Advanced** tab of the **Create storage account** page. You must enable this setting when you create the account. You can't enable it afterwards.

The following image shows this setting in the **Create storage account** page.

> [!div class="mx-imgBorder"]
> ![Hierarchical namespace setting](./media/create-data-lake-storage-account/hierarchical-namespace-feature.png)

## Next steps

Use the premium tier for Azure Data Lake Storage with your favorite analytics service such as Azure Databricks, Azure HDInsight and Azure Synapse Analytics. See [Tutorials that use Azure services with Azure Data Lake Storage Gen2](data-lake-storage-integrate-with-services-tutorials.md).
