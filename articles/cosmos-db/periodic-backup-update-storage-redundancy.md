---
title: Update periodic backup storage redundancy
titleSuffix: Azure Cosmos DB
description: Update the backup storage redundancy using Azure CLI or Azure PowerShell and enforce a minimum storage redundancy using Azure Policy.
author: kanshiG
ms.author: govindk
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/21/2023
ms.custom: ignite-2022
---

# Update periodic backup storage redundancy for Azure Cosmos DB

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

By default, Azure Cosmos DB stores periodic mode backup data in geo-redundant [blob storage](../storage/common/storage-redundancy.md) that is replicated to a [paired region](../availability-zones/cross-region-replication-azure.md). You can override the default backup storage redundancy. This article explains how to update the backup storage redundancy using Azure CLI and PowerShell. It also shows how to configure an Azure policy on your accounts to enforce the required storage redundancy.

## Update storage redundancy

Use the following steps to update backup storage redundancy.

### [Azure portal](#tab/azure-portal)

1. Sign into the [Azure portal](https://portal.azure.com/) and navigate to your Azure Cosmos DB account.

1. Open the **Backup & Restore** pane, update the backup storage redundancy and select **Submit**. It takes few minutes for the operation to complete.

   :::image type="content" source="./media/update-backup-storage-redundancy/update-backup-storage-redundancy-portal.png" alt-text="Screenshot of the update backup storage redundancy page from the Azure portal.":::

### [Azure CLI](#tab/azure-cli)

1. Ensure you have the latest version of Azure CLI or a version higher than or equal to **2.30.0**. If you have the `cosmosdb-preview` extension installed, make sure to remove it.

1. Use the following command to get the backup redundancy options available in the regions where your account exists.

    ```azurecli-interactive
    az cosmosdb locations show \
          --location <region_name>
    ```

    The output should include JSON similar to this example:

    ```json
    {
      "id": "subscriptionId/<Subscription_ID>/providers/Microsoft.DocumentDB/locations/eastus/",
      "name": "East US",
      "properties": {
        "backupStorageRedundancies": [
          "Geo",
          "Zone",
          "Local"
        ],
        "isResidencyRestricted": false,
        "supportsAvailabilityZone": true
      },
      "type": "Microsoft.DocumentDB/locations"
    }
    ```

    > [!NOTE]
    > The previous command shows a list of backup redundancies available in the specific region. Supported values are displayed in the `backupStorageRedundancies` property. For example some regions may support up to three redundancy options: **Geo**, **Zone**, and **Local**. Other regions may support a subset of these options.  Before updating, choose the backup storage redundancy option that is supported in all the regions your Azure Cosmos DB account uses.

1. Run the [`az cosmosdb update`](/cli/azure/cosmosdb#az-cosmosdb-update) command with the chosen backup redundancy option to update the backup redundancy on an existing account.

    ```azurecli-interactive
    az cosmosdb update \
        --resource-group <resource_group>
        --name <account_name>
        --backup-redundancy Geo
    ```

1. Run the [`az cosmosdb create`](/cli/azure/cosmosdb#az-cosmosdb-create) command to create a new account with the chosen backup redundancy option.

    ```azurecli-interactive
    az cosmosdb create
        --resource-group <resource_group>
        --name <account_name>
        --backup-redundancy Geo
        --locations regionName=<azure_region>
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Install the latest version of Azure PowerShell or a version higher than or equal to **1.4.0**.

    ```azurepowershell-interactive
    @parameters {
        Name = "Az.CosmosDB"
        RequiredVersion = "1.4.0"
    }
    Install-Module @parameters
    ```

1. Use the following command to get the backup redundancy options available in the regions where your account exists.

    ```azurepowershell-interactive
    @parameters = {
        Location = "<azure_region>"
    }
    $location = @parameters
    
    $location.Properties.BackupStorageRedundancies
    ```

    > [!NOTE]
    > The previous command shows a list of backup redundancies available in the specific region. Supported values are displayed in the `BackupStorageRedundancies` property. For example some regions may support up to three redundancy options: **Geo**, **Zone**, and **Local**. Other regions may support a subset of these options.  Before updating, choose the backup storage redundancy option that is supported in all the regions your Azure Cosmos DB account uses.

1. Run the [`Update-AzCosmosDBAccount`](/powershell/module/az.cosmosdb/update-azcosmosdbaccount) command with the chosen backup redundancy option to update the backup redundancy on an existing account:

    ```azurepowershell-interactive
    @parameters = {
        ResourceGroupName "<resource_group>"
        Name = "<account_name>"
        BackupStorageRedundancy = "Geo"
    }
    Update-AzCosmosDBAccount @parameters
    ```

1. Run the [`New-AzCosmosDBAccount`](/powershell/module/az.cosmosdb/new-azcosmosdbaccount) command to create a new account with the chosen backup redundancy option:

    ```azurepowershell-interactive
    @parameters = {
        ResourceGroupName "<resource_group>"
        Name = "<account_name>"
        Location = "<azure_region>"
        BackupPolicyType = "Periodic"
        BackupStorageRedundancy = "Geo"
    }
    New-AzCosmosDBAccount @parameters
    ```

## Add an Azure Policy for backup storage redundancy

Azure Policy helps you to enforce organizational standards and to assess compliance at-scale. For more information, see [what is Azure Policy?](../governance/policy/overview.md).

The following sample shows how to add an Azure policy for Azure Cosmos DB accounts to validate (using `audit`) that they have their backup redundancy configured to `Zone`.

```json
"parameters": {},
"policyRule": {
  "if": {
    "allOf": [
      {
        "field": "Microsoft.DocumentDB/databaseAccounts/backupPolicy.periodicModeProperties.backupStorageRedundancy",
        "match": "Zone"
      }
    ]
  },
  "then": {
    "effect": "audit"
  }
}
```

## Next steps

> [!div class="nextstepaction"]
> Learn how to [modify the backup interval and retention period](periodic-backup-modify-interval-retention.md)
