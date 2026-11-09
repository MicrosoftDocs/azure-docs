---
title: Restore SQL Server databases and instances in Azure VMs with PowerShell
description: Restore streaming SQL Server database backups and instance snapshots in Azure VMs using Azure PowerShell.
ms.topic: how-to
ms.date: 10/19/2026
ms.custom: devx-track-azurepowershell
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a database administrator, I want to restore SQL Server databases and instance snapshots using PowerShell so that I can automate recovery.
---

# Restore SQL Server databases and instances in Azure VMs with PowerShell

This article describes how to restore streaming database backups and SQL instance snapshot backups with Azure PowerShell. You can restore a recovery point or use transaction logs for point-in-time recovery (PITR).

## Prerequisites

- Install the [latest Azure PowerShell module](/powershell/azure/install-azure-powershell), including **Az.RecoveryServices**. Streaming SQL restore requires Az 6.0.0 or later. Snapshot examples require a module version that exposes the snapshot parameters shown here.
- Have an existing [SQL database or instance backup](backup-azure-sql-vm-powershell.md). Review the [restore prerequisites](restore-sql-database-azure-vm.md#restore-prerequisites) and [snapshot support matrix](sql-support-matrix.md#sql-server-instance-snapshot-backups-supported-scenarios).
- For snapshot restores, prepare a target resource group and a user-assigned managed identity with the required permissions. Review the [snapshot restore requirements](back-up-sql-server-instance-snapshot-restore.md).
- Register the destination VM with the appropriate vault before alternate-location restore.
- Replace values in angle brackets. Run the common setup for the selected scenario, then choose one restore configuration example. Configuration examples don't start a restore until you submit the configuration.

Sign in, select the vault subscription, and retrieve the vault:

```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionId "<vault-subscription-id>"
$vault = Get-AzRecoveryServicesVault -ResourceGroupName "<vault-rg>" -Name "<vault-name>"
```

## Restore a streaming database backup

### Select the database and recovery time

Scope the database lookup to the source VM's container:

```powershell
$sourceContainer = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVMAppContainer `
    -BackupManagementType AzureWorkload -FriendlyName "<source-vm>" -VaultId $vault.ID
$databaseItem = Get-AzRecoveryServicesBackupItem -Container $sourceContainer `
    -WorkloadType MSSQL -Name "SQLDataBase;<instance-name>;<database-name>" `
    -VaultId $vault.ID
$startDate = (Get-Date).AddDays(-7).ToUniversalTime()
$endDate = (Get-Date).ToUniversalTime()
Get-AzRecoveryServicesBackupRecoveryPoint -Item $databaseItem `
    -StartDate $startDate -EndDate $endDate -VaultId $vault.ID
$fullRecoveryPoint = Get-AzRecoveryServicesBackupRecoveryPoint -Item $databaseItem `
    -RecoveryPointId "<recovery-point-id>" -VaultId $vault.ID
```

For PITR, query the continuous log ranges with [Get-AzRecoveryServicesBackupRecoveryLogChain](/powershell/module/az.recoveryservices/get-azrecoveryservicesbackuprecoverylogchain), then select a UTC time within one of those ranges:

```powershell
$logRanges = Get-AzRecoveryServicesBackupRecoveryLogChain -Item $databaseItem -VaultId $vault.ID
$logRanges | Select-Object ItemName, StartTime, EndTime
$pointInTime = (Get-Date "<yyyy-MM-ddTHH:mm:ssZ>").ToUniversalTime()
```

For streaming PITR, the service determines the full backup and log chain needed for the selected time.

### Restore to the original location

Choose a full or differential recovery point:

```powershell
$recoveryConfig = Get-AzRecoveryServicesBackupWorkloadRecoveryConfig `
    -RecoveryPoint $fullRecoveryPoint -OriginalWorkloadRestore -VaultId $vault.ID
```

Alternatively, use the selected point in time:

```powershell
$recoveryConfig = Get-AzRecoveryServicesBackupWorkloadRecoveryConfig `
    -PointInTime $pointInTime -Item $databaseItem -OriginalWorkloadRestore -VaultId $vault.ID
```

> [!WARNING]
> Restoring the database to the original location overwrites the original database. Review the recovery configuration before submitting it.

### Restore to an alternate location

Select the destination VM container and SQL instance:

```powershell
$targetContainer = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVMAppContainer `
    -BackupManagementType AzureWorkload -FriendlyName "<target-vm>" -VaultId $vault.ID
$targetInstance = Get-AzRecoveryServicesBackupProtectableItem -WorkloadType MSSQL `
    -ItemType SQLInstance -Name "<target-instance>" -ServerName "<target-vm>" `
    -VaultId $vault.ID
```

For a full or differential recovery point:

```powershell
$recoveryConfig = Get-AzRecoveryServicesBackupWorkloadRecoveryConfig `
    -RecoveryPoint $fullRecoveryPoint -AlternateWorkloadRestore `
    -TargetItem $targetInstance -TargetContainer $targetContainer -VaultId $vault.ID
```

For PITR:

```powershell
$recoveryConfig = Get-AzRecoveryServicesBackupWorkloadRecoveryConfig `
    -PointInTime $pointInTime -Item $databaseItem -AlternateWorkloadRestore `
    -TargetItem $targetInstance -TargetContainer $targetContainer -VaultId $vault.ID
```

Inspect the generated database name and file paths. Change them as required for the destination:

```powershell
$recoveryConfig | Format-List
$recoveryConfig.targetPhysicalPath | Format-Table
$recoveryConfig.RestoredDBName = "<restored-database-name>"
```

### Restore streaming backups as files

To restore a full or differential backup as files on the registered target VM:

```powershell
$recoveryConfig = Get-AzRecoveryServicesBackupWorkloadRecoveryConfig `
    -RecoveryPoint $fullRecoveryPoint -TargetContainer $targetContainer `
    -RestoreAsFiles -FilePath "<target-folder>" -VaultId $vault.ID
```

For log PITR, request files from the latest applicable full backup:

```powershell
$recoveryConfig = Get-AzRecoveryServicesBackupWorkloadRecoveryConfig `
    -PointInTime $pointInTime -Item $databaseItem -TargetContainer $targetContainer `
    -RestoreAsFiles -FilePath "<target-folder>" -VaultId $vault.ID
```

To use a particular full backup for the file restore, add `-FromFull $fullRecoveryPoint` to the PITR configuration command.

## Query snapshot recovery points

### Select the protected instance

The following setup selects an instance item and lists its recovery points. Use this setup for the instance restore scenarios later in this article:

```powershell
$sourceContainer = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVMAppContainer `
    -BackupManagementType AzureWorkload -FriendlyName "<source-vm>" -VaultId $vault.ID
$instanceItem = Get-AzRecoveryServicesBackupItem -Container $sourceContainer `
    -WorkloadType MSSQLInstance -Name "sqlinstance;<instance-name>" -VaultId $vault.ID
$startDate = (Get-Date).AddDays(-7).ToUniversalTime()
$endDate = (Get-Date).ToUniversalTime()

$recoveryPoints = Get-AzRecoveryServicesBackupRecoveryPoint -Item $instanceItem `
    -StartDate $startDate -EndDate $endDate `
    -RestorePointQueryType FullDifferentialAndSnapshot -VaultId $vault.ID
$snapshotPoints = Get-AzRecoveryServicesBackupRecoveryPoint -Item $instanceItem `
    -RestorePointQueryType Snapshot -VaultId $vault.ID
$latestSnapshot = Get-AzRecoveryServicesBackupRecoveryPoint -Item $instanceItem `
    -GetLatestRecoveryPointOnly -RestorePointQueryType Snapshot -VaultId $vault.ID
$snapshotPoints | Format-Table RecoveryPointId, RecoveryPointTime, RecoveryPointType
```

Choose an ID from the returned list. Fetch that recovery point by ID to retrieve the full details, rather than assuming that the first list entry is the desired snapshot:

```powershell
$snapshotPoint = Get-AzRecoveryServicesBackupRecoveryPoint -Item $instanceItem `
    -RecoveryPointId "<snapshot-recovery-point-id>" -VaultId $vault.ID
$snapshotPoint.IncludedDatabases | Select-Object DatasourceName, DatasourceId
$snapshotPoint.SnapshotRecoveryPointInfo.SnapshotResourceGroup
$snapshotPoint.SnapshotRecoveryPointInfo.SourceFilesystemInfo | Select-Object `
    Label, FileSystemType, @{Name = 'AccessPaths'; Expression = { $_.AccessPaths -join ',' }}, IsOnStorageSpace
```

### Query log ranges above the instance snapshot

Log-chain queries target each **database** item included in the snapshot. The base datasource ID is the **instance's** `ProtectedItemDataSourceId`, not the database's `DatasourceId`:

```powershell
$logRangesPerDatabase = @{}
foreach ($database in $snapshotPoint.IncludedDatabases) {
    $databaseItem = Get-AzRecoveryServicesBackupItem -Container $sourceContainer `
        -WorkloadType MSSQL -Name "SQLDataBase;$($database.DatasourceName)" -VaultId $vault.ID
    $logRangesPerDatabase[$database.DatasourceName] = @(
        Get-AzRecoveryServicesBackupRecoveryLogChain -Item $databaseItem `
            -RecoveryMode SnapshotAttachAndRecover `
            -BaseSnapshotRecoveryPointId $snapshotPoint.RecoveryPointId `
            -BaseRecoveryPointDatasourceId $instanceItem.ProtectedItemDataSourceId `
            -VaultId $vault.ID
    )
}
$logRangesPerDatabase["<instance-name>;<database-name>"] | Format-Table ItemName, StartTime, EndTime
```

Use `Get-AzRecoveryServicesBackupRecoveryLogChain` for time ranges. `Get-AzRecoveryServicesBackupRecoveryPoint` returns individual recovery points, not continuous log ranges.

## Restore an instance snapshot

Use the instance and detailed `$snapshotPoint` from [Query snapshot recovery points](#query-snapshot-recovery-points). Both original- and alternate-location snapshot configurations require a target resource group and user-assigned managed identity:

```powershell
$identityId = "/subscriptions/<subscription-id>/resourceGroups/<identity-rg>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>"
$targetResourceGroup = "<target-rg>"
```

### Original-location restore

Build an original-workload restore configuration:

```powershell
$recoveryConfig = Get-AzRecoveryServicesBackupWorkloadRecoveryConfig `
    -RecoveryPoint $snapshotPoint -OriginalWorkloadRestore `
    -TargetResourceGroupName $targetResourceGroup -UserAssignedIdentityId $identityId `
    -VaultId $vault.ID
```

