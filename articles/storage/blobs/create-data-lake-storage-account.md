---
title: Create a storage account for Azure Data Lake Storage Gen2
description: Learn how to create a storage account for use with Azure Data Lake Storage Gen2.
author: normesta
ms.topic: how-to
ms.author: normesta
ms.date: 08/31/2020
ms.service: storage
ms.reviewer: stewu
ms.subservice: data-lake-storage-gen2
---

# Create a storage account to use with Azure Data Lake Storage Gen2

To use Data Lake Storage Gen2 capabilities, create a storage account that has a hierarchical namespace.

## Choose a storage account type

Data Lake Storage capabilities are supported in the following types of storage accounts:

- General-purpose v2
- BlockBlobStorage

> [!NOTE] To get the premium tier for Azure Data Lake Storage Gen2, choose the BlockBlobStorage account.

For information about how to choose between them, see [storage account overview](../common/storage-account-overview.md).

## Create a storage account with a hierarchical namespace

Create either a [general-purpose V2 account](../common/storage-account-create.md) or a [BlockBlobStorage](storage-blob-create-account-block-blob.md) account with the **Hierarchical namespace** setting enabled.

Unlock Data Lake Storage capabilities when you create the account by enabling the **Hierarchical namespace** setting in the **Advanced** tab of the **Create storage account** page. You must enable this setting when you create the account. You can't enable it afterwards.

The following image shows this setting in the **Create storage account** page.

> [!div class="mx-imgBorder"]
> ![Hierarchical namespace setting](./media/create-data-lake-storage-account/hierarchical-namespace-feature.png)

If you have an existing storage account that you want to use with Data Lake Storage, and the hierarchical namespace setting is disabled, you must migrate the data to a new storage account that has the setting enabled.

## Next steps

- [Storage account overview](../common/storage-account-overview.md)
- [Using Azure Data Lake Storage Gen2 for big data requirements](data-lake-storage-data-scenarios.md)
- [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md)