---
title: Connect using API keys
titleSuffix: Azure AI Search
description: Learn how to use an admin or query API key for inbound access to an Azure AI Search service endpoint.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 04/22/2024
---

# Connect to Azure AI Search using key authentication

Azure AI Search offers key-based authentication that you can use on connections to your search service. An API key is a unique string composed of 52 randomly generated numbers and letters. A request made to a search service endpoint is accepted if both the request and the API key are valid.

Key-based authentication is the default. You can disable it if you opt in for role-based authentication.

> [!NOTE]
> A quick note about *key* terminology. An *API key* is a GUID used for authentication. A separate term, *document key* is a unique string in your indexed content that uniquely identifies documents in a search index.

## Types of API keys

There are two kinds of keys used for authenticating a request:

| Type | Permission level | Maximum | How created|
|------|------------------|---------|---------|
| Admin | Full access (read-write) for all content operations | 2 <sup>1</sup>| Two admin keys, referred to as *primary* and *secondary* keys in the portal, are generated when the service is created and can be individually regenerated on demand. |
| Query | Read-only access, scoped to the documents collection of a search index | 50 | One query key is generated with the service. More can be created on demand by a search service administrator. |

<sup>1</sup> Having two allows you to roll over one key while using the second key for continued access to the service.

Visually, there's no distinction between an admin key or query key. Both keys are strings composed of 52 randomly generated alpha-numeric characters. If you lose track of what type of key is specified in your application, you can [check the key values in the portal](#find-existing-keys).

## Use API keys on connections

API keys are used for data plane (content) requests, such as creating or accessing an index or, any other request that's represented in the [Search REST APIs](/rest/api/searchservice/). Upon service creation, an API key is the only authentication mechanism for data plane operations, but you can replace or supplement key authentication with [Azure roles](search-security-rbac.md) if you can't use hard-coded keys in your code.

Admin keys are used for creating, modifying, or deleting objects. Admin keys are also used to GET object definitions and system information.

Query keys are typically distributed to client applications that issue queries.

### [**REST API**](#tab/rest-use)

**How API keys are used in REST calls**:

Set an admin key in the request header. You can't pass admin keys on the URI or in the body of the request. Admin keys are used for create-read-update-delete operation and on requests issued to the search service itself, such as [LIST Indexes](/rest/api/searchservice/indexes/list) or [GET Service Statistics](/rest/api/searchservice/get-service-statistics/get-service-statistics).

Here's an example of admin API key usage on a create index request:

```http
### Create an index
POST {{baseUrl}}/indexes?api-version=2023-11-01  HTTP/1.1
  Content-Type: application/json
  api-key: {{adminApiKey}}

    {
        "name": "my-new-index",  
        "fields": [
            {"name": "docId", "type": "Edm.String", "key": true, "filterable": true},
            {"name": "Name", "type": "Edm.String", "searchable": true }
         ]
   }
```

Set a query key in a request header for POST, or on the URI for GET. Query keys are used for operations that target the `index/docs` collection: [Search Documents](/rest/api/searchservice/documents/search-get), [Autocomplete](/rest/api/searchservice/documents/autocomplete-get), [Suggest](/rest/api/searchservice/documents/suggest-get), or [GET Document](/rest/api/searchservice/documents/get). 

Here's an example of query API key usage on a Search Documents (GET) request:

```http
### Query an index
GET /indexes/my-new-index/docs?search=*&api-version=2023-11-01&api-key={{queryApiKey}}
```

> [!NOTE]  
> It's considered a poor security practice to pass sensitive data such as an `api-key` in the request URI. For this reason, Azure AI Search only accepts a query key as an `api-key` in the query string. As a general rule, we recommend passing your `api-key` as a request header.

### [**PowerShell**](#tab/azure-ps-use)

**How API keys are used in PowerShell**:

Set API keys in the request header using the following syntax:

```azurepowershell
$headers = @{
'api-key' = '<YOUR-ADMIN-OR-QUERY-API-KEY>'
'Content-Type' = 'application/json' 
'Accept' = 'application/json' }
```

A script example showing API key usage for various operations can be found at [Quickstart: Create an Azure AI Search index in PowerShell using REST APIs](search-get-started-powershell.md).

### [**Portal**](#tab/portal-use)

**How API keys are used in the Azure portal**:

