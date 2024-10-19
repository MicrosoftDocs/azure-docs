---
title: Troubleshoot Blob backup and restore issues
description: In this article, learn about symptoms, causes, and resolutions of Azure Backup failures related to the Azure Blob backups and restore.
ms.topic: troubleshooting
ms.date: 09/16/2024
ms.service: azure-backup
ms.reviewer: geg
author: AbhishekMallick-MS
ms.author: v-abhmallick
ms.custom: engagement-fy24
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

**Recommendation**: Enable that the point-in-time restore setting on the storage account. [Learn more](../storage/blobs/point-in-time-restore-manage.md?tabs=portal#enable-and-configure-point-in-time-restore).

### UserErrorImmutabilityPolicyConfigured

**Error code**: `UserErrorImmutabilityPolicyConfigured`

**Error message**: An Immutability Policy is configured on one or more containers, which is preventing the operation.

**Recommendation**: This error may occur if you've configured an immutable policy on the container you're trying to restore. You need to remove the immutability policy or remove the impacted container from the restore intent, and then retry the operation. Learn [how to delete an unlocked policy](../storage/blobs/immutable-policy-configure-container-scope.md?tabs=azure-portal#modify-an-unlocked-retention-policy).

### UserErrorRestorePointNotFound

**Error code**: `UserErrorRestorePointNotFound`

**Error message**: The restore point isn't available in backup vault. 

**Recommendation**: Ensure that the restore point ID is correct and the restore point didn't get deleted based on the backup retention settings. For a recent recovery point, ensure that the corresponding backup job is complete. We recommend you triggering the operation again using a valid restore point. If the issue persists, contact Microsoft support.

### UserErrorContainerNotFoundForPointInTimeRestore

**Error code**: `UserErrorContainerNotFoundForPointInTimeRestore`

**Error message**: A container selected for the restore was not found in the storage account for the selected point in time. 

**Recommendation**: Use specific container restore or prefix match restore for containers that are present in the account. We also recommend enabling vaulted backup for your storage account to get comprehensive protection against deletion of containers. If you already have it configured, you can use a recovery point for performing recovery of deleted containers.

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

**Recommendation**: This error may occur if one or more containers included in the scope of protection no longer exist in the protected storage account. We recommend you to re-trigger the operation after modifying the protected container list using the edit backup instance option.

### UserErrorCrossTenantOrsPolicyDisabled

**Error code**: `UserErrorCrossTenantOrsPolicyDisabled`

**Error message**: Cross tenant object replication policy disabled.

**Recommendation**: Enable cross-tenant object replication policy on storage account and trigger the operation again. To check this, go to the *storage account* > **Object replication** > **Advanced settings**, and ensure that the checkbox is enabled.

### UserErrorPitrRestoreInProgress

**Error code**: `UserErrorPitrRestoreInProgress`

**Error message**: The operation can't be performed while a restore is in progress on the source account. 

**Recommendation**: You need to retrigger the operation once the in-progress restore completes. 

## Common errors for Azure Blob vaulted backup

### UserErrorInvalidParameterInRequest 

**Error code**: `UserErrorInvalidParameterInRequest`

**Error message**: Request parameter is invalid.

**Recommended action**: Retry the operation with valid inputs.


### UserErrorRequestDisallowedByAzurePolicy

**Error code**: `UserErrorRequestDisallowedByAzurePolicy`

**Error message**: An Azure Policy is configured on the resource which is preventing the operation.

**Recommended action**: Correct the policy and retry the operation.

### LongRunningRestoreTrackingFailure

**Error code**: `LongRunningRestoreTrackingFailure`


**Error message**: Failed to track the long-running restore operation. The operation is still running and is expected to complete the restore of data.

**Recommended action**: Track further progress of this operation using the storage account's activity log for Restore blob ranges operation.

### LongRunningBackupTrackingFailure

**Error code**: `LongRunningBackupTrackingFailure`

**Error message**: Failed to track the long-running backup operation. The operation is still running and is expected to complete the backup of data.

**Recommended action**: Track further progress of this operation using the storage account's activity log or check the blob replication status.

### LongRunningOperationTrackingFailure

**Error code**: `LongRunningOperationTrackingFailure`

**Error message**: Failed to track the long-running operation. The operation is still running and is expected to complete.

**Recommended action**: Track further progress on the operation in storage account activity log.

### UserErrorVaultedBackupFeatureNotEnabled

**Error code**: `UserErrorVaultedBackupFeatureNotEnabled`

**Error message**: The subscription must be registered for the required features to use vaulted backup for blobs.

**Recommended action**: Register your subscription for Microsoft.Storage/HardenBackup and Microsoft.DataProtection/BlobVaultedBackup.

### ObjectReplicationPolicyCreationFailure

**Error code**: `ObjectReplicationPolicyCreationFailure`

**Error message**: Failed to create object replication policy on the storage account.

**Recommended action**: Failed to create object replication policy. Wait for a few minutes and then try the operation again. If the issue persists, please contact Microsoft support.

### UserErrorRequiredStorageFeaturesDisabled 

**Error code**: `UserErrorRequiredStorageFeaturesDisabled`

**Error message**: The operation failed due to required storage feature(s) being disabled on the storage account.

**Recommended action**: Enable required features for Azure backup on source Storage account.

### UserErrorSelectedContainerPartOfAnotherORPolicy

**Error code**: `UserErrorSelectedContainerPartOfAnotherORPolicy`

**Error message**: The selected container is present in another Object replication policy. A given container can be part of only one OR policy at a time.

**Recommended action**: The container from other OR policy. Or change protection intent.

### UserErrorTooManyRestoreCriteriaGivenForBlobRestore

**Error code**: `UserErrorTooManyRestoreCriteriaGivenForBlobRestore`

**Error message**: The count of containers passed in the restore request exceeds the supported limit.

**Recommended action**: Reduce the number of containers in item level restore request to adhere to the limit.
	
### UserErrorTooManyPrefixesGivenForBlobRestore 

**Error code**: `UserErrorTooManyPrefixesGivenForBlobRestore `

**Error message**: Restore operation failed as too many blob prefixes were given for a container

**Recommended action**: Limit the number of blob prefixes to lower it on a per-container basis.

### UserErrorStopProtectionNotSupportedForBlobOperationalBackup

**Error code**: `UserErrorStopProtectionNotSupportedForBlobOperationalBackup`

**Error message**: Stop protection is not supported for operational tier blob backups

**Recommended action**: Operational tier blob backups cannot be stopped.up

### UserErrorAzureStorageAccountManagementOperationLimitReached 

**Error code**: `UserErrorAzureStorageAccountManagementOperationLimitReached`

**Error message**: Requested operation failed due to throttling by the Azure service. Azure Storage account management list operations limit reached.

**Recommended action&&: Wait for a few minutes and then try the operation again.

### UserErrorBlobVersionDeletedDuringBackup 

**Error code**: `UserErrorBlobVersionDeletedDuringBackup`

**Error message**: The backup failed due to one or more blob versions getting deleted in the backup job duration.

**Recommended action**: We recommend you to avoid tampering with blob versions while a backup job is in  progress. Ensure the minimum retention configured for versions in the life cycle management policy is 7 days.

### UserErrorBlobVersionArchivedDuringBackup

**Error code**: `UserErrorBlobVersionArchivedDuringBackup`

**Error message**: The backup failed due to one or more blob versions moving to the archive tier in the backup job duration.

**Recommended action**: We recommend you to avoid tampering with blob versions while a backup job is in  progress. Ensure the minimum retention configured for versions in the life cycle management policy is *7 days*.

### UserErrorBlobVersionArchivedAndDeletedDuringBackup

**Error code**: `UserErrorBlobVersionArchivedAndDeletedDuringBackup`

**Error message**: The backup failed due to one or more blob versions moving to the archive tier or getting deleted in the backup job duration.

**Recommended action**: We recommend you to avoid tampering with blob versions while a backup job is in  progress. Ensure the minimum retention configured for versions in the life cycle management policy is 7 days.

### UserErrorContainerHasImmutabilityPolicyDuringRestore

**Error code**: `UserErrorContainerHasImmutabilityPolicyDuringRestore` 

**Error message**: One or more containers selected for the restore has an immutability policy.

**Recommended action**: Remove the immutability policy from the container and retry the operation.

### UserErrorArchivedRecoveryPointsRequestedForRestore

**Error code**: `UserErrorArchivedRecoveryPointsRequestedForRestore`

**Error message**: One or more containers selected for the restore have archived recovery points.

**Recommended action**: Re-hydrate archived recovery points or remove containers with archived recovery points from request and retry the operation.

### UserErrorObjectReplicationPolicyDeletionFailureOnRestoreTarget

**Error code**: `UserErrorObjectReplicationPolicyDeletionFailureOnRestoreTarget`

**Error message**: Failed to delete object replication policy on the restore target storage account.

**Recommended action**: Check if a resource lock is preventing deletion. The restore has succeeded but the object replication policy created during restore operation was not cleaned up after restore completion. You must delete the policy to prevent issues in future restores.

### UserErrorRestoreFailurePreviousObjectReplicationPolicyNotDeleted

**Error code**: `UserErrorRestoreFailurePreviousObjectReplicationPolicyNotDeleted`

**Error message**: Failed to restore the backup instance because an object replication policy from a previous restore is still on the restore target storage account

**Recommended action**: Remove the old object replication policy from the restore target and retry.

### UserErrorKeyVaultKeyWasNotFound

**Error code**: `UserErrorKeyVaultKeyWasNotFound`

**Error message**: Operation failed because key vault key is not found to unwrap the encryption key.

**Recommended action**: Check the key vault settings.	

### UserErrorInvalidResourceUriInRequest 

**Error code**: `UserErrorInvalidResourceUriInRequest`

**Error message**: Operation failed due to invalid Resource Uri in the request.

**Recommended action**: Fix the Resource Uri format in the request object and trigger the operation again.

### UserErrorDatasourceAndBackupVaultLocationMismatch

**Error code**: `UserErrorDatasourceAndBackupVaultLocationMismatch`

**Error message**: Operation failed because the datasource location is different from the Backup Vault location.

**Recommended action**: Ensure that the datasource and the Backup Vault are in the same location.

### LinkedAuthorizationFailed

*Error code**: `LinkedAuthorizationFailed`

**Error message**: The client [user name] with object ID has permissions to perform the required action [operation name] on scope [vault name], however, it does not have the required permissions to perform action(s) [operation name] on the linked scope [datasource name].

**Recommended action**: Ensure that you have read access on the datasource associated with this backup instance to be able to trigger the restore operation. Once the required permissions are provided, retry the operation. 
