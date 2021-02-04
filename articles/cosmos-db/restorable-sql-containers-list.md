---
title: List restorable SQL API containers in Azure Cosmos DB using REST API
description: Show the event feed of all mutations done on all the Azure Cosmos DB SQL containers under a specific database. This helps in scenario where container was accidentally deleted.
author: kanshiG
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 02/03/2021
ms.author: govindk
---

# List restorable SQL API containers in Azure Cosmos DB using REST API

> [!IMPORTANT]
> The point-in-time restore feature(continuous backup mode) for Azure Cosmos DB is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Show the event feed of all mutations done on all the Azure Cosmos DB SQL containers under a specific database. This helps in scenario where container was accidentally deleted. This API requires `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read` permission

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.DocumentDB/locations/{location}/restorableDatabaseAccounts/{instanceId}/restorableSqlContainers?api-version=2020-06-01-preview
```

With optional parameters:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.DocumentDB/locations/{location}/restorableDatabaseAccounts/{instanceId}/restorableSqlContainers?api-version=2020-06-01-preview&amp;restorableSqlDatabaseRid={restorableSqlDatabaseRid}
```

## URI parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| **instanceId** | path | True |string| The instanceId GUID of a restorable database account. |
| **location** | path | True | string| Azure Cosmos DB region, with spaces between words and each word capitalized. |
| **subscriptionId** | path | True | string| The ID of the target subscription. |
| **api-version** | query | True | string | The API version to use for this operation. |
| **restorableSqlDatabaseRid** | query | |string| The resource ID of the SQL database. |

## Responses

