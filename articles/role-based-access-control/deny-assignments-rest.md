---
title: List deny assignments for Azure resources using the REST API - Azure | Microsoft Docs
description: Learn how to list deny assignments for users, groups, and applications, using role-based access control (RBAC) for Azure resources and the REST API.
services: active-directory
documentationcenter: na
author: rolyon
manager: mtillman
editor: ''

ms.assetid: 
ms.service: role-based-access-control
ms.workload: multiple
ms.tgt_pltfrm: rest-api
ms.devlang: na
ms.topic: conceptual
ms.date: 03/13/2019
ms.author: rolyon
ms.reviewer: bagovind

---
# List deny assignments for Azure resources using the REST API

[Deny assignments](deny-assignments.md) block users from performing specific Azure resource actions even if a role assignment grants them access. This article describes how to use the REST API to list deny assignments.

> [!NOTE]
> At this time, the only way you can add your own deny assignments is by using Azure Blueprints. For more information, see [Protect new resources with Azure Blueprints resource locks](../governance/blueprints/tutorials/protect-new-resources.md).

## Prerequisites

To get information about a deny assignment, you must have:

- `Microsoft.Authorization/denyAssignments/read` permission, which is included in most [built-in roles for Azure resources](built-in-roles.md).

## List a single deny assignment

1. Start with the following request:

    ```http
    GET https://management.azure.com/{scope}/providers/Microsoft.Authorization/denyAssignments/{deny-assignment-id}?api-version=2018-07-01-preview
    ```

1. Within the URI, replace *{scope}* with the scope for which you want to list the deny assignments.

    | Scope | Type |
    | --- | --- |
    | `subscriptions/{subscriptionId}` | Subscription |
    | `subscriptions/{subscriptionId}/resourceGroups/myresourcegroup1` | Resource group |
    | `subscriptions/{subscriptionId}/resourceGroups/myresourcegroup1/ providers/Microsoft.Web/sites/mysite1` | Resource |

1. Replace *{deny-assignment-id}* with the deny assignment identifier you want to retrieve.

## List multiple deny assignments

1. Start with one of the following requests:

    ```http
    GET https://management.azure.com/{scope}/providers/Microsoft.Authorization/denyAssignments?api-version=2018-07-01-preview
    ```

    With optional parameters:

    ```http
    GET https://management.azure.com/{scope}/providers/Microsoft.Authorization/denyAssignments?api-version=2018-07-01-preview&$filter={filter}
    ```

1. Within the URI, replace *{scope}* with the scope for which you want to list the deny assignments.

    | Scope | Type |
    | --- | --- |
    | `subscriptions/{subscriptionId}` | Subscription |
    | `subscriptions/{subscriptionId}/resourceGroups/myresourcegroup1` | Resource group |
    | `subscriptions/{subscriptionId}/resourceGroups/myresourcegroup1/ providers/Microsoft.Web/sites/mysite1` | Resource |

1. Replace *{filter}* with the condition that you want to apply to filter the deny assignment list.

    | Filter | Description |
    | --- | --- |
    | (no filter) | List all deny assignments at, above, and below the specified scope. |
    | `$filter=atScope()` | List deny assignments for only the specified scope and above. Does not include the deny assignments at subscopes. |
    | `$filter=denyAssignmentName%20eq%20'{deny-assignment-name}'` | List deny assignments with the specified name. |

## List deny assignments at the root scope (/)

1. Elevate your access as described in [Elevate access for a Global Administrator in Azure Active Directory](elevate-access-global-admin.md).

1. Use the following request:

    ```http
    GET https://management.azure.com/providers/Microsoft.Authorization/denyAssignments?api-version=2018-07-01-preview&$filter={filter}
    ```

1. Replace *{filter}* with the condition that you want to apply to filter the deny assignment list. A filter is required.

    | Filter | Description |
    | --- | --- |
    | `$filter=atScope()` | List deny assignments for only the root scope. Does not include the deny assignments at subscopes. |
    | `$filter=denyAssignmentName%20eq%20'{deny-assignment-name}'` | List deny assignments with the specified name. |

1. Remove elevated access.

## Next steps

- [Understand deny assignments for Azure resources](deny-assignments.md)
- [Elevate access for a Global Administrator in Azure Active Directory](elevate-access-global-admin.md)
- [Azure REST API Reference](/rest/api/azure/)
