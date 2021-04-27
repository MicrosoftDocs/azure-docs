---
title: Enable soft delete for blobs
titleSuffix: Azure Storage 
description: Enable soft delete for blobs to protect blob data from accidental deletes or overwrites.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 03/27/2021
ms.author: tamram
ms.subservice: blobs 
ms.custom: "devx-track-azurecli"
---

# Enable soft delete for blobs

Blob soft delete protects an individual blob and its versions, snapshots, and metadata from accidental deletes or overwrites by maintaining the deleted data in the system for a specified period of time. During the retention period, you can restore the blob to its state at deletion. After the retention period has expired, the blob is permanently deleted. For more information about blob soft delete, see [Soft delete for blobs](soft-delete-blob-overview.md).

Blob soft delete is part of a comprehensive data protection strategy for blob data. To learn more about Microsoft's recommendations for data protection, see [Data protection overview](data-protection-overview.md).

## Enable blob soft delete

Blob soft delete is disabled by default for a new storage account. You can enable or disable soft delete for a storage account at any time by using the Azure portal, PowerShell, or Azure CLI.

# [Portal](#tab/azure-portal)

To enable blob soft delete for your storage account by using the Azure portal, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), navigate to your storage account.
1. Locate the **Data Protection** option under **Blob service**.
1. In the **Recovery** section, select **Turn on soft delete for blobs**.
1. Specify a retention period between 1 and 365 days. Microsoft recommends a minimum retention period of seven days.
1. Save your changes.

:::image type="content" source="media/soft-delete-blob-enable/blob-soft-delete-configuration-portal.png" alt-text="Screenshot showing how to enable soft delete in the Azure portal":::

# [PowerShell](#tab/azure-powershell)

To enable blob soft delete with PowerShell, call the [Enable-AzStorageBlobDeleteRetentionPolicy](/powershell/module/az.storage/enable-azstorageblobdeleteretentionpolicy) command, specifying the retention period in days.

The following example enables blob soft delete and sets the retention period to seven days. Remember to replace the placeholder values in brackets with your own values:

```azurepowershell
Enable-AzStorageBlobDeleteRetentionPolicy -ResourceGroupName <resource-group> `
    -StorageAccountName <storage-account> `
    -RetentionDays 7
```

To check the current settings for blob soft delete, call the [Get-AzStorageBlobServiceProperty](/powershell/module/az.storage/get-azstorageblobserviceproperty) command:

```azurepowershell
$properties = Get-AzStorageBlobServiceProperty -ResourceGroupName <resource-group> `
    -StorageAccountName <storage-account>
$properties.DeleteRetentionPolicy.Enabled
$properties.DeleteRetentionPolicy.Days
```

# [CLI](#tab/azure-CLI)

To enable blob soft delete with Azure CLI, call the [az storage account blob-service-properties update](/cli/azure/storage/account/blob-service-properties#az_storage_account_blob_service_properties_update) command, specifying the retention period in days.

The following example enables blob soft delete and sets the retention period to seven days. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage account blob-service-properties update --account-name <storage-account> \
    --resource-group <resource-group> \
    --enable-delete-retention true \
    --delete-retention-days 7
```

To check the current settings for blob soft delete, call the [az storage account blob-service-properties show](/cli/azure/storage/account/blob-service-properties#az_storage_account_blob_service_properties_show) command:

```azurecli-interactive
az storage account blob-service-properties show --account-name <storage-account> \
    --resource-group <resource-group>
```

---

## Next steps

- [Soft delete for blobs](soft-delete-blob-overview.md)
- [Manage and restore soft-deleted blobs](soft-delete-blob-manage.md)
