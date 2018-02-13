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
ms.date: 02/13/2018
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

The following example lists the role name and description of all available role definitions:

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

<!--
![RBAC Azure command line - azure role list - screenshot](./media/role-based-access-control-manage-access-azure-cli/1-azure-role-list.png)
-->

## List actions of a role

To list the actions of a role, use [az role definition list](https://docs.microsoft.com/en-us/cli/azure/role/definition?view=azure-cli-latest#az_role_definition_list):

```azurecli
az role definition list --name <role_name>
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
  "Microsoft.Storage/storageAccounts/read",
]
```

<!--
![RBAC Azure command line - azure role show - screenshot](./media/role-based-access-control-manage-access-azure-cli/1-azure-role-show.png)
-->

## List role assignments for a resource group

To list the role assignments that exist for a resource group, use [az role assignment list](https://docs.microsoft.com/en-us/cli/azure/role/assignment?view=azure-cli-latest#az_role_assignment_list):

```azurecli
az role assignment list --resource-group <resource_group>
```

The following example shows the role assignments for the *pharma-sales-projecforcast* group:

```azurecli
az role assignment list --resource-group pharma-sales-projecforcast --output json | jq '.[] | {"displayName":.properties.aADObject.displayName, "roleName":.properties.roleName, "scope":.properties.scope}'
```

<!--
![RBAC Azure command line - azure role assignment list by group - screenshot](./media/role-based-access-control-manage-access-azure-cli/4-azure-role-assignment-list-1.png)
-->

## List role assignments for a user

To list the role assignments for a specific user and the assignments that are assigned to a user's groups, use [az role assignment list](https://docs.microsoft.com/en-us/cli/azure/role/assignment?view=azure-cli-latest#az_role_assignment_list):

```azurecli
az role assignment list --assignee <assignee>
```

You can also see role assignments that are inherited from groups by modifying the command:

```azurecli
az role assignment list --include-inherited --assignee <assignee>
```

The following example shows the role assignments that are granted to the *sameert@aaddemo.com* user. This includes roles that are assigned directly to the user and roles that are inherited from groups:

```azurecli
az role assignment list --assignee sameert@aaddemo.com --output json | jq '.[] | {"displayName":.properties.aADObject.displayName, "roleName":.properties.roleName, "scope":.properties.scope}'

az role assignment list --include-inherited --assignee sameert@aaddemo.com --output json | jq '.[] | {"displayName":.properties.aADObject.displayName, "roleName":.properties.roleName, "scope":.properties.scope}'
```

<!--
![RBAC Azure command line - azure role assignment list by user - screenshot](./media/role-based-access-control-manage-access-azure-cli/4-azure-role-assignment-list-2.png)
-->

## Assign a role to a group at the subscription scope

To assign a role to a group at the subscription scope, use [az role assignment create](https://docs.microsoft.com/en-us/cli/azure/role/assignment?view=azure-cli-latest#az_role_assignment_create):

```azurecli
az role assignment create --role <role> --assignee <assignee> --assignee-object-id <assignee_object_id> --resource-group <resource_group> --scope <subscription/subscription_id>
```

The following example assigns the *Reader* role to *Christine Koch's Team* at the *subscription* scope:

<!--
![RBAC Azure command line - azure role assignment create by group - screenshot](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-assignment-create-1.png)
-->

## Assign a role to an application at the subscription scope

To assign a role to an application at the subscription scope, use [az role assignment create](https://docs.microsoft.com/en-us/cli/azure/role/assignment?view=azure-cli-latest#az_role_assignment_create):

```azurecli
az role assignment create --role <role> --assignee <assignee> --assignee-object-id <assignee_object_id> --resource-group <resource_group> --scope <subscription/subscription_id>
```

The following example grants the *Contributor* role to an *Azure AD* application on the selected subscription:

<!--
![RBAC Azure command line - azure role assignment create by application](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-assignment-create-2.png)
-->

## Assign a role to a user at the resource group scope

To assign a role to a user at the resource group scope, use [az role assignment create](https://docs.microsoft.com/en-us/cli/azure/role/assignment?view=azure-cli-latest#az_role_assignment_create):

```azurecli
az role assignment create --role <role> --assignee <assignee> --resource-group <resource_group>
```

The following example grants the *Virtual Machine Contributor* role to *samert@aaddemo.com* user at the *Pharma-Sales-ProjectForcast* resource group scope:

<!--
![RBAC Azure command line - azure role assignment create by user - screenshot](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-assignment-create-3.png)
-->

## Assign a role to a group at the resource scope

To assign a role to a group at the resource scope, use [az role assignment create](https://docs.microsoft.com/en-us/cli/azure/role/assignment?view=azure-cli-latest#az_role_assignment_create):

```azurecli
az role assignment create --role <role> --assignee <assignee> --assignee-object-id <assignee_object_id> --resource-group <resource_group>
```

The following example grants the *Virtual Machine Contributor* role to an *Azure AD* group on a *subnet*:

<!--
![RBAC Azure command line - azure role assignment create by group - screenshot](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-assignment-create-4.png)
-->

## Remove access

To remove a role assignment, use [az role assignment delete](https://docs.microsoft.com/en-us/cli/azure/role/assignment?view=azure-cli-latest#az_role_assignment_delete):

```azurecli
az role assignment delete --assignee <assignee> --role <role>
```

The following example removes the *Virtual Machine Contributor* role assignment from the *sammert@aaddemo.com* user on the *Pharma-Sales-ProjectForcast* resource group:
The example then removes the role assignment from a group on the subscription.

<!--
![RBAC Azure command line - azure role assignment delete - screenshot](./media/role-based-access-control-manage-access-azure-cli/3-azure-role-assignment-delete.png)
-->

## List custom roles

To list the roles that are available for assignment at a scope, use [az role definition list](https://docs.microsoft.com/en-us/cli/azure/role/definition?view=azure-cli-latest#az_role_definition_list).

The following command lists all roles that are available for assignment in the selected subscription:

```azurecli
az role definition list --output json | jq '.[] | {"roleName":.properties.roleName, "type":.properties.type}'
```

```json
{
  "roleName": "API Management Service Contributor",
  "type": "BuiltInRole"
}
{
  "roleName": "API Management Service Operator Role",
  "type": "BuiltInRole"
}
{
  "roleName": "API Management Service Reader Role",
  "type": "BuiltInRole"
}

...
```

<!--
![RBAC Azure command line - azure role list - screenshot](./media/role-based-access-control-manage-access-azure-cli/5-azure-role-list1.png)
-->

In the following example, the *Virtual Machine Operator* custom role isn’t available in the *Production4* subscription because that subscription isn’t in the **AssignableScopes** of the role:

```azurecli
az role definition list --output json | jq '.[] | if .properties.type == "CustomRole" then .properties.roleName else empty end'
```

<!--
![RBAC Azure command line - azure role list for custom roles - screenshot](./media/role-based-access-control-manage-access-azure-cli/5-azure-role-list2.png)
-->

## Create a custom role

To create a custom role, use [az role definition create](https://docs.microsoft.com/en-us/cli/azure/role/definition?view=azure-cli-latest#az_role_definition_create):

```azurecli
az role definition create --role-definition <role_definition>
```

The following example creates a custom role called *Virtual Machine Operator*. This custom role grants access to all read operations of *Microsoft.Compute*, *Microsoft.Storage*, and *Microsoft.Network* resource providers and grants access to start, restart, and monitor virtual machines. This custom role can be used in two subscriptions. This example uses a JSON file as an input.

<!--
![JSON - custom role definition - screenshot](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-create-1.png)

![RBAC Azure command line - azure role create - screenshot](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-create-2.png)
-->

## Modify a custom role

To modify a custom role, first use [az role definition list](https://docs.microsoft.com/en-us/cli/azure/role/definition?view=azure-cli-latest#az_role_definition_list) to retrieve the role definition. Second, make the desired changes to the role definition. Finally, use [az role definition update](https://docs.microsoft.com/en-us/cli/azure/role/definition?view=azure-cli-latest#az_role_definition_update) to save the modified role definition.

```azurecli
az role definition update --role-definition <role_definition>
```

The following example adds the *Microsoft.Insights/diagnosticSettings/* operation to the **Actions**, and an Azure subscription to the **AssignableScopes** of the Virtual Machine Operator custom role.

<!--
![JSON - modify custom role definition - screenshot](./media/role-based-access-control-manage-access-azure-cli/3-azure-role-set-1.png)

![RBAC Azure command line - azure role set - screenshot](./media/role-based-access-control-manage-access-azure-cli/3-azure-role-set2.png)
-->

## Delete a custom role

To delete a custom role, first use the [az role definition list](https://docs.microsoft.com/en-us/cli/azure/role/definition?view=azure-cli-latest#az_role_definition_list) to determine the **ID** of the role. Then, use the [az role definition delete](https://docs.microsoft.com/en-us/cli/azure/role/definition?view=azure-cli-latest#az_role_definition_delete) command to delete the role by specifying the **ID**.

The following example removes the *Virtual Machine Operator* custom role.

<!--
![RBAC Azure command line - azure role delete - screenshot](./media/role-based-access-control-manage-access-azure-cli/4-azure-role-delete.png)
-->

## Next steps

[!INCLUDE [role-based-access-control-toc.md](../../includes/role-based-access-control-toc.md)]

