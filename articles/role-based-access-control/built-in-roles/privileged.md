---
title: Azure built-in roles for Privileged - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the Privileged category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 01/25/2025
ms.custom: generated
---

# Azure built-in roles for Privileged

This article lists the Azure built-in roles in the Privileged category.


## Contributor

Grants full access to manage all resources, but does not allow you to assign roles in Azure RBAC, manage assignments in Azure Blueprints, or share image galleries.

[Learn more](/azure/role-based-access-control/rbac-and-directory-admin-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | * | Create and manage resources of all types |
> | **NotActions** |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/Delete | Delete roles, policy assignments, policy definitions and policy set definitions |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/Write | Create roles, role assignments, policy assignments, policy definitions and policy set definitions |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/elevateAccess/Action | Grants the caller User Access Administrator access at the tenant scope |
> | [Microsoft.Blueprint](../permissions/management-and-governance.md#microsoftblueprint)/blueprintAssignments/write | Create or update any blueprint assignments |
> | [Microsoft.Blueprint](../permissions/management-and-governance.md#microsoftblueprint)/blueprintAssignments/delete | Delete any blueprint assignments |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/galleries/share/action | Shares a Gallery to different scopes |
> | [Microsoft.Purview](../permissions/analytics.md#microsoftpurview)/consents/write | Create or Update a Consent Resource. |
> | [Microsoft.Purview](../permissions/analytics.md#microsoftpurview)/consents/delete | Delete the Consent Resource. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deploymentStacks/manageDenySetting/action | Manage the denySettings property of a deployment stack. |
> | [Microsoft.Subscription](../permissions/general.md#microsoftsubscription)/cancel/action | Cancels the Subscription |
> | [Microsoft.Subscription](../permissions/general.md#microsoftsubscription)/enable/action | Reactivates the Subscription |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants full access to manage all resources, but does not allow you to assign roles in Azure RBAC, manage assignments in Azure Blueprints, or share image galleries.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c",
  "name": "b24988ac-6180-42a0-ab88-20f7382dd24c",
  "permissions": [
    {
      "actions": [
        "*"
      ],
      "notActions": [
        "Microsoft.Authorization/*/Delete",
        "Microsoft.Authorization/*/Write",
        "Microsoft.Authorization/elevateAccess/Action",
        "Microsoft.Blueprint/blueprintAssignments/write",
        "Microsoft.Blueprint/blueprintAssignments/delete",
        "Microsoft.Compute/galleries/share/action",
        "Microsoft.Purview/consents/write",
        "Microsoft.Purview/consents/delete",
        "Microsoft.Resources/deploymentStacks/manageDenySetting/action",
        "Microsoft.Subscription/cancel/action",
        "Microsoft.Subscription/enable/action"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Owner

Grants full access to manage all resources, including the ability to assign roles in Azure RBAC.

[Learn more](/azure/role-based-access-control/rbac-and-directory-admin-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | * | Create and manage resources of all types |
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
  "description": "Grants full access to manage all resources, including the ability to assign roles in Azure RBAC.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/8e3af657-a8ff-443c-a75c-2fe8c4bcb635",
  "name": "8e3af657-a8ff-443c-a75c-2fe8c4bcb635",
  "permissions": [
    {
      "actions": [
        "*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Reservations Administrator

Lets one read and manage all the reservations in a tenant

[Learn more](/azure/cost-management-billing/reservations/view-reservations)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Capacity](../permissions/general.md#microsoftcapacity)/*/read |  |
> | [Microsoft.Capacity](../permissions/general.md#microsoftcapacity)/*/action |  |
> | [Microsoft.Capacity](../permissions/general.md#microsoftcapacity)/*/write |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleDefinitions/read | Get information about a role definition. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/write | Create a role assignment at the specified scope. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/delete | Delete a role assignment at the specified scope. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/providers/Microsoft.Capacity"
  ],
  "description": "Lets one read and manage all the reservations in a tenant",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/a8889054-8d42-49c9-bc1c-52486c10e7cd",
  "name": "a8889054-8d42-49c9-bc1c-52486c10e7cd",
  "permissions": [
    {
      "actions": [
        "Microsoft.Capacity/*/read",
        "Microsoft.Capacity/*/action",
        "Microsoft.Capacity/*/write",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Authorization/roleDefinitions/read",
        "Microsoft.Authorization/roleAssignments/write",
        "Microsoft.Authorization/roleAssignments/delete"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Reservations Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Role Based Access Control Administrator

Manage access to Azure resources by assigning roles using Azure RBAC. This role does not allow you to manage access using other ways, such as Azure Policy.

[!INCLUDE [role-read-permissions.md](../includes/role-read-permissions.md)]

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/write | Create a role assignment at the specified scope. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/delete | Delete a role assignment at the specified scope. |
> | */read | Read control plane information for all Azure resources. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
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
  "description": "Manage access to Azure resources by assigning roles using Azure RBAC. This role does not allow you to manage access using other ways, such as Azure Policy.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f58310d9-a9f6-439a-9e8d-f62e7b41a168",
  "name": "f58310d9-a9f6-439a-9e8d-f62e7b41a168",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/roleAssignments/write",
        "Microsoft.Authorization/roleAssignments/delete",
        "*/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Role Based Access Control Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## User Access Administrator

Lets you manage user access to Azure resources.

[!INCLUDE [role-read-permissions.md](../includes/role-read-permissions.md)]

[Learn more](/azure/role-based-access-control/rbac-and-directory-admin-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | */read | Read control plane information for all Azure resources. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/* | Manage authorization |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
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
  "description": "Lets you manage user access to Azure resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/18d7d88d-d35e-4fb5-a5c3-7773c20a72d9",
  "name": "18d7d88d-d35e-4fb5-a5c3-7773c20a72d9",
  "permissions": [
    {
      "actions": [
        "*/read",
        "Microsoft.Authorization/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "User Access Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)