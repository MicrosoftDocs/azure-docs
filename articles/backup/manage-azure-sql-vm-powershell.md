---
title: Manage SQL Server backups in Azure VMs with PowerShell
description: Use Azure PowerShell to monitor SQL Server backup jobs, change policies, stop protection, and unregister SQL VMs for database and instance snapshot backups.
ms.topic: how-to
ms.date: 10/19/2026
ms.custom: devx-track-azurepowershell
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a database administrator, I want to manage SQL Server database and instance snapshot backups using PowerShell so that I can monitor protection and maintain backup configuration.
---

# Manage SQL Server backups in Azure VMs with PowerShell

This article describes how to manage SQL Server streaming database and instance snapshot backups with Azure PowerShell. To configure backups or recover data, see [Backup](backup-azure-sql-vm-powershell.md) and [Restore](restore-azure-sql-vm-powershell.md).

## Prerequisites

- Install the [latest Azure PowerShell module](/powershell/azure/install-azure-powershell), including **Az.RecoveryServices**. Snapshot examples require support for `MSSQLInstance`.
- Have a registered SQL VM and protected database or instance. Review the [SQL Server backup support matrix](sql-support-matrix.md).
- Replace values in angle brackets. Sign in to the subscription that contains the vault and retrieve its object:

```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionId "<vault-subscription-id>"
$vault = Get-AzRecoveryServicesVault -ResourceGroupName "<vault-rg>" -Name "<vault-name>"
```

## Find SQL components and protected items

### List protectable components

Discovery uses `MSSQL` to list SQL instances, availability groups, and databases. To select an instance, specify `SQLInstance`, its name, and its server:

```powershell
Get-AzRecoveryServicesBackupProtectableItem -WorkloadType MSSQL -VaultId $vault.ID
$instance = Get-AzRecoveryServicesBackupProtectableItem -WorkloadType MSSQL `
    -ItemType SQLInstance -Name "<instance-name>" -ServerName "<vm-name>" `
    -VaultId $vault.ID
```

### List snapshot-protected instances

Use `MSSQLInstance` to retrieve protected instance items across the vault:

```powershell
Get-AzRecoveryServicesBackupItem -BackupManagementType AzureWorkload `
    -WorkloadType MSSQLInstance -VaultId $vault.ID
```

To scope the lookup to one VM, select its container first. `Get-AzRecoveryServicesBackupItem` doesn't have a `-ServerName` parameter:

```powershell
$container = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVMAppContainer `
    -BackupManagementType AzureWorkload -FriendlyName "<vm-name>" -VaultId $vault.ID
$instanceItem = Get-AzRecoveryServicesBackupItem -Container $container `
    -WorkloadType MSSQLInstance -Name "sqlinstance;<instance-name>" -VaultId $vault.ID
```

### Select a database item

Use `MSSQL` for a database item, including a database protected under an instance snapshot policy:

```powershell
$databaseItem = Get-AzRecoveryServicesBackupItem -Container $container `
    -WorkloadType MSSQL -Name "SQLDataBase;<instance-name>;<database-name>" -VaultId $vault.ID
```

The following examples use `$item` for the protected item to manage. Choose **one** of the following assignments for the intended scope:

```powershell
$item = $instanceItem
```

Or, for a database:

```powershell
$item = $databaseItem
```

## Monitor jobs

Backup and restore commands return a job ID. Use [Get-AzRecoveryServicesBackupJobDetail](/powershell/module/az.recoveryservices/get-azrecoveryservicesbackupjobdetail) to retrieve the job details:

```powershell
Get-AzRecoveryServicesBackupJobDetail -JobId "<job-id>" -VaultId $vault.ID
```

To find in-progress workload jobs:

```powershell
Get-AzRecoveryServicesBackupJob -Status InProgress `
    -BackupManagementType AzureWorkload -VaultId $vault.ID
```

For a supported cancellation, retrieve the job and pass it to [Stop-AzRecoveryServicesBackupJob](/powershell/module/az.recoveryservices/stop-azrecoveryservicesbackupjob):

```powershell
$job = Get-AzRecoveryServicesBackupJob -JobId "<job-id>" -VaultId $vault.ID
Stop-AzRecoveryServicesBackupJob -Job $job -VaultId $vault.ID
```

For streaming SQL backups, PowerShell job tracking covers user-triggered operations. Use [Azure Monitor](backup-azure-monitoring-use-azuremonitor.md) for scheduled backup monitoring and [backup alerts](move-to-azure-monitor-alerts.md#backup-alerts-in-recovery-services-vault) for failures.

## Change an item's backup policy

Retrieve a policy that's compatible with the selected item's workload and protection type, and then enable protection by using the new policy. For a snapshot-protected instance, select an `MSSQLInstance` snapshot policy:

```powershell
$targetPolicy = Get-AzRecoveryServicesBackupProtectionPolicy -Name "<target-policy-name>" `
    -VaultId $vault.ID
Enable-AzRecoveryServicesBackupProtection -Item $item -Policy $targetPolicy -VaultId $vault.ID
```

