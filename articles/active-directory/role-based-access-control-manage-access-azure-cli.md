---
title: Manage Role-Based Access Control (RBAC) with Azure CLI | Microsoft Docs
description: Learn how to manage Role-Based Access Control (RBAC) with the Azure command-line interface by listing roles and role actions and by assigning roles to the subscription and application scopes.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.assetid: 3483ee01-8177-49e7-b337-4d5cb14f5e32
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/03/2018
ms.author: rolyon
ms.reviewer: rqureshi
---
# Manage Role-Based Access Control with the Azure command-line interface

> [!div class="op_single_selector"]
> * [PowerShell](role-based-access-control-manage-access-powershell.md)
> * [Azure CLI](role-based-access-control-manage-access-azure-cli.md)
> * [REST API](role-based-access-control-manage-access-rest.md)


With role-based access control (RBAC), you define access for users, groups, and service principals by assigning roles at a particular scope. This article describes how to manage role assignments using the Azure command-line interface (CLI).

## Prerequisites

To use the Azure CLI to manage role assignments, you must have the following prerequisites:

* [Azure CLI 2.0](/cli/azure). You can use it in your browser with [Azure Cloud Shell](../cloud-shell/overview.md), or you can [install](/cli/azure/install-azure-cli) it on macOS, Linux, and Windows and run it from the command line.

## List role definitions

