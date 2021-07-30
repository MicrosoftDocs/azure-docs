---
title: Resource model for the Azure Cosmos DB point-in-time restore feature.
description: This article explains the resource model for the Azure Cosmos DB point-in-time restore feature. It explains the parameters that support the continuous backup and resources that can be restored in Azure Cosmos DB API for SQL and MongoDB accounts.
author: kanshiG
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 07/29/2021
ms.author: govindk
ms.reviewer: sngun

---

# Resource model for the Azure Cosmos DB point-in-time restore feature
[!INCLUDE[appliesto-sql-mongodb-api](includes/appliesto-sql-mongodb-api.md)]

This article explains the resource model for the Azure Cosmos DB point-in-time restore feature. It explains the parameters that support the continuous backup and resources that can be restored in Azure Cosmos DB API for SQL and MongoDB accounts.

## Database account's resource model

The database account's resource model is updated with a few extra properties to support the new restore scenarios. These properties are **BackupPolicy, CreateMode, and RestoreParameters.**

### BackupPolicy

A new property in the account level backup policy named `Type` under `backuppolicy` parameter enables continuous backup and point-in-time restore functionalities. This mode is called **continuous backup**. You can set this mode when creating the account or while [migrating an account from periodic to continuous mode](migrate-continuous-backup.md). After continuous mode is enabled, all the containers and databases created within this account will have continuous backup and point-in-time restore functionalities enabled by default.

> [!NOTE]
> Currently the point-in-time restore feature is available for Azure Cosmos DB API for MongoDB and SQL accounts. After you create an account with continuous mode you can't switch it to a periodic mode.

### CreateMode

This property indicates how the account was created. The possible values are *Default* and *Restore*. To perform a restore, set this value to *Restore* and provide the appropriate values in the `RestoreParameters` property.

### RestoreParameters

The `RestoreParameters` resource contains the restore operation details including, the account ID, the time to restore, and resources that need to be restored.

