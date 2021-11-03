---
title: Role-based authorization
titleSuffix: Azure Cognitive Search
description: Use Azure role-based access control (Azure RBAC) for granular permissions on service administration and content tasks.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 09/22/2021
---

# Use role-based authorization in Azure Cognitive Search

Azure provides a global [role-based access control (RBAC) authorization system](../role-based-access-control/role-assignments-portal.md) for all services running on the platform. In Cognitive Search, you can use roles in the following ways:

+ Use generally available roles for service administration.

+ Use new preview roles for content management (creating and managing indexes and other top-level objects), [**available by request**](https://aka.ms/azure-cognitive-search/rbac-preview).

> [!NOTe]
> Search Service Contributor is a "generally available" role that has "preview" capabilities. It's the only role that supports a true hybrid of service and content management tasks, allowing all operations on a given search service. To get the preview capabilities of content management on this role, [**sign up for the preview**](https://aka.ms/azure-cognitive-search/rbac-preview).

A few RBAC scenarios are **not** supported, or not covered in this article:

+ Outbound indexer connections are documented in ["Set up an indexer connection to a data source using a managed identity"](search-howto-managed-identities-data-sources.md). For a search service that has a managed identity assigned to it, you can create roles assignments that allow external data services, such as Azure Blob Storage, read-access on blobs by your trusted search service.

+ [Custom roles](../role-based-access-control/custom-roles.md) are not supported.

+ User identity access over search results (sometimes referred to as row-level security or document-level security) is not supported. For document-level security, a workaround is to use [security filters](search-security-trimming-for-azure-search.md) to trim results by user identity, removing documents for which the requestor should not have access.

## Built-in roles used in Search

In Cognitive Search, built-in roles include generally available and preview roles, whose assigned membership consists of Azure Active Directory users and groups.

Role assignments are cumulative and pervasive across all tools and client libraries used to create or manage a search service. These clients include the Azure portal, Management REST API, Azure PowerShell, Azure CLI, and the management client library of Azure SDKs.

Roles apply to the search service as a whole and must be assigned by an Owner. You cannot assign roles to specific indexes or other top-level objects.

There are no regional, tier, or pricing restrictions for using RBAC on Azure Cognitive Search, but your search service must be in the Azure public cloud.

| Role | Applies to | Description |
| ---- | ---------- | ----------- |
| [Owner](../role-based-access-control/built-in-roles.md#owner) | Service ops (generally available) | Full access to the search resource, including the ability to assign Azure roles. Subscription administrators are members by default. |
| [Contributor](../role-based-access-control/built-in-roles.md#contributor) | Service ops (generally available) | Same level of access as Owner, minus the ability to assign roles or change authorization options. |
| [Reader](../role-based-access-control/built-in-roles.md#reader) | Service ops (generally available) | Limited access to partial service information. In the portal, the Reader role can access information in the service Overview page, in the Essentials section and under the Monitoring tab. All other tabs and pages are off limits. </br></br>This role has access to service information: resource group, service status, location, subscription name and ID, tags, URL, pricing tier, replicas, partitions, and search units. </br></br>This role also has access to service metrics: search latency, percentage of throttled requests, average queries per second. </br></br>There is no access to API keys, role assignments, content (indexes or synonym maps), or content metrics (storage consumed, number of objects). |
| [Search Service Contributor](../role-based-access-control/built-in-roles.md#search-service-contributor) | Service ops (generally available), and top-level objects (preview) | This role is a combination of Contributor at the service-level, but with full access to all actions on indexes, synonym maps, indexers, data sources, and skillsets through [`Microsoft.Search/searchServices/*`](/azure/role-based-access-control/resource-provider-operations#microsoftsearch). This role is for search service administrators who need to fully manage the service. </br></br>Like Contributor, members of this role cannot make or manage role assignments or change authorization options. |
| [Search Index Data Contributor](../role-based-access-control/built-in-roles.md#search-index-data-contributor) | Documents collection (preview) | Provides full access to content in all indexes on the search service. This role is for developers or index owners who need to import, refresh, or query the documents collection of an index. |
| [Search Index Data Reader](../role-based-access-control/built-in-roles.md#search-index-data-reader) | Documents collection (preview) | Provides read-only access to search indexes on the search service. This role is for apps and users who run queries. |

> [!NOTE]
> Azure resources have the concept of [control plane and data plane](../azure-resource-manager/management/control-plane-and-data-plane.md) categories of operations. In Cognitive Search, "control plane" refers to any operation supported in the [Management REST API](/rest/api/searchmanagement/) or equivalent client libraries. The "data plane" refers to operations against the search service endpoint, such as indexing or queries, or any other operation specified in the [Search REST API](/rest/api/searchservice/) or equivalent client libraries. Most roles apply to just one plane. The exception is Search Service Contributor which supports actions across both.

## Step 1: Preview sign-up

**Applies to:** Search Index Data Contributor, Search Index Data Reader, Search Service Contributor

Skip this step if you are using generally available roles (Owner, Contributor, Reader) or just the service-level actions of Search Service Contributor.

New built-in preview roles provide a granular set of permissions over content on the search service. Although built-in roles are always visible in the Azure portal, service enrollment is required to make them operational.

For enrollment into the preview program:

+ [Fill out this form](https://aka.ms/azure-cognitive-search/rbac-preview)

It can take up to two business days to process enrollment requests. You'll receive an email when your service is ready.

## Step 2: Preview configuration

**Applies to:** Search Index Data Contributor, Search Index Data Reader, Search Service Contributor

Skip this step if you are using generally available roles (Owner, Contributor, Reader) or just the service-level actions of Search Service Contributor.

In this step, configure your search service to recognize an **authorization** header on data requests that provide an OAuth2 access token.

### [**Azure portal**](#tab/config-svc-portal)

1. Open the portal with this syntax: [https://ms.portal.azure.com/?feature.enableRbac=true](https://ms.portal.azure.com/?feature.enableRbac=true).

1. Navigate to your search service.

1. Select **Keys** in the left navigation pane.

1. Choose an **API access control** mechanism. 

   | Option | Status | Description |
   |--------|--------|-------------|
   | API Key | Generally available (default) | Requires an [admin or query API keys](search-security-api-keys.md) on the request header for authorization. No roles are used. |
   | Role-based access control | Preview | Requires membership in a role assignment to complete the task, described in the next step. It also requires an authorization header. Choosing this option limits you to clients that support the 2021-04-30-preview REST API. |
   | Both | Preview | Requests are valid using either an API key or an authorization token. |

If you don't see the options, check the portal URL.

If you can't save your selection, or if you get "API access control failed to update for search service `<name>`. DisableLocalAuth is preview and not enabled for this subscription", your subscription enrollment hasn't been initiated or it hasn't been processed.

### [**REST API**](#tab/config-svc-rest)

Use the Management REST API version 2021-04-01-Preview, [Create or Update Service](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update), to configure your service.

If you are using Postman or another web testing tool, see the Tip below for help on setting up the request.

1. Set ["AuthOptions"](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#dataplaneauthoptions) to "aadOrApiKey".

   Optionally, set ["AadAuthFailureMode"](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#aadauthfailuremode) to specify whether 401 is returned instead of 403 when authentication fails. The default of "disableLocalAuth" is false so you don't need to set it, but it's listed below to emphasize that it must be false whenever authOptions are set.

    ```http
    PUT https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2021-04-01-Preview
    {
      "location": "{{region}}",
      "sku": {
        "name": "standard"
      },
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

1. [Assign roles](#assign-roles) on the service and verify they are working correctly against the data plane.

> [!TIP]
> Management REST API calls are authenticated through Azure Active Directory. For guidance on setting up a security principle and a request, see this blog post [Azure REST APIs with Postman (2021)](https://blog.jongallant.com/2021/02/azure-rest-apis-postman-2021/). The previous example was tested using the instructions and Postman collection provided in the blog post.

---

<a name="assign-roles"></a>

## Step 3: Assign roles

Roles can be assigned using any of the [supported approaches](../role-based-access-control/role-assignments-steps.md) described in Azure role-based access control documentation.

You must be an **Owner** or have [Microsoft.Authorization/roleAssignments/write](/azure/templates/microsoft.authorization/roleassignments) permissions to manage role assignments.

### [**Azure portal**](#tab/roles-portal)

1. For preview roles, open the portal with this syntax: [https://ms.portal.azure.com/?feature.enableRbac=true](https://ms.portal.azure.com/?feature.enableRbac=true). You should see `feature.enableRbac=true` in the URL.

   > [!NOTE]
   > For users and groups assigned to a preview role, portal content such as indexes and indexers will only be visible if you open the portal with the feature flag. 

1. Navigate to your search service.

1. Select **Access Control (IAM)** in the left navigation pane.

1. On the right side, under **Grant access to this resource**, select **Add role assignment**.

1. Find an applicable role and then assign an Azure Active Directory user or group identity:

   + Owner
   + Contributor
   + Reader
   + Search Service Contributor
   + Search Index Data Contributor (preview)
   + Search Index Data Reader (preview)

### [**PowerShell**](#tab/roles-powershell)

When [using PowerShell to assign roles](../role-based-access-control/role-assignments-powershell.md), call [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment), providing the Azure user or group name, and the scope of the assignment.

Before you start, make sure you load the Azure and AzureAD modules and connect to Azure:

```powershell
Import-Module -Name Az
Import-Module -Name AzureAD
Connect-AzAccount
```

Scoped to the service, your syntax should look similar to the following example:

```powershell
New-AzRoleAssignment -SignInName <email> `
    -RoleDefinitionName "Search Index Data Contributor" `
    -Scope  "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Search/searchServices/<search-service>"
```

Scoped to an individual index:

```powershell
New-AzRoleAssignment -SignInName <email> `
    -RoleDefinitionName "Search Index Data Contributor" `
    -Scope  "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Search/searchServices/<search-service>/indexes/<index-name>"
```

Recall that you can only scope access to top-level resources, such as indexes, synonym maps, indexers, data sources, and skillsets. You can't control access to search documents (index content) with Azure roles.

---

## Step 4: Test

### [**Azure portal**](#tab/test-portal)

1. For preview roles, open the portal with this syntax: [https://ms.portal.azure.com/?feature.enableRbac=true](https://ms.portal.azure.com/?feature.enableRbac=true). 

   > [!NOTE]
   > For users and groups assigned to a preview role, portal content such as indexes and indexers will only be visible if you open the portal with the feature flag. 

1. Navigate to your search service.

1. On the Overview page, select the **Indexes** tab:

   + Members of Search Index Data Reader can use Search Explorer to query the index. You can use any API version to check for access. You should be able to issue queries and view results, but you should not be able to view the index definition.

   + Members of Search Index Data Contributor can select **New Index** to create a new index. Saving a new index will verify write access on the service.

### [**REST API**](#tab/test-rest)

+ Register your application with Azure Active Directory.

+ Revise your code to use a [Search REST API](/rest/api/searchservice/) (any supported version) and set the **Authorization** header on requests, replacing the **api-key** header.

  :::image type="content" source="media/search-security-rbac/rest-authorization-header.png" alt-text="Screenshot of an HTTP request with an Authorization header" border="true":::

For more information on how to acquire a token for a specific environment, see [Microsoft identity platform authentication libraries](/azure/active-directory/develop/reference-v2-libraries).

### [**.NET SDK**](#tab/test-dotnet)

The Azure SDK for .NET supports an authorization header in the [NuGet Gallery | Azure.Search.Documents 11.4.0-beta.2](https://www.nuget.org/packages/Azure.Search.Documents/11.4.0-beta.2) package.

Additional configuration is required to register an application with Azure Active Directory, and to obtain and pass authorization tokens.

+ When obtaining the OAuth token, the scope is "https://search.azure.com/.default". The SDK requires the audience to be "https://search.azure.com". The ".default" is an Azure AD convention.

+ The SDK validates that the user has the "user_impersonation" scope, which must be granted by your app, but the SDK itself just asks for "https://search.azure.com/.default".

Example of using [client secret credential](/dotnet/api/azure.core.tokencredential):

```csharp
var tokenCredential =  new ClientSecretCredential(aadTenantId, aadClientId, aadSecret);
SearchClient srchclient = new SearchClient(serviceEndpoint, indexName, tokenCredential);
```

Additional details on using [AAD authentication with the Azure SDK for .NET](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/identity/Azure.Identity) are available in the SDK's GitHub repo.

> [!NOTE]
> If you get a 403 error, verify that your search service is enrolled in the preview program and that your service is configured for preview role assignments.

---

## Disable API key authentication

API keys cannot be deleted, but they can be disabled on your service. If you are using Search Service Contributor, Search Index Data Contributor, and Search Index Data Reader roles and Azure AD authentication, you can disable API keys, causing the search service to refuse all data-related requests that pass an API key in the header for content-related requests.

To disable [key-based authentication](search-security-api-keys.md), use the Management REST API version 2021-04-01-Preview and send two consecutive requests for [Update Service](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update).

Owner or Contributor permissions are required to disable features. Use Postman or another web testing tool to complete the following steps (see Tip below):

1. On the first request, set ["AuthOptions"](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#dataplaneauthoptions) to "aadOrApiKey" to enable Azure AD authentication. Notice that the option indicates availability of either approach: Azure AD or the native API keys.

    ```http
    PUT https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2021-04-01-Preview
    {
      "location": "{{region}}",
      "sku": {
        "name": "standard"
      },
      "properties": {
        "authOptions": {
          "aadOrApiKey": {
            "aadAuthFailureMode": "http401WithBearerChallenge"
          }
        }
      }
   }
    ```

1. On the second request, set ["disableLocalAuth"](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#request-body) to true. This step turns off the API key portion of the "aadOrApiKey" option, leaving you with just Azure AD authentication.

    ```http
    PUT https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2021-04-01-Preview
    {
      "location": "{{region}}",
      "sku": {
        "name": "standard"
      },
      "properties": {
        "disableLocalAuth": true
      }
    }
    ```

You cannot combine steps one and two. In step one, "disableLocalAuth" must be false to meet the requirements for setting "AuthOptions", whereas step two changes that value to true.

To re-enable key authentication, rerun the last request, setting "disableLocalAuth" to false. The search service will resume acceptance of API keys on the request automatically (assuming they are specified).

> [!TIP]
> Management REST API calls are authenticated through Azure Active Directory. For guidance on setting up a security principle and a request, see this blog post [Azure REST APIs with Postman (2021)](https://blog.jongallant.com/2021/02/azure-rest-apis-postman-2021/). The previous example was tested using the instructions and Postman collection provided in the blog post.
