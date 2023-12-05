---
title: Troubleshooting backup failures in Azure Disk Backup
description: Learn how to troubleshoot backup failures in Azure Disk Backup
ms.topic: conceptual
ms.date: 06/08/2021
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Troubleshooting backup failures in Azure Disk Backup

This article provides troubleshooting information on backup and restore issues faced with Azure Disk. For more information on the [Azure Disk backup](disk-backup-overview.md) region availability, supported scenarios and limitations, see the [support matrix](disk-backup-support-matrix.md).

## Common issues faced with Azure Disk Backup

### Error Code: UserErrorSnapshotRGSubscriptionMismatch

Error Message: Invalid subscription selected for Snapshot Data store

Recommended Action: Disks and disk snapshots are stored in the same subscription. You can choose any resource group to store the disk snapshots within the subscription. Select the same subscription as that of the source disk. For more information, see the [support matrix](disk-backup-support-matrix.md).

### Error Code: UserErrorSnapshotRGNotFound

Error Message: Could not perform the operation as Snapshot Data store Resource Group does not exist.

Recommended Action: Create the resource group and provide the required permissions on it. For more information, see [configure backup](backup-managed-disks.md#configure-backup).

### Error Code: UserErrorManagedDiskNotFound

Error Message: Could not perform the operation as Managed Disk no longer exists.

Recommended Action: The backups will continue to fail as the source disk may be deleted or moved to a different location. Use the existing restore point to restore the disk if it's deleted by mistake. If the disk is moved to a different location, configure backup for the disk.

### Error Code: UserErrorNotEnoughPermissionOnDisk

Error Message: Azure Backup Service requires additional permissions on the Disk to do this operation.

Recommended Action: Grant the Backup vault's managed identity the appropriate permissions on the disk. Refer to [the documentation](backup-managed-disks.md) to understand what permissions are required by the Backup Vault managed identity and how to provide it.

### Error Code: UserErrorNotEnoughPermissionOnSnapshotRG

Error Message: Azure Backup Service requires additional permissions on the Snapshot Data store Resource Group to do this operation.

Recommended Action: Grant the Backup vault's managed identity the appropriate permissions on the snapshot data store resource group. The snapshot data store resource group is the location where the disk snapshots are stored. Refer to [the documentation](backup-managed-disks.md) to understand which is the resource group, what permissions are required by the Backup Vault managed identity and how to provide it.

### Error Code: UserErrorDiskBackupDiskOrMSIPermissionsNotPresent

Error Message: Invalid disk or Azure Backup Service requires additional permissions on the Disk to do this operation

Recommended Action: The backups will continue to fail as the source disk may be deleted or moved to a different location. Use the existing restore point to restore the disk if it's deleted by mistake. If the disk is moved to a different location, configure backup for the disk. If the disk isn't deleted or moved, grant the Backup vault's managed identity the appropriate permissions on the disk. Refer to [the documentation](backup-managed-disks.md) to understand what permissions are required by the Backup vault's managed identity and how to provide it.

### Error Code: UserErrorDiskBackupSnapshotRGOrMSIPermissionsNotPresent

Error Message: Could not perform the operation as Snapshot Data store Resource Group no longer exists. Or Azure Backup Service requires additional permissions on the Snapshot Data store Resource Group to do this operation.

Recommended Action: Create a resource group and grant the Backup vault's managed identity the appropriate permissions on the snapshot data store resource group. The snapshot data store resource group is the location where the disk snapshots are stored. Refer to [the  documentation](backup-managed-disks.md) to understand what is the resource group, what permissions are required by the Backup vault's managed identity and how to provide it.

### Error Code: UserErrorDiskBackupAuthorizationFailed

Error Message: Backup Vault managed identity is missing the necessary permissions to do this operation.

Recommended Action: Grant the Backup vault's managed identity the appropriate permissions on the disk to be backed up and on the snapshot data store resource group where the snapshots are stored. Refer to [the documentation](backup-managed-disks.md) to understand what permissions are required by the Backup vault's managed identity and how to provide it.

### Error Code: UserErrorSnapshotRGOrMSIPermissionsNotPresent

Error Message: Could not perform the operation as Snapshot Data store Resource Group no longer exists. Or, Azure Backup Service requires additional permissions on the Snapshot Data store Resource Group to do this operation.

Recommended Action: Create the resource group and grant the Backup vault's managed identity the appropriate permissions on the snapshot data store resource group. The snapshot data store resource group is the location where the snapshots are stored. Refer to [the  documentation](backup-managed-disks.md) to understand what is the resource group, what permissions are required by the Backup vault's managed identity, and how to provide it.

### Error Code: UserErrorOperationalStoreParametersNotProvided

Error Message: Could not perform the operation as Snapshot Data store Resource Group parameter is not provided

Recommended Action: Provide the snapshot data store resource group parameter. The snapshot data store resource group is the location where the disk snapshots are stored. For more information, see [the documentation](backup-managed-disks.md).

### Error Code: UserErrorInvalidOperationalStoreResourceGroup

Error Message: Snapshot Data store Resource Group provided is invalid

Recommended Action: Provide a valid resource group for the snapshot data store. The snapshot data store resource group is the location where the disk snapshots are stored. For more information, see [the documentation](backup-managed-disks.md).

### Error Code: UserErrorDiskBackupDiskTypeNotSupported

Error Message: Unsupported disk type

Recommended Action: Refer to [the support matrix](disk-backup-support-matrix.md) on unsupported scenarios and limitations.

### Error Code: UserErrorSameNameDiskAlreadyExists

Error Message: Could not restore as a Disk with same name already exists in the selected target resource group

Recommended Action: Provide a different disk name for restore. For more information, see [Restore Azure Managed Disks](restore-managed-disks.md).

### Error Code: UserErrorRestoreTargetRGNotFound

Error Message: Operation failed as the Target Resource Group does not exist.

Recommended Action: Provide a valid resource group to restore. For more information, see [Restore Azure Managed Disks](restore-managed-disks.md).

### Error Code: UserErrorNotEnoughPermissionOnTargetRG

Error Message: Azure Backup Service requires additional permissions on the Target Resource Group to do this operation.

Recommended Action: Grant the Backup vault's managed identity the appropriate permissions on the target resource group. The target resource group is the selected location where the disk is to be restored. Refer to the [restore documentation](restore-managed-disks.md) to understand what permissions are required by the Backup vault's managed identity, and how to provide it.

### Error Code: UserErrorSubscriptionDiskQuotaLimitReached

Error Message: Operation has failed as the Disk quota maximum limit has been reached on the subscription.

Recommended Action: Refer to the [Azure subscription and service limits and quota documentation](../azure-resource-manager/management/azure-subscription-service-limits.md) or contact Microsoft Support for further guidance.

### Error Code: UserErrorDiskBackupRestoreRGOrMSIPermissionsNotPresent

Error Message: Operation failed as the Target Resource Group does not exist. Or Azure Backup Service requires additional permissions on the Target Resource Group to do this operation.

Recommended Action: Provide a valid resource group to restore, and grant the Backup vault's managed identity the appropriate permissions on the target resource group. The target resource group is the selected location where the disk is to be restored. Refer to the [restore documentation](restore-managed-disks.md) to understand what permissions are required by the Backup vault's managed identity, and how to provide it.

### Error Code: UserErrorDESKeyVaultKeyDisabled

Error Message: The key vault key used for disk encryption set is not in enabled state.

Recommended Action: Enable the key vault key used for disk encryption set. Refer to the limitations in the [support matrix](disk-backup-support-matrix.md).

### Error Code: UserErrorMSIPermissionsNotPresentOnDES

Error Message: Azure Backup Service needs permission to access the disk encryption set used with the disk.

Recommended Action: Provide Reader access to the Backup vault's managed identity to the disk encryption set (DES).

### Error Code: UserErrorDESKeyVaultKeyNotAvailable

Error Message: The key vault key used for disk encryption set is not available.

Recommended Action: Ensure that the key vault key used for disk encryption set isn't disabled or deleted.

### Error Code: UserErrorDiskSnapshotNotFound

Error Message: The disk snapshot for this Restore point has been deleted.

Recommended Action: Snapshots are stored in the snapshot data store resource group within your subscription. It's possible that the snapshot related to the selected restore point might have been deleted or moved from this resource group. Consider using another Recovery point to restore. Also, follow the recommended guidelines for choosing Snapshot resource group mentioned in the [restore documentation](restore-managed-disks.md).

### Error Code: UserErrorSnapshotMetadataNotFound

Error Message: The disk snapshot metadata for this Restore point has been deleted

Recommended Action: Consider using another recovery point to restore. For more information, see the [restore documentation](restore-managed-disks.md).

### Error Code: BackupAgentPluginHostValidateProtectionError

Error Message: Disk Backup is not yet available in the region of the Backup Vault under which Configure Protection is being tried.

Recommended Action: Backup Vault must be in a supported region. For region availability see the [the support matrix](disk-backup-support-matrix.md).

### Error Code: UserErrorDppDatasourceAlreadyHasBackupInstance

Error Message: The disk you are trying to configure backup is already being protected. Disk is already associated with a backup instance in a Backup vault.

Recommended Action: This disk is already associated with a backup instance in a Backup vault. If you want to re-protect this disk, then delete the backup instance from the Backup vault where it's currently protected and re-protect the disk in any other vault.

### Error Code: UserErrorDppDatasourceAlreadyProtected

Error Message: The disk you are trying to configure backup is already being protected. Disk is already associated with a backup instance in a Backup vault.

Recommended Action: This disk is already associated with a backup instance in a Backup vault. If you want to re-protect this disk, then delete the backup instance from the Backup vault where it is currently protected and re-protect the disk in any other vault.

### Error Code: UserErrorMaxConcurrentOperationLimitReached

Error Message: Unable to start the operation as maximum number of allowed concurrent backups has reached.

Recommended Action: Wait until the previous running backup completes.

### Error Code: UserErrorMissingSubscriptionRegistration

Error Message: The subscription is not registered to use namespace ‘Microsoft.Compute’.

Recommended Action: The required resource provider hasn't been registered for your subscription. Register both the resource providers' namespace (_Microsoft.Compute_ and _Microsoft.Storage_) using the steps in [Solution 3](../azure-resource-manager/templates/error-register-resource-provider.md#solution-3---azure-portal).

## Next steps

[Azure Disk Backup support matrix](disk-backup-support-matrix.md)