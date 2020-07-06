---
title: Azure custom roles - Azure RBAC
description: Learn how to create Azure custom roles with Azure role-based access control (Azure RBAC) for fine-grained access management of Azure resources.
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
ms.date: 05/08/2020
ms.author: rolyon
ms.reviewer: bagovind
ms.custom: H1Hack27Feb2017
---

# Azure custom roles

> [!IMPORTANT]
> Adding a management group to `AssignableScopes` is currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

If the [Azure built-in roles](built-in-roles.md) don't meet the specific needs of your organization, you can create your own custom roles. Just like built-in roles, you can assign custom roles to users, groups, and service principals at management group, subscription, and resource group scopes.

Custom roles can be shared between subscriptions that trust the same Azure AD directory. There is a limit of **5,000** custom roles per directory. (For Azure Germany and Azure China 21Vianet, the limit is 2,000 custom roles.) Custom roles can be created using the Azure portal, Azure PowerShell, Azure CLI, or the REST API.

## Custom role example

The following shows what a custom role looks like as displayed using Azure PowerShell in JSON format. This custom role can be used for monitoring and restarting virtual machines.

```json
{
  "Name": "Virtual Machine Operator",
  "Id": "88888888-8888-8888-8888-888888888888",
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
  "NotActions": [],
  "DataActions": [],
  "NotDataActions": [],
  "AssignableScopes": [
    "/subscriptions/{subscriptionId1}",
    "/subscriptions/{subscriptionId2}",
    "/providers/Microsoft.Management/managementGroups/{groupId1}"
  ]
}
```

The following shows the same custom role as displayed using Azure CLI.

