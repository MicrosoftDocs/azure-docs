---
title: Troubleshoot Azure File Shares Backup
description: This article is troubleshooting information about issues occurring when protecting your Azure file shares.
services: backup
ms.service: backup
author: rayne-wiselman
ms.author: raynew
ms.date: 01/31/2019
ms.topic: tutorial
manager: carmonm
---

# Troubleshoot problems backing up Azure File Shares
You can troubleshoot issues and errors encountered while using Azure File Shares backup with information listed in the following tables.

## Limitations for Azure file share backup during Preview
Backup for Azure File shares is in Preview. Azure File Shares in both general-purpose v1 and general-purpose v2 storage accounts are supported. The following backup scenarios aren't supported for Azure file shares:
- You can't protect Azure file shares in storage accounts that have Virtual Networks or Firewall enabled.
- There's no CLI available for protecting Azure Files using Azure Backup.
- The maximum number of scheduled backups per day is one.
- The maximum number of on-demand backups per day is four.
- Use [resource locks](https://docs.microsoft.com/cli/azure/resource/lock?view=azure-cli-latest) on the storage account to prevent accidental deletion of backups in your Recovery Services vault.
- Do not delete snapshots created by Azure Backup. Deleting snapshots can result in loss of recovery points and/or restore failures.
- Do not delete file shares that are protected by Azure Backup. The current solution will delete all snapshots taken by Azure Backup once the file share is deleted and hence lose all restore points

Backup for Azure File Shares in Storage Accounts with [zone redundant storage](../storage/common/storage-redundancy-zrs.md) (ZRS) replication is currently available only in Central US (CUS), East US (EUS), East US 2 (EUS2), North Europe (NE), SouthEast Asia (SEA), West Europe (WE) and West US 2 (WUS2).

## Configuring Backup
The following table is for configuring the backup:

| Error messages | Workaround or Resolution tips |
| ------------------ | ----------------------------- |
| Could not find my Storage Account to configure backup for Azure file share | <ul><li>Wait until discovery is complete. <li>Check if any File share from the storage account is already protected with another Recovery Services vault. **Note**: All file shares in a Storage Account can be protected only under one Recovery Services vault. <li>Be sure the File share is not present in any of the unsupported Storage Accounts.|
| Error in portal states discovery of storage accounts failed. | If your subscription is partner (CSP-enabled), ignore the error. If your subscription is not CSP-enabled, and your storage accounts can't be discovered, contact support.|
| Selected Storage Account validation or registration failed.| Retry the operation, if the problem persists contact support.|
| Could not list or find File shares in the selected Storage Account. | <ul><li> Make sure the Storage Account exists in the Resource Group (and has not been deleted or moved after the last validation/registration in vault).<li>Make sure the File share you are looking to protect has not been deleted. <li>Make sure the Storage Account is a supported storage account for File share backup.<li>Check if the File share is already protected in the same Recovery Services vault.|
| Backup File share configuration (or the protection policy configuration) is failing. | <ul><li>Retry the operation to see if the issue persists. <li> Make sure the File share you want to protect has not been deleted. <li> If you are trying to protect multiple File shares at once, and some of the file shares are failing, retry configuring the backup for the failed File shares again. |
| Unable to delete the Recovery Services vault after unprotecting a File share. | In the Azure portal, open your Vault > **Backup Infrastructure** > **Storage accounts** and click **Unregister** to remove the storage account from the Recovery Services vault.|


## Error messages for Backup or Restore Job failures

| Error messages | Workaround or Resolution tips |
| -------------- | ----------------------------- |
| Operation failed as the File share is not found. | Make sure the File share you are looking to protect has not been deleted.|
| Storage account not found or not supported. | <ul><li>Make sure the storage account exists in the Resource Group, and was not deleted or removed from the Resource Group after the last validation. <li> Make sure the Storage account is a supported Storage account for File share backup.|
| You have reached the max limit of snapshots for this file share, you will be able to take more once the older ones expire. | <ul><li> This error can occur when you create multiple on-demand backups for a File. <li> There's a limit of 200 snapshots per File share including the ones taken by Azure Backup. Older scheduled backups (or snapshots) are cleaned up automatically. On-demand backups (or snapshots) must be deleted if the maximum limit is reached.<li> Delete the on-demand backups (Azure file share snapshots) from the Azure Files portal. **Note**: You lose the recovery points if you delete snapshots created by Azure Backup. |
| File share backup or restore failed due to storage service throttling. This may be because the storage service is busy processing other requests for the given storage account.| Retry the operation after some time. |
| Restore failed with Target File Share Not Found. | <ul><li>Make sure the selected Storage Account exists and the Target File share is not deleted. <li> Make sure the Storage Account is a supported storage account for File share backup. |
| Azure Backup is currently not supported for Azure File Shares in Storage Accounts with Virtual Networks enabled. | Disable Virtual Networks on your Storage Account to ensure successful backups or restore operations. |
| Backup or Restore jobs failed due to storage account being in Locked state. | Remove the lock on Storage Account or use delete lock instead of read lock and retry the operation. |
| Recovery failed because number of failed files are more than the threshold. | <ul><li> Recovery failure reasons are listed in a file (path provided in Job details). Please address the failures and retry the restore operation for the failed files only. <li> Common reasons for File restore failures: <br/> - make sure the files that failed are currently not in use, <br/> - a directory with the same name as the failed file exists in the parent directory. |
| Recovery failed as no file could be recovered. | <ul><li> Recovery failure reasons are listed in a file (path provided in Job details). Address the failures and retry the restore operations for the failed files only. <li> Common reasons for file restore failure: <br/> - Make sure the files that have failed are currently not in use. <br/> - A directory with the same name as the failed file exists in the parent directory. |
| Restore fails because one of the files in the source does not exist. | <ul><li> The selected items aren't present in the recovery point data. To recover the files, provide the correct file list. <li> The file share snapshot that corresponds to the recovery point is manually deleted. Select a different recovery point and retry the restore operation. |
| A Recovery job is in process to the same destination. | <ul><li>File share backup does not support parallel recovery to the same target File share. <li>Wait for the existing recovery to finish and then try again. If you don't find a recovery job in the Recovery Services vault, check other Recovery Services vaults in the same subscription. |
| Restore operation failed as target file share is full. | Increase the target file share size quota to accommodate the restore data and retry the operation. |
| Restore operation failed as an error occurred while performing pre restore operations on File Sync Service resources associated with the target file share. | Please retry after sometime, if the issue persists please contact Microsoft support. |
| One or more files could not be recovered successfully. For more information, check the failed file list in the path given above. | <ul> <li> Recovery failure reasons are listed in the file (path provided in the Job details), address the reasons and retry the restore operation for the failed files only. <li> Common reasons for file restore failures are: <br/> - Make sure the failed files aren't currently in use. <br/> - A directory with the same name as the failed files exists in the parent directory. |


## Modify Policy
| Error messages | Workaround or Resolution tips |
| ------------------ | ----------------------------- |
| Another configure protection operation is in progress for this item. | Please wait for the previous modify policy operation to finish and retry after some time.|
| Another operation is in progress on the selected item. | Please wait for the other in-progress operation to complete and retry after sometime |


## See Also
For additional information about backing up Azure file shares, see:
- [Back up Azure file shares](backup-azure-files.md)
- [Back up Azure file share FAQ](backup-azure-files-faq.md)
