---
title: Troubleshoot Blob backup and restore issues
description: In this article, learn about symptoms, causes, and resolutions of Azure Backup failures related to Blob backup and restore.
ms.topic: troubleshooting
ms.date: 04/13/2023
ms.service: backup
ms.reviewer: geg
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Troubleshoot Azure Blob backup

This article provides troubleshooting information to address issues you encounter while configuring backup or restoring Azure Blob using the Azure Backup Service.

## Common configuration errors

### UserErrorMissingRequiredPermissions

**Error code**: `UserErrorMissingRequiredPermissions`

**Error message**: Appropriate permissions to perform the operation are missing.

**Recommendation**: Ensure that you've granted [appropriate permissions](blob-backup-configure-manage.md?tabs=vaulted-backup#grant-permissions-to-the-backup-vault-on-storage-accounts).

### UserErrorUnsupportedStorageAccountType

**Error code**: `UserErrorUnsupportedStorageAccountType`

**Error message**: The storage account type isn't supported for backup.

**Recommendation**: Ensure that the storage account you've selected for backup is supported. [Learn more](blob-backup-support-matrix.md?tabs=vaulted-backup#limitations).

### UserErrorMaxOrsPolicyExistOnStorageAccount
**Error code**: `UserErrorMaxOrsPolicyExistOnStorageAccount`

**Error message**: Maximum object replication policy exists on the source storage account. 

**Recommendation**: Ensure that you haven't reached the limit of replication rules supported on a storage account. 

## Common backup or restore errors

### UserErrorAzureResourceNotFoundByPlugin 

**Error code**: `UserErrorAzureResourceNotFoundByPlugin `

**Error message**: Unable to find the specified Azure resource.

**Recommendation**: For a backup operation, ensure that the source account configured for backup is valid and not deleted. For restoration, check if both source and target storage accounts are existing.

### UserErrorStorageAccountInLockedState

**Error code**: `UserErrorStorageAccountInLockedState`

**Error message**: Operation failed because storage account is in locked state.

**Recommendation**: Ensure that there's no read only lock on the storage account. [Learn more](../storage/common/lock-account-resource.md?tabs=portal#configure-an-azure-resource-manager-lock).

### UserErrorInvalidRecoveryPointInTime

**Error code**: `UserErrorInvalidRecoveryPointInTime`

**Error message**: Restore point in time is invalid.

**Recommendation**: Ensure that the recovery time provided for restore exists and is in the correct format.

### UserErrorInvalidRestorePrefixRange

**Error code**: `UserErrorInvalidRestorePrefixRange`

**Error message**: Restore Prefix Range for item-level restore is invalid.

**Recommendation**: This error may occur if the backup service can't decipher the prefix range passed for the restore. Ensure that the prefix range provided for the restore is valid.

### UserErrorPitrDisabledOnStorageAccount

**Error code**: `UserErrorPitrDisabledOnStorageAccount`

**Error message**: The required setting PITR is disabled on storage account.

**Recommendation**: Enable that the point-in-restore setting on the storage account. [Learn more](../storage/blobs/point-in-time-restore-manage.md?tabs=portal#enable-and-configure-point-in-time-restore).

### UserErrorImmutabilityPolicyConfigured

**Error code**: `UserErrorImmutabilityPolicyConfigured`

**Error message**: An Immutability Policy is configured on one or more containers, which is preventing the operation.

**Recommendation**: This error may occur if you've configured an immutable policy on the container you're trying to restore. You need to remove the immutability policy or remove the impacted container from the restore intent, and then retry the operation. Learn [how to delete an unlocked policy](../storage/blobs/immutable-policy-configure-container-scope.md?tabs=azure-portal#modify-an-unlocked-retention-policy).

### UserErrorRestorePointNotFound

**Error code**: `UserErrorRestorePointNotFound`

**Error message**: The restore point isn't available in backup vault. 

**Recommendation**: Ensure that the restore point ID is correct and the restore point didn't get deleted based on the backup retention settings. For a recent recovery point, ensure that the corresponding backup job is complete. We recommend you triggering the operation again using a valid restore point. If the issue persists, contact Microsoft support.

### UserErrorTargetContainersExistOnAccount

**Error code**: `UserErrorTargetContainersExistOnAccount`

**Error message**: The containers that are part of restore request shouldn't exist on target storage account. 

**Recommendation**: Ensure that the target storage account doesn't have containers with the same name you're trying to restore. Choose another storage target or retry the restore operation after removing containers with the same name.

### UserErrorBackupRequestThrottled

**Error code**: `UserErrorBackupRequestThrottled`

**Error message**: The backup request is being throttled as you've reached the limit for maximum number of backups on a given backup instance in a day.

**Recommendation**: Wait for a day before triggering a new backup operation.

### UserErrorRestorePointNotFoundInBackupVault

**Error code**: `UserErrorRestorePointNotFoundInBackupVault`

**Error message**: The restore point wasn't found in the Backup vault.

**Recommendation**: Ensure that the restore point ID is correct and the restore point didn't get deleted based on the backup retention settings. Trigger the restore again using a valid restore point.

### UserErrorOriginalLocationRestoreNotSupported

**Error code**: `UserErrorOriginalLocationRestoreNotSupported`

**Error message**: Original location restores not supported for vaulted blob backup.

**Recommendation**: Choose an alternate target storage account and trigger the restore operation.

### UserErrorNoContainersSelectedForOperation

**Error code**: `UserErrorNoContainersSelectedForOperation`

**Error message**: No containers selected for operation.

**Recommendation**: Ensure that you've provided a valid list of containers to restore.

### UserErrorIncorrectContainersSelectedForOperation

**Error code**: `UserErrorIncorrectContainersSelectedForOperation`

**Error message**: Incorrect containers selected for operation.

**Recommendation**: This error may occur if one or more containers included in the scope of protection no longer exist in the protected storage account. We recommend to re-trigger the operation after modifying the protected container list using the edit backup instance option.

### UserErrorCrossTenantOrsPolicyDisabled

**Error code**: `UserErrorCrossTenantOrsPolicyDisabled`

**Error message**: Cross tenant object replication policy disabled.

**Recommendation**: Enable cross-tenant object replication policy on storage account and trigger the operation again. To check this, go to the *storage account* > **Object replication** > **Advanced settings**, and ensure that the checkbox is enabled.

### UserErrorPitrRestoreInProgress

**Error code**: `UserErrorPitrRestoreInProgress`

**Error message**: The operation can't be performed while a restore is in progress on the source account. 

**Recommendation**: You need to retrigger the operation once the in-progress restore completes. 
