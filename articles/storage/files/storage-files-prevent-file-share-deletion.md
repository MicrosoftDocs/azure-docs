---
title: Azure file share soft delete
description: Learn about soft delete for Azure Files and how you can use it for data recovery and preventing accidental deletion of Azure file shares.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 01/21/2025
ms.author: kendownie
services: storage
# Customer intent: As a cloud storage administrator, I want to enable soft delete for Azure file shares, so that I can recover files and protect against accidental deletions in my storage account.
---

# Azure file share soft-delete
Azure Files offers soft delete, which allows you to recover your file share if you mistakenly deleted it.

## Applies to
| Management model | Billing model | Media tier | Redundancy | SMB | NFS |
|-|-|-|-|:-:|:-:|
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## How soft delete works
When soft delete is enabled, deleted file shares are retained in a soft deleted state for the defined retention period before being permanently deleted. When you undelete a file share, the file share and all of contents, including snapshots, are restored to their state prior to deletion. 

> [!IMPORTANT]
> Soft delete only works on a file share level. If you want to be able to restore deleted files, you can use [share snapshots](storage-snapshots-files.md) or [Azure file share backup](../../backup/azure-file-share-backup-overview.md).

Soft delete for file shares is enabled at the storage account level so the soft delete settings apply to all file shares within a storage account. New storage accounts have soft delete enabled by default, but you can enable or disable soft delete as desired for new or existing storage accounts. If you disable soft delete, any file shares deleted before disabling soft delete can still be undeleted.

By default, the retention period for file shares is 7 days, but you can specify any retention period between 1 and 365 days. The retention period clock starts when the file share is deleted. You can change the soft delete retention period at any time. Shares deleted before the retention period update expire based on the retention period that was configured when that data was deleted.

To permanently delete a file share in a soft delete state before its expiry time, you must undelete the share, disable soft delete, and then delete the share again. If desired, remember to reenable soft delete for the storage account to protect other file shares from accidental deletion.

For soft-deleted provisioned file shares, the file share quota (the provisioned size of a file share) is used in the total storage account quota calculation until the soft-deleted share expiry date, when the share is fully deleted.

### Billing
Billing for soft delete depends on the billing model of the file share. For more information, see the following:

