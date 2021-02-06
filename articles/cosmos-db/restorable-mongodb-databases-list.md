---
title: List restorable databases in Azure Cosmos DB API for MongoDB using REST API
description: Show the event feed of all mutations done on all the Azure Cosmos DB MongoDB databases under the restorable account. This helps in scenario where database was accidentally deleted to get the deletion time.
author: kanshiG
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 02/03/2021
ms.author: govindk
---

# List restorable databases in Azure Cosmos DB API for MongoDB using REST API

> [!IMPORTANT]
> The point-in-time restore feature(continuous backup mode) for Azure Cosmos DB is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Show the event feed of all mutations done on all the Azure Cosmos DB MongoDB databases under the restorable account. This helps in scenario where database was accidentally deleted to get the deletion time. This API requires `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read` permission

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.DocumentDB/locations/{location}/restorableDatabaseAccounts/{instanceId}/restorableMongodbDatabases?api-version=2020-06-01-preview
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
| 200 OK | [RestorableMongodbDatabasesListResult](#restorablemongodbdatabaseslistresult)| The operation completed successfully. |
| Other Status Codes | [DefaultErrorResponse](#defaulterrorresponse)| Error response describing why the operation failed.|

## Examples

### CosmosDBRestorableMongodbDatabaseList

**Sample request**

```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/WestUS/restorableDatabaseAccounts/d9b26648-2f53-4541-b3d8-3044f4f9810d/restorableMongodbDatabases?api-version=2020-06-01-preview
```

**Sample response**

Status code: 200

```json
{
  "value": [
    {
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDb/locations/westus/restorableDatabaseAccounts/36f09704-6be3-4f33-aa05-17b73e504c75/restorableMongodbDatabases/59c21367-b98b-4a8e-abb7-b6f46600decc",
      "type": "Microsoft.DocumentDB/locations/restorableDatabaseAccounts/restorableMongodbDatabases",
      "name": "59c21367-b98b-4a8e-abb7-b6f46600decc",
      "properties": {
        "resource": {
          "_rid": "DLB14gAAAA==",
          "eventTimestamp": "2020-09-02T19:45:03Z",
          "ownerId": "Database1",
          "ownerResourceId": "PD5DALigDgw=",
          "operationType": "Create"
        }
      }
    },
    {
      "id": "/subscriptions/2296c272-5d55-40d9-bc05-4d56dc2d7588/providers/Microsoft.DocumentDb/locations/westus/restorableDatabaseAccounts/d9b26648-2f53-4541-b3d8-3044f4f9810d/restorableMongodbDatabases/8456cb17-cdb0-4c6a-8db8-d0ff3f886257",
      "type": "Microsoft.DocumentDB/locations/restorableDatabaseAccounts/restorableMongodbDatabases",
      "name": "8456cb17-cdb0-4c6a-8db8-d0ff3f886257",
      "properties": {
        "resource": {
          "_rid": "ESXNLAAAAA==",
          "eventTimestamp": "2020-09-02T19:53:42Z",
          "ownerId": "Database1",
          "ownerResourceId": "PD5DALigDgw=",
          "operationType": "Delete"
        }
      }
    }
  ]
}
```

## Definitions

|Definition  | Description|
| --- || --- |
| [DefaultErrorResponse](#defaulterrorresponse) | An error response from the service. |
| [ErrorResponse](#errorresponse) | Error Response. |
| [OperationType](#operationtype) | Enum to indicate the operation type of the event. |
| [Resource](#resource) | The resource of an Azure Cosmos DB API for MongoDB database event |
| [RestorableMongodbDatabaseGetResult](#restorablemongodbdatabasegetresult) | An Azure Cosmos DB API for MongoDB database event |
| [RestorableMongodbDatabaseProperties](#restorablemongodbdatabaseproperties) | The properties of an Azure Cosmos DB API for MongoDB database event |
| [RestorableMongodbDatabasesListResult](#restorablemongodbdatabaseslistresult) | The List operation response, that contains the Azure Cosmos DB API for MongoDB database events and their properties. |

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

### <a id="resource"></a>Resource

The resource of an Azure Cosmos DB API for MongoDB database event

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| _rid |string| A system-generated property. A unique identifier. |
| eventTimestamp |string| The time when this database event happened. |
| operationType |[OperationType](#operationtype)| The operation type of this database event.  |
| ownerId |string| The name of the Azure Cosmos DB API for  MongoDB database.|
| ownerResourceId |string| The resource ID Azure Cosmos DB API for  MongoDB database. |

### <a id="restorablemongodbdatabasegetresult"></a>RestorableMongodbDatabaseGetResult

An Azure Cosmos DB API for MongoDB database event

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| ID |string| The unique resource Identifier of the Azure Resource Manager resource. |
| name |string| The name of the Resource Manager resource. |
| properties |[RestorableMongodbDatabaseProperties](#restorablemongodbdatabaseproperties)| The properties of a Azure Cosmos DB API for MongoDB database event. |
| type |string| The type of Azure resource. |

### <a id="restorablemongodbdatabaseproperties"></a>RestorableMongodbDatabaseProperties

The properties of an Azure Cosmos DB API for MongoDB database event

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| resource |[Resource](#resource)| The resource of an Azure Cosmos DB API for MongoDB database event |

### <a id="restorablemongodbdatabaseslistresult"></a>RestorableMongodbDatabasesListResult

The List operation response, that contains the  database events and their properties.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| value |[RestorableMongodbDatabaseGetResult](#restorablemongodbdatabasegetresult)[]| List of database events and their properties. |

## Next steps

* [List restorable resources](restorable-mongodb-resources-list.md)  in Azure Cosmos DB API for MongoDB using REST API.
* [List restorable collections](restorable-mongodb-collections-list.md)  in Azure Cosmos DB API for MongoDB using REST API.
* [Resource model](continuous-backup-restore-resource-model.md) of continuous backup mode.