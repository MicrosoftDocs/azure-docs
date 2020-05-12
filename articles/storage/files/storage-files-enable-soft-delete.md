---
title: Recover deleted Azure file shares
description: Enable soft delete on Azure file shares to enable data recovery and prevent accidental deletion.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 05/12/2020
ms.author: rogarana
ms.subservice: files
services: storage
---

# Enable soft delete

Azure Storage now offers soft delete for file shares so that you can more easily recover your data when it is mistakenly deleted by an application or other storage account user. To learn more about soft delete, refer to [How to prevent accidental deletion of Azure file shares](storage-files-recover-file-shares.md).

The following steps show how to enable soft delete for Azure file shares on your storage account:

# [Portal](#tab/azure-portal)

1. Sign into the [Azure portal](https://portal.azure.com/).
1. Navigate to your storage account and select **Soft delete** under **Settings**.
1. Under **File shares** select **Enabled** for **Soft delete for file shares**.
1. Select **File share retention period in days** and enter a number of your choosing.
1. Select **Save** to confirm your data retention settings.

![Screenshot of the storage account soft delete settings pane. Highlighting the file shares section, enable toggle, retention period, and save.](media/storage-how-to-recover-deleted-account/files-soft-delete-storage-account.png)

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

To restore a soft deleted file share, use the following command:

```azurepowershell-interactive
Restore-AzRmStorageShare -ResourceGroupName $rgname -StorageAccountName $accountName -DeletedShareVersion 01D5E2783BDCDA97
```

## Disable soft delete

To disable soft delete for your storage account, follow these instructions:

# [Portal](#tab/azure-portal)

1. Navigate to your storage account and select **Soft delete** under **Settings**.
1. Under **File shares** select **Disabled** for **Soft delete for file shares**.
1. Select **Save** to confirm your data retention settings.

# [PowerShell](#tab/azure-powershell)

You can use the following command to disable soft delete on your storage account:

```azurepowershell-interactive
Update-AzStorageFileServiceProperty -ResourceGroupName $rgName -StorageAccountName $accountName -EnableShareDeleteRetentionPolicy $false
```
---

## Monitoring soft deleted data

To see the size of a soft-deleted file share, you must undelete the share, then view its properties.

> [!NOTE]
> For soft-deleted premium file shares, the file share quota (the provisioned size of a file share) is used in the total storage account quota calculation until the soft-deleted share expiry date, when the share is fully deleted.