To configure an instance's selected databases, use the [snapshot protection example](backup-azure-sql-vm-powershell.md#select-an-instance-and-enable-protection).

## Edit an existing policy

Retrieve the policy and get schedule and retention objects for its workload type. This example uses a streaming database policy:

```powershell
$policy = Get-AzRecoveryServicesBackupProtectionPolicy -Name "<streaming-policy-name>" `
    -VaultId $vault.ID
$schedule = Get-AzRecoveryServicesBackupSchedulePolicyObject -WorkloadType MSSQL
$retention = Get-AzRecoveryServicesBackupRetentionPolicyObject -WorkloadType MSSQL
$schedule.FullBackupSchedulePolicy.ScheduleRunTimes[0] = `
    (Get-Date "2026-10-19T01:30:00Z").ToUniversalTime()
```

Review and customize the complete schedule and retention settings before applying them. Default policy objects can differ from the existing policy. Applying a policy change affects its associated backup items:

```powershell
Set-AzRecoveryServicesBackupProtectionPolicy -Policy $policy `
    -SchedulePolicy $schedule -RetentionPolicy $retention -VaultId $vault.ID
```

If the policy update fails for some items, investigate the failed jobs. After you resolve the cause, retry the inconsistent items:

```powershell
Set-AzRecoveryServicesBackupProtectionPolicy -Policy $policy `
    -FixForInconsistentItems -VaultId $vault.ID
```

For snapshot schedule and retention object examples, see [Create a snapshot policy](backup-azure-sql-vm-powershell.md#create-a-snapshot-policy-with-log-backups).

## Stop protection

Confirm that `$item` is the database or instance you want before stopping protection. Stopping protection for an instance affects the databases protected through that instance.

### Retain backup data

Stop scheduled backups while retaining existing recovery points:

```powershell
Disable-AzRecoveryServicesBackupProtection -Item $item -VaultId $vault.ID
```

The cmdlet prompts for confirmation. Add `-Force` only when your automation handles confirmation.

### Delete backup data

> [!WARNING]
> The following command requests deletion of the selected item's recovery points. Verify the item and your retention requirements before continuing. Vault immutability and soft-delete settings can affect deletion behavior.

```powershell
Disable-AzRecoveryServicesBackupProtection -Item $item `
    -RemoveRecoveryPoints -VaultId $vault.ID
```

### Disable streaming autoprotection

List instances with autoprotection enabled, select the intended instance, and disable autoprotection for future databases:

```powershell
Get-AzRecoveryServicesBackupProtectableItem -WorkloadType MSSQL -VaultId $vault.ID | `
    Where-Object { $_.IsAutoProtected -eq $true }
$instance = Get-AzRecoveryServicesBackupProtectableItem -WorkloadType MSSQL `
    -ItemType SQLInstance -Name "<instance-name>" -ServerName "<vm-name>" -VaultId $vault.ID
Disable-AzRecoveryServicesBackupAutoProtection -InputItem $instance `
    -BackupManagementType AzureWorkload -WorkloadType MSSQL -VaultId $vault.ID
```

## Re-register a SQL VM

> [!WARNING]
> Re-registration is a troubleshooting operation. Review [re-registration failures](backup-sql-server-azure-troubleshoot.md#re-registration-failures) before using it.

For a streaming SQL workload, retrieve the registered container and submit the re-registration:

```powershell
$container = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVMAppContainer `
    -BackupManagementType AzureWorkload -FriendlyName "<vm-name>" -VaultId $vault.ID
Register-AzRecoveryServicesBackupContainer -Container $container `
    -BackupManagementType AzureWorkload -WorkloadType MSSQL -VaultId $vault.ID
```

## Unregister a SQL VM

Unregister the VM only after all its databases and instances are no longer protected and no backup data remains. Unregistration applies to the whole VM application container, not one database:

```powershell
$container = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVMAppContainer `
    -BackupManagementType AzureWorkload -FriendlyName "<vm-name>" -VaultId $vault.ID
Unregister-AzRecoveryServicesBackupContainer -Container $container -VaultId $vault.ID
```

The cmdlet prompts for confirmation. `-Force` skips confirmation; `-PassThru` returns the container object.

## SQL Always On availability groups

Register every node of an availability group before discovering its SQL components. Discovery lists the availability group and its databases, along with each node's standalone SQL instances and databases. Use returned item and container names to distinguish availability group databases from node-local databases. For more information, see [SQL Server availability group backups](backup-sql-server-on-availability-groups.md).

## Next steps

- [Configure SQL Server backups with PowerShell](backup-azure-sql-vm-powershell.md).
- [Restore SQL Server databases and instances with PowerShell](restore-azure-sql-vm-powershell.md).
- [Troubleshoot SQL Server backups](backup-sql-server-azure-troubleshoot.md).