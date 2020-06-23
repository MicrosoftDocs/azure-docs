---
title: Set RBAC roles for Azure administrative access
titleSuffix: Azure Cognitive Search
description: Role-based administrative control (RBAC) in the Azure portal for controlling and delegating administrative tasks for Azure Cognitive Search management.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/03/2020
---

# Set RBAC roles for administrative access to Azure Cognitive Search

Azure provides a [global role-based authorization model](../role-based-access-control/role-assignments-portal.md) for all services managed through the portal or Resource Manager APIs. Owner, Contributor, and Reader roles determine the level of *service administration* for Active Directory users, groups, and security principals assigned to each role. 

> [!Note]
> There is no role-based access controls for securing portions of an index or a subset of documents. For identity-based access over search results, you can create security filters to trim results by identity, removing documents for which the requestor should not have access. For more information, see [Security filters](search-security-trimming-for-azure-search.md) and [Secure with Active Directory](search-security-trimming-for-azure-search-with-aad.md).

## Management tasks by role

For Azure Cognitive Search, roles are associated with permission levels that support the following management tasks:

| Role | Task |
| --- | --- |
| Owner |Create or delete the service or any object on the service, including api-keys, indexes, indexers, indexer data sources, and indexer schedules.<p>View service status, including counts and storage size.<p>Add or delete role membership (only an Owner can manage role membership).<p>Subscription administrators and service owners have automatic membership in the Owners role. |
| Contributor |Same level of access as Owner, minus RBAC role management. For example, a Contributor can create or delete objects, or view and regenerate [api-keys](search-security-api-keys.md), but cannot modify role memberships. |
| [Search Service Contributor built-in role](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#search-service-contributor) | Equivalent to the Contributor role. |
| Reader |View service essentials and metrics. Members of this role cannot view index, indexer, data source, or key information.  |

Roles do not grant access rights to the service endpoint. Search service operations, such as index management, index population, and queries on search data, are controlled through api-keys, not roles. For more information, see [Manage api-keys](search-security-api-keys.md).

## Permissions table

The following table summarizes the operations allowed in Azure Cognitive Search and which key unlocks access a particular operation.

| Operation | Permissions |
|-----------|-------------------------|
| Create a service | Azure subscription holder |
| Scale a service | Admin key, RBAC Owner, or Contributor on the resource  |
| Delete a service | Admin key, RBAC Owner, or Contributor on the resource |
| Create, modify, delete objects on the service: <br>Indexes and component parts (including analyzer definitions, scoring profiles, CORS options), indexers, data sources, synonyms, suggesters | Admin key, RBAC Owner, or Contributor on the resource |
| Query an index | Admin or query key (RBAC not applicable) |
| Query system information, such as returning statistics, counts, and lists of objects | Admin key, RBAC on the resource (Owner, Contributor, Reader) |
| Manage admin keys | Admin key, RBAC Owner or Contributor on the resource |
| Manage query keys |  Admin key, RBAC Owner or Contributor on the resource  |

## See also

+ [Manage using PowerShell](search-manage-powershell.md) 
+ [Performance and optimization in Azure Cognitive Search](search-performance-optimization.md)
+ [Get started with Role-Based Access Control in the Azure portal](../role-based-access-control/overview.md).