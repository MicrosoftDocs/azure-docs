---
title: Quickstart - Create a vaulted backup policy for Azure Cosmos DB
description: Learn how to create a vaulted backup policy for Azure Cosmos DB.
#zone_pivot_groups: backup-client-portal-cli
ms.topic: quickstart
ms.date: 10/29/2026
ms.custom: build-2026, ignite-2026
zone_pivot_groups: backup-client-portal-powershell-cli
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As an IT administrator, I want to quickly create a vaulted backup policy for Azure Cosmos DB, so that I can use it to protect Azure Cosmos DB accounts."
---

# Quickstart: Create a vaulted backup policy for Azure Cosmos DB by using Azure portal, Azure CLI, or Azure PowerShell

::: zone pivot="client-portal"

Create a vaulted backup policy to define the schedule and retention duration for Azure Cosmos DB.

This quickstart describes how to create a vaulted backup policy for Azure Cosmos DB by using Azure portal. After completing these steps, you can configure and manage backup settings for your Azure Cosmos DB accounts.

## Prerequisites

Before you configure vaulted backup for Azure Cosmos DB, ensure that you meet the following prerequisites:

- Check the [supported scenarios and known limitations](backup-azure-cosmos-db-support-matrix.md) of Azure Cosmos DB backup.
- Identify or [create a Backup Vault](create-manage-backup-vault.md) in the same region where you want to back up the Azure Cosmos DB account.

## Create vaulted backup policy for Azure Cosmos DB by using Azure portal

A backup policy defines backup frequency and retention rules that determine lifecycle management of recovery points. You can also create the backup policy on the go while configuring backup.

To create a backup policy, follow these steps: 

1.	Go to **Resiliency** and select **Manage** > **Protection policies**.

2.	On the **Protection policies** pane, select **+ Create policy** > **Create backup policy**.

3.	On the **Start: Create Policy** pane, select **Datasource type** as **Azure Cosmos DB**, and select **Continue**. 

4. On the **Create Backup Policy** pane, on the **Basics** tab,  enter a **Policy name** for the new backup policy.

5. On the **Schedule + retention** tab, under **Backup schedule**, define the Backup frequency.
   
   A Cosmos DB backup policy uses two backup rules: 

   - **Full backup** - Runs once per week, on the day you select. A weekly full backup is required in every policy. 
   - **Incremental backup** - Runs on the remaining days of the week. Each incremental backup copies only the data that changed since the previous backup.
   
   Together, a weekly full backup and daily incremental backups provide a 1-day RPO.

   >[!NOTE]
   >You can't schedule more than one full backup per week, and you can't create an incremental-only policy. 
   
   :::image type="content" source="./media/backup-azure-cosmos-db-quickstart/backup-cosmos-backup-policy-schedule.png" alt-text="Screenshot shows how to define the backup frequency." lightbox="./media/backup-azure-cosmos-db-quickstart/backup-cosmos-backup-policy-schedule.png":::

6. Under **Retention settings**, select **Add retention rule** to define retention rules for specific backups and set retention duration.

   >[!NOTE]
   > - The default retention rule applies to all full and incremental backups. Custom retention rules apply only to full backups, with priority in this order: yearly, monthly, then weekly. If no custom rule matches, the default retention rule applies.
   > - A full backup and its dependent incremental backups form a backup chain and are retained and expire together. A full backup isn't deleted while any dependent incremental backup is still within its retention period.
  
   :::image type="content" source="./media/backup-azure-cosmos-db-quickstart/backup-cosmos-backup-policy-retention.png" alt-text="Screenshot shows how to define the backup retention rule." lightbox="./media/backup-azure-cosmos-db-quickstart/backup-cosmos-backup-policy-retention.png":::

7. On the **Review + create** tab, select **Create** and complete the backup policy creation.

## Next steps

[Configure vaulted backup for Azure Cosmos DB account by using Azure portal](backup-azure-cosmos-db.md)

::: zone-end

::: zone pivot="client-cli"

Create a vaulted backup policy to define the schedule and retention duration for Azure Cosmos DB.

