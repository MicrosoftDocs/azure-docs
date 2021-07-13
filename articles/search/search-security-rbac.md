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

# Use Azure role-based authentication in Azure Cognitive Search

Azure provides a [global role-based authorization (RBAC) model](../role-based-access-control/role-assignments-portal.md) for all services managed through the portal or Resource Manager APIs. In Azure Cognitive Search, you can take advantage of this role authorization model in the following ways:

+ Grant service administration rights that work against any client calling [Azure Resource Manager](../azure-resource-manager/management/overview.md). Roles range from full access (Owner), to read-only access to service information (Reader).

+ (Preview only) Grant permissions for inbound calls to a search service for data plane operations, such as creating, deleting, or querying indexes.

+ Grant outbound indexer access to external Azure data sources, applicable when you [configure a managed identity](search-howto-managed-identities-data-sources.md) to run the search service under. For a search service that runs under a managed identity, you can assign roles on external data services, such as Azure Blob Storage, to allow read access on blobs by your trusted search service.

This article focuses on roles for control plane and data plane operations. For more information about outbound indexer calls, start with [Configure a managed identity](search-howto-managed-identities-data-sources.md).

A few RBAC scenarios are **not** supported, and these include:

+ Inbound requests to the search service using generally available roles. Currently, roles for the data plane are in public preview.

+ [Custom roles](../role-based-access-control/custom-roles.md) are not supported.

+ User-identity access over search results (sometimes referred to as row-level security or document-level security) is not supported.

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
| [Search Index Data Contributor](../role-based-access-control/built-in-roles.md#search-service-contributor) | Preview | Data plane | Provides full access to index data, but nothing else.  This role is for developers or index owners who are responsible for creating and loading indexes and synonym maps, but who should not have access to search service information. |
| [Search Index Data Reader](../role-based-access-control/built-in-roles.md#search-service-contributor) | Preview | Data plane | Provides read-only access to index data. This role is for users who run queries against an index.|

## How to assign roles

Roles can be assigned using any of the [supported approaches](/role-based-access-control/role-assignments-steps) described in role-based access control documentation.

For just the preview roles described above, you will need to also configure your search service to support authorization, and modify code to use an authorization header in requests.

### [**Stable roles**](#tab/rbac-ga)

Stable roles refer to roles that are generally available. Currently, these roles are used to control access to service information and administrative operations. None of these roles will grant access rights to the search service endpoint. Data plane operations, such as index management, index population, and queries on search data, are controlled through [API keys](search-security-api-keys.md), not roles.

+ Stable roles: Owner, Contributor, Reader
+ Applies to: Control plane (or service administration)

No service configuration is required. To assign roles, use one of these [supported approaches](/role-based-access-control/role-assignments-steps).

For search solutions having hard requirements on generally available features, continue to [use API keys](search-security-api-keys.md) to control access to indexes, indexers, data sources, skillsets, and synonym maps.

### [**Preview roles**](#tab/rbac-preview)

Several new roles are now in public preview.

+ Preview roles: Search Service Contributor, Search Index Data Contributor, Search Index Data Reader
+ Applies to: Control plane and data plane operations

#### Step 1: Configure the search service

Use [Create or Update](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update) to set [DataPlaneAuthOptions](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#dataplaneauthoptions). You'll use the Management REST API version 2021-04-01-Preview to enable role-based authorization for data plane operations.

#### Step 2: Assign users or groups

Use one of the [supported approaches](/role-based-access-control/role-assignments-steps) for assigning Azure Active Directory users or groups to any of the preview roles: Search Service Contributor, Search Index Data Contributor, Search Index Data Reader.

#### Step 3: Configure requests

Use the Search REST API version 2021-04-30-Preview to set the `authorization` header on requests. You can set this header on any REST call to search service resources and operations.

Note the subtle difference (04-01 versus 04-30) in preview API versions between Search and Management REST APIs.

#### Step 4: Test

Send requests to the reconfigured search service to verify role-based authorization for indexing and query tasks.

---

<!-- ## Tasks and permission requirements

The following table summarizes the operations allowed in Azure Cognitive Search and which role or key unlocks access a particular operation.

+ Azure RBAC membership grants access to portal pages and service management tasks (create, delete, or change a service or its API keys).

+ API keys are created after a service exists and apply to content operations on the service.

Additionally, for content-related operations in the portal, such as creating or deleting objects, full access to all operations and information is supported through explicit role membership (Owner or Contributor), plus the portal's internal use of an admin key. In other words, if you are creating or loading an index in the portal, your RBAC membership gives you access to the pages, but the portal itself uses an admin key to authenticate the operation in the service.

| Operation | Controlled by |
|-----------|-------------------------|
| Create or delete a service | Azure RBAC permissions: Owner or Contributor |
| Configure network security (IP firewall) | Azure RBAC permissions: Owner or Contributor |
| Create or delete a private endpoint | Azure RBAC permissions: Owner or Contributor |
| Implement customer-managed keys | Azure RBAC permissions: Owner or Contributor |
| Adjust replicas or partitions | Azure RBAC permissions: Owner or Contributor|
| Manage admin or query keys | Azure RBAC permissions: Owner or Contributor|
| View service information in the portal or a management API | Azure RBAC permissions: Owner, Contributor, or Reader  |
| View object information and metrics in the portal or a management API | Azure RBAC permissions: Owner or Contributor |
| Create, modify, delete objects on the service: <br>Indexes and component parts (including analyzer definitions, scoring profiles, CORS options), indexers, data sources, skillsets, synonyms, suggesters | Admin key if using an API, plus Azure RBAC Owner or Contributor if using the portal |
| Query an index | Admin or query key if using an API, plus Azure RBAC Owner or Contributor if using the portal |
| Query system information about objects, such as returning statistics, counts, and lists of objects | Admin key if using an API, plus Azure RBAC Owner or Contributor if using the portal | -->

## Next steps

+ [Manage using PowerShell](search-manage-powershell.md)
+ [Performance and optimization in Azure Cognitive Search](search-performance-optimization.md)
+ [What is Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md)?
