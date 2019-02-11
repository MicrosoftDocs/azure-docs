---
title: List deny assignments using RBAC and the REST API - Azure | Microsoft Docs
description: Learn how to list deny assignments for users, groups, and applications, using role-based access control (RBAC) and the REST API.
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
ms.date: 09/24/2018
ms.author: rolyon
ms.reviewer: bagovind

---
# List deny assignments using RBAC and the REST API

Currently, deny assignments are **read-only** and can only be set by Azure. Even though you can't create your own deny assignments, you can list deny assignments because they could impact your effective permissions. This article describes how you to list deny assignments using RBAC and the REST API.

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

- [Understand deny assignments](deny-assignments.md)
- [Elevate access for a Global Administrator in Azure Active Directory](elevate-access-global-admin.md)
- [Azure REST API Reference](/rest/api/azure/)