- [Provisioned v2 soft-delete](./understanding-billing.md#provisioned-v2-soft-delete)
- [Provisioned v1 soft-delete](./understanding-billing.md#provisioned-v1-soft-delete)
- [Pay-as-you-go soft-delete](./understanding-billing.md#pay-as-you-go-soft-delete)

## Toggle soft delete settings
The following sections show how to enable and use soft delete for Azure file shares on an existing storage account:

# [Portal](#tab/azure-portal)
1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your storage account and select **File shares** under **Data storage**.
1. Select **Disabled** next to **Soft delete**.
1. Select **Enabled** for **Soft delete for all file shares**.
1. Under **File share retention period in days**, use the slider to specify a number between 1 and 365 days.
1. Select **Save** to confirm your data retention settings.

   :::image type="content" source="media/storage-how-to-recover-deleted-account/files-enable-soft-delete-new-ui.png" alt-text="Screenshot of the storage account soft delete settings pane. Highlighting the file shares soft delete section, enable toggle, set a retention period, and save. This enables soft delete for all file shares in your storage account.":::

# [PowerShell](#tab/azure-powershell)
To enable soft delete, you must update the settings for all Azure file shares, also known as the `FileService` properties. The following example enables soft delete for all file shares in a storage account. Remember to replace `<resource-group>` and `<storage-account>` with the appropriate values for your environment.

```PowerShell
$resourceGroupName = "<resource-group>"
$storageAccountName = "<storage-account>"

Update-AzStorageFileServiceProperty `
    -ResourceGroupName $resourceGroupName `
    -StorageAccountName $storageAccountName `
    -EnableShareDeleteRetentionPolicy $true `
    -ShareRetentionDays 7
```

You can verify if soft delete is enabled and view its retention policy with the following command:

```PowerShell
Get-AzStorageFileServiceProperty `
    -ResourceGroupName $resourceGroupName `
    -StorageAccountName $storageAccountName
```

# [Azure CLI](#tab/azure-cli)
To enable soft delete, you must update a file client's service properties. The following example enables soft delete for all file shares in a storage account. Remember to replace `<resource-group>` and `<storage-account>` with the appropriate values for your environment.

```azurecli
resourceGroupName="<resource-group>"
storageAccountName="<storage-account>"

az storage account file-service-properties update \
    --resource-group $resourceGroupName \
    --account-name $storageAccountName \
    --enable-delete-retention true \
    --delete-retention-days 7
```

You can verify if soft delete is enabled and view its retention policy with the following command:

```azurecli
az storage account file-service-properties show \
    -resource-group $resourceGroupName \
    -account-name $storageAccountName
```
---

## Restore soft deleted file share
# [Portal](#tab/azure-portal)
To restore a soft deleted file share:

1. Navigate to your storage account and select **File shares**.
1. On the file share blade, enable **Show deleted shares** to display any shares that are soft deleted.

    This displays any shares currently in a **Deleted** state.

    :::image type="content" source="media/storage-how-to-recover-deleted-account/undelete-file-share.png" alt-text="Screenshot of the undelete option on a deleted file share in the Azure portal.":::

1. Select the share and select **undelete** to restore the share.

    You can confirm the share is restored when its status switches to **Active**.

    :::image type="content" source="media/storage-how-to-recover-deleted-account/restored-file-share.png" alt-text="If the status column, the column next to the name column, is set to Active, then your file share has been restored.":::

# [PowerShell](#tab/azure-powershell)
To restore a soft deleted file share, you must first get the `-DeletedShareVersion` value of the share. To get that value, use the following command to list out all the deleted shares for your storage account.

```PowerShell
Get-AzRmStorageShare `
    -ResourceGroupName $resourceGroupName `
    -StorageAccountName $storageAccountName `
    -IncludeDeleted
```

Once you identify the share you want to restore, you can use the following command to restore it:

```PowerShell
Restore-AzRmStorageShare `
    -ResourceGroupName $resourceGroupName `
    -StorageAccountName $storageAccountName `
    -DeletedShareVersion 01D5E2783BDCDA97 # replace with your deleted version number
```

# [Azure CLI](#tab/azure-cli)
To restore a soft deleted file share, you must first get the `--deleted-version` value of the share. To get that value, use the following command to list out all the deleted shares for your storage account.

```azurecli
az storage share-rm list \
    --resource-group $resourceGroupName \
    --storage-account $storageAccountName \
    --include-deleted
```

Once you identify the share you'd like to restore, you can restore it with the following command:

```azurecli
az storage share-rm restore -n deletedshare --deleted-version 01D64EB9886F00C4 -g yourResourceGroup --storage-account yourStorageaccount
```

---

## Disable soft delete
If you want to stop using soft delete, follow these instructions. To permanently delete a file share that's been soft deleted, you must undelete the share, disable soft delete, and then delete the share again. 

# [Portal](#tab/azure-portal)

1. Navigate to your storage account and select **File shares** under **Data storage**.
1. Select **Enabled** next to **Soft delete**.
1. Select **Disabled** for **Soft delete for all file shares**.
1. Select **Save** to confirm your data retention settings.

   :::image type="content" source="media/storage-how-to-recover-deleted-account/files-disable-soft-delete.png" alt-text="Disabling soft delete allows you to immediately and permanently delete any file shares in your storage account.":::

# [PowerShell](#tab/azure-powershell)
You can use the following command to disable soft delete on your storage account.

```PowerShell
Update-AzStorageFileServiceProperty `
    -ResourceGroupName $resourceGroupName `
    -StorageAccountName $storageAccountName `
    -EnableShareDeleteRetentionPolicy $false
```

# [Azure CLI](#tab/azure-cli)
You can use the following command to disable soft delete on your storage account.

```azurecli
az storage account file-service-properties update \
    --resource-group $resourceGroupName \
    --storage-account $storageAccountName \
    --enable-delete-retention false
```

---

## Next steps
To learn how to prevent a storage account from being deleted or modified, see [Apply an Azure Resource Manager lock to a storage account](../common/lock-account-resource.md).

To learn how to apply locks to resources and resource groups, see [Lock resources to prevent unexpected changes](../../azure-resource-manager/management/lock-resources.md).
