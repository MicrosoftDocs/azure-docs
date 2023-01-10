---
title: Connect with API keys
titleSuffix: Azure Cognitive Search
description: Learn how to use an admin or query API key for inbound access to an Azure Cognitive Search service endpoint.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 01/10/2023
---

# Connect to Cognitive Search using key authentication

Cognitive Search offers key-based authentication that you can use on connections to your search service. An API key is a unique string composed of 52 randomly generated numbers and letters. A request made to a search service endpoint will be accepted if both the request and the API key are valid.

API keys are frequently used when making REST API calls to a search service. You can also use them in search solutions if Azure Active Directory isn't an option.

> [!NOTE]
> A quick note about "key" terminology in Cognitive Search. An "API key", which is described in this article, refers to a GUID used for authenticating a request. A "document key" refers to a unique string in your indexed content that's used to uniquely identify documents in a search index. API keys and document keys are unrelated.

## What's an API key?

There are two kinds of keys used for authenticating a request:

| Type | Permission level | Maximum | How created|
|------|------------------|---------|---------|
| Admin | Full access (read-write) for all content operations | 2 <sup>1</sup>| Two admin keys, referred to as *primary* and *secondary* keys in the portal, are generated when the service is created and can be individually regenerated on demand. |
| Query | Read-only access, scoped to the documents collection of a search index | 50 | One query key is generated with the service. More can be created on demand by a search service administrator. |

<sup>1</sup>  Having two allows you to roll over one key while using the second key for continued access to the service.

Visually, there's no distinction between an admin key or query key. Both keys are strings composed of 52 randomly generated alpha-numeric characters. If you lose track of what type of key is specified in your application, you can [check the key values in the portal](#find-existing-keys).

## Use API keys on connections

API keys are specified on client requests to a search service. Passing a valid API key on the request is considered proof that the request is from an authorized client. If you're creating, modifying, or deleting objects, you'll need an admin API key. Otherwise, query keys are typically distributed to client applications that issue queries.

You can specify API keys in a request header for REST API calls, or in code that calls the azure.search.documents client libraries in the Azure SDKs. If you're using the Azure portal to perform tasks, your role assignment determines the level of access.

Best practices for using hard-coded in source files include:

+ During early development and proof-of-concept testing when security is looser, use sample or public data.

+ After advancing into deeper development or production scenarios, switch to [Azure Active Directory and role-based access](search-security-rbac.md) to eliminate the need for having hard-coded keys. Or, if you want to continue using API keys, be sure to always monitor who has access to your API keys and regenerate API keys on a regular cadence.

### [**REST**](#tab/rest-use)

+ Admin keys are only specified in HTTP request headers. You can't place an admin API key in a URL. See [Connect to Azure Cognitive Search using REST APIs](search-get-started-rest.md#connect-to-azure-cognitive-search) for an example that specifies an admin API key on a REST call.

+ Query keys are also specified in an HTTP request header for search, suggestion, or lookup operation that use POST.

  Alternatively, you can pass a query key  as a parameter on a URL if you're using GET: `GET /indexes/hotels/docs?search=*&$orderby=lastRenovationDate desc&api-version=2020-06-30&api-key=[query key]`

### [**Azure PowerShell**](#tab/azure-ps-use)

A script example showing API key usage can be found at [Quickstart: Create an Azure Cognitive Search index in PowerShell using REST APIs](search-get-started-powershell.md).

### [**.NET**](#tab/dotnet-use)

