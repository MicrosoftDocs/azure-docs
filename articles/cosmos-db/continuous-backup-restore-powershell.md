---
title: Use Azure PowerShell to configure continuous backup and point in time restore in Azure Cosmos DB.
description: Learn how to provision an account with continuous backup and restore data using Azure PowerShell. 
author: kanshiG
ms.service: cosmos-db
ms.topic: how-to
ms.date: 02/01/2021
ms.author: govindk
ms.reviewer: sngun

---

# Configure and manage continuous backup and point in time restore (Preview) - using Azure PowerShell
[!INCLUDE[appliesto-sql-mongodb-api](includes/appliesto-sql-mongodb-api.md)]

> [!IMPORTANT]
> The point-in-time restore feature(continuous backup mode) for Azure Cosmos DB is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Cosmos DB's point-in-time restore feature(Preview) helps you to recover from an accidental change within a container, to restore a deleted account, database, or a container or to restore into any region (where backups existed). The continuous backup mode allows you to do restore to any point of time within the last 30 days.

This article describes how to provision an account with continuous backup and restore data using Azure PowerShell.

## <a id="install-powershell"></a>Install Azure PowerShell

1. Run the following command from Azure PowerShell to install the `Az.CosmosDB` preview module, which contains the commands related to point in time restore:

   ```azurepowershell
   Install-Module -Name Az.CosmosDB -AllowPrerelease
   ```

1. After installing the modules, log in to Azure using

   ```azurepowershell
   Connect-AzAccount
   ```

1. Select a specific subscription with the following command:

   ```azurepowershell
   Select-AzSubscription -Subscription <SubscriptionName>
   ```

## <a id="provision-sql-api"></a>Provision a SQL API account with continuous backup

To provision an account with continuous backup, add an argument `-BackupPolicyType Continuous` along with the regular provisioning command.

The following cmdlet is an example of a single region write account `pitracct2` with continuous backup policy created in *West US* region under *myrg* resource group:

```azurepowershell

New-AzCosmosDBAccount `
  -ResourceGroupName "myrg" `
  -Location "West US" `
  -BackupPolicyType Continuous `
  -Name "pitracct2" `
  -ApiKind "Sql"
   	  
```

## <a id="provision-mongodb-api"></a>Provision a MongoDB API account with continuous backup

The following cmdlet is an example of continuous backup account *pitracct2* created in *West US* region under *myrg* resource group:

```azurepowershell

New-AzCosmosDBAccount `
  -ResourceGroupName "myrg" `
  -Location "West US" `
  -BackupPolicyType Continuous `
  -Name "pitracct3" `
  -ApiKind "MongoDB" `
  -ServerVersion "3.6"

```

## <a id="trigger-restore"></a>Trigger a restore operation

The following cmdlet is an example to trigger a restore operation with the restore command by using the target account, source account, location, resource group, and timestamp:

```azurepowershell

Restore-AzCosmosDBAccount `
  -TargetResourceGroupName <resourceGroupName> `
  -TargetDatabaseAccountName <restored-account-name> `
  -SourceDatabaseAccountName <sourceDatabaseAccountName> `
  -RestoreTimestampInUtc <UTC time> `
  -Location <Azure Region Name>

```

**Example 1:** Restoring the entire account:

```azurepowershell

Restore-AzCosmosDBAccount `
  -TargetResourceGroupName "rg" `
  -TargetDatabaseAccountName "pitrbb-ps-1" `
  -SourceDatabaseAccountName "source-sql" `
  -RestoreTimestampInUtc "2021-01-05T22:06:00" `
  -Location "West US"

```

**Example 2:** Restoring specific collections and databases. This example restores the collections myCol1, myCol2 from myDB1 and the entire database myDB2, which, includes all the containers under it.

```azurepowershell
$datatabaseToRestore1 = New-AzCosmosDBDatabaseToRestore -DatabaseName "myDB1" -CollectionName "myCol1", "myCol2"
$datatabaseToRestore2 = New-AzCosmosDBDatabaseToRestore -DatabaseName "myDB2"

