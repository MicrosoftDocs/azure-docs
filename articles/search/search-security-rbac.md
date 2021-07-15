---
title: Role-based authorization
titleSuffix: Azure Cognitive Search
description: Use Azure role-based access control (Azure RBAC) for granular permissions on service administration and content tasks.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/14/2021
---

# Use role-based authorization in Azure Cognitive Search

Azure provides a global [role-based access control (RBAC) model](../role-based-access-control/role-assignments-portal.md) for all services running on the platform. In Cognitive Search, you can use role authorization in the following ways:

+ Grant search service admin rights that work against any client calling [Azure Resource Manager](../azure-resource-manager/management/overview.md). Roles range from full access (Owner), to read-only access to service information (Reader).

+ (Preview only) Grant permissions for inbound data plane operations, such as creating or querying indexes.

+ Grant outbound indexer access to external Azure data sources, applicable when you [configure a managed identity](search-howto-managed-identities-data-sources.md) to run the search service under. For a search service that runs under a managed identity, you can assign roles on external data services, such as Azure Blob Storage, to allow read access on blobs by your trusted search service.

This article focuses on roles for control plane and data plane operations. For more information about outbound indexer calls, start with [Configure a managed identity](search-howto-managed-identities-data-sources.md).

A few RBAC scenarios are **not** supported, and these include:

+ [Custom roles](../role-based-access-control/custom-roles.md)

+ User identity access over search results (sometimes referred to as row-level security or document-level security)

  > [!Tip]
  > For document-level security, a workaround is to use [security filters](search-security-trimming-for-azure-search.md) to trim results by user identity, removing documents for which the requestor should not have access.
  >

## Azure roles used in Search

Built-in roles include generally available and preview roles, whose assigned membership consists of Azure Active Directory users and groups under the same tenant.

Role assignments are cumulative and pervasive across all tools and client libraries used to create or manage a search service. Clients include the Azure portal, Management REST API, Azure PowerShell, Azure CLI, and the management client library of Azure SDKs. 

