---
title: Enable soft delete - Azure file shares
description: Learn how to enable soft delete on Azure file shares for data recovery and preventing accidental deletion.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 04/05/2021
ms.author: rogarana
ms.subservice: files
services: storage
---

# Enable soft delete on Azure file shares

Azure Storage offers soft delete for file shares so that you can more easily recover your data when it's mistakenly deleted by an application or other storage account user. To learn more about soft delete, see [How to prevent accidental deletion of Azure file shares](storage-files-prevent-file-share-deletion.md).

The following sections show how to enable and use soft delete for Azure file shares on an existing storage account:

# [Portal](#tab/azure-portal)

## Getting started

1. Sign into the [Azure portal](https://portal.azure.com/).
1. Navigate to your storage account and select **File shares** under **Data storage**.
1. Select **Enabled** next to **Soft delete**.
1. Select **Enabled** for **Soft delete for all file shares**.
1. Select **File share retention period in days** and enter a number of your choosing.
1. Select **Save** to confirm your data retention settings.

    :::image type="content" source="media/storage-how-to-recover-deleted-account/files-enable-soft-delete-new-ui.png" alt-text="Screenshot of the storage account soft delete settings pane. Highlighting the file shares soft delete section, enable toggle, set a retention period, and save. This will enable soft delete for all file shares in your storage account.":::

# [Azure CLI](#tab/azure-cli)

Soft delete cmdlets are available in version 2.1.3 and newer of the [Azure CLI module](/cli/azure/install-azure-cli).

## Getting started with CLI

To enable soft delete, you must update a file client's service properties. The following example enables soft delete for all file shares in a storage account:

```azurecli
az storage account file-service-properties update --enable-delete-retention true -n yourStorageaccount -g yourResourceGroup
```

You can verify if soft delete is enabled and view its retention policy with the following command:

```azurecli
az storage account file-service-properties show -n yourStorageaccount -g yourResourceGroup
```

# [PowerShell](#tab/azure-powershell)

## Prerequisite

Soft delete cmdlets are available in the 4.8.0 and newer versions of the Az.Storage module. 

## Getting started with PowerShell

To enable soft delete, you must update a file client's service properties. The following example enables soft delete for all file shares in a storage account:

```azurepowershell-interactive
$rgName = "yourResourceGroupName"
$accountName = "yourStorageAccountName"

Update-AzStorageFileServiceProperty -ResourceGroupName $rgName -StorageAccountName $accountName -EnableShareDeleteRetentionPolicy $true -ShareRetentionDays 7
```

You can verify if soft delete is enabled and view its retention policy with the following command:

```azurepowershell-interactive
Get-AzStorageFileServiceProperty -ResourceGroupName $rgName -StorageAccountName $accountName
```
---

## Restore soft deleted file share

# [Portal](#tab/azure-portal)

To restore a soft deleted file share:

1. Navigate to your storage account and select **File shares**.
1. On the file share blade, enable **Show deleted shares** to display any shares that have been soft deleted.

    This will display any shares currently in a **Deleted** state.

    :::image type="content" source="media/storage-how-to-recover-deleted-account/undelete-file-share.png" alt-text="If the status column, the column next to the name column, is set to Deleted, then your file share is in a soft deleted state. And will be permanently deleted after your specified retention period.":::

1. Select the share and select **undelete**, this will restore the share.

    You can confirm the share is restored since its status switches to **Active**.

    :::image type="content" source="media/storage-how-to-recover-deleted-account/restored-file-share.png" alt-text="If the status column, the column next to the name column, is set to Active, then your file share has been restored.":::

# [Azure CLI](#tab/azure-cli)

Soft delete cmdlets are available in the 2.1.3 version of the Azure CLI. To restore a soft deleted file share, you must first get the `--deleted-version` value of the share. To get that value, use the following command to list out all the deleted shares for your storage account:

```azurecli
az storage share-rm list --storage-account yourStorageaccount --include-deleted
```

Once you've identified the share you'd like to restore, you can use it with the following command to restore it:

```azurecli
az storage share-rm restore -n deletedshare --deleted-version 01D64EB9886F00C4 -g yourResourceGroup --storage-account yourStorageaccount
```

# [PowerShell](#tab/azure-powershell)

Soft delete cmdlets are available in the 4.8.0 and newer versions of the Az.Storage module. To restore a soft deleted file share, you must first get the `-DeletedShareVersion` value of the share. To get that value, use the following command to list out all the deleted shares for your storage account:

```azurepowershell-interactive
Get-AzRmStorageShare -ResourceGroupName $rgname -StorageAccountName $accountName -IncludeDeleted
```

Once you've identified the share you'd like to restore, you can use it with the following command to restore it:

```azurepowershell-interactive
Restore-AzRmStorageShare -ResourceGroupName $rgname -StorageAccountName $accountName -DeletedShareVersion 01D5E2783BDCDA97
```
---

## Disable soft delete

If you wish to stop using soft delete, follow these instructions. To permanently delete a file share that has been soft deleted, you must undelete it, disable soft delete, and then delete it again. 

# [Portal](#tab/azure-portal)

1. Navigate to your storage account and select **File shares** under **Data storage**.
1. Select the link next to **Soft delete**.
1. Select **Disabled** for **Soft delete for all file shares**.
1. Select **Save** to confirm your data retention settings.

    :::image type="content" source="media/storage-how-to-recover-deleted-account/files-disable-soft-delete.png" alt-text="Disabling soft delete will allow you to immediately and permanently delete all file shares in your storage account at your leisure.":::

# [Azure CLI](#tab/azure-cli)

Soft delete cmdlets are available in the 2.1.3 version of the Azure CLI. You can use the following command to disable soft delete on your storage account:

```azurecli
az storage account file-service-properties update --enable-delete-retention false -n yourStorageaccount -g yourResourceGroup
```
# [PowerShell](#tab/azure-powershell)

Soft delete cmdlets are available in the 4.8.0 and newer versions of the Az.Storage module. You can use the following command to disable soft delete on your storage account:

```azurepowershell-interactive
Update-AzStorageFileServiceProperty -ResourceGroupName $rgName -StorageAccountName $accountName -EnableShareDeleteRetentionPolicy $false
```
---

## Next steps

To learn about another form of data protection and recovery, see our article [Overview of share snapshots for Azure Files](storage-snapshots-files.md).