---
title: Restore Azure Cosmos DB using Azure PowerShell
description: Learn how to restore Azure Cosmos DB using Azure PowerShell.
ms.topic: how-to
ms.date: 10/29/2026
ms.service: azure-backup
ms.custom: devx-track-azurepowershell, ignite-2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a database administrator, I want to restore an Azure Cosmos DB using PowerShell, so that I can recover data from backup while adhering to necessary permissions and configurations.
---

# Restore Azure Cosmos DB by using Azure PowerShell

This article describes how to restore an Azure Cosmos DB account by using [Azure Backup](backup-overview.md) via Azure PowerShell.

Learn more about the [supported scenarios, regions, and limitations](backup-azure-cosmos-db-support-matrix.md) for Azure Cosmos DB backup.

In this article, you learn how to:

> [!div class="checklist"]
> * Trigger a restore
> * Trigger cross-region restore to the secondary region
> * Track a restore job

## Trigger a restore operation for an Azure Cosmos DB account

Azure Backup restores an Azure Cosmos DB account from a vault recovery point to a **target Azure Cosmos DB account** by using Alternate-Location Recovery (ALR). Original-Location Recovery (OLR) isn't supported.

To trigger restore for the Azure Cosmos DB account, run the following cmdlets:

1. Grant the Backup vault's managed identity the required permissions on the **target** Azure Cosmos DB account to which the data is restored. See the [permissions required to configure backup](backup-azure-cosmos-db.md) for the exact roles.

     ```azurepowershell-interactive
     New-AzRoleAssignment `
       -ObjectId "<Backup Vault Identity>" `
       -RoleDefinitionName "Cosmos DB Long Term Retention Backup role" `
       -Scope "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.DocumentDB/databaseAccounts/<target-cosmos-account>"
      ```

2. Fetch the backup instance and the relevant recovery point using the [Get-AzDataProtectionRecoveryPoint](/powershell/module/az.dataprotection/get-azdataprotectionrecoverypoint) cmdlet.

   ```azurepowershell-interactive
   $AllInstances = Get-AzDataProtectionBackupInstance -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name

   $rp = Get-AzDataProtectionRecoveryPoint -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name -BackupInstanceName $AllInstances[0].BackupInstanceName
   ```

3. Prepare the restore request using the [Initialize-AzDataProtectionRestoreRequest](/powershell/module/az.dataprotection/initialize-azdataprotectionrestorerequest) cmdlet. Provide the ARM ID of the target Azure Cosmos DB account.

   ```azurepowershell-interactive
   $targetCosmosDBAccountId = "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/targetcosmosrg/providers/Microsoft.DocumentDB/databaseAccounts/targetcosmosaccount"

   $restoreRequest = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureCosmosDB -SourceDataStore VaultStore -RestoreLocation $TestBkpVault.Location -RestoreType AlternateLocation -RecoveryPoint $rp[0].Property.RecoveryPointId -TargetResourceId $targetCosmosDBAccountId
   ```

4. (Optional) Validate the restore request before triggering it, using the [Test-AzDataProtectionBackupInstanceRestore](/powershell/module/az.dataprotection/test-azdataprotectionbackupinstancerestore) cmdlet.

   ```azurepowershell-interactive
   Test-AzDataProtectionBackupInstanceRestore -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name -BackupInstanceName $AllInstances[0].BackupInstanceName -RestoreRequest $restoreRequest
   ```

5. Trigger the restore using the [Start-AzDataProtectionBackupInstanceRestore](/powershell/module/az.dataprotection/start-azdataprotectionbackupinstancerestore) cmdlet.

   ```azurepowershell-interactive
   Start-AzDataProtectionBackupInstanceRestore -BackupInstanceName $AllInstances[0].BackupInstanceName -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name -Parameter $restoreRequest
   ```

## Restore Azure Cosmos DB account to a secondary region

Use cross-region restore to restore vaulted backups of an Azure Cosmos DB account to the Azure paired region.

To trigger restore for an Azure Cosmos DB account to the secondary region, run the following commands:

1. Grant the Backup vault's managed identity the required permissions on the **target** Azure Cosmos DB account to which the data is restored. For the exact roles, see the [permissions required to configure backup](backup-azure-cosmos-db.md). Set `-Scope` to the target Azure Cosmos DB account in the secondary region.

     ```azurepowershell-interactive
     New-AzRoleAssignment `
       -ObjectId "<Backup Vault Identity>" `
       -RoleDefinitionName "Cosmos DB Long Term Retention Backup role" `
       -Scope "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.DocumentDB/databaseAccounts/<target-cosmos-account>"
      ```

