---
title: Back up SQL Server databases and instances in Azure VMs with PowerShell
description: Use Azure PowerShell to configure streaming database backups and SQL Server instance snapshot backups in Azure VMs.
ms.topic: how-to
ms.date: 10/19/2026
ms.custom: devx-track-azurepowershell
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a database administrator, I want to configure SQL Server database and instance snapshot backups using PowerShell so that I can automate data protection.
---

# Back up SQL Server databases and instances in Azure VMs with PowerShell

This article describes how to use Azure PowerShell to configure streaming backups for SQL Server databases and snapshot backups for SQL Server instances in Azure VMs. For restore and management operations, see [Restore](restore-azure-sql-vm-powershell.md) and [Manage](manage-azure-sql-vm-powershell.md).

## Prerequisites

- Install the [latest Azure PowerShell module](/powershell/azure/install-azure-powershell), including **Az.RecoveryServices**. Snapshot examples require a module version that exposes `MSSQLInstance` and the snapshot parameters shown in this article.
- Review the [SQL Server backup prerequisites](backup-azure-sql-database.md#prerequisites-for-sql-server-backup) and [support matrix](sql-support-matrix.md).
- For snapshot protection, review the [instance snapshot requirements](back-up-sql-server-instance-snapshot.md). Prepare the snapshot resource group and user-assigned managed identity with the required permissions.
- Replace values in angle brackets with the values for your environment. Examples use `-VaultId` rather than a session-wide vault context.

## Sign in and select a vault

Sign in interactively and select the subscription that contains the vault:

```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionId "<vault-subscription-id>"
Register-AzResourceProvider -ProviderNamespace "Microsoft.RecoveryServices"
Get-AzResourceProvider -ProviderNamespace "Microsoft.RecoveryServices"
```

Verify that the provider's registration state is `Registered`. If you need a new vault, create a resource group and vault in the required region:

```powershell
New-AzResourceGroup -Name "<vault-rg>" -Location "<region>"
New-AzRecoveryServicesVault -Name "<vault-name>" `
    -ResourceGroupName "<vault-rg>" -Location "<region>"
```

Retrieve the vault object. Set the storage redundancy for a new vault before protecting any items:

```powershell
$vault = Get-AzRecoveryServicesVault -ResourceGroupName "<vault-rg>" -Name "<vault-name>"
Set-AzRecoveryServicesBackupProperty -Vault $vault -BackupStorageRedundancy GeoRedundant
```

For an existing vault, retrieve `$vault` without changing its storage configuration. You can list vaults with `Get-AzRecoveryServicesVault`.

## Configure streaming database backup

### Create a streaming policy

Use [Get-AzRecoveryServicesBackupSchedulePolicyObject](/powershell/module/az.recoveryservices/get-azrecoveryservicesbackupschedulepolicyobject) and [Get-AzRecoveryServicesBackupRetentionPolicyObject](/powershell/module/az.recoveryservices/get-azrecoveryservicesbackupretentionpolicyobject) to get the default schedule and retention objects. Review them before creating the policy:

```powershell
$schedule = Get-AzRecoveryServicesBackupSchedulePolicyObject -WorkloadType MSSQL
$retention = Get-AzRecoveryServicesBackupRetentionPolicyObject -WorkloadType MSSQL
$schedule.FullBackupSchedulePolicy.ScheduleRunTimes[0] = `
    (Get-Date -Date "2026-10-19T01:30:00Z").ToUniversalTime()

$policy = New-AzRecoveryServicesBackupProtectionPolicy -Name "Sql-Streaming" `
    -WorkloadType MSSQL -SchedulePolicy $schedule -RetentionPolicy $retention `
    -VaultId $vault.ID
```

Schedule start times must be in UTC and in 30-minute increments, such as 01:00 or 01:30.

### Register the VM and discover databases

Register the VM that hosts SQL Server with the vault:

```powershell
$vm = Get-AzVM -ResourceGroupName "<vm-rg>" -Name "<vm-name>"
Register-AzRecoveryServicesBackupContainer -ResourceId $vm.ID `
    -BackupManagementType AzureWorkload -WorkloadType MSSQL -VaultId $vault.ID
```

List the available SQL components, and then select a database by using its name and server:

```powershell
Get-AzRecoveryServicesBackupProtectableItem -WorkloadType MSSQL -VaultId $vault.ID

$database = Get-AzRecoveryServicesBackupProtectableItem -WorkloadType MSSQL `
    -ItemType SQLDataBase -Name "<database-name>" -ServerName "<vm-name>" `
    -VaultId $vault.ID
```

Use the returned names to identify the database you want. Enable protection by using the streaming policy:

```powershell
Enable-AzRecoveryServicesBackupProtection -ProtectableItem $database `
    -Policy $policy -VaultId $vault.ID
```

### Discover newly added databases

If you add databases or instances after VM registration, refresh discovery:

```powershell
$container = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVMAppContainer `
    -BackupManagementType AzureWorkload -FriendlyName "<vm-name>" -VaultId $vault.ID
Initialize-AzRecoveryServicesBackupProtectableItem -Container $container `
    -WorkloadType MSSQL -VaultId $vault.ID
Get-AzRecoveryServicesBackupProtectableItem -WorkloadType MSSQL `
    -ItemType SQLDataBase -VaultId $vault.ID
```

### Enable autoprotection for future databases

To use streaming protection, enable autoprotection at the SQL instance level. Discovery for newly added databases runs as a background task every eight hours:

```powershell
$instance = Get-AzRecoveryServicesBackupProtectableItem -WorkloadType MSSQL `
    -ItemType SQLInstance -Name "<instance-name>" -ServerName "<vm-name>" `
    -VaultId $vault.ID
Enable-AzRecoveryServicesBackupAutoProtection -InputItem $instance `
    -BackupManagementType AzureWorkload -WorkloadType MSSQL `
    -Policy $policy -VaultId $vault.ID
```

For SQL Always On availability groups, register all nodes before selecting the availability group databases. For more information, see [Back up SQL Server availability groups](backup-sql-server-on-availability-groups.md).

## Configure SQL instance snapshot backup

### Create a snapshot policy with log backups

Use `MSSQLInstance` for snapshot schedule and retention objects. The schedule object has log backups enabled by default.  

```powershell
$snapshotSchedule = Get-AzRecoveryServicesBackupSchedulePolicyObject `
    -WorkloadType MSSQLInstance -BackupManagementType AzureWorkload
$snapshotRetention = Get-AzRecoveryServicesBackupRetentionPolicyObject `
    -WorkloadType MSSQLInstance -BackupManagementType AzureWorkload
$identityId = "/subscriptions/<subscription-id>/resourceGroups/<identity-rg>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>"

$snapshotPolicy = New-AzRecoveryServicesBackupProtectionPolicy -Name "SqlInst-SnapLog" `
    -WorkloadType MSSQLInstance -SchedulePolicy $snapshotSchedule `
    -RetentionPolicy $snapshotRetention -BackupSnapshotResourceGroup "<snapshot-rg>" `
    -InstantRPRetentionRangeInDays 5 -UserAssignedIdentityId $identityId `
    -VaultId $vault.ID
```

The resulting policy includes `SnapshotFull` and `Log` subpolicies.

### Create a snapshot-only policy

To omit log backups, set `IsLogBackupEnabled` on the **schedule** object to `$false`. The retention object doesn't have this property.  

```powershell
$snapshotOnlySchedule = Get-AzRecoveryServicesBackupSchedulePolicyObject `
    -WorkloadType MSSQLInstance -BackupManagementType AzureWorkload
$snapshotOnlyRetention = Get-AzRecoveryServicesBackupRetentionPolicyObject `
    -WorkloadType MSSQLInstance -BackupManagementType AzureWorkload
$snapshotOnlySchedule.IsLogBackupEnabled = $false

$snapshotOnlyPolicy = New-AzRecoveryServicesBackupProtectionPolicy -Name "SqlInst-SnapOnly" `
    -WorkloadType MSSQLInstance -SchedulePolicy $snapshotOnlySchedule `
    -RetentionPolicy $snapshotOnlyRetention -BackupSnapshotResourceGroup "<snapshot-rg>" `
    -InstantRPRetentionRangeInDays 5 -UserAssignedIdentityId $identityId `
    -VaultId $vault.ID
```

The resulting policy includes only the `SnapshotFull` subpolicy. Snapshot-only protection doesn't provide log-based point-in-time recovery.

### Register the VM for instance protection

Register the VM by using `MSSQLInstance`. For a VM in a different subscription, use its full resource ID. `-ContainerSubscriptionId` is optional.

```powershell
Register-AzRecoveryServicesBackupContainer `
    -ResourceId "/subscriptions/<vm-subscription-id>/resourceGroups/<vm-rg>/providers/Microsoft.Compute/virtualMachines/<vm-name>" `
    -BackupManagementType AzureWorkload -WorkloadType MSSQLInstance `
    -ContainerSubscriptionId "<vm-subscription-id>" -VaultId $vault.ID
```

### Select an instance and enable protection

Discovery still uses `MSSQL` with `SQLInstance` as the item type. Retrieve the snapshot policy by name, and then supply the selected user databases.  

```powershell
$instance = Get-AzRecoveryServicesBackupProtectableItem -WorkloadType MSSQL `
    -ItemType SQLInstance -Name "<instance-name>" -ServerName "<vm-name>" `
    -VaultId $vault.ID
$snapshotPolicy = Get-AzRecoveryServicesBackupProtectionPolicy `
    -Name "SqlInst-SnapLog" -VaultId $vault.ID

Enable-AzRecoveryServicesBackupProtection -ProtectableItem $instance `
    -Policy $snapshotPolicy -ChildDatabaseName @("Testdb1", "Testdb2", "Testdb4") `
    -VaultId $vault.ID
```

Select up to 12 user databases. System database snapshots aren't supported. To learn about other limits, review the [snapshot support matrix](sql-support-matrix.md#sql-server-instance-snapshot-backups-supported-scenarios).

## Trigger an on-demand backup

### Streaming database backup

Scope the backup item lookup to the VM's container. This example requests a copy-only full backup with compression and a 60-day expiry:

```powershell
$container = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVMAppContainer `
    -BackupManagementType AzureWorkload -FriendlyName "<vm-name>" -VaultId $vault.ID
$databaseItem = Get-AzRecoveryServicesBackupItem -Container $container `
    -WorkloadType MSSQL -Name "SQLDataBase;<instance-name>;<database-name>" `
    -VaultId $vault.ID
$expiry = (Get-Date).AddDays(60).ToUniversalTime()
Backup-AzRecoveryServicesBackupItem -Item $databaseItem -BackupType CopyOnlyFull `
    -EnableCompression -ExpiryDateTimeUTC $expiry -VaultId $vault.ID
```

Copy-only full backups honor the requested expiry. Streaming full backup retention is tied to its dependent log backups; see [on-demand backup retention](manage-monitor-sql-database-backup.md#run-an-on-demand-backup-for-sql-server-database).

### Instance snapshot backup

Use `MSSQLInstance` to retrieve a protected instance, then request a `SnapshotFull` backup:

```powershell
$container = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVMAppContainer `
    -BackupManagementType AzureWorkload -FriendlyName "<vm-name>" -VaultId $vault.ID
$instanceItem = Get-AzRecoveryServicesBackupItem -Container $container `
    -WorkloadType MSSQLInstance -Name "sqlinstance;<instance-name>" -VaultId $vault.ID
$expiry = (Get-Date).AddDays(45).ToUniversalTime()
Backup-AzRecoveryServicesBackupItem -Item $instanceItem -BackupType SnapshotFull `
    -ExpiryDateTimeUTC $expiry -VaultId $vault.ID
```

The backup command returns a job. For tracking commands, see [Monitor jobs](manage-azure-sql-vm-powershell.md#monitor-jobs).

## Next steps

- [Restore SQL Server databases and instances with PowerShell](restore-azure-sql-vm-powershell.md).
- [Manage SQL Server backups with PowerShell](manage-azure-sql-vm-powershell.md).