```json
[
  {
    "assignableScopes": [
      "/subscriptions/{subscriptionId1}",
      "/subscriptions/{subscriptionId2}",
      "/providers/Microsoft.Management/managementGroups/{groupId1}"
    ],
    "description": "Can monitor and restart virtual machines.",
    "id": "/subscriptions/{subscriptionId1}/providers/Microsoft.Authorization/roleDefinitions/88888888-8888-8888-8888-888888888888",
    "name": "88888888-8888-8888-8888-888888888888",
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

When you create a custom role, it appears in the Azure portal with an orange resource icon.

![Custom role icon](./media/custom-roles/roles-custom-role-icon.png)

## Custom role properties

The following table describes what the custom role properties mean.

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| `Name`</br>`roleName` | Yes | String | The display name of the custom role. While a role definition is a management group or subscription-level resource, a role definition can be used in multiple subscriptions that share the same Azure AD directory. This display name must be unique at the scope of the Azure AD directory. Can include letters, numbers, spaces, and special characters. Maximum number of characters is 128. |
| `Id`</br>`name` | Yes | String | The unique ID of the custom role. For Azure PowerShell and Azure CLI, this ID is automatically generated when you create a new role. |
| `IsCustom`</br>`roleType` | Yes | String | Indicates whether this is a custom role. Set to `true` or `CustomRole` for custom roles. Set to `false` or `BuiltInRole` for built-in roles. |
| `Description`</br>`description` | Yes | String | The description of the custom role. Can include letters, numbers, spaces, and special characters. Maximum number of characters is 1024. |
| `Actions`</br>`actions` | Yes | String[] | An array of strings that specifies the management operations that the role allows to be performed. For more information, see [Actions](role-definitions.md#actions). |
| `NotActions`</br>`notActions` | No | String[] | An array of strings that specifies the management operations that are excluded from the allowed `Actions`. For more information, see [NotActions](role-definitions.md#notactions). |
| `DataActions`</br>`dataActions` | No | String[] | An array of strings that specifies the data operations that the role allows to be performed to your data within that object. If you create a custom role with `DataActions`, that role cannot be assigned at the management group scope. For more information, see [DataActions](role-definitions.md#dataactions). |
| `NotDataActions`</br>`notDataActions` | No | String[] | An array of strings that specifies the data operations that are excluded from the allowed `DataActions`. For more information, see [NotDataActions](role-definitions.md#notdataactions). |
| `AssignableScopes`</br>`assignableScopes` | Yes | String[] | An array of strings that specifies the scopes that the custom role is available for assignment. You can only define one management group in `AssignableScopes` of a custom role. Adding a management group to `AssignableScopes` is currently in preview. For more information, see [AssignableScopes](role-definitions.md#assignablescopes). |

## Steps to create a custom role

To create a custom role, here are basics steps you should follow.

1. Decide how you want to create the custom role.

    You can create custom roles using Azure portal, Azure PowerShell, Azure CLI, or the REST API.

1. Determine the permissions you need.

    When you create a custom role, you need to know the operations that are available to define your permissions. To view the list of operations, see the [Azure Resource Manager resource provider operations](resource-provider-operations.md). You will add the operations to the `Actions` or `NotActions` properties of the [role definition](role-definitions.md). If you have data operations, you will add those to the `DataActions` or `NotDataActions` properties.

1. Create the custom role.

    Typically, you start with an existing built-in role and then modify it for your needs. The easiest way is to use the Azure portal. For steps on how to create a custom role using the Azure portal, see [Create or update Azure custom roles using the Azure portal](custom-roles-portal.md).

1. Test the custom role.

    Once you have your custom role, you have to test it to verify that it works as you expect. If you need to make adjustments later, you can update the custom role.

## Who can create, delete, update, or view a custom role

Just like built-in roles, the `AssignableScopes` property specifies the scopes that the role is available for assignment. The `AssignableScopes` property for a custom role also controls who can create, delete, update, or view the custom role.

| Task | Operation | Description |
| --- | --- | --- |
| Create/delete a custom role | `Microsoft.Authorization/ roleDefinitions/write` | Users that are granted this operation on all the `AssignableScopes` of the custom role can create (or delete) custom roles for use in those scopes. For example, [Owners](built-in-roles.md#owner) and [User Access Administrators](built-in-roles.md#user-access-administrator) of management groups, subscriptions, and resource groups. |
| Update a custom role | `Microsoft.Authorization/ roleDefinitions/write` | Users that are granted this operation on all the `AssignableScopes` of the custom role can update custom roles in those scopes. For example, [Owners](built-in-roles.md#owner) and [User Access Administrators](built-in-roles.md#user-access-administrator) of management groups, subscriptions, and resource groups. |
| View a custom role | `Microsoft.Authorization/ roleDefinitions/read` | Users that are granted this operation at a scope can view the custom roles that are available for assignment at that scope. All built-in roles allow custom roles to be available for assignment. |

## Custom role limits

The following list describes the limits for custom roles.

- Each directory can have up to **5000** custom roles.
- Azure Germany and Azure China 21Vianet can have up to 2000 custom roles for each directory.
- You cannot set `AssignableScopes` to the root scope (`"/"`).
- You can only define one management group in `AssignableScopes` of a custom role. Adding a management group to `AssignableScopes` is currently in preview.
- Custom roles with `DataActions` cannot be assigned at the management group scope.
- Azure Resource Manager doesn't validate the management group's existence in the role definition's assignable scope.

For more information about custom roles and management groups, see [Organize your resources with Azure management groups](../governance/management-groups/overview.md#custom-rbac-role-definition-and-assignment).

## Input and output formats

To create a custom role using the command line, you typically use JSON to specify the properties you want for the custom role. Depending on the tools you use, the input and output formats will look slightly different. This section lists the input and output formats depending on the tool.

### Azure PowerShell

To create a custom role using Azure PowerShell, you must provide following input.

```json
{
  "Name": "",
  "Description": "",
  "Actions": [],
  "NotActions": [],
  "DataActions": [],
  "NotDataActions": [],
  "AssignableScopes": []
}
```

To update a custom role using Azure PowerShell, you must provide the following input. Note that the `Id` property has been added. 

```json
{
  "Name": "",
  "Id": "",
  "Description": "",
  "Actions": [],
  "NotActions": [],
  "DataActions": [],
  "NotDataActions": [],
  "AssignableScopes": []
}
```

The following shows an example of the output when you list a custom role using Azure PowerShell and the [ConvertTo-Json](/powershell/module/microsoft.powershell.utility/convertto-json) command. 

```json
{
  "Name": "",
  "Id": "",
  "IsCustom": true,
  "Description": "",
  "Actions": [],
  "NotActions": [],
  "DataActions": [],
  "NotDataActions": [],
  "AssignableScopes": []
}
```

### Azure CLI

To create or update a custom role using Azure CLI, you must provide following input. This format is the same format when you create a custom role using Azure PowerShell.

```json
{
  "Name": "",
  "Description": "",
  "Actions": [],
  "NotActions": [],
  "DataActions": [],
  "NotDataActions": [],
  "AssignableScopes": []
}
```

The following shows an example of the output when you list a custom role using Azure CLI.

```json
[
  {
    "assignableScopes": [],
    "description": "",
    "id": "",
    "name": "",
    "permissions": [
      {
        "actions": [],
        "dataActions": [],
        "notActions": [],
        "notDataActions": []
      }
    ],
    "roleName": "",
    "roleType": "CustomRole",
    "type": "Microsoft.Authorization/roleDefinitions"
  }
]
```

### REST API

To create or update a custom role using the REST API, you must provide following input. This format is the same format that gets generated when you create a custom role using the Azure portal.

```json
{
  "properties": {
    "roleName": "",
    "description": "",
    "assignableScopes": [],
    "permissions": [
      {
        "actions": [],
        "notActions": [],
        "dataActions": [],
        "notDataActions": []
      }
    ]
  }
}
```

The following shows an example of the output when you list a custom role using the REST API.

```json
{
    "properties": {
        "roleName": "",
        "type": "CustomRole",
        "description": "",
        "assignableScopes": [],
        "permissions": [
            {
                "actions": [],
                "notActions": [],
                "dataActions": [],
                "notDataActions": []
            }
        ],
        "createdOn": "",
        "updatedOn": "",
        "createdBy": "",
        "updatedBy": ""
    },
    "id": "",
    "type": "Microsoft.Authorization/roleDefinitions",
    "name": ""
}
```

## Next steps

- [Tutorial: Create an Azure custom role using Azure PowerShell](tutorial-custom-role-powershell.md)
- [Tutorial: Create an Azure custom role using Azure CLI](tutorial-custom-role-cli.md)
- [Understand Azure role definitions](role-definitions.md)
- [Troubleshoot Azure RBAC](troubleshooting.md)
