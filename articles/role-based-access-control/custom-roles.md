---
title: Custom roles in Azure | Microsoft Docs
description: Learn how to define custom roles with Azure role-based access control (RBAC) for fine-grained access management of resources in Azure.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.assetid: e4206ea9-52c3-47ee-af29-f6eef7566fa5
ms.service: role-based-access-control
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 07/17/2018
ms.author: rolyon
ms.reviewer: bagovind
ms.custom: H1Hack27Feb2017
---

# Custom roles in Azure

If the [built-in roles](built-in-roles.md) don't meet the specific needs of your organization, you can create your own custom roles. Just like built-in roles, you can assign custom roles to users, groups, and service principals at subscription, resource group, and resource scopes. Custom roles are stored in an Azure Active Directory (Azure AD) tenant and can be shared across subscriptions. Each tenant can have up to 2000 custom roles. Custom roles can be created using Azure PowerShell, Azure CLI, or the REST API.

## Custom role example

The following shows a custom role for monitoring and restarting virtual machines as displayed using Azure PowerShell:

```json
{
  "Name":  "Virtual Machine Operator",
  "Id":  "88888888-8888-8888-8888-888888888888",
  "IsCustom":  true,
  "Description":  "Can monitor and restart virtual machines.",
  "Actions":  [
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
  "NotActions":  [

                 ],
  "DataActions":  [

                  ],
  "NotDataActions":  [

                     ],
  "AssignableScopes":  [
                           "/subscriptions/{subscriptionId1}",
                           "/subscriptions/{subscriptionId2}",
                           "/subscriptions/{subscriptionId3}"
                       ]
}
```

After you create a custom role, it appears in the Azure portal with an orange resource icon.

![Custom role icon](./media/custom-roles/roles-custom-role-icon.png)

## Steps to create a custom role

1. Determine the permissions you need

    When you create a custom role, you need to know the resource provider operations that are available to define your permissions. To view the list of operations, you can use the [Get-AzureRMProviderOperation](/powershell/module/azurerm.resources/get-azurermprovideroperation) or [az provider operation list](/cli/azure/provider/operation#az-provider-operation-list) commands.
    To specify the permissions for your custom role, you add the operations to the `Actions` or `NotActions` properties of the [role definition](role-definitions.md). If you have data operations, you add those to the `DataActions` or `NotDataActions` properties.

2. Create the custom role

    You can use Azure PowerShell or Azure CLI to create the custom role. Typically, you start with an existing built-in role and then modify it for your needs. Then you use the [New-AzureRmRoleDefinition](/powershell/module/azurerm.resources/new-azurermroledefinition) or [az role definition create](/cli/azure/role/definition#az-role-definition-create) commands to create the custom role. To create a custom role, you must have the `Microsoft.Authorization/roleDefinitions/write` permission on all `AssignableScopes`, such as [Owner](built-in-roles.md#owner) or [User Access Administrator](built-in-roles.md#user-access-administrator).

3. Test the custom role

    Once you have your custom role, you have to test it to verify that it works as you expect. If adjustments need to be made, you can update the custom role.

## Custom role properties

A custom role has the following properties.

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `Name` | Yes | String | The display name of the custom role. Must be unique to your tenant. Can include letters, numbers, spaces, and special characters. Maximum number of characters is 128. |
| `Id` | Yes | String | The unique ID of the custom role. For Azure PowerShell and Azure CLI, this ID is automatically generated when you create a new role. |
| `IsCustom` | Yes | String | Indicates whether this is a custom role. Set to `true` for custom roles. |
| `Description` | Yes | String | The description of the custom role. Can include letters, numbers, spaces, and special characters. Maximum number of characters is 1024. |
| `Actions` | Yes | String[] | An array of strings that specifies the management operations that the role allows to be performed. For more information, see [Actions](role-definitions.md#actions). |
| `NotActions` | No | String[] | An array of strings that specifies the management operations that are excluded from the allowed `Actions`. For more information, see [NotActions](role-definitions.md#notactions). |
| `DataActions` | No | String[] | An array of strings that specifies the data operations that the role allows to be performed to your data within that object. For more information, see [DataActions (Preview)](role-definitions.md#dataactions-preview). |
| `NotDataActions` | No | String[] | An array of strings that specifies the data operations that are excluded from the allowed `DataActions`. For more information, see [NotDataActions (Preview)](role-definitions.md#notdataactions-preview). |
| `AssignableScopes` | Yes | String[] | An array of strings that specifies the scopes that the custom role is available for assignment. Cannot be set to root scope (`"/"`). For more information, see [AssignableScopes](role-definitions.md#assignablescopes). |

## AssignableScopes for custom roles

Just like built-in roles, the `AssignableScopes` property specifies the scopes that the role is available for assignment. However, you can't use the root scope (`"/"`) in your own custom roles. If you try, you will get an authorization error. The `AssignableScopes` property for a custom role also controls who can create, delete, modify, or view the custom role.

| Task | Operation | Description |
| --- | --- | --- |
| Create/delete a custom role | `Microsoft.Authorization/ roleDefinition/write` | Users that are granted this operation on all the `AssignableScopes` of the custom role can create (or delete) custom roles for use in those scopes. For example, [Owners](built-in-roles.md#owner) and [User Access Administrators](built-in-roles.md#user-access-administrator) of subscriptions, resource groups, and resources. |
| Modify a custom role | `Microsoft.Authorization/ roleDefinition/write` | Users that are granted this operation on all the `AssignableScopes` of the custom role can modify custom roles in those scopes. For example, [Owners](built-in-roles.md#owner) and [User Access Administrators](built-in-roles.md#user-access-administrator) of subscriptions, resource groups, and resources. |
| View a custom role | `Microsoft.Authorization/ roleDefinition/read` | Users that are granted this operation at a scope can view the custom roles that are available for assignment at that scope. All built-in roles allow custom roles to be available for assignment. |

## Next steps
- [Create custom roles using Azure PowerShell](custom-roles-powershell.md)
- [Create custom roles using Azure CLI](custom-roles-cli.md)
- [Understand role definitions](role-definitions.md)
