---
title: Enable and manage soft delete for containers (preview)
titleSuffix: Azure Storage 
description: Enable container soft delete (preview) to more easily recover your data when it is erroneously modified or deleted.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 07/15/2020
ms.author: tamram
ms.subservice: blobs
---

# Enable and manage soft delete for containers (preview)

Container soft delete (preview) protects your data from being accidentally or erroneously modified or deleted. When container soft delete is enabled for a storage account, a container and its contents may be recovered after it has been are deleted, within a retention period that you specify.

If there is a possibility that your data may accidentally be modified or deleted by an application or another storage account user, Microsoft recommends turning on container soft delete. This article shows how to enable soft delete for containers. For more details about container soft delete, see [Soft delete for containers (preview)](soft-delete-container-overview.md).

For end-to-end data protection, Microsoft recommends that you also enable soft delete for blobs and blob versioning (preview). To learn how to also enable soft delete for blobs, see [Enable and manage soft delete for blobs](soft-delete-blob-enable.md). To learn how to enable blob versioning, see [Blob versioning (preview)](versioning-overview.md).

## Enable container soft delete

You can enable or disable container soft delete for the storage account at any time by using either the Azure portal or an Azure Resource Manager template.

# [Portal](#tab/azure-portal)

To enable container soft delete for your storage account by using Azure portal, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), navigate to your storage account.
1. Locate the **Data Protection** option under **Blob service**.
1. Set the **Blob soft delete** property to *Enabled*.
1. Under **Retention policies**, specify how long soft-deleted blobs are retained by Azure Storage.
1. Save your changes.

:::image type="content" source="media/soft-delete-container-enable/soft-delete-container-portal.png" alt-text="Screenshot showing how to enable container soft delete in Azure portal":::

# [Template](#tab/template)

To enable container soft delete with an Azure Resource Manager template, create a template that sets the **containerDeleteRetentionPolicy** property. The following steps describe how to create a template in the Azure portal.

1. In the Azure portal, choose **Create a resource**.
1. In **Search the Marketplace**, type **template deployment**, and then press **ENTER**.
1. Choose **Template deployment**, choose **Create**, and then choose **Build your own template in the editor**.
1. In the template editor, paste in the following JSON. Replace the `<account-name>` placeholder with the name of your storage account.

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {},
      "variables": {},
      "resources": [
          { 
              "type": "Microsoft.Storage/storageAccounts/blobServices",
              "apiVersion": "2019-06-01",
              "name": "<account-name>/default",
              "properties": {
                  "containerDeleteRetentionPolicy": {
                      "enabled": true,
                      "days": 7
                  }
              }
          }
      ]
    }
    ```

1. Specify the retention period. The default value is 7.
1. Save the template.
1. Specify the resource group of the account, and then choose the **Purchase** button to deploy the template and enable blob versioning.

## Next steps

- [Soft delete for containers (preview)](soft-delete-container-overview.md)
- [Soft delete for blobs](soft-delete-blob-overview.md)
- [Blob versioning (preview)](versioning-overview.md)