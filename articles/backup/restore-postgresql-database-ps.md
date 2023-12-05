---
title: Restore Azure PostgreSQL databases via Azure PowerShell
description: Learn how to restore Azure PostgreSQL databases using Azure PowerShell.
ms.topic: conceptual
ms.date: 01/24/2022
ms.service: backup
ms.custom: devx-track-azurepowershell
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore Azure PostgreSQL databases using Azure PowerShell

This article explains how to restore [Azure PostgreSQL databases](../postgresql/overview.md#azure-database-for-postgresql---single-server) to an Azure PostgreSQL server backed-up by Azure Backup.

Being a PaaS database, the Original-Location Recovery (OLR) option to restore by replacing the existing database (from where the backups were taken) isn't supported. You can restore from a recovery point to create a new database in the same Azure PostgreSQL server or in other PostgreSQL server. This is called Alternate-Location Recovery (ALR) that helps to keep both - the source database and the restored (new) database.

In this article, you'll learn how to:

- Restore to create a new PostgreSQL database

- Track the restore operation status

We'll refer to an existing backup vault _TestBkpVault_ under the resource group _testBkpVaultRG_ in the examples.

```azurepowershell-interactive
$TestBkpVault = Get-AzDataProtectionBackupVault -VaultName TestBkpVault -ResourceGroupName "testBkpVaultRG"
```

## Restore to create a new PostgreSQL database

### Set up permissions

Backup vault uses managed identity to access other Azure resources. To restore from backup, Backup vault’s managed identity requires a set of permissions on the Azure PostgreSQL server to which the database should be restored.

To assign the relevant permissions for vault's system-assigned managed identity on the target PostgreSQL server, see the [set of permissions needed to backup Azure PostgreSQL database](./backup-azure-database-postgresql-overview.md#set-of-permissions-needed-for-azure-postgresql-database-restore).

To restore the recovery point as files to a storage account, the [Backup vault's system-assigned managed identity needs access on the target storage account](./restore-azure-database-postgresql.md#restore-permissions-on-the-target-storage-account).

### Fetching the relevant recovery point

Fetch all instances using [Get-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/get-azdataprotectionbackupinstance) command and identify the relevant instance.

```azurepowershell-interactive
$AllInstances = Get-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name
```

You can also use **Az.Resourcegraph** and the [Search-AzDataProtectionBackupInstanceInAzGraph](/powershell/module/az.dataprotection/search-azdataprotectionbackupinstanceinazgraph) command to search recovery points across instances in many vaults and subscriptions.

```azurepowershell-interactive
$AllInstances = Search-AzDataProtectionBackupInstanceInAzGraph -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -DatasourceType AzureDatabaseForPostgreSQL -ProtectionStatus ProtectionConfigured
```

To filter the search criteria, use the PowerShell client search capabilities as shown below:

```azurepowershell-interactive
Search-AzDataProtectionBackupInstanceInAzGraph -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -DatasourceType AzureDatabaseForPostgreSQL -ProtectionStatus ProtectionConfigured | Where-Object { $_.BackupInstanceName -match "empdb11"}
```

Once the instance is identified, fetch the relevant recovery point.

```azurepowershell-interactive
$rp = Get-AzDataProtectionRecoveryPoint -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupInstanceName $AllInstances[2].BackupInstanceName
```

If you need to fetch the recovery point from archive tier, add a client filter as follows:

```azurepowershell-interactive
Get-AzDataProtectionRecoveryPoint -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupInstanceName $AllInstances[2].BackupInstanceName | Where-Object {$_.Property.RecoveryPointDataStoresDetail[0].Type -match "Archive" }
```

### Prepare the restore request

There are various restore options for a PostgreSQL database. You can restore the recovery point as another database or restore as files. The recovery point can be on archive tier as well.

#### Restore as database

Construct the Azure Resource Managed ID (ARM ID) of the new PostgreSQL database to be created (with the target PostgreSQL server to which permissions were assigned as detailed [above](#set-up-permissions), and the required PostgreSQL database name. For example, a PostgreSQL database can be named **emprestored21** under a target PostgreSQL server **targetossserver** in resource group **targetrg** with a different subscription.

```azurepowershell-interactive
$targetOssId = /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourceGroups/targetrg/providers/providers/Microsoft.DBforPostgreSQL/servers/targetossserver/databases/emprestored21
```

Use the [Initialize-AzDataProtectionRestoreRequest](/powershell/module/az.dataprotection/initialize-azdataprotectionrestorerequest) command to prepare the restore request with all relevant details.

```azurepowershell-interactive
$OssRestoreReq = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureDatabaseForPostgreSQL -SourceDataStore VaultStore -RestoreLocation $TestBkpVault.Location -RestoreType AlternateLocation -RecoveryPoint $rps[0].Property.RecoveryPointId -TargetResourceId $targetOssId -SecretStoreURI "https://restoreoss-test.vault.azure.net/secrets/dbauth3" -SecretStoreType AzureKeyVault
```

For an archive-based recovery point, you need to:

1. Rehydrate from archive datastore to vault store.
1. Modify the source datastore.
1. Add other parameters to specify the rehydration priority.
1. Specify the duration for which the rehydrated recovery point should be retained in the vault data store.
1. Restore as a database from this recovery point.

Use the following command to prepare the request for all the previous-mentioned operations, at once.

```azurepowershell-interactive
$OssRestoreFromArchiveReq = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureDatabaseForPostgreSQL -SourceDataStore ArchiveStore -RestoreLocation $TestBkpVault.Location -RestoreType AlternateLocation -RecoveryPoint $rps[0].Property.RecoveryPointId -TargetResourceId $targetOssId -SecretStoreURI "https://restoreoss-test.vault.azure.net/secrets/dbauth3" -SecretStoreType AzureKeyVault -RehydrationDuration 12 -RehydrationPriority Standard
```

#### Restore as files

Fetch the URI of the container, within the storage account to which permissions were assigned as detailed [above](#set-up-permissions). For example, a container named **testcontainerrestore** under a storage account **testossstorageaccount** with a different subscription.

```azurepowershell-interactive
$contURI = "https://testossstorageaccount.blob.core.windows.net/testcontainerrestore"
```

Use the [Initialize-AzDataProtectionRestoreRequest](/powershell/module/az.dataprotection/initialize-azdataprotectionrestorerequest) command to prepare the restore request with all relevant details.

```azurepowershell-interactive
$OssRestoreAsFilesReq = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureDatabaseForPostgreSQL -SourceDataStore VaultStore -RestoreLocation $TestBkpVault.Location -RestoreType RestoreAsFiles -RecoveryPoint $rps[0].Property.RecoveryPointId -TargetContainerURI $contURI -FileNamePrefix "empdb11_postgresql-westus_1628853549768" 
```

For archive-based recovery point, modify the source datastore, and add the rehydration priority and the retention duration, in days, of the rehydrated recovery point as mentioned below:

```azurepowershell-interactive
$OssRestoreAsFilesFromArchiveReq = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureDatabaseForPostgreSQL -SourceDataStore ArchiveStore -RestoreLocation $TestBkpVault.Location -RestoreType RestoreAsFiles -RecoveryPoint $rps[0].Property.RecoveryPointId -TargetContainerURI $contURI -FileNamePrefix "empdb11_postgresql-westus_1628853549768" -RehydrationDuration "14" -RehydrationPriority Standard
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
$job = Search-AzDataProtectionJobInAzGraph -Subscription $sub -ResourceGroupName "testBkpVaultRG" -Vault $TestBkpVault.Name -DatasourceType AzureDatabaseForPostgreSQL -Operation OnDemandBackup
```

## Next steps

- [Azure PostgreSQL Backup overview](backup-azure-database-postgresql-overview.md)
