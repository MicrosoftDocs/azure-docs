---
title: Troubleshoot SAP HANA databases instance backup errors
description: This article describes how to troubleshoot common errors that might occur when you use Azure Backup to back up SAP HANA database instances.
ms.topic: troubleshooting
ms.date: 11/02/2023
ms.service: backup
ms.custom: ignite-2022
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Troubleshoot SAP HANA snapshot backup jobs on Azure Backup

This article provides troubleshooting information to back up SAP HANA databases instances on Azure Virtual Machines. For more information on the SAP HANA backup scenarios we currently support, see [Scenario support](sap-hana-backup-support-matrix.md#scenario-support).

## Common user errors

### Error code: UserErrorVMIdentityNotEnabled

**Error message**: System-assigned managed identity is not enabled on the Azure VM.

**Recommended action**: To fix this issue, retry the operation. Follow these steps:

1. Enable system-assigned managed identity on the Azure VM.
1. Assign required role actions for the Azure VM identity. For more information, see [Azure workload backup troubleshooting scripts](https://aka.ms/DBSnapshotRBACPermissions).

### Error code: UserErrorVMIdentityRequiresCreateSnapshotsRole

**Error message**: Azure VM's system-assigned managed identity not authorized to create snapshots.

**Recommended action**: Assign the Disk Snapshot Contributor role to the Azure VM's system-assigned managed identity at snapshot resource group scope and retry the operation. For more information, see the [Azure workload backup troubleshooting scripts](https://aka.ms/DBSnapshotRBACPermissions).

### UserErrorVMIdentityRequiresReadSnapshotsRole

**Error message**: Azure VM's system-assigned managed identity not authorized to read snapshots.

**Recommended action**: Assign the Disk Snapshot Contributor role to the Azure VM's system-assigned managed identity at snapshot resource group scope and retry the operation. For more information, see the [Azure workload backup troubleshooting scripts](https://aka.ms/DBSnapshotRBACPermissions).

### UserErrorVMIdentityRequiresReadDisksRole

**Error message**: Azure VM's system-assigned managed identity not authorized to read disks details.

**Recommended action**: Assign the Disk Snapshot Contributor role to the Azure VM's system-assigned managed identity at snapshot resource group scope and retry the operation. For more information, see the [Azure workload backup troubleshooting scripts](https://aka.ms/DBSnapshotRBACPermissions).

### UserErrorVMIdentityRequiresCreateDisksRole

**Error message**: Azure VM's system-assigned managed identity not authorized to create disks.

**Recommended action**: Assign the Disk Snapshot Contributor role to the Azure VM's system-assigned managed identity at snapshot resource group scope and retry the operation. For more information, see the [Azure workload backup troubleshooting scripts](https://aka.ms/DBSnapshotRBACPermissions).

### UserErrorVMIdentityRequiresUpdateVMRole

**Error message**: Azure VM's system-assigned managed identity not authorized to attach disks on virtual machine.

**Recommended action**: Assign the Virtual Machine Contributor role to the Azure VM's system-assigned managed identity on target Azure VM and retry the operation. For more information, see the [Azure workload backup troubleshooting scripts](https://aka.ms/DBSnapshotRBACPermissions).

### UserErrorVMIdentityRequiresReadVMRole

**Error message**: Azure VM's system-assigned managed identity not authorized to read virtual machine storage profile.

**Recommended action**: Assign the Virtual Machine Contributor role to the Azure VM's system-assigned managed identity on the target 
Azure VM and retry the operation. For more information, see the [Azure workload backup troubleshooting scripts](https://aka.ms/DBSnapshotRBACPermissions).

### UserErrorDiskTypeNotSupportedForWkloadBackup

**Error message**: Unmanaged disk not supported for workload snapshot backups.

**Recommended action**: Create a managed disk from the disk vhd and retry the operation.

### Error code: UserErrorMaxDisksSupportedForWkloadBackupExceeded

**Error message**: Disks count exceeded maximum disks supported for workload backup.

**Recommended action**: Check the [support matrix for workload snapshot backups](sap-hana-backup-support-matrix.md#scenario-support). Then reduce the disk count accordingly and retry the operation.

### UserErrorWLBackupFilesystemTypeNotSupported

**Error message**: File system type not supported for workload snapshot backups.

**Recommended action**: Check the [support matrix for workload snapshot backups](sap-hana-backup-support-matrix.md#scenario-support). Then copy datasources to a volume with supported filesystem type and retry the operation.

### UserErrorWLBackupDeviceTypeNotSupported

**Error message**: Device type not supported for workload snapshot backups.

**Recommended action**: Check the [support matrix for workload snapshot backups](sap-hana-backup-support-matrix.md#scenario-support). Then move datasource to supported device type and retry the operation.

### UserErrorWLOnOSVolumeNotSupported

**Error message**: Workload data on OS volume is not supported for snapshot based backups.

**Recommended action**: To use snapshot backups, move the workload data to another non-OS volume.

### UserErrorVMIdentityRequiresGetDiskSASRole

**Error message**: Azure VM's system-assigned identity is not authorized to get disk shared access signature (SAS URI).

**Recommended action**: Assign the Disk Snapshot Contributor role to the Azure VM's system-assigned managed identity at disk scope. For more information, see the [Azure workload backup troubleshooting scripts](https://aka.ms/DBSnapshotRBACPermissions). Then retry the operation.

### UserErrorSnapshotTargetRGNotFoundOrVMIdentityRequiresPermissions

**Error message**: Either the snapshot resource group does not exist or the Azure VM's system-assigned managed identity is not authorized to create snapshots in snapshot resource group.

**Recommended action**: Ensure that the snapshot resource group specified in the database instance snapshot policy exists, and required actions are assigned to the Azure VM's system-assigned managed identity. For more information, see the [Azure workload backup troubleshooting scripts](https://aka.ms/DBSnapshotRBACPermissions).

### UserErrorVMIdentityRequiresPermissionsForSnapshot

**Error message**: Azure VM's system-assigned managed identity does not have adequate permissions for snapshot based workload backup.

**Recommended action**: Assign required role actions for the Azure VM identity mentioned in additional error details. For more information, see the [Azure workload backup troubleshooting scripts](https://aka.ms/DBSnapshotRBACPermissions).

### UserErrorSnapshotOperationsUnsupportedWithInactiveDatabase

**Error message**: Snapshot backups are not supported on inactive database(s).

**Recommended action**: Ensure that all databases are up and running, then retry the operation.

### Error code: UserErrorDeleteSnapshotRoleOrResourceGroupMissing

**Error message**: Azure Backup does not have permissions to delete workload backup snapshots or the snapshot resource group does not exist.

**Recommended action**: Assign the Disk Snapshot Contributor role to the Backup Management Service at snapshot resource group scope. For more information, see the [Azure workload backup troubleshooting scripts](https://aka.ms/DBSnapshotRBACPermissions). Then retry the operation.

### UserErrorConflictingFileSystemPresentOnTargetMachine

**Error message**: Can't attach snapshot because disks/filesystem with the same identity are present on the target machine.

**Recommended action**: Select another target machine for snapshot restore. For more information, see the [SAP HANA database backup troubleshooting article](https://aka.ms/HANASnapshotTSGuide).

### UserErrorDiskAttachLimitReached

**Error message**: The limit on maximum number of attached disks on the VM is reached.

**Recommended action**: Detach unused disks or perform restore on a different machine. For more information, see the [SAP HANA database backup troubleshooting article](https://aka.ms/HANASnapshotTSGuide).

### Error code: UserErrorPITSnapshotDeleted

**Error message**: The selected snapshot recovery point is deleted or not present in the resource group.

**Recommended action**: Select another snapshot recovery point. For more information, see the [SAP HANA database backup troubleshooting article](https://aka.ms/HANASnapshotTSGuide).

### UserErrorRestoreDiskIncompatible

**Error message**: The restored disk type is not supported by the target vm.

**Recommended action**: Upgrade the VM or use a compatible target vm for restore. For more information, see the [SAP HANA database backup troubleshooting article](https://aka.ms/HANASnapshotTSGuide).

### UserErrorSnasphotRestoreContextMissingForDBRecovery 
 
**Error message**: Snapshot based point in time restore operation could not be started because one of the previous restore steps is not complete

**Cause**: Snapshot attach and mount or SystemDB recovery isn't done on the target VM.

**Recommended action**:  Retry the operation after completing a snapshot attach and mount operation on the target machine. 

### UserErrorInvalidScenarioForSnapshotPointInTimeRecovery 

**Cause**:  The snapshot point-in-time restore operation failed as the underlying database on the target machine is protected with Azure Backup.

**Recommended action**: Retry the restore operation after you stop protection of the databases on the target machine and ensure that the *Backint path is empty*. [Learn more about Backint path](https://aka.ms/HANABackupConfigurations).

## Appendix

**Perform restoration actions in SAP HANA studio**

1. Recover System database from data snapshot using HANA Studio. See this [SAP documentation](https://help.sap.com/docs/SAP_HANA_COCKPIT/afa922439b204e9caf22c78b6b69e4f2/9fd053d58cb94ac69655b4ebc41d7b05.html).
1. Run the pre-registration script to reset the user credentials.
1. Once done, recover all tenant databases from a data snapshot using HANA Studio. See this [HANA documentation](https://help.sap.com/docs/SAP_HANA_COCKPIT/afa922439b204e9caf22c78b6b69e4f2/b2c283094b9041e7bdc0830c06b77bf8.html).

## Next steps

Learn about [Azure Backup service to back up database instances](sap-hana-db-about.md#using-the-azure-backup-service-to-back-up-database-instances).
