---
title: List Azure deny assignments using the REST API - Azure RBAC
description: Learn how to list Azure deny assignments for users, groups, and applications using the REST API and Azure role-based access control (Azure RBAC).
services: active-directory
documentationcenter: na
author: rolyon
manager: amycolannino
editor: ''

ms.assetid: 
ms.service: role-based-access-control
ms.workload: multiple
ms.tgt_pltfrm: rest-api
ms.topic: how-to
ms.date: 10/19/2022
ms.author: rolyon
ms.reviewer: bagovind

---
# List Azure deny assignments using the REST API

[Azure deny assignments](deny-assignments.md) block users from performing specific Azure resource actions even if a role assignment grants them access. This article describes how to list deny assignments using the REST API.

> [!NOTE]
> You can't directly create your own deny assignments. For more information, see [Azure deny assignments](deny-assignments.md).

## Prerequisites

To get information about a deny assignment, you must have:

- `Microsoft.Authorization/denyAssignments/read` permission, which is included in most [Azure built-in roles](built-in-roles.md).

You must use the following version:

- `2018-07-01-preview` or later
- `2022-04-01` is the first stable version

For more information, see [API versions of Azure RBAC REST APIs](/rest/api/authorization/versions).

## List a single deny assignment

To list a single deny assignment, use the [Deny Assignments - Get](/rest/api/authorization/deny-assignments/get) REST API.

1. Start with the following request:

    ```http
    GET https://management.azure.com/{scope}/providers/Microsoft.Authorization/denyAssignments/{deny-assignment-id}?api-version=2022-04-01
    ```

1. Within the URI, replace *{scope}* with the scope for which you want to list the deny assignments.

    > [!div class="mx-tableFixed"]
    > | Scope | Type |
    > | --- | --- |
    > | `subscriptions/{subscriptionId}` | Subscription |
    > | `subscriptions/{subscriptionId}/resourceGroups/myresourcegroup1` | Resource group |
    > | `subscriptions/{subscriptionId}/resourceGroups/myresourcegroup1/providers/Microsoft.Web/sites/mysite1` | Resource |

1. Replace *{deny-assignment-id}* with the deny assignment identifier you want to retrieve.

## List multiple deny assignments

To list multiple deny assignments, use the [Deny Assignments - List](/rest/api/authorization/deny-assignments/list) REST API.

1. Start with one of the following requests:

    ```http
    GET https://management.azure.com/{scope}/providers/Microsoft.Authorization/denyAssignments?api-version=2022-04-01
    ```

    With optional parameters:

    ```http
    GET https://management.azure.com/{scope}/providers/Microsoft.Authorization/denyAssignments?api-version=2022-04-01&$filter={filter}
    ```

1. Within the URI, replace *{scope}* with the scope for which you want to list the deny assignments.

    > [!div class="mx-tableFixed"]
    > | Scope | Type |
    > | --- | --- |
    > | `subscriptions/{subscriptionId}` | Subscription |
    > | `subscriptions/{subscriptionId}/resourceGroups/myresourcegroup1` | Resource group |
    > | `subscriptions/{subscriptionId}/resourceGroups/myresourcegroup1/providers/Microsoft.Web/sites/mysite1` | Resource |

1. Replace *{filter}* with the condition that you want to apply to filter the deny assignment list.

    > [!div class="mx-tableFixed"]
    > | Filter | Description |
    > | --- | --- |
    > | (no filter) | Lists all deny assignments at, above, and below the specified scope. |
    > | `$filter=atScope()` | Lists deny assignments for only the specified scope and above. Does not include the deny assignments at subscopes. |
    > | `$filter=assignedTo('{objectId}')` | Lists deny assignments for the specified user or service principal.<br/>If the user is a member of a group that has a deny assignment, that deny assignment is also listed. This filter is transitive for groups which means that if the user is a member of a group and that group is a member of another group that has a deny assignment, that deny assignment is also listed.<br/>This filter only accepts an object ID for a user or a service principal. You cannot pass an object ID for a group. |
    > | `$filter=atScope()+and+assignedTo('{objectId}')` | Lists deny assignments for the specified user or service principal and at the specified scope. |
    > | `$filter=denyAssignmentName+eq+'{deny-assignment-name}'` | Lists deny assignments with the specified name. |
    > | `$filter=principalId+eq+'{objectId}'` | Lists deny assignments for the specified user, group, or service principal. |

## List deny assignments at the root scope (/)

1. Elevate your access as described in [Elevate access to manage all Azure subscriptions and management groups](elevate-access-global-admin.md).

1. Use the following request:

    ```http
    GET https://management.azure.com/providers/Microsoft.Authorization/denyAssignments?api-version=2022-04-01&$filter={filter}
    ```

1. Replace *{filter}* with the condition that you want to apply to filter the deny assignment list. A filter is required.

    > [!div class="mx-tableFixed"]
    > | Filter | Description |
    > | --- | --- |
    > | `$filter=atScope()` | List deny assignments for only the root scope. Does not include the deny assignments at subscopes. |
    > | `$filter=denyAssignmentName+eq+'{deny-assignment-name}'` | List deny assignments with the specified name. |

1. Remove elevated access.

## Next steps

- [Understand Azure deny assignments](deny-assignments.md)
- [Elevate access to manage all Azure subscriptions and management groups](elevate-access-global-admin.md)
- [Azure REST API Reference](/rest/api/azure/)
