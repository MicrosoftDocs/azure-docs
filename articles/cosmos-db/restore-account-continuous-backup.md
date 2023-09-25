---
title: Restore an Azure Cosmos DB account that uses continuous backup mode.
description: Learn how to identify the restore time and restore a live or deleted Azure Cosmos DB account. It shows how to use the event feed to identify the restore time and restore the account using Azure portal, PowerShell, CLI, or an Azure Resource Manager template.
author: kanshiG
ms.service: cosmos-db
ms.topic: how-to
ms.date: 03/31/2023
ms.author: govindk
ms.reviewer: mjbrown
ms.custom: devx-track-azurepowershell, devx-track-azurecli, ignite-2022, devx-track-arm-template
---

# Restore an Azure Cosmos DB account that uses continuous backup mode
[!INCLUDE[NoSQL, MongoDB, Gremlin, Table](includes/appliesto-nosql-mongodb-gremlin-table.md)]

Azure Cosmos DB's point-in-time restore feature helps you to recover from an accidental change within a container, to restore a deleted account, database, or a container or to restore into any region (where backups existed). The continuous backup mode allows you to do restore to any point of time within the last 30 days.

This article describes how to identify the restore time and restore a live or deleted Azure Cosmos DB account. It shows how to restore the account using the [Azure portal](#restore-account-portal), [PowerShell](#restore-account-powershell), [CLI](#restore-account-cli), or an [Azure Resource Manager template](#restore-arm-template).



## <a id="restore-account-portal"></a>Restore an account using Azure portal

### <a id="restore-live-account"></a>Restore a live account from accidental modification

You can use Azure portal to restore an entire live account or selected databases and containers under it. Use the following steps to restore your data:

1. Sign in to the [Azure portal](https://portal.azure.com).
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

Deleting source account while a restore is in-progress could result in failure of the restore.

### Restorable timestamp for live accounts

To restore Azure Cosmos DB live accounts that are not deleted, it is a best practice to always identify the [latest restorable timestamp](get-latest-restore-timestamp.md) for the container. You can then use this timestamp to restore the account to its latest version.

### <a id="event-feed"></a>Use event feed to identify the restore time

When filling out the restore point time in the Azure portal, if you need help with identifying restore point, select the **Click here** link, it takes you to the event feed blade. The event feed provides a full fidelity list of create, replace, delete events on databases and containers of the source account. 

For example, if you want to restore to the point before a certain container was deleted or updated, check this event feed. Events are displayed in chronologically descending order of time when they occurred, with recent events at the top. You can browse through the results and select the time before or after the event to further narrow your time.

:::image type="content" source="./media/restore-account-continuous-backup/event-feed-portal.png" alt-text="Use event feed to identify the restore point time." border="true" lightbox="./media/restore-account-continuous-backup/event-feed-portal.png":::

> [!NOTE]
> The event feed does not display the changes to the item resources. You can always manually specify any timestamp in the last 30 days (as long as account exists at that time) for restore.

### <a id="restore-deleted-account"></a>Restore a deleted account

You can use Azure portal to completely restore a deleted account within 30 days of its deletion. Use the following steps to restore a deleted account:

1. Sign in to the [Azure portal](https://portal.azure.com).
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

### <a id="get-the-restore-details-portal"></a>Get the restore details from the restored account

After the restore operation completes, you may want to know the source account details from which you restored or the restore time.

Use the following steps to get the restore details from Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to the restored account.

1. Navigate to the **Export template** pane. It opens a JSON template, corresponding to the restored account.

## <a id="restore-account-powershell"></a>Restore an account using Azure PowerShell

Before restoring the account, install the [latest version of Azure PowerShell](/powershell/azure/install-azure-powershell) or version higher than 9.6.0. Next connect to your Azure account and select the required subscription with the following commands:

1. Sign into Azure using the following command:

   ```azurepowershell
   Connect-AzAccount
   ```

1. Select a specific subscription with the following command:

   ```azurepowershell
   Select-AzSubscription -Subscription <SubscriptionName>

### <a id="trigger-restore-ps"></a>Trigger a restore operation for API for NoSQL account

The following cmdlet is an example to trigger a restore operation with the restore command by using the target account, source account, location, resource group, PublicNetworkAccess and timestamp:

```azurepowershell

Restore-AzCosmosDBAccount `
  -TargetResourceGroupName "MyRG" `
  -TargetDatabaseAccountName "RestoredAccountName" `
  -SourceDatabaseAccountName "SourceDatabaseAccountName" `
  -RestoreTimestampInUtc "UTCTime" `
  -Location "AzureRegionName"
  -PublicNetworkAccess Disabled

```

**Example 1:** Restoring the entire account:

```azurepowershell

Restore-AzCosmosDBAccount `
  -TargetResourceGroupName "MyRG" `
  -TargetDatabaseAccountName "Pitracct" `
  -SourceDatabaseAccountName "source-sql" `
  -RestoreTimestampInUtc "2021-01-05T22:06:00" `
  -Location "West US"
  -PublicNetworkAccess Disabled

```
If `PublicNetworkAccess` is not set, restored account is accessible from public network, please ensure to pass Disabled to the `PublicNetworkAccess` option to disable public network access for restored account.

> [!NOTE]
> For restoring with public network access disabled, you'll need to install the preview of powershell module of CosmosDB by executing `Install-Module -Name Az.CosmosDB -AllowPrerelease`. You would also require version 5.1 of the Powershell.

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
**Example 3:** Restoring API for Gremlin Account. This example restores the graphs *graph1*, *graph2* from *MyDB1* and the entire database *MyDB2*, which, includes all the containers under it.

```azurepowershell
$datatabaseToRestore1 = New-AzCosmosDBGremlinDatabaseToRestore  -DatabaseName "MyDB1" -GraphName "graph1", "graph2"  
$datatabaseToRestore2 = New-AzCosmosDBGremlinDatabaseToRestore  -DatabaseName "MyDB2"

Restore-AzCosmosDBAccount `
  -TargetResourceGroupName "MyRG" `
  -TargetDatabaseAccountName "Pitracct" `
  -SourceDatabaseAccountName "SourceGremlin" `
  -RestoreTimestampInUtc "2022-04-05T22:06:00" `
  -DatabasesToRestore $datatabaseToRestore1, $datatabaseToRestore2 `
  -Location "West US"

```

**Example 4:** Restoring API for Table Account. This example restores the tables *table1*, *table1* from *MyDB1* 

```azurepowershell
$tablesToRestore  = New-AzCosmosDBTableToRestore -TableName "table1", "table2"  

Restore-AzCosmosDBAccount `
  -TargetResourceGroupName "MyRG" `
  -TargetDatabaseAccountName "Pitracct" `
  -SourceDatabaseAccountName "SourceTable" `
  -RestoreTimestampInUtc "2022-04-06T22:06:00" `
  -TablesToRestore $tablesToRestore
  -Location "West US"
```
### To restore a continuous account that is configured with managed identity using CLI

To restore Customer Managed Key (CMK) continuous account, please refer to the steps provided [here](./how-to-setup-customer-managed-keys.md)

### <a id="get-the-restore-details-powershell"></a>Get the restore details from the restored account

Import the `Az.CosmosDB` module version 1.12.0 and run the following command to get the restore details. The restoreTimestamp will be under the restoreParameters object:

```azurepowershell
Get-AzCosmosDBAccount -ResourceGroupName MyResourceGroup -Name MyCosmosDBDatabaseAccount 
```

### <a id="enumerate-sql-api"></a>Enumerate restorable resources for API for NoSQL

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

The enumeration commands described below help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account, database, and container resources. These commands only work for live accounts and they are similar to API for NoSQL commands but with `MongoDB` in the command name instead of `sql`.

#### List all the versions of MongoDB databases in a live database account

```azurepowershell

Get-AzCosmosdbMongoDBRestorableDatabase `
  -DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" `
  -Location "West US"

```

#### List all the versions of MongoDB collections of a database in a live database account

```azurepowershell

Get-AzCosmosdbMongoDBRestorableCollection `
  -DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" `
  -DatabaseRId "AoQ13r==" `
  -Location "West US"
```

#### List all the resources of a MongoDB database account that are available to restore at a given timestamp and region

```azurepowershell

Get-AzCosmosdbMongoDBRestorableResource `
  -DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" `
  -Location "West US" `
  -RestoreLocation "West US" `
  -RestoreTimestamp "2020-07-20T16:09:53+0000"
```
### <a id="enumerate-gremlin-api-ps"></a>Enumerate restorable resources for API for Gremlin

The enumeration cmdlets help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account, database, and graph resources. 

#### List all the versions of Gremlin databases in a live database account 

Listing all the versions of databases allows you to choose the right database in a scenario where the actual time of existence of database is unknown. 
Run the following PowerShell command to list all the versions of databases. This command only works with live accounts. The `DatabaseAccountInstanceId` and the `Location` parameters are obtained from the `name` and `location` properties in the response of `Get-AzCosmosDBRestorableDatabaseAccount` cmdlet. The `DatabaseAccountInstanceId` attribute refers to `instanceId` property of source database account being restored:  

```azurepowershell
Get-AzCosmosdbGremlinRestorableDatabase ` 
   -Location "East US" ` 
   -DatabaseAccountInstanceId <DatabaseAccountInstanceId> 
```

#### List all the versions of Gremlin graphs of a database in a live database account 

Use the following command to list all the versions of API for Gremlin graphs. This command only works with live accounts. The `DatabaseRId` parameter is the `ResourceId` of the database you want to restore. It is the value of `ownerResourceid` attribute found in the response of `Get-AzCosmosdbGremlinRestorableDatabase` cmdlet. The response also includes a list of operations performed on all the graphs inside this database. 

```azurepowershell
Get-AzCosmosdbGremlinRestorableGraph ` 
   -DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" ` 
   -DatabaseRId "AoQ13r==" ` 
   -Location "West US" 
```
#### Find databases or graphs that can be restored at any given timestamp 

Use the following command to get the list of databases or graphs that can be restored at any given timestamp. This command only works with live accounts. 

```azurepowershell
Get-AzCosmosdbGremlinRestorableResource ` 
   -DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" ` 
   -Location "West US" ` 
   -RestoreLocation "East US" ` 
   -RestoreTimestamp "2020-07-20T16:09:53+0000" 
```

### <a id="enumerate-table-api-ps"></a>Enumerate restorable resources for API for Table

The enumeration cmdlets help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account and table resources.

#### List all the versions of tables of a database in a live database account 

Use the following command to list all the versions of tables. This command only works with live accounts. 

```azurepowershell
Get-AzCosmosdbTableRestorableTable ` 
   -DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68"   
   ` -Location "West US" 
```
#### Find tables that can be restored at any given timestamp 

Use the following command to get the list of tables that can be restored at any given timestamp. This command only works with live accounts. 

```azurepowershell
Get-AzCosmosdbTableRestorableResource ` 
   -DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" ` 
   -Location "West US" ` 
   -RestoreLocation "East US" ` 
   -RestoreTimestamp "2020-07-20T16:09:53+0000" 
```





## <a id="restore-account-cli"></a>Restore an account using Azure CLI

Before restoring the account, install Azure CLI with the following steps:

1. Install the latest version of Azure CLI

   * Install the latest version of [Azure CLI](/cli/azure/install-azure-cli) or version higher than 2.52.0.
   * If you have already installed CLI, run `az upgrade` command to update to the latest version. This command will only work with CLI version higher than 2.52.0. If you have an earlier version, use the above link to install the latest version.

1. Sign in and select your subscription

   * Sign in to your Azure account with `az login` command.
   * Select the required subscription using `az account set -s <subscriptionguid>` command.

### <a id="trigger-restore-cli"></a>Trigger a restore operation with Azure CLI

The simplest way to trigger a restore is by issuing the restore command with name of the target account, source account, location, resource group, timestamp (in UTC), and optionally the database and container names. The following are some examples to trigger the restore operation:

#### Create a new Azure Cosmos DB account by restoring from an existing account



```azurecli-interactive

az cosmosdb restore \
 --target-database-account-name <MyRestoredCosmosDBDatabaseAccount> \
 --account-name <MySourceAccount> \
 --restore-timestamp 2020-07-13T16:03:41+0000 \
 --resource-group <MyResourceGroup> \
 --location "West US" \
 --public-network-access Disabled

```

If `--public-network-access` is not set, restored account is accessible from public network. Please ensure to pass `Disabled` to the `--public-network-access` option to prevent public network access for restored account.

 > [!NOTE]
 > For restoring with public network access disabled, you'll need to install the cosmosdb-preview 0.23.0 of CLI extension   by executing `az extension update --name cosmosdb-preview `. You would also require version 2.17.1 of the CLI.





#### Create a new Azure Cosmos DB account by restoring only selected databases and containers from an existing database account

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
#### Create a new Azure Cosmos DB API for Gremlin account by restoring only selected databases and graphs from an existing API for Gremlin account

```azurecli-interactive

az cosmosdb restore \
 --resource-group MyResourceGroup \
 --target-database-account-name MyRestoredCosmosDBDatabaseAccount \
 --account-name MySourceAccount \
 --restore-timestamp 2022-04-13T16:03:41+0000 \
 --location "West US" \
 --gremlin-databases-to-restore name=MyDB1 graphs=graph1 graph2 \
 --gremlin-databases-to-restore name=MyDB2 graphs =graph3 graph4 
```

 #### Create a new Azure Cosmos DB API for Table account by restoring only selected tables from an existing API for Table account

```azurecli-interactive

az cosmosdb restore \
 --resource-group MyResourceGroup \
 --target-database-account-name MyRestoredCosmosDBDatabaseAccount \
 --account-name MySourceAccount \
 --restore-timestamp 2022-04-14T06:03:41+0000 \
 --location "West US" \
 --tables-to-restore table1 table2 
```

### <a id="get-the-restore-details-cli"></a>Get the restore details from the restored account

Run the following command to get the restore details. The `az cosmosdb show` command output shows the value of `createMode` property. If the value is set to **Restore**, it indicates that the account was restored from another account. The `restoreParameters` property has further details such as `restoreSource`, which has the source account ID. The last GUID in the `restoreSource` parameter is the `instanceId` of the source account. And the `restoreTimestamp` will be under the `restoreParameters` object:

```azurecli-interactive
az cosmosdb show --name MyCosmosDBDatabaseAccount --resource-group MyResourceGroup
```

### <a id="enumerate-sql-api-cli"></a>Enumerate restorable resources for API for NoSQL

The enumeration commands described below help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account, database, and container resources.

#### List all the accounts that can be restored in the current subscription

Run the following Azure CLI command to list all the accounts that can be restored in the current subscription

```azurecli-interactive
az cosmosdb restorable-database-account list --account-name "Pitracct"
```

The response includes all the database accounts (both live and deleted) that can be restored, and the regions that they can be restored from:

```json
{
    "accountName": "Pitracct",
    "apiType": "Sql",
    "creationTime": "2021-01-08T23:34:11.095870+00:00",
    "deletionTime": null,
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts/abcd1234-d1c0-4645-a699-abcd1234",
    "identity": null,
    "location": "West US",
    "name": "abcd1234-d1c0-4645-a699-abcd1234",
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

Run the following Azure CLI command to list all the versions of databases. This command only works with live accounts. The `instance-id` and the `location` parameters are obtained from the `name` and `location` properties in the response of `az cosmosdb restorable-database-account list` command. The `instanceId` attribute is also a property of source database account that is being restored:

```azurecli-interactive
az cosmosdb sql restorable-database list \
  --instance-id "abcd1234-d1c0-4645-a699-abcd1234" \
  --location "West US"
```

This command output now shows when a database was created and deleted.

```json
[
  {
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts/abcd1234-d1c0-4645-a699-abcd1234/restorableSqlDatabases/40e93dbd-2abe-4356-a31a-35567b777220",
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
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts/abcd1234-d1c0-4645-a699-abcd1234/restorableSqlDatabases/243c38cb-5c41-4931-8cfb-5948881a40ea",
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
    --instance-id "abcd1234-d1c0-4645-a699-abcd1234" \
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
  --instance-id "abcd1234-d1c0-4645-a699-abcd1234" \
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

### <a id="enumerate-mongodb-api-cli"></a>Enumerate restorable resources for API for MongoDB account

The enumeration commands described below help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account, database, and container resources. These commands only work for live accounts.

#### List all the versions of MongoDB databases in a live database account

```azurecli-interactive
az cosmosdb mongodb restorable-database list \
    --instance-id "abcd1234-d1c0-4645-a699-abcd1234" \
    --location "West US"
```

#### List all the versions of MongoDB collections of a database in a live database account

```azurecli-interactive
az cosmosdb mongodb restorable-collection list \
    --instance-id "abcd1234-d1c0-4645-a699-abcd1234" \
    --database-rid "AoQ13r==" \
    --location "West US"
```

#### List all the resources of a mongodb database account that are available to restore at a given timestamp and region

```azurecli-interactive
az cosmosdb mongodb restorable-resource list \
    --instance-id "abcd1234-d1c0-4645-a699-abcd1234" \
    --location "West US" \
    --restore-location "West US" \
    --restore-timestamp "2020-07-20T16:09:53+0000"
```











#### List all the versions of databases in a live database account
The enumeration commands described below help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account, database, and graph resources. These commands only work for live accounts.

```azurecli-interactive
az cosmosdb gremlin restorable-database list \ 
   --instance-id "abcd1234-d1c0-4645-a699-abcd1234" \ 
   --location "West US"
```

This command output now shows when a database was created and deleted. 
```
[ { 
    "id": "/subscriptions/abcd1234-b6ac-4328-a753-abcd1234/providers/Microsoft.DocumentDB/locations/eastus2euap/restorableDatabaseAccounts/abcd1234-4316-483b-8308-abcd1234/restorableGremlinDatabases/abcd1234-0e32-4036-ac9d-abcd1234", 
    "name": "abcd1234-0e32-4036-ac9d-abcd1234", 
    "resource": { 
      "eventTimestamp": "2022-02-09T17:10:18Z", 
      "operationType": "Create", 
      "ownerId": "db1", 
      "ownerResourceId": "1XUdAA==", 
      "rid": "ymn7kwAAAA==" 
    }, 
    "type": "Microsoft.DocumentDB/locations/restorableDatabaseAccounts/restorableGremlinDatabases" 
    
  } 
] 
```

#### List all the versions of Gremlin graphs of a database in a live database account 

```azurecli-interactive
az cosmosdb gremlin restorable-graph list \ 
   --instance-id "abcd1234-d1c0-4645-a699-abcd1234" \ 
   --database-rid "OIQ1AA==" \ 
   --location "West US" 
```

This command output shows includes list of operations performed on all the containers inside this database: 
```
[ { 

    "id": "/subscriptions/23587e98-b6ac-4328-a753-03bcd3c8e744/providers/Microsoft.DocumentDB/locations/eastus2euap/restorableDatabaseAccounts/a00d591d-4316-483b-8308-44193c5f3073/restorableGraphs/1792cead-4307-4032-860d-3fc30bd46a20", 
    "name": "1792cead-4307-4032-860d-3fc30bd46a20", 
    "resource": { 
      "eventTimestamp": "2022-02-09T17:10:31Z", 
      "operationType": "Create", 
      "ownerId": "graph1", 
      "ownerResourceId": "1XUdAPv9duQ=", 
      "rid": "IcWqcQAAAA==" 
    }, 
    "type": "Microsoft.DocumentDB/locations/restorableDatabaseAccounts/restorableGraphs" 
  } 
] 
```

#### Find databases or graphs that can be restored at any given timestamp 

```azurecli-interactive
 
az cosmosdb gremlin restorable-resource list \ 
   --instance-id "abcd1234-d1c0-4645-a699-abcd1234" \ 
   --location "West US" \ 
   --restore-location "West US" \ 
   --restore-timestamp "2021-01-10T01:00:00+0000" 
```
```
[   { 
```
"databaseName": "db1", 
"graphNames": [ 
  "graph1", 
  "graph3", 
  "graph2" 
] 
```
  } 
] 
```

### <a id="enumerate-table-api-cli"></a>Enumerate restorable resources for API for Table account

The enumeration commands described below help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account and API for Table resources. These commands only work for live accounts.

#### List all the versions of tables in a live database account

```azurecli-interactive
az cosmosdb table restorable-table list \ 
   --instance-id "abcd1234-d1c0-4645-a699-abcd1234"  
   --location "West US" 
```
```
[   { 
```
"id": "/subscriptions/23587e98-b6ac-4328-a753-03bcd3c8e744/providers/Microsoft.DocumentDB/locations/WestUS/restorableDatabaseAccounts/7e4d666a-c6ba-4e1f-a4b9-e92017c5e8df/restorableTables/59781d91-682b-4cc2-93a3-c25d03fab159", 
"name": "59781d91-682b-4cc2-93a3-c25d03fab159", 
"resource": { 
  "eventTimestamp": "2022-02-09T17:09:54Z", 
  "operationType": "Create", 
  "ownerId": "table1", 
  "ownerResourceId": "tOdDAKYiBhQ=", 
  "rid": "9pvDGwAAAA==" 
}, 
"type": "Microsoft.DocumentDB/locations/restorableDatabaseAccounts/restorableTables" 
```
  }, 
```
{"id": "/subscriptions/23587e98-b6ac-4328-a753-03bcd3c8e744/providers/Microsoft.DocumentDB/locations/eastus2euap/restorableDatabaseAccounts/7e4d666a-c6ba-4e1f-a4b9-e92017c5e8df/restorableTables/2c9f35eb-a14c-4ab5-a7e0-6326c4f6b785", 
"name": "2c9f35eb-a14c-4ab5-a7e0-6326c4f6b785", 
"resource": { 
  "eventTimestamp": "2022-02-09T20:47:53Z", 
  "operationType": "Create", 
  "ownerId": "table3", 
  "ownerResourceId": "tOdDALBwexw=", 
  "rid": "01DtkgAAAA==" 
}, 
"type": "Microsoft.DocumentDB/locations/restorableDatabaseAccounts/restorableTables" 
```
  }, 
] 
```

### List all the resources of a API for Table account that are available to restore at a given timestamp and region 

```azurecli-interactive
az cosmosdb table restorable-resource list \ 
   --instance-id "abcd1234-d1c0-4645-a699-abcd1234" \ 
   --location "West US" \ 
   --restore-location "West US" \ 
   --restore-timestamp "2020-07-20T16:09:53+0000" 
```
```
{   
  "tableNames": [ 
```
"table1", 
"table3", 
"table2" 
```
  ] 
} 
```

## <a id="restore-arm-template"></a>Restore using the Azure Resource Manager template

You can also restore an account using Azure Resource Manager (ARM) template. When defining the template, include the following parameters:

### Restore API for NoSQL or MongoDB account using ARM template

1. Set the `createMode` parameter to *Restore*.
1. Define the `restoreParameters`, notice that the `restoreSource` value is extracted from the output of the `az cosmosdb restorable-database-account list` command for your source account. The Instance ID attribute for your account name is used to do the restore.
1. Set the `restoreMode` parameter to *PointInTime* and configure the `restoreTimestampInUtc` value.

Use the following ARM template to restore an account for the Azure Cosmos DB API for NoSQL or MongoDB. Examples for other APIs are provided next.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "name": "vinhpitrarmrestore-kal3",
      "type": "Microsoft.DocumentDB/databaseAccounts",
      "apiVersion": "2023-04-15",
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

### Restore API for Gremlin account using ARM template

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "name": "ademo-pitr1",
      "type": "Microsoft.DocumentDB/databaseAccounts",
      "apiVersion": "2023-04-15",
      "location": "West US",
      "properties": {
        "locations": [
          {
            "locationName": "West US"
          }
        ],
        "backupPolicy": { 
          "type": "Continuous" 
        }, 
        "databaseAccountOfferType": "Standard",
        "createMode": "Restore",
        "restoreParameters": {
            "restoreSource": "/subscriptions/2296c272-5d55-40d9-bc05-4d56dc2d7588/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts/5cb9d82e-ec71-430b-b977-cd6641db85bc",
            "restoreMode": "PointInTime",
            "restoreTimestampInUtc": "2021-10-27T23:20:46Z",
            "gremlinDatabasesToRestore": [{ 
                "databaseName": "db1", 
                "graphNames": [ 
                    "graph1", "graph2" 
                ] 
            }]
        }
      }
    }
  ]
}
```

### Restore API for Table account using ARM template

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "name": "ademo-pitr1",
      "type": "Microsoft.DocumentDB/databaseAccounts",
      "apiVersion": "2023-04-15",
      "location": "West US",
      "properties": {
        "locations": [
          {
            "locationName": "West US"
          }
        ],
        "backupPolicy": { 
          "type": "Continuous" 
        }, 
        "databaseAccountOfferType": "Standard",
        "createMode": "Restore",
        "restoreParameters": {
            "restoreSource": "/subscriptions/1296c352-5d33-40d9-bc05-4d56dc2a7521/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts/4bcb9d82e-ec71-430b-b977-cd6641db85ad",
            "restoreMode": "PointInTime",
            "restoreTimestampInUtc": "2022-04-13T10:20:46Z",
             "tablesToRestore": [ 
                "table1", "table2" 
            ] 
        }
      }
    }
  ]
}
```

Next, deploy the template by using Azure PowerShell or Azure CLI. The following example shows how to deploy the template with an Azure CLI command:  

```azurecli-interactive
az deployment group create -g <ResourceGroup> --template-file <RestoreTemplateFilePath> 
```

## Next steps

* Provision continuous backup using the [Azure portal](provision-account-continuous-backup.md#provision-portal), [PowerShell](provision-account-continuous-backup.md#provision-powershell), [CLI](provision-account-continuous-backup.md#provision-cli), or [Azure Resource Manager](provision-account-continuous-backup.md#provision-arm-template).
* [How to migrate to an account from periodic backup to continuous backup](migrate-continuous-backup.md).
* [Continuous backup mode resource model.](continuous-backup-restore-resource-model.md)
* [Manage permissions](continuous-backup-restore-permissions.md) required to restore data with continuous backup mode.

