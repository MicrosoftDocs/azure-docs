---
title: List Azure role assignments using the REST API - Azure RBAC
description: Learn how to determine what resources users, groups, service principals, or managed identities have access to using the REST API and Azure role-based access control (Azure RBAC).
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
ms.topic: how-to
ms.date: 05/06/2020
ms.author: rolyon
ms.reviewer: bagovind

---
# List Azure role assignments using the REST API

[!INCLUDE [Azure RBAC definition list access](../../includes/role-based-access-control-definition-list.md)] This article describes how to list role assignments using the REST API.

> [!NOTE]
> If your organization has outsourced management functions to a service provider who uses [Azure delegated resource management](../lighthouse/concepts/azure-delegated-resource-management.md), role assignments authorized by that service provider won't be shown here.

## List role assignments

In Azure RBAC, to list access, you list the role assignments. To list role assignments, use one of the [Role Assignments - List](/rest/api/authorization/roleassignments/list) REST APIs. To refine your results, you specify a scope and an optional filter.

1. Start with the following request:

    ```http
    GET https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleAssignments?api-version=2015-07-01&$filter={filter}
    ```

1. Within the URI, replace *{scope}* with the scope for which you want to list the role assignments.

    > [!div class="mx-tableFixed"]
    > | Scope | Type |
    > | --- | --- |
    > | `providers/Microsoft.Management/managementGroups/{groupId1}` | Management group |
    > | `subscriptions/{subscriptionId1}` | Subscription |
    > | `subscriptions/{subscriptionId1}/resourceGroups/myresourcegroup1` | Resource group |
    > | `subscriptions/{subscriptionId1}/resourceGroups/myresourcegroup1/providers/Microsoft.Web/sites/mysite1` | Resource |

    In the previous example, microsoft.web is a resource provider that refers to an App Service instance. Similarly, you can use any other resource providers and specify the scope. For more information, see [Azure Resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md) and supported [Azure Resource Manager resource provider operations](resource-provider-operations.md).  
     
1. Replace *{filter}* with the condition that you want to apply to filter the role assignment list.

    > [!div class="mx-tableFixed"]
    > | Filter | Description |
    > | --- | --- |
    > | `$filter=atScope()` | Lists role assignments for only the specified scope, not including the role assignments at subscopes. |
    > | `$filter=assignedTo('{objectId}')` | Lists role assignments for a specified user or service principal.<br/>If the user is a member of a group that has a role assignment, that role assignment is also listed. This filter is transitive for groups which means that if the user is a member of a group and that group is a member of another group that has a role assignment, that role assignment is also listed.<br/>This filter only accepts an object ID for a user or a service principal. You cannot pass an object ID for a group. |
    > | `$filter=atScope()+and+assignedTo('{objectId}')` | Lists role assignments for the specified user or service principal and at the specified scope. |
    > | `$filter=principalId+eq+'{objectId}'` | Lists role assignments for a specified user, group, or service principal. |

The following request lists all role assignments for the specified user at subscription scope:

```http
GET https://management.azure.com/subscriptions/{subscriptionId1}/providers/Microsoft.Authorization/roleAssignments?api-version=2015-07-01&$filter=atScope()+and+assignedTo('{objectId1}')
```

The following shows an example of the output:

```json
{
    "value": [
        {
            "properties": {
                "roleDefinitionId": "/subscriptions/{subscriptionId1}/providers/Microsoft.Authorization/roleDefinitions/2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
                "principalId": "{objectId1}",
                "scope": "/subscriptions/{subscriptionId1}",
                "createdOn": "2019-01-15T21:08:45.4904312Z",
                "updatedOn": "2019-01-15T21:08:45.4904312Z",
                "createdBy": "{createdByObjectId1}",
                "updatedBy": "{updatedByObjectId1}"
            },
            "id": "/subscriptions/{subscriptionId1}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentId1}",
            "type": "Microsoft.Authorization/roleAssignments",
            "name": "{roleAssignmentId1}"
        }
    ]
}
```

## Next steps

- [Add or remove Azure role assignments using the REST API](role-assignments-rest.md)
- [Azure REST API Reference](/rest/api/azure/)
