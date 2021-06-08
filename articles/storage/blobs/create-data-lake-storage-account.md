---
title: Create a storage account for Azure Data Lake Storage Gen2
description: Learn how to create a storage account for use with Azure Data Lake Storage Gen2.
author: normesta
ms.topic: how-to
ms.author: normesta
ms.date: 04/27/2021
ms.service: storage
ms.reviewer: stewu
ms.subservice: data-lake-storage-gen2
---

# Create a storage account to use with Azure Data Lake Storage Gen2

To use Data Lake Storage Gen2 capabilities, create a storage account that has a hierarchical namespace.

For step-by-step guidance, see [Create a storage account](../common/storage-account-create.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json). 

As you create the account, make sure to select the options described in this article.

## Choose a storage account type

Data Lake Storage capabilities are supported in the following types of storage accounts:

- Standard general-purpose v2
- Premium block blob

For information about how to choose between them, see [storage account overview](../common/storage-account-overview.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json).

You can choose between these two types of accounts in the **Basics** tab of the **Create a storage account** page. 

To create a standard general-purpose v2 account, select **Standard**.

To create a premium block blob account, select **Premium**. Then, in the **Premium account type** dropdown list, select **Block blobs**. 

> [!div class="mx-imgBorder"]
> ![Premium block blob option](./media/create-data-lake-storage-account/premium-block-blob-option.png)

## Enable the hierarchical namespace

Unlock Data Lake Storage capabilities by selecting the **enable hierarchical namespace** setting in the **Advanced** tab of the **Create storage account** page. You must enable this setting when you create the account. You can't enable it afterwards.

The following image shows this setting in the **Create storage account** page.

> [!div class="mx-imgBorder"]
> ![Hierarchical namespace setting](./media/create-data-lake-storage-account/hierarchical-namespace-feature.png)

If you have an existing storage account that you want to use with Data Lake Storage and the hierarchical namespace setting is disabled, you must migrate the data to a new storage account that has the setting enabled.

> [!NOTE]
> **Data protection** and hierarchical namespace can't be enabled simultaneously.

## Next steps

- [Storage account overview](../common/storage-account-overview.md)
- [Using Azure Data Lake Storage Gen2 for big data requirements](data-lake-storage-data-scenarios.md)
- [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md)