---
title: List restorable SQL API resources in Azure Cosmos DB using REST API
description: Return a list of database and container combo that exist on the account at the given timestamp and location. This helps in scenarios to validate what resources exist at given timestamp and location.
author: kanshiG
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 02/03/2021
ms.author: govindk
---

# List restorable SQL API resources in Azure Cosmos DB using REST API

> [!IMPORTANT]
> The point-in-time restore feature(continuous backup mode) for Azure Cosmos DB is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Return a list of database and container combo that exist on the account at the given timestamp and location. This helps in scenarios to validate what resources exist at given timestamp and location. This API requires `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read` permission.

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.DocumentDB/locations/{location}/restorableDatabaseAccounts/{instanceId}/restorableSqlResources?api-version=2020-06-01-preview
```

With optional parameters:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.DocumentDB/locations/{location}/restorableDatabaseAccounts/{instanceId}/restorableSqlResources?api-version=2020-06-01-preview&amp;restoreLocation={restoreLocation}&amp;restoreTimestampInUtc={restoreTimestampInUtc}
```

## URI parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| **instanceId** | path | True |string| The instanceId GUID of a restorable database account. |
| **location** | path | True | string| Azure Cosmos DB region, with spaces between words and each word capitalized. |
| **subscriptionId** | path | True | string| The ID of the target subscription. |
| **api-version** | query | True | string | The API version to use for this operation. |
| **restoreLocation** | query | |string| The location where the restorable resources are located. |
| **restoreTimestampInUtc** | query | |string| The timestamp when the restorable resources existed. |

## Responses

| Name | Type | Description |
| --- | --- | --- |
| 200 OK | [RestorableSqlResourcesListResult](#restorablesqlresourceslistresult)| The operation completed successfully. |
| Other Status Codes | [DefaultErrorResponse](#defaulterrorresponse)| Error response describing why the operation failed. |

## Examples

### CosmosDBRestorableSqlResourceList

**Sample request**

```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/WestUS/restorableDatabaseAccounts/d9b26648-2f53-4541-b3d8-3044f4f9810d/restorableSqlResources?api-version=2020-06-01-preview&amp;restoreLocation=WestUS&amp;restoreTimestampInUtc=10/13/2020 4:56
```

**Sample response**

Status code: 200

```json
{
  "value": [
    {
      "databaseName": "Database1",
      "collectionNames": [
        "Container1"
      ]
    },
    {
      "databaseName": "Database2",
      "collectionNames": [
        "Container1",
        "Container2"
      ]
    },
    {
      "databaseName": "Database3",
      "collectionNames": []
    }
  ]
}
```

## Definitions

|Definition  | Description|
| --- || --- |
| [DatabaseRestoreResource](#databaserestoreresource) | Specific Databases to restore. |
| [DefaultErrorResponse](#defaulterrorresponse) | An error response from the service. |
| [ErrorResponse](#errorresponse) | Error Response. |
| [RestorableSqlResourcesListResult](#restorablesqlresourceslistresult) | The List operation response, that contains the restorable SQL resources. |

### <a id="databaserestoreresource"></a>DatabaseRestoreResource

Specific Databases to restore.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| collectionNames |string[]| The names of the collections available for restore. |
| databaseName |string| The name of the database available for restore. |

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

### <a id="restorablesqlresourceslistresult"></a>RestorableSqlResourcesListResult

The List operation response, that contains the restorable SQL resources.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| value |[DatabaseRestoreResource](#databaserestoreresource)[]| List of restorable SQL resources, including the database and collection names. |

## Next steps

* [List restorable databases](restorable-sql-databases-list.md) in Azure Cosmos SQL API using REST API.
* [Resource model](continuous-backup-restore-resource-model.md) of continuous backup mode.