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
ms.date: 02/19/2018
ms.author: rolyon
ms.reviewer: rqureshi
---
# Manage Role-Based Access Control with the Azure command-line interface

> [!div class="op_single_selector"]
> * [PowerShell](role-based-access-control-manage-access-powershell.md)
> * [Azure CLI](role-based-access-control-manage-access-azure-cli.md)
> * [REST API](role-based-access-control-manage-access-rest.md)


You can use Role-Based Access Control (RBAC) in the Azure portal and Azure Resource Manager API to manage access to your subscription and resources at a fine-grained level. With this feature, you can grant access for Active Directory users, groups, or service principals by assigning some roles to them at a particular scope. 

## Prerequisites

To use the Azure command-line interface (CLI) to manage RBAC, you must have the following prerequisites:

* [Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/role?view=azure-cli-latest). You can use it in your browser with [Azure Cloud Shell](../cloud-shell/overview.md), or you can [install](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) it on macOS, Linux, and Windows and run it from the command line.

## List role definitions

To list all available role definitions, use [az role definition list](https://docs.microsoft.com/en-us/cli/azure/role/definition?view=azure-cli-latest#az_role_definition_list):

```azurecli
az role definition list
```

The following example lists the name and description of all available role definitions:

```azurecli
az role definition list --output json | jq '.[] | {"roleName":.properties.roleName, "description":.properties.description}'
```

Example output:
```json
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
az role definition list --custom-role-only false --output json | jq '.[] | {"roleName":.properties.roleName, "description":.properties.description, "type":.properties.type}'
```

Example output:
```json
{
  "roleName": "API Management Service Contributor",
  "description": "Can manage service and the APIs",
  "type": "BuiltInRole"
}
{
  "roleName": "API Management Service Operator Role",
  "description": "Can manage service but not the APIs",
  "type": "BuiltInRole"
}
{
  "roleName": "API Management Service Reader Role",
  "description": "Read-only access to service and APIs",
  "type": "BuiltInRole"
}

...
```

<!--
![RBAC Azure command line - azure role list - screenshot](./media/role-based-access-control-manage-access-azure-cli/1-azure-role-list.png)
-->

## List actions of a role

To list the actions of a role, use [az role definition list](https://docs.microsoft.com/en-us/cli/azure/role/definition?view=azure-cli-latest#az_role_definition_list):

```azurecli
az role definition list --name <role_name>
```

The following example list the *Contributor* role defintion:

```azurecli
az role definition list --name "Contributor"
```

Example output:
```json
[
  {
    "id": "/subscriptions/11111111-1111-1111-1111-111111111111/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c",
    "name": "b24988ac-6180-42a0-ab88-20f7382dd24c",
    "properties": {
      "additionalProperties": {
        "createdBy": null,
        "createdOn": "0001-01-01T08:00:00.0000000Z",
        "updatedBy": null,
        "updatedOn": "2016-12-14T02:04:45.1393855Z"
      },
      "assignableScopes": [
        "/"
      ],
      "description": "Lets you manage everything except access to resources.",
      "permissions": [
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
      ],
      "roleName": "Contributor",
      "type": "BuiltInRole"
    },
    "type": "Microsoft.Authorization/roleDefinitions"
  }
]
```

The following example lists the actions and notActions of the *Contributor* role:

```azurecli
az role definition list --name "Contributor" --output json | jq '.[] | {"actions":.properties.permissions[0].actions, "notActions":.properties.permissions[0].notActions}'
```

Example output:
```json
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
az role definition list --name "Virtual Machine Contributor" --output json | jq '.[] | .properties.permissions[0].actions'
```

Example output:
```json
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

<!--
![RBAC Azure command line - azure role show - screenshot](./media/role-based-access-control-manage-access-azure-cli/1-azure-role-show.png)
-->

## List role assignments for a user

To list the role assignments for a specific user, use [az role assignment list](https://docs.microsoft.com/en-us/cli/azure/role/assignment?view=azure-cli-latest#az_role_assignment_list):

```azurecli
az role assignment list --assignee <assignee>
```

By default, only assignments scoped to subscription will be displayed. To view assignments scoped by resource or group, use --all.

The following example lists the role assignments that are assigned directly to the *patlong@contoso.com* user:

```azurecli
az role assignment list --all --assignee patlong@contoso.com --output json | jq '.[] | {"principalName":.properties.principalName, "roleDefinitionName":.properties.roleDefinitionName, "scope":.properties.scope}'
```

Example output:
```json
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
<!--
![RBAC Azure command line - azure role assignment list by user - screenshot](./media/role-based-access-control-manage-access-azure-cli/4-azure-role-assignment-list-2.png)
-->

## List role assignments for a resource group

To list the role assignments that exist for a resource group, use [az role assignment list](https://docs.microsoft.com/en-us/cli/azure/role/assignment?view=azure-cli-latest#az_role_assignment_list):

```azurecli
az role assignment list --resource-group <resource_group>
```

The following example lists the role assignments for the *pharma-sales-projectforecast* resource group:

```azurecli
az role assignment list --resource-group pharma-sales-projectforecast --output json | jq '.[] | {"roleDefinitionName":.properties.roleDefinitionName, "scope":.properties.scope}'
```

Example output:
```json
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

<!--
![RBAC Azure command line - azure role assignment list by group - screenshot](./media/role-based-access-control-manage-access-azure-cli/4-azure-role-assignment-list-1.png)
-->

## Assign a role to a user

To assign a role to a user at the resource group scope, use [az role assignment create](https://docs.microsoft.com/en-us/cli/azure/role/assignment?view=azure-cli-latest#az_role_assignment_create):

```azurecli
az role assignment create --role <role> --assignee <assignee> --resource-group <resource_group>
```

The following example grants the *Virtual Machine Contributor* role to *patlong@contoso.com* user at the *pharma-sales-projectforecast* resource group scope:

```azurecli
az role assignment create --role "Virtual Machine Contributor" --assignee patlong@contoso.com --resource-group pharma-sales-projectforecast
```

<!--
![RBAC Azure command line - azure role assignment create by user - screenshot](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-assignment-create-3.png)
-->

## Assign a role to a group

To assign a role to a group, use [az role assignment create](https://docs.microsoft.com/en-us/cli/azure/role/assignment?view=azure-cli-latest#az_role_assignment_create):

```azurecli
az role assignment create --role <role> --assignee-object-id <assignee_object_id> --resource-group <resource_group> --scope </subscriptions/subscription_id>
```

The following example assigns the *Reader* role to the *Ann Mack Team* group with id 22222222-2222-2222-2222-222222222222 at the *subscription* scope. To get the id of the group and subscription, you can use [az ad group list](https://docs.microsoft.com/en-us/cli/azure/ad/group?view=azure-cli-latest#az_ad_group_list) and [az account show](https://docs.microsoft.com/en-us/cli/azure/account?view=azure-cli-latest#az_account_show).

```azurecli
az role assignment create --role Reader --assignee-object-id 22222222-2222-2222-2222-222222222222 --scope /subscriptions/11111111-1111-1111-1111-111111111111
```

The following example assigns the *Virtual Machine Contributor* role to the *Ann Mack Team* group with id 22222222-2222-2222-2222-222222222222 at a resource scope for a virtual network named *pharma-sales-project-network*:

```azurecli
az role assignment create --role "Virtual Machine Contributor" --assignee-object-id 22222222-2222-2222-2222-222222222222 --scope /subscriptions/11111111-1111-1111-1111-111111111111/resourcegroups/pharma-sales-projectforecast/providers/Microsoft.Network/virtualNetworks/pharma-sales-project-network
```

<!--
![RBAC Azure command line - azure role assignment create by group - screenshot](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-assignment-create-1.png)
-->

## Assign a role to an application

To assign a role to an application at the subscription scope, use [az role assignment create](https://docs.microsoft.com/en-us/cli/azure/role/assignment?view=azure-cli-latest#az_role_assignment_create):

```azurecli
az role assignment create --role <role> --assignee <assignee> --assignee-object-id <assignee_object_id> --resource-group <resource_group> --scope </subscriptions/subscription_id>
```

<!--
![RBAC Azure command line - azure role assignment create by application](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-assignment-create-2.png)
-->


<!--
![RBAC Azure command line - azure role assignment create by group - screenshot](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-assignment-create-4.png)
-->

## Delete a role assignment

To delete a role assignment, use [az role assignment delete](https://docs.microsoft.com/en-us/cli/azure/role/assignment?view=azure-cli-latest#az_role_assignment_delete):

```azurecli
az role assignment delete --assignee <assignee> --role <role> --resource-group <resource_group>
```

The following example deletes the *Virtual Machine Contributor* role assignment from the *patlong@contoso.com* user on the *pharma-sales-projectforecast* resource group:

```azurecli
az role assignment delete --assignee patlong@contoso.com --role "Virtual Machine Contributor" --resource-group pharma-sales-projectforecast
```

The following example deletes the *Reader* role from the *Ann Mack Team* group with id 22222222-2222-2222-2222-222222222222 at the *subscription* scope. To get the id of the group and subscription, you can use [az ad group list](https://docs.microsoft.com/en-us/cli/azure/ad/group?view=azure-cli-latest#az_ad_group_list) and [az account show](https://docs.microsoft.com/en-us/cli/azure/account?view=azure-cli-latest#az_account_show).

```azurecli
az role assignment delete --assignee 22222222-2222-2222-2222-222222222222 --role "Reader" --scope /subscriptions/11111111-1111-1111-1111-111111111111
```

<!--
![RBAC Azure command line - azure role assignment delete - screenshot](./media/role-based-access-control-manage-access-azure-cli/3-azure-role-assignment-delete.png)
-->

## List custom roles

To list the roles that are available for assignment at a scope, use [az role definition list](https://docs.microsoft.com/en-us/cli/azure/role/definition?view=azure-cli-latest#az_role_definition_list).

Either one fo the following examples list all the custom roles in the selected subscription:

```azurecli
az role definition list --custom-role-only true --output json | jq '.[] | {"roleName":.properties.roleName, "type":.properties.type}'
```

```azurecli
az role definition list --output json | jq '.[] | if .properties.type == "CustomRole" then {"roleName":.properties.roleName, "type":.properties.type} else empty end'
```

Example output:

```json
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

<!--
![RBAC Azure command line - azure role list - screenshot](./media/role-based-access-control-manage-access-azure-cli/5-azure-role-list1.png)
-->

<!--
In the following example, the *Virtual Machine Operator* custom role isn’t available in the *Production4* subscription because that subscription isn’t in the **AssignableScopes** of the role:

```azurecli
az role definition list --output json | jq '.[] | if .properties.type == "CustomRole" then .properties.roleName else empty end'
```
-->

<!--
![RBAC Azure command line - azure role list for custom roles - screenshot](./media/role-based-access-control-manage-access-azure-cli/5-azure-role-list2.png)
-->

## Create a custom role

To create a custom role, use [az role definition create](https://docs.microsoft.com/en-us/cli/azure/role/definition?view=azure-cli-latest#az_role_definition_create):

```azurecli
az role definition create --role-definition <role_definition>
```

The following example creates a custom role called *Virtual Machine Operator*. This custom role grants access to all read operations of *Microsoft.Compute*, *Microsoft.Storage*, and *Microsoft.Network* resource providers and grants access to start, restart, and monitor virtual machines. This custom role can be used in two subscriptions. This example uses a JSON file as an input.

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

<!--
![JSON - custom role definition - screenshot](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-create-1.png)

![RBAC Azure command line - azure role create - screenshot](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-create-2.png)
-->

## Modify a custom role

To modify a custom role, first use [az role definition list](https://docs.microsoft.com/en-us/cli/azure/role/definition?view=azure-cli-latest#az_role_definition_list) to retrieve the role definition. Second, make the desired changes to the role definition. Finally, use [az role definition update](https://docs.microsoft.com/en-us/cli/azure/role/definition?view=azure-cli-latest#az_role_definition_update) to save the modified role definition.

```azurecli
az role definition update --role-definition <role_definition>
```

The following example adds the *Microsoft.Insights/diagnosticSettings/* operation to the **Actions** of the Virtual Machine Operator custom role.

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

<!--
![JSON - modify custom role definition - screenshot](./media/role-based-access-control-manage-access-azure-cli/3-azure-role-set-1.png)

![RBAC Azure command line - azure role set - screenshot](./media/role-based-access-control-manage-access-azure-cli/3-azure-role-set2.png)
-->

## Delete a custom role

To delete a custom role, use [az role definition delete](https://docs.microsoft.com/en-us/cli/azure/role/definition?view=azure-cli-latest#az_role_definition_delete). You can role name of or the role id. To determine the role id, use [az role definition list](https://docs.microsoft.com/en-us/cli/azure/role/definition?view=azure-cli-latest#az_role_definition_list).

```azurecli
az role definition delete --name <role_name or role_id>
```

The following example deletes the *Virtual Machine Operator* custom role:

```azurecli
az role definition delete --name "Virtual Machine Operator"
```

<!--
![RBAC Azure command line - azure role delete - screenshot](./media/role-based-access-control-manage-access-azure-cli/4-azure-role-delete.png)
-->

## Next steps

[!INCLUDE [role-based-access-control-toc.md](../../includes/role-based-access-control-toc.md)]

