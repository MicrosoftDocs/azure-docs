---
title: Manage with REST
titleSuffix: Azure AI Search
description: Create and configure an Azure AI Search service with the Management REST API. The Management REST API is comprehensive in scope, with access to generally available and preview features.
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 03/13/2024
---

# Manage your Azure AI Search service with REST APIs

> [!div class="op_single_selector"]
> * [Portal](search-manage.md)
> * [PowerShell](search-manage-powershell.md)
> * [Azure CLI](search-manage-azure-cli.md)
> * [REST API](search-manage-rest.md)

In this article, learn how to create and configure an Azure AI Search service using the [Management REST APIs](/rest/api/searchmanagement/). Only the Management REST APIs are guaranteed to provide early access to [preview features](/rest/api/searchmanagement/management-api-versions). 

The Management REST API is available in stable and preview versions. Be sure to set a preview API version if you're accessing preview features.

> [!div class="checklist"]
> * [Create or update a service](#create-or-update-a-service)
> * [Enable Azure role-based access control for data plane](#enable-rbac)
> * [Enforce a customer-managed key policy](#enforce-cmk)
> * [Disable semantic ranking](#disable-semantic-search)
> * [Disable workloads that push data to external resources](#disable-external-access)
> * [Create a query key](#create-query-api-keys)
> * [Regenerate an admin key](#regenerate-admin-api-keys)
> * [List private endpoint connections](#list-private-endpoint-connections)
> * [List search operations](#list-search-operations)
> * [Delete a search services](#delete-a-search-service)

All of the Management REST APIs have examples. If a task isn't covered in this article, see the [API reference](/rest/api/searchmanagement/) instead.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-search/).

* [Visual Studio Code](https://code.visualstudio.com/download) with a [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).

* [Azure CLI](/cli/azure/install-azure-cli) used to get an access token. You must be an owner or administrator in your Azure subscription.

## Get an access token

Management REST API calls are authenticated through Microsoft Entra ID. You need to provide an access token on the request, along with permissions to create and configure a resource.

You can use the [Azure CLI or Azure PowerShell to create an access token](/azure/azure-resource-manager/management/manage-resources-rest).

1. Open a command shell for Azure CLI.

1. Sign in to your Azure subscription.

   ```azurecli
   az login
   ```

1. Get the tenant ID and subscription ID. If you have multiple tenants or subscriptions, make sure you use the correct one.

   ```azurecli
   az account show
   ````

1. Get an access token.

   ```azurecli
   az account get-access-token --query accessToken --output tsv
   ```

## Set up Visual Studio Code

If you're not familiar with the REST client for Visual Studio Code, this section includes setup so that you can complete the tasks in this quickstart.

1. Start Visual Studio Code and select the **Extensions** tile.

1. Search for the REST client and select **Install**.

   :::image type="content" source="media/search-get-started-rest/rest-client-install.png" alt-text="Screenshot of the install command.":::

1. Open or create new file named with either a `.rest` or `.http` file extension.

1. Provide variables for the values you retrieved in the previous step.

   ```http
   @tenantId = PASTE-YOUR-TENANT-ID-HERE
   @subscriptionId = PASTE-YOUR-SUBSCRIPTION-ID-HERE
   @token = PASTE-YOUR-TOKEN-HERE
   ```

1. Verify the session is operational by listing search services in your subscription.

   ```http
    ### List search services
    GET https://management.azure.com/subscriptions/{{subscriptionId}}/providers/Microsoft.Search/searchServices?api-version=2023-11-01
         Content-type: application/json
         Authorization: Bearer {{token}}
    ```

1. Select **Send request**. A response should appear in an adjacent pane. If you have existing search services, they're listed. Otherwise, the list is empty, but as long as the HTTP code is 200 OK, you're ready for the next steps.

    ```http
    HTTP/1.1 200 OK
    Cache-Control: no-cache
    Pragma: no-cache
    Content-Length: 22068
    Content-Type: application/json; charset=utf-8
    Expires: -1
    x-ms-ratelimit-remaining-subscription-reads: 11999
    x-ms-request-id: f47d3562-a409-49d2-b9cd-6a108e07304c
    x-ms-correlation-request-id: f47d3562-a409-49d2-b9cd-6a108e07304c
    x-ms-routing-request-id: WESTUS2:20240314T012052Z:f47d3562-a409-49d2-b9cd-6a108e07304c
    Strict-Transport-Security: max-age=31536000; includeSubDomains
    X-Content-Type-Options: nosniff
    X-Cache: CONFIG_NOCACHE
    X-MSEdge-Ref: Ref A: 12401F1160FE4A3A8BB54D99D1FDEE4E Ref B: CO6AA3150217011 Ref C: 2024-03-14T01:20:52Z
    Date: Thu, 14 Mar 2024 01:20:52 GMT
    Connection: close
    
    {
      "value": [ . . . ]
    }
    ```

## Create or update a service

Creates or updates a search service under the current subscription. This example uses variables for the search service name and region, which haven't been defined yet. Either provide the names directly, or add new variables to the collection.

```http
### Create a search service (provide an existing resource group)
@resource-group = my-rg
@search-service-name = my-search
PUT https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2023-11-01 HTTP/1.1
     Content-type: application/json
     Authorization: Bearer {{token}}

    {
        "location": "North Central US",
        "sku": {
            "name": "basic"
        },
        "properties": {
            "replicaCount": 1,
            "partitionCount": 1,
            "hostingMode": "default"
        }
      }
```

## Create an S3HD service

To create an [S3HD](search-sku-tier.md#tier-descriptions) service, use a combination of `sku` and `hostingMode` properties. Set `sku` to `standard3` and "hostingMode" to `HighDensity`.

```http
@resource-group = my-rg
@search-service-name = my-search
PUT https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2023-11-01 HTTP/1.1
     Content-type: application/json
     Authorization: Bearer {{token}}

    {
        "location": "{{region}}",
        "sku": {
          "name": "standard3"
        },
        "properties": {
          "replicaCount": 1,
          "partitionCount": 1,
          "hostingMode": "HighDensity"
        }
    }
```

<a name="enable-rbac"></a>

## Configure role-based access for data plane

**Applies to:** Search Index Data Contributor, Search Index Data Reader, Search Service Contributor

In this step, configure your search service to recognize an **authorization** header on data requests that provide an OAuth2 access token.

To use role-based access control for data plane operations, set `authOptions` to `aadOrApiKey` and then send the request.

To use role-based access control exclusively, [turn off API key authentication](search-security-rbac.md#disable-api-key-authentication) by following up with a second request, this time setting `disableLocalAuth` to true.

```http
PATCH https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2023-11-01 HTTP/1.1
     Content-type: application/json
     Authorization: Bearer {{token}}

    {
        "properties": {
            "disableLocalAuth": false,
            "authOptions": {
                "aadOrApiKey": {
                    "aadAuthFailureMode": "http401WithBearerChallenge"
                }
            }
        }
    }
```

<a name="enforce-cmk"></a>

## Enforce a customer-managed key policy

If you're using [customer-managed encryption](search-security-manage-encryption-keys.md), you can enable "encryptionWithCMK" with "enforcement" set to "Enabled" if you want the search service to report its compliance status.

When you enable this policy, any REST calls that create objects containing sensitive data, such as the connection string within a data source, will fail if an encryption key isn't provided: `"Error creating Data Source: "CannotCreateNonEncryptedResource: The creation of non-encrypted DataSources is not allowed when encryption policy is enforced."`

```http
PATCH https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2023-11-01 HTTP/1.1
     Content-type: application/json
     Authorization: Bearer {{token}}
     
     {
        "properties": {
            "encryptionWithCmk": {
            "enforcement": "Disabled",
            "encryptionComplianceStatus": "Compliant"
            },
        }
    }
```

<a name="disable-semantic-search"></a>

## Disable semantic ranking

Although [semantic ranking isn't enabled](semantic-how-to-enable-disable.md) by default, you could lock down the feature at the service level.

```http
### disable semantic ranking
PATCH https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2023-11-01 HTTP/1.1
     Content-type: application/json
     Authorization: Bearer {{token}}
     
     {
        "properties": {
            "semanticSearch": "Disabled"
        }
    }
```

<a name="disable-external-access"></a>

## Disable workloads that push data to external resources

Azure AI Search [writes to external data sources](search-indexer-securing-resources.md) when updating a knowledge store, saving debug session state, or caching enrichments. The following example disables these workloads at the service level.

```http
### disable-external-access
PATCH https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2023-11-01 HTTP/1.1
     Content-type: application/json
     Authorization: Bearer {{token}}
     
     {
        "properties": {
            "publicNetworkAccess": "Disabled"
        }
    }
```

## Delete a search service

```http
### delete a search service
DELETE https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2023-11-01 HTTP/1.1
     Content-type: application/json
     Authorization: Bearer {{token}}
```

## List admin API keys

```http
### List admin keys
POST https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}/listAdminKeys?api-version=2023-11-01 HTTP/1.1
     Content-type: application/json
     Authorization: Bearer {{token}}
```

## Regenerate admin API keys

You can only regenerate one admin API key at a time.
```http
### Regnerate admin keys
POST https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}/regenerateAdminKey/primary?api-version=2023-11-01 HTTP/1.1
     Content-type: application/json
     Authorization: Bearer 
```

## Create query API keys

```http
### Create a query key
@query-key-name = myQueryKey
POST https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}/createQueryKey/{name}?api-version=2023-11-01 HTTP/1.1
     Content-type: application/json
     Authorization: Bearer {{token}}
```

## List private endpoint connections

```http
### List private endpoint connections
GET https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}/privateEndpointConnections?api-version=2023-11-01 HTTP/1.1
     Content-type: application/json
     Authorization: Bearer {{token}}
```

## List search operations

```http
### List search operations
GET https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups?api-version=2021-04-01 HTTP/1.1
  Content-type: application/json
  Authorization: Bearer {{token}}
```

## Next steps

After a search service is configured, next steps include [create an index](search-how-to-create-search-index.md) or [query an index](search-query-overview.md) using the portal, REST APIs, or an Azure SDK.

* [Create an Azure AI Search index in the Azure portal](search-get-started-portal.md)
* [Set up an indexer to load data from other services](search-indexer-overview.md)
* [Query an Azure AI Search index using Search explorer in the Azure portal](search-explorer.md)
* [How to use Azure AI Search in .NET](search-howto-dotnet-sdk.md)
