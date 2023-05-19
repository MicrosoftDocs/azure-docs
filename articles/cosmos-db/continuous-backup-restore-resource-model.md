---
title: Resource model for the Azure Cosmos DB point-in-time restore feature.
description: This article explains the resource model for the Azure Cosmos DB point-in-time restore feature. It explains the parameters that support the continuous backup and resources that can be restored in Azure Cosmso DB for SQL and MongoDB accounts.
author: kanshiG
ms.author: govindk
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 06/28/2022
ms.reviewer: mjbrown
---

# Resource model for the Azure Cosmos DB point-in-time restore feature

[!INCLUDE[NoSQL, MongoDB, Gremlin, Table](includes/appliesto-nosql-mongodb-gremlin-table.md)]

This article explains the resource model for the Azure Cosmos DB point-in-time restore feature. It explains the parameters that support the continuous backup and resources that can be restored. This feature is supported in Azure Cosmos DB API for SQL, Azure Cosmos DB API for Gremlin, Table API and the Azure Cosmos DB API for MongoDB.  

## Database account's resource model

The database account's resource model is updated with a few extra properties to support the new restore scenarios. These properties are `BackupPolicy`, `CreateMode`, and `RestoreParameters`.

### BackupPolicy

A new property in the account level backup policy named ``Type`` under the ``backuppolicy`` parameter enables continuous backup and point-in-time restore. This mode is referred to as **continuous backup**. You can set this mode when creating the account or while [migrating an account from periodic to continuous mode](migrate-continuous-backup.md). After continuous mode is enabled, all the containers and databases created within this account will have point-in-time restore and continuous backup enabled by default. The continuous backup tier can be set to ``Continuous7Days`` or ``Continuous30Days``. By default, if no tier is provided, ``Continuous30Days`` is applied on the account.

> [!NOTE]
> Currently the point-in-time restore feature is available for Azure Cosmos DB for NoSQL, API for MongoDB, Table and Gremlin accounts. After you create an account with continuous mode you can't switch it to a periodic mode. The ``Continuous7Days`` tier is in preview.

### CreateMode

This property indicates how the account was created. The possible values are *Default* and *Restore*. To perform a restore, set this value to *Restore* and provide the appropriate values in the `RestoreParameters` property.

### RestoreParameters

The `RestoreParameters` resource contains the restore operation details including, the account ID, the time to restore, and resources that need to be restored.

