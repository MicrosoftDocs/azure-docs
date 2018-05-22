---
title: Understand role definitions in Azure RBAC | Microsoft Docs
description: Learn about role definitions in role-based access control (RBAC) and how to define custom roles for fine-grained access management of resources in Azure.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.assetid: 
ms.service: role-based-access-control
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/12/2018
ms.author: rolyon
ms.reviewer: rqureshi
ms.custom: 
---
# Understand role definitions

If you are trying to understand how a role works or if you are creating your own [custom role](custom-roles.md), it's helpful to understand how roles are defined. This article describes the details of role definitions and provides some examples.

## Role definition structure

A *role definition* is a collection of permissions. It's sometimes just called a *role*. A role definition lists the operations that can be performed, such as read, write, and delete. It can also list the operations that can't be performed. A role definition has the following structure:

```
assignableScopes []
description
id
name
permissions []
  actions []
  notActions []
roleName
roleType
type
```

Operations are specified with strings that have the following format:

- `Microsoft.{ProviderName}/{ChildResourceType}/{action}`

The `{action}` portion of an operation string specifies the type of operations you can perform on a resource type. For example, you will see the following substrings in `{action}`:

| Action substring    | Description         |
| ------------------- | ------------------- |
| `*` | The wildcard character grants access to all operations that match the string. |
| `read` | Enables read operations (GET). |
| `write` | Enables write operations (PUT, POST, and PATCH). |
| `delete` | Enables delete operations (DELETE). |

Here's the [Contributor](built-in-roles.md#contributor) role definition in JSON format. The wildcard (`*`) operation under `actions` indicates that the principal assigned to this role can perform all actions, or in other words, it can manage everything. This includes actions defined in the future, as Azure adds new resource types. The operations under `notActions` are subtracted from `actions`. In the case of the [Contributor](built-in-roles.md#contributor) role, `notActions` removes this role's ability to manage access to resources and also assign access to resources.

```json
[
  {
    "additionalProperties": {},
    "assignableScopes": [
      "/"
    ],
    "description": "Lets you manage everything except access to resources.",
    "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c",
    "name": "b24988ac-6180-42a0-ab88-20f7382dd24c",
    "permissions": [
      {
        "actions": [
          "*"
        ],
        "additionalProperties": {},
        "notActions": [
          "Microsoft.Authorization/*/Delete",
          "Microsoft.Authorization/*/Write",
          "Microsoft.Authorization/elevateAccess/Action"
        ],
      }
    ],
    "roleName": "Contributor",
    "roleType": "BuiltInRole",
    "type": "Microsoft.Authorization/roleDefinitions"
  }
]
```

## Management operations

Role-based access control for management operations is specified in the `actions` and `notActions` sections of a role definition. Here are some examples of management operations in Azure:

- Manage access to a storage account
- Create, update, or delete a blob container
- Delete a resource group and all of its resources

Management access is not inherited to your data. This separation prevents roles with wildcards (`*`) from having unrestricted access to your data. For example, if a user has a [Reader](built-in-roles.md#reader) role on a subscription, then they can view the storage account, but they can't view the underlying data.

## actions

The `actions` permission specifies the management operations to which the role grants access. It is a collection of operation strings that identify securable operations of Azure resource providers. Here are some examples of management  operations that can be used in `actions`.

| Operation string    | Description         |
| ------------------- | ------------------- |
| `*/read` | Grants access to read operations for all resource types of all Azure resource providers.|
| `Microsoft.Compute/*` | Grants access to all operations for all resource types in the Microsoft.Compute resource provider.|
| `Microsoft.Network/*/read` | Grants access to read operations for all resource types in the Microsoft.Network resource provider.|
| `Microsoft.Compute/virtualMachines/*` | Grants access to all operations of virtual machines and its child resource types.|
| `microsoft.web/sites/restart/Action` | Grants access to restart a web app.|

## notActions

The `notActions` permission specifies the management operations that are excluded from the allowed `actions`. Use the `notActions` permission if the set of operations that you want to allow is more easily defined by excluding restricted operations. The access granted by a role (effective permissions) is computed by subtracting the `notActions` operations from the `actions` operations.

> [!NOTE]
> If a user is assigned a role that excludes an operation in `notActions`, and is assigned a second role that grants access to the same operation, the user is allowed to perform that operation. `notActions` is not a deny rule – it is simply a convenient way to create a set of allowed operations when specific operations need to be excluded.
>

## assignableScopes

The `assignableScopes` section specifies the scopes (management groups (currently in preview), subscriptions, resource groups, or resources) that the role is available for assignment. You can make the role available for assignment in only the subscriptions or resource groups that require it, and not the clutter user experience for the rest of the subscriptions or resource groups. You must use at least one management group, subscription, resource group, or resource ID.

Built-in roles have `assignableScopes` set to the root scope (`"/"`). The root scope indicates that the role is available for assignment in all scopes. You can't use the root scope in your own custom roles. If you try, you will get an authorization error.

Examples of valid assignable scopes include:

| Scenario | Example |
|----------|---------|
| Role is available for assignment in a single subscription | `"/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e"` |
| Role is available for assignment in two subscriptions | `"/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e", "/subscriptions/e91d47c4-76f3-4271-a796-21b4ecfe3624"` |
| Role is available for assignment only in the Network resource group | `"/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/resourceGroups/Network"` |
| Role is available for assignment in all scopes | `"/"` |

## assignableScopes and custom roles

The `assignableScopes` section for a custom role also controls who can create, delete, modify, or view the custom role.

| Task | Operation | Description |
| --- | --- | --- |
| Create/delete a custom role | `Microsoft.Authorization/ roleDefinition/write` | Users that are granted this operation on all the `assignableScopes` of the custom role can create (or delete) custom roles for use in those scopes. For example, [Owners](built-in-roles.md#owner) and [User Access Administrators](built-in-roles.md#user-access-administrator) of subscriptions, resource groups, and resources. |
| Modify a custom role | `Microsoft.Authorization/ roleDefinition/write` | Users that are granted this operation on all the `assignableScopes` of the custom role can modify custom roles in those scopes. For example, [Owners](built-in-roles.md#owner) and [User Access Administrators](built-in-roles.md#user-access-administrator) of subscriptions, resource groups, and resources. |
| View a custom role | `Microsoft.Authorization/ roleDefinition/read` | Users that are granted this operation at a scope can view the custom roles that are available for assignment at that scope. All built-in roles allow custom roles to be available for assignment. |

## Role definition examples

The following example shows the [Reader](built-in-roles.md#reader) role definition as displayed using the Azure CLI:

```json
[
  {
    "additionalProperties": {},
    "assignableScopes": [
      "/"
    ],
    "description": "Lets you view everything, but not make any changes.",
    "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7",
    "name": "acdd72a7-3385-48ef-bd42-f606fba81ae7",
    "permissions": [
      {
        "actions": [
          "*/read"
        ],
        "additionalProperties": {},
        "notActions": [],
      }
    ],
    "roleName": "Reader",
    "roleType": "BuiltInRole",
    "type": "Microsoft.Authorization/roleDefinitions"
  }
]
```

The following example shows a custom role for monitoring and restarting virtual machines as displayed using Azure PowerShell:

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
  "AssignableScopes":  [
                           "/subscriptions/{subscriptionId1}",
                           "/subscriptions/{subscriptionId2}",
                           "/subscriptions/{subscriptionId3}"
                       ]
}
```

## See also

* [Built-in roles](built-in-roles.md)
* [Custom roles](custom-roles.md)
* [Azure Resource Manager resource provider operations](resource-provider-operations.md)
