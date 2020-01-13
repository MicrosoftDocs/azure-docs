---
title: List role assignments using Azure RBAC and the REST API
description: Learn how to determine what resources users, groups, service principals, or managed identities have access to using Azure role-based access control (RBAC) and the REST API.
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
ms.date: 01/10/2020
ms.author: rolyon
ms.reviewer: bagovind

---
# List role assignments using Azure RBAC and the REST API

[!INCLUDE [Azure RBAC definition list access](../../includes/role-based-access-control-definition-list.md)] This article describes how to list role assignments using the REST API.

> [!NOTE]
> If your organization has outsourced management functions to a service provider who uses [Azure delegated resource management](../lighthouse/concepts/azure-delegated-resource-management.md), role assignments authorized by that service provider won't be shown here.

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

- [Add or remove role assignments using Azure RBAC and the REST API](role-assignments-rest.md)
- [Azure REST API Reference](/rest/api/azure/)