In search solutions, a key is often specified as a configuration setting and then passed as an [AzureKeyCredential](/dotnet/api/azure.azurekeycredential). See [How to use Azure.Search.Documents in a C# .NET Application](search-howto-dotnet-sdk.md) for an example.

---

> [!NOTE]  
> It's considered a poor security practice to pass sensitive data such as an `api-key` in the request URI. For this reason, Azure Cognitive Search only accepts a query key as an `api-key` in the query string. As a general rule, we recommend passing your `api-key` as a request header.  

## Find existing keys

You can view and manage API keys in the [Azure portal](https://portal.azure.com), or through [PowerShell](/powershell/module/az.search), [Azure CLI](/cli/azure/search), or [REST API](/rest/api/searchmanagement/).

### [**Azure portal**](#tab/portal-find)

1. Sign in to the [Azure portal](https://portal.azure.com) and [find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices).

1. Under **Settings**, select **Keys** to view admin and query keys.

:::image type="content" source="media/search-manage/azure-search-view-keys.png" alt-text="Screenshot of a portal page showing API keys." border="true":::

### [**REST**](#tab/rest-find)

Use [ListAdminKeys](/rest/api/searchmanagement/2020-08-01/admin-keys) or [ListQueryKeys](/rest/api/searchmanagement/2020-08-01/query-keys/list-by-search-service) in the Management REST API to return API keys.

You must have a [valid role assignment](#permissions-to-view-or-manage-api-keys) to return or update API keys. See [Manage your Azure Cognitive Search service with REST APIs](search-manage-rest.md) for guidance on meeting role requirements using the REST APIs.

```rest
POST https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{resource-group}}/providers//Microsoft.Search/searchServices/{{search-service-name}}/listAdminKeys?api-version=2021-04-01-preview
```

---

## Create query keys

Query keys are used for read-only access to documents within an index for operations targeting a documents collection. Search, filter, and suggestion queries are all operations that take a query key. Any read-only operation that returns system data or object definitions, such as an index definition or indexer status, requires an admin key.

Restricting access and operations in client apps is essential to safeguarding the search assets on your service. Always use a query key rather than an admin key for any query originating from a client app.

### [**Azure portal**](#tab/portal-query)

1. Sign in to the [Azure portal](https://portal.azure.com) and [find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices).

1. Under **Settings**, select **Keys** to view API keys.

1. Under **Manage query keys**, use the query key already generated for your service, or create new query keys. The default query key isn't named, but other generated query keys can be named for manageability.

   :::image type="content" source="media/search-security-overview/create-query-key.png" alt-text="Screenshot of the query key management options." border="true":::

### [**Azure CLI**](#tab/azure-cli-query)

A script example showing query key usage can be found at [Create or delete query keys](search-manage-azure-cli.md#create-or-delete-query-keys).

### [**.NET**](#tab/dotnet-query)

A code example showing query key usage can be found in [DotNetHowTo](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo).

---

<a name="regenerate-admin-keys"></a>

## Regenerate admin keys

Two admin keys are created for each service so that you can rotate a primary key while using the secondary key for business continuity.

1. In the **Settings** > **Keys** page, copy the secondary key.

1. For all applications, update the API key settings to use the secondary key.

1. Regenerate the primary key.

1. Update all applications to use the new primary key.

If you inadvertently regenerate both keys at the same time, all client requests using those keys will fail with HTTP 403 Forbidden. However, content isn't deleted and you aren't locked out permanently. 

You can still access the service through the portal or programmatically. Management functions are operative through a subscription ID not a service API key, and are thus still available even if your API keys aren't. 

After you create new keys via portal or management layer, access is restored to your content (indexes, indexers, data sources, synonym maps) once you provide those keys on requests.

## Permissions to view or manage API keys

Permissions for viewing and managing API keys is conveyed through [role assignments](search-security-rbac.md). Members of the following roles can view and regenerate keys:

+ Administrator and co-administrator (classic)
+ Owner
+ Contributor
+ [Search Service Contributors](../role-based-access-control/built-in-roles.md#search-service-contributor) 

The following roles don't have access to API keys:

+ Reader
+ Search Index Data Contributor
+ Search Index Data Reader

## Secure API key access

Use role assignments to restrict access to API keys.

Note that it's not possible to use [customer-managed key encryption](search-security-manage-encryption-keys.md) to encrypt API keys. Only sensitive data within the search service itself (for example, index content or connection strings in data source object definitions) can be CMK-encrypted.

1. Navigate to your search service page in Azure portal.

1. On the left navigation pane, select **Access control (IAM)**, and then select the **Role assignments** tab.

1. In the **Role** filter, select the roles that have permission to view or manage keys (Owner, Contributor, Search Service Contributor). The resulting security principals assigned to those roles have key permissions on your search service.

1. As a precaution, also check the **Classic administrators** tab for administrators and co-administrators.

## See also

+ [Security in Azure Cognitive Search](search-security-overview.md)
+ [Azure role-based access control in Azure Cognitive Search](search-security-rbac.md)
+ [Manage using PowerShell](search-manage-powershell.md) 