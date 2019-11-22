---
title: Manage access to Azure resources using RBAC and the REST API - Azure | Microsoft Docs
description: Learn how to manage access to Azure resources for users, groups, and applications using role-based access control (RBAC) and the REST API. This includes how to list access, grant access, and remove access.
services: active-directory
documentationcenter: na
author: rolyon
manager: mtillman
editor: ''

ms.assetid: 1f90228a-7aac-4ea7-ad82-b57d222ab128
ms.service: role-based-access-control
ms.workload: multiple
ms.tgt_pltfrm: rest-api
ms.devlang: na
ms.topic: conceptual
ms.date: 09/11/2019
ms.author: rolyon
ms.reviewer: bagovind

---
# List role assignments using RBAC and the REST API

[Role-based access control (RBAC)](overview.md) is the way that you manage access to Azure resources. This article describes how you manage access for users, groups, and applications using RBAC and the REST API.

## List role assignments

In RBAC, to list access, you list the role assignments. To list role assignments, use one of the [Role Assignments - List](/rest/api/authorization/roleassignments/list) REST APIs. To refine your results, you specify a scope and an optional filter.

1. Start with the following request:

    ```http
    GET https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleAssignments?api-version=2015-07-01&$filter={filter}
    ```

1. Within the URI, replace *{scope}* with the scope for which you want to list the role assignments.

    | Scope | Type |
    | --- | --- |
    | `providers/Microsoft.Management/managementGroups/{groupId1}` | Management group |
    | `subscriptions/{subscriptionId1}` | Subscription |
    | `subscriptions/{subscriptionId1}/resourceGroups/myresourcegroup1` | Resource group |
    | `subscriptions/{subscriptionId1}/resourceGroups/myresourcegroup1/ providers/Microsoft.Web/sites/mysite1` | Resource |

    In the previous example, microsoft.web is a resource provider that refers to an App Service instance. Similarly, you can use any other resource providers and specify the scope. For more information, see [Azure Resource providers and types](../azure-resource-manager/resource-manager-supported-services.md) and supported [Azure Resource Manager resource provider operations](resource-provider-operations.md).  
     
1. Replace *{filter}* with the condition that you want to apply to filter the role assignment list.

    | Filter | Description |
    | --- | --- |
    | `$filter=atScope()` | Lists role assignments for only the specified scope, not including the role assignments at subscopes. |
    | `$filter=principalId%20eq%20'{objectId}'` | Lists role assignments for a specified user, group, or service principal. |
    | `$filter=assignedTo('{objectId}')` | Lists role assignments for a specified user or service principal. If the user is a member of a group that has a role assignment, that role assignment is also listed. This filter is transitive for groups which means that if the user is a member of a group and that group is a member of another group that has a role assignment, that role assignment is also listed. This filter only accepts an object ID for a user or a service principal. You cannot pass an object ID for a group. |

## Next steps

- [Deploy resources with Resource Manager templates and Resource Manager REST API](../azure-resource-manager/resource-group-template-deploy-rest.md)
- [Azure REST API Reference](/rest/api/azure/)
- [Create custom roles for Azure resources using the REST API](custom-roles-rest.md)
