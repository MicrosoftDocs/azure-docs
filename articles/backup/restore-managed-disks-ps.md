---
title: Restore Azure Managed Disks via Azure PowerShell
description: Learn how to restore Azure Managed Disks using Azure PowerShell.
ms.topic: conceptual
ms.date: 03/26/2021
---

# Restore Azure Managed Disks using Azure PowerShell

This article explains how to restore [Azure Managed Disks](../virtual-machines/managed-disks-overview.md) from a restore point created by Azure Backup.

Currently, the Original-Location Recovery (OLR) option of restoring by replacing existing the source disk from where the backups were taken isn't supported. You can restore from a recovery point to create a new disk either in the same resource group as that of the source disk from where the backups were taken or in any other resource group. This is known as Alternate-Location Recovery (ALR) and this helps to keep both the source disk and the restored (new) disk.

In this article, you'll learn how to:

- Restore to create a new disk

- Track the restore operation status

We will refer to an existing backup vault "TestBkpVault" under the resource group "testBkpVaultRG" in the examples

```azurepowershell-interactive
$TestBkpVault = Get-AzDataProtectionBackupVault -VaultName TestBkpVault -ResourceGroupName "testBkpVaultRG"
```

## Restore to create a new disk

### Setting up permissions

Backup Vault uses Managed Identity to access other Azure resources. To restore from backup, Backup vault’s managed identity requires a set of permissions on the resource group where the disk is to be restored.

Backup vault uses a system assigned managed identity, which is restricted to one per resource and is tied to the lifecycle of this resource. You can grant permissions to the managed identity by using Azure role-based access control (Azure RBAC). Managed identity is a service principal of a special type that may only be used with Azure resources. Learn more about [Managed Identities](../active-directory/managed-identities-azure-resources/overview.md).

Assign the relevant permissions for vault's system assigned managed identity on the target resource group where the disks will be restored/created as mentioned [here](restore-managed-disks.md#restore-to-create-a-new-disk).

### Fetching the relevant recovery point

Fetch all instances using [Get-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/get-azdataprotectionbackupinstance?view=azps-5.7.0&preserve-view=true) command and identify the relevant instance.

```azurepowershell-interactive
$AllInstances = Get-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name
```

You can also use **Az.Resourcegraph** and the [Search-AzDataProtectionBackupInstanceInAzGraph](/powershell/module/az.dataprotection/search-azdataprotectionbackupinstanceinazgraph?view=azps-5.7.0&preserve-view=true) command to search across instances in many vaults and subscriptions.

```azurepowershell-interactive
$AllInstances = Search-AzDataProtectionBackupInstanceInAzGraph -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -DatasourceType AzureDisk -ProtectionStatus ProtectionConfigured
```

Once the instance is identified, fetch the relevant recovery point.

```azurepowershell-interactive
$rp = Get-AzDataProtectionRecoveryPoint -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupInstanceName $AllInstances[2].BackupInstanceName
```

### Preparing the restore request

Construct the ARM ID of the new disk to be created with the target resource group, to which permissions were assigned as detailed [above](#setting-up-permissions), and the required disk name. For example, a disk can be named **PSTestDisk2** under a resource group **targetrg** with a different subscription.

```azurepowershell-interactive
$targetDiskId = /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourceGroups/targetrg/providers/Microsoft.Compute/disks/PSTestDisk2
```

Use the [Initialize-AzDataProtectionRestoreRequest](/powershell/module/az.dataprotection/initialize-azdataprotectionrestorerequest?view=azps-5.7.0&preserve-view=true) command to prepare the restore request with all relevant details.

```azurepowershell-interactive
$restorerequest = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureDisk -SourceDataStore OperationalStore -RestoreLocation $TestBkpVault.Location  -RestoreType AlternateLocation -TargetResourceId $targetDiskId -RecoveryPoint $rp[0].Name
```

### Trigger the restore

Use the [Start-AzDataProtectionBackupInstanceRestore](/powershell/module/az.dataprotection/start-azdataprotectionbackupinstancerestore?view=azps-5.7.0&preserve-view=true) command to trigger the restore with the request prepared above.

```azurepowershell-interactive
Start-AzDataProtectionBackupInstanceRestore -BackupInstanceName $AllInstances[2].BackupInstanceName -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -Parameter $restorerequest
```

## Tracking job

Track all the jobs using the [Get-AzDataProtectionJob](/powershell/module/az.dataprotection/get-azdataprotectionjob?view=azps-5.7.0&preserve-view=true) command. You can list all jobs and fetch a particular job detail.

You can also use **Az.ResourceGraph** to track all jobs across all backup vaults. Use the [Search-AzDataProtectionJobInAzGraph](/powershell/module/az.dataprotection/search-azdataprotectionjobinazgraph?view=azps-5.7.0&preserve-view=true) command to get the relevant job, which can be across any backup vault.

```azurepowershell-interactive
$job = Search-AzDataProtectionJobInAzGraph -Subscription $sub -ResourceGroupName "testBkpVaultRG" -Vault $TestBkpVault.Name -DatasourceType AzureDisk -Operation OnDemandBackup
```

## Next steps

- [Azure Disk Backup FAQ](disk-backup-faq.yml)