Restore-AzCosmosDBAccount `
  -TargetResourceGroupName "rg" `
  -TargetDatabaseAccountName "pitrbb-ps-1" `
  -SourceDatabaseAccountName "source-sql" `
  -RestoreTimestampInUtc "2021-01-05T22:06:00" `
  -DatabasesToRestore $datatabaseToRestore1, $datatabaseToRestore2 `
  -Location "West US"

```

## <a id="enumerate-sql-api"></a>Enumerate restorable resources for SQL API

The enumeration cmdlets help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account, database, and container resources.

**List all the accounts that can be restored in the current subscription**

Run the `Get-AzCosmosDBRestorableDatabaseAccount` PowerShell command to list all the accounts that can be restored in the current subscription.

The response includes all the database accounts (both live and deleted) that can be restored and the regions that they can be restored from.

```console
{
    "accountName": "sampleaccount",
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

Just like the `CreationTime` or `DeletionTime` for the account, there is a `CreationTime` or `DeletionTime` for the region too. These times allow you to choose the right region and a valid time range to restore into that region.

**List all the versions of SQL databases in a live database account**

Listing all the versions of databases allows you to choose the right database in a scenario where the actual time of existence of database is unknown.

Run the following PowerShell command to list all the versions of databases. This command only works with live accounts. The `DatabaseAccountInstanceId` and the `LocationName` parameters are obtained from the `name` and `location` properties in the response of `Get-AzCosmosDBRestorableDatabaseAccount` cmdlet. The `DatabaseAccountInstanceId` attribute refers to `instanceId` property of source database account being restored:


```azurepowershell

Get-AzCosmosdbSqlRestorableDatabase `
  -LocationName "East US" `
  -DatabaseAccountInstanceId <DatabaseAccountInstanceId>

```

**List all the versions of SQL containers of a database in a live database account.**

Use the following command to list all the versions of SQL containers. This command only works with live accounts. The `DatabaseRid` parameter is the `ResourceId` of the database you want to restore. It is the value of `ownerResourceid` attribute found in the response of `Get-AzCosmosdbSqlRestorableDatabase` cmdlet. The response also includes a list of operations performed on all the containers inside this database.

```azurepowershell

Get-AzCosmosdbSqlRestorableContainer `
  -DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" `
  -DatabaseRid "AoQ13r==" `
  -LocationName "West US"

```

**Find databases or containers that can be restored at any given timestamp**

Use the following command to get the list of databases or containers that can be restored at any given timestamp. This command only works with live accounts.

```azurepowershell

Get-AzCosmosdbSqlRestorableResource `
  -DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" `
  -LocationName "West US" `
  -RestoreLocation "East US" `
  -RestoreTimestamp "2020-07-20T16:09:53+0000"

```

## <a id="enumerate-mongodb-api"></a>Enumerate restorable resources for MongoDB

The enumeration commands described below help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account, database, and container resources. These commands only work for live accounts and they are similar to SQL API commands but with `MongoDB` in the command name instead of `sql`.

**List all the versions of MongoDB databases in a live database account**

```azurepowershell

Get-AzCosmosdbMongoDBRestorableDatabase `
  -DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" `
  -LocationName "West US"

```

**List all the versions of mongodb collections of a database in a live database account**

```azurepowershell

Get-AzCosmosdbMongoDBRestorableCollection `
  -DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" `
  -DatabaseRid "AoQ13r==" `
  -LocationName "West US"
```

**List all the resources of a mongodb database account that are available to restore at a given timestamp and region**

```azurepowershell

Get-AzCosmosdbMongoDBRestorableResource `
  -DatabaseAccountInstanceId "d056a4f8-044a-436f-80c8-cd3edbc94c68" `
  -LocationName "West US" `
  -RestoreLocation "West US" `
  -RestoreTimestamp "2020-07-20T16:09:53+0000"
```

## Next steps

* Configure and manage continuous backup using [Azure CLI](continuous-backup-restore-command-line.md), [Resource Manager](continuous-backup-restore-template.md), or [Azure portal](continuous-backup-restore-portal.md).
* [Resource model of continuous backup mode](continuous-backup-restore-resource-model.md)
* [Manage permissions](continuous-backup-restore-permissions.md) required to restore data with continuous backup mode.