To list all available role definitions, use [az role definition list](/cli/azure/role/definition#az_role_definition_list):

```azurecli
az role definition list
```

The following example lists the name and description of all available role definitions:

```azurecli
az role definition list --output json | jq '.[] | {"roleName":.roleName, "description":.description}'
```

```Output
{
  "roleName": "API Management Service Contributor",
  "description": "Can manage service and the APIs"
}
{
  "roleName": "API Management Service Operator Role",
  "description": "Can manage service but not the APIs"
}
{
  "roleName": "API Management Service Reader Role",
  "description": "Read-only access to service and APIs"
}

...
```

The following example lists all of the built-in role definitions:

```azurecli
az role definition list --custom-role-only false --output json | jq '.[] | {"roleName":.roleName, "description":.description, "roleType":.roleType}'
```

```Output
{
  "roleName": "API Management Service Contributor",
  "description": "Can manage service and the APIs",
  "roleType": "BuiltInRole"
}
{
  "roleName": "API Management Service Operator Role",
  "description": "Can manage service but not the APIs",
  "roleType": "BuiltInRole"
}
{
  "roleName": "API Management Service Reader Role",
  "description": "Read-only access to service and APIs",
  "roleType": "BuiltInRole"
}

...
```

### List actions of a role definition

To list the actions of a role definition, use [az role definition list](/cli/azure/role/definition#az_role_definition_list):

```azurecli
az role definition list --name <role_name>
```

The following example lists the *Contributor* role definition:

```azurecli
az role definition list --name "Contributor"
```

```Output
  {
    "additionalProperties": {},
    "assignableScopes": [
      "/"
    ],
    "description": "Lets you manage everything except access to resources.",
    "id": "/subscriptions/11111111-1111-1111-1111-111111111111/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c",
    "name": "b24988ac-6180-42a0-ab88-20f7382dd24c",
    "permissions": [
      {
        "actions": [
          "*"
        ],
        "additionalProperties": {},
        "dataActions": [],
        "notActions": [
          "Microsoft.Authorization/*/Delete",
          "Microsoft.Authorization/*/Write",
          "Microsoft.Authorization/elevateAccess/Action"
        ],
        "notDataActions": []
      }
    ],
    "roleName": "Contributor",
    "roleType": "BuiltInRole",
    "type": "Microsoft.Authorization/roleDefinitions"
  }
]
```

The following example lists the *actions* and *notActions* of the *Contributor* role:

```azurecli
az role definition list --name "Contributor" --output json | jq '.[] | {"actions":.permissions[0].actions, "notActions":.permissions[0].notActions}'
```

```Output
{
  "actions": [
    "*"
  ],
  "notActions": [
    "Microsoft.Authorization/*/Delete",
    "Microsoft.Authorization/*/Write",
    "Microsoft.Authorization/elevateAccess/Action"
  ]
}
```

The following example lists the actions of the *Virtual Machine Contributor* role:

```azurecli
az role definition list --name "Virtual Machine Contributor" --output json | jq '.[] | .permissions[0].actions'
```

```Output
[
  "Microsoft.Authorization/*/read",
  "Microsoft.Compute/availabilitySets/*",
  "Microsoft.Compute/locations/*",
  "Microsoft.Compute/virtualMachines/*",
  "Microsoft.Compute/virtualMachineScaleSets/*",
  "Microsoft.Insights/alertRules/*",
  "Microsoft.Network/applicationGateways/backendAddressPools/join/action",
  "Microsoft.Network/loadBalancers/backendAddressPools/join/action",

  ...

  "Microsoft.Storage/storageAccounts/listKeys/action",
  "Microsoft.Storage/storageAccounts/read"
]
```

## List role assignments

### List role assignments for a user

To list the role assignments for a specific user, use [az role assignment list](/cli/azure/role/assignment#az_role_assignment_list):

```azurecli
az role assignment list --assignee <assignee>
```

By default, only assignments scoped to subscription will be displayed. To view assignments scoped by resource or group, use `--all`.

The following example lists the role assignments that are assigned directly to the *patlong@contoso.com* user:

```azurecli
az role assignment list --all --assignee patlong@contoso.com --output json | jq '.[] | {"principalName":.principalName, "roleDefinitionName":.roleDefinitionName, "scope":.scope}'
```

```Output
{
  "principalName": "patlong@contoso.com",
  "roleDefinitionName": "Backup Operator",
  "scope": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/pharma-sales-projectforecast"
}
{
  "principalName": "patlong@contoso.com",
  "roleDefinitionName": "Virtual Machine Contributor",
  "scope": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/pharma-sales-projectforecast"
}
```

### List role assignments for a resource group

To list the role assignments that exist for a resource group, use [az role assignment list](/cli/azure/role/assignment#az_role_assignment_list):

```azurecli
az role assignment list --resource-group <resource_group>
```

The following example lists the role assignments for the *pharma-sales-projectforecast* resource group:

```azurecli
az role assignment list --resource-group pharma-sales-projectforecast --output json | jq '.[] | {"roleDefinitionName":.roleDefinitionName, "scope":.scope}'
```

```Output
{
  "roleDefinitionName": "Backup Operator",
  "scope": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/pharma-sales-projectforecast"
}
{
  "roleDefinitionName": "Virtual Machine Contributor",
  "scope": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/pharma-sales-projectforecast"
}

...
```

## Create role assignments

### Create a role assignment for a user

To create a role assignment for a user at the resource group scope, use [az role assignment create](/cli/azure/role/assignment#az_role_assignment_create):

```azurecli
az role assignment create --role <role> --assignee <assignee> --resource-group <resource_group>
```

The following example assigns the *Virtual Machine Contributor* role to *patlong@contoso.com* user at the *pharma-sales-projectforecast* resource group scope:

```azurecli
az role assignment create --role "Virtual Machine Contributor" --assignee patlong@contoso.com --resource-group pharma-sales-projectforecast
```

### Create a role assignment for a group

To create a role assignment for a group, use [az role assignment create](/cli/azure/role/assignment#az_role_assignment_create):

```azurecli
az role assignment create --role <role> --assignee-object-id <assignee_object_id> --resource-group <resource_group> --scope </subscriptions/subscription_id>
```

The following example assigns the *Reader* role to the *Ann Mack Team* group with ID 22222222-2222-2222-2222-222222222222 at the subscription scope. To get the ID of the group, you can use [az ad group list](/cli/azure/ad/group#az_ad_group_list) or [az ad group show](/cli/azure/ad/group#az_ad_group_show).

```azurecli
az role assignment create --role Reader --assignee-object-id 22222222-2222-2222-2222-222222222222 --scope /subscriptions/11111111-1111-1111-1111-111111111111
```

The following example assigns the *Virtual Machine Contributor* role to the *Ann Mack Team* group with ID 22222222-2222-2222-2222-222222222222 at a resource scope for a virtual network named *pharma-sales-project-network*:

```azurecli
az role assignment create --role "Virtual Machine Contributor" --assignee-object-id 22222222-2222-2222-2222-222222222222 --scope /subscriptions/11111111-1111-1111-1111-111111111111/resourcegroups/pharma-sales-projectforecast/providers/Microsoft.Network/virtualNetworks/pharma-sales-project-network
```

### Create a role assignment for an application

To create a role for an application, use [az role assignment create](/cli/azure/role/assignment#az_role_assignment_create):

```azurecli
az role assignment create --role <role> --assignee-object-id <assignee_object_id> --resource-group <resource_group> --scope </subscriptions/subscription_id>
```

The following example assigns the *Virtual Machine Contributor* role to an application with object ID 44444444-4444-4444-4444-444444444444 at the *pharma-sales-projectforecast* resource group scope. To get the object ID of the application, you can use [az ad app list](/cli/azure/ad/app#az_ad_app_list) or [az ad app show](/cli/azure/ad/app#az_ad_app_show).

```azurecli
az role assignment create --role "Virtual Machine Contributor" --assignee-object-id 44444444-4444-4444-4444-444444444444 --resource-group pharma-sales-projectforecast
```

## Remove a role assignment

To remove a role assignment, use [az role assignment delete](/cli/azure/role/assignment#az_role_assignment_delete):

```azurecli
az role assignment delete --assignee <assignee> --role <role> --resource-group <resource_group>
```

The following example removes the *Virtual Machine Contributor* role assignment from the *patlong@contoso.com* user on the *pharma-sales-projectforecast* resource group:

```azurecli
az role assignment delete --assignee patlong@contoso.com --role "Virtual Machine Contributor" --resource-group pharma-sales-projectforecast
```

The following example removes the *Reader* role from the *Ann Mack Team* group with ID 22222222-2222-2222-2222-222222222222 at the subscription scope. To get the ID of the group, you can use [az ad group list](/cli/azure/ad/group#az_ad_group_list) or [az ad group show](/cli/azure/ad/group#az_ad_group_show).

```azurecli
az role assignment delete --assignee 22222222-2222-2222-2222-222222222222 --role "Reader" --scope /subscriptions/11111111-1111-1111-1111-111111111111
```

## Custom roles

### List custom roles

To list the roles that are available for assignment at a scope, use [az role definition list](/cli/azure/role/definition#az_role_definition_list).

Both of the following examples list all the custom roles in the current subscription:

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
  "roleName": "My Service Operator Role",
  "type": "CustomRole"
}
{
  "roleName": "My Service Reader Role",
  "type": "CustomRole"
}

...
```

### Create a custom role

To create a custom role, use [az role definition create](/cli/azure/role/definition#az_role_definition_create). The role definition can be a JSON description or a path to a file containing a JSON description.

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

### Update a custom role

To update a custom role, first use [az role definition list](/cli/azure/role/definition#az_role_definition_list) to retrieve the role definition. Second, make the desired changes to the role definition. Finally, use [az role definition update](/cli/azure/role/definition#az_role_definition_update) to save the updated role definition.

```azurecli
az role definition update --role-definition <role_definition>
```

The following example adds the *Microsoft.Insights/diagnosticSettings/* operation to the *Actions* of the *Virtual Machine Operator* custom role.

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
    "Microsoft.Resources/subscriptions/resourceGroups/read",
    "Microsoft.Insights/alertRules/*",
    "Microsoft.Insights/diagnosticSettings/*",
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
az role definition update --role-definition ~/roles/vmoperator.json
```

### Delete a custom role

To delete a custom role, use [az role definition delete](/cli/azure/role/definition#az_role_definition_delete). To specify the role to delete, use the role name or the role ID. To determine the role ID, use [az role definition list](/cli/azure/role/definition#az_role_definition_list).

```azurecli
az role definition delete --name <role_name or role_id>
```

The following example deletes the *Virtual Machine Operator* custom role:

```azurecli
az role definition delete --name "Virtual Machine Operator"
```

## Next steps

[!INCLUDE [role-based-access-control-toc.md](../../includes/role-based-access-control-toc.md)]

