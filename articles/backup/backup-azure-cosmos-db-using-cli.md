---
title: Configure vaulted backup for Azure Cosmos DB by using Azure CLI
description: Learn how to configure vaulted backup for Azure Cosmos DB using Azure CLI.
ms.topic: how-to
ms.date: 08/27/2026
ms.custom: devx-track-azurecli, ignite-2026
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a database administrator, I want to back up Azure Cosmos DB using Azure CLI, so that I can ensure data protection and recovery options for my database workloads."
---

# Configure vaulted backup for Azure Cosmos DB by using Azure CLI (preview)

This article describes how to configure vaulted backup for an Azure Cosmos DB account by using [Azure Backup](backup-overview.md) via the Azure CLI (preview).

Learn more about the [supported scenarios, regions, and limitations](backup-azure-cosmos-db-overview.md) for Azure Cosmos DB backup (preview).

In this article, you learn how to:

> [!div class="checklist"]
> * Create a backup policy.
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

### Create a Backup vault

In this article, you create a Backup vault named *TestBkpVault* in the *westus* region, under the resource group *testBkpVaultRG*, by using the [az dataprotection backup-vault create](/cli/azure/dataprotection/backup-vault#az-dataprotection-backup-vault-create) command.

```azurecli-interactive
az dataprotection backup-vault create \
  --resource-group testBkpVaultRG \
  --vault-name TestBkpVault \
  --location westus \
  --type SystemAssigned \
  --storage-settings datastore-type="VaultStore" type="GeoRedundant"
```

## Create a backup policy for Azure Cosmos DB account

A backup policy defines the backup schedule and the retention rules that govern the lifecycle of recovery points. Azure Cosmos DB vaulted backup takes a **weekly full backup** and **daily incremental backups** — the weekly full captures the entire account, and each daily incremental captures only the changes since the previous backup, which reduces backup time and storage. 

Create the policy before you configure protection to associate it with the Azure Cosmos DB account by running the following commands:

1. Generate the default policy template for the Azure Cosmos DB datasource type by using the [az dataprotection backup-policy get-default-policy-template](/cli/azure/dataprotection/backup-policy#az-dataprotection-backup-policy-get-default-policy-template) command, and save it to a JSON file. The default template defines a **weekly full backup with daily incremental backups**.

   ```azurecli-interactive
   az dataprotection backup-policy get-default-policy-template \
     --datasource-type AzureCosmosDB > cosmosdbpolicy.json
   ```

   > [!NOTE]
   > Azure Cosmos DB vaulted backup uses a **weekly full** backup plus **daily incremental** backups. Retention rules are applied in priority order: yearly, monthly, weekly, then daily. When a recovery point matches multiple rules, the highest-priority rule applies. The default rule applies when no other rule matches.

2. (Optional) Customize the schedule and retention in `cosmosdbpolicy.json`. The default template already defines the weekly full backup and daily incremental backups. Use the following helper commands to adjust the schedule or retention:

   * [az dataprotection backup-policy trigger create-schedule](/cli/azure/dataprotection/backup-policy/trigger#az-dataprotection-backup-policy-trigger-create-schedule) – create a schedule (for example, the weekly full-backup schedule).
   * [az dataprotection backup-policy trigger set](/cli/azure/dataprotection/backup-policy/trigger#az-dataprotection-backup-policy-trigger-set) – apply the schedule to the policy.
   * [az dataprotection backup-policy retention-rule create-lifecycle](/cli/azure/dataprotection/backup-policy/retention-rule#az-dataprotection-backup-policy-retention-rule-create-lifecycle) and [az dataprotection backup-policy retention-rule set](/cli/azure/dataprotection/backup-policy/retention-rule#az-dataprotection-backup-policy-retention-rule-set) – define and apply retention rules for the daily and weekly recovery points.

   ```azurecli-interactive
   # Example: adjust the weekly full-backup schedule
   schedule=$(az dataprotection backup-policy trigger create-schedule \
     --interval-type Weekly --interval-count 1 \
     --schedule-days "2026-08-03T09:30:00")

   az dataprotection backup-policy trigger set \
     --policy cosmosdbpolicy.json --schedule $schedule > cosmosdbpolicy.json

   # Example: retain daily incremental recovery points for 30 days
   dailyLifecycle=$(az dataprotection backup-policy retention-rule create-lifecycle \
     --source-datastore VaultStore --retention-duration-count 30 --retention-duration-type Days)

   az dataprotection backup-policy retention-rule set \
     --policy cosmosdbpolicy.json --name Default --lifecycles $dailyLifecycle > cosmosdbpolicy.json
   ```

3. Create the backup policy in the vault by using the [az dataprotection backup-policy create](/cli/azure/dataprotection/backup-policy#az-dataprotection-backup-policy-create) command.

   ```azurecli-interactive
   az dataprotection backup-policy create \
     --resource-group testBkpVaultRG \
     --vault-name TestBkpVault \
     --name CosmosDBBackupPolicy \
     --policy cosmosdbpolicy.json
   ```

## Configure vaulted backup for Azure Cosmos DB account

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

* [About Azure Cosmos DB backup (preview)](backup-azure-cosmos-db-overview.md)
* [Restore Azure Cosmos DB using Azure CLI (preview)](backup-azure-cosmos-db-restore-cli.md)
