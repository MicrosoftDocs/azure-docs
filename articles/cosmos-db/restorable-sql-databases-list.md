---
title: List restorable SQL API databases in Azure Cosmos DB using REST API
description: Show the event feed of all mutations done on all the Azure Cosmos DB SQL databases under the restorable account. This helps in scenario where database was accidentally deleted to get the deletion time.
author: kanshiG
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 02/03/2021
ms.author: govindk
---

# List restorable SQL API databases in Azure Cosmos DB using REST API

> [!IMPORTANT]
> The point-in-time restore feature(continuous backup mode) for Azure Cosmos DB is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Show the event feed of all mutations done on all the Azure Cosmos DB SQL databases under the restorable account. This helps in scenario where database was accidentally deleted to get the deletion time. This API requires `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read` permission

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.DocumentDB/locations/{location}/restorableDatabaseAccounts/{instanceId}/restorableSqlDatabases?api-version=2020-06-01-preview
```

## URI parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| **instanceId** | path | True |string| The instanceId GUID of a restorable database account. |
| **location** | path | True | string| Azure Cosmos DB region, with spaces between words and each word capitalized. |
| **subscriptionId** | path | True | string| The ID of the target subscription. |
| **api-version** | query | True | string | The API version to use for this operation. |

## Responses

| Name | Type | Description |
| --- | --- | --- |
| 200 OK | [RestorableSqlDatabasesListResult](#restorablesqldatabaseslistresult)| The operation completed successfully. |
| Other Status Codes | [DefaultErrorResponse](#defaulterrorresponse)| Error response describing why the operation failed. |

## Examples

### CosmosDBRestorableSqlDatabaseList

**Sample Request**

```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/WestUS/restorableDatabaseAccounts/d9b26648-2f53-4541-b3d8-3044f4f9810d/restorableSqlDatabases?api-version=2020-06-01-preview
```

**Sample response**

Status code: 200

```json
{
  "value": [
    {
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDb/locations/westus/restorableDatabaseAccounts/36f09704-6be3-4f33-aa05-17b73e504c75/restorableSqlDatabases/59c21367-b98b-4a8e-abb7-b6f46600decc",
      "type": "Microsoft.DocumentDB/locations/restorableDatabaseAccounts/restorableSqlDatabases",
      "name": "59c21367-b98b-4a8e-abb7-b6f46600decc",
      "properties": {
        "resource": {
          "_rid": "DLB14gAAAA==",
          "eventTimestamp": "2020-09-02T19:45:03Z",
          "ownerId": "Database1",
          "ownerResourceId": "3fu-hg==",
          "operationType": "Create",
          "database": {
            "id": "Database1",
            "_rid": "3fu-hg==",
            "_self": "dbs/3fu-hg==/",
            "_etag": "\"0000c20a-0000-0700-0000-5f4ff63f0000\"",
            "_colls": "colls/",
            "_users": "users/"
          }
        }
      }
    },
    {
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDb/locations/westus/restorableDatabaseAccounts/d9b26648-2f53-4541-b3d8-3044f4f9810d/restorableSqlDatabases/8456cb17-cdb0-4c6a-8db8-d0ff3f886257",
      "type": "Microsoft.DocumentDB/locations/restorableDatabaseAccounts/restorableSqlDatabases",
      "name": "8456cb17-cdb0-4c6a-8db8-d0ff3f886257",
      "properties": {
        "resource": {
          "_rid": "ESXNLAAAAA==",
          "eventTimestamp": "2020-09-02T19:53:42Z",
          "ownerId": "Database1",
          "ownerResourceId": "3fu-hg==",
          "database": {
            "id": "Database1",
            "_rid": "3fu-hg==",
            "_self": "dbs/3fu-hg==/",
            "_etag": "\"0000c20a-0000-0700-0000-5f4ff63f0000\"",
            "_colls": "colls/",
            "_users": "users/",
            "_ts": 1599075903
          },
          "operationType": "Delete"
        }
      }
    },
    {
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDb/locations/westus/restorableDatabaseAccounts/d9b26648-2f53-4541-b3d8-3044f4f9810d/restorableSqlDatabases/2c07991b-9c7c-4e85-be68-b18c1f2ff326",
      "type": "Microsoft.DocumentDB/locations/restorableDatabaseAccounts/restorableSqlDatabases",
      "name": "2c07991b-9c7c-4e85-be68-b18c1f2ff326",
      "properties": {
        "resource": {
          "_rid": "aXFqUQAAAA==",
          "eventTimestamp": "2020-09-02T19:53:15Z",
          "ownerId": "Database2",
          "ownerResourceId": "0SziSg==",
          "database": {
            "id": "Database2",
            "_rid": "0SziSg==",
            "_self": "dbs/0SziSg==/",
            "_etag": "\"0000ca0a-0000-0700-0000-5f4ff82b0000\"",
            "_colls": "colls/",
            "_users": "users/"
          },
          "operationType": "Create"
        }
      }
    }
  ]
}
```

## Definitions

|Definition  | Description|
| --- || --- |
| [Database](#database) | Azure Cosmos DB SQL database resource object |
| [DefaultErrorResponse](#defaulterrorresponse) | An error response from the service. |
| [ErrorResponse](#errorresponse) | Error Response. |
| [OperationType](#operationtype) | Enum to indicate the operation type of the event. |
| [Resource](#resource) | The resource of an Azure Cosmos DB SQL database event |
| [RestorableSqlDatabaseGetResult](#restorablesqldatabasegetresult) | An Azure Cosmos DB SQL database event |
| [RestorableSqlDatabaseProperties](#restorablesqldatabaseproperties) | The properties of an Azure Cosmos DB SQL database event |
| [RestorableSqlDatabasesListResult](#restorablesqldatabaseslistresult) | The List operation response, that contains the SQL database events and their properties. |

### <a id="database"></a>Database

Azure Cosmos DB SQL database resource object

| **Name** | **Type** | **Description** |
| --- || --- | ---|
| _colls |string| A system-generated property that specified the addressable path of the collections resource. |
| _etag |string| A system-generated property representing the resource etag required for optimistic concurrency control. |
| _rid |string| A system-generated property. A unique identifier. |
| _self |string| A system-generated property that specifies the addressable path of the database resource. |
| _ts | | A system-generated property that denotes the last updated timestamp of the resource. |
| _users |string| A system-generated property that specifies the addressable path of the user's resource. |
| ID |string| Name of the Azure Cosmos DB SQL database |

### <a id="defaulterrorresponse"></a>DefaultErrorResponse

An error response from the service.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| error | [ErrorResponse](#errorresponse)| Error Response. |

### <a id="errorresponse"></a>ErrorResponse

Error Response.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| code |string| Error code. |
| message |string| Error message indicating why the operation failed. |

### <a id="operationtype"></a>OperationType

Enum to indicate the operation type of the event.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| Create |string|database creation event|
| Delete |string|database deletion event|
| Replace |string|database modification event|
| SystemOperation |string|database modification event triggered by the system. This event is not initiated by the user|

### <a id="resource"></a>Resource

The resource of an Azure Cosmos DB SQL database event

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| _rid |string| A system-generated property. A unique identifier. |
| database |[Database](#database)| Azure Cosmos DB SQL database resource object |
| eventTimestamp |string| The time when this database event happened. |
| operationType |[OperationType](#operationtype)| The operation type of this database event. |
| ownerId |string| The name of the SQL database. |
| ownerResourceId |string| The resource ID of the SQL database. |

### <a id="restorablesqldatabasegetresult"></a>RestorableSqlDatabaseGetResult

An Azure Cosmos DB SQL database event

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| ID |string| The unique resource Identifier of the Azure Resource Manager resource. |
| name |string| The name of the Azure Resource Manager resource. |
| properties | [RestorableSqlDatabaseProperties](#restorablesqldatabaseproperties)| The properties of a SQL database event. |
| type |string| The type of Azure resource. |

### <a id="restorablesqldatabaseproperties"></a>RestorableSqlDatabaseProperties

The properties of an Azure Cosmos DB SQL database event

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| resource |[Resource](#resource)| The resource of an Azure Cosmos DB SQL database event |

### <a id="restorablesqldatabaseslistresult"></a>RestorableSqlDatabasesListResult

The List operation response, that contains the SQL database events and their properties.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| value |[RestorableSqlDatabaseGetResult](#restorablesqldatabasegetresult)[]| List of SQL database events and their properties. |

## Next steps

* [List restorable containers](restorable-sql-containers-list.md) in Azure Cosmos DB SQL API using REST API.
* [Resource model](continuous-backup-restore-resource-model.md) of continuous backup mode.