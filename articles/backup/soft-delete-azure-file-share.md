---
title: Accidental Delete Protection for Azure Files 
description: Learn how to soft delete can protect your Azure Files from accidental deletion. 
ms.topic: how-to
ms.date: 08/14/2025
ms.custom: references_regions 
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a storage administrator, I want to enable soft delete for file shares using Azure Backup, so that I can protect my data from accidental deletion or cyberattacks and ensure I can recover it within the retention period.
---

# Protect Azure Files from accidental deletion using Azure Backup

Azure Backup automatically enables [soft delete](../storage/files/storage-files-prevent-file-share-deletion.md) for all file shares in a storage account when you configure backup for any file share. With soft delete, deleted file shares and their recovery points (snapshots) are retained for at least 14 days in soft-deleted state, helping you restore data in accidental deletion or cyberattacks. This protection applies to both standard and premium storage accounts and is managed by Azure Backup for all storage accounts containing protected file shares.

The following flow diagram shows the process and different states a file share experiences when soft delete is enabled in a storage account. It visually explains how backup items are protected and can be recovered after accidental deletion.

:::image type="content" source="./media/soft-delete-afs/soft-delete-flow-chart.png" alt-text="Diagram shows the journey of deleted data when Soft delete is in enabled state on a vault.":::

## Frequently asked questions: Azure Backup Soft Delete for Azure Files

This section answers some common questions about Soft Delete for Azure Files when using Azure Backup.

### When does Azure Backup enable soft delete for file shares in my storage account?

When you configure backup for the first time for any file share in a storage account, Azure Backup service enables soft delete for all file shares in the respective storage account.

### Can I set the retention duration of a soft-deleted file shares and snapshots?

Yes. You can set the retention period to match your needs. See [this document](../storage/files/storage-files-enable-soft-delete.md?tabs=azure-portal) for steps. For backed-up file shares, the minimum retention is 14 days.

Yes, you can set the retention period according to your requirements. [This document](../storage/files/storage-files-enable-soft-delete.md?tabs=azure-portal) explains the steps to configure the retention period. For storage accounts with backed-up file shares, the minimum retention setting should be 14 days.

### Does Azure Backup reset my retention setting because I configured it to less than 14 days?

From a security perspective, we recommend having minimum retention of 14 days for storage accounts with backed-up file shares. So on each backup job run, if Azure Backup identifies the setting to be less than 14 days, it resets it to 14 days.

### What is the cost incurred during the retention period?

During the soft-deleted period, the protected instance cost and snapshot storage cost stay as is.  You're also charged for the used capacity at the regular rate for standard file shares and at snapshot storage rate for premium file shares.

### Can I perform a restore operation when my data is in soft deleted state?

You need to first undelete the soft deleted file share to perform restore operations. The undelete operation brings the file share into the backed-up state where you can restore to any point in time. To learn how to undelete your file share, visit [this link](../storage/files/storage-files-enable-soft-delete.md?tabs=azure-portal#restore-soft-deleted-file-share) or see the [Undelete File Share Script](./scripts/backup-powershell-script-undelete-file-share.md).

### How can I purge the data of a file share in a storage account that has at least one protected file share?

If you have at least one protected file share in a storage account, it means that soft delete is enabled for all file shares in that account and your data is retained for 14 days after the delete operation. But if you want to purge the data right away and don’t want it to be retained then follow these steps:

1. If you already deleted the file share while Soft Delete was enabled, then first undelete the file share from the [Files portal](../storage/files/storage-files-enable-soft-delete.md?tabs=azure-portal#restore-soft-deleted-file-share) or by using the [Undelete File Share Script](./scripts/backup-powershell-script-undelete-file-share.md).
2. Disable soft delete for file shares in your storage account by following the steps mentioned in [this document](../storage/files/storage-files-enable-soft-delete.md?tabs=azure-portal#disable-soft-delete).
3. Now delete the file share whose contents you want to purge immediately.

>[!NOTE]
>You should perform step 2 before the next scheduled backup job runs against the protected file share in your storage account. Because whenever the backup job runs, it re-enables soft delete for all file shares in the storage account.

>[!WARNING]
>After you disable soft delete in step 2, any delete operation performed against the file shares is a permanent delete operation. So if you accidentally delete the backed-up file share after disabling soft delete, you'll lose all your snapshots and won’t be able to recover your data.

### What happens to the soft delete setting for file shares when I unregister a storage account from Azure Backup?

At the time of unregistration, Azure Backup checks the retention period setting for file shares and if it's greater than 14 days or less than 14 days, it leaves the retention as is. However, if the retention is 14 days, we consider it as being enabled by Azure Backup and so we disable the soft delete during the unregistration process. If you want to unregister the storage account while keeping the retention setting as is, enable it again from the storage account pane after completing unregistration. You can refer to [this link](../storage/files/storage-files-enable-soft-delete.md?tabs=azure-portal#restore-soft-deleted-file-share) for the configuration steps.

## Next steps

Learn how to [Backup Azure Files from the Azure portal](backup-afs.md).
