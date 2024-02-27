---
title: Quickstart - Cross region restore for PostgreSQL database with PowerShell by using Azure Backup
description: In this Quickstart, learn how to restore PostgreSQL database across region with the Azure PowerShell module.
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 02/01/2024
ms.custom: mvc, devx-track-azurepowershell, mode-api
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Quickstart: Restore Azure Database for PostgreSQL server across regions with PowerShell by using Azure Backup

This quickstart describes how to configure and perform cross-region restore for Azure Database for PostgreSQL server with Azure PowerShell.

[Azure Backup](backup-overview.md) allows you to back up and restore the Azure Database for PostgreSQL server. The [Azure PowerShell AZ](/powershell/azure/new-azureps-module-az) module allows you to create and manage Azure resources from the command line or in scripts. If you want to restore the PostgreSQL database across regions by using the Azure portal, see [this Quickstart](quick-cross-region-restore.md).

## Enable Cross Region Restore for Backup vault

To enable the Cross Region Restore feature on the Backup vault that has Geo-redundant Storage enabled, run the following cmdlet:

```azurepowershell
Update-AzDataProtectionBackupVault -SubscriptionId $subscriptionId -ResourceGroupName $resourceGroupName -CrossRegionRestoreState $CrossRegionRestoreState
```

>[!Note]
>You can't disable Cross Region Restore once protection has started with this feature enabled.


## Configure    restore for the PostgreSQL database to a secondary region

To restore the database to a secondary region after enabling Cross Region Restore, run the following cmdlets:

1. Fetch the backup instances from secondary region.

   ```azurepowershell
   Search-AzDataProtectionBackupInstanceInAzGraph -Subscription $subscriptionId  -ResourceGroup  $resourceGroupName  -Vault $vaultName -DatasourceType AzureDatabaseForPostgreSQL
   ```

2. Once you identify the backed-up instance, fetch the relevant recovery  point by using the  `Get-AzDataProtectionRecoveryPoint` cmdlet.

   ```azurepowershell
   $recoveryPointsCrr = Get-AzDataProtectionRecoveryPoint -BackupInstanceName $instance.Name -ResourceGroupName $resourceGroupName -ResourceGroupName $resourceGroupName e -SubscriptionId $subscriptionId -UseSecondaryRegion
   ```
	
3. Prepare the restore request.

   To restore the database, follow one of the following methods:  

   **Restore as database**

   Follow these steps:

   1. Create the Azure Resource Manager ID for the new PostgreSQL database. You need to create this with the [target PostgreSQL server to which permissions are assigned](/azure/backup/restore-postgresql-database-ps#set-up-permissions). Additionally, create the required *PostgreSQL database name*.
   
      For example, you can name a PostgreSQL database as `emprestored21` under a target PostgreSQL server `targetossserver` in a resource group `targetrg` with a different subscription.

      ```azurepowershell
      $targetResourceId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourceGroups/targetrg/providers/providers/Microsoft.DBforPostgreSQL/servers/targetossserver/databases/emprestored21"
      ```
   2. Use the `Intialize-AzDataProtectionRestoreRequest` cmdlet to prepare the restore request with relevant details.

      ```azurepowershell
      $OssRestoreReq = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureDatabaseForPostgreSQL -SourceDataStore VaultStore -RestoreLocation $vault.ReplicatedRegion[0] -RestoreType AlternateLocation -RecoveryPoint $recoveryPointsCrr[0].Property.RecoveryPointId -TargetResourceId $targetResourceId -SecretStoreURI $secretURI -SecretStoreType AzureKeyVault
      ```
 
   **Restore as files**

   Follow these steps:

   1. Fetch the *Uniform Resource Identifier (URI)* of the container, in the [storage account to which permissions are assigned](/azure/backup/restore-postgresql-database-ps#set-up-permissions).
   
      For example, a container named `testcontainerrestore` under a storage account `testossstorageaccount` with a different subscription.

      ```azurepowershell
      $contURI = https://testossstorageaccount.blob.core.windows.net/testcontainerrestore
      ```
      
   2. Use the `Intialize-AzDataProtectionRestoreRequest` cmdlet to prepare the restore request with relevant details.

      ```azurepowershell
      $OssRestoreReq = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureDatabaseForPostgreSQL -SourceDataStore VaultStore -RestoreLocation $vault.ReplicatedRegion[0] -RestoreType RestoreAsFiles -RecoveryPoint $recoveryPointsCrr[0].Property.RecoveryPointId -TargetContainerURI $targetContainerURI -FileNamePrefix $fileNamePrefix
      ```

## Validate the PostgreSQL database restore configuration

To validate the probabilities of success for the restore operation, run the following cmdlet:

```azurepowershell
$validate = Test-AzDataProtectionBackupInstanceRestore -ResourceGroupName $ResourceGroupName -Name $instance[0].Name -VaultName $VaultName -RestoreRequest $OssRestoreReq -SubscriptionId $SubscriptionId -RestoreToSecondaryRegion #-Debug
```

## Trigger the restore operation

To trigger the restore operation, run the following cmdlet:

```azurepowershell
$restoreJob = Start-AzDataProtectionBackupInstanceRestore -BackupInstanceName $instance.Name -ResourceGroupName $ResourceGroupName -VaultName $vaultName -SubscriptionId $SubscriptionId -Parameter $OssRestoreReq -RestoreToSecondaryRegion  # -Debug
```

## Track the restore job

To monitor the restore job progress, choose one of the methods:

- To get the complete list of Cross Region Restore jobs from the secondary region, run the following cmdlet:

  ```azurepowershell
  $job = Get-AzDataProtectionJob -ResourceGroupName $resourceGroupName -SubscriptionId $subscriptionId -VaultName $vaultName -UseSecondaryRegion
  ```

- To get a single job detail, run the following cmdlet:

  ```azurepowershell
  $restoreJob = Start-AzDataProtectionBackupInstanceRestore -BackupInstanceName $instance.Name -ResourceGroupName $ResourceGroupName -VaultName $vaultName -SubscriptionId $SubscriptionId -Parameter $OssRestoreReq -RestoreToSecondaryRegion  # -Debug
  ```

## Next steps

- Learn how to [configure and run Cross Region Restore for Azure database for PostgreSQL](tutorial-cross-region-restore.md).