| Property Name | Description  |
| --- | --- |
| ``restoreMode`` | The restore mode should be ``PointInTime``. |
| ``restoreSource`` |  The instanceId of the source account from which the restore will be initiated. |
| ``restoreTimestampInUtc`` | Point in time in UTC to restore the account. |
| ``databasesToRestore`` | List of `DatabaseRestoreResource` objects to specify which databases and containers should be restored. Each resource represents a single database and all the collections under that database. For more information, see [restorable SQL resources](#restorable-sql-resources). If this value is empty, then the entire account is restored. |
| ``gremlinDatabasesToRestore`` | List of `GremlinDatabaseRestoreResource` objects to specify which databases and graphs should be restored. Each resource represents a single database and all the graphs under that database. For more information, see [restorable Gremlin resources](#restorable-graph-resources). If this value is empty, then the entire account is restored. |
| ``tablesToRestore`` | List of `TableRestoreResource` objects to specify which tables should be restored. Each resource represents a table under that database. For more information, see [restorable Table resources](#restorable-table-resources). If this value is empty, then the entire account is restored. |

### Sample resource

The following JSON is a sample database account resource with continuous backup enabled:

```json
{
  "location": "westus",
  "properties": {
    "databaseAccountOfferType": "Standard",
    "locations": [
      {
        "failoverPriority": "0",
        "locationName": "southcentralus",
        "isZoneRedundant": "false"
      }
    ],
    "createMode": "Restore",
    "restoreParameters": {
      "restoreMode": "PointInTime",
      "restoreSource": "/subscriptions/subid/providers/Microsoft.DocumentDB/locations/westus/restorableDatabaseAccounts/1a97b4bb-f6a0-430e-ade1-638d781830cc",
      "restoreTimestampInUtc": "2020-06-11T22:05:09Z",
      "databasesToRestore": [
        {
          "databaseName": "db1",
          "collectionNames": [
            "collection1",
            "collection2"
          ]
        },
        {
          "databaseName": "db2",
          "collectionNames": [
            "collection3",
            "collection4"
          ]
        }
      ]
    },
    "backupPolicy": {
      "type": "Continuous"
      ....
    }
  }
}
```

## Restorable resources

A set of new resources and APIs is available to help you discover critical information about resources, which includes:

* Where the resources can be restored
* Locations where the resources can be restored from
* Timestamps when key operations were performed on these resources.

> [!NOTE]
> All the API used to enumerate these resources require the following permissions:
>
> * `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read`
> * `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/read`
>

### Restorable database account

This resource contains a database account instance that can be restored. The database account can either be a deleted or a live account. It contains information that allows you to find the source database account that you want to restore.

| Property Name | Description  |
| --- | --- |
| ``ID`` | The unique identifier of the resource. |
| ``accountName`` | The global database account name. |
| ``creationTime`` | The time in UTC when the account was created or migrated.  |
| ``deletionTime`` | The time in UTC when the account was deleted.  This value is empty if the account is live. |
| ``apiType`` | The API type of the Azure Cosmos DB account. |
| ``restorableLocations`` | The list of locations where the account existed. |
| ``restorableLocations: locationName`` | The region name of the regional account. |
| ``restorableLocations: regionalDatabaseAccountInstanceId`` | The GUID of the regional account. |
| ``restorableLocations: creationTime`` | The time in UTC when the regional account was created r migrated.|
| ``restorableLocations: deletionTime`` | The time in UTC when the regional account was deleted. This value is empty if the regional account is live.|
| ``OldestRestorableTimeStamp`` | The earliest time in UTC to which restore can be performed. For the 30 day tier, this time can be maximum 30 days from now, for the seven days tier, this time can be up to seven days from now.  |

To get a list of all restorable accounts, see [Restorable Database Accounts - list](/rest/api/cosmos-db-resource-provider/2021-04-01-preview/restorable-database-accounts/list) or [Restorable Database Accounts- list by location](/rest/api/cosmos-db-resource-provider/2021-04-01-preview/restorable-database-accounts/list-by-location) articles.

### Restorable SQL database

Each resource contains information of a mutation event such as creation and deletion that occurred on the SQL Database. This information can help in scenarios where the database was accidentally deleted and if you need to find out when that event happened.

| Property Name | Description  |
| --- | --- |
| ``eventTimestamp`` | The time in UTC when the database is created or deleted. |
| ``ownerId`` | The name of the SQL database. |
| ``ownerResourceId`` | The resource ID of the SQL database, |
| ``operationType`` | The operation type of this database event. |
| ``database`` | The properties of the SQL database at the time of the event, |

> [!NOTE]
> Possible values for ``operationType`` include:
>
> * ``Create``: database creation event
> * ``Delete``: database deletion event
> * ``Replace``: database modification event
> * ``SystemOperation``: database modification event triggered by the system. This event isn't initiated by the user
>

To get a list of all database mutations, see [Restorable NoSQL Databases - List](/rest/api/cosmos-db-resource-provider/2021-04-01-preview/restorable-sql-databases/list) article.

### Restorable SQL container

Each resource contains information of a mutation event such as creation and deletion that occurred on the SQL container. This information can help in scenarios where the container was modified or deleted, and if you need to find out when that event happened.

| Property Name | Description  |
| --- | --- |
| ``eventTimestamp`` | The time in UTC when this container event happened. |
| ``ownerId`` | The name of the SQL container. |
| ``ownerResourceId`` | The resource ID of the SQL container.|
| ``operationType`` | The operation type of this container event. |
| ``container`` | The properties of the SQL container at the time of the event. |

> [!NOTE]
> Possible values for ``operationType`` include:
>
> * ``Create``: container creation event
> * ``Delete``: container deletion event
> * ``Replace``: container modification event
> * ``SystemOperation``: container modification event triggered by the system. This event isn't initiated by the user
>

To get a list of all container mutations under the same database, see [Restorable NoSQL Containers - List](/rest/api/cosmos-db-resource-provider/2021-04-01-preview/restorable-sql-containers/list) article.

### Restorable SQL resources

Each resource represents a single database and all the containers under that database.

|Property Name |Description  |
|---------|---------|
| ``databaseName`` | The name of the SQL database.
| ``collectionNames`` | The list of SQL containers under this database.|

To get a list of SQL database and container combo that exist on the account at the given timestamp and location, see [Restorable NoSQL Resources - List](/rest/api/cosmos-db-resource-provider/2021-04-01-preview/restorable-sql-resources/list) article.

### Restorable MongoDB database

Each resource contains information of a mutation event such as creation and deletion that occurred on the MongoDB Database. This information can help in the scenario where the database was accidentally deleted and user needs to find out when that event happened.

| Property Name | Description  |
| --- | --- |
| ``eventTimestamp`` | The time in UTC when this database event happened. |
| ``ownerId`` | The name of the MongoDB database. |
| ``ownerResourceId`` | The resource ID of the MongoDB database. |
| ``operationType`` | The operation type of this database event. |

> [!NOTE]
> Possible values for ``operationType`` include:
>
> * ``Create``: database creation event
> * ``Delete``: database deletion event
> * ``Replace``: database modification event
> * ``SystemOperation``: database modification event triggered by the system. This event isn't initiated by the user
>

To get a list of all database mutation, see [Restorable Mongodb Databases - List](/rest/api/cosmos-db-resource-provider/2021-04-01-preview/restorable-mongodb-databases/list) article.

### Restorable MongoDB collection

Each resource contains information of a mutation event such as creation and deletion that occurred on the MongoDB Collection. This information can help in scenarios where the collection was modified or deleted, and user needs to find out when that event happened.

| Property Name | Description  |
| --- | --- |
| ``eventTimestamp`` | The time in UTC when this collection event happened. |
| ``ownerId`` | The name of the MongoDB collection. |
| ``ownerResourceId`` | The resource ID of the MongoDB collection. |
| ``operationType`` | The operation type of this collection event. |

> [!NOTE]
> Possible values for ``operationType`` include:
>
> * ``Create``: collection creation event
> * ``Delete``: collection deletion event
> * ``Replace``: collection modification event
> * ``SystemOperation``: collection modification event triggered by the system. This event isn't initiated by the user
>

To get a list of all container mutations under the same database, see [restorable MongoDB resources - list](/rest/api/cosmos-db-resource-provider/2021-04-01-preview/restorable-mongodb-collections/list).

### Restorable MongoDB resources

Each resource represents a single database and all the collections under that database.

| Property Name | Description  |
| --- | --- |
| ``databaseName`` |The name of the MongoDB database. |
| ``collectionNames`` | The list of MongoDB collections under this database. |

To get a list of all MongoDB database and collection combinations that exist on the account at the given timestamp and location, see [restorable MongoDB resources - list](/rest/api/cosmos-db-resource-provider/2021-04-01-preview/restorable-mongodb-resources/list).

### Restorable Graph resources

Each resource represents a single database and all the graphs under that database.

| Property Name | Description  |
| --- | --- |
| ``gremlinDatabaseName`` | The name of the Graph database. |
| ``graphNames`` | The list of Graphs under this database. |

To get a list of all Gremlin database and graph combinations that exist on the account at the given timestamp and location, see [Restorable Graph Resources - List](/rest/api/cosmos-db-resource-provider/2021-11-15-preview/restorable-gremlin-resources/list) article.

### Restorable Graph database

Each resource contains information about a mutation event, such as a creation and deletion that occurred on the Graph database. This information can help in the scenario where the database was accidentally deleted and user needs to find out when that event happened.

| Property Name | Description  |
| --- | --- |
| ``eventTimestamp`` | The time in UTC when this database event happened. |
| ``ownerId`` | The name of the Graph database. |
| ``ownerResourceId`` | The resource ID of the Graph database. |
| ``operationType`` | The operation type of this database event. |

> [!NOTE]
> Possible values for ``operationType`` include:
>
> * ``Create``: database creation event
> * ``Delete``: database deletion event
> * ``Replace``: database modification event
> * ``SystemOperation``: database modification event triggered by the system. This event isn't initiated by the user.
>

To get an event feed of all mutations on the Gremlin database, see [restorable graph databases - list]( /rest/api/cosmos-db-resource-provider/2021-11-15-preview/restorable-gremlin-databases/list).

### Restorable Graphs

Each resource contains information of a mutation event such as creation and deletion that occurred on the Graph. This information can help in scenarios where the graph was modified or deleted, and if you need to find out when that event happened.

| Property Name | Description  |
| --- | --- |
| ``eventTimestamp`` | The time in UTC when this collection event happened. |
| ``ownerId`` | The name of the Graph collection. |
| ``ownerResourceId`` | The resource ID of the Graph collection. |
| ``operationType`` | The operation type of this collection event. |

> [!NOTE]
> Possible values for ``operationType`` include:
>
> * ``Create``: Graph creation event
> * ``Delete``: Graph deletion event
> * ``Replace``: Graph modification event
> * ``SystemOperation``: collection modification event triggered by the system. This event isn't initiated by the user.
>

To get a list of all container mutations under the same database, see graph [Restorable Graphs - List](/rest/api/cosmos-db-resource-provider/2021-11-15-preview/restorable-gremlin-graphs/list) article.

### Restorable Table resources

Lists all the restorable Azure Cosmos DB Tables available for a specific database account at a given time and location. Note the API for Table doesn't specify an explicit database.

| Property Name | Description  |
| --- | --- |
| ``TableNames`` | The list of Table containers under this account. |

To get a list of tables that exist on the account at the given timestamp and location, see [Restorable Table Resources - List](/rest/api/cosmos-db-resource-provider/2021-11-15-preview/restorable-table-resources/list) article.

### Restorable Table  

Each resource contains information of a mutation event such as creation and deletion that occurred on the Table. This information can help in scenarios where the table was modified or deleted, and if you need to find out when that event happened.

| Property Name | Description  |
| --- | --- |
| ``eventTimestamp`` | The time in UTC when this database event happened. |
| ``ownerId`` | The name of the Table database. |
| ``ownerResourceId`` | The resource ID of the Table resource. |
| ``operationType`` | The operation type of this Table event. |

> [!NOTE]
> Possible values for ``operationType`` include:
>
> * ``Create``: Table creation event
> * ``Delete``: Table deletion event
> * ``Replace``: Table modification event
> * ``SystemOperation``: database modification event triggered by the system. This event isn't initiated by the user
>

To get a list of all table mutations under the same database, see [Restorable Table - List](/rest/api/cosmos-db-resource-provider/2021-11-15-preview/restorable-tables/list) article.

## Next steps

* Provision continuous backup using [Azure portal](provision-account-continuous-backup.md#provision-portal), [PowerShell](provision-account-continuous-backup.md#provision-powershell), [CLI](provision-account-continuous-backup.md#provision-cli), or [Azure Resource Manager](provision-account-continuous-backup.md#provision-arm-template).
* Restore an account using [Azure portal](restore-account-continuous-backup.md#restore-account-portal), [PowerShell](restore-account-continuous-backup.md#restore-account-powershell), [CLI](restore-account-continuous-backup.md#restore-account-cli), or [Azure Resource Manager](restore-account-continuous-backup.md#restore-arm-template).
* [Migrate to an account from periodic backup to continuous backup](migrate-continuous-backup.md).
* [Manage permissions](continuous-backup-restore-permissions.md) required to restore data with continuous backup mode.
