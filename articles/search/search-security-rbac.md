---
title: Set Azure roles for Azure administrative access
titleSuffix: Azure Cognitive Search
description: Role-based access control (RBAC) in the Azure portal for controlling and delegating administrative tasks for Azure Cognitive Search management.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/16/2020
---

# Set Azure roles for administrative access to Azure Cognitive Search

Azure provides a [global role-based authorization model](../role-based-access-control/role-assignments-portal.md) for all services managed through the portal or Resource Manager APIs. Owner, Contributor, and Reader roles determine the level of *service administration* for Active Directory users, groups, and security principals assigned to each role. 

> [!Note]
> There is no role-based access control (RBAC) for securing content on the service. You will either use an admin API key or query API key for authenticated requests to the service itself. For identity-based access over search results, you can create security filters to trim results by identity, removing documents for which the requestor should not have access. For more information, see [Security filters](search-security-trimming-for-azure-search.md).

## Management tasks by role

For Azure Cognitive Search, roles are associated with permission levels that support the following management tasks:

| Role | Task |
| --- | --- |
| Owner |Create or delete the service or any object on the service, including api-keys, indexes, indexers, indexer data sources, and indexer schedules.<p>View service status, including counts and storage size.<p>Add or delete role membership (only an Owner can manage role membership).<p>Subscription administrators and service owners have automatic membership in the Owners role. |
| Contributor | Same level of access as Owner, minus Azure role management. For example, a Contributor can create or delete objects, or view and regenerate [api-keys](search-security-api-keys.md), but cannot modify role memberships. |
| [Search Service Contributor](../role-based-access-control/built-in-roles.md#search-service-contributor) | Equivalent to the Contributor role. |
| Reader |View service essentials, such as service endpoint, subscription, resource group, region, tier, and capacity. You can also view service metrics, such as average queries per second, on the Monitoring tab. Members of this role cannot view index, indexer, data source, or skillset information. This includes usage data for those objects, such as how many indexes exist on the service. |

Roles do not grant access rights to the service endpoint. Search service operations, such as index management, index population, and queries on search data, are controlled through api-keys, not roles. For more information, see [Manage api-keys](search-security-api-keys.md).

## Permissions table

The following table summarizes the operations allowed in Azure Cognitive Search and which key unlocks access a particular operation.

RBAC permissions apply to portal operations and service management (create, delete, or change a service or its API keys). API keys are created after a service exists and apply to content operations on the service. Additionally, for content-related operations in the portal, such as creating or deleting objects, an RBAC Owner or Contributor interact with the service with an implied admin API key.

| Operation | Permissions |
|-----------|-------------------------|
| Create a service | RBAC Owner or Contributor |
| Scale a service | RBAC Owner or Contributor |
| Delete a service | RBAC Owner or Contributor |
| Manage admin or query keys | RBAC Owner or Contributor |
| View service information in the portal or a management API | RBAC Owner, Contributor, or Reader  |
| View object information and metrics in the portal or a management API | RBAC Owner or Contributor |
| Create, modify, delete objects on the service: <br>Indexes and component parts (including analyzer definitions, scoring profiles, CORS options), indexers, data sources, synonyms, suggesters | Admin key if using an API, RBAC Owner or Contributor if using the portal |
| Query an index | Admin or query key if using an API, RBAC Owner or Contributor is using the portal |
| Query system information about objects, such as returning statistics, counts, and lists of objects | Admin key if using an API, RBAC Owner or Contributor if using the portal |

## See also

+ [Manage using PowerShell](search-manage-powershell.md) 
+ [Performance and optimization in Azure Cognitive Search](search-performance-optimization.md)
+ [Get started with Role-Based Access Control in the Azure portal](../role-based-access-control/overview.md).