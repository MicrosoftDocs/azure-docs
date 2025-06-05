---
title: Restore PostgreSQL Databases by Using Azure PowerShell
description: Learn how to restore Azure Database for PostgreSQL by using Azure PowerShell.
ms.topic: how-to
ms.date: 05/20/2025
ms.service: azure-backup
ms.custom:
  - devx-track-azurepowershell
  - build-2025
author: jyothisuri
ms.author: jsuri
---

# Restore PostgreSQL databases by using Azure PowerShell

This article describes how to use Azure PowerShell to restore PostgreSQL databases to an [Azure Database for PostgreSQL](/azure/postgresql/overview#azure-database-for-postgresql---single-server) server that you backed up via Azure Backup. You can also restore a PostgreSQL database using [Azure portal](restore-azure-database-postgresql.md), [Azure CLI](restore-postgresql-database-cli.md), and [REST API](restore-postgresql-database-use-rest-api.md).

Because a PostgreSQL database is a platform as a service (PaaS) database, the Original-Location Recovery (OLR) option to restore by replacing the existing database (from where the backups were taken) isn't supported. You can restore from a recovery point to create a new database in the same Azure Database for PostgreSQL server or in any other PostgreSQL server. This option is called Alternate-Location Recovery (ALR). ALR helps to keep both the source database and the restored (new) database.

The examples in this article refer to an existing Backup vault named `TestBkpVault` under the resource group `testBkpVaultRG`:

```azurepowershell-interactive
$TestBkpVault = Get-AzDataProtectionBackupVault -VaultName TestBkpVault -ResourceGroupName "testBkpVaultRG"
```

## Restore to create a new PostgreSQL database

### Set up permissions

A Backup vault uses a managed identity to access other Azure resources. To restore from a backup, the Backup vault's managed identity requires a set of permissions on the Azure Database for PostgreSQL server to which the database should be restored.

To assign the relevant permissions for a vault's system-assigned managed identity on the target PostgreSQL server, see the [set of permissions needed to back up a PostgreSQL database](./backup-azure-database-postgresql-overview.md#permissions-needed-for-postgresql-database-restore).

To restore the recovery point as files to a storage account, the [Backup vault's system-assigned managed identity needs access on the target storage account](./restore-azure-database-postgresql.md#restore-permissions-on-the-target-storage-account).

### Fetch the relevant recovery point

Fetch all instances by using the [`Get-AzDataProtectionBackupInstance`](/powershell/module/az.dataprotection/get-azdataprotectionbackupinstance) command and identify the relevant instance:

```azurepowershell-interactive
$AllInstances = Get-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name
```

You can also use `Az.Resourcegraph` and the [`Search-AzDataProtectionBackupInstanceInAzGraph`](/powershell/module/az.dataprotection/search-azdataprotectionbackupinstanceinazgraph) command to search recovery points across instances in many vaults and subscriptions:

```azurepowershell-interactive
$AllInstances = Search-AzDataProtectionBackupInstanceInAzGraph -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -DatasourceType AzureDatabaseForPostgreSQL -ProtectionStatus ProtectionConfigured
```

To filter the search criteria, use the PowerShell client search capabilities:

```azurepowershell-interactive
Search-AzDataProtectionBackupInstanceInAzGraph -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -DatasourceType AzureDatabaseForPostgreSQL -ProtectionStatus ProtectionConfigured | Where-Object { $_.BackupInstanceName -match "empdb11"}
```

After you identify the instance, fetch the relevant recovery point:

```azurepowershell-interactive
$rp = Get-AzDataProtectionRecoveryPoint -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupInstanceName $AllInstances[2].BackupInstanceName
```

If you need to fetch the recovery point from the archive tier, add a client filter:

```azurepowershell-interactive
Get-AzDataProtectionRecoveryPoint -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupInstanceName $AllInstances[2].BackupInstanceName | Where-Object {$_.Property.RecoveryPointDataStoresDetail[0].Type -match "Archive" }
```

### Prepare the restore request

There are various restore options for a PostgreSQL database. You can restore the recovery point as another database or restore as files. The recovery point can also be on the archive tier.

#### Restore as a database

Construct the Azure Resource Manager ID of the new PostgreSQL database to be created (with the target PostgreSQL server to which permissions were assigned, as detailed [earlier](#set-up-permissions)). Include the required PostgreSQL database name. For example, a PostgreSQL database can be named `emprestored21` under a target PostgreSQL server named `targetossserver` in the resource group `targetrg` with a different subscription:

```azurepowershell-interactive
$targetOssId = /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourceGroups/targetrg/providers/providers/Microsoft.DBforPostgreSQL/servers/targetossserver/databases/emprestored21
```

Use the [`Initialize-AzDataProtectionRestoreRequest`](/powershell/module/az.dataprotection/initialize-azdataprotectionrestorerequest) command to prepare the restore request with all relevant details:

```azurepowershell-interactive
$OssRestoreReq = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureDatabaseForPostgreSQL -SourceDataStore VaultStore -RestoreLocation $TestBkpVault.Location -RestoreType AlternateLocation -RecoveryPoint $rps[0].Property.RecoveryPointId -TargetResourceId $targetOssId -SecretStoreURI "https://restoreoss-test.vault.azure.net/secrets/dbauth3" -SecretStoreType AzureKeyVault
```

For an archive-based recovery point, you need to:

1. Rehydrate from the archive datastore to the vault datastore.
1. Modify the source datastore.
1. Add other parameters to specify the rehydration priority.
1. Specify the duration for which the rehydrated recovery point should be retained in the vault datastore.
1. Restore as a database from this recovery point.

Use the following command to prepare the request for all the previously mentioned operations at once:

```azurepowershell-interactive
$OssRestoreFromArchiveReq = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureDatabaseForPostgreSQL -SourceDataStore ArchiveStore -RestoreLocation $TestBkpVault.Location -RestoreType AlternateLocation -RecoveryPoint $rps[0].Property.RecoveryPointId -TargetResourceId $targetOssId -SecretStoreURI "https://restoreoss-test.vault.azure.net/secrets/dbauth3" -SecretStoreType AzureKeyVault -RehydrationDuration 12 -RehydrationPriority Standard
```

#### Restore as files

Fetch the URI of the container within the storage account to which permissions were assigned, as detailed [earlier](#set-up-permissions). The following example uses a container named `testcontainerrestore` under a storage account named `testossstorageaccount` with a different subscription:

```azurepowershell-interactive
$contURI = "https://testossstorageaccount.blob.core.windows.net/testcontainerrestore"
```

Use the [`Initialize-AzDataProtectionRestoreRequest`](/powershell/module/az.dataprotection/initialize-azdataprotectionrestorerequest) command to prepare the restore request with all relevant details:

```azurepowershell-interactive
$OssRestoreAsFilesReq = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureDatabaseForPostgreSQL -SourceDataStore VaultStore -RestoreLocation $TestBkpVault.Location -RestoreType RestoreAsFiles -RecoveryPoint $rps[0].Property.RecoveryPointId -TargetContainerURI $contURI -FileNamePrefix "empdb11_postgresql-westus_1628853549768" 
```

For the archive-based recovery point, modify the source datastore. Add the rehydration priority and the retention duration, in days, of the rehydrated recovery point:

```azurepowershell-interactive
$OssRestoreAsFilesFromArchiveReq = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureDatabaseForPostgreSQL -SourceDataStore ArchiveStore -RestoreLocation $TestBkpVault.Location -RestoreType RestoreAsFiles -RecoveryPoint $rps[0].Property.RecoveryPointId -TargetContainerURI $contURI -FileNamePrefix "empdb11_postgresql-westus_1628853549768" -RehydrationDuration "14" -RehydrationPriority Standard
```

### Trigger the restore

Use the [`Start-AzDataProtectionBackupInstanceRestore`](/powershell/module/az.dataprotection/start-azdataprotectionbackupinstancerestore) command to trigger the restore with the request that you prepared earlier:

```azurepowershell-interactive
Start-AzDataProtectionBackupInstanceRestore -BackupInstanceName $AllInstances[2].BackupInstanceName -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -Parameter $OssRestoreReq
```

## Track jobs

Track jobs by using the [`Get-AzDataProtectionJob`](/powershell/module/az.dataprotection/get-azdataprotectionjob) command. You can list all jobs and fetch a particular job detail.

You can also use `Az.ResourceGraph` to track jobs across all Backup vaults. Use the [`Search-AzDataProtectionJobInAzGraph`](/powershell/module/az.dataprotection/search-azdataprotectionjobinazgraph) command to get the relevant job that's across all Backup vaults:

```azurepowershell-interactive
$job = Search-AzDataProtectionJobInAzGraph -Subscription $sub -ResourceGroupName "testBkpVaultRG" -Vault $TestBkpVault.Name -DatasourceType AzureDatabaseForPostgreSQL -Operation OnDemandBackup
```

## Related content

- [What is Azure Database for PostgreSQL backup?](backup-azure-database-postgresql-overview.md)
