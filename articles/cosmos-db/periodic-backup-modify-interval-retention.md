---
title: Modify periodic backup interval and retention period
titleSuffix: Azure Cosmos DB
description: Learn how to modify the interval and retention period for periodic backup in Azure Cosmos DB accounts.
author: kanshiG
ms.author: govindk
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: how-to
ms.date: 03/21/2023
ms.custom: ignite-2022
---

# Modify periodic backup interval and retention period in Azure Cosmos DB

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Azure Cosmos DB automatically takes a full backup of your data for every 4 hours and at any point of time, the latest two backups are stored. This configuration is the default option and it’s offered without any extra cost. You can change the default backup interval and retention period during the Azure Cosmos DB account creation or after the account is created. The backup configuration is set at the Azure Cosmos DB account level and you need to configure it on each account. After you configure the backup options for an account, it’s applied to all the containers within that account. You can modify these settings using the Azure portal, Azure PowerShell, or the Azure CLI.

## Prerequisites

- An existing Azure Cosmos DB account.
  - If you have an Azure subscription, [create a new account](nosql/how-to-create-account.md?tabs=azure-portal).
  - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  - Alternatively, you can [try Azure Cosmos DB free](try-free.md) before you commit.

## Before you start

If you've accidentally deleted or corrupted your data, **before you create a support request to restore the data, make sure to increase the backup retention for your account to at least seven days. It’s best to increase your retention within 8 hours of this event.** This way, the Azure Cosmos DB team has enough time to restore your account.

## Modify backup options for an existing account

Use the following steps to change the default backup options for an existing Azure Cosmos DB account.

### [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Azure Cosmos DB account and open the **Backup & Restore** pane. Update the backup interval and the backup retention period as required.

    - **Backup Interval** - It’s the interval at which Azure Cosmos DB attempts to take a backup of your data. Backup takes a nonzero amount of time and in some case it could potentially fail due to downstream dependencies. Azure Cosmos DB tries its best to take a backup at the configured interval, however, it doesn’t guarantee that the backup completes within that time interval. You can configure this value in hours or minutes. Backup Interval can't be less than 1 hour and greater than 24 hours. When you change this interval, the new interval takes into effect starting from the time when the last backup was taken.

    - **Backup Retention** - It represents the period where each backup is retained. You can configure it in hours or days. The minimum retention period can’t be less than two times the backup interval (in hours) and it can’t be greater than 720 hours.

    - **Copies of data retained** - By default, two backup copies of your data are offered at free of charge. There's an extra charge if you need more than two copies. See the Consumed Storage section in the [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) to know the exact price for extra copies.

    - **Backup storage redundancy** - Choose the required storage redundancy option. For more information, see [backup storage redundancy](periodic-backup-storage-redundancy.md). By default, your existing periodic backup mode accounts have geo-redundant storage if the region where the account is being provisioned supports it. Otherwise, the account fallback to the highest redundancy option available. You can choose other storage such as locally redundant to ensure the backup isn't replicated to another region. The changes made to an existing account are applied to only future backups. After the backup storage redundancy of an existing account is updated, it may take up to twice the backup interval time for the changes to take effect, and **you will lose access to restore the older backups immediately.**

    > [!NOTE]
    > You must have the Azure [Azure Cosmos DB Operator role](../role-based-access-control/built-in-roles.md#cosmos-db-operator) role assigned at the subscription level to configure backup storage redundancy.

    :::image type="content" source="./media/periodic-backup-modify-interval-retention/configure-existing-account-portal.png" lightbox="./media/periodic-backup-modify-interval-retention/configure-existing-account-portal.png" alt-text="Screenshot of configuration options including backup interval, retention, and storage redundancy for an existing Azure Cosmos DB account.":::

### [Azure CLI](#tab/azure-cli)

Use the [`az cosmosdb update`](/cli/azure/cosmosdb#az-cosmosdb-update) command to update the periodic backup options for an existing account.

```azurecli-interactive
az cosmosdb update \
    --resource-group <resource-group-name> \
    --name <account-name> \
    --backup-interval 480 \
    --backup-retention 24
```

### [Azure PowerShell](#tab/azure-powershell)

Use the [`Update-AzCosmosDBAccount`](/powershell/module/az.cosmosdb/update-azcosmosdbaccount) cmdlet to update the periodic backup options for an existing account.

```azurepowershell-interactive
$parameters = @{
    ResourceGroupName = "<resource-group-name>"
    Name = "<account-name>"
    BackupIntervalInMinutes = 480
    BackupRetentionIntervalInHours = 24
}
Update-AzCosmosDBAccount @parameters
```

### [Azure Resource Manager template](#tab/azure-resource-manager-template)

Use the following Azure Resource Manager JSON template to update the periodic backup options for an existing account.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "newAccountName": {
      "type": "string",
      "defaultValue": "[format('nosql-{0}', toLower(uniqueString(resourceGroup().id)))]",
      "metadata": {
        "description": "Name of the existing Azure Cosmos DB account."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for the Azure Cosmos DB account."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.DocumentDB/databaseAccounts",
      "apiVersion": "2022-05-15",
      "name": "[parameters('newAccountName')]",
      "location": "[parameters('location')]",
      "kind": "GlobalDocumentDB",
      "properties": {
        "databaseAccountOfferType": "Standard",
        "locations": [
          {
            "locationName": "[parameters('location')]"
          }
        ],
        "backupPolicy": {
            "type": "Periodic",
            "periodicModeProperties": {
                "backupIntervalInMinutes": 480,
                "backupRetentionIntervalInHours": 24,
                "backupStorageRedundancy": "Local"
            }
        }
      }
    }
  ]
}
```

Alternatively, you can use the Bicep variant of the same template.

```bicep
@description('Name of the existing Azure Cosmos DB account.')
param newAccountName string = 'nosql-${toLower(uniqueString(resourceGroup().id))}'

@description('Location for the Azure Cosmos DB account.')
param location string = resourceGroup().location

resource account 'Microsoft.DocumentDB/databaseAccounts@2022-05-15' = {
  name: newAccountName
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
      }
    ]
    backupPolicy:
      type: 'Periodic'
      periodicModeProperties:
        backupIntervalInMinutes: 480,
        backupRetentionIntervalInHours: 24,
        backupStorageRedundancy: 'Local'
  }
}
```

---

## Configure backup options for a new account

Use these steps to change the default backup options for a new Azure Cosmos DB account.

> [!NOTE]
> For illustrative purposes, these examples assume that you are creating an [Azure Cosmos DB for NoSQL](nosql/index.yml) account. The steps are very similar for accounts using other APIs.

### [Azure portal](#tab/azure-portal)

When provisioning a new account, from the **Backup Policy** tab, select **Periodic*** backup policy. The periodic policy allows you to configure the backup interval, backup retention, and backup storage redundancy. For example, you can choose **locally redundant backup storage** or **Zone redundant backup storage** options to prevent backup data replication outside your region.

:::image type="content" source="./media/periodic-backup-modify-interval-retention/configure-new-account-portal.png" lightbox="./media/periodic-backup-modify-interval-retention/configure-new-account-portal.png" alt-text="Screenshot of configuring a periodic backup policy for a new Azure Cosmos DB account." :::

### [Azure CLI](#tab/azure-cli)

Use the [`az cosmosdb create`](/cli/azure/cosmosdb#az-cosmosdb-create) command to create a new account with the specified periodic backup options.

```azurecli-interactive
az cosmosdb create \
    --resource-group <resource-group-name> \
    --name <account-name> \
    --locations regionName=<azure-region> \
    --backup-interval 360 \
    --backup-retention 12
