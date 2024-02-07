---
title: Troubleshoot Azure file share backup
description: This article is troubleshooting information about issues occurring when protecting your Azure file shares.
ms.date: 06/14/2023
ms.topic: troubleshooting
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Troubleshoot problems while backing up Azure file shares

This article provides troubleshooting information to address any issues you come across while configuring backup or restoring Azure file shares using the Azure Backup Service.

## Common configuration issues

### Could not find my storage account to configure backup for the Azure file share

- Wait until discovery is complete.
- Check if any file share under the storage account is already protected with another Recovery Services vault.

  >[!NOTE]
  >All file shares in a Storage Account can be protected only under one Recovery Services vault. You can use [this script](scripts/backup-powershell-script-find-recovery-services-vault.md) to find the Recovery Services vault where your storage account is registered.

- Ensure that the file share isn't present in any of the unsupported Storage Accounts. You can refer to the [Support matrix for Azure file share backup](azure-file-share-support-matrix.md) to find supported Storage Accounts.
- Ensure that the storage account and recovery services vault are present in the same region.
- Ensure that the combined length of the storage account name and the resource group name don't exceed 84 characters in the case of new Storage accounts and 77 characters in the case of classic storage accounts.
- Check the firewall settings of storage account to ensure that the exception "_Allow Azure services on the trusted services list to access this storage account_" is granted. You can refer [this](../storage/common/storage-network-security.md?tabs=azure-portal#manage-exceptions) link for the steps to grant exception.


### Error in portal states discovery of storage accounts failed

If you have a partner subscription (CSP-enabled), ignore the error. If your subscription isn't CSP-enabled, and your storage accounts can't be discovered, contact support.

### Selected storage account validation or registration failed

Retry the registration. If the problem persists, contact support.

### Could not list or find file shares in the selected storage account

- Ensure that the Storage Account exists in the Resource Group and hasn't been deleted or moved after the last validation or registration in the vault.
- Ensure that the file share you're looking to protect hasn't been deleted.
- Ensure that the Storage Account is a supported storage account for file share backup. You can refer to the [Support matrix for Azure file share backup](azure-file-share-support-matrix.md) to find supported Storage Accounts.
- Check if the file share is already protected in the same Recovery Services vault.
- Check the Network Routing setting of storage account to ensure that routing preference is set as Microsoft network routing.

### Backup file share configuration (or the protection policy configuration) is failing

- Retry the configuration to see if the issue persists.
- Ensure that the file share you want to protect hasn't been deleted.
- If you're trying to protect multiple file shares at once, and some of the file shares are failing, try configuring backup for the failed file shares again.

### Unable to delete the Recovery Services vault after unprotecting a file share

In the Azure portal, open your **Vault** > **Backup Infrastructure** > **Storage accounts**. Select **Unregister** to remove the storage accounts from the Recovery Services vault.

>[!NOTE]
>A Recovery Services vault can only be deleted after unregistering all storage accounts registered with the vault.

## Common backup or restore errors

>[!NOTE]
>Refer to [this document](./backup-rbac-rs-vault.md#minimum-role-requirements-for-the-azure-file-share-backup) to ensure you have sufficient permissions for performing backup or restore operations.

### FileShareNotFound- Operation failed as the file share is not found

Error Code: FileShareNotFound

Error Message: Operation failed as the file share is not found

Ensure that the file share you're trying to protect hasn't been deleted.

### UserErrorFileShareEndpointUnreachable- Storage account not found or not supported

Error Code: UserErrorFileShareEndpointUnreachable

Error Message: Storage account not found or not supported

- Ensure that the storage account exists in the Resource Group and wasn't deleted or removed from the Resource Group after the last validation.

- Ensure that the Storage account is a supported Storage account for file share backup.

### AFSMaxSnapshotReached- You have reached the max limit of snapshots for this file share; you will be able to take more once the older ones expire

Error Code: AFSMaxSnapshotReached

Error Message: You have reached the max limit of snapshots for this file share; you will be able to take more once the older ones expire.

- This error can occur when you create multiple on-demand backups for a file share.
- There's a limit of 200 snapshots per file share including the ones taken by Azure Backup. Older scheduled backups (or snapshots) are cleaned up automatically. On-demand backups (or snapshots) must be deleted if the maximum limit is reached.

Delete the on-demand backups (Azure file share snapshots) from the Azure Files portal.

>[!NOTE]
> You lose the recovery points if you delete snapshots created by Azure Backup.

### UserErrorStorageAccountNotFound- Operation failed as the specified storage account does not exist anymore

Error Code: UserErrorStorageAccountNotFound

Error Message: Operation failed as the specified storage account does not exist anymore.

Ensure that the storage account still exists and isn't deleted.

### UserErrorDTSStorageAccountNotFound- The storage account details provided are incorrect

Error Code: UserErrorDTSStorageAccountNotFound

Error Message: The storage account details provided are incorrect.

Ensure that the storage account still exists and isn't deleted.

### UserErrorResourceGroupNotFound- Resource group doesn't exist

Error Code: UserErrorResourceGroupNotFound

Error Message: Resource group doesn't exist

Select an existing resource group or create a new resource group.

### ParallelSnapshotRequest- A backup job is already in progress for this file share

Error Code: ParallelSnapshotRequest

Error Message: A backup job is already in progress for this file share.

- File share backup doesn't support parallel snapshot requests against the same file share.

- Wait for the existing backup job to finish and then try again. If you can’t find a backup job in the Recovery Services vault, check other Recovery Services vaults in the same subscription.

### UserErrorStorageAccountInternetRoutingNotSupported- Storage accounts with Internet routing configuration are not supported by Azure Backup

Error Code: UserErrorStorageAccountInternetRoutingNotSupported

Error Message: Storage accounts with Internet routing configuration are not supported by Azure Backup

Ensure that the routing preference set for the storage account hosting backed up file share is Microsoft network routing.

### FileshareBackupFailedWithAzureRpRequestThrottling/ FileshareRestoreFailedWithAzureRpRequestThrottling- File share backup or restore operation failed due to storage service throttling. This may be because the storage service is busy processing other requests for the given storage account

Error Code: FileshareBackupFailedWithAzureRpRequestThrottling/ FileshareRestoreFailedWithAzureRpRequestThrottling

Error Message: File share backup or restore operation failed due to storage service throttling. This may be because the storage service is busy processing other requests for the given storage account.

Try the backup/restore operation at a later time.

### TargetFileShareNotFound- Target file share not found

Error Code: TargetFileShareNotFound

Error Message: Target file share not found.

- Ensure that the selected Storage Account exists, and the target file share isn't deleted.

- Ensure that the Storage Account is a supported storage account for file share backup.

### UserErrorStorageAccountIsLocked- Backup or restore jobs failed due to storage account being in locked state

Error Code: UserErrorStorageAccountIsLocked

Error Message: Backup or restore jobs failed due to storage account being in locked state.

Remove the lock on the Storage Account or use **delete lock** instead of **read lock** and retry the backup or restore operation.

### DataTransferServiceCoFLimitReached- Recovery failed because number of failed files are more than the threshold

Error Code: DataTransferServiceCoFLimitReached

Error Message: Recovery failed because number of failed files are more than the threshold.

- Recovery failure reasons are listed in a file (path provided in the job details). Address the failures and retry the restore operation for the failed files only.

- Common reasons for file restore failures:

  - files that failed are currently in use
  - a directory with the same name as the failed file exists in the parent directory.

### DataTransferServiceAllFilesFailedToRecover- Recovery failed as no file could be recovered

Error Code: DataTransferServiceAllFilesFailedToRecover

Error Message: Recovery failed as no file could be recovered.

- Recovery failure reasons are listed in a file (path provided in the job details). Address the failures and retry the restore operations for the failed files only.

- Common reasons for file restore failures:

  - files that failed are currently in use
  - a directory with the same name as the failed file exists in the parent directory.

### UserErrorDTSSourceUriNotValid - Restore fails because one of the files in the source does not exist

Error Code: DataTransferServiceSourceUriNotValid

Error Message: Restore fails because one of the files in the source does not exist.

- The selected items aren't present in the recovery point data. To recover the files, provide the correct file list.
- The file share snapshot that corresponds to the recovery point is manually deleted. Select a different recovery point and retry the restore operation.

### UserErrorDTSDestLocked- A recovery job is in process to the same destination

Error Code: UserErrorDTSDestLocked

Error Message: A recovery job is in process to the same destination.

- File share backup doesn't support parallel recovery to the same target file share.

- Wait for the existing recovery to finish and then try again. If you can’t find a recovery job in the Recovery Services vault, check other Recovery Services vaults in the same subscription.

### UserErrorTargetFileShareFull- Restore operation failed as target file share is full

Error code: UserErrorTargetFileShareFull

Error Message: Restore operation failed as target file share is full.

Increase the target file share size quota to accommodate the restore data and retry the restore operation.

### UserErrorTargetFileShareQuotaNotSufficient- Target file share does not have sufficient storage size quota for restore

Error Code: UserErrorTargetFileShareQuotaNotSufficient

Error Message: Target File share does not have sufficient storage size quota for restore

Increase the target file share size quota to accommodate the restore data and retry the operation

### File Sync PreRestoreFailed- Restore operation failed as an error occurred while performing pre restore operations on File Sync Service resources associated with the target file share

Error Code: File Sync PreRestoreFailed

Error Message: Restore operation failed as an error occurred while performing pre restore operations on File Sync Service resources associated with the target file share.

Try restoring the data at a later time. If the issue persists, contact Microsoft support.

### AzureFileSyncChangeDetectionInProgress- Azure File Sync Service change detection is in progress for the target file share. The change detection was triggered by a previous restore to the target file share

Error Code: AzureFileSyncChangeDetectionInProgress

Error Message: Azure File Sync Service change detection is in progress for the target file share. The change detection was triggered by a previous restore to the target file share.

Use a different target file share. Alternatively, you can wait for Azure File Sync Service change detection to complete for the target file share before retrying the restore.

### UserErrorAFSRecoverySomeFilesNotRestored- One or more files could not be recovered successfully. For more information, check the failed file list in the path given above

Error Code: UserErrorAFSRecoverySomeFilesNotRestored

Error Message: One or more files could not be recovered successfully. For more information, check the failed file list in the path given above.

- Recovery failure reasons are listed in the file (path provided in the Job details). Address the reasons and retry the restore operation for the failed files only.
- Common reasons for file restore failures:

  - files that failed are currently in use
  - a directory with the same name as the failed file exists in the parent directory.

### UserErrorAFSSourceSnapshotNotFound- Azure file share snapshot corresponding to recovery point cannot be found

Error Code: UserErrorAFSSourceSnapshotNotFound

Error Message: Azure file share snapshot corresponding to recovery point cannot be found

- Ensure that the file share snapshot, corresponding to the recovery point you're trying to use for recovery, still exists.

  >[!NOTE]
  >If you delete a file share snapshot that was created by Azure Backup, the corresponding recovery points become unusable. We recommend not deleting snapshots to ensure guaranteed recovery.

- Try selecting another restore point to recover your data.

### UserErrorAnotherRestoreInProgressOnSameTarget- Another restore job is in progress on the same target file share

Error Code: UserErrorAnotherRestoreInProgressOnSameTarget

Error Message: Another restore job is in progress on the same target file share

Use a different target file share. Alternatively, you can cancel or wait for the other restore to complete.

### UserErrorSourceOrTargetAccountNotAccessible

Error Code: UserErrorSourceOrTargetAccountNotAccessible

Error Message: Source or Target storage account is not accessible from the Azure Files restore service.

Recommended Actions: Ensure that the following configurations in the storage account are correctly set for performing a successful restore:

- Ensure that the storage keys aren't rotated during the restore.
- Check the network configuration on the storage account(s) and ensure that it allows the Microsoft first party services.

  :::image type="content" source="./media/troubleshoot-azure-files/storage-account-network-configuration.png" alt-text="Screenshot shows the required networking details in a storage account." lightbox="./media/troubleshoot-azure-files/storage-account-network-configuration.png":::

- Ensure that the target storage account has the following configuration: *Permitted scope for copy operations* is set to *From storage accounts in the same Microsoft Entra tenant*.

  :::image type="content" source="./media/troubleshoot-azure-files/target-storage-account-configuration.png" alt-text="Screenshot shows the target storage account configuration." lightbox="./media/troubleshoot-azure-files/target-storage-account-configuration.png":::


## Common modify policy errors

### BMSUserErrorConflictingProtectionOperation- Another configure protection operation is in progress for this item

Error Code: BMSUserErrorConflictingProtectionOperation

Error Message: Another configure protection operation is in progress for this item.

Wait for the previous modify policy operation to finish and retry at a later time.

### BMSUserErrorObjectLocked- Another operation is in progress on the selected item

Error Code: BMSUserErrorObjectLocked

Error Message: Another operation is in progress on the selected item.

Wait for the other in-progress operation to complete and retry at a later time.

## Common Soft Delete Related Errors

### UserErrorRestoreAFSInSoftDeleteState- This restore point is not available as the snapshot associated with this point is in a File Share that is in soft-deleted state

Error Code: UserErrorRestoreAFSInSoftDeleteState

Error Message: This restore point is not available as the snapshot associated with this point is in a File Share that is in soft-deleted state.

You can't perform a restore operation when the file share is in soft deleted state. Undelete the file share from Files portal  or using the [Undelete script](scripts/backup-powershell-script-undelete-file-share.md) and then try to restore.

### UserErrorRestoreAFSInDeleteState- Listed restore points are not available as the associated file share containing the restore point snapshots has been deleted permanently

Error Code: UserErrorRestoreAFSInDeleteState

Error Message: Listed restore points are not available as the associated file share containing the restore point snapshots has been deleted permanently.

Check if the backed-up file share is deleted. If it was in soft deleted state, check if the soft delete retention period is over and it wasn't recovered back. In either of these cases, you'll lose all your snapshots permanently and won’t be able to recover the data.

>[!NOTE]
> We recommend you don't delete the backed up file share, or if it's in soft deleted state, undelete before the soft delete retention period ends, to avoid losing all your restore points.

### UserErrorBackupAFSInSoftDeleteState - Backup failed as the Azure File Share is in soft-deleted state

Error Code: UserErrorBackupAFSInSoftDeleteState

Error Message: Backup failed as the Azure File Share is in soft-deleted state

Undelete the file share from the **Files portal** or by using the [Undelete script](scripts/backup-powershell-script-undelete-file-share.md) to continue the backup and prevent permanent deletion of data.

### UserErrorBackupAFSInDeleteState- Backup failed as the associated Azure File Share is permanently deleted

Error Code: UserErrorBackupAFSInDeleteState

Error Message: Backup failed as the associated Azure File Share is permanently deleted

Check if the backed-up file share is permanently deleted. If yes, stop the backup for the file share to avoid repeated backup failures. To learn how to stop protection see [Stop Protection for Azure file share](./manage-afs-backup.md#stop-protection-on-a-file-share)

## Next steps

For more information about backing up Azure file shares, see:

- [Back up Azure file shares](backup-afs.md)
- [Back up Azure file share FAQ](backup-azure-files-faq.yml)
