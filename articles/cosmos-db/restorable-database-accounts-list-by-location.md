---
title: List restorable database accounts by location using Azure Cosmos DB REST API
description: Lists all the restorable Azure Cosmos DB database accounts available under the subscription and in a region. 
author: kanshiG
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 02/03/2021
ms.author: govindk
---

# List restorable database accounts by location using Azure Cosmos DB REST API

> [!IMPORTANT]
> The point-in-time restore feature(continuous backup mode) for Azure Cosmos DB is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Lists all the restorable Azure Cosmos DB restorable database accounts available under the subscription and in a region. This call requires `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/read` permission.

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.DocumentDB/locations/{location}/restorableDatabaseAccounts?api-version=2020-06-01-preview

```

## URI parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| **location** | path | True | string| Azure Cosmos DB region, with spaces between words and each word capitalized. |
| **subscriptionId** | path | True | string| The ID of the target subscription. |
| **api-version** | query | True | string | The API version to use for this operation. |

## Responses

| Name | Type | Description |
| --- | --- | --- |
| 200 OK | [RestorableDatabaseAccountsListResult](#restorabledatabaseaccountslistresult)| The operation completed successfully. |
| Other Status Codes | [DefaultErrorResponse](#defaulterrorresponse)| Error response describing why the operation failed. |

## Examples

### CosmosDBDatabaseAccountList

**Sample request**

```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts?api-version=2020-06-01-preview
```

**Sample response**

Status code: 200

```json
{
  "value": [
    {
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts/d9b26648-2f53-4541-b3d8-3044f4f9810d",
      "name": "d9b26648-2f53-4541-b3d8-3044f4f9810d",
      "location": "West US",
      "type": "Microsoft.DocumentDB/locations/restorableDatabaseAccounts",
      "properties": {
        "accountName": "ddb1",
        "creationTime": "2020-04-11T21:56:15Z",
        "deletionTime": "2020-06-12T22:05:09Z",
        "apiType": "Sql",
        "restorableLocations": [
          {
            "locationName": "South Central US",
            "regionalDatabaseAccountInstanceId": "d7a01f78-606f-45c6-9dac-0df32f433bb5",
            "creationTime": "2020-10-30T21:13:10Z",
            "deletionTime": "2020-10-30T21:13:35Z"
          },
          {
            "locationName": "West US",
            "regionalDatabaseAccountInstanceId": "fdb43d84-1572-4697-b6e7-2bcda0c51b2c",
            "creationTime": "2020-10-30T21:13:10Z"
          }
        ]
      }
    },
    {
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts/4f9e6ace-ac7a-446c-98bc-194c502a06b4",
      "name": "4f9e6ace-ac7a-446c-98bc-194c502a06b4",
      "location": "West US",
      "type": "Microsoft.DocumentDB/locations/restorableDatabaseAccounts",
      "properties": {
        "accountName": "ddb2",
        "creationTime": "2020-05-01T08:05:18Z",
        "apiType": "Sql",
        "restorableLocations": [
          {
            "locationName": "South Central US",
            "regionalDatabaseAccountInstanceId": "d7a01f78-606f-45c6-9dac-0df32f433bb5",
            "creationTime": "2020-10-30T21:13:10Z",
            "deletionTime": "2020-10-30T21:13:35Z"
          },
          {
            "locationName": "West US",
            "regionalDatabaseAccountInstanceId": "fdb43d84-1572-4697-b6e7-2bcda0c51b2c",
            "creationTime": "2020-10-30T21:13:10Z"
          }
        ]
      }
    }
  ]
}
```

## Definitions

|Definition  | Description|
| --- | --- |
| [ApiType](#apitype) | Enum to indicate the API type of the restorable database account. |
| [DefaultErrorResponse](#defaulterrorresponse) | An error response from the service. |
| [ErrorResponse](#errorresponse) | Error response. |
| [RestorableDatabaseAccountGetResult](#restorabledatabaseaccountgetresult) | An Azure Cosmos DB restorable database account. |
| [RestorableDatabaseAccountsListResult](#restorabledatabaseaccountslistresult) | The List operation response, that contains the restorable database accounts and their properties. |
| [RestorableLocationResource](#restorablelocationresource) | Properties of the regional restorable account. |

### <a id="apitype"></a>ApiType

Enum to indicate the API type of the restorable database account.

| **Name** | **Type** |
| --- | --- |
| Cassandra |string|
| Gremlin |string|
| GremlinV2 |string|
| MongoDB |string|
| Sql |string|
| Table |string|

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

### <a id="restorabledatabaseaccountgetresult"></a>RestorableDatabaseAccountGetResult

An Azure Cosmos DB restorable database account.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| ID |string| The unique resource identifier of the Azure Resource Manager resource. |
| location |string| The location of the resource group to which the resource belongs. |
| name |string| The name of the Resource Manager resource. |
| properties.accountName |string| The name of the global database account. |
| properties.apiType |[ApiType](#apitype)| The API type of the restorable database account. |
| properties.creationTime |string| The creation time of the restorable database account (ISO-8601 format). |
| properties.deletionTime |string| The time at which the restorable database account has been deleted (ISO-8601 format). |
| properties.restorableLocations |[RestorableLocationResource](#restorablelocationresource)[]| List of regions where the of the database account can be restored from. |
| type |string| The type of Azure resource. |

### <a id="restorabledatabaseaccountslistresult"></a>RestorableDatabaseAccountsListResult

The List operation response, that contains the restorable database accounts and their properties.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| value |[RestorableDatabaseAccountGetResult](#restorabledatabaseaccountgetresult)[]| List of restorable database accounts and their properties. |

### <a id="restorablelocationresource"></a>RestorableLocationResource

Properties of the regional restorable account.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| creationTime |string| The creation time of the regional restorable database account (ISO-8601 format). |
| deletionTime |string| The time at which the regional restorable database account has been deleted (ISO-8601 format). |
| locationName |string| The location of the regional restorable account. |
| regionalDatabaseAccountInstanceId |string| The instance ID of the regional restorable account. |

## Next steps

* [List restorable collections](restorable-database-accounts-list-by-location.md) in Azure Cosmos DB API for MongoDB using REST API.
* [Resource model](continuous-backup-restore-resource-model.md) of continuous backup mode.