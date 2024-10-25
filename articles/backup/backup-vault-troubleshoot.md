---
title: Troubleshoot Backup vault management operations on Azure Backup
description: This article describes how to troubleshoot common errors that might occur when you manage Backup vault.
ms.topic: troubleshooting
ms.date: 10/25/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Troubleshoot Backup vault management operations on Azure Backup

This article provides troubleshooting information to manage Back vault operations. For more information on the supported Backup vault management scenarios we currently support, see [Backup vault overview](backup-vault-overview.md).

## Common user errors

This section provides the troubleshooting details for the issues you might encounter while moving  Backup vaults to a different subscription.

### BackupVaultMoveResourcesPartiallySucceeded   

**Cause**: You may face this error when Backup vault move succeeds only partially.

**Recommendation**: The issue should get resolved automatically within 36 hours. If it persists, contact Microsoft Support.

### BackupVaultMoveResourcesCriticalFailure 

**Cause**: You may face this error when Backup vault move fails critically. 

**Recommendation**: The issue should get resolved automatically within 36 hours. If it persists, contact Microsoft Support. 

### UserErrorBackupVaultResourceMoveInProgress 

**Cause**: You may face this error if you try to perform any operations on the Backup vault while it’s being moved. 

**Recommendation**: Wait till the move operation is complete, and then retry. 

### UserErrorBackupVaultResourceMoveNotAllowedForMultipleResources

**Cause**: You may face this error if you try to move multiple Backup vaults  in a single attempt. 

**Recommendation**: Ensure that only one Backup vault is selected for every move operation. 

### UserErrorBackupVaultResourceMoveNotAllowedUntilResourceProvisioned

**Cause**: You may face this error if the vault is not yet provisioned. 

**Recommendation**: Retry the operation after some time.

### BackupVaultResourceMoveIsNotEnabled 

**Cause**: Resource move for Backup vault is currently not supported in the selected Azure region.

**Recommendation**: Ensure that you've selected one of the supported regions to move Backup vaults. See [Supported regions](manage-backup-vault.md#supported-regions).

### UserErrorCrossTenantMSIMoveNotSupported 

**Cause**: This error occurs if the subscription with which resource is associated has moved to a different Tenant, but the Managed Identity is still associated with the old Tenant.

**Recommendation**: Remove the Managed Identity from the existing Tenant; move the resource and add it again to the new one.

## Next step

Learn [how to manage vault lifecycle via Azure Business Continuity Center](../business-continuity-center/manage-vault.md).