|Property Name |Description  |
|---------|---------|
|restoreMode  | The restore mode should be *PointInTime* |
|restoreSource   |  The instanceId of the source account from which the restore will be initiated.       |
|restoreTimestampInUtc  | Point in time in UTC to which the account should be restored to. |
|databasesToRestore   | List of `DatabaseRestoreResource` objects to specify which databases and containers should be restored. Each resource represents a single database and all the collections under that database, see the [restorable SQL resources](#restorable-sql-resources) section for more details. If this value is empty, then the entire account is restored.   |

### Sample resource

The following JSON is a sample database account resource with continuous backup enabled:

```json
{
  "location": "westus",
  "properties": {
    "databaseAccountOfferType": "Standard",
    "locations": [
      {
        "failoverPriority": 0,
        "locationName": "southcentralus",
        "isZoneRedundant": false
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
    }
}
```

## Restorable resources

A set of new resources and APIs is available to help you discover critical information about resources, which can be restored, locations where they can be restored from, and the timestamps when key operations were performed on these resources.

> [!NOTE]
> All the API used to enumerate these resources require the following permissions:
> * `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read`
> * `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/read`

### Restorable database account

This resource contains a database account instance that can be restored. The database account can either be a deleted or a live account. It contains information that allows you to find the source database account that you want to restore.

|Property Name |Description  |
|---------|---------|
| ID | The unique identifier of the resource. |
| accountName | The global database account name. |
| creationTime | The time in UTC when the account was created or migrated.  |
| deletionTime | The time in UTC when the account was deleted.  This value is empty if the account is live. |
| apiType | The API type of the Azure Cosmos DB account. |
| restorableLocations |	The list of locations where the account existed. |
| restorableLocations: locationName | The region name of the regional account. |
| restorableLocations: regionalDatabaseAccountInstanceId | The GUID of the regional account. |
| restorableLocations: creationTime	| The time in UTC when the regional account was created r migrated.|
| restorableLocations: deletionTime	| The time in UTC when the regional account was deleted. This value is empty if the regional account is live.|

To get a list of all restorable accounts, see [Restorable Database Accounts - list](/rest/api/cosmos-db-resource-provider/2021-04-01-preview/restorable-database-accounts/list) or [Restorable Database Accounts- list by location](/rest/api/cosmos-db-resource-provider/2021-04-01-preview/restorable-database-accounts/list-by-location) articles.

### Restorable SQL database

Each resource contains information of a mutation event such as creation and deletion that occurred on the SQL Database. This information can help in scenarios where the database was accidentally deleted and if you need to find out when that event happened.

|Property Name |Description  |
|---------|---------|
| eventTimestamp | The time in UTC when the database is created or deleted. |
| ownerId | The name of the SQL database. |
| ownerResourceId | The resource ID of the SQL database|
| operationType | The operation type of this database event. Here are the possible values:<br/><ul><li>Create: database creation event</li><li>Delete: database deletion event</li><li>Replace: database modification event</li><li>SystemOperation: database modification event triggered by the system. This event is not initiated by the user</li></ul> |
| database |The properties of the SQL database at the time of the event|

To get a list of all database mutations, see [Restorable Sql Databases - List](/rest/api/cosmos-db-resource-provider/2021-04-01-preview/restorable-sql-databases/list) article.

### Restorable SQL container

Each resource contains information of a mutation event such as creation and deletion that occurred on the SQL container. This information can help in scenarios where the container was modified or deleted, and if you need to find out when that event happened.

|Property Name |Description  |
|---------|---------|
| eventTimestamp	| The time in UTC when this container event happened.|
| ownerId| The name of the SQL container.|
| ownerResourceId	| The resource ID of the SQL container.|
| operationType	| The operation type of this container event. Here are the possible values: <br/><ul><li>Create: container creation event</li><li>Delete: container deletion event</li><li>Replace: container modification event</li><li>SystemOperation: container modification event triggered by the system. This event is not initiated by the user</li></ul> |
| container | The properties of the SQL container at the time of the event.|

To get a list of all container mutations under the same database, see [Restorable Sql Containers - List](/rest/api/cosmos-db-resource-provider/2021-04-01-preview/restorable-sql-containers/list) article.

### Restorable SQL resources

Each resource represents a single database and all the containers under that database.

|Property Name |Description  |
|---------|---------|
| databaseName	| The name of the SQL database.
| collectionNames	| The list of SQL containers under this database.|

To get a list of SQL database and container combo that exist on the account at the given timestamp and location, see [Restorable Sql Resources - List](/rest/api/cosmos-db-resource-provider/2021-04-01-preview/restorable-sql-resources/list) article.

### Restorable MongoDB database

Each resource contains information of a mutation event such as creation and deletion that occurred on the MongoDB Database. This information can help in the scenario where the database was accidentally deleted and user needs to find out when that event happened.

|Property Name |Description  |
|---------|---------|
|eventTimestamp| The time in UTC when this database event happened.|
| ownerId| The name of the MongoDB database. |
| ownerResourceId	| The resource ID of the MongoDB database. |
| operationType |	The operation type of this database event. Here are the possible values:<br/><ul><li> Create: database creation event</li><li> Delete: database deletion event</li><li> Replace: database modification event</li><li> SystemOperation: database modification event triggered by the system. This event is not initiated by the user </li></ul> |

To get a list of all database mutation, see [Restorable Mongodb Databases - List](/rest/api/cosmos-db-resource-provider/2021-04-01-preview/restorable-mongodb-databases/list) article.

### Restorable MongoDB collection

Each resource contains information of a mutation event such as creation and deletion that occurred on the MongoDB Collection. This information can help in scenarios where the collection was modified or deleted, and user needs to find out when that event happened.

|Property Name |Description  |
|---------|---------|
| eventTimestamp |The time in UTC when this collection event happened. |
| ownerId| The name of the MongoDB collection. |
| ownerResourceId	| The resource ID of the MongoDB collection. |
| operationType |The operation type of this collection event. Here are the possible values:<br/><ul><li>Create: collection creation event</li><li>Delete: collection deletion event</li><li>Replace: collection modification event</li><li>SystemOperation: collection modification event triggered by the system. This event is not initiated by the user</li></ul> |

To get a list of all container mutations under the same database, see [Restorable Mongodb Collections - List](/rest/api/cosmos-db-resource-provider/2021-04-01-preview/restorable-mongodb-collections/list) article.

### Restorable MongoDB resources

Each resource represents a single database and all the collections under that database.

|Property Name |Description  |
|---------|---------|
| databaseName	|The name of the MongoDB database. |
| collectionNames | The list of MongoDB collections under this database. |

To get a list of all MongoDB database and collection combinations that exist on the account at the given timestamp and location, see [Restorable Mongodb Resources - List](/rest/api/cosmos-db-resource-provider/2021-04-01-preview/restorable-mongodb-resources/list) article.

## Next steps

* Provision continuous backup using [Azure portal](provision-account-continuous-backup.md#provision-portal), [PowerShell](provision-account-continuous-backup.md#provision-powershell), [CLI](provision-account-continuous-backup.md#provision-cli), or [Azure Resource Manager](provision-account-continuous-backup.md#provision-arm-template).
* Restore an account using [Azure portal](restore-account-continuous-backup.md#restore-account-portal), [PowerShell](restore-account-continuous-backup.md#restore-account-powershell), [CLI](restore-account-continuous-backup.md#restore-account-cli), or [Azure Resource Manager](restore-account-continuous-backup.md#restore-arm-template).
* [Migrate to an account from periodic backup to continuous backup](migrate-continuous-backup.md).
* [Manage permissions](continuous-backup-restore-permissions.md) required to restore data with continuous backup mode.