2. Fetch the backup instance and the relevant recovery point by using the [Get-AzDataProtectionRecoveryPoint](/powershell/module/az.dataprotection/get-azdataprotectionrecoverypoint) cmdlet and adding `-UseSecondaryRegion`.

   ```azurepowershell-interactive
   $rpCrr = Get-AzDataProtectionRecoveryPoint -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name -BackupInstanceName $AllInstances[0].BackupInstanceName -UseSecondaryRegion
   ```

3. Prepare the restore request by using the [Initialize-AzDataProtectionRestoreRequest](/powershell/module/az.dataprotection/initialize-azdataprotectionrestorerequest) cmdlet. Provide the ARM ID of the target Azure Cosmos DB account. Set `-RestoreLocation` to the vault's secondary region and `-TargetResourceId` to a target Azure Cosmos DB account in that region.

   ```azurepowershell-interactive
   $targetCosmosDBAccountIdCrr = "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/targetcosmosrg-eus/providers/Microsoft.DocumentDB/databaseAccounts/targetcosmosaccounteus"

   $crrRestoreRequest = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureCosmosDB -SourceDataStore VaultStore -RestoreLocation $TestBkpVault.ReplicatedRegion[0] -RestoreType AlternateLocation -RecoveryPoint $rpCrr[0].Property.RecoveryPointId -TargetResourceId $targetCosmosDBAccountIdCrr
   ```

   >[!NOTE]
   >The deployment region and the primary write region of the target Azure Cosmos DB account must be same as the secondary region of the Backup vault.

4. (Optional) Validate the restore request before triggering it, by using the [Test-AzDataProtectionBackupInstanceRestore](/powershell/module/az.dataprotection/test-azdataprotectionbackupinstancerestore) cmdlet and adding `-RestoreToSecondaryRegion`. 

   ```azurepowershell-interactive
   Test-AzDataProtectionBackupInstanceRestore -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name -Name $AllInstances[0].BackupInstanceName -RestoreRequest $crrRestoreRequest -RestoreToSecondaryRegion
   ```

5. Trigger the restore by using the [Start-AzDataProtectionBackupInstanceRestore](/powershell/module/az.dataprotection/start-azdataprotectionbackupinstancerestore) cmdlet and adding `-RestoreToSecondaryRegion`.

   ```azurepowershell-interactive
   Start-AzDataProtectionBackupInstanceRestore -BackupInstanceName $AllInstances[0].BackupInstanceName -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name -Parameter $crrRestoreRequest -RestoreToSecondaryRegion
   ```

## View a protected item

A protected item (backup instance) represents the Azure Cosmos DB account that's protected in the Backup vault. Use the [Get-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/get-azdataprotectionbackupinstance) cmdlet to list all protected items in the vault or to fetch a specific one.

```azurepowershell-interactive
# List all protected items in the vault
Get-AzDataProtectionBackupInstance -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name

# Get a specific protected item by name
Get-AzDataProtectionBackupInstance -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name -Name $AllInstances[0].Name
```

To view protected items across all Backup vaults and subscriptions, use the [Search-AzDataProtectionBackupInstanceInAzGraph](/powershell/module/az.dataprotection/search-azdataprotectionbackupinstanceinazgraph) cmdlet.

```azurepowershell-interactive
Search-AzDataProtectionBackupInstanceInAzGraph -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name -DatasourceType AzureCosmosDB -ProtectionStatus ProtectionConfigured
```

## Track the restore job for an Azure Cosmos DB account

Azure Backup creates a job when you trigger a restore. Track restore jobs the same way you track backup jobs, filtering on the *Restore* operation.

```azurepowershell-interactive
Get-AzDataProtectionJob -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name

$restoreJob = Search-AzDataProtectionJobInAzGraph -Subscription $sub -ResourceGroupName testBkpVaultRG -Vault $TestBkpVault.Name -DatasourceType AzureCosmosDB -Operation Restore
```

Cross-region restore jobs run in the secondary region. To list them, add `-UseSecondaryRegion`.

   ```azurepowershell-interactive
   Get-AzDataProtectionJob -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name -UseSecondaryRegion
   ```

## Next step

* [Manage backups of Azure Cosmos DB using Azure portal](backup-azure-cosmos-db-manage.md)
