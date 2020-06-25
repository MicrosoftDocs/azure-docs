---
title: Enable soft delete - Azure file shares
description: Learn how to enable soft delete (preview) on Azure file shares for data recovery and preventing accidental deletion.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 05/28/2020
ms.author: rogarana
ms.subservice: files
services: storage
---

# Enable soft delete on Azure file shares

Azure Storage offers soft delete for file shares (preview) so that you can more easily recover your data when it's mistakenly deleted by an application or other storage account user. To learn more about soft delete, see [How to prevent accidental deletion of Azure file shares](storage-files-prevent-file-share-deletion.md).

The following sections show how to enable and use soft delete for Azure file shares on an existing storage account:

# [Portal](#tab/azure-portal)

1. Sign into the [Azure portal](https://portal.azure.com/).
1. Navigate to your storage account and select **Soft delete** under **File service**.
1. Select **Enabled** for **file share soft delete**.
1. Select **File share retention period in days** and enter a number of your choosing.
1. Select **Save** to confirm your data retention settings.

:::image type="content" source="media/storage-how-to-recover-deleted-account/enable-soft-delete-files.png" alt-text="Screenshot of the storage account soft delete settings pane. Highlighting the file shares section, enable toggle, set a retention period, and save. This will enable soft delete for all file shares in your storage account.":::

# [PowerShell](#tab/azure-powershell)

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

# [PowerShell](#tab/azure-powershell)

To restore a soft deleted file share, use the following command:

```azurepowershell-interactive
Restore-AzRmStorageShare -ResourceGroupName $rgname -StorageAccountName $accountName -DeletedShareVersion 01D5E2783BDCDA97
```
---

## Disable soft delete

If you wish to stop using soft delete, or permanently delete a file share, follow these instructions:

# [Portal](#tab/azure-portal)

1. Navigate to your storage account and select **Soft delete** under **Settings**.
1. Under **File shares** select **Disabled** for **Soft delete for file shares**.
1. Select **Save** to confirm your data retention settings.

    :::image type="content" source="media/storage-how-to-recover-deleted-account/disable-soft-delete-files.png" alt-text="Disabling soft delete will allow you to immediately and permanently delete all file shares in your storage account at your leisure.":::

# [PowerShell](#tab/azure-powershell)

You can use the following command to disable soft delete on your storage account:

```azurepowershell-interactive
Update-AzStorageFileServiceProperty -ResourceGroupName $rgName -StorageAccountName $accountName -EnableShareDeleteRetentionPolicy $false
```
---

## Next steps

To learn about another form of data protection and recovery, see our article [Overview of share snapshots for Azure Files](storage-snapshots-files.md).
