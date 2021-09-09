---
title: Role-based authorization
titleSuffix: Azure Cognitive Search
description: Use Azure role-based access control (Azure RBAC) for granular permissions on service administration and content tasks.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/23/2021
---

# Use role-based authorization in Azure Cognitive Search

Azure provides a global [role-based access control (RBAC) authorization system](../role-based-access-control/role-assignments-portal.md) for all services running on the platform. In Cognitive Search, you can use role authorization in the following ways:

+ Allow access to control plane operations, such as adding capacity or rotating keys, on the search service itself through Owner, Contributor, and Reader roles.

+ Allow access to data plane operations, such as creating or querying indexes. This capability is currently in public preview ([by request](https://aka.ms/azure-cognitive-search/rbac-preview)). After your subscription is on-boarded, follow the instructions in this article to use the feature.

+ Allow outbound indexer connections to be made [using a managed identity](search-howto-managed-identities-data-sources.md). For a search service that has a managed identity assigned to it, you can create roles assignments that extend external data services, such as Azure Blob Storage, to allow read access on blobs by your trusted search service.

This article focuses on the first two bullets, roles for control plane and data plane operations. For more information about outbound indexer calls, start with [Configure a managed identity](search-howto-managed-identities-data-sources.md).

A few RBAC scenarios are **not** directly supported, and these include:

+ [Custom roles](../role-based-access-control/custom-roles.md)

+ User identity access over search results (sometimes referred to as row-level security or document-level security)

  > [!Tip]
  > For document-level security, a workaround is to use [security filters](search-security-trimming-for-azure-search.md) to trim results by user identity, removing documents for which the requestor should not have access.
  >

## Roles used in Search

Built-in roles include generally available and preview roles, whose assigned membership consists of Azure Active Directory users and groups.

Role assignments are cumulative and pervasive across all tools and client libraries used to create or manage a search service. Clients include the Azure portal, Management REST API, Azure PowerShell, Azure CLI, and the management client library of Azure SDKs. 

There are no regional, tier, or pricing restrictions for using RBAC on Azure Cognitive Search, but your search service must be in the Azure public cloud.

| Role | Status | Applies to | Description |
| ---- | -------| ---------- | ----------- |
| [Owner](../role-based-access-control/built-in-roles.md#owner) | Stable | Control plane | Full access to the resource, including the ability to assign Azure roles. Subscription administrators are members by default. |
| [Contributor](../role-based-access-control/built-in-roles.md#contributor) | Stable | Control plane | Same level of access as Owner, minus the ability to assign roles. |
| [Reader](../role-based-access-control/built-in-roles.md#reader) | Stable | Control plane | Limited access to partial service information. In the portal, the Reader role can access information in the service Overview page, in the Essentials section and under the Monitoring tab. All other tabs and pages are off limits. </br></br>This role has access to service information: resource group, service status, location, subscription name and ID, tags, URL, pricing tier, replicas, partitions, and search units. </br></br>This role also has access to service metrics: search latency, percentage of throttled requests, average queries per second. </br></br>There is no access to API keys, role assignments, content (indexes or synonym maps), or content metrics (storage consumed, number of objects). |
| [Search Service Contributor](../role-based-access-control/built-in-roles.md#search-service-contributor) | Preview | Control plane | Provides full access to search service and object definitions, but no access to indexed data. This role is intended for service administrators who need more information than what the Reader role provides, but who should not have access to index or synonym map content.|
| [Search Index Data Contributor](../role-based-access-control/built-in-roles.md#search-index-data-contributor) | Preview | Data plane | Provides full access to index data, but nothing else. This role is for developers or index owners who are responsible for creating and loading content, but who should not have access to search service information. The scope is all top-level resources (indexers, synonym maps, indexers, data sources, skillsets) on the search service. |
| [Search Index Data Reader](../role-based-access-control/built-in-roles.md#search-index-data-reader) | Preview | Data plane | Provides read-only access to index data. This role is for users who run queries against an index. The scope is all top-level resources (indexers, synonym maps, indexers, data sources, skillsets) on the search service. |

## Scope: control plane and data plane

Azure resources have the concept of [control plane and data plane](../azure-resource-manager/management/control-plane-and-data-plane.md) categories of operations. The built-in roles for Cognitive Search apply to either one plane or the other.

| Category | Operations |
|----------|------------|
| Control plane | Operations include create, update, and delete services, manage API keys, adjust partitions and replicas, and so forth. The [Management REST API](/rest/api/searchmanagement/) and equivalent client libraries define the operations applicable to the control plane. |
| Data plane | Operations against the search service endpoint, encompassing all objects and data hosted on the service. Indexing, querying, and all associated actions target the data plane, which is accessed via the [Search REST API](/rest/api/searchservice/) and equivalent client libraries. </br></br>Currently, you cannot use role assignments to restrict access to individual indexes, synonym maps, indexers, data sources, or skillsets. |

## Configure Search for data plane authentication

If you are using any of the preview data plane roles (Search Index Data Contributor or Search Index Data Reader) and Azure AD authentication, your search service must be configured to recognize an **authorization** header on data requests that provide an OAuth2 access token. This section explains how to configure your search service. If you are using control plane roles (Owner, Contributor, Reader), you can skip this step.

Before you start, [sign up](https://aka.ms/azure-cognitive-search/rbac-preview) for the RBAC preview. Your subscription must be enrolled into the program before you can use this feature. It can take up to two business days to process enrollment requests. You'll receive an email when your service is ready.

### [**Azure portal**](#tab/config-svc-portal)

1. Open the portal with this syntax: [https://ms.portal.azure.com/?feature.enableRbac=true](https://ms.portal.azure.com/?feature.enableRbac=true).

1. Navigate to your search service.

1. Select **Keys** in the left navigation pane.

1. Choose an **API access control** mechanism. If you don't see these options, check the portal URL. If you can't save your selection, there is an issue with subscription enrollment. 

   | Option | Status | Description |
   |--------|--------|-------------|
   | API Key | Generally available (default) | Requires an [admin or query API keys](search-security-api-keys.md) on the request header for authorization. No roles are used. |
   | Role-based access control | Preview | Requires membership in a role assignment to complete the task, described in the next step. It also requires an authorization header. Choosing this option limits you to clients that support the 2021-04-30-preview REST API. |
   | Both | Preview | Requests are valid using either an API key or an authorization token. |

Once your search service is RBAC-enabled, the portal will require the feature flag in the URL for assigning roles and viewing content. **Content, such as indexes and indexers, will only be visible in the portal if you open it with the feature flag.** If you want to restore the default behavior at a later date, revert the API Keys selection to **API Keys**.

### [**REST API**](#tab/config-svc-rest)

Use the Management REST API, version 2021-04-01-Preview, to configure your service.

1. Call [Create or Update Service](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update).

1. Set [DataPlaneAuthOptions](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#dataplaneauthoptions) to `aadOrApiKey`. See [this example](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#searchcreateorupdateserviceauthoptions) for syntax.

1. Set [AadAuthFailureMode](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#aadauthfailuremode) to specify whether 401 or 403 errors are returned when authentication fails.

---

## Assign roles

Roles can be assigned using any of the [supported approaches](../role-based-access-control/role-assignments-steps.md) described in Azure role-based access control documentation.

You must be an Owner or have [Microsoft.Authorization/roleAssignments/write](/azure/templates/microsoft.authorization/roleassignments) permissions to manage role assignments.

### [**Azure portal**](#tab/rbac-portal)

Set the feature flag on the portal URL to work with the preview roles: Search Service Contributor, Search Index Data Contributor, and Search Index Data Reader.

1. Open the portal with this syntax: [https://ms.portal.azure.com/?feature.enableRbac=true](https://ms.portal.azure.com/?feature.enableRbac=true). You should see `feature.enableRbac=true` in the URL.

1. Navigate to your search service.

1. Select **Access Control (IAM)** in the left navigation pane.

1. On the right side, under **Grant access to this resource**, select **Add role assignment**.

1. Find an applicable role (Owner, Contributor, Reader, Search Service Contributor, Search Index Data Contributor, Search Index Data Reader), and then assign an Azure Active Directory user or group identity.

### [**PowerShell**](#tab/rbac-powershell)

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

## Configure requests and test

To test programmatically, revise your code to use a Search REST API (any supported version) and set the authorization header on requests. If you are using one of the Azure SDKs, check their beta releases to see if the authorization header is available. 

Depending on your application, additional configuration is required to register an application with Azure Active Directory or to obtain and pass authorization tokens.

Alternatively, you can use the Azure portal and the roles assigned to yourself to test:

1. Open the portal with this syntax: [https://ms.portal.azure.com/?feature.enableRbac=true](https://ms.portal.azure.com/?feature.enableRbac=true). 

   Although your service is RBAC-enabled in a previous step, the portal will require the feature flag to invoke RBAC behaviors. **Content, such as indexes and indexers, will only be visible in the portal if you open it with the feature flag.** If you want to restore the default behavior, revert the API Keys selection to **API Keys**.

1. Navigate to your search service.

1. On the Overview page, select the **Indexes** tab:

   + For membership in Search Index Data Reader, use Search Explorer to query the index. You can use any API version to check for access.

   + For Search Index Data Contributor, select **New Index** to create a new index. Saving a new index will verify write access on the service.

## Disable API key authentication

API keys cannot be deleted, but they can be disabled on your service. If you are using Search Index Data Contributor and Search Index Data Reader roles and Azure AD authentication, you can disable API keys, causing the search service to refuse all data-related requests providing a key.

Use the preview Management REST API, version 2021-04-01-preview, for this task.

1. Set [DataPlaneAuthOptions](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#dataplaneauthoptions) to `aadOrApiKey`.

1. [Assign roles](#assign-roles) and verify they are working correctly.

1. Set `disableLocalAuth` to **True**.

If you revert the last step, setting `disableLocalAuth` to **False**, the search service will resume acceptance of API keys on the request automatically (assuming they are specified).