---
title: Troubleshooting Azure Data Lake Storage backup using Azure Backup (preview)
description: Learn to troubleshoot Azure Data Lake Storage backup using Azure Backup.
ms.topic: troubleshooting
ms.date: 05/27/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
# Customer intent: As a data engineer managing Azure Data Lake Storage, I want to troubleshoot backup and restore errors effectively, so that I can ensure successful data protection and recovery operations.
---

# Troubleshoot Azure Data Lake Storage backup (preview)

This article provides troubleshooting details for error codes that appear when configuring backup and restoring for Azure Data Lake Storage data using Azure Backup (preview).

## Common backup errors

### UserErrorMissingRequiredPermissions

**Error code**: `UserErrorMissingRequiredPermissions`

**Error message**: Appropriate permissions to perform the operation are missing.

**Recommended action**: Ensure that you [granted appropriate permissions](azure-data-lake-storage-configure-backup.md#grant-permissions-to-the-backup-vault-on-storage-accounts).

### UserErrorBackupRequestThrottled

**Error code**: `UserErrorBackupRequestThrottled`

**Error message**: The backup request is throttled as the number of backups on a given backup instance in a day reached the maximum limit.

**Recommended action**: Wait for a day before triggering a new backup operation.

### UserErrorIncorrectContainersSelectedForOperation

**Error code**: `UserErrorIncorrectContainersSelectedForOperation`

**Error message**: Incorrect containers are selected for the backup operation.

**Cause**: One or more containers included in the scope of protection no longer exist in the protected storage account.

**Recommended action**: Retrigger the operation after modifying the protected container list using the **edit backup instance** option.

### UserErrorUnsupportedStorageAccountType

**Error code**: `UserErrorUnsupportedStorageAccountType`

**Error message**: The storage account type isn't supported for Backup.

**Recommended action**: Ensure that you select only the hierarchical namespace (HNS) enabled storage accounts for backup. Network File System (NFS) or Secure File Transfer Protocol (SFTP) enabled storage accounts aren't supported for Azure Data Lake Storage.  

## Common restore errors

### UserErrorTargetContainersExistOnAccount

**Error code**: `UserErrorTargetContainersExistOnAccount`
	
**Error message**: The containers that are part of restore request shouldn't exist on target storage account.

**Recommended action**: Ensure that the target storage account doesn't have containers with the same name you're trying to restore. Choose another storage target or retry the restore operation after removing containers with the same name.

### UserErrorOriginalLocationRestoreNotSupported

**Error code**: `UserErrorOriginalLocationRestoreNotSupported`

**Error message**: Original location restores aren't supported for vaulted blob backup.

**Recommended action**: Choose an alternate target storage account and trigger the restore operation.

## Related content

- [Configure vaulted backup for Azure Data Lake Storage using Azure portal (preview)](azure-data-lake-storage-configure-backup.md).
- [Restore Azure Data Lake Storage using Azure portal (preview)](azure-data-lake-storage-restore.md).