### Alternate-location restore

Select the destination container and instance. Use this destination setup for alternate-location restore, instance PITR, and restore as disks:

```powershell
$targetContainer = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVMAppContainer `
    -BackupManagementType AzureWorkload -FriendlyName "<target-vm>" -VaultId $vault.ID
$targetInstance = Get-AzRecoveryServicesBackupProtectableItem -WorkloadType MSSQL `
    -ItemType SQLInstance -Name "<target-instance>" -ServerName "<target-vm>" -VaultId $vault.ID

$recoveryConfig = Get-AzRecoveryServicesBackupWorkloadRecoveryConfig `
    -RecoveryPoint $snapshotPoint -AlternateWorkloadRestore `
    -TargetItem $targetInstance -TargetContainer $targetContainer `
    -TargetResourceGroupName $targetResourceGroup -UserAssignedIdentityId $identityId `
    -VaultId $vault.ID
```

### Point-in-time restore

First run the [per-database log-range query](#query-log-ranges-above-the-instance-snapshot). Choose a UTC restore time that is available for **every database** being restored. The following check rejects a time outside any database's ranges:

```powershell
$pointInTime = (Get-Date "<yyyy-MM-ddTHH:mm:ssZ>").ToUniversalTime()
if ($logRangesPerDatabase.Count -eq 0) {
    throw "No database log ranges were retrieved for the selected snapshot."
}
foreach ($databaseName in $logRangesPerDatabase.Keys) {
    $matchingRanges = @($logRangesPerDatabase[$databaseName] | Where-Object {
        $_.StartTime.ToUniversalTime() -le $pointInTime -and
        $_.EndTime.ToUniversalTime() -ge $pointInTime
    })
    if ($matchingRanges.Count -eq 0) {
        throw "The selected restore time is unavailable for $databaseName."
    }
}

$recoveryConfig = Get-AzRecoveryServicesBackupWorkloadRecoveryConfig `
    -RecoveryPoint $snapshotPoint -PointInTime $pointInTime `
    -AlternateWorkloadRestore -TargetItem $targetInstance -TargetContainer $targetContainer `
    -TargetResourceGroupName $targetResourceGroup -UserAssignedIdentityId $identityId `
    -RecoveryMode SnapshotAttachAndRecover -NoRecoveryMode -VaultId $vault.ID
```

The snapshot recovery point identifies the base snapshot; `-PointInTime` specifies the log replay target. This example requests `-NoRecoveryMode` to leave the databases in a nonrecovered state for subsequent recovery steps. Review that option for your recovery plan.

### Restore as disks

Use `SnapshotAttach` to attach the snapshot disks instead of performing snapshot attach and database recovery:

```powershell
$recoveryConfig = Get-AzRecoveryServicesBackupWorkloadRecoveryConfig `
    -RecoveryPoint $snapshotPoint -AlternateWorkloadRestore `
    -TargetItem $targetInstance -TargetContainer $targetContainer `
    -TargetResourceGroupName $targetResourceGroup -UserAssignedIdentityId $identityId `
    -RecoveryMode SnapshotAttach -VaultId $vault.ID
```

### Configure target paths and disk clashes

Inspect `targetPhysicalPath` before submitting any instance snapshot configuration. Source volumes are listed with blank target paths. Set a target path only for volumes that need remapping, such as when resolving a filesystem clash:

```powershell
$recoveryConfig.targetPhysicalPath | Format-Table SourcePath, TargetPath
($recoveryConfig.targetPhysicalPath | Where-Object { $_.SourcePath -eq "E:\" }).TargetPath = "X:\"
```

Replace the example source and target paths with paths appropriate for your recovery point and destination. If disk detachment is required to resolve a clash, explicitly identify the affected disks:

```powershell
$recoveryConfig.DisksToDetachOnClash = @(
    "/subscriptions/<subscription-id>/resourceGroups/<disk-rg>/providers/Microsoft.Compute/disks/<disk-name>"
)
```

> [!WARNING]
> Detaching an existing disk can disrupt workloads using it. Confirm the disk IDs and the destination filesystem configuration before submitting the restore.

## Restore a database protected under an instance

### Common setup

Select the database backup item, destination container and instance, target resource group, and identity:

```powershell
$sourceContainer = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVMAppContainer `
    -BackupManagementType AzureWorkload -FriendlyName "<source-vm>" -VaultId $vault.ID
$databaseItem = Get-AzRecoveryServicesBackupItem -Container $sourceContainer `
    -WorkloadType MSSQL -Name "SQLDataBase;<instance-name>;<database-name>" -VaultId $vault.ID
$targetContainer = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVMAppContainer `
    -BackupManagementType AzureWorkload -FriendlyName "<target-vm>" -VaultId $vault.ID
$targetInstance = Get-AzRecoveryServicesBackupProtectableItem -WorkloadType MSSQL `
    -ItemType SQLInstance -Name "<target-instance>" -ServerName "<target-vm>" -VaultId $vault.ID
$targetResourceGroup = "<target-rg>"
$identityId = "/subscriptions/<subscription-id>/resourceGroups/<identity-rg>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>"
```

For a snapshot recovery-point restore, list the database's snapshots and fetch the chosen point by ID:

```powershell
Get-AzRecoveryServicesBackupRecoveryPoint -Item $databaseItem `
    -RestorePointQueryType Snapshot -VaultId $vault.ID
$databaseSnapshot = Get-AzRecoveryServicesBackupRecoveryPoint -Item $databaseItem `
    -RecoveryPointId "<database-snapshot-recovery-point-id>" -VaultId $vault.ID
```

### Alternate-location restore

```powershell
$recoveryConfig = Get-AzRecoveryServicesBackupWorkloadRecoveryConfig `
    -RecoveryPoint $databaseSnapshot -AlternateWorkloadRestore `
    -TargetItem $targetInstance -TargetContainer $targetContainer `
    -TargetResourceGroupName $targetResourceGroup -UserAssignedIdentityId $identityId `
    -RecoveryMode SnapshotAttachAndRecover -NoRecoveryMode -VaultId $vault.ID
```

### Point-in-time restore

List the database's available log ranges and select a UTC time within a returned range:

```powershell
$logRanges = Get-AzRecoveryServicesBackupRecoveryLogChain -Item $databaseItem -VaultId $vault.ID
$logRanges | Select-Object ItemName, StartTime, EndTime
$pointInTime = (Get-Date "<yyyy-MM-ddTHH:mm:ssZ>").ToUniversalTime()

$recoveryConfig = Get-AzRecoveryServicesBackupWorkloadRecoveryConfig `
    -PointInTime $pointInTime -Item $databaseItem -AlternateWorkloadRestore `
    -TargetItem $targetInstance -TargetContainer $targetContainer `
    -TargetResourceGroupName $targetResourceGroup -UserAssignedIdentityId $identityId `
    -RecoveryMode SnapshotAttachAndRecover -NoRecoveryMode -VaultId $vault.ID
```

Both database recovery examples specify `-NoRecoveryMode`. Review whether your recovery plan requires the database to remain nonrecovered.

### Restore as disks

```powershell
$recoveryConfig = Get-AzRecoveryServicesBackupWorkloadRecoveryConfig `
    -RecoveryPoint $databaseSnapshot -AlternateWorkloadRestore `
    -TargetItem $targetInstance -TargetContainer $targetContainer `
    -TargetResourceGroupName $targetResourceGroup -UserAssignedIdentityId $identityId `
    -RecoveryMode SnapshotAttach -VaultId $vault.ID
```

### Restore as disks with logs as files

Choose a time from the database's available log ranges, as in the database PITR example, then configure the log file destination:

```powershell
$recoveryConfig = Get-AzRecoveryServicesBackupWorkloadRecoveryConfig `
    -PointInTime $pointInTime -Item $databaseItem -AlternateWorkloadRestore `
    -TargetItem $targetInstance -TargetContainer $targetContainer `
    -TargetResourceGroupName $targetResourceGroup -UserAssignedIdentityId $identityId `
    -RecoveryMode SnapshotAttach -TargetDirectoryMapping @{ all = "C:/temp" } `
    -VaultId $vault.ID
```

For any of these database snapshot configurations, inspect the source paths and set the required target volume mappings before submitting:

```powershell
$recoveryConfig.targetPhysicalPath | Format-Table SourcePath, TargetPath
($recoveryConfig.targetPhysicalPath | Where-Object { $_.SourcePath -eq "E:\" }).TargetPath = "M:\"
```

## Submit the restore and track the job

Review the selected configuration, and then submit it by using [Restore-AzRecoveryServicesBackupItem](/powershell/module/az.recoveryservices/restore-azrecoveryservicesbackupitem):

```powershell
$recoveryConfig | Format-List
$restoreJob = Restore-AzRecoveryServicesBackupItem -WLRecoveryConfig $recoveryConfig -VaultId $vault.ID
$restoreJob
```

Use the returned job ID with the [job monitoring commands](manage-azure-sql-vm-powershell.md#monitor-jobs).

## Cross-region restore for streaming database backups

When you enable cross-region restore, use `-UseSecondaryRegion` to query replicated items, recovery points, and log chains. The target VM must be registered with a vault in the paired region:

```powershell
$secondaryItems = Get-AzRecoveryServicesBackupItem -BackupManagementType AzureWorkload `
    -WorkloadType MSSQL -VaultId $vault.ID -UseSecondaryRegion
$secondaryItems | Format-Table Name, FriendlyName
$secondaryItem = $secondaryItems | Where-Object { $_.Name -eq "<backup-item-name>" }
$secondaryPoint = Get-AzRecoveryServicesBackupRecoveryPoint -Item $secondaryItem `
    -RecoveryPointId "<recovery-point-id>" -UseSecondaryRegion -VaultId $vault.ID
Get-AzRecoveryServicesBackupRecoveryLogChain -Item $secondaryItem `
    -UseSecondaryRegion -VaultId $vault.ID

$pairedVault = Get-AzRecoveryServicesVault -ResourceGroupName "<paired-vault-rg>" -Name "<paired-vault-name>"
$secondaryContainer = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVMAppContainer `
    -FriendlyName "<secondary-vm>" -Status Registered -VaultId $pairedVault.ID
$secondaryInstance = Get-AzRecoveryServicesBackupProtectableItem -WorkloadType MSSQL `
    -ItemType SQLInstance -Container $secondaryContainer -VaultId $pairedVault.ID
$secondaryConfig = Get-AzRecoveryServicesBackupWorkloadRecoveryConfig `
    -RecoveryPoint $secondaryPoint -AlternateWorkloadRestore `
    -TargetItem $secondaryInstance -TargetContainer $secondaryContainer -UseSecondaryRegion -VaultId $vault.ID
Restore-AzRecoveryServicesBackupItem -WLRecoveryConfig $secondaryConfig `
    -RestoreToSecondaryRegion -VaultId $vault.ID
```

Select a unique source item and target instance from the returned objects. For log PITR, build the configuration with `-PointInTime` and `-Item $secondaryItem` instead of `-RecoveryPoint`. Review [cross-region restore requirements](restore-sql-database-azure-vm.md#cross-region-restore) before proceeding. This example covers streaming database backups, not snapshot cross-region configuration.

## Next steps

- [Manage SQL Server backups with PowerShell](manage-azure-sql-vm-powershell.md).
- [Configure SQL Server backups with PowerShell](backup-azure-sql-vm-powershell.md).