+ Key authentication is built in. By default, the portal tries API keys first. However, if you [disable API keys](search-security-rbac.md#disable-api-key-authentication) and set up role assignments, the portal uses role assignments instead.

---

## Permissions to view or manage API keys

Permissions for viewing and managing API keys are conveyed through [role assignments](search-security-rbac.md). Members of the following roles can view and regenerate keys:

+ Owner
+ Contributor
+ [Search Service Contributor](../role-based-access-control/built-in-roles.md#search-service-contributor)
+ Administrator and co-administrator (classic)

The following roles don't have access to API keys:

+ Reader
+ Search Index Data Contributor
+ Search Index Data Reader

## Find existing keys

You can view and manage API keys in the [Azure portal](https://portal.azure.com), or through [PowerShell](/powershell/module/az.search), [Azure CLI](/cli/azure/search), or [REST API](/rest/api/searchmanagement/).

### [**Portal**](#tab/portal-find)

1. Sign in to the [Azure portal](https://portal.azure.com) and [find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices).

1. Under **Settings**, select **Keys** to view admin and query keys.

:::image type="content" source="media/search-manage/azure-search-view-keys.png" alt-text="Screenshot of a portal page showing API keys." border="true":::

### [**PowerShell**](#tab/azure-ps-find)

1. Install the `Az.Search` module:

   ```azurepowershell
   Install-Module Az.Search
   ```

1. Return admin keys:

   ```azurepowershell
   Get-AzSearchAdminKeyPair -ResourceGroupName <resource-group-name> -ServiceName <search-service-name>
   ```

1. Return query keys:

   ```azurepowershell
   Get-AzSearchQueryKey -ResourceGroupName <resource-group-name> -ServiceName <search-service-name>
   ```

### [**Azure CLI**](#tab/azure-cli-find)

Use the following commands to return admin and query API keys, respectively:

```azurecli
az search admin-key show --resource-group <myresourcegroup> --service-name <myservice>

az search query-key list --resource-group <myresourcegroup> --service-name <myservice>
```

### [**REST API**](#tab/rest-find)

Use [List Admin Keys](/rest/api/searchmanagement/admin-keys/get) or [List Query Keys](/rest/api/searchmanagement/query-keys/list-by-search-service) in the Management REST API to return API keys.

You must have a [valid role assignment](#permissions-to-view-or-manage-api-keys) to return or update API keys. See [Manage your Azure AI Search service with REST APIs](search-manage-rest.md) for guidance on meeting role requirements using the REST APIs.

```rest
POST https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{resource-group}}/providers//Microsoft.Search/searchServices/{{search-service-name}}/listAdminKeys?api-version=2023-11-01
```

---

## Create query keys

Query keys are used for read-only access to documents within an index for operations targeting a documents collection. Search, filter, and suggestion queries are all operations that take a query key. Any read-only operation that returns system data or object definitions, such as an index definition or indexer status, requires an admin key.

Restricting access and operations in client apps is essential to safeguarding the search assets on your service. Always use a query key rather than an admin key for any query originating from a client app.

### [**Portal**](#tab/portal-query)

1. Sign in to the [Azure portal](https://portal.azure.com) and [find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices).

1. Under **Settings**, select **Keys** to view API keys.

1. Under **Manage query keys**, use the query key already generated for your service, or create new query keys. The default query key isn't named, but other generated query keys can be named for manageability.

   :::image type="content" source="media/search-security-overview/create-query-key.png" alt-text="Screenshot of the query key management options." border="true":::

### [**PowerShell**](#tab/azure-ps-query)

A script example showing API key usage can be found at [Create or delete query keys](search-manage-powershell.md#create-or-delete-query-keys).

### [**Azure CLI**](#tab/azure-cli-query)

A script example showing query key usage can be found at [Create or delete query keys](search-manage-azure-cli.md#create-or-delete-query-keys).

### [**REST API**](#tab/rest-query)

Use [Create Query Keys](/rest/api/searchmanagement/query-keys/create) in the Management REST API.

You must have a [valid role assignment](#permissions-to-view-or-manage-api-keys) to create or manage API keys. See [Manage your Azure AI Search service with REST APIs](search-manage-rest.md) for guidance on meeting role requirements using the REST APIs.

```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Search/searchServices/{searchServiceName}/createQueryKey/{name}?api-version=2023-11-01
```

---

<a name="regenerate-admin-keys"></a>

## Regenerate admin keys

Two admin keys are created for each service so that you can rotate a primary key while using the secondary key for business continuity.

1. Under **Settings**, select **Keys**, then copy the secondary key.

1. For all applications, update the API key settings to use the secondary key.

1. Regenerate the primary key.

1. Update all applications to use the new primary key.

If you inadvertently regenerate both keys at the same time, all client requests using those keys will fail with HTTP 403 Forbidden. However, content isn't deleted and you aren't locked out permanently. 

You can still access the service through the portal or programmatically. Management functions are operative through a subscription ID not a service API key, and are thus still available even if your API keys aren't. 

After you create new keys via portal or management layer, access is restored to your content (indexes, indexers, data sources, synonym maps) once you provide those keys on requests.

## Secure API keys

Use role assignments to restrict access to API keys.

It's not possible to use [customer-managed key encryption](search-security-manage-encryption-keys.md) to encrypt API keys. Only sensitive data within the search service itself (for example, index content or connection strings in data source object definitions) can be CMK-encrypted.

1. Navigate to your search service page in Azure portal.

1. On the left navigation pane, select **Access control (IAM)**, and then select the **Role assignments** tab.

1. In the **Role** filter, select the roles that have permission to view or manage keys (Owner, Contributor, Search Service Contributor). The resulting security principals assigned to those roles have key permissions on your search service.

1. As a precaution, also check the **Classic administrators** tab to determine whether administrators and co-administrators have access.

## Best practices

+ Only use API keys if data disclosure isn't a risk (for example, when using sample data) and if you're operating behind a firewall. Exposure of API keys is a risk to both data and to unauthorized use of your search service. 

+ Always check code, samples, and training material before publishing to make sure you didn't leave valid API keys behind.

+ For production workloads, switch to [Microsoft Entra ID and role-based access](search-security-rbac.md). Or, if you want to continue using API keys, be sure to always monitor [who has access to your API keys](#secure-api-keys) and [regenerate API keys](#regenerate-admin-keys) on a regular cadence.

## See also

+ [Security in Azure AI Search](search-security-overview.md)
+ [Azure role-based access control in Azure AI Search](search-security-rbac.md)
+ [Manage using PowerShell](search-manage-powershell.md) 
