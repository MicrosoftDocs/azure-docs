---
title: Modify periodic backup interval and retention period
titleSuffix: Azure Cosmos DB
description: Learn how to modify the interval and retention period for periodic backup in Azure Cosmos DB accounts.
author: kanshiG
ms.author: govindk
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/21/2023
ms.custom: ignite-2022
---

# Modify periodic backup interval and retention period in Azure Cosmos DB

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Azure Cosmos DB automatically takes a full backup of your data for every 4 hours and at any point of time, the latest two backups are stored. This configuration is the default option and it’s offered without any extra cost. You can change the default backup interval and retention period during the Azure Cosmos DB account creation or after the account is created. The backup configuration is set at the Azure Cosmos DB account level and you need to configure it on each account. After you configure the backup options for an account, it’s applied to all the containers within that account. You can modify these settings using the Azure portal as described later in this article, or via [PowerShell](periodic-backup-restore-introduction.md#modify-backup-options-using-azure-powershell) or the [Azure CLI](periodic-backup-restore-introduction.md#modify-backup-options-using-azure-cli).

## Before you start

If you've accidentally deleted or corrupted your data, **before you create a support request to restore the data, make sure to increase the backup retention for your account to at least seven days. It’s best to increase your retention within 8 hours of this event.** This way, the Azure Cosmos DB team has enough time to restore your account.

## Modify backup options for an existing account

Use the following steps to change the default backup options for an existing Azure Cosmos DB account.

### [Azure portal](#tab/azure-portal)

### [Azure CLI](#tab/azure-cli)

### [Azure PowerShell](#tab/azure-powershell)

### [Azure Resource Manager template](#tab/azure-resource-manager-template)

---

## Modify backup options for a new account

Use these steps to change the default backup options for a new Azure Cosmos DB account.

> [!NOTE]
> For illustrative purposes, these examples assume that you are creating an [Azure Cosmos DB for NoSQL](nosql/index.yml) account. The steps are very similar for accounts using other APIs.

### [Azure portal](#tab/azure-portal)

### [Azure CLI](#tab/azure-cli)

### [Azure PowerShell](#tab/azure-powershell)

### [Azure Resource Manager template](#tab/azure-resource-manager-template)

---



### Modify backup options using Azure portal - Existing account


1. Sign into the [Azure portal.](https://portal.azure.com/)

1. Navigate to your Azure Cosmos DB account and open the **Backup & Restore** pane. Update the backup interval and the backup retention period as required.

    - **Backup Interval** - It’s the interval at which Azure Cosmos DB attempts to take a backup of your data. Backup takes a nonzero amount of time and in some case it could potentially fail due to downstream dependencies. Azure Cosmos DB tries its best to take a backup at the configured interval, however, it doesn’t guarantee that the backup completes within that time interval. You can configure this value in hours or minutes. Backup Interval can't be less than 1 hour and greater than 24 hours. When you change this interval, the new interval takes into effect starting from the time when the last backup was taken.

    - **Backup Retention** - It represents the period where each backup is retained. You can configure it in hours or days. The minimum retention period can’t be less than two times the backup interval (in hours) and it can’t be greater than 720 hours.

    - **Copies of data retained** - By default, two backup copies of your data are offered at free of charge. There's an extra charge if you need more than two copies. See the Consumed Storage section in the [Pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) to know the exact price for extra copies.

    - **Backup storage redundancy** - Choose the required storage redundancy option, see the [Backup storage redundancy](#backup-storage-redundancy) section for available options. By default, your existing periodic backup mode accounts have geo-redundant storage if the region where the account is being provisioned supports it. Otherwise, the account fallback to the highest redundancy option available. You can choose other storage such as locally redundant to ensure the backup isn't replicated to another region. The changes made to an existing account are applied to only future backups. After the backup storage redundancy of an existing account is updated, it may take up to twice the backup interval time for the changes to take effect, and **you will lose access to restore the older backups immediately.**

    > [!NOTE]
    > You must have the Azure [Azure Cosmos DB Operator role](../role-based-access-control/built-in-roles.md#cosmos-db-operator) role assigned at the subscription level to configure backup storage redundancy.

    :::image type="content" source="./media/configure-periodic-backup-restore/configure-backup-options-existing-accounts.png" alt-text="Screenshot of configuration options including backup interval, retention, and storage redundancy for an existing Azure Cosmos DB account." border="true":::

### Modify backup options using Azure portal - New account

When provisioning a new account, from the **Backup Policy** tab, select **Periodic*** backup policy. The periodic policy allows you to configure the backup interval, backup retention, and backup storage redundancy. For example, you can choose **locally redundant backup storage** or **Zone redundant backup storage** options to prevent backup data replication outside your region.

:::image type="content" source="./media/configure-periodic-backup-restore/configure-backup-options-new-accounts.png" alt-text="Screenshot of configuring a periodic or continuous backup policy for a new Azure Cosmos DB account." border="true":::

### Modify backup options using Azure PowerShell

Use the following PowerShell cmdlet to update the periodic backup options:

```azurepowershell-interactive
Update-AzCosmosDBAccount -ResourceGroupName "resourceGroupName" `
  -Name "accountName" `
  -BackupIntervalInMinutes 480 `
  -BackupRetentionIntervalInHours 16
```

### Modify backup options using Azure CLI

Use the following CLI command to update the periodic backup options:

```azurecli-interactive
az cosmosdb update --resource-group "resourceGroupName" \
  --name "accountName" \
  --backup-interval 240 \
  --backup-retention 8
```

### Modify backup options using Resource Manager template

When deploying the Resource Manager template, change the periodic backup options within the `backupPolicy` object:

```json
 "backupPolicy": {
    "type": "Periodic",
    "periodicModeProperties": {
        "backupIntervalInMinutes": 240,
        "backupRetentionIntervalInHours": 8,
        "backupStorageRedundancy": "Zone"
    }
}
```

## Next steps

> [!div class="nextstepaction"]
> [TODO](about:blank)
