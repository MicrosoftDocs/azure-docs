---
title: Add or edit Azure role assignment conditions using Azure PowerShell (Preview) - Azure RBAC
description: Learn how to add, edit, list, or delete attribute-based access control (ABAC) conditions in Azure role assignments using Azure PowerShell and Azure role-based access control (Azure RBAC).
services: active-directory
author: rolyon
manager: mtillman
ms.service: role-based-access-control
ms.subservice: conditions
ms.topic: how-to
ms.workload: identity
ms.date: 04/21/2021
ms.author: rolyon
---

# Add or edit Azure role assignment conditions using Azure PowerShell (Preview)

> [!IMPORTANT]
> Azure ABAC and Azure role assignment conditions are currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

For information about the prerequisites to add or edit role assignment conditions, see [Conditions prerequisites](conditions-prerequisites.md).

## Add a condition

To add a role assignment condition, use [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment). The [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) command includes the following parameters related to conditions.

| Parameter | Type | Description |
| --- | --- | --- |
| `Condition` | String | Condition under which the user can be granted permission. |
| `ConditionVersion` | String | Version of the condition syntax. Must be set to 2.0. If `Condition` is specified, `ConditionVersion` must also be specified. |

The following example shows how to assign the [Storage Blob Data Reader](built-in-roles.md#storage-blob-data-reader) role with a condition. The condition checks whether container name equals 'blobs-example-container'. You can start by initializing variables.

```azurepowershell
$subscriptionId = "<subscriptionId>"
$resourceGroup = "<resourceGroup>"
$roleDefinitionId = "2a2b9908-6ea1-4ae2-8e65-a410df84e7d1"
$principalId = "<principalId>"
$scope = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroup"
$description = "Read access if container name equals blobs-example-container"
$condition = "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container'))"
$conditionVersion = "2.0"
```

The following shows how to call [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment).

```azurepowershell
New-AzRoleAssignment -ObjectId $principalId -Scope $scope -RoleDefinitionId $roleDefinitionId -Description $description -Condition $condition -ConditionVersion $conditionVersion
```

Here's an example of the output:

```azurepowershell
RoleAssignmentId   : /subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Authorization/roleAssignments/<roleAssignmentId>
Scope              : /subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>
DisplayName        : User1
SignInName         : user1@contoso.com
RoleDefinitionName : Storage Blob Data Reader
RoleDefinitionId   : 2a2b9908-6ea1-4ae2-8e65-a410df84e7d1
ObjectId           : <principalId>
ObjectType         : User
CanDelegate        : False
Description        : Read access if container name equals blobs-example-container
ConditionVersion   : 2.0
Condition          : ((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container'))
```

In PowerShell, if your condition includes a dollar sign ($), you must prefix it with a backtick (\`). For example, the following condition uses dollar signs to delineate the tag key name.

```azurepowershell
$condition = "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'} AND SubOperationMatches{'Blobs.Read.WithTagConditions'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<`$key_case_sensitive`$>] StringEquals 'Cascade'))"
```

## Edit a condition

To edit an existing role assignment condition, use [Set-AzRoleAssignment](/powershell/module/az.resources/set-azroleassignment) and a JSON file as input. The following shows an example JSON file where `Condition` and `Description` are updated. Only the `Condition`, `ConditionVersion`, and `Description` properties can be edited. You must specify all the properties in the JSON file to properly update the role assignment condition.

```json
{
    "RoleDefinitionId": "2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
    "ObjectId": "<principalId>",
    "ObjectType": "User",
    "Scope": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>",
    "Condition": "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container' OR @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container2'))",
    "ConditionVersion": "2.0",
    "CanDelegate": false,
    "Description": "Read access if container name equals blobs-example-container or blobs-example-container2",
    "RoleAssignmentId": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Authorization/roleAssignments/<roleAssignmentId>"
}
```

The following shows how to call [Set-AzRoleAssignment](/powershell/module/az.resources/set-azroleassignment). The `-PassThru` parameter causes the [Set-AzRoleAssignment](/powershell/module/az.resources/set-azroleassignment) command to return the updated role assignment, which allows visualization or storage in a variable for further use.

```azurepowershell
Set-AzRoleAssignment -InputFile "C:\path\roleassignment.json" -PassThru
```

Here's an example of the output:

```azurepowershell
RoleAssignmentId   : /subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Authorization/roleAssignments/<roleAssignmentId>
Scope              : /subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>
DisplayName        : User1
SignInName         : user1@contoso.com
RoleDefinitionName : Storage Blob Data Reader
RoleDefinitionId   : 2a2b9908-6ea1-4ae2-8e65-a410df84e7d1
ObjectId           : <principalId>
ObjectType         : User
CanDelegate        : False
Description        : Read access if container name equals blobs-example-container or blobs-example-container2
ConditionVersion   : 2.0
Condition          : ((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container' OR @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container2'))
```

## List a condition

To list a role assignment condition, use [Get-AzRoleAssignment](/powershell/module/az.resources/get-azroleassignment). For more information, see [List Azure role assignments using Azure PowerShell](role-assignments-list-powershell.md).

## Delete a condition

To delete a role assignment condition, edit the role assignment condition and set both the Condition and ConditionVersion to either an empty string or null.

Alternatively, if you want to delete both the role assignment and the condition, you can use the [Remove-AzRoleAssignment](/powershell/module/az.resources/remove-azroleassignment) command. For more information, see [Remove Azure role assignments](role-assignments-remove.md).

## Next steps

- [Example Azure role assignment conditions (Preview)](../storage/common/storage-auth-abac-examples.md)
- [Tutorial: Add a role assignment condition to restrict access to blobs using Azure PowerShell (Preview)](../storage/common/storage-auth-abac-powershell.md)
- [Troubleshoot Azure role assignment conditions (Preview)](conditions-troubleshoot.md)
