---
title: Authorize access through Azure roles
titleSuffix: Azure Cognitive Search
description: Azure role-based access control (Azure RBAC) in the Azure portal for controlling and delegating administrative tasks for Azure Cognitive Search management.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 05/28/2021
---

# Authorize access through Azure roles in Azure Cognitive Search

Azure provides a [global role-based authorization model](../role-based-access-control/role-assignments-portal.md) for all services managed through the portal or Resource Manager APIs. The authorization model provides Owner, Contributor, and Reader roles, which determine the level of *service administration* for Active Directory users, groups, and security principals assigned to each role. Cognitive Search uses these three roles to authorize access for search service administration.

Cognitive Search does not support:

+ [Custom roles](../role-based-access-control/custom-roles.md).
+ Role-based access control (Azure RBAC) over content-related operations, such as creating or querying an index, or any other object on the service.

  Authorization for performing content operations requires either an [admin API key or query API key](search-security-api-keys.md).

> [!Note]
> For identity-based access over search results (sometimes referred to as row-level security), you can create security filters to trim results by identity, removing documents for which the requestor should not have access. For more information, see [Security filters](search-security-trimming-for-azure-search.md).

## Roles used in Cognitive Search

For Azure Cognitive Search, roles are associated with permission levels that support the following management tasks:

| Role | Task |
| --- | --- |
| Owner |Create or delete the service. Create, update, or delete any object on the service: API keys, indexes, synonym maps, indexers, indexer data sources, and skillsets. </br></br>Full access to all service information exposed in the portal or through the Management REST API, Azure PowerShell, or Azure CLI. </br></br>Assign role membership.</br></br>Subscription administrators and service owners have automatic membership in the Owners role. |
| Contributor | Same level of access as Owner, minus role assignments. [Search Service Contributor](../role-based-access-control/built-in-roles.md#search-service-contributor) is equivalent to the generic Contributor built-in role. |
| Reader | Limited access to partial service information. In the portal, the Reader role can access information in the service Overview page, in the Essentials section and under the Monitoring tab. All other tabs and pages are off limits. </br></br>Under the Essentials section: resource group, status, location, subscription name and ID, tags, URL, pricing tier, replicas, partitions, and search units. </br></br>On the Monitoring tab, view service metrics: search latency, percentage of throttled requests, average queries per second. </br></br>There is no access to the Usage tab (storage, counts of indexes or indexers created on the service) or to any information in the Indexes, Indexers, Data sources, Skillsets, or Debug sessions tabs. |

Roles do not grant access rights to the service endpoint. Search service operations, such as index management, index population, and queries on search data, are controlled through API keys, not roles. For more information, see [Manage API keys](search-security-api-keys.md).

## Tasks and permission requirements

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
| Query system information about objects, such as returning statistics, counts, and lists of objects | Admin key if using an API, plus Azure RBAC Owner or Contributor if using the portal |

## Next steps

+ [Manage using PowerShell](search-manage-powershell.md) 
+ [Performance and optimization in Azure Cognitive Search](search-performance-optimization.md)
+ [What is Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md).
