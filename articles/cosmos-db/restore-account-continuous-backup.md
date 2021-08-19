---
title: Restore an Azure Cosmos DB account that uses continuous backup mode.
description: Learn how to identify the restore time and restore a live or deleted Azure Cosmos DB account. It shows how to use the event feed to identify the restore time and restore the account using Azure portal, PowerShell, CLI, or a Resource Manager template.
author: kanshiG
ms.service: cosmos-db
ms.topic: how-to
ms.date: 07/29/2021
ms.author: govindk
ms.reviewer: sngun
ms.custom: devx-track-azurepowershell

---

# Restore an Azure Cosmos DB account that uses continuous backup mode
[!INCLUDE[appliesto-sql-mongodb-api](includes/appliesto-sql-mongodb-api.md)]

Azure Cosmos DB's point-in-time restore feature helps you to recover from an accidental change within a container, to restore a deleted account, database, or a container or to restore into any region (where backups existed). The continuous backup mode allows you to do restore to any point of time within the last 30 days.

This article describes how to identify the restore time and restore a live or deleted Azure Cosmos DB account. It shows restore the account using [Azure portal](#restore-account-portal), [PowerShell](#restore-account-powershell), [CLI](#restore-account-cli), or a [Resource Manager template](#restore-arm-template).

## <a id="restore-account-portal"></a>Restore an account using Azure portal

### <a id="restore-live-account"></a>Restore a live account from accidental modification

You can use Azure portal to restore an entire live account or selected databases and containers under it. Use the following steps to restore your data:

1. Sign into the [Azure portal](https://portal.azure.com/)
1. Navigate to your Azure Cosmos DB account and open the **Point In Time Restore** blade.

   > [!NOTE]
   > The restore blade in Azure portal is only populated if you have the `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read` permission. To learn more about how to set this permission, see the [Backup and restore permissions](continuous-backup-restore-permissions.md) article.

1. Fill the following details to restore:

   * **Restore Point (UTC)** – A timestamp within the last 30 days. The account should exist at that timestamp. You can specify the restore point in UTC. It can be as close to the second when you want to restore it. Select the **Click here** link to get help on [identifying the restore point](#event-feed).

   * **Location** – The destination region where the account is restored. The account should exist in this region at the given timestamp (for example, West US or East US). An account can be restored only to the regions in which the source account existed.

   * **Restore Resource** – You can either choose **Entire account** or a **selected database/container** to restore. The databases and containers should exist at the given timestamp. Based on the restore point and location selected, restore resources are populated, which allows user to select specific databases or containers that need to be restored.

   * **Resource group** - Resource group under which the target account will be created and restored. The resource group must already exist.

   * **Restore Target Account** – The target account name. The target account name needs to follow same guidelines as when you are creating a new account. This account will be created by the restore process in the same region where your source account exists.
 
   :::image type="content" source="./media/restore-account-continuous-backup/restore-live-account-portal.png" alt-text="Restore a live account from accidental modification Azure portal." border="true" lightbox="./media/restore-account-continuous-backup/restore-live-account-portal.png":::

1. After you select the above parameters, select the **Submit** button to kick off a restore. The restore cost is a one time charge, which is based on the size of data and the cost of backup storage in the selected region. To learn more, see the [Pricing](continuous-backup-restore-introduction.md#continuous-backup-pricing) section.

### <a id="event-feed"></a>Use event feed to identify the restore time

When filling out the restore point time in the Azure portal, if you need help with identifying restore point, select the **Click here** link, it takes you to the event feed blade. The event feed provides a full fidelity list of create, replace, delete events on databases and containers of the source account. 

For example, if you want to restore to the point before a certain container was deleted or updated, check this event feed. Events are displayed in chronologically descending order of time when they occurred, with recent events at the top. You can browse through the results and select the time before or after the event to further narrow your time.

:::image type="content" source="./media/restore-account-continuous-backup/event-feed-portal.png" alt-text="Use event feed to identify the restore point time." border="true" lightbox="./media/restore-account-continuous-backup/event-feed-portal.png":::

> [!NOTE]
> The event feed does not display the changes to the item resources. You can always manually specify any timestamp in the last 30 days (as long as account exists at that time) for restore.

### <a id="restore-deleted-account"></a>Restore a deleted account

You can use Azure portal to completely restore a deleted account within 30 days of its deletion. Use the following steps to restore a deleted account:

1. Sign into the [Azure portal](https://portal.azure.com/)
1. Search for *Azure Cosmos DB* resources in the global search bar. It lists all your existing accounts.
1. Next select the **Restore** button. The Restore blade displays a list of deleted accounts that can be restored within the retention period, which is 30 days from deletion time.
1. Choose the account that you want to restore.

   :::image type="content" source="./media/restore-account-continuous-backup/restore-deleted-account-portal.png" alt-text="Restore a deleted account from Azure portal." border="true" lightbox="./media/restore-account-continuous-backup/restore-deleted-account-portal.png":::

   > [!NOTE]
   > The restore blade in Azure portal is only populated if you have the `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read` permission. To learn more about how to set this permission, see the [Backup and restore permissions](continuous-backup-restore-permissions.md) article.

1. Select an account to restore and input the following details to restore a deleted account:

   * **Restore Point (UTC)** – A timestamp within the last 30 days. The account should have existed at that timestamp. Specify the restore point in UTC. It can be as close to the second when you want to restore it.

   * **Location** – The destination region where the account needs to be restored. The source account should exist in this region at the given timestamp. Example West US or East US.  

   * **Resource group** - Resource group under which the target account will be created and restored. The resource group must already exist.

   * **Restore Target Account** – The target account name needs to follow same guidelines as when you are creating a new account. This account will be created by the restore process in the same region where your source account exists.

### <a id="track-restore-status"></a>Track the status of restore operation

After initiating a restore operation, select the **Notification** bell icon at top-right corner of portal. It gives a link displaying the status of the account being restored. While restore is in progress, the status of the account will be *Creating*, after the restore operation completes, the account status will change to *Online*.

:::image type="content" source="./media/restore-account-continuous-backup/track-restore-operation-status.png" alt-text="The status of restored account changes from creating to online when the operation is complete." border="true" lightbox="./media/restore-account-continuous-backup/track-restore-operation-status.png":::

## <a id="restore-account-powershell"></a>Restore an account using Azure PowerShell

Before restoring the account, install the [latest version of Azure PowerShell](/powershell/azure/install-az-ps?view=azps-6.2.1&preserve-view=true) or version higher than 6.2.0. Next connect to your Azure account and select the required subscription with the following commands:

1. Sign into Azure using the following command:

   ```azurepowershell
   Connect-AzAccount
   ```

1. Select a specific subscription with the following command:

   ```azurepowershell
   Select-AzSubscription -Subscription <SubscriptionName>

### <a id="trigger-restore-ps"></a>Trigger a restore operation

The following cmdlet is an example to trigger a restore operation with the restore command by using the target account, source account, location, resource group, and timestamp:

```azurepowershell

Restore-AzCosmosDBAccount `
  -TargetResourceGroupName "MyRG" `
  -TargetDatabaseAccountName "RestoredAccountName" `
  -SourceDatabaseAccountName "SourceDatabaseAccountName" `
  -RestoreTimestampInUtc "UTCTime" `
  -Location "AzureRegionName"

```

**Example 1:** Restoring the entire account:

```azurepowershell

Restore-AzCosmosDBAccount `
  -TargetResourceGroupName "MyRG" `
  -TargetDatabaseAccountName "Pitracct" `
  -SourceDatabaseAccountName "source-sql" `
  -RestoreTimestampInUtc "2021-01-05T22:06:00" `
  -Location "West US"

```

**Example 2:** Restoring specific collections and databases. This example restores the collections *MyCol1*, *MyCol2* from *MyDB1* and the entire database *MyDB2*, which, includes all the containers under it.

```azurepowershell
$datatabaseToRestore1 = New-AzCosmosDBDatabaseToRestore -DatabaseName "MyDB1" -CollectionName "MyCol1", "MyCol2"
$datatabaseToRestore2 = New-AzCosmosDBDatabaseToRestore -DatabaseName "MyDB2"

Restore-AzCosmosDBAccount `
  -TargetResourceGroupName "MyRG" `
  -TargetDatabaseAccountName "Pitracct" `
  -SourceDatabaseAccountName "SourceSql" `
  -RestoreTimestampInUtc "2021-01-05T22:06:00" `
  -DatabasesToRestore $datatabaseToRestore1, $datatabaseToRestore2 `
  -Location "West US"

```

### <a id="enumerate-sql-api"></a>Enumerate restorable resources for SQL API

The enumeration cmdlets help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account, database, and container resources.

#### List all the accounts that can be restored in the current subscription

Run the `Get-AzCosmosDBRestorableDatabaseAccount` PowerShell command to list all the accounts that can be restored in the current subscription.

The response includes all the database accounts (both live and deleted) that can be restored and the regions that they can be restored from.

```json
{
    "accountName": "SampleAccount",
    "apiType": "Sql",
    "creationTime": "2020-08-08T01:04:52.070190+00:00",
    "deletionTime": null,
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts/23e99a35-cd36-4df4-9614-f767a03b9995",
    "identity": null,
    "location": "West US",
    "name": "23e99a35-cd36-4df4-9614-f767a03b9995",
    "restorableLocations": [
      {
        "creationTime": "2020-08-08T01:04:52.945185+00:00",
        "deletionTime": null,
        "location": "West US",
        "regionalDatabaseAccountInstanceId": "30701557-ecf8-43ce-8810-2c8be01dccf9"
      },
      {
        "creationTime": "2020-08-08T01:15:43.507795+00:00",
        "deletionTime": null,
        "location": "East US",
        "regionalDatabaseAccountInstanceId": "8283b088-b67d-4975-bfbe-0705e3e7a599"
      }
    ],
    "tags": null,
    "type": "Microsoft.DocumentDB/locations/restorableDatabaseAccounts"
  }
```

Just like the `CreationTime` or `DeletionTime` for the account, there is a `CreationTime` or `DeletionTime` for the region too. These times allow you to choose the right region and a valid time range to restore into that region.

#### List all the versions of SQL databases in a live database account

Listing all the versions of databases allows you to choose the right database in a scenario where the actual time of existence of database is unknown.

Run the following PowerShell command to list all the versions of databases. This command only works with live accounts. The `DatabaseAccountInstanceId` and the `Location` parameters are obtained from the `name` and `location` properties in the response of `Get-AzCosmosDBRestorableDatabaseAccount` cmdlet. The `DatabaseAccountInstanceId` attribute refers to `instanceId` property of source database account being restored:

```azurepowershell

Get-AzCosmosdbSqlRestorableDatabase `
  -Location "East US" `
  -DatabaseAccountInstanceId <DatabaseAccountInstanceId>

```

#### List all the versions of SQL containers of a database in a live database account

Use the following command to list all the versions of SQL containers. This command only works with live accounts. The `DatabaseRId` parameter is the `ResourceId` of the database you want to restore. It is the value of `ownerResourceid` attribute found in the response of `Get-AzCosmosdbSqlRestorableDatabase` cmdlet. The response also includes a list of operations performed on all the containers inside this database.

```azurepowershell

Get-AzCosmosdbSqlRestorableContainer `
  -DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" `
  -DatabaseRId "AoQ13r==" `
  -Location "West US"

```

#### Find databases or containers that can be restored at any given timestamp

Use the following command to get the list of databases or containers that can be restored at any given timestamp. This command only works with live accounts.

```azurepowershell

Get-AzCosmosdbSqlRestorableResource `
  -DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" `
  -Location "West US" `
  -RestoreLocation "East US" `
  -RestoreTimestamp "2020-07-20T16:09:53+0000"

```

### <a id="enumerate-mongodb-api"></a>Enumerate restorable resources in API for MongoDB

The enumeration commands described below help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account, database, and container resources. These commands only work for live accounts and they are similar to SQL API commands but with `MongoDB` in the command name instead of `sql`.

#### List all the versions of MongoDB databases in a live database account

```azurepowershell

Get-AzCosmosdbMongoDBRestorableDatabase `
  -DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" `
  -Location "West US"

```

#### List all the versions of mongodb collections of a database in a live database account

```azurepowershell

Get-AzCosmosdbMongoDBRestorableCollection `
  -DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" `
  -DatabaseRId "AoQ13r==" `
  -Location "West US"
```

#### List all the resources of a mongodb database account that are available to restore at a given timestamp and region

```azurepowershell

Get-AzCosmosdbMongoDBRestorableResource `
  -DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" `
  -Location "West US" `
  -RestoreLocation "West US" `
  -RestoreTimestamp "2020-07-20T16:09:53+0000"
```

## <a id="restore-account-cli"></a>Restore an account using Azure CLI

Before restoring the account, install Azure CLI with the following steps:

1. Install the latest version of Azure CLI

   * Install the latest version of [Azure CLI](/cli/azure/install-azure-cli) or version higher than 2.26.0
   * If you have already installed CLI, run `az upgrade` command to update to the latest version. This command will only work with CLI version higher than 2.11. If you have an earlier version, use the above link to install the latest version.

1. Sign in and select your subscription

   * Sign into your Azure account with `az login` command.
   * Select the required subscription using `az account set -s <subscriptionguid>` command.

### <a id="trigger-restore-cli"></a>Trigger a restore operation with CLI

The simplest way to trigger a restore is by issuing the restore command with name of the target account, source account, location, resource group, timestamp (in UTC), and optionally the database and container names. The following are some examples to trigger the restore operation:

1. Create a new Azure Cosmos DB account by restoring from an existing account.

   ```azurecli-interactive

   az cosmosdb restore \
    --target-database-account-name MyRestoredCosmosDBDatabaseAccount \
    --account-name MySourceAccount \
    --restore-timestamp 2020-07-13T16:03:41+0000 \
    --resource-group MyResourceGroup \
    --location "West US"

   ```

2. Create a new Azure Cosmos DB account by restoring only selected databases and containers from an existing database account.

   ```azurecli-interactive

   az cosmosdb restore \
    --resource-group MyResourceGroup \
    --target-database-account-name MyRestoredCosmosDBDatabaseAccount \
    --account-name MySourceAccount \
    --restore-timestamp 2020-07-13T16:03:41+0000 \
    --location "West US" \
    --databases-to-restore name=MyDB1 collections=Collection1 Collection2 \
    --databases-to-restore name=MyDB2 collections=Collection3 Collection4

   ```

### <a id="enumerate-sql-api"></a>Enumerate restorable resources for SQL API

The enumeration commands described below help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account, database, and container resources.

#### List all the accounts that can be restored in the current subscription

Run the following CLI command to list all the accounts that can be restored in the current subscription

```azurecli-interactive
az cosmosdb restorable-database-account list --account-name "Pitracct"
```

The response includes all the database accounts (both live and deleted) that can be restored and the regions that they can be restored from:

```json
{
    "accountName": "Pitracct",
    "apiType": "Sql",
    "creationTime": "2021-01-08T23:34:11.095870+00:00",
    "deletionTime": null,
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts/7133a59a-d1c0-4645-a699-6e296d6ac865",
    "identity": null,
    "location": "West US",
    "name": "7133a59a-d1c0-4645-a699-6e296d6ac865",
    "restorableLocations": [
      {
        "creationTime": "2021-01-08T23:34:11.095870+00:00",
        "deletionTime": null,
        "locationName": "West US",
        "regionalDatabaseAccountInstanceId": "f02df26b-c0ec-4829-8bef-3482d36e6230"
      }
    ],
    "tags": null,
    "type": "Microsoft.DocumentDB/locations/restorableDatabaseAccounts"
  }
```

Just like the `CreationTime` or `DeletionTime` for the account, there is a `CreationTime` or `DeletionTime` for the region too. These times allow you to choose the right region and a valid time range to restore into that region.

#### List all the versions of databases in a live database account

Listing all the versions of databases allows you to choose the right database in a scenario where the actual time of existence of database is unknown.

Run the following CLI command to list all the versions of databases. This command only works with live accounts. The `instance-id` and the `location` parameters are obtained from the `name` and `location` properties in the response of `az cosmosdb restorable-database-account list` command. The instanceId attribute is also a property of source database account that is being restored:

```azurecli-interactive
az cosmosdb sql restorable-database list \
  --instance-id "7133a59a-d1c0-4645-a699-6e296d6ac865" \
  --location "West US"
```

This command output now shows when a database was created and deleted.

```json
[
  {
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts/7133a59a-d1c0-4645-a699-6e296d6ac865/restorableSqlDatabases/40e93dbd-2abe-4356-a31a-35567b777220",
    ..
    "name": "40e93dbd-2abe-4356-a31a-35567b777220",
    "resource": {
      "database": {
        "id": "db1"
      },
      "eventTimestamp": "2021-01-08T23:27:25Z",
      "operationType": "Create",
      "ownerId": "db1",
      "ownerResourceId": "YuZAAA=="
    },
    ..
  },
  {
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts/7133a59a-d1c0-4645-a699-6e296d6ac865/restorableSqlDatabases/243c38cb-5c41-4931-8cfb-5948881a40ea",
    ..
    "name": "243c38cb-5c41-4931-8cfb-5948881a40ea",
    "resource": {
      "database": {
        "id": "spdb1"
      },
      "eventTimestamp": "2021-01-08T23:25:25Z",
      "operationType": "Create",
      "ownerId": "spdb1",
      "ownerResourceId": "OIQ1AA=="
    },
   ..
  }
]
```

#### List all the versions of SQL containers of a database in a live database account

Use the following command to list all the versions of SQL containers. This command only works with live accounts. The `database-rid` parameter is the `ResourceId` of the database you want to restore. It is the value of `ownerResourceid` attribute found in the response of `az cosmosdb sql restorable-database list` command.

```azurecli-interactive
az cosmosdb sql restorable-container list \
    --instance-id "7133a59a-d1c0-4645-a699-6e296d6ac865" \
    --database-rid "OIQ1AA==" \
    --location "West US"
```

This command output shows includes list of operations performed on all the containers inside this database:

```json
[
  {
    ...
    
      "eventTimestamp": "2021-01-08T23:25:29Z",
      "operationType": "Replace",
      "ownerId": "procol3",
      "ownerResourceId": "OIQ1APZ7U18="
...
  },
  {
    ...
      "eventTimestamp": "2021-01-08T23:25:26Z",
      "operationType": "Create",
      "ownerId": "procol3",
      "ownerResourceId": "OIQ1APZ7U18="
  },
]
```

#### Find databases or containers that can be restored at any given timestamp

Use the following command to get the list of databases or containers that can be restored at any given timestamp. This command only works with live accounts.

```azurecli-interactive

az cosmosdb sql restorable-resource list \
  --instance-id "7133a59a-d1c0-4645-a699-6e296d6ac865" \
  --location "West US" \
  --restore-location "West US" \  
  --restore-timestamp "2021-01-10T01:00:00+0000"

```

```json
[
  {
    "collectionNames": [
      "procol1",
      "procol2"
    ],
    "databaseName": "db1"
  },
  {
    "collectionNames": [
      "procol3",
       "spcol1"
    ],
    "databaseName": "spdb1"
  }
]
```

### <a id="enumerate-mongodb-api"></a>Enumerate restorable resources for MongoDB API account

The enumeration commands described below help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account, database, and container resources. These commands only work for live accounts.

#### List all the versions of mongodb databases in a live database account

```azurecli-interactive
az cosmosdb mongodb restorable-database list \
    --instance-id "7133a59a-d1c0-4645-a699-6e296d6ac865" \
    --location "West US"
```

#### List all the versions of mongodb collections of a database in a live database account

```azurecli-interactive
az cosmosdb mongodb restorable-collection list \
    --instance-id "7133a59a-d1c0-4645-a699-6e296d6ac865" \
    --database-rid "AoQ13r==" \
    --location "West US"
```

#### List all the resources of a mongodb database account that are available to restore at a given timestamp and region

```azurecli-interactive
az cosmosdb mongodb restorable-resource list \
    --instance-id "7133a59a-d1c0-4645-a699-6e296d6ac865" \
    --location "West US" \
    --restore-location "West US" \
    --restore-timestamp "2020-07-20T16:09:53+0000"
```

## <a id="restore-arm-template"></a>Restore using the Resource Manager template

You can also restore an account using Resource Manager template. When defining the template include the following parameters:

* Set the `createMode` parameter to *Restore*
* Define the `restoreParameters`, notice that the `restoreSource` value is extracted from the output of the `az cosmosdb restorable-database-account list` command for your source account. The Instance ID attribute for your account name is used to do the restore.
* Set the `restoreMode` parameter to *PointInTime* and configure the `restoreTimestampInUtc` value.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "name": "vinhpitrarmrestore-kal3",
      "type": "Microsoft.DocumentDB/databaseAccounts",
      "apiVersion": "2016-03-31",
      "location": "West US",
      "properties": {
        "locations": [
          {
            "locationName": "West US"
          }
        ],
        "databaseAccountOfferType": "Standard",
        "createMode": "Restore",
        "restoreParameters": {
            "restoreSource": "/subscriptions/2296c272-5d55-40d9-bc05-4d56dc2d7588/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts/6a18ecb8-88c2-4005-8dce-07b44b9741df",
            "restoreMode": "PointInTime",
            "restoreTimestampInUtc": "6/24/2020 4:01:48 AM"
        }
      }
    }
  ]
}
```

Next deploy the template by using Azure PowerShell or CLI. The following example shows how to deploy the template with a CLI command:  

```azurecli-interactive
az group deployment create -g <ResourceGroup> --template-file <RestoreTemplateFilePath> 
```

## Next steps

* Provision continuous backup using [Azure portal](provision-account-continuous-backup.md#provision-portal), [PowerShell](provision-account-continuous-backup.md#provision-powershell), [CLI](provision-account-continuous-backup.md#provision-cli), or [Azure Resource Manager](provision-account-continuous-backup.md#provision-arm-template).
* [How to migrate to an account from periodic backup to continuous backup](migrate-continuous-backup.md).
* [Continuous backup mode resource model.](continuous-backup-restore-resource-model.md)
* [Manage permissions](continuous-backup-restore-permissions.md) required to restore data with continuous backup mode.
