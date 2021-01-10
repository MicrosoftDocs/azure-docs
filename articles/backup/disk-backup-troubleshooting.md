---
title: Troubleshooting backup failures in Azure Disk Backup
description: Learn how to troubleshoot backup failures in Azure Disk Backup
ms.topic: conceptual
ms.date: 01/07/2021
---



**Troubleshooting backup failures on Azure Disk**

This article provides troubleshooting information on backup and restore issues faced with Azure Disk. For more information on the [Azure Disk backup](https://aka.ms/diskbackupdoc-overview) region availability, supported scenarios and limitations, see the [support matrix](https://aka.ms/diskbackupdoc-supportmatrix).

 

## Common issues faced with Azure Disk backup 

 

Error Code: UserErrorSnapshotRGSubscriptionMismatch

Error Message: Invalid subscription selected for Snapshot Data store 

Recommended Action: Disk and Disk Snapshots are stored in the same subscription. You can choose any Resource Group to store the disk snapshots within the subscription. Please select the same subscription as that of the source disk. For more information, refer the support matrix - https://aka.ms/diskbackupdoc-supportmatrix

 

Error Code: UserErrorSnapshotRGNotFound

Error Message: Could not perform the operation as Snapshot Data store Resource Group does not exist.

Recommended Action: Please create Resource Group and provide required permissions on it. For more information, refer to configure backup - https://aka.ms/diskbackupdoc-backup

 

Error Code: UserErrorManagedDiskNotFound

Error Message: Could not perform the operation as Managed Disk no longer exists.

Recommended Action: The backups will continue to fail as the source disk may be deleted or moved to different location. Use the existing Restore point to restore the disk if it is deleted by mistake. If the disk is moved to a different location, configure backup for the disk. 

 

Error Code: UserErrorNotEnoughPermissionOnDisk

Error Message: Azure Backup Service requires additional permissions on the Disk to do this operation. 

Recommended Action: Grant Backup Vault managed identity appropriate permissions on the Disk. Refer documentation to understand what permissions are required by the Backup Vault managed identity and how to provide it - https://aka.ms/diskbackupdoc-backup

 

Error Code: UserErrorNotEnoughPermissionOnSnaphotRG

Error Message: Azure Backup Service requires additional permissions on the Snapshot Data store Resource Group to do this operation.

Recommended Action: Grant Backup Vault managed identity appropriate permissions on the Snapshot Data store Resource Group. Snapshot Data store Resource Group is the location where the disk snapshots are stored. Refer documentation to understand which is the Resource Group, what permissions are required by the Backup Vault managed identity and how to provide it - https://aka.ms/diskbackupdoc-backup

 

Error Code: UserErrorDiskBackupDiskOrMSIPermissionsNotPresent

Error Message: Invalid disk or Azure Backup Service requires additional permissions on the Disk to do this operation

Recommended Action: The backups will continue to fail as the source disk may be deleted or moved to different location. Use the existing Restore point to restore the disk if its deleted by mistake. If the disk is moved to a different location, configure backup for the disk. If the disk is not deleted or moved, grant Backup Vault managed identity appropriate permissions on the Disk. Refer documentation to understand what permissions are required by the Backup Vault managed identity and how to provide it - https://aka.ms/diskbackupdoc-backup

 

Error Code: UserErrorDiskBackupSnapshotRGOrMSIPermissionsNotPresent

Error Message: Could not perform the operation as Snapshot Data store Resource Group no longer exists. Or Azure Backup Service requires additional permissions on the Snapshot Data store Resource Group to do this operation.

Recommended Action: Please create Resource Group and grant Backup Vault managed identity appropriate permissions on the Snapshot Data store Resource Group. Snapshot Data store Resource Group is the location where the disk snapshots are stored. Refer documentation to understand which is the Resource Group, what permissions are required by the Backup Vault managed identity and how to provide it - https://aka.ms/diskbackupdoc-backup

 

Error Code: UserErrorDiskBackupAuthorizationFailed

Error Message: Backup Vault managed identity is missing the necessary permissions to do this operation.

Recommended Action: Grant Backup Vault managed identity appropriate permissions on the disk to be backed up and on the Snapshot data store resource group where the snapshots are stored. Refer documentation to understand what permissions are required by the Backup Vault managed identity and how to provide it - https://aka.ms/diskbackupdoc-backup

 

Error Code: UserErrorSnapshotRGOrMSIPermissionsNotPresent

Error Message: Could not perform the operation as Snapshot Data store Resource Group no longer exists. Or, Azure Backup Service requires additional permissions on the Snapshot Data store Resource Group to do this operation.

Recommended Action: Please create Resource Group and grant Backup Vault Managed identity appropriate permissions on the Snapshot Data store Resource Group. Snapshot Data store Resource Group is the location where the snapshots are stored. Refer documentation to understand which is the Resource Group, what permissions are required by the Backup Vault Managed identity and how to provide it - https://aka.ms/diskbackupdoc-backup

 

Error Code: UserErrorOperationalStoreParametersNotProvided

Error Message: Could not perform the operation as Snapshot Data store Resource Group parameter is not provided

Recommended Action: Please provide Snapshot Data store Resource Group parameter. Snapshot Data store Resource Group is the location where the disk snapshots are stored. For more information refer to - https://aka.ms/diskbackupdoc-backup

 

Error Code: UserErrorInvalidOperationalStoreResourceGroup

Error Message: Snapshot Data store Resource Group provided is invalid

Recommended Action: Please provide valid Resource group for Snapshot Data store. Snapshot Data store Resource Group is the location where the disk snapshots are stored. For more information refer to - https://aka.ms/diskbackupdoc-backup

 

Error Code: UserErrorDiskBackupDiskTypeNotSupported

Error Message: Unsupported disk type 

Recommended Action: Please refer to the support matrix on unsupported scenarios and limitations - https://aka.ms/diskbackupdoc-supportmatrix

 

Error Code: UserErrorSameNameDiskAlreadyExists

Error Message: Could not restore as a Disk with same name already exists in the selected target resource group

Recommended Action: Please provide a different Disk name for restore. For more details refer to - https://aka.ms/diskbackupdoc-restore

 

Error Code: UserErrorRestoreTargetRGNotFound

Error Message: Operation failed as the Target Resource Group does not exist.

Recommended Action: Please provide a valid Resource Group to restore. For more details refer to - https://aka.ms/diskbackupdoc-restore

 

Error Code: UserErrorNotEnoughPermissionOnTargetRG

Error Message: Azure Backup Service requires additional permissions on the Target Resource Group to do this operation.

Recommended Action: Grant Backup Vault managed identity appropriate permissions on the Target Resource Group. Target Resource Groups is the selected location where the disk is to be restored. Refer documentation to understand what permissions are required by the Backup Vault managed identity and how to provide it - https://aka.ms/diskbackupdoc-restore

 

Error Code: UserErrorSubscriptionDiskQuotaLimitReached

Error Message: Operation has failed as the Disk quota maximum limit has been reached on the subscription.

Recommended Action: Refer to Azure subscription and service limits and quota documentation - https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits or contact Microsoft Support for further guidance.

 

Error Code: UserErrorDiskBackupRestoreRGOrMSIPermissionsNotPresent

Error Message: Operation failed as the Target Resource Group does not exist. Or Azure Backup Service requires additional permissions on the Target Resource Group to do this operation.

Recommended Action: Please provide a valid Resource Group to restore. And grant Backup Vault managed identity appropriate permissions on the Target Resource Group. Target Resource Groups is the selected location where the disk is to be restored. Refer documentation to understand what permissions are required by the Backup Vault managed identity and how to provide it - https://aka.ms/diskbackupdoc-restore

 

Error Code: UserErrorDESKeyVaultKeyDisabled

Error Message: The key vault key used for disk encryption set is not in enabled state.

Recommended Action: Please enable the key vault key used for disk encryption set. Please refer to the limitations in the support matrix - https://aka.ms/diskbackupdoc-supportmatrix

 

Error Code: UserErrorMSIPermissionsNotPresentOnDES

Error Message: Azure Backup Service needs permission to access the disk encryption set used with the disk.

Recommended Action: Please provide Reader access to the Backup Vault managed identity to the disk encryption set (DES)

 

Error Code: UserErrorDESKeyVaultKeyNotAvailable

Error Message: The key vault key used for disk encryption set is not available.

Recommended Action: Please ensure that the key vault key used for disk encryption set is not disabled or deleted.

  

Error Code: UserErrorDiskSnapshotNotFound

Error Message: The disk snapshot for this Restore point has been deleted.

Recommended Action: Snapshots are stored in the Snapshot data store resource group within your subscription. It may be possible that the snapshot related to the selected restore point might have been deleted or moved from this resource group. Consider using another Recovery point to restore. Also, follow the recommended guidelines for choosing Snapshot resource group mentioned in the documentation - https://aka.ms/diskbackupdoc-restore

 

Error Code: UserErrorSnapshotMetadataNotFound

Error Message: The disk snapshot metadata for this Restore point has been deleted

Recommended Action: Consider using another Recovery point to restore. For more details refer to - https://aka.ms/diskbackupdoc-restore

 

Error Code: UserErrorMaxConcurrentOperationLimitReached

Error Message: Unable to start the operation as maximum number of allowed concurrent operations has reached for this operation type.

Recommended Action: Please wait until previous operation(s) complete.

 **
**

## Next steps


