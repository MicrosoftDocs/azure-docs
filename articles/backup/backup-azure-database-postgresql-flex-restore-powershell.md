---
title: Restore Azure Database for PostgreSQL - Flexible Server using Azure PowerShell
description: Learn how to restore Azure Database for PostgreSQL - Flexible Server using Azure PowerShell.
ms.topic: how-to
ms.date: 02/28/2025
ms.service: azure-backup
ms.custom: devx-track-azurepowershell, ignite-2024
author: jyothisuri
ms.author: jsuri
# Customer intent: As a database administrator, I want to restore an Azure Database for PostgreSQL - Flexible Server using PowerShell, so that I can recover data from backup while adhering to necessary permissions and configurations.
---

# Restore Azure Database for PostgreSQL - Flexible Server using Azure PowerShell

This article describes how to restore Azure Database for PostgreSQL - Flexible Server using Azure PowerShell.

>[!Note]
>The Original Location Recovery (OLR) option isn't supported for PaaS databases. Instead, use the Alternate-Location Recovery (ALR) to restore from a recovery point and create a new database in the same or another Azure PostgreSQL – Flexible server, keeping both the source and restored databases.

Let's use an existing Backup vault `TestBkpVault`, under the resource group `testBkpVaultRG` in the examples.

```azurepowershell-interactive
$TestBkpVault = Get-AzDataProtectionBackupVault -VaultName TestBkpVault -ResourceGroupName "testBkpVaultRG"
```

## Set up permissions for restore

Backup vault uses managed identity to access other Azure resources. To restore from backup, Backup vault’s managed identity requires a set of permissions on the Azure PostgreSQL – Flexible Server to which the database should be restored.

To assign the relevant permissions for vault's system-assigned managed identity on the target PostgreSQL – Flexible Server, check the [set of permissions](backup-azure-database-postgresql-flex-overview.md#azure-backup-authentication-with-the-postgresql-server) needed to backup Azure PostgreSQL – Flexible Server database.

To restore the recovery point as files to a storage account, the [Backup vault's system-assigned managed identity needs access on the target storage account](./restore-azure-database-postgresql.md#restore-permissions-on-the-target-storage-account).

## Fetch the relevant recovery point

Fetch all instances using [Get-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/get-azdataprotectionbackupinstance) cmdlet and identify the relevant instance.

```azurepowershell-interactive
$AllInstances = Get-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name

```

You can also use `Az.Resourcegraph` and the [Search-AzDataProtectionBackupInstanceInAzGraph](/powershell/module/az.dataprotection/search-azdataprotectionbackupinstanceinazgraph) cmdlet to search recovery points across instances in many vaults and subscriptions.

```azurepowershell-interactive
$AllInstances = Search-AzDataProtectionBackupInstanceInAzGraph -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -DatasourceType AzureDatabaseForPGFlexServer -ProtectionStatus ProtectionConfigured
```

To filter the search criteria, use the following PowerShell client search capabilities:

```azurepowershell-interactive
Search-AzDataProtectionBackupInstanceInAzGraph -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -DatasourceType AzureDatabaseForPGFlexServer -ProtectionStatus ProtectionConfigured | Where-Object { $_.BackupInstanceName -match "testpgflex"}
```

Once the instance is identified, fetch the relevant recovery point.

```azurepowershell-interactive
$rp = Get-AzDataProtectionRecoveryPoint -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupInstanceName $AllInstances[2].BackupInstanceName
```

## Prepare the restore request

You can restore the recovery point for a PostgreSQL – Flexible Server database as files only.

### Restore as files

Fetch the Uniform Resource Identifier (URI) of the container, within the storage account to which permissions were assigned. For example, a container named `testcontainerrestore` under a storage account `testossstorageaccount` with a different subscription.

```azurepowershell-interactive
$contURI = "https://testossstorageaccount.blob.core.windows.net/testcontainerrestore"
```

Use the [Initialize-AzDataProtectionRestoreRequest](/powershell/module/az.dataprotection/initialize-azdataprotectionrestorerequest) cmdlet to prepare the restore request with all relevant details.

```azurepowershell-interactive
$OssRestoreAsFilesReq = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureDatabaseForPGFlexServer -SourceDataStore VaultStore -RestoreLocation $TestBkpVault.Location -RestoreType RestoreAsFiles -RecoveryPoint $rps[0].Property.RecoveryPointId -TargetContainerURI $contURI -FileNamePrefix "empdb11_postgresql-westus_1628853549768"
```

>[!Note]
>After the restore to the target storage account is complete , you can use the pg_restore utility to restore an Azure Database for PostgreSQL – Flexible Server database from the target.

To connect to an existing PostgreSQL – Flexible Server and an existing database, use the following cmdlet:

```azurepowershell-interactive
pg_restore -h <hostname> -U <username> -d <db name> -Fd -j <NUM> -C <dump directory>
```

In this script:

- `-Fd`: The directory format.
- `-j`: The number of jobs.
- `-C`: Starts the output with a cmdlet to create the database itself and then reconnect to it.

The following example shows how the syntax might appear:

```azurepowershell-interactive
pg_restore -h <hostname> -U <username> -j <Num of parallel jobs> -Fd -C -d <databasename> sampledb_dir_format
```

If you have more than one database to restore, rerun the earlier cmdlet for each database.
Also, by using multiple concurrent jobs `-j`, you can reduce the restore time of a large database on a **multi-vCore** target server. The number of jobs can be equal to or less than the number of `vCPUs` allocated for the target server.

## Trigger the restore

To trigger the restore operation with the prepared request, use the [`Start-AzDataProtectionBackupInstanceRestore`](/powershell/module/az.dataprotection/start-azdataprotectionbackupinstancerestore) cmdlet 

```azurepowershell-interactive
Start-AzDataProtectionBackupInstanceRestore -BackupInstanceName $AllInstances[2].BackupInstanceName -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -Parameter $OssRestoreReq
```

## Track jobs

Track all jobs by using the [`Get-AzDataProtectionJob`](/powershell/module/az.dataprotection/get-azdataprotectionjob) cmdlet. You can list all jobs and fetch a particular job detail.

You can also use `Az.ResourceGraph` to track jobs across all Backup vaults. Use the [`Search-AzDataProtectionJobInAzGraph`](/powershell/module/az.dataprotection/search-azdataprotectionjobinazgraph) cmdlet to get the relevant job that is across all Backup vaults.

```azurepowershell-interactive
$job = Search-AzDataProtectionJobInAzGraph -Subscription $sub -ResourceGroupName "testBkpVaultRG" -Vault $TestBkpVault.Name -DatasourceType AzureDatabaseForPGFlexServer -Operation OnDemandBackup
```

## Next steps

[Troubleshoot common errors for backup and restore operations for Azure Database for PostgreSQL - Flexible Server](backup-azure-database-postgresql-flex-troubleshoot.md).