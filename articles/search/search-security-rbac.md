---
title: Use Azure RBAC roles
titleSuffix: Azure Cognitive Search
description: Use Azure role-based access control (Azure RBAC) for granular permissions on service administration and content tasks.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 05/24/2022
ms.custom: subject-rbac-steps, references_regions
---

# Use Azure role-based access controls (Azure RBAC) in Azure Cognitive Search

Azure provides a global [role-based access control (RBAC) authorization system](../role-based-access-control/role-assignments-portal.md) for all services running on the platform. In Cognitive Search, you can:

+ Use generally available roles for service administration.

+ Use new preview roles for data requests, including creating, loading, and querying indexes.

Per-user access over search results (sometimes referred to as row-level security or document-level security) isn't supported. As a workaround, [create security filters](search-security-trimming-for-azure-search.md) that trim results by user identity, removing documents for which the requestor shouldn't have access.

## Built-in roles used in Search

Built-in roles include generally available and preview roles. If these roles are insufficient, [create a custom role](#create-a-custom-role) instead.

| Role | Description and availability |
| ---- | ---------------------------- |
| [Owner](../role-based-access-control/built-in-roles.md#owner) | (Generally available) Full access to the search resource, including the ability to assign Azure roles. Subscription administrators are members by default.</br></br> (Preview) This role has the same access as the Search Service Contributor role on the data plane. It includes access to all data plane actions except the ability to query the search index or index documents. |
| [Contributor](../role-based-access-control/built-in-roles.md#contributor) | (Generally available) Same level of access as Owner, minus the ability to assign roles or change authorization options. </br></br> (Preview) This role has the same access as the Search Service Contributor role on the data plane. It includes access to all data plane actions except the ability to query the search index or index documents. |
| [Reader](../role-based-access-control/built-in-roles.md#reader) | (Generally available) Limited access to partial service information. In the portal, the Reader role can access information in the service Overview page, in the Essentials section and under the Monitoring tab. All other tabs and pages are off limits. </br></br>This role has access to service information: service name, resource group, service status, location, subscription name and ID, tags, URL, pricing tier, replicas, partitions, and search units. This role also has access to service metrics: search latency, percentage of throttled requests, average queries per second. </br></br>This role doesn't allow access to API keys, role assignments, content (indexes or synonym maps), or content metrics (storage consumed, number of objects). </br></br> (Preview) When you enable the RBAC preview for the data plane, the Reader role has read access across the entire service. This allows you to read search metrics, content metrics (storage consumed, number of objects), and the definitions of data plane resources (indexes, indexers, etc.). The Reader role still won't have access to read API keys or read content within indexes. |
| [Search Service Contributor](../role-based-access-control/built-in-roles.md#search-service-contributor) | (Generally available) This role is identical to the Contributor role and applies to control plane operations. </br></br>(Preview) When you enable the RBAC preview for the data plane, this role also provides full access to all data plane actions on indexes, synonym maps, indexers, data sources, and skillsets as defined by [`Microsoft.Search/searchServices/*`](../role-based-access-control/resource-provider-operations.md#microsoftsearch). This role does not give you access to query search indexes or index documents. This role is for search service administrators who need to manage the search service and its objects, but without the ability to view or access object data. </br></br>Like Contributor, members of this role can't make or manage role assignments or change authorization options. To use the preview capabilities of this role, your service must have the preview feature enabled, as described in this article. |
| [Search Index Data Contributor](../role-based-access-control/built-in-roles.md#search-index-data-contributor) | (Preview) Provides full data plane access to content in all indexes on the search service. This role is for developers or index owners who need to import, refresh, or query the documents collection of an index. |
| [Search Index Data Reader](../role-based-access-control/built-in-roles.md#search-index-data-reader) | (Preview) Provides read-only data plane access to search indexes on the search service. This role is for apps and users who run queries. |

> [!NOTE]
> Azure resources have the concept of [control plane and data plane](../azure-resource-manager/management/control-plane-and-data-plane.md) categories of operations. In Cognitive Search, "control plane" refers to any operation supported in the [Management REST API](/rest/api/searchmanagement/) or equivalent client libraries. The "data plane" refers to operations against the search service endpoint, such as indexing or queries, or any other operation specified in the [Search REST API](/rest/api/searchservice/) or equivalent client libraries.

<a name="preview-limitations"></a>

## Preview capabilities and limitations

+ Role-based access control for data plane operations, such as creating an index or querying an index, is currently in public preview and available under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

+ There are no regional, tier, or pricing restrictions for using Azure RBAC preview , but your search service must be in the Azure public cloud. The preview isn't available in Azure Government, Azure Germany, or Azure China 21Vianet.

+ If you migrate your Azure subscription to a new tenant, the RBAC preview will need to be re-enabled. 

+ Adoption of Azure RBAC might increase the latency of some requests. Each unique combination of service resource (index, indexer, etc.) and service principal used on a request will trigger an authorization check. These authorization checks can add up to 200 milliseconds of latency to a request. 

+ In rare cases where requests originate from a high number of different service principals, all targeting different service resources (indexes, indexers, etc.), it's possible for the authorization checks to result in throttling. Throttling would only happen if hundreds of unique combinations of search service resource and service principal were used within a second.

<a name="step-1-preview-sign-up"></a>

## Sign up for the preview

**Applies to:** Search Index Data Contributor, Search Index Data Reader, Search Service Contributor

New built-in preview roles grant permissions over content on the search service. Although built-in roles are always visible in the Azure portal, preview registration is required to make them operational.

1. Open [Azure portal](https://portal.azure.com/) and find your search service.

1. On the left-nav pane, select **Keys**.

1. In the blue banner that mentions the preview, select **Register** to add the feature to your subscription.

   :::image type="content" source="media/search-howto-aad/rbac-signup-portal.png" alt-text="screenshot of how to sign up for the rbac preview in the portal" border="true" :::

You can also sign up for the preview using Azure Feature Exposure Control (AFEC) and searching for *Role Based Access Control for Search Service (Preview)*. For more information on adding preview features, see [Set up preview features in Azure subscription](../azure-resource-manager/management/preview-features.md?tabs=azure-portal).

> [!NOTE]
> Once you add the preview to your subscription, all services in the subscription will be permanently enrolled in the preview. If you don't want RBAC on a given service, you can disable RBAC for data plane operations as described in a later section.

<a name="step-2-preview-configuration"></a>

## Enable RBAC preview for data plane operations

**Applies to:** Search Index Data Contributor, Search Index Data Reader, Search Service Contributor

In this step, configure your search service to recognize an **authorization** header on data requests that provide an OAuth2 access token.

### [**Azure portal**](#tab/config-svc-portal)

1. [Sign in to Azure portal](https://portal.azure.com) and open the search service page.

1. Select **Keys** in the left navigation pane.

1. Choose an **API access control** mechanism. 

   | Option | Status | Description |
   |--------|--------|-------------|
   | API Key | Generally available (default) | Requires an [admin or query API keys](search-security-api-keys.md) on the request header for authorization. No roles are used. |
   | Role-based access control | Preview | Requires membership in a role assignment to complete the task, described in the next step. It also requires an authorization header. Choosing this option limits you to clients that support the 2021-04-30-preview REST API. |
   | Both | Preview | Requests are valid using either an API key or an authorization token. |

If you can't save your selection, or if you get "API access control failed to update for search service `<name>`. DisableLocalAuth is preview and not enabled for this subscription", your subscription enrollment hasn't been initiated or it hasn't been processed.

### [**REST API**](#tab/config-svc-rest)

Use the Management REST API version 2021-04-01-Preview, [Create or Update Service](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update), to configure your service.

If you're using Postman or another web testing tool, see the Tip below for help on setting up the request.

1. Under "properties", set ["AuthOptions"](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#dataplaneauthoptions) to "aadOrApiKey".

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

1. [Assign roles](#step-3-assign-roles) on the service and verify they're working correctly against the data plane.

> [!TIP]
> Management REST API calls are authenticated through Azure Active Directory. For guidance on setting up a security principal and a request, see this blog post [Azure REST APIs with Postman (2021)](https://blog.jongallant.com/2021/02/azure-rest-apis-postman-2021/). The previous example was tested using the instructions and Postman collection provided in the blog post.

---

<a name="step-3-assign-roles"></a>

## Assign roles

Role assignments are cumulative and pervasive across all tools and client libraries. You can assign roles using any of the [supported approaches](../role-based-access-control/role-assignments-steps.md) described in Azure role-based access control documentation.

You must be an **Owner** or have [Microsoft.Authorization/roleAssignments/write](/azure/templates/microsoft.authorization/roleassignments) permissions to manage role assignments.

### [**Azure portal**](#tab/roles-portal)

Role assignments in the portal are service-wide. If you want to [grant permissions to a single index](#rbac-single-index), use PowerShell or the Azure CLI instead.

1. Open the [Azure portal](https://portal.azure.com).

1. Navigate to your search service.

1. Select **Access Control (IAM)** in the left navigation pane.

1. Select **+ Add** > **Add role assignment**.

   ![Access control (IAM) page with Add role assignment menu open.](../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png)

1. Select an applicable role:

   + Owner
   + Contributor
   + Reader
   + Search Service Contributor (preview for data plane requests)
   + Search Index Data Contributor (preview)
   + Search Index Data Reader (preview)

1. On the **Members** tab, select the Azure AD user or group identity.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

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

## Test role assignments

### [**Azure portal**](#tab/test-portal)

1. Open the [Azure portal](https://portal.azure.com).

1. Navigate to your search service.

1. On the Overview page, select the **Indexes** tab:

   + Members of Search Index Data Reader can use Search Explorer to query the index. You can use any API version to check for access. You should be able to issue queries and view results, but you shouldn't be able to view the index definition.

   + Members of Search Index Data Contributor can select **New Index** to create a new index. Saving a new index will verify write access on the service.

### [**REST API**](#tab/test-rest)

+ Register your application with Azure Active Directory.

+ Revise your code to use a [Search REST API](/rest/api/searchservice/) (any supported version) and set the **Authorization** header on requests, replacing the **api-key** header.

  :::image type="content" source="media/search-security-rbac/rest-authorization-header.png" alt-text="Screenshot of an HTTP request with an Authorization header" border="true":::

For more information on how to acquire a token for a specific environment, see [Microsoft identity platform authentication libraries](../active-directory/develop/reference-v2-libraries.md).

### [**.NET SDK**](#tab/test-csharp)

The Azure SDK for .NET supports an authorization header in the [NuGet Gallery | Azure.Search.Documents 11.4.0-beta.2](https://www.nuget.org/packages/Azure.Search.Documents/11.4.0-beta.2) package.

Configuration is required to register an application with Azure Active Directory, and to obtain and pass authorization tokens:

+ When obtaining the OAuth token, the scope is "https://search.azure.com/.default". The SDK requires the audience to be "https://search.azure.com". The ".default" is an Azure AD convention.

+ The SDK validates that the user has the "user_impersonation" scope, which must be granted by your app, but the SDK itself just asks for "https://search.azure.com/.default".

Example of using [client secret credential](/dotnet/api/azure.core.tokencredential):

```csharp
var tokenCredential =  new ClientSecretCredential(aadTenantId, aadClientId, aadSecret);
SearchClient srchclient = new SearchClient(serviceEndpoint, indexName, tokenCredential);
```

More details about using [Azure AD authentication with the Azure SDK for .NET](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/identity/Azure.Identity) are available in the SDK's GitHub repo.

> [!NOTE]
> If you get a 403 error, verify that your search service is enrolled in the preview program and that your service is configured for preview role assignments.

---

<a name="rbac-single-index"></a>

## Grant access to a single index

In some scenarios, you may want to limit application's access to a single resource, such as an index. 

The portal doesn't currently support role assignments at this level of granularity, but it can be done with [PowerShell](../role-based-access-control/role-assignments-powershell.md) or the [Azure CLI](../role-based-access-control/role-assignments-cli.md).

In PowerShell, use [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment), providing the Azure user or group name, and the scope of the assignment.

1. Load the Azure and AzureAD modules and connect to your Azure account:

   ```powershell
   Import-Module -Name Az
   Import-Module -Name AzureAD
   Connect-AzAccount
   ```

1. Add a role assignment scoped to an individual index:

   ```powershell
   New-AzRoleAssignment -ObjectId <objectId> `
       -RoleDefinitionName "Search Index Data Contributor" `
       -Scope  "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Search/searchServices/<search-service>/indexes/<index-name>"
   ```

## Create a custom role

If [built-in roles](#built-in-roles-used-in-search) don't provide the right combination of permissions, you can create a [custom role](../role-based-access-control/custom-roles.md) to support the operations you require

This example clones **Search Index Data Reader** and then adds the ability to list indexes by name. Normally, listing the indexes on a search service is considered an administrative right.

### [**Azure portal**](#tab/custom-role-portal)

These steps are derived from [Create or update Azure custom roles using the Azure portal](../role-based-access-control/custom-roles-portal.md). Cloning from an existing role is supported in a search service page.

These steps create a custom role that augments search query rights to include listing indexes by name. Typically, listing indexes is considered an admin function.

1. In the Azure portal, navigate to your search service.

1. In the left-navigation pane, select **Access Control (IAM)**.

1. In the action bar, select **Roles**.

1. Right-click **Search Index Data Reader** (or another role) and select **Clone** to open the **Create a custom role** wizard.

1. On the Basics tab, provide a name for the custom role, such as "Search Index Data Explorer", and then click **Next**.

1. On the Permissions tab, select **Add permission**.

1. On the Add permissions tab, search for and then select the **Microsoft Search** tile.

1. Set the permissions for your custom role. At the top of the page, using the default **Actions** selection:

   + Under Microsoft.Search/operations, select **Read : List all available operations**. 
   + Under Microsoft.Search/searchServices/indexes, select **Read : Read Index**.

1. On the same page, switch to **Data actions** and under Microsoft.Search/searchServices/indexes/documents, select **Read : Read Documents**.

   The JSON definition looks like the following example:

   ```json
   {
    "properties": {
        "roleName": "search index data explorer",
        "description": "",
        "assignableScopes": [
            "/subscriptions/a5b1ca8b-bab3-4c26-aebe-4cf7ec4791a0/resourceGroups/heidist-free-search-svc/providers/Microsoft.Search/searchServices/demo-search-svc"
        ],
        "permissions": [
            {
                "actions": [
                    "Microsoft.Search/operations/read",
                    "Microsoft.Search/searchServices/indexes/read"
                ],
                "notActions": [],
                "dataActions": [
                    "Microsoft.Search/searchServices/indexes/documents/read"
                ],
                "notDataActions": []
            }
        ]
      }
    }
    ```

1. Select **Review + create** to create the role. You can now assign users and groups to the role.

### [**Azure PowerShell**](#tab/custom-role-ps)

The PowerShell example shows the JSON syntax for creating a custom role that's a clone of **Search Index Data Reader**, but withe ability to list all indexes by name.

1. Review the [list of atomic permissions](../role-based-access-control/resource-provider-operations.md#microsoftsearch) to determine which ones you need. For this example, you'll need the following:

   ```json
   "Microsoft.Search/operations/read",
   "Microsoft.Search/searchServices/read",
   "Microsoft.Search/searchServices/indexes/read"
   ```

1. Set up a PowerShell session to create the custom role. For detailed instructions, see [Azure PowerShell](../role-based-access-control/custom-roles-powershell.md)

1. Provide the role definition as a JSON document. The following example shows the syntax for creating a custom role with PowerShell.

```json
{
  "Name": "Search Index Data Explorer",
  "Id": "88888888-8888-8888-8888-888888888888",
  "IsCustom": true,
  "Description": "List all indexes on the service and query them.",
  "Actions": [
      "Microsoft.Search/operations/read",
      "Microsoft.Search/searchServices/read"
  ],
  "NotActions": [],
  "DataActions": [
      "Microsoft.Search/searchServices/indexes/read"
  ],
  "NotDataActions": [],
  "AssignableScopes": [
    "/subscriptions/{subscriptionId1}"
  ]
}
```

> [!NOTE]
> If the assignable scope is at the index level, the data action should be `"Microsoft.Search/searchServices/indexes/documents/read"`.

### [**REST API**](#tab/custom-role-rest)

1. Review the [list of atomic permissions](../role-based-access-control/resource-provider-operations.md#microsoftsearch) to determine which ones you need.

1. See [Create or update Azure custom roles using the REST API](../role-based-access-control/custom-roles-rest.md) for steps.

1. Clone or create a role, or use JSON to specify the custom role (see the PowerShell tab for JSON syntax).

### [**Azure CLI**](#tab/custom-role-cli)

1. Review the [list of atomic permissions](../role-based-access-control/resource-provider-operations.md#microsoftsearch) to determine which ones you need.

1. See [Create or update Azure custom roles using Azure CLI](../role-based-access-control/custom-roles-cli.md) for steps.

1. Clone or create a role, or use JSON to specify the custom role (see the PowerShell tab for JSON syntax).

---

## Disable API key authentication

API keys can't be deleted, but they can be disabled on your service. If you're using the Search Service Contributor, Search Index Data Contributor, and Search Index Data Reader preview roles and Azure AD authentication, you can disable API keys, causing the search service to refuse all data-related requests that pass an API key in the header for content-related requests.

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

You can't combine steps one and two. In step one, "disableLocalAuth" must be false to meet the requirements for setting "AuthOptions", whereas step two changes that value to true.

To re-enable key authentication, rerun the last request, setting "disableLocalAuth" to false. The search service will resume acceptance of API keys on the request automatically (assuming they're specified).

> [!TIP]
> Management REST API calls are authenticated through Azure Active Directory. For guidance on setting up a security principal and a request, see this blog post [Azure REST APIs with Postman (2021)](https://blog.jongallant.com/2021/02/azure-rest-apis-postman-2021/). The previous example was tested using the instructions and Postman collection provided in the blog post.

## Conditional Access

[Conditional Access](../active-directory/conditional-access/overview.md) is a tool in Azure Active Directory used to enforce organizational policies. By using Conditional Access policies, you can apply the right access controls when needed to keep your organization secure. When accessing an Azure Cognitive Search service using role-based access control, Conditional Access can enforce organizational policies.

To enable a Conditional Access policy for Azure Cognitive Search, follow the below steps:

1. [Sign in](https://portal.azure.com) to the Azure portal.

1. Search for **Azure AD Conditional Access**.

1. Select **Policies**.

1. Select **+ New policy**.

1. In the **Cloud apps or actions** section of the policy, add **Azure Cognitive Search** as a cloud app depending on how you want to set up your policy.

1. Update the remaining parameters of the policy. For example, specify which users and groups this policy applies to. 

1. Save the policy.

> [!IMPORTANT]
> If your search service has a managed identity assigned to it, the specific search service will show up as a cloud app that can be included or excluded as part of the Conditional Access policy. Conditional Access policies can't be enforced on a specific search service. Instead make sure you select the general **Azure Cognitive Search** cloud app.
