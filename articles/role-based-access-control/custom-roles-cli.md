---
title: Create or update Azure custom roles using Azure CLI - Azure RBAC
description: Learn how to list, create, update, or delete Azure custom roles using Azure CLI and Azure role-based access control (Azure RBAC).
author: jenniferf-skc
manager: pmwongera

ms.assetid: 3483ee01-8177-49e7-b337-4d5cb14f5e32
ms.service: role-based-access-control
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 12/01/2023
ms.author: jfields
ms.reviewer: bagovind
---
# Create or update Azure custom roles using Azure CLI

If the [Azure built-in roles](built-in-roles.md) don't meet the specific needs of your organization, you can create your own custom roles. This article describes how to list, create, update, or delete custom roles using Azure CLI.

For a step-by-step tutorial on how to create a custom role, see [Tutorial: Create an Azure custom role using Azure CLI](tutorial-custom-role-cli.md).

## Prerequisites

To create custom roles, you need:

- Permissions to create custom roles, such as [User Access Administrator](built-in-roles.md#user-access-administrator)
- [Azure Cloud Shell](../cloud-shell/overview.md) or [Azure CLI](/cli/azure/install-azure-cli)

## List custom roles

To list custom roles that are available for assignment, use [az role definition list](/cli/azure/role/definition#az-role-definition-list). The following example lists all the custom roles in the current subscription.

```azurecli
az role definition list --custom-role-only true --output json --query '[].{roleName:roleName, roleType:roleType}'
```

```json
[
  {
    "roleName": "My Management Contributor",
    "type": "CustomRole"
  },
  {
    "roleName": "My Service Reader Role",
    "type": "CustomRole"
  },
  {
    "roleName": "Virtual Machine Operator",
    "type": "CustomRole"
  }
]
```

## List a custom role definition

To list a custom role definition, use [az role definition list](/cli/azure/role/definition#az-role-definition-list). This command is the same command you would use for a built-in role.

```azurecli
az role definition list --name {roleName}
```

The following example lists the *Virtual Machine Operator* role definition:

```azurecli
az role definition list --name "Virtual Machine Operator"
```

```json
[
  {
    "assignableScopes": [
      "/subscriptions/{subscriptionId}"
    ],
    "description": "Can monitor and restart virtual machines.",
    "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/00000000-0000-0000-0000-000000000000",
    "name": "00000000-0000-0000-0000-000000000000",
    "permissions": [
      {
        "actions": [
          "Microsoft.Storage/*/read",
          "Microsoft.Network/*/read",
          "Microsoft.Compute/*/read",
          "Microsoft.Compute/virtualMachines/start/action",
          "Microsoft.Compute/virtualMachines/restart/action",
          "Microsoft.Authorization/*/read",
          "Microsoft.ResourceHealth/availabilityStatuses/read",
          "Microsoft.Resources/subscriptions/resourceGroups/read",
          "Microsoft.Insights/alertRules/*",
          "Microsoft.Insights/diagnosticSettings/*",
          "Microsoft.Support/*"
        ],
        "dataActions": [],
        "notActions": [],
        "notDataActions": []
      }
    ],
    "roleName": "Virtual Machine Operator",
    "roleType": "CustomRole",
    "type": "Microsoft.Authorization/roleDefinitions"
  }
]
```

The following example lists just the actions of the *Virtual Machine Operator* role:

```azurecli
az role definition list --name "Virtual Machine Operator" --output json --query '[].permissions[0].actions'
```

```json
[
  [
    "Microsoft.Storage/*/read",
    "Microsoft.Network/*/read",
    "Microsoft.Compute/*/read",
    "Microsoft.Compute/virtualMachines/start/action",
    "Microsoft.Compute/virtualMachines/restart/action",
    "Microsoft.Authorization/*/read",
    "Microsoft.ResourceHealth/availabilityStatuses/read",
    "Microsoft.Resources/subscriptions/resourceGroups/read",
    "Microsoft.Insights/alertRules/*",
    "Microsoft.Insights/diagnosticSettings/*",
    "Microsoft.Support/*"
  ]
]
```

## Create a custom role

To create a custom role, use [az role definition create](/cli/azure/role/definition#az-role-definition-create). The role definition can be a JSON description or a path to a file containing a JSON description.

```azurecli
az role definition create --role-definition {roleDefinition}
```

The following example creates a custom role named *Virtual Machine Operator*. This custom role assigns access to all read actions of *Microsoft.Compute*, *Microsoft.Storage*, and *Microsoft.Network* resource providers and assigns access to start, restart, and monitor virtual machines. This custom role can be used in two subscriptions. This example uses a JSON file as an input.

vmoperator.json

```json
{
  "Name": "Virtual Machine Operator",
  "IsCustom": true,
  "Description": "Can monitor and restart virtual machines.",
  "Actions": [
    "Microsoft.Storage/*/read",
    "Microsoft.Network/*/read",
    "Microsoft.Compute/*/read",
    "Microsoft.Compute/virtualMachines/start/action",
    "Microsoft.Compute/virtualMachines/restart/action",
    "Microsoft.Authorization/*/read",
    "Microsoft.ResourceHealth/availabilityStatuses/read",
    "Microsoft.Resources/subscriptions/resourceGroups/read",
    "Microsoft.Insights/alertRules/*",
    "Microsoft.Support/*"
  ],
  "NotActions": [

  ],
  "AssignableScopes": [
    "/subscriptions/{subscriptionId1}",
    "/subscriptions/{subscriptionId2}"
  ]
}
```

```azurecli
az role definition create --role-definition ~/roles/vmoperator.json
```

## Update a custom role

To update a custom role, first use [az role definition list](/cli/azure/role/definition#az-role-definition-list) to retrieve the role definition. Second, make the desired changes to the role definition. Finally, use [az role definition update](/cli/azure/role/definition#az-role-definition-update) to save the updated role definition.

```azurecli
az role definition update --role-definition {roleDefinition}
```

The following example adds the *Microsoft.Insights/diagnosticSettings/* action to `Actions` and adds a management group to `AssignableScopes` for the *Virtual Machine Operator* custom role.

vmoperator.json

```json
{
  "Name": "Virtual Machine Operator",
  "IsCustom": true,
  "Description": "Can monitor and restart virtual machines.",
  "Actions": [
    "Microsoft.Storage/*/read",
    "Microsoft.Network/*/read",
    "Microsoft.Compute/*/read",
    "Microsoft.Compute/virtualMachines/start/action",
    "Microsoft.Compute/virtualMachines/restart/action",
    "Microsoft.Authorization/*/read",
    "Microsoft.ResourceHealth/availabilityStatuses/read",
    "Microsoft.Resources/subscriptions/resourceGroups/read",
    "Microsoft.Insights/alertRules/*",
    "Microsoft.Insights/diagnosticSettings/*",
    "Microsoft.Support/*"
  ],
  "NotActions": [

  ],
  "AssignableScopes": [
    "/subscriptions/{subscriptionId1}",
    "/subscriptions/{subscriptionId2}",
    "/providers/Microsoft.Management/managementGroups/marketing-group"
  ]
}
```

```azurecli
az role definition update --role-definition ~/roles/vmoperator.json
```

## Delete a custom role

1. Remove any role assignments that use the custom role. For more information, see [Find role assignments to delete a custom role](custom-roles.md#find-role-assignments-to-delete-a-custom-role).

1. Use [az role definition delete](/cli/azure/role/definition#az-role-definition-delete) to delete the custom role. To specify the role to delete, use the role name or the role ID. To determine the role ID, use [az role definition list](/cli/azure/role/definition#az-role-definition-list).

    ```azurecli
    az role definition delete --name {roleNameOrId}
    ```
    
    The following example deletes the *Virtual Machine Operator* custom role.
    
    ```azurecli
    az role definition delete --name "Virtual Machine Operator"
    ```
    
## Next steps

- [Tutorial: Create an Azure custom role using Azure CLI](tutorial-custom-role-cli.md)
- [Azure custom roles](custom-roles.md)
- [Azure resource provider operations](resource-provider-operations.md)
