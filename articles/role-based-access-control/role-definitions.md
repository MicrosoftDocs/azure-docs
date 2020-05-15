---
title: Understand Azure role definitions - Azure RBAC
description: Learn about Azure role definitions in Azure role-based access control (Azure RBAC) for fine-grained access management of Azure resources.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.assetid:
ms.service: role-based-access-control
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/08/2020
ms.author: rolyon
ms.reviewer: bagovind
ms.custom:
---
# Understand Azure role definitions

If you are trying to understand how an Azure role works or if you are creating your own [Azure custom role](custom-roles.md), it's helpful to understand how roles are defined. This article describes the details of role definitions and provides some examples.

## Role definition

A *role definition* is a collection of permissions. It's sometimes just called a *role*. A role definition lists the operations that can be performed, such as read, write, and delete. It can also list the operations that are excluded from allowed operations or operations related to underlying data.

The following shows an example of the properties in a role definition when displayed using Azure PowerShell:

```
Name
Id
IsCustom
Description
Actions []
NotActions []
DataActions []
NotDataActions []
AssignableScopes []
```

The following shows an example of the properties in a role definition when displayed using the Azure portal, Azure CLI, or the REST API:

```
roleName
name
type
description
actions []
notActions []
dataActions []
notDataActions []
assignableScopes []
```

The following table describes what the role properties mean.

| Property | Description |
| --- | --- |
| `Name`</br>`roleName` | The display name of the role. |
| `Id`</br>`name` | The unique ID of the role. |
| `IsCustom`</br>`roleType` | Indicates whether this is a custom role. Set to `true` or `CustomRole` for custom roles. Set to `false` or `BuiltInRole` for built-in roles. |
| `Description`</br>`description` | The description of the role. |
| `Actions`</br>`actions` | An array of strings that specifies the management operations that the role allows to be performed. |
| `NotActions`</br>`notActions` | An array of strings that specifies the management operations that are excluded from the allowed `Actions`. |
| `DataActions`</br>`dataActions` | An array of strings that specifies the data operations that the role allows to be performed to your data within that object. |
| `NotDataActions`</br>`notDataActions` | An array of strings that specifies the data operations that are excluded from the allowed `DataActions`. |
| `AssignableScopes`</br>`assignableScopes` | An array of strings that specifies the scopes that the role is available for assignment. |

### Operations format

Operations are specified with strings that have the following format:

- `{Company}.{ProviderName}/{resourceType}/{action}`

The `{action}` portion of an operation string specifies the type of operations you can perform on a resource type. For example, you will see the following substrings in `{action}`:

| Action substring    | Description         |
| ------------------- | ------------------- |
| `*` | The wildcard character grants access to all operations that match the string. |
| `read` | Enables read operations (GET). |
| `write` | Enables write operations (PUT or PATCH). |
| `action` | Enables custom operations like restart virtual machines (POST). |
| `delete` | Enables delete operations (DELETE). |

### Role definition example

Here's the [Contributor](built-in-roles.md#contributor) role definition as displayed in Azure PowerShell and Azure CLI. The wildcard (`*`) operation under `Actions` indicates that the principal assigned to this role can perform all actions, or in other words, it can manage everything. This includes actions defined in the future, as Azure adds new resource types. The operations under `NotActions` are subtracted from `Actions`. In the case of the [Contributor](built-in-roles.md#contributor) role, `NotActions` removes this role's ability to manage access to resources and also assign access to resources.

Contributor role as displayed in Azure PowerShell:

```json
{
  "Name": "Contributor",
  "Id": "b24988ac-6180-42a0-ab88-20f7382dd24c",
  "IsCustom": false,
  "Description": "Lets you manage everything except access to resources.",
  "Actions": [
    "*"
  ],
  "NotActions": [
    "Microsoft.Authorization/*/Delete",
    "Microsoft.Authorization/*/Write",
    "Microsoft.Authorization/elevateAccess/Action",
    "Microsoft.Blueprint/blueprintAssignments/write",
    "Microsoft.Blueprint/blueprintAssignments/delete"
  ],
  "DataActions": [],
  "NotDataActions": [],
  "AssignableScopes": [
    "/"
  ]
}
```

Contributor role as displayed in Azure CLI:

