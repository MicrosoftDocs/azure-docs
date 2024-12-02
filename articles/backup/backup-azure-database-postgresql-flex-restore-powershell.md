---
title: Restore Azure Database for PostgreSQL - flexible server via Azure PowerShell
description: Learn how to restore Azure Database for PostgreSQL - flexible server using Azure PowerShell.
ms.topic: how-to
ms.date: 10/01/2024
ms.service: azure-backup
ms.custom: devx-track-azurepowershell, ignite-2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore Azure Database for PostgreSQL - flexible server using Azure PowerShell (preview)

This article explains how to restore **Azure Database for PostgreSQL - flexible server** to an Azure Database for PostgreSQL - flexible server backed-up by Azure Backup.

In this article, you'll learn how to:

- Restore to create a new PostgreSQL - flexible server

- Track the restore operation status

We'll refer to an existing backup vault _TestBkpVault_ under the resource group _testBkpVaultRG_ in the examples.

```azurepowershell-interactive
$TestBkpVault = Get-AzDataProtectionBackupVault -VaultName TestBkpVault -ResourceGroupName "testBkpVaultRG"
```

## Restore to create a new PostgreSQL database

### Set up permissions

Backup vault uses managed identity to access other Azure resources. To restore from backup, Backup vault’s managed identity requires a set of permissions on the storage account to which the server would be restored.

To assign the relevant permissions for vault's system-assigned managed identity on the target storage account, see the [set of permissions needed to backup Azure PostgreSQL database](./backup-azure-database-postgresql-overview.md#set-of-permissions-needed-for-azure-postgresql-database-restore).

To restore the recovery point as files to a storage account, the [Backup vault's system-assigned managed identity needs access on the target storage account](./restore-azure-database-postgresql.md#restore-permissions-on-the-target-storage-account).

### Fetching the relevant recovery point

Fetch all instances using [Get-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/get-azdataprotectionbackupinstance) command and identify the relevant instance.

```azurepowershell-interactive
$AllInstances = Get-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name
```

You can also use **Az.Resourcegraph** and the [Search-AzDataProtectionBackupInstanceInAzGraph](/powershell/module/az.dataprotection/search-azdataprotectionbackupinstanceinazgraph) command to search recovery points across instances in many vaults and subscriptions.

```azurepowershell-interactive
$AllInstances = Search-AzDataProtectionBackupInstanceInAzGraph -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -DatasourceType AzureDatabaseForPGFlexServer -ProtectionStatus ProtectionConfigured
```

To filter the search criteria, use the PowerShell client search capabilities as shown below:

```azurepowershell-interactive
Search-AzDataProtectionBackupInstanceInAzGraph -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -DatasourceType AzureDatabaseForPGFlexServer -ProtectionStatus ProtectionConfigured | Where-Object { $_.BackupInstanceName -match "testpgflex"}
```

Once the instance is identified, fetch the relevant recovery point.

```azurepowershell-interactive
$rp = Get-AzDataProtectionRecoveryPoint -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupInstanceName $AllInstances[2].BackupInstanceName
```

### Prepare the restore request

You can restore the recovery point for a PostgreSQL – Flexible server database as files only.

#### Restore as files

Fetch the URI of the container, within the storage account to which permissions were assigned as detailed [above](#set-up-permissions). For example, a container named **testcontainerrestore** under a storage account **testossstorageaccount** with a different subscription.

```azurepowershell-interactive
$contURI = "https://testossstorageaccount.blob.core.windows.net/testcontainerrestore"
```

Use the [Initialize-AzDataProtectionRestoreRequest](/powershell/module/az.dataprotection/initialize-azdataprotectionrestorerequest) command to prepare the restore request with all relevant details.

```azurepowershell-interactive
$OssRestoreAsFilesReq = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureDatabaseForPGFlexServer -SourceDataStore VaultStore -RestoreLocation $TestBkpVault.Location -RestoreType RestoreAsFiles -RecoveryPoint $rps[0].Property.RecoveryPointId -TargetContainerURI $contURI -FileNamePrefix "testpgflex-westus_1628853549768" 
```

### Trigger the restore

Use the [Start-AzDataProtectionBackupInstanceRestore](/powershell/module/az.dataprotection/start-azdataprotectionbackupinstancerestore) command to trigger the restore with the request prepared above.

```azurepowershell-interactive
Start-AzDataProtectionBackupInstanceRestore -BackupInstanceName $AllInstances[2].BackupInstanceName -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -Parameter $OssRestoreReq
```

## Tracking job

Track all the jobs using the [Get-AzDataProtectionJob](/powershell/module/az.dataprotection/get-azdataprotectionjob) command. You can list all jobs and fetch a particular job detail.

You can also use *Az.ResourceGraph* to track jobs across all Backup vaults. Use the [Search-AzDataProtectionJobInAzGraph](/powershell/module/az.dataprotection/search-azdataprotectionjobinazgraph) command to get the relevant job, which is across all backup vault.

```azurepowershell-interactive
$job = Search-AzDataProtectionJobInAzGraph -Subscription $sub -ResourceGroupName "testBkpVaultRG" -Vault $TestBkpVault.Name -DatasourceType AzureDatabaseForPGFlexServer -Operation OnDemandBackup
```

### Create PostgreSQL - flexible server from restored storage account

Post restoration completion to the target storage account, you can use **pg_restore** utility to restore an Azure Database for PostgreSQL – Flexible server database from the target. Use the following command to connect to an existing PostgreSQL – Flexible server and an existing database.

```azurepowershell-interactive
pg_restore -h <hostname> -U <username> -d <db name> -Fd -j <NUM> -C <dump directory>
```

-Fd: The directory format.
-j: The number of jobs.
-C: Begin the output with a command to create the database itself and then reconnect to it.

Here's an example of how this syntax might appear:

```azurepowershell-interactive
pg_restore -h <hostname> -U <username> -j <Num of parallel jobs> -Fd -C -d <databasename> sampledb_dir_format
```

If you have more than one database to restore, re-run the earlier command for each database.

Also, by using multiple concurrent jobs -j, you can reduce the time it takes to restore a large database on a multi-vCore target server. The number of jobs can be equal to or less than the number of vCPUs that are allocated for the target server.

## Next steps

- [Azure PostgreSQL - flexible server Backup](backup-azure-database-postgresql-flex-overview.md)