| Role | Status | Applies to | Description |
| ---- | -------| ---------- | ----------- |
| [Owner](../role-based-access-control/built-in-roles.md#owner) | Stable | Control plane | Full access to the resource, including the ability to assign Azure roles. Subscription administrators are members by default. |
| [Contributor](../role-based-access-control/built-in-roles.md#contributor) | Stable | Control plane | Same level of access as Owner, minus the ability to assign roles. |
| [Reader](../role-based-access-control/built-in-roles.md#reader) | Stable | Control plane | Limited access to partial service information. In the portal, the Reader role can access information in the service Overview page, in the Essentials section and under the Monitoring tab. All other tabs and pages are off limits. </br></br>This role has access to service information: resource group, service status, location, subscription name and ID, tags, URL, pricing tier, replicas, partitions, and search units. </br></br>This role also has access to service metrics: search latency, percentage of throttled requests, average queries per second. </br></br>There is no access to content (indexes or synonym maps) or content metrics (storage consumed, number of objects). |
| [Search Service Contributor](../role-based-access-control/built-in-roles.md#search-service-contributor) | Preview | Control plane | Provides full access to search service and object definitions, but no access to indexed data. This role is intended for service administrators who need more information than what the Reader role provides, but who should not have access to index or synonym map content.|
| [Search Index Data Contributor](../role-based-access-control/built-in-roles.md#search-index-data-contributor) | Preview | Data plane | Provides full access to index data, but nothing else. This role is for developers or index owners who are responsible for creating and loading content, but who should not have access to search service information. The scope is all top-level resources (indexers, synonym maps, indexers, data sources, skillsets) on the search service. |
| [Search Index Data Reader](../role-based-access-control/built-in-roles.md#search-index-data-reader) | Preview | Data plane | Provides read-only access to index data. This role is for users who run queries against an index. The scope is all top-level resources (indexers, synonym maps, indexers, data sources, skillsets) on the search service. |

## Scope: control plane and data plane

Azure resources have the concept of [control plane and data plane](../azure-resource-manager/management/control-plane-and-data-plane.md) categories of operations. The built-in roles for Cognitive Search apply to either one plane or the other.

| Category | Operations |
|----------|------------|
| Control plane | Operations include create, update, and delete services, manage API keys, adjust partitions and replicas, and so forth. The [Management REST API](/rest/api/searchmanagement/) and equivalent client libraries define the operations applicable to the control plane. |
| Data plane | Operations against the search service endpoint, encompassing all objects and data hosted on the service. Indexing, querying, and all associated actions target the data plane, which is accessed via the [Search REST API](/rest/api/searchservice/) and equivalent client libraries. </br></br>Currently, you cannot use role assignments to restrict access to individual indexes, synonym maps, indexers, data sources, or skillsets. |

## How to assign roles

Roles can be assigned using any of the [supported approaches](/role-based-access-control/role-assignments-steps.md) described in role-based access control documentation.

For just the preview roles described above, you will need to also configure your search service to support authorization, and modify code to use an authorization header in requests.

### [**Stable roles**](#tab/rbac-ga)

Stable roles refer to those that are generally available. Currently, these roles grant access to *service* information and admin operations. None of these roles will grant access rights to the search service endpoint itself or to content and operations on the service. Authentication to the endpoint is through [API keys](search-security-api-keys.md).

A role assignment for search service administration is required. If you manage a search service, you are either an Owner or a Contributor. If you created a search service, you are automatically an Owner.

+ Stable roles: [Owner](../role-based-access-control/built-in-roles.md#owner), [Contributor](../role-based-access-control/built-in-roles.md#contributor), [Reader](../role-based-access-control/built-in-roles.md#reader)
+ Applies to: Control plane (or service administration)

No service configuration is required. To assign roles, use one of the [approaches supported for Azure role assignments](/role-based-access-control/role-assignments-steps.md).

### [**Preview roles**](#tab/rbac-preview)

Several new roles are now in public preview that extend Azure roles to the search endpoint, which means you can disable or limit the dependency on API keys for authentication to search content and operations.

+ Preview roles: [Search Service Contributor](../role-based-access-control/built-in-roles.md#search-service-contributor), [Search Index Data Contributor](../role-based-access-control/built-in-roles.md#search-index-data-contributor), [Search Index Data Reader](../role-based-access-control/built-in-roles.md#search-index-data-reader)
+ Applies to: Control plane and data plane operations

There are no regional, tier, or pricing restrictions for using RBAC on Azure Cognitive Search.

#### Step 1: Configure the search service

A search service must be configured to support role-based authentication on the endpoint. Use [Create or Update](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update) to set [DataPlaneAuthOptions](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#dataplaneauthoptions). You'll use the Management REST API version 2021-04-01-Preview to enable role-based authorization for data plane operations.

Alternatively, you can use the Azure portal to update an existing search service.

1. Open the portal with this syntax: [https://ms.portal.azure.com/?feature.enableRbac=true](https://ms.portal.azure.com/?feature.enableRbac=true).

1. Navigate to your search service.

1. Select **Keys** in the left navigation pane.

1. Choose an **API access control** mechanism:

   | Option | Status | Description |
   |--------|--------|-------------|
   | API Key | Generally available (default) | Requires an [admin or query API keys](search-security-api-keys.md) on the request header for authorization. No roles are used. |
   | Role-based access control | Preview | Requires membership in a role assignment to complete the task, described in the next step. It also requires an authorization header. Choosing this option limits you to clients that support the 2021-04-30-preview REST API. |
   | Both | Preview | Requests are valid using either an API key or an authorization token. |

#### Step 2: Assign users or groups

Use one of the [supported approaches](../role-based-access-control/role-assignments-steps.md) for assigning Azure Active Directory users or groups to any of the preview roles: Search Service Contributor, Search Index Data Contributor, Search Index Data Reader.

Alternatively, you can use the Azure portal:

1. Make sure the portal has been opened with this syntax: [https://ms.portal.azure.com/?feature.enableRbac=true](https://ms.portal.azure.com/?feature.enableRbac=true). You should see `feature.enableRbac=true` in the URL.

1. Navigate to your search service.

1. Select **Access Control** in the left navigation pane.

1. On the right side, under **Grant access to this resource**, select **Add role assignment**.

1. Find an applicable role (Search Service Contributor, Search Index Data Contributor, Search Index Data Reader), and then assign an Azure Active Directory user or group identity.

#### Step 3: Configure requests

Use the Search REST API version 2021-04-30-Preview to set the authorization header on requests. You can set this header on any REST call to search service resources and operations.

Note the subtle difference (04-01 versus 04-30) in preview version numbering between the Management and Search REST APIs.

If you are using the portal, you can skip this step.

#### Step 4: Test

Send requests to the reconfigured search service to verify role-based authorization for indexing and query tasks. If you chose **Role-based access control**, use a REST client to perform data plane operations and specify the 2021-04-30-preview REST API with an authorization header. Common tools for making REST calls include [Postman](search-get-started-rest.md) or [Visual Studio Code](search-get-started-vs-code.md).

Alternatively, you can use the Azure portal and the roles assigned to yourself to test:

1. Open the portal with this syntax: [https://ms.portal.azure.com/?feature.enableRbac=true](https://ms.portal.azure.com/?feature.enableRbac=true). Although your service is RBAC-enabled in a previous step, the portal will require the feature flag to invoke RBAC behaviors.

1. Navigate to your search service.

1. On the Overview page, select the **Indexes** tab:

   + For membership in Search Index Data Reader, use Search Explorer to query the index. You can use any API version to check for access.

   + For Search Index Data Contributor, select **New Index** to create a new index. Saving a new index will verify write access on the service.

---