| Name | Type | Description |
| --- | --- | --- |
| 200 OK | [RestorableSqlContainersListResult](#restorablesqlcontainerslistresult)| The operation completed successfully. |
| Other Status Codes | [DefaultErrorResponse](#defaulterrorresponse)| Error response describing why the operation failed. |

## Examples

### CosmosDBRestorableSqlContainerList

**Sample request**

```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/WestUS/restorableDatabaseAccounts/98a570f2-63db-4117-91f0-366327b7b353/restorableSqlContainers?api-version=2020-06-01-preview&amp;restorableSqlDatabaseRid=3fu-hg==
```

**Sample response**

Status code: 200

```json
{
  "value": [
    {
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDb/locations/westus/restorableDatabaseAccounts/98a570f2-63db-4117-91f0-366327b7b353/restorableSqlContainers/79609a98-3394-41f8-911f-cfab0c075c86",
      "type": "Microsoft.DocumentDB/locations/restorableDatabaseAccounts/restorableSqlContainers",
      "name": "79609a98-3394-41f8-911f-cfab0c075c86",
      "properties": {
        "resource": {
          "_rid": "zAyAPQAAAA==",
          "eventTimestamp": "2020-10-13T04:56:42Z",
          "ownerId": "Container1",
          "ownerResourceId": "V18LoLrv-qA=",
          "operationType": "Create",
          "container": {
            "id": "Container1",
            "indexingPolicy": {
              "indexingMode": "Consistent",
              "automatic": true,
              "includedPaths": [
                {
                  "path": "/*"
                },
                {
                  "path": "/\"_ts\"/?"
                }
              ],
              "excludedPaths": [
                {
                  "path": "/\"_etag\"/?"
                }
              ]
            },
            "conflictResolutionPolicy": {
              "mode": "LastWriterWins",
              "conflictResolutionPath": "/_ts",
              "conflictResolutionProcedure": ""
            },
            "_rid": "V18LoLrv-qA=",
            "_self": "dbs/V18LoA==/colls/V18LoLrv-qA=/",
            "_etag": "\"00003e00-0000-0700-0000-5f85338a0000\""
          }
        }
      }
    },
    {
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDb/locations/westus/restorableDatabaseAccounts/98a570f2-63db-4117-91f0-366327b7b353/restorableSqlContainers/e85298a1-c631-4726-825e-a7ca092e9098",
      "type": "Microsoft.DocumentDB/locations/restorableDatabaseAccounts/restorableSqlContainers",
      "name": "e85298a1-c631-4726-825e-a7ca092e9098",
      "properties": {
        "resource": {
          "_rid": "PrArcgAAAA==",
          "eventTimestamp": "2020-10-13T05:03:27Z",
          "ownerId": "Container1",
          "ownerResourceId": "V18LoLrv-qA=",
          "operationType": "Replace",
          "container": {
            "id": "Container1",
            "indexingPolicy": {
              "indexingMode": "Consistent",
              "automatic": true,
              "includedPaths": [
                {
                  "path": "/*"
                },
                {
                  "path": "/\"_ts\"/?"
                }
              ],
              "excludedPaths": [
                {
                  "path": "/\"_etag\"/?"
                }
              ]
            },
            "defaultTtl": 12345,
            "conflictResolutionPolicy": {
              "mode": "LastWriterWins",
              "conflictResolutionPath": "/_ts",
              "conflictResolutionProcedure": ""
            },
            "_rid": "V18LoLrv-qA=",
            "_self": "dbs/V18LoA==/colls/V18LoLrv-qA=/",
            "_etag": "\"00004400-0000-0700-0000-5f85351f0000\""
          }
        }
      }
    }
  ]
}
```

## Definitions

|Definition  | Description|
| --- || --- |
| [Container](#container) | Azure Cosmos DB SQL container resource object |
| [DefaultErrorResponse](#defaulterrorresponse) | An error response from the service. |
| [ErrorResponse](#errorresponse) | Error Response. |
| [OperationType](#operationtype) | Enum to indicate the operation type of the event. |
| [Resource](#resource) | The resource of an Azure Cosmos DB SQL container event |
| [RestorableSqlContainerGetResult](#restorablesqlcontainergetresult) | An Azure Cosmos DB SQL container event |
| [RestorableSqlContainerProperties](#restorablesqlcontainerproperties) | The properties of an Azure Cosmos DB SQL container event|
| [RestorableSqlContainersListResult](#restorablesqlcontainerslistresult) | The List operation response, that contains the SQL container events and their properties. |

### <a id="container"></a>Container

Azure Cosmos DB SQL container resource object

| **Name** | **Type** | **Description** |
| --- || --- | ---|
| _etag |string| A system-generated property representing the resource etag required for optimistic concurrency control. |
| _rid |string| A system-generated property. A unique identifier. |
| _self |string| A system-generated property that specifies the addressable path of the container resource. |
| _ts | | A system-generated property that denotes the last updated timestamp of the resource. |
| ID |string| Name of the Azure Cosmos DB SQL container |

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
| Create |string|container creation event|
| Delete |string|container deletion event|
| Replace |string|container modification event|
| SystemOperation |string|container modification event triggered by the system. This event is not initiated by the user|

### <a id="resource"></a>Resource

The resource of an Azure Cosmos DB SQL container event

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| _rid |string| A system-generated property. A unique identifier. |
| container |[Container](#container)| Azure Cosmos DB SQL container resource object |
| eventTimestamp |string| The time when this container event happened. |
| operationType |[OperationType](#operationtype)| The operation type of this container event. |
| ownerId |string| The name of the SQL container. |
| ownerResourceId |string| The resource ID of the SQL container. |

### <a id="restorablesqlcontainergetresult"></a>RestorableSqlContainerGetResult

An Azure Cosmos DB SQL container event

| **Name** | **Type** | **Description** |
| --- | --- | ---
| ID |string| The unique resource Identifier of the Azure Resource Manager resource. |
| name |string| The name of the Azure Resource Manager resource. |
| properties |[RestorableSqlContainerProperties](#restorablesqlcontainerproperties)| The properties of a SQL container event. |
| type |string| The type of Azure resource. |

### <a id="restorablesqlcontainerproperties"></a>RestorableSqlContainerProperties

The properties of an Azure Cosmos DB SQL container event

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| resource |[Resource](#resource)| The resource of an Azure Cosmos DB SQL container event |

### <a id="restorablesqlcontainerslistresult"></a>RestorableSqlContainersListResult

The List operation response, that contains the SQL container events and their properties.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| value |[RestorableSqlContainerGetResult](#restorablesqlcontainergetresult)[]| List of SQL container events and their properties. |

## Next steps

* [List restorable databases](restorable-mongodb-databases-list.md)  in Azure Cosmos DB API for MongoDB using REST API.
* [Resource model](continuous-backup-restore-resource-model.md) of continuous backup mode.