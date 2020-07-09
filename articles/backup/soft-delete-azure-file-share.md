---
title: Accidental Delete Protection for Azure file shares 
description: Learn how to soft delete can protect your Azure File Shares from accidental deletion. 
ms.topic: conceptual
ms.date: 02/02/2020
---

# Accidental delete protection for Azure file shares using Azure Backup

To provide protection against cyberattacks or accidental deletion, [soft delete](https://docs.microsoft.com/azure/storage/files/storage-files-prevent-file-share-deletion) is enabled for all file shares in a storage account when you configure backup for any file share in the respective storage account. With soft delete, even if a malicious actor deletes the file share, the file share’s contents and recovery points (snapshots) are retained for a minimum of 14 additional days, allowing the recovery of file shares with no data loss.  

Soft delete is supported only for standard and premium storage accounts and is currently enable from the Azure Backup side in [these regions](azure-file-share-support-matrix.md).

The following flow chart shows the different steps and states of a backup item when soft delete is enabled for file shares in a storage account:

 ![Soft delete flow chart](./media/soft-delete-afs/soft-delete-flow-chart.png)

## Frequently asked questions

### When will soft delete be enabled for file shares in my storage account?

When you configure backup for the first time for any file share in a storage account, Azure Backup service enables soft delete for all file shares in the respective storage account.

### Can I configure the number of days for which my snapshots and restore points will be retained in soft-deleted state after I delete the file share?

Yes, you can set the retention period according to your requirements. [This document](https://docs.microsoft.com/azure/storage/files/storage-files-enable-soft-delete?tabs=azure-portal) explains the steps to configure the retention period. For storage accounts with backed-up file shares, the minimum retention setting should be 14 days.

### Does Azure Backup reset my retention setting because I configured it to less than 14 days?

From a security perspective, we recommend having minimum retention of 14 days for storage accounts with backed-up file shares. So on each backup job run, if Azure Backup identifies the setting to be less than 14 days, it resets it to 14 days.

### What is the cost incurred during the retention period?

During the soft-deleted period, the protected instance cost and snapshot storage cost will stay as is.  Also, you'll be charged for the used capacity at the regular rate for standard file shares and at snapshot storage rate for premium file shares.

### Can I perform a restore operation when my data is in soft deleted state?

You need to first undelete the soft deleted file share to perform restore operations. The undelete operation will bring the file share into the backed-up state where you can restore to any point in time. To learn how to undelete your file share, visit [this link](https://docs.microsoft.com/azure/storage/files/storage-files-enable-soft-delete?tabs=azure-portal#restore-soft-deleted-file-share) or see the [Undelete File Share Script](./scripts/backup-powershell-script-undelete-file-share.md).

### How can I purge the data of a file share in a storage account that has at least one protected file share?

If you have at least one protected file share in a storage account, it means that soft delete is enabled for all file shares in that account and your data will be retained for 14 days after the delete operation. But if you want to purge the data right away and don’t want it to be retained then follow these steps:

1. If you already deleted the file share while Soft Delete was enabled, then first undelete the file share from the [Files portal](https://docs.microsoft.com/azure/storage/files/storage-files-enable-soft-delete?tabs=azure-portal#restore-soft-deleted-file-share) or by using the [Undelete File Share Script](./scripts/backup-powershell-script-undelete-file-share.md).
2. Disable soft delete for file shares in your storage account by following the steps mentioned in [this document](https://docs.microsoft.com/azure/storage/files/storage-files-enable-soft-delete?tabs=azure-portal#disable-soft-delete).
3. Now delete the file share whose contents you want to purge immediately.

>[!NOTE]
>You should perform step 2 before the next scheduled backup job runs against the protected file share in your storage account. Because whenever the backup job runs, it re-enables soft delete for all file shares in the storage account.

>[!WARNING]
>After disabling soft delete in step 2, any delete operation performed against the file shares is a permanent delete operation. This means if you accidentally delete the backed-up file share after disabling soft delete then you will lose all your snapshots and won’t be able to recover your data.

### In the context of a file share’s soft delete setting, what changes does Azure Backup do when I unregister a storage account?

At the time of unregistration, Azure Backup checks the retention period setting for file shares and if it's greater than 14 days or less than 14 days, it leaves the retention as is. However, if the retention is 14 days, we consider it as being enabled by Azure Backup and so we disable the soft delete during the unregistration process. If you want to unregister the storage account while keeping the retention setting as is, enable it again from the storage account pane after completing unregistration. You can refer to [this link](https://docs.microsoft.com/azure/storage/files/storage-files-enable-soft-delete?tabs=azure-portal#restore-soft-deleted-file-share) for the configuration steps.

## Next steps

Learn how to [Backup Azure File Shares from the Azure portal](backup-afs.md)
