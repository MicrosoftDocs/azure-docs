---
title: Azure built-in roles for Compute - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the Compute category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure built-in roles for Compute

This article lists the Azure built-in roles in the Compute category.


## Classic Virtual Machine Contributor

Lets you manage classic virtual machines, but not access to them, and not the virtual network or storage account they're connected to.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.ClassicCompute](../permissions/compute.md#microsoftclassiccompute)/domainNames/* | Create and manage classic compute domain names |
> | [Microsoft.ClassicCompute](../permissions/compute.md#microsoftclassiccompute)/virtualMachines/* | Create and manage virtual machines |
> | [Microsoft.ClassicNetwork](../permissions/networking.md#microsoftclassicnetwork)/networkSecurityGroups/join/action |  |
> | [Microsoft.ClassicNetwork](../permissions/networking.md#microsoftclassicnetwork)/reservedIps/link/action | Link a reserved Ip |
> | [Microsoft.ClassicNetwork](../permissions/networking.md#microsoftclassicnetwork)/reservedIps/read | Gets the reserved Ips |
> | [Microsoft.ClassicNetwork](../permissions/networking.md#microsoftclassicnetwork)/virtualNetworks/join/action | Joins the virtual network. |
> | [Microsoft.ClassicNetwork](../permissions/networking.md#microsoftclassicnetwork)/virtualNetworks/read | Get the virtual network. |
> | [Microsoft.ClassicStorage](../permissions/storage.md#microsoftclassicstorage)/storageAccounts/disks/read | Returns the storage account disk. |
> | [Microsoft.ClassicStorage](../permissions/storage.md#microsoftclassicstorage)/storageAccounts/images/read | Returns the storage account image. (Deprecated. Use 'Microsoft.ClassicStorage/storageAccounts/vmImages') |
> | [Microsoft.ClassicStorage](../permissions/storage.md#microsoftclassicstorage)/storageAccounts/listKeys/action | Lists the access keys for the storage accounts. |
> | [Microsoft.ClassicStorage](../permissions/storage.md#microsoftclassicstorage)/storageAccounts/read | Return the storage account with the given account. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
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
  "description": "Lets you manage classic virtual machines, but not access to them, and not the virtual network or storage account they're connected to.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/d73bb868-a0df-4d4d-bd69-98a00b01fccb",
  "name": "d73bb868-a0df-4d4d-bd69-98a00b01fccb",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.ClassicCompute/domainNames/*",
        "Microsoft.ClassicCompute/virtualMachines/*",
        "Microsoft.ClassicNetwork/networkSecurityGroups/join/action",
        "Microsoft.ClassicNetwork/reservedIps/link/action",
        "Microsoft.ClassicNetwork/reservedIps/read",
        "Microsoft.ClassicNetwork/virtualNetworks/join/action",
        "Microsoft.ClassicNetwork/virtualNetworks/read",
        "Microsoft.ClassicStorage/storageAccounts/disks/read",
        "Microsoft.ClassicStorage/storageAccounts/images/read",
        "Microsoft.ClassicStorage/storageAccounts/listKeys/action",
        "Microsoft.ClassicStorage/storageAccounts/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Classic Virtual Machine Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Data Operator for Managed Disks

Provides permissions to upload data to empty managed disks, read, or export data of managed disks (not attached to running VMs) and snapshots using SAS URIs and Azure AD authentication.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/download/action | Perform read data operations on Disk SAS Uri |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/upload/action | Perform write data operations on Disk SAS Uri |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/snapshots/download/action | Perform read data operations on Snapshot SAS Uri |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/snapshots/upload/action | Perform write data operations on Snapshot SAS Uri |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Provides permissions to upload data to empty managed disks, read, or export data of managed disks (not attached to running VMs) and snapshots using SAS URIs and Azure AD authentication.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/959f8984-c045-4866-89c7-12bf9737be2e",
  "name": "959f8984-c045-4866-89c7-12bf9737be2e",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Compute/disks/download/action",
        "Microsoft.Compute/disks/upload/action",
        "Microsoft.Compute/snapshots/download/action",
        "Microsoft.Compute/snapshots/upload/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Data Operator for Managed Disks",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Desktop Virtualization Application Group Contributor

Contributor of the Desktop Virtualization Application Group.

[Learn more](/azure/virtual-desktop/rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/applicationgroups/* |  |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/hostpools/read | Read hostpools |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/hostpools/sessionhosts/read | Read hostpools/sessionhosts |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
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
  "description": "Contributor of the Desktop Virtualization Application Group.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/86240b0e-9422-4c43-887b-b61143f32ba8",
  "name": "86240b0e-9422-4c43-887b-b61143f32ba8",
  "permissions": [
    {
      "actions": [
        "Microsoft.DesktopVirtualization/applicationgroups/*",
        "Microsoft.DesktopVirtualization/hostpools/read",
        "Microsoft.DesktopVirtualization/hostpools/sessionhosts/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Desktop Virtualization Application Group Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Desktop Virtualization Application Group Reader

Reader of the Desktop Virtualization Application Group.

[Learn more](/azure/virtual-desktop/rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/applicationgroups/*/read |  |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/applicationgroups/read | Read applicationgroups |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/hostpools/read | Read hostpools |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/hostpools/sessionhosts/read | Read hostpools/sessionhosts |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/read | Gets or lists deployments. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/read | Read a classic metric alert |
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
  "description": "Reader of the Desktop Virtualization Application Group.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/aebf23d0-b568-4e86-b8f9-fe83a2c6ab55",
  "name": "aebf23d0-b568-4e86-b8f9-fe83a2c6ab55",
  "permissions": [
    {
      "actions": [
        "Microsoft.DesktopVirtualization/applicationgroups/*/read",
        "Microsoft.DesktopVirtualization/applicationgroups/read",
        "Microsoft.DesktopVirtualization/hostpools/read",
        "Microsoft.DesktopVirtualization/hostpools/sessionhosts/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Desktop Virtualization Application Group Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Desktop Virtualization Contributor

Contributor of Desktop Virtualization.

[Learn more](/azure/virtual-desktop/rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/* |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
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
  "description": "Contributor of Desktop Virtualization.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/082f0a83-3be5-4ba1-904c-961cca79b387",
  "name": "082f0a83-3be5-4ba1-904c-961cca79b387",
  "permissions": [
    {
      "actions": [
        "Microsoft.DesktopVirtualization/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Desktop Virtualization Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Desktop Virtualization Host Pool Contributor

Contributor of the Desktop Virtualization Host Pool.

[Learn more](/azure/virtual-desktop/rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/hostpools/* |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
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
  "description": "Contributor of the Desktop Virtualization Host Pool.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/e307426c-f9b6-4e81-87de-d99efb3c32bc",
  "name": "e307426c-f9b6-4e81-87de-d99efb3c32bc",
  "permissions": [
    {
      "actions": [
        "Microsoft.DesktopVirtualization/hostpools/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Desktop Virtualization Host Pool Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Desktop Virtualization Host Pool Reader

Reader of the Desktop Virtualization Host Pool.

[Learn more](/azure/virtual-desktop/rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/hostpools/*/read |  |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/hostpools/read | Read hostpools |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/read | Gets or lists deployments. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/read | Read a classic metric alert |
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
  "description": "Reader of the Desktop Virtualization Host Pool.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/ceadfde2-b300-400a-ab7b-6143895aa822",
  "name": "ceadfde2-b300-400a-ab7b-6143895aa822",
  "permissions": [
    {
      "actions": [
        "Microsoft.DesktopVirtualization/hostpools/*/read",
        "Microsoft.DesktopVirtualization/hostpools/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Desktop Virtualization Host Pool Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Desktop Virtualization Reader

Reader of Desktop Virtualization.

[Learn more](/azure/virtual-desktop/rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/*/read |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/read | Gets or lists deployments. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/read | Read a classic metric alert |
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
  "description": "Reader of Desktop Virtualization.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/49a72310-ab8d-41df-bbb0-79b649203868",
  "name": "49a72310-ab8d-41df-bbb0-79b649203868",
  "permissions": [
    {
      "actions": [
        "Microsoft.DesktopVirtualization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Desktop Virtualization Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Desktop Virtualization Session Host Operator

Operator of the Desktop Virtualization Session Host.

[Learn more](/azure/virtual-desktop/rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/hostpools/read | Read hostpools |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/hostpools/sessionhosts/* |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
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
  "description": "Operator of the Desktop Virtualization Session Host.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/2ad6aaab-ead9-4eaa-8ac5-da422f562408",
  "name": "2ad6aaab-ead9-4eaa-8ac5-da422f562408",
  "permissions": [
    {
      "actions": [
        "Microsoft.DesktopVirtualization/hostpools/read",
        "Microsoft.DesktopVirtualization/hostpools/sessionhosts/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Desktop Virtualization Session Host Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Desktop Virtualization User

Allows user to use the applications in an application group.

[Learn more](/azure/virtual-desktop/delegated-access-virtual-desktop)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/applicationGroups/useApplications/action | Use ApplicationGroup |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/appAttachPackages/useApplications/action | Allow user permissioning on app attach packages in an application group |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows user to use the applications in an application group.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/1d18fff3-a72a-46b5-b4a9-0b38a3cd7e63",
  "name": "1d18fff3-a72a-46b5-b4a9-0b38a3cd7e63",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.DesktopVirtualization/applicationGroups/useApplications/action",
        "Microsoft.DesktopVirtualization/appAttachPackages/useApplications/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Desktop Virtualization User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Desktop Virtualization User Session Operator

Operator of the Desktop Virtualization User Session.

[Learn more](/azure/virtual-desktop/rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/hostpools/read | Read hostpools |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/hostpools/sessionhosts/read | Read hostpools/sessionhosts |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/hostpools/sessionhosts/usersessions/* |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
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
  "description": "Operator of the Desktop Virtualization Uesr Session.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/ea4bfff8-7fb4-485a-aadd-d4129a0ffaa6",
  "name": "ea4bfff8-7fb4-485a-aadd-d4129a0ffaa6",
  "permissions": [
    {
      "actions": [
        "Microsoft.DesktopVirtualization/hostpools/read",
        "Microsoft.DesktopVirtualization/hostpools/sessionhosts/read",
        "Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Desktop Virtualization User Session Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Desktop Virtualization Workspace Contributor

Contributor of the Desktop Virtualization Workspace.

[Learn more](/azure/virtual-desktop/rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/workspaces/* |  |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/applicationgroups/read | Read applicationgroups |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
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
  "description": "Contributor of the Desktop Virtualization Workspace.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/21efdde3-836f-432b-bf3d-3e8e734d4b2b",
  "name": "21efdde3-836f-432b-bf3d-3e8e734d4b2b",
  "permissions": [
    {
      "actions": [
        "Microsoft.DesktopVirtualization/workspaces/*",
        "Microsoft.DesktopVirtualization/applicationgroups/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Desktop Virtualization Workspace Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Desktop Virtualization Workspace Reader

Reader of the Desktop Virtualization Workspace.

[Learn more](/azure/virtual-desktop/rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/workspaces/read | Read workspaces |
> | [Microsoft.DesktopVirtualization](../permissions/compute.md#microsoftdesktopvirtualization)/applicationgroups/read | Read applicationgroups |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/read | Gets or lists deployments. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/read | Read a classic metric alert |
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
  "description": "Reader of the Desktop Virtualization Workspace.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/0fa44ee9-7a7d-466b-9bb2-2bf446b1204d",
  "name": "0fa44ee9-7a7d-466b-9bb2-2bf446b1204d",
  "permissions": [
    {
      "actions": [
        "Microsoft.DesktopVirtualization/workspaces/read",
        "Microsoft.DesktopVirtualization/applicationgroups/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Desktop Virtualization Workspace Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Disk Backup Reader

Provides permission to backup vault to perform disk backup.

[Learn more](/azure/backup/disk-backup-faq)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/read | Get the properties of a Disk |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/beginGetAccess/action | Get the SAS URI of the Disk for blob access |
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
  "description": "Provides permission to backup vault to perform disk backup.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/3e5e47e6-65f7-47ef-90b5-e5dd4d455f24",
  "name": "3e5e47e6-65f7-47ef-90b5-e5dd4d455f24",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Compute/disks/read",
        "Microsoft.Compute/disks/beginGetAccess/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Disk Backup Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Disk Pool Operator

Provide permission to StoragePool Resource Provider to manage disks added to a disk pool.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/write | Creates a new Disk or updates an existing one |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/read | Get the properties of a Disk |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
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
  "description": "Used by the StoragePool Resource Provider to manage Disks added to a Disk Pool.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/60fc6e62-5479-42d4-8bf4-67625fcc2840",
  "name": "60fc6e62-5479-42d4-8bf4-67625fcc2840",
  "permissions": [
    {
      "actions": [
        "Microsoft.Compute/disks/write",
        "Microsoft.Compute/disks/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Disk Pool Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Disk Restore Operator

Provides permission to backup vault to perform disk restore.

[Learn more](/azure/backup/restore-managed-disks)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/write | Creates a new Disk or updates an existing one |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/read | Get the properties of a Disk |
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
  "description": "Provides permission to backup vault to perform disk restore.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/b50d9833-a0cb-478e-945f-707fcc997c13",
  "name": "b50d9833-a0cb-478e-945f-707fcc997c13",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Compute/disks/write",
        "Microsoft.Compute/disks/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Disk Restore Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Disk Snapshot Contributor

Provides permission to backup vault to manage disk snapshots.

[Learn more](/azure/backup/backup-managed-disks)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/snapshots/delete | Delete a Snapshot |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/snapshots/write | Create a new Snapshot or update an existing one |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/snapshots/read | Get the properties of a Snapshot |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/snapshots/beginGetAccess/action | Get the SAS URI of the Snapshot for blob access |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/snapshots/endGetAccess/action | Revoke the SAS URI of the Snapshot |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/beginGetAccess/action | Get the SAS URI of the Disk for blob access |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/listkeys/action | Returns the access keys for the specified storage account. |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/write | Creates a storage account with the specified parameters or update the properties or tags or adds custom domain for the specified storage account. |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/delete | Deletes an existing storage account. |
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
  "description": "Provides permission to backup vault to manage disk snapshots.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/7efff54f-a5b4-42b5-a1c5-5411624893ce",
  "name": "7efff54f-a5b4-42b5-a1c5-5411624893ce",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Compute/snapshots/delete",
        "Microsoft.Compute/snapshots/write",
        "Microsoft.Compute/snapshots/read",
        "Microsoft.Compute/snapshots/beginGetAccess/action",
        "Microsoft.Compute/snapshots/endGetAccess/action",
        "Microsoft.Compute/disks/beginGetAccess/action",
        "Microsoft.Storage/storageAccounts/listkeys/action",
        "Microsoft.Storage/storageAccounts/write",
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.Storage/storageAccounts/delete"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Disk Snapshot Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Virtual Machine Administrator Login

View Virtual Machines in the portal and login as administrator

[Learn more](/entra/identity/devices/howto-vm-sign-in-azure-ad-windows)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/publicIPAddresses/read | Gets a public IP address definition. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/read | Get the virtual network definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/read | Gets a load balancer definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/read | Gets a network interface definition.  |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/*/read |  |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/*/read |  |
> | [Microsoft.HybridConnectivity](../permissions/hybrid-multicloud.md#microsofthybridconnectivity)/endpoints/listCredentials/action | Gets the endpoint access credentials to the resource. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/login/action | Log in to a virtual machine as a regular user |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/loginAsAdmin/action | Log in to a virtual machine with Windows administrator or Linux root user privileges |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/login/action | Log in to an Azure Arc machine as a regular user |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/loginAsAdmin/action | Log in to an Azure Arc machine with Windows administrator or Linux root user privilege |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "View Virtual Machines in the portal and login as administrator",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/1c0163c0-47e6-4577-8991-ea5c82e286e4",
  "name": "1c0163c0-47e6-4577-8991-ea5c82e286e4",
  "permissions": [
    {
      "actions": [
        "Microsoft.Network/publicIPAddresses/read",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/loadBalancers/read",
        "Microsoft.Network/networkInterfaces/read",
        "Microsoft.Compute/virtualMachines/*/read",
        "Microsoft.HybridCompute/machines/*/read",
        "Microsoft.HybridConnectivity/endpoints/listCredentials/action"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Compute/virtualMachines/login/action",
        "Microsoft.Compute/virtualMachines/loginAsAdmin/action",
        "Microsoft.HybridCompute/machines/login/action",
        "Microsoft.HybridCompute/machines/loginAsAdmin/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Virtual Machine Administrator Login",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Virtual Machine Contributor

Create and manage virtual machines, manage disks, install and run software, reset password of the root user of the virtual machine using VM extensions, and manage local user accounts using VM extensions. This role does not grant you management access to the virtual network or storage account the virtual machines are connected to. This role does not allow you to assign roles in Azure RBAC.

[Learn more](/azure/architecture/reference-architectures/n-tier/linux-vm)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/availabilitySets/* | Create and manage compute availability sets |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/locations/* | Create and manage compute locations |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/* | Perform all virtual machine actions including create, update, delete, start, restart, and power off virtual machines. Execute scripts on virtual machines. |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachineScaleSets/* | Create and manage virtual machine scale sets |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/cloudServices/* |  |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/write | Creates a new Disk or updates an existing one |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/read | Get the properties of a Disk |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/delete | Deletes the Disk |
> | [Microsoft.DevTestLab](../permissions/devops.md#microsoftdevtestlab)/schedules/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/applicationGateways/backendAddressPools/join/action | Joins an application gateway backend address pool. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/backendAddressPools/join/action | Joins a load balancer backend address pool. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/inboundNatPools/join/action | Joins a load balancer inbound NAT pool. Not alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/inboundNatRules/join/action | Joins a load balancer inbound nat rule. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/probes/join/action | Allows using probes of a load balancer. For example, with this permission healthProbe property of VM scale set can reference the probe. Not alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/read | Gets a load balancer definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/locations/* | Create and manage network locations |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/* | Create and manage network interfaces |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/join/action | Joins a network security group. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/read | Gets a network security group definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/publicIPAddresses/join/action | Joins a public IP address. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/publicIPAddresses/read | Gets a public IP address definition. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/read | Get the virtual network definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/join/action | Joins a virtual network. Not Alertable. |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/locations/* |  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/backupFabrics/backupProtectionIntent/write | Create a backup Protection Intent |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/backupFabrics/protectionContainers/protectedItems/*/read |  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/backupFabrics/protectionContainers/protectedItems/read | Returns object details of the Protected Item |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/backupFabrics/protectionContainers/protectedItems/write | Create a backup Protected Item |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/backupPolicies/read | Returns all Protection Policies |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/backupPolicies/write | Creates Protection Policy |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/write | Create Vault operation creates an Azure resource of type 'vault' |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.SerialConsole/serialPorts/connect/action | Connect to a serial port |
> | [Microsoft.SqlVirtualMachine](../permissions/databases.md#microsoftsqlvirtualmachine)/* |  |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/listKeys/action | Returns the access keys for the specified storage account. |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
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
  "description": "Lets you manage virtual machines, but not access to them, and not the virtual network or storage account they're connected to.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/9980e02c-c2be-4d73-94e8-173b1dc7cf3c",
  "name": "9980e02c-c2be-4d73-94e8-173b1dc7cf3c",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Compute/availabilitySets/*",
        "Microsoft.Compute/locations/*",
        "Microsoft.Compute/virtualMachines/*",
        "Microsoft.Compute/virtualMachineScaleSets/*",
        "Microsoft.Compute/cloudServices/*",
        "Microsoft.Compute/disks/write",
        "Microsoft.Compute/disks/read",
        "Microsoft.Compute/disks/delete",
        "Microsoft.DevTestLab/schedules/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Network/applicationGateways/backendAddressPools/join/action",
        "Microsoft.Network/loadBalancers/backendAddressPools/join/action",
        "Microsoft.Network/loadBalancers/inboundNatPools/join/action",
        "Microsoft.Network/loadBalancers/inboundNatRules/join/action",
        "Microsoft.Network/loadBalancers/probes/join/action",
        "Microsoft.Network/loadBalancers/read",
        "Microsoft.Network/locations/*",
        "Microsoft.Network/networkInterfaces/*",
        "Microsoft.Network/networkSecurityGroups/join/action",
        "Microsoft.Network/networkSecurityGroups/read",
        "Microsoft.Network/publicIPAddresses/join/action",
        "Microsoft.Network/publicIPAddresses/read",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/virtualNetworks/subnets/join/action",
        "Microsoft.RecoveryServices/locations/*",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/write",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/*/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/write",
        "Microsoft.RecoveryServices/Vaults/backupPolicies/read",
        "Microsoft.RecoveryServices/Vaults/backupPolicies/write",
        "Microsoft.RecoveryServices/Vaults/read",
        "Microsoft.RecoveryServices/Vaults/usages/read",
        "Microsoft.RecoveryServices/Vaults/write",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.SerialConsole/serialPorts/connect/action",
        "Microsoft.SqlVirtualMachine/*",
        "Microsoft.Storage/storageAccounts/listKeys/action",
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Virtual Machine Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Virtual Machine Data Access Administrator (preview)

Manage access to Virtual Machines by adding or removing role assignments for the Virtual Machine Administrator Login and Virtual Machine User Login roles. Includes an ABAC condition to constrain role assignments.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/write | Create a role assignment at the specified scope. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/delete | Delete a role assignment at the specified scope. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/read | List management groups for the authenticated user. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/publicIPAddresses/read | Gets a public IP address definition. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/read | Get the virtual network definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/read | Gets a load balancer definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/read | Gets a network interface definition.  |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/*/read |  |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/*/read |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |
> | **Condition** |  |
> | ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{1c0163c0-47e6-4577-8991-ea5c82e286e4, fb879df8-f326-4884-b1cf-06f3ad86be52})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{1c0163c0-47e6-4577-8991-ea5c82e286e4, fb879df8-f326-4884-b1cf-06f3ad86be52})) | Add or remove role assignments for the following roles:<br/>Virtual Machine Administrator Login<br/>Virtual Machine User Login |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Manage access to Virtual Machines by adding or removing role assignments for the Virtual Machine Administrator Login and Virtual Machine User Login roles. Includes an ABAC condition to constrain role assignments.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/66f75aeb-eabe-4b70-9f1e-c350c4c9ad04",
  "name": "66f75aeb-eabe-4b70-9f1e-c350c4c9ad04",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/roleAssignments/write",
        "Microsoft.Authorization/roleAssignments/delete",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Management/managementGroups/read",
        "Microsoft.Network/publicIPAddresses/read",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/loadBalancers/read",
        "Microsoft.Network/networkInterfaces/read",
        "Microsoft.Compute/virtualMachines/*/read",
        "Microsoft.HybridCompute/machines/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": [],
      "conditionVersion": "2.0",
      "condition": "((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{1c0163c0-47e6-4577-8991-ea5c82e286e4, fb879df8-f326-4884-b1cf-06f3ad86be52})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{1c0163c0-47e6-4577-8991-ea5c82e286e4, fb879df8-f326-4884-b1cf-06f3ad86be52}))"
    }
  ],
  "roleName": "Virtual Machine Data Access Administrator (preview)",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Virtual Machine Local User Login

View Virtual Machines in the portal and login as a local user configured on the arc server

[Learn more](/azure/azure-arc/servers/ssh-arc-troubleshoot)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/*/read |  |
> | [Microsoft.HybridConnectivity](../permissions/hybrid-multicloud.md#microsofthybridconnectivity)/endpoints/listCredentials/action | Gets the endpoint access credentials to the resource. |
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
  "description": "View Virtual Machines in the portal and login as a local user configured on the arc server",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/602da2ba-a5c2-41da-b01d-5360126ab525",
  "name": "602da2ba-a5c2-41da-b01d-5360126ab525",
  "permissions": [
    {
      "actions": [
        "Microsoft.HybridCompute/machines/*/read",
        "Microsoft.HybridConnectivity/endpoints/listCredentials/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Virtual Machine Local User Login",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Virtual Machine User Login

View Virtual Machines in the portal and login as a regular user.

[Learn more](/entra/identity/devices/howto-vm-sign-in-azure-ad-windows)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/publicIPAddresses/read | Gets a public IP address definition. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/read | Get the virtual network definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/read | Gets a load balancer definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/read | Gets a network interface definition.  |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/*/read |  |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/*/read |  |
> | [Microsoft.HybridConnectivity](../permissions/hybrid-multicloud.md#microsofthybridconnectivity)/endpoints/listCredentials/action | Gets the endpoint access credentials to the resource. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/login/action | Log in to a virtual machine as a regular user |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/login/action | Log in to an Azure Arc machine as a regular user |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "View Virtual Machines in the portal and login as a regular user.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/fb879df8-f326-4884-b1cf-06f3ad86be52",
  "name": "fb879df8-f326-4884-b1cf-06f3ad86be52",
  "permissions": [
    {
      "actions": [
        "Microsoft.Network/publicIPAddresses/read",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/loadBalancers/read",
        "Microsoft.Network/networkInterfaces/read",
        "Microsoft.Compute/virtualMachines/*/read",
        "Microsoft.HybridCompute/machines/*/read",
        "Microsoft.HybridConnectivity/endpoints/listCredentials/action"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Compute/virtualMachines/login/action",
        "Microsoft.HybridCompute/machines/login/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Virtual Machine User Login",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Windows Admin Center Administrator Login

Let's you manage the OS of your resource via Windows Admin Center as an administrator.

[Learn more](/windows-server/manage/windows-admin-center/azure/manage-vm)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/*/read |  |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/extensions/* |  |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/upgradeExtensions/action | Upgrades Extensions on Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/operations/read | Read all Operations for Azure Arc for Servers |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/read | Gets a network interface definition.  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/read | Gets a load balancer definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/publicIPAddresses/read | Gets a public IP address definition. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/read | Get the virtual network definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/read | Gets a network security group definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/defaultSecurityRules/read | Gets a default security rule definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkWatchers/securityGroupView/action | View the configured and effective network security group rules applied on a VM. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/securityRules/read | Gets a security rule definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/securityRules/write | Creates a security rule or updates an existing security rule |
> | [Microsoft.HybridConnectivity](../permissions/hybrid-multicloud.md#microsofthybridconnectivity)/endpoints/write | Update the endpoint to the target resource. |
> | [Microsoft.HybridConnectivity](../permissions/hybrid-multicloud.md#microsofthybridconnectivity)/endpoints/read | Gets the endpoint to the resource. |
> | [Microsoft.HybridConnectivity](../permissions/hybrid-multicloud.md#microsofthybridconnectivity)/endpoints/serviceConfigurations/write | Update the service details in the service configurations of the target resource. |
> | [Microsoft.HybridConnectivity](../permissions/hybrid-multicloud.md#microsofthybridconnectivity)/endpoints/serviceConfigurations/read | Gets the details about the service to the resource. |
> | [Microsoft.HybridConnectivity](../permissions/hybrid-multicloud.md#microsofthybridconnectivity)/endpoints/listManagedProxyDetails/action | Fetches the managed proxy details  |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/read | Get the properties of a virtual machine |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/patchAssessmentResults/latest/read | Retrieves the summary of the latest patch assessment operation |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/patchAssessmentResults/latest/softwarePatches/read | Retrieves list of patches assessed during the last patch assessment operation |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/patchInstallationResults/read | Retrieves the summary of the latest patch installation operation |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/patchInstallationResults/softwarePatches/read | Retrieves list of patches attempted to be installed during the last patch installation operation |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/extensions/read | Get the properties of a virtual machine extension |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/instanceView/read | Gets the detailed runtime status of the virtual machine and its resources |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/runCommands/read | Get the properties of a virtual machine run command |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/vmSizes/read | Lists available sizes the virtual machine can be updated to |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/locations/publishers/artifacttypes/types/read | Get the properties of a VMExtension Type |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/locations/publishers/artifacttypes/types/versions/read | Get the properties of a VMExtension Version |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/diskAccesses/read | Get the properties of DiskAccess resource |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/galleries/images/read | Gets the properties of Gallery Image |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/images/read | Get the properties of the Image |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/Clusters/Read | Gets clusters |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/Clusters/ArcSettings/Read | Gets arc resource of HCI cluster |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/Clusters/ArcSettings/Extensions/Read | Gets extension resource of HCI cluster |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/Clusters/ArcSettings/Extensions/Write | Create or update extension resource of HCI cluster |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/Clusters/ArcSettings/Extensions/Delete | Delete extension resources of HCI cluster |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/Operations/Read | Gets operations |
> | Microsoft.ConnectedVMwarevSphere/VirtualMachines/Read | Read virtualmachines |
> | Microsoft.ConnectedVMwarevSphere/VirtualMachines/Extensions/Write | Write extension resource |
> | Microsoft.ConnectedVMwarevSphere/VirtualMachines/Extensions/Read | Gets extension resource |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/WACLoginAsAdmin/action | Lets you manage the OS of your resource via Windows Admin Center as an administrator. |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/WACloginAsAdmin/action | Lets you manage the OS of your resource via Windows Admin Center as an administrator |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/Clusters/WACloginAsAdmin/Action | Manage OS of HCI resource via Windows Admin Center as an administrator |
> | Microsoft.ConnectedVMwarevSphere/virtualmachines/WACloginAsAdmin/action | Lets you manage the OS of your resource via Windows Admin Center as an administrator. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Let's you manage the OS of your resource via Windows Admin Center as an administrator.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/a6333a3e-0164-44c3-b281-7a577aff287f",
  "name": "a6333a3e-0164-44c3-b281-7a577aff287f",
  "permissions": [
    {
      "actions": [
        "Microsoft.HybridCompute/machines/*/read",
        "Microsoft.HybridCompute/machines/extensions/*",
        "Microsoft.HybridCompute/machines/upgradeExtensions/action",
        "Microsoft.HybridCompute/operations/read",
        "Microsoft.Network/networkInterfaces/read",
        "Microsoft.Network/loadBalancers/read",
        "Microsoft.Network/publicIPAddresses/read",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/networkSecurityGroups/read",
        "Microsoft.Network/networkSecurityGroups/defaultSecurityRules/read",
        "Microsoft.Network/networkWatchers/securityGroupView/action",
        "Microsoft.Network/networkSecurityGroups/securityRules/read",
        "Microsoft.Network/networkSecurityGroups/securityRules/write",
        "Microsoft.HybridConnectivity/endpoints/write",
        "Microsoft.HybridConnectivity/endpoints/read",
        "Microsoft.HybridConnectivity/endpoints/serviceConfigurations/write",
        "Microsoft.HybridConnectivity/endpoints/serviceConfigurations/read",
        "Microsoft.HybridConnectivity/endpoints/listManagedProxyDetails/action",
        "Microsoft.Compute/virtualMachines/read",
        "Microsoft.Compute/virtualMachines/patchAssessmentResults/latest/read",
        "Microsoft.Compute/virtualMachines/patchAssessmentResults/latest/softwarePatches/read",
        "Microsoft.Compute/virtualMachines/patchInstallationResults/read",
        "Microsoft.Compute/virtualMachines/patchInstallationResults/softwarePatches/read",
        "Microsoft.Compute/virtualMachines/extensions/read",
        "Microsoft.Compute/virtualMachines/instanceView/read",
        "Microsoft.Compute/virtualMachines/runCommands/read",
        "Microsoft.Compute/virtualMachines/vmSizes/read",
        "Microsoft.Compute/locations/publishers/artifacttypes/types/read",
        "Microsoft.Compute/locations/publishers/artifacttypes/types/versions/read",
        "Microsoft.Compute/diskAccesses/read",
        "Microsoft.Compute/galleries/images/read",
        "Microsoft.Compute/images/read",
        "Microsoft.AzureStackHCI/Clusters/Read",
        "Microsoft.AzureStackHCI/Clusters/ArcSettings/Read",
        "Microsoft.AzureStackHCI/Clusters/ArcSettings/Extensions/Read",
        "Microsoft.AzureStackHCI/Clusters/ArcSettings/Extensions/Write",
        "Microsoft.AzureStackHCI/Clusters/ArcSettings/Extensions/Delete",
        "Microsoft.AzureStackHCI/Operations/Read",
        "Microsoft.ConnectedVMwarevSphere/VirtualMachines/Read",
        "Microsoft.ConnectedVMwarevSphere/VirtualMachines/Extensions/Write",
        "Microsoft.ConnectedVMwarevSphere/VirtualMachines/Extensions/Read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.HybridCompute/machines/WACLoginAsAdmin/action",
        "Microsoft.Compute/virtualMachines/WACloginAsAdmin/action",
        "Microsoft.AzureStackHCI/Clusters/WACloginAsAdmin/Action",
        "Microsoft.ConnectedVMwarevSphere/virtualmachines/WACloginAsAdmin/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Windows Admin Center Administrator Login",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)