---
title: Create or update Azure custom roles using Azure CLI - Azure RBAC
description: Learn how to list, create, update, or delete Azure custom roles using Azure CLI and Azure role-based access control (Azure RBAC).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.assetid: 3483ee01-8177-49e7-b337-4d5cb14f5e32
ms.service: role-based-access-control
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/18/2020
ms.author: rolyon
ms.reviewer: bagovind
---
# Create or update Azure custom roles using Azure CLI

> [!IMPORTANT]
> Adding a management group to `AssignableScopes` is currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

If the [Azure built-in roles](built-in-roles.md) don't meet the specific needs of your organization, you can create your own custom roles. This article describes how to list, create, update, or delete custom roles using Azure CLI.

For a step-by-step tutorial on how to create a custom role, see [Tutorial: Create an Azure custom role using Azure CLI](tutorial-custom-role-cli.md).

## Prerequisites

To create custom roles, you need:

- Permissions to create custom roles, such as [Owner](built-in-roles.md#owner) or [User Access Administrator](built-in-roles.md#user-access-administrator)
- [Azure Cloud Shell](../cloud-shell/overview.md) or [Azure CLI](/cli/azure/install-azure-cli)

## List custom roles

To list custom roles that are available for assignment, use [az role definition list](/cli/azure/role/definition#az-role-definition-list). The following examples list all the custom roles in the current subscription.

```azurecli
az role definition list --custom-role-only true --output json | jq '.[] | {"roleName":.roleName, "roleType":.roleType}'
```

```azurecli
az role definition list --output json | jq '.[] | if .roleType == "CustomRole" then {"roleName":.roleName, "roleType":.roleType} else empty end'
```

```Output
{
  "roleName": "My Management Contributor",
  "type": "CustomRole"
}
{
  "roleName": "My Service Reader Role",
  "type": "CustomRole"
}
{
  "roleName": "Virtual Machine Operator",
  "type": "CustomRole"
}

...
```

## List a custom role definition

To list a custom role definition, use [az role definition list](/cli/azure/role/definition#az-role-definition-list). This is the same command you would use for a built-in role.

```azurecli
az role definition list --name <role_name>
```

The following example lists the *Virtual Machine Operator* role definition:

```azurecli
az role definition list --name "Virtual Machine Operator"
```

```Output
[
  {
    "assignableScopes": [
      "/subscriptions/11111111-1111-1111-1111-111111111111"
    ],
    "description": "Can monitor and restart virtual machines.",
    "id": "/subscriptions/11111111-1111-1111-1111-111111111111/providers/Microsoft.Authorization/roleDefinitions/00000000-0000-0000-0000-000000000000",
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
az role definition list --name "Virtual Machine Operator" --output json | jq '.[] | .permissions[0].actions'
```

```Output
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
```

## Create a custom role

To create a custom role, use [az role definition create](/cli/azure/role/definition#az-role-definition-create). The role definition can be a JSON description or a path to a file containing a JSON description.

```azurecli
az role definition create --role-definition <role_definition>
```

The following example creates a custom role named *Virtual Machine Operator*. This custom role assigns access to all read operations of *Microsoft.Compute*, *Microsoft.Storage*, and *Microsoft.Network* resource providers and assigns access to start, restart, and monitor virtual machines. This custom role can be used in two subscriptions. This example uses a JSON file as an input.

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
    "/subscriptions/11111111-1111-1111-1111-111111111111",
    "/subscriptions/33333333-3333-3333-3333-333333333333"
  ]
}
```

```azurecli
az role definition create --role-definition ~/roles/vmoperator.json
```

## Update a custom role

To update a custom role, first use [az role definition list](/cli/azure/role/definition#az-role-definition-list) to retrieve the role definition. Second, make the desired changes to the role definition. Finally, use [az role definition update](/cli/azure/role/definition#az-role-definition-update) to save the updated role definition.

```azurecli
az role definition update --role-definition <role_definition>
```

The following example adds the *Microsoft.Insights/diagnosticSettings/* operation to `Actions` and adds a management group to `AssignableScopes` for the *Virtual Machine Operator* custom role. Adding a management group to `AssignableScopes` is currently in preview.

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
    "/subscriptions/11111111-1111-1111-1111-111111111111",
    "/subscriptions/33333333-3333-3333-3333-333333333333",
    "/providers/Microsoft.Management/managementGroups/marketing-group"
  ]
}
```

```azurecli
az role definition update --role-definition ~/roles/vmoperator.json
```

## Delete a custom role

To delete a custom role, use [az role definition delete](/cli/azure/role/definition#az-role-definition-delete). To specify the role to delete, use the role name or the role ID. To determine the role ID, use [az role definition list](/cli/azure/role/definition#az-role-definition-list).

```azurecli
az role definition delete --name <role_name or role_id>
```

The following example deletes the *Virtual Machine Operator* custom role.

```azurecli
az role definition delete --name "Virtual Machine Operator"
```

## Next steps

- [Tutorial: Create an Azure custom role using Azure CLI](tutorial-custom-role-cli.md)
- [Azure custom roles](custom-roles.md)
- [Azure Resource Manager resource provider operations](resource-provider-operations.md)