```

### [Azure PowerShell](#tab/azure-powershell)

Use the [`New-AzCosmosDBAccount`](/powershell/module/az.cosmosdb/new-azcosmosdbaccount) cmdlet to create a new account with the specified periodic backup options.

```azurepowershell-interactive
$parameters = @{
    ResourceGroupName = "<resource-group-name>"
    Name = "<account-name>"
    Location = "<azure-region>"
    BackupPolicyType = "Periodic"
    BackupIntervalInMinutes = 360
    BackupRetentionIntervalInHours = 12
}
New-AzCosmosDBAccount @parameters
```

### [Azure Resource Manager template](#tab/azure-resource-manager-template)

Use the following Azure Resource Manager JSON template to update the periodic backup options for an existing account.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "newAccountName": {
      "type": "string",
      "defaultValue": "[format('nosql-{0}', toLower(uniqueString(resourceGroup().id)))]",
      "metadata": {
        "description": "New Azure Cosmos DB account name. Max length is 44 characters."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for the new Azure Cosmos DB account."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.DocumentDB/databaseAccounts",
      "apiVersion": "2022-05-15",
      "name": "[parameters('newAccountName')]",
      "location": "[parameters('location')]",
      "kind": "GlobalDocumentDB",
      "properties": {
        "databaseAccountOfferType": "Standard",
        "locations": [
          {
            "locationName": "[parameters('location')]"
          }
        ],
        "backupPolicy": {
            "type": "Periodic",
            "periodicModeProperties": {
                "backupIntervalInMinutes": 360,
                "backupRetentionIntervalInHours": 12,
                "backupStorageRedundancy": "Zone"
            }
        }
      }
    }
  ]
}
```

Alternatively, you can use the Bicep variant of the same template.

```bicep
@description('New Azure Cosmos DB account name. Max length is 44 characters.')
param newAccountName string = 'sql-${toLower(uniqueString(resourceGroup().id))}'

@description('Location for the new Azure Cosmos DB account.')
param location string = resourceGroup().location

resource account 'Microsoft.DocumentDB/databaseAccounts@2022-05-15' = {
  name: newAccountName
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
      }
    ]
    backupPolicy:
      type: 'Periodic'
      periodicModeProperties:
        backupIntervalInMinutes: 360,
        backupRetentionIntervalInHours: 12,
        backupStorageRedundancy: 'Zone'
  }
}
```

---

## Next steps

> [!div class="nextstepaction"]
> [Request data restoration from a backup](periodic-backup-request-data-restore.md)
