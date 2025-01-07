---
title: Azure built-in roles for Quantum - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the Quantum category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: bradben
manager: tedhudek
ms.author: brbenefield
ms.date: 01/07/2025
ms.custom: generated
---

# Azure built-in roles for Quantum

This article lists the Azure built-in roles in the Quantum category.


## Quantum Workspace Data Contributor

Lets you create, read, and modify jobs in a Quantum Workspace. This role does not allow you to manage the workspace itself.

[Learn more](/azure/quantum/manage-workspace-access)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles, policy assignments, policy definitions and policy set definitions |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | 	Create and manage classic alert rules |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups |
> | [Microsoft.Quantum](../permissions/quantum.md#microsoftquantum)/Workspaces/read | Read Workspace |
> | [Microsoft.Quantum](../permissions/quantum.md#microsoftquantum)/locations/offerings/read | Read providers supported |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Quantum](../permissions/quantum.md#microsoftquantum)/Workspaces/jobs/read | Read jobs and other data |
> | [Microsoft.Quantum](../permissions/quantum.md#microsoftquantum)/Workspaces/jobs/write | Write jobs and other data |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
      "/"
  ],
  "permissions": [
      {
          "actions": [
              "Microsoft.Authorization/*/read",
              "Microsoft.Insights/alertRules/*",
              "Microsoft.Resources/deployments/*",
              "Microsoft.Resources/subscriptions/resourceGroups/read",
              "Microsoft.Quantum/Workspaces/read",
              "Microsoft.Quantum/locations/offerings/read"
          ],
          "notActions": [],
          "dataActions": [
              "Microsoft.Quantum/Workspaces/jobs/read",
              "Microsoft.Quantum/Workspaces/jobs/write"
          ],
          "notDataActions": []
      }
  ],
  "roleName": "Quantum Workspace Data Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)