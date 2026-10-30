---
title: Configure vaulted backup for Azure Cosmos DB by using Azure CLI
description: Learn how to configure vaulted backup for Azure Cosmos DB using Azure CLI.
ms.topic: how-to
ms.date: 10/29/2026
ms.custom: devx-track-azurecli, ignite-2026
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a database administrator, I want to back up Azure Cosmos DB using Azure CLI, so that I can ensure data protection and recovery options for my database workloads."
---

# Configure vaulted backup for Azure Cosmos DB by using Azure CLI

This article describes how to configure vaulted backup for an Azure Cosmos DB account by using [Azure Backup](backup-overview.md) via the Azure CLI.

Learn more about the [supported scenarios, regions, and limitations](backup-azure-cosmos-db-overview.md) for Azure Cosmos DB backup.

In this article, you learn how to:

> [!div class="checklist"]
> * Configure backup for an Azure Cosmos DB account.
> * Track a backup job.
> * View a protected item.
> * Change the policy of a protected item.

## Prerequisites

Before you configure vaulted backup for an Azure Cosmos DB account, ensure that the following prerequisites are met:

* Use Azure CLI version 2.75.0 or later, and add the **dataprotection** extension. The extension installs automatically the first time you run an `az dataprotection` command, or you can install it manually.

  ```azurecli-interactive
  az extension add --name dataprotection
  ```

* Identify or create a **Backup vault** in the same region as the primary write region of the Azure Cosmos DB account.
* Ensure the identity running the commands has read permission on the source account (`Microsoft.DocumentDB/databaseAccounts/read`). The **Reader** role on the account grants this permission, separately from the vault's managed identity permissions.

  For cross-subscription backup, check the identity's access in the source account's subscription. To resolve permission errors, see [Troubleshoot backup configuration requests](backup-azure-backup-vault-troubleshoot.md#backup-configuration-request-errors).

* Identify or [create a new backup policy for Azure Cosmos DB](backup-azure-cosmos-db-quickstart.md?pivots=client-clitier).

## Configure vaulted backup for Azure Cosmos DB account by using Azure CLI

After the vault and policy are ready, protect the Azure Cosmos DB account by completing the following steps.

1. Set the Azure Resource Manager ID of the Azure Cosmos DB account to protect and the policy ID. Azure Backup takes backups at the **account level** and includes all databases and containers in the account.

   ```azurecli-interactive
   cosmosDBAccountId="/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/cosmosdbrg/providers/Microsoft.DocumentDB/databaseAccounts/testcosmosaccount"

   policyId=$(az dataprotection backup-policy show \
     --resource-group testBkpVaultRG --vault-name TestBkpVault \
     --name CosmosDBBackupPolicy --query id -o tsv)
   ```

2. Prepare the backup instance request by using the [az dataprotection backup-instance initialize](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-initialize) command, and save it to a JSON file.

   ```azurecli-interactive
   az dataprotection backup-instance initialize \
     --datasource-type AzureCosmosDB \
     --datasource-id $cosmosDBAccountId \
     --datasource-location westus \
     --policy-id $policyId > cosmosdb_backup_instance.json
   ```

3. Grant the Backup vault's managed identity the required permissions on the Azure Cosmos DB account by using the [az dataprotection backup-instance update-msi-permissions](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-update-msi-permissions) command. Azure Backup uses this identity to stream backups from the account into the vault.

   ```azurecli-interactive
   az dataprotection backup-instance update-msi-permissions \
     --resource-group testBkpVaultRG \
     --vault-name TestBkpVault \
     --datasource-type AzureCosmosDB \
     --operation Backup \
     --permissions-scope ResourceGroup \
     --backup-instance cosmosdb_backup_instance.json
   ```

4. (Optional) Validate that the configuration will succeed by using the [az dataprotection backup-instance validate-for-backup](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-validate-for-backup) command.

   ```azurecli-interactive
   az dataprotection backup-instance validate-for-backup \
     --resource-group testBkpVaultRG \
     --vault-name TestBkpVault \
     --backup-instance cosmosdb_backup_instance.json
   ```

5. Submit the request to protect the account by using the [az dataprotection backup-instance create](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-create) command. When the operation finishes, the protected item (backup instance) is created.

   ```azurecli-interactive
   az dataprotection backup-instance create \
     --resource-group testBkpVaultRG \
     --vault-name TestBkpVault \
     --backup-instance cosmosdb_backup_instance.json
   ```

## Trigger an on-demand backup for an Azure Cosmos DB account

After the Azure Cosmos DB account is configured for protection and the protected item is created, you can trigger an on-demand backup that is governed by the associated backup policy and retention settings.

- Trigger an on-demand backup by using the [az dataprotection backup-instance adhoc-backup](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-adhoc-backup) command, with a retention rule name from the policy (for example, *Default*).

   ```azurecli-interactive
   az dataprotection backup-instance adhoc-backup \
     --resource-group testBkpVaultRG \
     --vault-name TestBkpVault \
     --backup-instance-name testcosmosaccount-testcosmosaccount-00000000-0000-0000-0000-000000000000 \
     --rule-name Default
   ```

## Track the backup job for Azure Cosmos DB account

Azure Backup creates a job for every scheduled and on-demand backup so that you can monitor progress. You can also trigger an on-demand backup to generate a job to track.

1. Track jobs in the vault by using the [az dataprotection job list](/cli/azure/dataprotection/job#az-dataprotection-job-list) and [az dataprotection job show](/cli/azure/dataprotection/job#az-dataprotection-job-show) commands.

   ```azurecli-interactive
   az dataprotection job list \
     --resource-group testBkpVaultRG \
     --vault-name TestBkpVault -o table
   ```

2. To track jobs across all Backup vaults and subscriptions, use the [az dataprotection job list-from-resourcegraph](/cli/azure/dataprotection/job#az-dataprotection-job-list-from-resourcegraph) command, which queries jobs through Azure Resource Graph.

   ```azurecli-interactive
   az dataprotection job list-from-resourcegraph \
     --datasource-type AzureCosmosDB \
     --operation OnDemandBackup
   ```

## Change the policy of a protected item

You can change the backup policy that's associated with an Azure Cosmos DB protected item. The policy change doesn't affect existing recovery points or their retention. The updated retention settings apply only to new recovery points created after the change.

Use the [az dataprotection backup-instance update-policy](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-update-policy) command with the ID of the new policy.

```azurecli-interactive
newPolicyId=$(az dataprotection backup-policy show \
  --resource-group testBkpVaultRG --vault-name TestBkpVault \
  --name CosmosDBBackupPolicy-LongTerm --query id -o tsv)

az dataprotection backup-instance update-policy \
  --resource-group testBkpVaultRG \
  --vault-name TestBkpVault \
  --backup-instance-name testcosmosaccount-testcosmosaccount-00000000-0000-0000-0000-000000000000 \
  --policy-id $newPolicyId
```

## Next steps

* [About Azure Cosmos DB backup](backup-azure-cosmos-db-overview.md)
* [Restore Azure Cosmos DB by using Azure CLI](backup-azure-cosmos-db-restore-cli.md)
