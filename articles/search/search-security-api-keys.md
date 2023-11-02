---
title: Connect using API keys
titleSuffix: Azure Cognitive Search
description: Learn how to use an admin or query API key for inbound access to an Azure Cognitive Search service endpoint.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 01/14/2023
---

# Connect to Cognitive Search using key authentication

Cognitive Search offers key-based authentication that you can use on connections to your search service. An API key is a unique string composed of 52 randomly generated numbers and letters. A request made to a search service endpoint will be accepted if both the request and the API key are valid.

> [!NOTE]
> A quick note about how "key" terminology is used in Cognitive Search. An "API key", which is described in this article, refers to a GUID used for authenticating a request. A separate term, "document key", refers to a unique string in your indexed content that's used to uniquely identify documents in a search index.

## Types of API keys

There are two kinds of keys used for authenticating a request:

| Type | Permission level | Maximum | How created|
|------|------------------|---------|---------|
| Admin | Full access (read-write) for all content operations | 2 <sup>1</sup>| Two admin keys, referred to as *primary* and *secondary* keys in the portal, are generated when the service is created and can be individually regenerated on demand. |
| Query | Read-only access, scoped to the documents collection of a search index | 50 | One query key is generated with the service. More can be created on demand by a search service administrator. |

<sup>1</sup> Having two allows you to roll over one key while using the second key for continued access to the service.

Visually, there's no distinction between an admin key or query key. Both keys are strings composed of 52 randomly generated alpha-numeric characters. If you lose track of what type of key is specified in your application, you can [check the key values in the portal](#find-existing-keys).

## Use API keys on connections

API keys are used for data plane (content) requests, such as creating or accessing an index or any other request that's represented in the [Search REST APIs](/rest/api/searchservice/). Upon service creation, an API key is the only authentication mechanism for data plane operations, but you can replace or supplement key authentication with [Azure roles](search-security-rbac.md) if you can't use hard-coded keys in your code.

API keys are specified on client requests to a search service. Passing a valid API key on the request is considered proof that the request is from an authorized client. If you're creating, modifying, or deleting objects, you'll need an admin API key. Otherwise, query keys are typically distributed to client applications that issue queries.

You can specify API keys in a request header for REST API calls, or in code that calls the azure.search.documents client libraries in the Azure SDKs. If you're using the Azure portal to perform tasks, your role assignment determines the [level of access](#permissions-to-view-or-manage-api-keys).

Best practices for using hard-coded keys in source files include:

+ During early development and proof-of-concept testing when security is looser, use sample or public data.

+ For mature solutions or production scenarios, switch to [Microsoft Entra ID and role-based access](search-security-rbac.md) to eliminate the need for having hard-coded keys. Or, if you want to continue using API keys, be sure to always monitor [who has access to your API keys](#secure-api-keys) and [regenerate API keys](#regenerate-admin-keys) on a regular cadence.

### [**Portal**](#tab/portal-use)

Key authentication is built in so no action is required. By default, the portal uses API keys to authenticate the request automatically. However, if you [disable API keys](search-security-rbac.md#disable-api-key-authentication) and set up role assignments, the portal uses role assignments instead.

In Cognitive Search, most tasks can be performed in Azure portal, including object creation, indexing through the Import data wizard, and queries through Search explorer.

### [**PowerShell**](#tab/azure-ps-use)

Set API keys in the request header using the following syntax:

```azurepowershell
$headers = @{
'api-key' = '<YOUR-ADMIN-OR-QUERY-API-KEY>'
'Content-Type' = 'application/json' 
'Accept' = 'application/json' }
```

A script example showing API key usage for various operations can be found at [Quickstart: Create an Azure Cognitive Search index in PowerShell using REST APIs](search-get-started-powershell.md).

### [**REST API**](#tab/rest-use)

Set an admin key in the request header using the syntax `api-key` equal to your key. Admin keys are used for most operations, including create, delete, and update. Admin keys are also used on requests issued to the search service itself, such as listing objects or requesting service statistics. see [Connect to Azure Cognitive Search using REST APIs](search-get-started-rest.md#connect-to-azure-cognitive-search) for a more detailed example.

:::image type="content" source="media/search-security-api-keys/rest-headers.png" alt-text="Screenshot of the Headers section of a request in Postman." border="true":::

Query keys are used for search, suggestion, or lookup operations that target the `index/docs` collection. For POST, set `api-key` in the request header. Or, put the key on the URI for a GET: `GET /indexes/hotels/docs?search=*&$orderby=lastRenovationDate desc&api-version=2020-06-30&api-key=[query key]`

### [**C#**](#tab/dotnet-use)

In search solutions, a key is often specified as a configuration setting and then passed as an [AzureKeyCredential](/dotnet/api/azure.azurekeycredential). See [How to use Azure.Search.Documents in a C# .NET Application](search-howto-dotnet-sdk.md) for an example.

---

> [!NOTE]  
> It's considered a poor security practice to pass sensitive data such as an `api-key` in the request URI. For this reason, Azure Cognitive Search only accepts a query key as an `api-key` in the query string. As a general rule, we recommend passing your `api-key` as a request header.

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

Use [List Admin Keys](/rest/api/searchmanagement/2022-09-01/admin-keys) or [List Query Keys](/rest/api/searchmanagement/2022-09-01/query-keys/list-by-search-service) in the Management REST API to return API keys.

You must have a [valid role assignment](#permissions-to-view-or-manage-api-keys) to return or update API keys. See [Manage your Azure Cognitive Search service with REST APIs](search-manage-rest.md) for guidance on meeting role requirements using the REST APIs.

```rest
POST https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{resource-group}}/providers//Microsoft.Search/searchServices/{{search-service-name}}/listAdminKeys?api-version=2022-09-01
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

Use [Create Query Keys](/rest/api/searchmanagement/2022-09-01/query-keys/create) in the Management REST API.

You must have a [valid role assignment](#permissions-to-view-or-manage-api-keys) to create or manage API keys. See [Manage your Azure Cognitive Search service with REST APIs](search-manage-rest.md) for guidance on meeting role requirements using the REST APIs.

```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Search/searchServices/{searchServiceName}/createQueryKey/{name}?api-version=2022-09-01
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

Note that it's not possible to use [customer-managed key encryption](search-security-manage-encryption-keys.md) to encrypt API keys. Only sensitive data within the search service itself (for example, index content or connection strings in data source object definitions) can be CMK-encrypted.

1. Navigate to your search service page in Azure portal.

1. On the left navigation pane, select **Access control (IAM)**, and then select the **Role assignments** tab.

1. In the **Role** filter, select the roles that have permission to view or manage keys (Owner, Contributor, Search Service Contributor). The resulting security principals assigned to those roles have key permissions on your search service.

1. As a precaution, also check the **Classic administrators** tab to determine whether administrators and co-administrators have access.

## See also

+ [Security in Azure Cognitive Search](search-security-overview.md)
+ [Azure role-based access control in Azure Cognitive Search](search-security-rbac.md)
+ [Manage using PowerShell](search-manage-powershell.md) 
