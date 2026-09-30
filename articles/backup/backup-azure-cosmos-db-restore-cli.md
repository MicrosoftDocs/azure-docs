---
title: Restore Azure Cosmos DB using Azure CLI
description: Learn how to restore Azure Cosmos DB using Azure CLI.
ms.topic: how-to
ms.date: 08/27/2026
ms.service: azure-backup
ms.custom: devx-track-azurecli, ignite-2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a database administrator, I want to restore an Azure Cosmos DB using Azure CLI, so that I can recover data from backups to a specified storage account safely and efficiently.
---

# Restore Azure Cosmos DB by using Azure CLI (preview)

This article describes how to restore Azure Cosmos DB by using Azure CLI (preview).

> [!NOTE]
> The original location recovery (OLR) option isn't supported. Instead, use the alternate-location recovery (ALR) option to restore from a recovery point and create a new Azure Cosmos DB account, keeping both the source and restored database accounts.

In this article, you learn how to:

> [!div class="checklist"]
> * Trigger a restore.
> * Track a restore job.

## Trigger a restore for Azure Cosmos DB account

Azure Backup restores an Azure Cosmos DB account from a vault recovery point to a **target Azure Cosmos DB account**.

To trigger restore for an Azure Cosmos DB account, run the following commands:

1. Grant the Backup vault's managed identity the required permissions on the **target** Azure Cosmos DB account. Reuse `az dataprotection backup-instance update-msi-permissions` with `--operation Restore`.

2. List the recovery points for the protected item by using the [az dataprotection recovery-point list](/cli/azure/dataprotection/recovery-point#az-dataprotection-recovery-point-list) command, and capture the recovery point ID.

   ```azurecli-interactive
   az dataprotection recovery-point list \
     --resource-group testBkpVaultRG \
     --vault-name TestBkpVault \
     --backup-instance-name testcosmosaccount-testcosmosaccount-00000000-0000-0000-0000-000000000000 -o table
   ```

3. Prepare the restore request by using the [az dataprotection backup-instance restore initialize-for-data-recovery](/cli/azure/dataprotection/backup-instance/restore#az-dataprotection-backup-instance-restore-initialize-for-data-recovery) command, providing the ARM ID of the target Azure Cosmos DB account. Save the output to a JSON file.

   ```azurecli-interactive
   targetCosmosDBAccountId="/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/targetcosmosrg/providers/Microsoft.DocumentDB/databaseAccounts/targetcosmosaccount"

   az dataprotection backup-instance restore initialize-for-data-recovery \
     --datasource-type AzureCosmosDB \
     --source-datastore VaultStore \
     --restore-location westus \
     --target-resource-id $targetCosmosDBAccountId \
     --recovery-point-id <recoveryPointId> > cosmosdb_restore.json
   ```

4. (Optional) Validate the restore request by using the [az dataprotection backup-instance validate-for-restore](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-validate-for-restore) command.

   ```azurecli-interactive
   az dataprotection backup-instance validate-for-restore \
     --resource-group testBkpVaultRG \
     --vault-name TestBkpVault \
     --backup-instance-name testcosmosaccount-testcosmosaccount-00000000-0000-0000-0000-000000000000 \
     --restore-request-object cosmosdb_restore.json
   ```

5. Trigger the restore by using the [az dataprotection backup-instance restore trigger](/cli/azure/dataprotection/backup-instance/restore#az-dataprotection-backup-instance-restore-trigger) command.

   ```azurecli-interactive
   az dataprotection backup-instance restore trigger \
     --resource-group testBkpVaultRG \
     --vault-name TestBkpVault \
     --backup-instance-name testcosmosaccount-testcosmosaccount-00000000-0000-0000-0000-000000000000 \
     --restore-request-object cosmosdb_restore.json
   ```

## Track the restore job for an Azure Cosmos DB account

Azure Backup creates a job when you trigger a restore operation. Track restore jobs the same way you track backup jobs, filtering on the *Restore* operation.

```azurecli-interactive
az dataprotection job list \
  --resource-group testBkpVaultRG \
  --vault-name TestBkpVault -o table

az dataprotection job list-from-resourcegraph \
  --datasource-type AzureCosmosDB \
  --operation Restore
```

## View a protected item

A protected item (backup instance) represents the Azure Cosmos DB account that's protected in the Backup vault. Use the [az dataprotection backup-instance list](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-list) and [az dataprotection backup-instance show](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-show) commands.

```azurecli-interactive
# List all protected items in the vault
az dataprotection backup-instance list \
  --resource-group testBkpVaultRG \
  --vault-name TestBkpVault -o table

# Show a specific protected item by name
az dataprotection backup-instance show \
  --resource-group testBkpVaultRG \
  --vault-name TestBkpVault \
  --name testcosmosaccount-testcosmosaccount-00000000-0000-0000-0000-000000000000
```

To view protected items across all Backup vaults and subscriptions, use the [az dataprotection backup-instance list-from-resourcegraph](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-list-from-resourcegraph) command.

```azurecli-interactive
az dataprotection backup-instance list-from-resourcegraph \
  --datasource-type AzureCosmosDB \
  --protection-status ProtectionConfigured -o table
```

## Next steps

* [About Azure Cosmos DB backup (preview)](backup-azure-cosmos-db-overview.md)
* [Manage backups of Azure Cosmos DB using Azure portal (preview)](backup-azure-cosmos-db-manage.md)
