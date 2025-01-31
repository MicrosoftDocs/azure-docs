---
title: Azure built-in roles for General - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the General category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 01/25/2025
ms.custom: generated
---

# Azure built-in roles for General

This article lists the Azure built-in roles in the General category.


## Reader

View all resources, but does not allow you to make any changes.

[!INCLUDE [role-read-permissions.md](../includes/role-read-permissions.md)]

[Learn more](/azure/role-based-access-control/rbac-and-directory-admin-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | */read | Read control plane information for all Azure resources. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "View all resources, but does not allow you to make any changes.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7",
  "name": "acdd72a7-3385-48ef-bd42-f606fba81ae7",
  "permissions": [
    {
      "actions": [
        "*/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)