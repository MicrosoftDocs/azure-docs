---
title: Configure vaulted backup for Azure Cosmos DB using Azure PowerShell
description: Learn how to configure vaulted backup for Azure Cosmos DB using Azure PowerShell.
ms.topic: how-to
ms.date: 10/29/2026
ms.custom: devx-track-azurepowershell, ignite-2026
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a database administrator, I want to back up Azure Cosmos DB using PowerShell, so that I can ensure data protection and recovery in case of data loss or corruption.
---

# Configure vaulted backup for Azure Cosmos DB by using Azure PowerShell

This article describes how to configure vaulted backup for an Azure Cosmos DB account by using [Azure Backup](backup-overview.md) via the Azure PowerShell.

Learn more about the [supported scenarios, regions, and limitations](backup-azure-cosmos-db-support-matrix.md) for Azure Cosmos DB backup.

In this article, you learn how to:

> [!div class="checklist"]
> * Configure backup for an Azure Cosmos DB account.
> * Track a backup job.
> * View a protected item.
> * Change the policy of a protected item.

## Prerequisites

Before you configure vaulted backup for an Azure Cosmos DB account, ensure that the following prerequisites are met:

* Install the latest **Az.DataProtection** PowerShell module:

  ```azurepowershell-interactive
  Install-Module -Name Az.DataProtection -Repository PSGallery
  ```

* Identify or create a **Backup vault** in the same region as the primary write region of the Azure Cosmos DB account.
* Ensure the identity running the cmdlets has read permission on the source account (`Microsoft.DocumentDB/databaseAccounts/read`). The **Reader** role on the account grants this permission, separately from the vault's managed identity permissions.

  For cross-subscription backup, check the identity's access in the source account's subscription. To resolve permission errors, see [Troubleshoot backup configuration requests](backup-azure-backup-vault-troubleshoot.md#backup-configuration-request-errors).

* Identify or [create a new backup policy for Azure Cosmos DB](backup-azure-cosmos-db-quickstart.md?pivots=client-powershelltier).

## Configure vaulted backup for an Azure Cosmos DB account by using Azure PowerShell

After the vault and policy are ready, protect the Azure Cosmos DB account by completing the following steps:

1. Fetch the Azure Resource Manager ID of the Azure Cosmos DB account to be protected. This ID serves as the identifier of the datasource. Backups are taken at the **account level** and include all databases and containers in the account.

   ```azurepowershell-interactive
   $cosmosDBAccountId = "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/cosmosdbrg/providers/Microsoft.DocumentDB/databaseAccounts/testcosmosaccount"
   ```

2. Fetch the policy that you created and prepare the backup configuration request using the [Initialize-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/initialize-azdataprotectionbackupinstance) cmdlet.

   ```azurepowershell-interactive
   $policy = Get-AzDataProtectionBackupPolicy -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name -Name CosmosDBBackupPolicy

   $instance = Initialize-AzDataProtectionBackupInstance -DatasourceType AzureCosmosDB -DatasourceLocation $TestBkpVault.Location -PolicyId $policy.Id -DatasourceId $cosmosDBAccountId
   ```

3. Grant the required permissions to the Backup vault's system-assigned managed identity on the Azure Cosmos DB account. Azure Backup uses this identity to stream backups from the account into the vault. Use the [Set-AzDataProtectionMSIPermission](/powershell/module/az.dataprotection/set-azdataprotectionmsipermission) cmdlet to assign the roles.

   ```azurepowershell-interactive
   Set-AzDataProtectionMSIPermission -BackupInstance $instance -VaultResourceGroup testBkpVaultRG -PermissionsScope "ResourceGroup"
   ```

4. Submit the request to protect the account using the [New-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/new-azdataprotectionbackupinstance) cmdlet. When the operation completes, the protected item (backup instance) is created.

   ```azurepowershell-interactive
   New-AzDataProtectionBackupInstance -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name -BackupInstance $instance
   ```
## Trigger an on-demand backup for an Azure Cosmos DB account

After the Azure Cosmos DB account is configured for protection and the protected item is created, you can trigger an on-demand backup that is governed by the associated backup policy and retention settings.

- Trigger an on-demand backup. Fetch the backup instance and use the [Backup-AzDataProtectionBackupInstanceAdhoc](/powershell/module/az.dataprotection/backup-azdataprotectionbackupinstanceadhoc) cmdlet with a retention rule name from the policy (for example, *Default*).

   ```azurepowershell-interactive
   $AllInstances = Get-AzDataProtectionBackupInstance -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name

   Backup-AzDataProtectionBackupInstanceAdhoc -BackupInstanceName $AllInstances[0].Name -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name -BackupRuleOptionRuleName "Default"
   ```

## Track the backup job for an Azure Cosmos DB account

Azure Backup creates a job for every scheduled and on-demand backup so that you can monitor progress. You can also trigger an on-demand backup to generate a job to track.

1. Track all jobs by using the [Get-AzDataProtectionJob](/powershell/module/az.dataprotection/get-azdataprotectionjob) cmdlet. You can list all jobs and fetch a particular job's detail.

   ```azurepowershell-interactive
   Get-AzDataProtectionJob -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name
   ```

2. To track jobs across all Backup vaults and subscriptions, use the [Search-AzDataProtectionJobInAzGraph](/powershell/module/az.dataprotection/search-azdataprotectionjobinazgraph) cmdlet, which queries jobs through Azure Resource Graph.

   ```azurepowershell-interactive
   $job = Search-AzDataProtectionJobInAzGraph -Subscription $sub -ResourceGroupName testBkpVaultRG -Vault $TestBkpVault.Name -DatasourceType AzureCosmosDB -Operation OnDemandBackup
   ```

## Change the policy of a protected item

You can change the backup policy that's associated with an Azure Cosmos DB protected item. The policy change doesn't affect existing recovery points or their retention. The updated retention settings apply only to new recovery points created after the change.

1. Fetch the protected item and the new policy that you want to apply.

   ```azurepowershell-interactive
   $instance = Get-AzDataProtectionBackupInstance -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name -Name $AllInstances[0].Name

   $newPolicy = Get-AzDataProtectionBackupPolicy -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name -Name "CosmosDBBackupPolicy-LongTerm"
   ```

2. Update the policy ID on the protected item and resubmit it using the [New-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/new-azdataprotectionbackupinstance) cmdlet. Because the backup instance is created with a PUT operation, resubmitting the same instance with a new policy ID updates the associated policy.

   ```azurepowershell-interactive
   $instance.Property.PolicyInfo.PolicyId = $newPolicy.Id

   New-AzDataProtectionBackupInstance -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name -BackupInstance $instance
   ```

## Next steps

* [About Azure Cosmos DB backup](backup-azure-cosmos-db-overview.md)
* [Configure backup for Azure Cosmos DB by using Azure portal](backup-azure-cosmos-db.md)