```json
{
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
      "notActions": [
        "Microsoft.Authorization/*/Delete",
        "Microsoft.Authorization/*/Write",
        "Microsoft.Authorization/elevateAccess/Action",
        "Microsoft.Blueprint/blueprintAssignments/write",
        "Microsoft.Blueprint/blueprintAssignments/delete"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Management and data operations

Role-based access control for management operations is specified in the `Actions` and `NotActions` properties of a role definition. Here are some examples of management operations in Azure:

- Manage access to a storage account
- Create, update, or delete a blob container
- Delete a resource group and all of its resources

Management access is not inherited to your data provided that the container authentication method is set to "Azure AD User Account" and not "Access Key". This separation prevents roles with wildcards (`*`) from having unrestricted access to your data. For example, if a user has a [Reader](built-in-roles.md#reader) role on a subscription, then they can view the storage account, but by default they can't view the underlying data.

Previously, role-based access control was not used for data operations. Authorization for data operations varied across resource providers. The same role-based access control authorization model used for management operations has been extended to data operations.

To support data operations, new data properties have been added to the role definition. Data operations are specified in the `DataActions` and `NotDataActions` properties. By adding these data properties, the separation between management and data is maintained. This prevents current role assignments with wildcards (`*`) from suddenly having accessing to data. Here are some data operations that can be specified in `DataActions` and `NotDataActions`:

- Read a list of blobs in a container
- Write a storage blob in a container
- Delete a message in a queue

Here's the [Storage Blob Data Reader](built-in-roles.md#storage-blob-data-reader) role definition, which includes operations in both the `Actions` and `DataActions` properties. This role allows you to read the blob container and also the underlying blob data.

Storage Blob Data Reader role as displayed in Azure PowerShell:

```json
{
  "Name": "Storage Blob Data Reader",
  "Id": "2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
  "IsCustom": false,
  "Description": "Allows for read access to Azure Storage blob containers and data",
  "Actions": [
    "Microsoft.Storage/storageAccounts/blobServices/containers/read",
    "Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action"
  ],
  "NotActions": [],
  "DataActions": [
    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read"
  ],
  "NotDataActions": [],
  "AssignableScopes": [
    "/"
  ]
}
```

Storage Blob Data Reader role as displayed in Azure CLI:

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for read access to Azure Storage blob containers and data",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
  "name": "2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
  "permissions": [
    {
      "actions": [
        "Microsoft.Storage/storageAccounts/blobServices/containers/read",
        "Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Storage Blob Data Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

Only data operations can be added to the `DataActions` and `NotDataActions` properties. Resource providers identify which operations are data operations, by setting the `isDataAction` property to `true`. To see a list of the operations where `isDataAction` is `true`, see [Resource provider operations](resource-provider-operations.md). Roles that do not have data operations are not required to have `DataActions` and `NotDataActions` properties within the role definition.

Authorization for all management operation API calls is handled by Azure Resource Manager. Authorization for data operation API calls is handled by either a resource provider or Azure Resource Manager.

### Data operations example

To better understand how management and data operations work, let's consider a specific example. Alice has been assigned the [Owner](built-in-roles.md#owner) role at the subscription scope. Bob has been assigned the [Storage Blob Data Contributor](built-in-roles.md#storage-blob-data-contributor) role at a storage account scope. The following diagram shows this example.

![Role-based access control has been extended to support both management and data operations](./media/role-definitions/rbac-management-data.png)

The [Owner](built-in-roles.md#owner) role for Alice and the [Storage Blob Data Contributor](built-in-roles.md#storage-blob-data-contributor) role for  Bob have the following actions:

Owner

&nbsp;&nbsp;&nbsp;&nbsp;Actions<br>
&nbsp;&nbsp;&nbsp;&nbsp;`*`

Storage Blob Data Contributor

&nbsp;&nbsp;&nbsp;&nbsp;Actions<br>
&nbsp;&nbsp;&nbsp;&nbsp;`Microsoft.Storage/storageAccounts/blobServices/containers/delete`<br>
&nbsp;&nbsp;&nbsp;&nbsp;`Microsoft.Storage/storageAccounts/blobServices/containers/read`<br>
&nbsp;&nbsp;&nbsp;&nbsp;`Microsoft.Storage/storageAccounts/blobServices/containers/write`<br>
&nbsp;&nbsp;&nbsp;&nbsp;`Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action`<br>
&nbsp;&nbsp;&nbsp;&nbsp;DataActions<br>
&nbsp;&nbsp;&nbsp;&nbsp;`Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete`<br>
&nbsp;&nbsp;&nbsp;&nbsp;`Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read`<br>
&nbsp;&nbsp;&nbsp;&nbsp;`Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action`<br>
&nbsp;&nbsp;&nbsp;&nbsp;`Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write`

Since Alice has a wildcard (`*`) action at a subscription scope, their permissions inherit down to enable them to perform all management actions. Alice can read, write, and delete containers. However, Alice cannot perform data operations without taking additional steps. For example, by default, Alice cannot read the blobs inside a container. To read the blobs, Alice would have to retrieve the storage access keys and use them to access the blobs.

Bob's permissions are restricted to just the `Actions` and `DataActions` specified in the [Storage Blob Data Contributor](built-in-roles.md#storage-blob-data-contributor) role. Based on the role, Bob can perform both management and data operations. For example, Bob can read, write, and delete containers in the specified storage account and can also read, write, and delete the blobs.

For more information about management and data plane security for storage, see the [Azure Storage security guide](../storage/blobs/security-recommendations.md).

### What tools support using Azure roles for data operations?

To view and work with data operations, you must have the correct versions of the tools or SDKs:

| Tool  | Version  |
|---------|---------|
| [Azure PowerShell](/powershell/azure/install-az-ps) | 1.1.0 or later |
| [Azure CLI](/cli/azure/install-azure-cli) | 2.0.30 or later |
| [Azure for .NET](/dotnet/azure/) | 2.8.0-preview or later |
| [Azure SDK for Go](/azure/go/azure-sdk-go-install) | 15.0.0 or later |
| [Azure for Java](/java/azure/) | 1.9.0 or later |
| [Azure for Python](/azure/python/) | 0.40.0 or later |
| [Azure SDK for Ruby](https://rubygems.org/gems/azure_sdk) | 0.17.1 or later |

To view and use the data operations in the REST API, you must set the **api-version** parameter to the following version or later:

- 2018-07-01

## Actions

The `Actions` permission specifies the management operations that the role allows to be performed. It is a collection of operation strings that identify securable operations of Azure resource providers. Here are some examples of management  operations that can be used in `Actions`.

> [!div class="mx-tableFixed"]
> | Operation string    | Description         |
> | ------------------- | ------------------- |
> | `*/read` | Grants access to read operations for all resource types of all Azure resource providers.|
> | `Microsoft.Compute/*` | Grants access to all operations for all resource types in the Microsoft.Compute resource provider.|
> | `Microsoft.Network/*/read` | Grants access to read operations for all resource types in the Microsoft.Network resource provider.|
> | `Microsoft.Compute/virtualMachines/*` | Grants access to all operations of virtual machines and its child resource types.|
> | `microsoft.web/sites/restart/Action` | Grants access to restart a web app.|

## NotActions

The `NotActions` permission specifies the management operations that are excluded from the allowed `Actions`. Use the `NotActions` permission if the set of operations that you want to allow is more easily defined by excluding restricted operations. The access granted by a role (effective permissions) is computed by subtracting the `NotActions` operations from the `Actions` operations.

> [!NOTE]
> If a user is assigned a role that excludes an operation in `NotActions`, and is assigned a second role that grants access to the same operation, the user is allowed to perform that operation. `NotActions` is not a deny rule – it is simply a convenient way to create a set of allowed operations when specific operations need to be excluded.
>

## DataActions

The `DataActions` permission specifies the data operations that the role allows to be performed to your data within that object. For example, if a user has read blob data access to a storage account, then they can read the blobs within that storage account. Here are some examples of data operations that can be used in `DataActions`.

> [!div class="mx-tableFixed"]
> | Operation string    | Description         |
> | ------------------- | ------------------- |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` | Returns a blob or a list of blobs. |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` | Returns the result of writing a blob. |
> | `Microsoft.Storage/storageAccounts/queueServices/queues/messages/read` | Returns a message. |
> | `Microsoft.Storage/storageAccounts/queueServices/queues/messages/*` | Returns a message or the result of writing or deleting a message. |

## NotDataActions

The `NotDataActions` permission specifies the data operations that are excluded from the allowed `DataActions`. The access granted by a role (effective permissions) is computed by subtracting the `NotDataActions` operations from the `DataActions` operations. Each resource provider provides its respective set of APIs to fulfill data operations.

> [!NOTE]
> If a user is assigned a role that excludes a data operation in `NotDataActions`, and is assigned a second role that grants access to the same data operation, the user is allowed to perform that data operation. `NotDataActions` is not a deny rule – it is simply a convenient way to create a set of allowed data operations when specific data operations need to be excluded.
>

## AssignableScopes

The `AssignableScopes` property specifies the scopes (management groups, subscriptions, or resource groups) that have this role definition available. You can make the role available for assignment in only the management groups, subscriptions, or resource groups that require it. You must use at least one management group, subscription, or resource group.

Built-in roles have `AssignableScopes` set to the root scope (`"/"`). The root scope indicates that the role is available for assignment in all scopes. Examples of valid assignable scopes include:

> [!div class="mx-tableFixed"]
> | Role is available for assignment | Example |
> |----------|---------|
> | One subscription | `"/subscriptions/{subscriptionId1}"` |
> | Two subscriptions | `"/subscriptions/{subscriptionId1}", "/subscriptions/{subscriptionId2}"` |
> | Network resource group | `"/subscriptions/{subscriptionId1}/resourceGroups/Network"` |
> | One management group | `"/providers/Microsoft.Management/managementGroups/{groupId1}"` |
> | Management group and a subscription | `"/providers/Microsoft.Management/managementGroups/{groupId1}", /subscriptions/{subscriptionId1}",` |
> | All scopes (applies only to built-in roles) | `"/"` |

For information about `AssignableScopes` for custom roles, see [Azure custom roles](custom-roles.md).

## Next steps

* [Azure built-in roles](built-in-roles.md)
* [Azure custom roles](custom-roles.md)
* [Azure Resource Manager resource provider operations](resource-provider-operations.md)
