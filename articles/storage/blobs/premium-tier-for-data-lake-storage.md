---
title: Premium tier for Azure Data Lake Storage | Microsoft Docs
description: Use the premium performance tier with Azure Data Lake Storage Gen2 
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 10/20/2020
ms.author: normesta
---

# Premium tier for Azure Data Lake Storage

Azure Data Lake Storage Gen2 now supports the [premium performance tier](storage-blob-performance-tiers.md#premium-performance). The premium performance tier is ideal for big data analytics applications and workloads that require low consistent latency and have a high number of transactions.  

> [!NOTE]
> Premium tier for Azure Data Lake Storage is generally available in all public cloud regions. Put exceptions here.

## Evaluating the cost impact

The premium performance tier has a higher storage costs but a lower transaction cost as compared to the standard performance tier. If your applications and workloads execute a large number of transactions (specifically write transactions), the premium performance tier might become very cost effective.

The following table demonstrates the cost-effectiveness of the premium tier for Azure Data Lake Storage. Each column heading represents the number of transactions in a month. Each row heading represents the percentage of transactions that are read-transactions. Each cell in the table shows the percentage of cost reduction associated with a read transaction percentage and the number of transactions executed. 

For example, if the number of transactions executed were 90M TB or higher and 70% of transactions were read transactions, the premium performance tier is more cost effective.

> [!div class="mx-imgBorder"]
> ![image goes here](./media/premium-tier-for-data-lake-storage/premium-performance-data-lake-storage-cost-analysis-table.png)

## Accessing feature availability 

Some Blob storage features might not be available or might only have partial support with the premium performance tier. For a complete list, see [Blob storage features available in Azure Data Lake Storage Gen2](data-lake-storage-supported-blob-storage-features). Then, review a list of [known issues](data-lake-storage-known-issues.md) to assess any gaps in functionality.

## Enabling the premium performance tier 

You can use the premium tier for Azure Data Lake Storage by creating a [BlockBlobStorage](storage-blob-create-account-block-blob.md) account with the **Hierarchical namespace** setting enabled. You can enable the **Hierarchical namespace** setting in the **Advanced** tab of the **Create storage account** page. You must enable this setting when you create the account. You can't enable it afterwards.

The following image shows this setting in the **Create storage account** page.

> [!div class="mx-imgBorder"]
> ![Hierarchical namespace setting](./media/create-data-lake-storage-account/hierarchical-namespace-feature.png)

## Next steps

- See the [bog announcement](http://www.microsoft.com) of Premium tier for Azure Data Lake Storage.