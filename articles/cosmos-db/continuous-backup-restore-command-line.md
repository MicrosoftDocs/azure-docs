---
title: Use Azure CLI to configure continuous backup and point in time restore in Azure Cosmos DB.
description: Learn how to provision an account with continuous backup and restore data using Azure CLI.
author: kanshiG
ms.service: cosmos-db
ms.topic: how-to
ms.date: 02/01/2021
ms.author: govindk
ms.reviewer: sngun

---

# Configure and manage continuous backup and point in time restore (Preview) - using Azure CLI
[!INCLUDE[appliesto-sql-mongodb-api](includes/appliesto-sql-mongodb-api.md)]

> [!IMPORTANT]
> The point-in-time restore feature(continuous backup mode) for Azure Cosmos DB is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Cosmos DB's point-in-time restore feature(Preview) helps you to recover from an accidental change within a container, to restore a deleted account, database, or a container or to restore into any region (where backups existed). The continuous backup mode allows you to do restore to any point of time within the last 30 days.

This article describes how to provision an account with continuous backup and restore data using Azure CLI.

## <a id="install"></a>Install Azure CLI

1. Install the latest version of Azure CLI

   * Install the latest version of [Azure CLI](/cli/azure/install-azure-cli) or version higher than 2.17.1.
   * If you have already installed CLI, run `az upgrade` command to update to the latest version. This command will only work with CLI version higher than 2.11. If you have an earlier version, use the above link to install the latest version.

1. Install the `cosmosdb-preview` CLI extension.

   * The point-in-time restore commands are available under `cosmosdb-preview` extension.
   * You can install this extension by running the following command:
     `az extension add --name cosmosdb-preview`
   * You can uninstall this extension by running the following command:
     `az extension remove --name cosmosdb-preview`

1. Sign in and select your subscription

   * Sign into your Azure account with `az login` command.
   * Select the required subscription using `az account set -s <subscriptionguid>` command.

## <a id="provision-sql-api"></a>Provision a SQL API account with continuous backup

To provision a SQL API account with continuous backup, an extra argument `--backup-policy-type Continuous` should be passed along with the regular provisioning command. The following command is an example of a single region write account named `pitracct2` with continuous backup policy created in the *West US* region under *myrg* resource group:

```azurecli-interactive

az cosmosdb create \
  --name pitracct2 \
  --resource-group myrg \
  --backup-policy-type Continuous \
  --default-consistency-level Session \
  --locations regionName="West US"

```

## <a id="provision-mongo-api"></a>Provision an Azure Cosmos DB API for MongoDB account with continuous backup

The following command shows an example of a single region write account named `pitracct3` with continuous backup policy created the *West US* region under *myrg* resource group:

```azurecli-interactive

az cosmosdb create \
  --name pitracct3 \
  --kind MongoDB \
  --resource-group myrg \
  --server-version "3.6" \
  --backup-policy-type Continuous \
  --default-consistency-level Session \
  --locations regionName="West US"

```

## <a id="trigger-restore"></a>Trigger a restore operation with CLI

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
    --databases-to-restore name=MyDB1 collections=collection1 collection2 \
    --databases-to-restore name=MyDB2 collections=collection3 collection4

   ```

## <a id="enumerate-sql-api"></a>Enumerate restorable resources for SQL API

The enumeration commands described below help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account, database, and container resources.

**List all the accounts that can be restored in the current subscription**

Run the following CLI command to list all the accounts that can be restored in the current subscription

```azurecli-interactive
az cosmosdb restorable-database-account list --account-name "pitrbb"
```

The response includes all the database accounts (both live and deleted) that can be restored and the regions that they can be restored from:

```json
{
    "accountName": "pitrbb",
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

**List all the versions of databases in a live database account**

Listing all the versions of databases allows you to choose the right database in a scenario where the actual time of existence of database is unknown.

Run the following CLI command to list all the versions of databases. This command only works with live accounts. The `instanceId` and the `location` parameters are obtained from the `name` and `location` properties in the response of `az cosmosdb restorable-database-account list` command. The instanceId attribute is also a property of source database account that is being restored:

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

**List all the versions of SQL containers of a database in a live database account**

Use the following command to list all the versions of SQL containers. This command only works with live accounts. The `databaseRid` parameter is the `ResourceId` of the database you want to restore. It is the value of `ownerResourceid` attribute found in the response of `az cosmosdb sql restorable-database list` command.

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

**Find databases or containers that can be restored at any given timestamp**

Use the following command to get the list of databases or containers that can be restored at any given timestamp. This command only works with live accounts.

```azurecli-interactive

az cosmosdb sql restorable-resource list \
  --instance-id "7133a59a-d1c0-4645-a699-6e296d6ac865" \
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
]
```

## <a id="enumerate-mongodb-api"></a>Enumerate restorable resources for MongoDB API account

The enumeration commands described below help you discover the resources that are available for restore at various timestamps. Additionally, they also provide a feed of key events on the restorable account, database, and container resources. Like with SQL API, you can use the `az cosmosdb` command but with `mongodb` as parameter instead of `sql`. These commands only work for live accounts.

**List all the versions of mongodb databases in a live database account**

```azurecli-interactive
az cosmosdb mongodb restorable-database list \
    --instance-id "7133a59a-d1c0-4645-a699-6e296d6ac865" \
    --location "West US"
```

**List all the versions of mongodb collections of a database in a live database account**

```azurecli-interactive
az cosmosdb mongodb restorable-collection list \
    --instance-id "<InstanceID>" \
    --database-rid "AoQ13r==" \
    --location "West US"
```

**List all the resources of a mongodb database account that are available to restore at a given timestamp and region**

```azurecli-interactive
az cosmosdb mongodb restorable-resource list \
    --instance-id "7133a59a-d1c0-4645-a699-6e296d6ac865" \
    --location "West US" \
    --restore-location "West US" \
    --restore-timestamp "2020-07-20T16:09:53+0000"
```

## Next steps

* Configure and manage continuous backup using [Azure portal](continuous-backup-restore-portal.md), [PowerShell](continuous-backup-restore-powershell.md), or [Azure Resource Manager](continuous-backup-restore-template.md).
* [Resource model of continuous backup mode](continuous-backup-restore-resource-model.md)
* [Manage permissions](continuous-backup-restore-permissions.md) required to restore data with continuous backup mode.
