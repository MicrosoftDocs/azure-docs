---
title: Set RBAC roles for Azure Search administrative access in the portal | Microsoft Docs
description: Role-based administrative control in the Azure portal.
services: search
documentationcenter: ''
author: HeidiSteen
manager: cgronlun
editor: ''
tags: azure-portal

ms.assetid: 
ms.service: search
ms.devlang: rest-api
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 03/20/2018
ms.author: heidist

---
# Set RBAC roles for administrative access

Azure provides a [global role-based authorization model](../active-directory/role-based-access-control-configure.md) for all services managed through the portal or Resource Manager APIs. Owner, Contributor, and Reader roles determine the level of *service administration* for Active Directory users, groups, and security principals assigned to each role. 

## Roles

For Azure Search, roles are associated with permission levels that support the following management tasks:

| Role | Task |
| --- | --- |
| Owner |Create or delete the service or any object on the service, including api-keys, indexes, indexers, indexer data sources, and indexer schedules.<p>View service status, including counts and storage size.<p>Add or delete role membership (only an Owner can manage role membership).<p>Subscription administrators and service owners have automatic membership in the Owners role. |
| Contributor |Same level of access as Owner, minus RBAC role management. For example, a Contributor can view and regenerate `api-key`, but cannot modify role memberships. |
| [Search Service Contributor built-in role](https://docs.microsoft.com/azure/active-directory/role-based-access-built-in-roles#search-service-contributor) | Equivalent to the Contributor role. |
| Reader |View service essentials and metrics. Members of this role cannot view index, indexer, data source, or key information.  |

Roles do not grant access rights to the service endpoint. Search service operations, such as index management, index population, and queries on search data, are controlled through api-keys, not roles. For more information, see [Manage api-keys](search-security-api-keys.md).

> [!Note]
> For identity-based access over search results, you can create security filters to trim results by identity, removing documents for which the requestor should not have access. For more information, see [Security filters](search-security-trimming-for-azure-search.md) and [Secure with Active Directory](search-security-trimming-for-azure-search-with-aad.md).

## Operations by role

The following table summarizes the operations allowed in Azure Search and which key unlocks access a particular operation.

| Operation | Role |
|-----------|-------|
| Create a service | Owner |
| Scale a service  | Owner or Contributor |
| Delete a service | Owner or Contributor |
| Manage RBAC roles on the service | Owner |
| Create, modify, delete objects on the service: <br>Indexes and component parts (including analyzer definitions, scoring profiles, CORS options), indexers, data sources, synonyms, suggesters. | Owner or Contributor |
| Query an index | [Admin or query key](search-security-api-keys.md) (RBAC is not applicable for query operations) |
| Query system information, such as returning statistics, counts, and lists of objects. |  Owner, Contributor, Reader |
| Manage admin keys | Owner or Contributor |
| Manage query keys | Owner or Contributor  |

## See also

+ [Manage using PowerShell](search-manage-powershell.md) 
+ [Performance and optimization in Azure Search](search-performance-optimization.md)
+ [Get started with Role-Based Access Control in the Azure portal](../active-directory/role-based-access-control-what-is.md).