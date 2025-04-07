---
title: Enable soft delete for Azure Files
description: Learn how to enable soft delete on Azure file shares for data recovery and preventing accidental deletion of file shares.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 07/09/2024
ms.author: kendownie
ms.custom: devx-track-azurepowershell, devx-track-azurecli
services: storage
---

# How to enable soft delete on Azure file shares

Azure Files offers soft delete for file shares so that you can easily recover your data if you mistakenly the file share. To learn more about soft delete, see [How to prevent accidental deletion of Azure file shares](storage-files-prevent-file-share-deletion.md).

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

## Prerequisites

- If you intend to use Azure PowerShell, [install the latest version](/powershell/azure/install-azure-powershell).
- If you intend to use the Azure CLI, [install the latest version](/cli/azure/install-azure-cli).

## Getting started

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

    :::image type="content" source="media/storage-how-to-recover-deleted-account/undelete-file-share.png" alt-text="If the status column, the column next to the name column, is set to Deleted, then your file share is in a soft deleted state, and is be permanently deleted after your specified retention period.":::

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

## Next step

To learn about another form of data protection and recovery, see [Overview of share snapshots for Azure Files](storage-snapshots-files.md).
