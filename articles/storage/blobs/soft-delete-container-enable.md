---
title: Enable and manage soft delete for containers
titleSuffix: Azure Storage
description: Enable container soft delete to more easily recover your data when it is erroneously modified or deleted.
author: normesta

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 07/06/2021
ms.author: normesta
---

# Enable and manage soft delete for containers

Container soft delete protects your data from being accidentally or erroneously modified or deleted. When container soft delete is enabled for a storage account, a container and its contents may be recovered after it has been deleted, within a retention period that you specify. For more details about container soft delete, see [Soft delete for containers](soft-delete-container-overview.md).

For end-to-end data protection, Microsoft recommends that you also enable soft delete for blobs and blob versioning. To learn how to also enable soft delete for blobs, see [Enable and manage soft delete for blobs](soft-delete-blob-enable.md). To learn how to enable blob versioning, see [Blob versioning](versioning-overview.md).

## Enable container soft delete

You can enable or disable container soft delete for the storage account at any time by using the Azure portal, PowerShell, Azure CLI, or an Azure Resource Manager template. Microsoft recommends setting the retention period for container soft delete to a minimum of seven days.

# [Portal](#tab/azure-portal)

To enable container soft delete for your storage account by using Azure portal, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), navigate to your storage account.
1. Locate the **Data protection** settings under **Data management**.
1. Select **Enable soft delete for containers**.
1. Specify a retention period between 1 and 365 days.
1. Save your changes.

    :::image type="content" source="media/soft-delete-container-enable/soft-delete-container-portal-configure.png" alt-text="Screenshot showing how to enable container soft delete in Azure portal":::

# [PowerShell](#tab/powershell)

To enable container soft delete with PowerShell, first install the [Az.Storage](https://www.powershellgallery.com/packages/Az.Storage) module, version 3.9.0 or later. Next, call the **Enable-AzStorageContainerDeleteRetentionPolicy** command and specify the number of days for the retention period. Remember to replace the values in angle brackets with your own values:

```azurepowershell-interactive
Enable-AzStorageContainerDeleteRetentionPolicy -ResourceGroupName <resource-group> `
    -StorageAccountName <storage-account> `
    -RetentionDays 7
```

To disable container soft delete, call the **Disable-AzStorageContainerDeleteRetentionPolicy** command.

# [Azure CLI](#tab/azure-cli)

To enable container soft delete with Azure CLI, first install Azure CLI, version 2.26.0 or later. Next, call the [az storage account blob-service-properties update](/cli/azure/storage/account/blob-service-properties#az-storage-account-blob-service-properties-update) command and specify the number of days for the retention period. Remember to replace the values in angle brackets with your own values:

```azurecli-interactive
az storage account blob-service-properties update \
    --enable-container-delete-retention true \
    --container-delete-retention-days 7 \
    --account-name <storage-account> \
    --resource-group <resource_group>
```

To disable container soft delete, specify `false` for the `--enable-container-delete-retention` parameter.

# [Template](#tab/template)

To enable container soft delete with an Azure Resource Manager template, create a template that sets the **containerDeleteRetentionPolicy** property. The following steps describe how to create a template in the Azure portal.

1. In the Azure portal, choose **Create a resource**.
1. In **Search the Marketplace**, type **template deployment**, and then press **ENTER**.
1. Choose **Template deployment**, choose **Create**, and then choose **Build your own template in the editor**.
1. In the template editor, paste in the following JSON. Replace the `<account-name>` placeholder with the name of your storage account.

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
1. Specify the resource group of the account, and then choose the **Review + create** button to deploy the template and enable container soft delete.

---

## View soft-deleted containers

When soft delete is enabled, you can view soft-deleted containers in the Azure portal. Soft-deleted containers are visible during the specified retention period. After the retention period expires, a soft-deleted container is permanently deleted and is no longer visible.

To view soft-deleted containers in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal and view the list of your containers.
1. Toggle the Show deleted containers switch to include deleted containers in the list.

    :::image type="content" source="media/soft-delete-container-enable/soft-delete-container-portal-list.png" alt-text="Screenshot showing how to view soft-deleted containers in the Azure portal.":::

## Restore a soft-deleted container

You can restore a soft-deleted container and its contents within the retention period. To restore a soft-deleted container in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal and view the list of your containers.
1. Display the context menu for the container you wish to restore, and choose **Undelete** from the menu.

    :::image type="content" source="media/soft-delete-container-enable/soft-delete-container-portal-restore.png" alt-text="Screenshot showing how to restore a soft-deleted container in Azure portal":::

## Next steps

- [Soft delete for containers](soft-delete-container-overview.md)
- [Soft delete for blobs](soft-delete-blob-overview.md)
- [Blob versioning](versioning-overview.md)
