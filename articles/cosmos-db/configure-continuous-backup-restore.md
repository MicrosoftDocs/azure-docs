---
title: Configure Azure Cosmos DB account with periodic backup 
description: 
author: kanshiG
ms.service: cosmos-db
ms.topic: how-to
ms.date: 10/13/2020
ms.author: govindk
ms.reviewer: sngun

---

## Configure Cosmos DB data with continuous backup and point in time restore

## Configure continuous backup using Azure portal

### Provision an account with continuous backup

When creating a new Azure Cosmos DB account, for the **Backup policy** option, choose **continuous** mode to enable the point in time restore functionality for the new account. After this feature is enabled for the account, all the databases and containers are available for continuous backup. With the point-in-time restore, data is always restored to a new account, currently you can't restore to an existing account.

:::image type="content" source="./media//configure-continuous-backup-portal.png" alt-text="Provision an Azure Cosmos DB account with continuous backup configuration" border="false":::

## Restore a live account from accidental modification

You can use Azure portal to restore a live account or selected databases and containers under it. Use the following steps to restore your data:

1. Sign into the [Azure portal](https://portal.azure.com/)
1. Navigate to your Azure Cosmos DB account and open the **Point In Time Restore** pane.

   > [!NOTE]
   > The restore pane in Azure portal is only populated if you have the `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read` permission.

1. You need to fill the following details to restore:

   * **Restore Point (UTC)** – A timestamp within the last 30 days. The account should exist at that timestamp. You can specify the restore point in UTC. It can be as close to the second when you want to restore it. Select the **Click here** link to get help on [identifying the restore point]().

   * **Location** – The destination region where the account is restored. The account should exist in this region at the given timestamp. Example West US or East US. An account can be restored only to the regions in which the source account existed.

   * **Restore Resource** – You can either choose **Entire account** or a **selected database/container** to restore. The databases and containers should exist at the given timestamp. Based on the restore point and location selected, restore resources are populated, which allows user to select specific databases or containers that need to be restored.

   * **Resource group** - Resource group under which the target account will be created and restored. This must be an existing resource group.

   * **Restore Target Account** – The target account name. The target account name needs to follow same guidelines as when you are creating a new account. This account will be created by the restore process in the same region where your source account exists.
 
   :::image type="content" source="./media//restore-live-account-portal.png" alt-text="Restore a live account from accidental modification Azure portal" border="false":::

1. After you select the the above parameters, select the **Submit** button to kick off a restore. The restore cost is a one time charge which is based on the amount of data and charges for the storage in given region. To learn more, see the [Pricing]() section.

## Use event feed to identify the restore time

When filling out the restore point time in the Azure portal, if you need help with identifying restore point, select the **click here** link, it takes you to the event feed blade. The event feed provides a full fidelity list of create, replace, delete events on databases and containers of the source account. This feed helps you to identify the restore timestamp in scenarios where database or container has been deleted or its properties are updated around when data was accidentally changed or deleted.

For example, if you want to restore to the point before a certain container was deleted or updated, check this event feed. Event are displayed in chronologically descending order of time when they occurred, with recent events at the top. You can browse through the results and select the time before or after the event to further narrow your time.

:::image type="content" source="./media//event-feed-portal.png" alt-text="Use event feed to identify the restore point time" border="false":::

> [!NOTE]
> The event feed does not display the changes to the item resources. You can always manually specify any timestamp in the last 30 days (as long as account exists at that time) for restore.

## Restore a deleted account

You can use Azure portal to completely restore a deleted account within 30 days of its deletion. Use the following steps to restore a deleted account:

1. Sign into the [Azure portal](https://portal.azure.com/)
1. Search for "Azure Cosmos DB" resources in the global search bar. It lists all your existing accounts.
1. Next select the **Restore** button. The Restore pane displays a list of deleted accounts that can be restored within the retention period, which is 30 days from deletion time.
1. Choose the account that you want to restore.

   :::image type="content" source="./media//restore-deleted-account-portal.png" alt-text="Restore a deleted account from Azure portal" border="false":::

   > [!NOTE]
   > Note: The restore pane in Azure portal is only populated if you have the `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read` permission.

1. Select an account to restore and input the following details to restore a deleted account:

   * **Restore Point (UTC)** – A timestamp within the last 30 days. The account should have existed at that timestamp. You must specify the restore point in UTC. It can be as close to the second when you want to restore it.

   * **Location** – The destination region where the account needs to be restored. The source account should exist in this region at the given timestamp. Example West US or East US.  

   * **Resource group** - Resource group under which the target account will be created and restored. This must be an existing resource group.

   * **Restore Target Account** – The target account name needs to follow same guidelines as when you are creating a new account. This account will be created by the restore process in the same region where your source account exists.

## <a id="track-restore-status"></a>Track the status of account being restored

After initiating a restore operation, select the **Notification** bell icon at top right corner of portal. It gives a link displaying the status of the account being restored. While restore is in progress, the status of the account will be "Creating", after the restore operation completes, the account status will change to "Online".

:::image type="content" source="./media//track-restore-operation-status.png" alt-text="The status of restored account changes from creating to online when the operation is complete" border="false":::

## Configure continuous backup using Azure CLI

### Installation

1. Install the latest version of Azure CLI

   * Install the latest version of [Azure CLI](/cli/azure/install-azure-cli) or version higher than 2.17.1.
   * If you have already installed CLI, run `az upgrade` command to update to the latest version. This command will only work with cli version higher than 2.11. If you have an earlier version, use the above link to install the latest version.

1. Install the `cosmosdb-preview` cli extension.

   * The point in time restore commands are available under `cosmosdb-preview` extension.
   * You can install this extension by running the following command:
     `az extension add --name cosmosdb-preview`
   * You can uninstall this extension by running the following command:
     `az extension remove --name cosmosdb-preview`

1. Sign in and select your subscription

   * Sign into your Azure account with `az login` command.
   * Select the required subscription using `az account set -s <subscriptionguid>` command.

### Provision a SQL API account with continuous backup

To provision a SQL API account with continuous backup, an additional argument `--backup-policy-type Continuous` should be passed along with the regular provisioning command. The following is an example of a single region write account named `pitracct2` with continuous backup policy created in the "West US" region under "gskrg" resource group:

```azurecli-interactive

az cosmosdb create \
--name pitracct2 \
--resource-group gskrg \		
--backup-policy-type Continuous \
--default-consistency-level Session \
--locations regionName="West US"

```

### Provision a Azure Cosmos DB API for MongoDB account with continuous backup

The following is an example of a single region write account named `pitracct3` with continuous backup policy created the "West US" region under "gskrg" resource group:

```azurecli-interactive

az cosmosdb create \
--name pitracct3 \
--kind MongoDB \
--resource-group gskrg \
--server-version "3.6" \
--backup-policy-type Continuous \
--default-consistency-level Session \
--locations regionName="West US"

```

## Trigger a restore operation with CLI

The simplest way to trigger a restore is by issuing the restore command with name of the target account, source account, location, resource group, timestamp (in UTC) and optionally the database and container names. The following are some examples to trigger the restore operation:

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
    --databases-to-restore name=MyDB1 collections=collection1 collection2 \
    --databases-to-restore name=MyDB2 collections=collection3 collection4

   ```

### Enumerate restorable resources for SQL API

The enumeration commands described below help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account, database, and container resources.

**List all the accounts that can be restored in the current subscription**

Run the following cli command to list all the accounts that can be restored in the current subscription

```azurecli-interactive
az cosmosdb restorable-database-account list --name <Your_Accountname>
```

The response includes all the database accounts (both live and deleted) that can be restored and the regions that they can be restored from:

```json
{
    "accountName": "pitrbb-ps-1",
    "apiType": "Sql",
    "creationTime": "2021-01-08T23:34:11.095870+00:00",
    "deletionTime": null,
    "id": "/subscriptions/259fbb24-9bcd-4cfc-865c-fc33b22fe38a/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts/7133a59a-d1c0-4645-a699-6e296d6ac865",
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

Just like the "CreationTime" or "DeletionTime" for the account, there is a "CreationTime" or "DeletionTime" for the region too. These times allow you to choose the right region and a valid time range to restore into that region.

**List all the versions of databases in a live database account**

Listing all the versions of databases allows you to choose the right database in a scenario where the actual time of existence of database is unknown.

Run the following cli command to list all the versions of databases. This command only works with live accounts. The "instanceId" and the "location" parameters are obtained from the "name" and "location" properties in the response of `az cosmosdb restorable-database-account list` command. The instanceId attribute is also a property of source database account that is being restored:

```azurecli-interactive
az cosmosdb sql restorable-database list \
  --instance-id "<Your_InstanceID>" \
  --location "West US"
```

This command output now shows when a database was created and deleted.

```json
[
  {
    "id": "/subscriptions/259fbb24-9bcd-4cfc-865c-fc33b22fe38a/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts/7133a59a-d1c0-4645-a699-6e296d6ac865/restorableSqlDatabases/40e93dbd-2abe-4356-a31a-35567b777220",
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
    "id": "/subscriptions/259fbb24-9bcd-4cfc-865c-fc33b22fe38a/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts/7133a59a-d1c0-4645-a699-6e296d6ac865/restorableSqlDatabases/243c38cb-5c41-4931-8cfb-5948881a40ea",
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

**List all the versions of SQL containers of a database in a live database account**

Use the following command to list all the versions of SQL containers. This command only works with live accounts. The "databaseRid" parameter is the "ResourceId" of the database you want to restore. It is the value of "ownerResourceid" attribute found in the response of `az cosmosdb sql restorable-database list` command.

```azurecli-interactive
az cosmosdb sql restorable-container list \
    --instance-id "<Your_InstanceID>" \
    --database-rid "<database rid>"
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
  }
]
```

**Find databases or containers that can be restored at any given timestamp**

Use the following command to get the list of databases or containers that can can be restored at any given timestamp. This command only works with live accounts.

```azurecli-interactive

az cosmosdb sql restorable-resource list \
  --instance-id "<Your_InstanceID>" \
  --location "West US" \
  --restore-location "West US" \  
  --restore-timestamp "2021-01-10 T01:00:00+0000"

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
```

### Enumerate restorable resources for MongoDB API account 

The enumeration commands described below help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account, database, and container resources. Like with SQL API, you can use the `az cosmosdb` command but with "mongodb" as parameter instead of "sql". These commands only work for live accounts.

**List all the versions of mongodb databases in a live database account**

az cosmosdb mongodb restorable-database list \
    --instance-id "<Your_InstanceID>" \
    --location "West US"

**List all the versions of mongodb collections of a database in a live database account**

az cosmosdb mongodb restorable-collection list \
    --instance-id "<Your_InstanceID>" \
    --database-rid "AoQ13r=="
    --location "West US"

**List all the resources of a mongodb database account that are available to restore at a given timestamp and region**

az cosmosdb mongodb restorable-resource list \
    --instance-id "<Your_InstanceID>" \
    --location "West US" \
    --restore-location "West US" \
    --restore-timestamp "2020-07-20T16:09:53+0000"

## Configure continuous backup using Azure PowerShell

### Installation

1. Run the following command from Azure PowerShell to install the `Az.CosmosDB` preview module which contains the commands related to point in time restore:

   ```azurepowershell-interactive
   Install-Module -Name Az.CosmosDB -AllowPrerelease
   ```

1. After installing the modules, login to azure using

   ```azurepowershell-interactive
   Connect-AzAccount
   ```

1. Select a specific subscription with the following command:

   ```azurepowershell-interactive
   Select-AzSubscription -Subscription <SubscriptionName>
   ```

### Provision a SQL API account with continuous backup

To provision an account with continuous backup, add an argument `-BackupPolicyType Continuous` along with the regular provisioning command.

The following is an example of a single region write account `pitracct2` with continuous backup policy created in "West US" region under "gskrg" resource group:

```azurepowershell-interactive

New-AzCosmosDBAccount `
   -ResourceGroupName "gskrg" `
   -LocationObject "West US" `
	-BackupPolicyType Continuous `
   -Name "pitracct2" `
   -ApiKind "Sql" `
    	  
```

### Provision a MongoDB API account with continuous backup

The following is an example of continuous backup account "pitracct2" created in "West US" region under "gskrg" resource group:

```azurepowershell-interactive

New-AzCosmosDBAccount `
   -ResourceGroupName "gskrg" `
   -LocationObject "West US" `
	-BackupPolicyType Continuous `
   -Name "pitracct3" `
   -ApiKind "MongoDB" `
	-MongoDBServerVersion "3.6" `

```

### Trigger a restore operation

The following is an example to trigger a restore operation with the restore command by using the target account, source account, location, resource group, and timestamp:

```azurepowershell-interactive

Restore-AzCosmosDBAccount `
  - TargetResourceGroupName <resourceGroupName> `
  -TargetDatabaseAccountName <restored-account-name> `
  -SourceDatabaseAccountName <sourceDatabaseAccountName> `
  -RestoreTimestampInUtc <UTC time> `
  -Location <Azure Region Name> 

```

**Example 1:** Restoring the entire account:

```azurepowershell-interactive

Restore-AzCosmosDBAccount `
-TargetResourceGroupName "rg" ``
-TargetDatabaseAccountName "pitrbb -ps-1" `
-SourceDatabaseAccountName "source-sql" `
-RestoreTimestampInUtc "2021-01-05T22:06:00" `
-Location "West US"

```

**Example 2:** Restoring specific collections and databases. This example restores the collections myCol1, myCol2 from myDB1 and the entire database myDB2 which, includes all the containers under it.

```azurepowershell-interactive
$datatabaseToRestore1 = New-AzCosmosDBDatabaseToRestore -DatabaseName "myDB1" -CollectionName "myCol1", "myCol2"
$datatabaseToRestore2 = New-AzCosmosDBDatabaseToRestore -DatabaseName "myDB2"

Restore-AzCosmosDBAccount `
-TargetResourceGroupName "rg" `
-TargetDatabaseAccountName "pitrbb-ps-1" `
-SourceDatabaseAccountName "source-sql" `
-RestoreTimestampInUtc "2021-01-05T22:06:00" -Location "West US" `
-DatabasesToRestore $datatabaseToRestore1, $datatabaseToRestore2 `
-Location "West US"

```

### Enumerate restorable resources for SQL API

The enumeration cmdlets help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account, database and container resources.

**List all the accounts that can be restored in the current subscription**

Run the `Get-AzCosmosDBRestorableDatabaseAccount` PowerShell command to list all the accounts that can be restored in the current subscription.

The response includes all the database accounts (both live and deleted) that can be restored and the regions that they can be restored from.

```json
{
    "accountName": "sampleaccount",
    "apiType": "Sql",
    "creationTime": "2020-08-08T01:04:52.070190+00:00",
    "deletionTime": null,
    "id": "/subscriptions/259fbb24-9bcd-4cfc-865c-fc33b22fe38a/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts/23e99a35-cd36-4df4-9614-f767a03b9995",
    "identity": null,
    "location": "West US",
    "name": "23e99a35-cd36-4df4-9614-f767a03b9995",
    "restorableLocations": [
      {
        "creationTime": "2020-08-08T01:04:52.945185+00:00",
        "deletionTime": null,
        "locationName": "West US",
        "regionalDatabaseAccountInstanceId": "30701557-ecf8-43ce-8810-2c8be01dccf9"
      },
      {
        "creationTime": "2020-08-08T01:15:43.507795+00:00",
        "deletionTime": null,
        "locationName": "East US",
        "regionalDatabaseAccountInstanceId": "8283b088-b67d-4975-bfbe-0705e3e7a599"
      }
    ],
    "tags": null,
    "type": "Microsoft.DocumentDB/locations/restorableDatabaseAccounts"
  },
```

Just like the "CreationTime" or "DeletionTime" for the account, there is a "CreationTime" or "DeletionTime" for the region too. These times allow you to choose the right region and a valid time range to restore into that region.

**List all the versions of SQL databases in a live database account**

Listing all the versions of databases allows you to choose the right database in a scenario where the actual time of existence of database is unknown.

Run the following PowerShell command to list all the versions of databases. This command only works with live accounts. The "DatabaseAccountInstanceId" and the "LocationName" parameters are obtained from the "name" and "location" properties in the response of `Get-AzCosmosDBRestorableDatabaseAccount` cmdlet. The "DatabaseAccountInstanceId" attribute refers to "instanceId" property of source database account being restored:


```azurepowershell-interactive

Get-AzCosmosdbSqlRestorableDatabase `
		-LocationName "East US" `
		-DatabaseAccountInstanceId `

```

**List all the versions of SQL containers of a database in a live database account.**

Use the following command to list all the versions of SQL containers. This command only works with live accounts. The "DatabaseRid" parameter is the "ResourceId" of the database you want to restore. It is the value of "ownerResourceid" attribute found in the response of `Get-AzCosmosdbSqlRestorableDatabase` cmdlet. The response also includes a list of operations performed on all the containers inside this database.

```azurepowershell-interactive

Get-AzCosmosdbSqlRestorableContainer `
-DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" `
-DatabaseRid "AoQ13r==" `
-LocationName "West US" `

```

**Find databases or containers that can be restored at any given timestamp**

Use the following command to get the list of databases or containers that can can be restored at any given timestamp. This command only works with live accounts.

```azurepowershell-interactive

Get-AzCosmosdbSqlRestorableResource `
-DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" `
-LocationName "West US" `
-RestoreLocation "eastus" `
-RestoreTimestamp "2020-07-20T16:09:53+0000"

```

### Enumerate restorable resources for MongoDB

The enumeration commands described below help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account, database, and container resources. These commands only work for live accounts and they are similar to SQL API commands but with "MongoDB" in the command name instead of "sql".

**List all the versions of MongoDB databases in a live database account**

```azurepowershell-interactive

Get-AzCosmosdbMongoDBRestorableDatabase `
-DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" `
-LocationName "West US"

```

**List all the versions of mongodb collections of a database in a live database account**

```azurepowershell-interactive

Get-AzCosmosdbMongoDBRestorableCollection `
-DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" `
-DatabaseRid "AoQ13r==" `
-LocationName "West US"
```

**List all the resources of a mongodb database account that are available to restore at a given timestamp and region**

```azurepowershell-interactive

Get-AzCosmosdbMongoDBRestorableResource `
-DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" `
-LocationName "West US" `
-RestoreLocation "West US" `
-RestoreTimestamp "2020-07-20T16:09:53+0000"
```

## Configure continuous backup using ARM template

### Provision an account with continuous backup

You can use Azure ARM templates to deploy an Azure Cosmos DB account with continuous mode. When defining the template to provision an account, include the "backupPolicy" parameter as shown in the following example:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "name": "ademo-pitr1",
      "type": "Microsoft.DocumentDB/databaseAccounts",
      "apiVersion": "2016-03-31",
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
        "databaseAccountOfferType": "Standard"
      }
    }
  ]
}
```

Next deploy the template by using Azure PowerShell or CLI. The following example shows how to deploy the template with a CLI command:

```azurecli-interactive
az group deployment create -g <ResourceGroup> --template-file <ProvisionTemplateFilePath>
```

## Restore using the ARM template

You can also restore an account using ARM template. When defining the template include the following parameters:

* Set the "createMode" parameter to "Restore"
* Define the "restoreParameters", notice that the "restoreSource" value is extracted from the output of the `az cosmosdb restorable-database-account list` command for your source account. The Instance ID attribute for your account name is used to do the restore.
* Set the "restoreMode" parameter to "PointInTime" and configure the "restoreTimestampInUtc" value.

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