This quickstart describes how to create a vaulted backup policy for Azure Cosmos DB by using Azure CLI. After completing these steps, you can configure and manage backup settings for your Azure Cosmos DB accounts.

## Prerequisites

Before you configure vaulted backup for an Azure Cosmos DB account, ensure that you meet the following prerequisites:

* Use Azure CLI version 2.75.0 or later, and add the **dataprotection** extension. The extension installs automatically the first time you run an `az dataprotection` command, or you can install it manually.

  ```azurecli-interactive
  az extension add --name dataprotection
  ```

* Identify or create a **Backup vault** in the same region as the primary write region of the Azure Cosmos DB account.

### Create a Backup vault by using Azure CLI

In this section, you create a Backup vault named *TestBkpVault* in the *westus* region, under the resource group *testBkpVaultRG*, by using the [az dataprotection backup-vault create](/cli/azure/dataprotection/backup-vault#az-dataprotection-backup-vault-create) command.

```azurecli-interactive
az dataprotection backup-vault create \
  --resource-group testBkpVaultRG \
  --vault-name TestBkpVault \
  --location westus \
  --type SystemAssigned \
  --storage-settings datastore-type="VaultStore" type="GeoRedundant"
```

## Create a vaulted backup policy for Azure Cosmos DB account by using Azure CLI

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

   1. [az dataprotection backup-policy trigger create-schedule](/cli/azure/dataprotection/backup-policy/trigger#az-dataprotection-backup-policy-trigger-create-schedule) – create a schedule (for example, the weekly full-backup schedule).
   2. [az dataprotection backup-policy trigger set](/cli/azure/dataprotection/backup-policy/trigger#az-dataprotection-backup-policy-trigger-set) – apply the schedule to the policy.
   3. [az dataprotection backup-policy retention-rule create-lifecycle](/cli/azure/dataprotection/backup-policy/retention-rule#az-dataprotection-backup-policy-retention-rule-create-lifecycle) and [az dataprotection backup-policy retention-rule set](/cli/azure/dataprotection/backup-policy/retention-rule#az-dataprotection-backup-policy-retention-rule-set) – define and apply retention rules for the daily and weekly recovery points.

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

## Next steps

[Configure vaulted backup for Azure Cosmos DB account by using Azure CLI](backup-azure-cosmos-db-using-cli.md)

::: zone-end

::: zone pivot="client-powershell"

Create a vaulted backup policy to define the schedule and retention duration for Azure Cosmos DB.

This quickstart describes how to create a vaulted backup policy for Azure Cosmos DB by using Azure PowerShell. After completing these steps, you can configure and manage backup settings for your Azure Cosmos DB accounts.

## Prerequisites

Before you configure vaulted backup for an Azure Cosmos DB account by using Azure PowerShell, ensure that you meet the following prerequisites:

* Install the latest **Az.DataProtection** PowerShell module.

  ```azurepowershell-interactive
  Install-Module -Name Az.DataProtection -Repository PSGallery
  ```

* Identify or create a **Backup vault** in the same region as the primary write region of the Azure Cosmos DB account.

### Create a Backup vault by using Azure PowerShell

In this section, you create a Backup vault named `TestBkpVault` in the `westus` region, under the resource group `testBkpVaultRG`. Use the [New-AzDataProtectionBackupVault](/powershell/module/az.dataprotection/new-azdataprotectionbackupvault) cmdlet to create a Backup vault. You create the vault with a system-assigned managed identity, which Azure Backup uses to access the Cosmos DB account.

To create a Backup vault by using Azure PowerShell, run the following cmdlet:

```azurepowershell-interactive
$storageSetting = New-AzDataProtectionBackupVaultStorageSettingObject -Type GeoRedundant -DataStoreType VaultStore

New-AzDataProtectionBackupVault -ResourceGroupName testBkpVaultRG -VaultName TestBkpVault -Location westus -StorageSetting $storageSetting -IdentityType SystemAssigned

$TestBkpVault = Get-AzDataProtectionBackupVault -VaultName TestBkpVault -ResourceGroupName testBkpVaultRG
```

## Create a vaulted backup policy for an Azure Cosmos DB account by using Azure PowerShell

A backup policy defines the backup schedule and the retention rules that govern the lifecycle of recovery points. Azure Cosmos DB vaulted backup takes a **weekly full backup** and **daily incremental backups** — the weekly full captures the entire account, and each daily incremental captures only the changes since the previous backup, which reduces backup time and storage. Create the policy before you configure protection to associate it with the Azure Cosmos DB account by using the following cmdlets:

1. Fetch the default policy template for the Azure Cosmos DB datasource type by using the [Get-AzDataProtectionPolicyTemplate](/powershell/module/az.dataprotection/get-azdataprotectionpolicytemplate) cmdlet. The default template already defines a **weekly full backup with daily incremental backups**, along with default retention that you can customize.

   ```azurepowershell-interactive
   $policyDefn = Get-AzDataProtectionPolicyTemplate -DatasourceType AzureCosmosDB
   ```

   > [!NOTE]
   > Azure Cosmos DB vaulted backup uses a **weekly full** backup plus **daily incremental** backups. Retention rules are applied in priority order: yearly, monthly, weekly, then daily. When a recovery point matches multiple rules, the highest-priority rule applies. The default rule applies when no other rule matches.

2. (Optional) Adjust the day and time of the **weekly full** backup by using [New-AzDataProtectionPolicyTriggerScheduleClientObject](/powershell/module/az.dataprotection/new-azdataprotectionpolicytriggerscheduleclientobject) and [Edit-AzDataProtectionPolicyTriggerClientObject](/powershell/module/az.dataprotection/edit-azdataprotectionpolicytriggerclientobject). The daily incremental cadence comes from the default template.

   ```azurepowershell-interactive
   $fullSchedule = New-AzDataProtectionPolicyTriggerScheduleClientObject -ScheduleDays "2026-08-03T09:30:00" -IntervalType Weekly -IntervalCount 1

   Edit-AzDataProtectionPolicyTriggerClientObject -Schedule $fullSchedule -Policy $policyDefn
   ```

3. (Optional) Customize retention. Daily incremental recovery points and weekly full recovery points can have different retention durations. The following example retains daily recovery points for 30 days and weekly full recovery points for 12 weeks, by using [New-AzDataProtectionRetentionLifeCycleClientObject](/powershell/module/az.dataprotection/new-azdataprotectionretentionlifecycleclientobject) and [Edit-AzDataProtectionPolicyRetentionRuleClientObject](/powershell/module/az.dataprotection/edit-azdataprotectionpolicyretentionruleclientobject).

   ```azurepowershell-interactive
   # Daily incremental recovery points: retain for 30 days
   $dailyRetention = New-AzDataProtectionRetentionLifeCycleClientObject -SourceDataStore VaultStore -SourceRetentionDurationType Days -SourceRetentionDurationCount 30
   Edit-AzDataProtectionPolicyRetentionRuleClientObject -RuleName Default -IsDefault $true -LifeCycles $dailyRetention -Policy $policyDefn

   # Weekly full recovery points: retain for 12 weeks
   $weeklyRetention = New-AzDataProtectionRetentionLifeCycleClientObject -SourceDataStore VaultStore -SourceRetentionDurationType Weeks -SourceRetentionDurationCount 12
   Edit-AzDataProtectionPolicyRetentionRuleClientObject -RuleName Weekly -IsDefault $false -LifeCycles $weeklyRetention -Policy $policyDefn
   ```

4. Create the backup policy in the vault by using the [New-AzDataProtectionBackupPolicy](/powershell/module/az.dataprotection/new-azdataprotectionbackuppolicy) cmdlet.

   ```azurepowershell-interactive
   New-AzDataProtectionBackupPolicy -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name -Name CosmosDBBackupPolicy -Policy $policyDefn
   ```

## Next steps

[Configure vaulted backup for Azure Cosmos DB account by using Azure PowerShell](backup-azure-cosmos-db-using-powershell.md)

::: zone-end
