---
title: Update backup storage redundancy for Azure Cosmos DB periodic backup accounts
description: Learn how to update the backup storage redundancy using Azure CLI, and PowerShell. You can also configure an Azure policy on your accounts to enforce the required storage redundancy.
author: kanshiG
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 12/03/2021
ms.author: govindk
ms.reviewer: mjbrown
---

# Update backup storage redundancy for Azure Cosmos DB periodic backup accounts
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

By default, Azure Cosmos DB stores periodic mode backup data in geo-redundant [blob storage](../storage/common/storage-redundancy.md) that is replicated to a [paired region](../availability-zones/cross-region-replication-azure.md). You can override the default backup storage redundancy. This article explains how to update the backup storage redundancy using Azure CLI and PowerShell. It also shows how to configure an Azure policy on your accounts to enforce the required storage redundancy.

## Update using Azure portal

Use the following steps to update backup storage redundancy from the Azure portal:

1. Sign into the [Azure portal](https://portal.azure.com/) and navigate to your Azure Cosmos DB account.

1. Open the **Backup & Restore** pane, update the backup storage redundancy and select **Submit**. It takes few minutes for the operation to complete:

   :::image type="content" source="./media/update-backup-storage-redundancy/update-backup-storage-redundancy-portal.png" alt-text="Update backup storage redundancy from the Azure portal":::

## Update using CLI

Use the following steps to update the backup storage redundancy on an existing account using Azure CLI:

1. Install the latest version if Azure CLI or a version higher than or equal to 2.30.0. If you have the "cosmosdb-preview" extension installed, make sure to remove it.

1. Use the following command to get the backup redundancy options available in the regions where your account exists:

   ```azurecli-interactive
   az cosmosdb locations show --location <region_Name>
   ```

   ```bash
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

   The previous command shows a list of backup redundancies available in the specific region. Supported values are displayed in the `backupStorageRedundancies` property. For example some regions such as "East US" support three redundancy options "Geo", "Zone", and "Local" whereas some regions like "UAE North" support only "Geo" and "Local" redundancy options. Before updating, choose the backup storage redundancy option that is supported in all the regions where your account exists.

1. Run the following command with the chosen backup redundancy option to update the backup redundancy on an existing account:

   ```azurecli-interactive
   az cosmosdb update -n <account_Name> -g <resource_Group> --backup-redundancy "Geo"
   ```

1. Run the following command to create a new account with the chosen backup redundancy option:

   ```azurecli-interactive
   az cosmosdb create -n <account_Name> -g <resource_Group> --backup-redundancy "Geo" --locations regionName=westus
   ```

## Update using PowerShell

1. Install the latest version of Azure PowerShell or a version higher than or equal to 1.4.0

   ```powershell-interactive
   Install-Module -Name Az.CosmosDB -RequiredVersion 1.4.0
   ```

1. Use the following command to get the backup redundancy options available in the regions where your account exists:

   ```powershell-interactive
   $location = Get-AzCosmosDBLocation -Location <region_Name>
   $location.Properties.BackupStorageRedundancies
   ```

   The previous command shows a list of backup redundancies available in the specific region. Supported values are displayed in the `backupStorageRedundancies` property. For example some regions such as "East US" support three redundancy options "Geo", "Zone", and "Local" whereas some regions like "UAE North" support only "Geo" and "Local" redundancy options. Before updating, choose the backup storage redundancy option that is supported in all the regions where your account exists.

1. Run the following command with the chosen backup redundancy option to update the backup redundancy on an existing account:

   ```powershell-interactive
   Update-AzCosmosDBAccount `
   -Name <account_Name> `
   -ResourceGroupName <resource_Group> `
   -BackupStorageRedundancy "Geo"
   ```

1. Run the following command to create a new account with the chosen backup redundancy option:

   ```powershell-interactive
   New-AzCosmosDBAccount `
    -Name <account_Name> `
    -ResourceGroupName <resource_Group> `
    -Location <region_Name> `
    -BackupPolicyType Periodic`
    -BackupStorageRedundancy "Geo"

   ```

## Add a policy for the backup storage redundancy

Azure Policy helps you to enforce organizational standards and to assess compliance at-scale. The following sample shows how to add an Azure policy for the database accounts to have a backup redundancy of type "Zone".

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

* Provision an Azure Cosmos DB account with [periodic backup mode'(configure-periodic-backup-restore.md).
* Provision an account with continuous backup using [Azure portal](provision-account-continuous-backup.md#provision-portal), [PowerShell](provision-account-continuous-backup.md#provision-powershell), [CLI](provision-account-continuous-backup.md#provision-cli), or [Azure Resource Manager](provision-account-continuous-backup.md#provision-arm-template).
* Restore continuous backup account using [Azure portal](restore-account-continuous-backup.md#restore-account-portal), [PowerShell](restore-account-continuous-backup.md#restore-account-powershell), [CLI](restore-account-continuous-backup.md#restore-account-cli), or [Azure Resource Manager](restore-account-continuous-backup.md#restore-arm-template).
