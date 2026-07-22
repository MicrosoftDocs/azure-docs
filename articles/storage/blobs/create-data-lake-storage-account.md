---
title: Create a storage account for Data Lake Storage
titleSuffix: Azure Storage
description: Learn how to create a storage account for use with Azure Data Lake Storage.
author: normesta

ms.topic: how-to
ms.author: normesta
ms.reviewer: normesta
ms.date: 07/02/2026
ms.service: azure-data-lake-storage
# Customer intent: As a cloud architect, I want to create a storage account with a hierarchical namespace for Data Lake Storage, so that I can leverage its capabilities for scalable data management and analytics.
---

# Create a storage account to use with Azure Data Lake Storage

To use Data Lake Storage capabilities, create a storage account that has a hierarchical namespace.

For step-by-step guidance, see [Create a storage account](../common/storage-account-create.md?toc=/azure/storage/blobs/toc.json).

As you create the account, select the options described in this article.

## Choose a storage account type

The following types of storage accounts support Data Lake Storage capabilities:

- Standard general-purpose v2
- Premium block blob

For information about how to choose between them, see [storage account overview](../common/storage-account-overview.md?toc=/azure/storage/blobs/toc.json).

Choose between these two account types in the **Basics** tab of the **Create a storage account** page.

To create a standard general-purpose v2 account, select **Standard**. To create a premium block blob account, select **Premium**.

:::image type="content" source="./media/create-data-lake-storage-account/premium-block-blob-option.png" alt-text="Screenshot of the Premium and Standard performance options on the Basics tab of the Create a storage account page in the Azure portal.":::

## Enable the hierarchical namespace

While filling out the **Create a storage account** form, unlock Data Lake Storage capabilities by selecting the **Enable hierarchical namespace** setting in the **Advanced** tab. 

The following image shows this setting in the **Create a storage account** page.

:::image type="content" source="./media/create-data-lake-storage-account/hierarchical-namespace-feature.png" alt-text="Screenshot of the Enable hierarchical namespace setting in the Advanced tab of the Create a storage account page in Azure Data Lake Storage.":::

To enable Data Lake Storage capabilities on an existing account, see [Upgrade Azure Blob Storage with Azure Data Lake Storage capabilities](upgrade-to-data-lake-storage-gen2-how-to.md).

## Next steps

- [Storage account overview](../common/storage-account-overview.md)
- [Upgrade Azure Blob Storage with Azure Data Lake Storage capabilities](upgrade-to-data-lake-storage-gen2-how-to.md)
- [Access control in Azure Data Lake Storage](data-lake-storage-access-control.md)
