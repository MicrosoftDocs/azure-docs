---
title: List restorable collections in Azure Cosmos DB MongoDB API - REST API
description: Show the event feed of all mutations done on all the Azure Cosmos DB MongoDB collections under a specific database. This helps in scenario where container was accidentally deleted. 
author: kanshiG
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 02/03/2021
ms.author: govindk
---

# List restorable collections in Azure Cosmos DB API for MongoDB using REST API

> [!IMPORTANT]
> The point-in-time restore feature(continuous backup mode) for Azure Cosmos DB is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Show the event feed of all mutations done on all the Azure Cosmos DB API for MongoDB collections under a specific database. This helps in scenario where container was accidentally deleted. This API requires `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read` permission

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.DocumentDB/locations/{location}/restorableDatabaseAccounts/{instanceId}/restorableMongodbCollections?api-version=2020-06-01-preview
```

With optional parameters:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.DocumentDB/locations/{location}/restorableDatabaseAccounts/{instanceId}/restorableMongodbCollections?api-version=2020-06-01-preview&amp;restorableMongodbDatabaseRid={restorableMongodbDatabaseRid}
```

## URI parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| **instanceId** | path | True |string| The instanceId GUID of a restorable database account. |
| **location** | path | True | string| Azure Cosmos DB region, with spaces between words and each word capitalized. |
| **subscriptionId** | path | True | string| The ID of the target subscription. |
| **api-version** | query | True | string | The API version to use for this operation. |
| **restorableMongodbDatabaseRid** | query | |string| The resource ID of the Azure Cosmos DB API for MongoDB database. |

## Responses

| Name | Type | Description |
| --- | --- | --- |
| 200 OK | [RestorableMongodbCollectionsListResult](#restorablemongodbcollectionslistresult)| The operation completed successfully. |
| Other Status Codes | [DefaultErrorResponse](#defaulterrorresponse)| Error response describing why the operation failed.|

## Examples

### CosmosDBRestorableMongodbCollectionList

**Sample request**

```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/WestUS/restorableDatabaseAccounts/98a570f2-63db-4117-91f0-366327b7b353/restorableMongodbCollections?api-version=2020-06-01-preview&amp;restorableMongodbDatabaseRid=PD5DALigDgw=
```

**Sample response**

Status code: 200

```json
{
  "value": [
    {
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDb/locations/westus/restorableDatabaseAccounts/98a570f2-63db-4117-91f0-366327b7b353/restorableMongodbCollections/79609a98-3394-41f8-911f-cfab0c075c86",
      "type": "Microsoft.DocumentDB/locations/restorableDatabaseAccounts/restorableMongodbCollections",
      "name": "79609a98-3394-41f8-911f-cfab0c075c86",
      "properties": {
        "resource": {
          "_rid": "zAyAPQAAAA==",
          "eventTimestamp": "2020-10-13T04:56:42Z",
          "ownerId": "Collection1",
          "ownerResourceId": "V18LoLrv-qA=",
          "operationType": "Create"
        }
      }
    }
  ]
}
```

## Definitions

|Definition  | Description|
| --- | --- |
| [DefaultErrorResponse](#defaulterrorresponse) | An error response from the service. |
| [ErrorResponse](#errorresponse) | Error response. |
| [OperationType](#operationtype) | Enum to indicate the operation type of the event. |
| [Resource](#resource) | The resource of an Azure Cosmos DB API for MongoDB collection event |
| [RestorableMongodbCollectionGetResult](#restorablemongodbcollectiongetresult) | An Azure Cosmos DB API for MongoDB collection event |
| [RestorableMongodbCollectionProperties](#restorablemongodbcollectionproperties) | The properties of an Azure Cosmos DB API for MongoDB collection event |
| [RestorableMongodbCollectionsListResult](#restorablemongodbcollectionslistresult) | The List operation response, that contains the collection events and their properties. |

### <a id="defaulterrorresponse"></a>DefaultErrorResponse

An error response from the service.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| error | [ErrorResponse](#errorresponse)| Error response. |

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
| Create |string|collection creation event|
| Delete |string|collection deletion event|
| Replace |string|collection modification event|

### <a id="resource"></a>Resource

The resource of an Azure Cosmos DB MongoDB collection event

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| _rid |string| A system-generated property. A unique identifier. |
| eventTimestamp |string| The time when this collection event happened. |
| operationType |[OperationType](#operationtype)|  The operation type of this collection event. |
| ownerId |string| The name of the MongoDB collection.|
| ownerResourceId |string| The resource ID of the MongoDB collection. |

### <a id="restorablemongodbcollectiongetresult"></a>RestorableMongodbCollectionGetResult

An Azure Cosmos DB MongoDB collection event

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| ID |string| The unique resource Identifier of the Azure Resource Manager resource. |
| name |string| The name of the Resource Manager resource. |
| properties |[RestorableMongodbCollectionProperties](#restorablemongodbcollectionproperties)| The properties of a collection event. |
| type |string| The type of Azure resource. |

### <a id="restorablemongodbcollectionproperties"></a>RestorableMongodbCollectionProperties

The properties of an Azure Cosmos DB MongoDB collection event

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| resource | [Resource](#resource)| The resource of an Azure Cosmos DB API for MongoDB collection event |

### <a id="restorablemongodbcollectionslistresult"></a>RestorableMongodbCollectionsListResult

The List operation response, that contains the collection events and their properties.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| value |[RestorableMongodbCollectionGetResult](#restorablemongodbcollectiongetresult)[]| List of Azure Cosmos DB API for MongoDB collection events and their properties. |

## Next steps

* [List restorable databases](restorable-mongodb-databases-list.md)  in Azure Cosmos DB API for MongoDB using REST API.
* [Resource model](continuous-backup-restore-resource-model.md) of continuous backup mode.