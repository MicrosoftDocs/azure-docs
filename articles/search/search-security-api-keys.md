---
title: API key authentication
titleSuffix: Azure Cognitive Search
description: Learn how to use an admin or query API key for inbound access to an Azure Cognitive Search service endpoint.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 01/09/2023
---

# Connect to Cognitive Search using key authentication

Cognitive Search offers key-based authentication that you can use on connections to your search service. An API key is a unique string composed of randomly generated numbers and letters. A request made to a search service endpoint will be accepted if both the request and the API key are valid.

There are two kinds of keys:

| Type | Permission level | Maximum | Managed |
|------|------------------|---------|---------|
| Admin | Read-write | 2 | Two admin keys, referred to as *primary* and *secondary* keys in the portal, are generated when the service is created and can be individually regenerated on demand. Having two keys allows you to roll over one key while using the second key for continued access to the service. |
| Query | Read-only, scoped to the documents collection of a search index | 50 | One query key is generated with the service. More keys can be created on demand by a search service administrator. Query keys are typically distributed to client applications that issue search requests.|

Visually, there's no distinction between an admin key or query key. Both keys are strings composed of 52 randomly generated alpha-numeric characters. If you lose track of what type of key is specified in your application, you can [check the key values in the portal](#find-existing-keys).

> [!NOTE]
> A note about "key" terminology in Cognitive Search. An "API key" refers to a service-generated GUID string used for authentication. A "document key" refers to a unique string in your searchable content that's used to identify documents in a search index. API keys and document keys are unrelated.

## Using API keys in search

Two admin API keys and one query API key are generated when the service created. Passing a valid API key on the request is considered proof that the request is from an authorized client. 

You can specify API keys in REST API calls, or in code that calls the azure.search.documents client libraries in the Azure SDKs.

Because API keys are hard-coded in source files, it's recommended that you take appropriate precautions:

+ During proof-of-concept testing, use API keys when evaluating Cognitive Search with sample data or obfuscated data. You can then switch to [Azure Active Directory and role-based access](search-security-rbac.md) to eliminate the need for hard-coded keys.

+ Encrypt API keys with [customer-managed keys]((search-security-manage-encryption-keys.md)) to ensure key values and other sensitive data isn't human readable.

### REST APIs

Admin keys are only specified in HTTP request headers. You can't place an admin API key in a URL.

Query keys can be specified in an HTTP request header for search, suggestion, or lookup operation. Alternatively, you can pass a query key  as a parameter on a URL. Depending on how your client application formulates the request, it might be easier to pass the key as a query parameter: `GET /indexes/hotels/docs?search=*&$orderby=lastRenovationDate desc&api-version=2020-06-30&api-key=[query key]`

### Azure SDKs

In search solutions, a key is often specified as a configuration setting and then passed as an [AzureKeyCredential](/dotnet/api/azure.azurekeycredential).

> [!NOTE]  
> It's considered a poor security practice to pass sensitive data such as an `api-key` in the request URI. For this reason, Azure Cognitive Search only accepts a query key as an `api-key` in the query string, and you should avoid doing so unless the contents of your index should be publicly available. As a general rule, we recommend passing your `api-key` as a request header.  

## Find existing keys

:::image type="content" source="media/search-manage/azure-search-view-keys.png" alt-text="Portal page, retrieve settings, keys section" border="false":::

You can view and manage API keys in the [Azure portal](https://portal.azure.com), or through [PowerShell](/powershell/module/az.search), [Azure CLI](/cli/azure/search), or [REST API](/rest/api/searchmanagement/).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. List the [search services](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) for your subscription.
1. Select the service and on the Overview page, select **Settings** >**Keys** to view admin and query keys.

   :::image type="content" source="media/search-security-overview/settings-keys.png" alt-text="Portal page, view settings, keys section" border="false":::

## Create query keys

Query keys are used for read-only access to documents within an index for operations targeting a documents collection. Search, filter, and suggestion queries are all operations that take a query key. Any read-only operation that returns system data or object definitions, such as an index definition or indexer status, requires an admin key.

Restricting access and operations in client apps is essential to safeguarding the search assets on your service. Always use a query key rather than an admin key for any query originating from a client app.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. List the [search services](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices)  for your subscription.
3. Select the service and on the Overview page, select **Settings** >**Keys**.
4. Select **Manage query keys**.
5. Use the query key already generated for your service, or create new query keys. The default query key isn't named, but other generated query keys can be named for manageability.

   :::image type="content" source="media/search-security-overview/create-query-key.png" alt-text="Create or use a query key" border="false":::

> [!NOTE]
> A code example showing query key usage can be found in [DotNetHowTo](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo).

<a name="regenerate-admin-keys"></a>

## Regenerate admin keys

Two admin keys are created for each service so that you can rotate a primary key, using the secondary key for business continuity.

1. In the **Settings** >**Keys** page, copy the secondary key.
2. For all applications, update the API key settings to use the secondary key.
3. Regenerate the primary key.
4. Update all applications to use the new primary key.

If you inadvertently regenerate both keys at the same time, all client requests using those keys will fail with HTTP 403 Forbidden. However, content isn't deleted and you aren't locked out permanently. 

You can still access the service through the portal or programmatically. Management functions are operative through a subscription ID not a service API key, and are thus still available even if your API keys aren't. 

After you create new keys via portal or management layer, access is restored to your content (indexes, indexers, data sources, synonym maps) once you provide those keys on requests.

## Secure API key access

[Role assignments](search-security-rbac.md) determine who can read and manage keys. Members of the following roles can view and regenerate keys: Owner, Contributor, [Search Service Contributors](../role-based-access-control/built-in-roles.md#search-service-contributor). The Reader role doesn't have access to API keys.

Subscription administrators can view and regenerate all API keys. As a precaution, review role assignments to understand who has access to the admin keys.

1. Navigate to your search service page in Azure portal.
1. On the left navigation pane, select **Access control (IAM)**, and then select the **Role assignments** tab.
1. Set **Scope** to **This resource** to view role assignments for your service.

If you're considering [customer-managed encryption](search-security-manage-encryption-keys.md), all sensitive data in the encrypted object will be encrypted. It's not possible to encrypt just the API key.

## See also

+ [Security in Azure Cognitive Search](search-security-overview.md)
+ [Azure role-based access control in Azure Cognitive Search](search-security-rbac.md)
+ [Manage using PowerShell](search-manage-powershell.md) 