---
title: Add or edit Azure role assignment conditions using Azure PowerShell - Azure ABAC
description: Learn how to add, edit, list, or delete attribute-based access control (ABAC) conditions in Azure role assignments using Azure PowerShell and Azure role-based access control (Azure RBAC).
services: active-directory
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.subservice: conditions
ms.topic: how-to
ms.workload: identity
ms.custom: devx-track-azurepowershell
ms.date: 10/24/2022
ms.author: rolyon
---

# Add or edit Azure role assignment conditions using Azure PowerShell

An [Azure role assignment condition](conditions-overview.md) is an additional check that you can optionally add to your role assignment to provide more fine-grained access control. For example, you can add a condition that requires an object to have a specific tag to read the object. This article describes how to add, edit, list, or delete conditions for your role assignments using Azure PowerShell.

## Prerequisites

For information about the prerequisites to add or edit role assignment conditions, see [Conditions prerequisites](conditions-prerequisites.md).

## Add a condition

To add a role assignment condition, use [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment). The [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) command includes the following parameters related to conditions.

| Parameter | Type | Description |
| --- | --- | --- |
| `Condition` | String | Condition under which the user can be granted permission. |
| `ConditionVersion` | String | Version of the condition syntax. Must be set to 2.0. If `Condition` is specified, `ConditionVersion` must also be specified. |

The following example shows how to initialize the variables to assign the [Storage Blob Data Reader](built-in-roles.md#storage-blob-data-reader) role with a condition. The condition checks whether container name equals 'blobs-example-container'.

```azurepowershell
$subscriptionId = "<subscriptionId>"
$resourceGroup = "<resourceGroup>"
$roleDefinitionName = "Storage Blob Data Reader"
$roleDefinitionId = "2a2b9908-6ea1-4ae2-8e65-a410df84e7d1"
$userObjectId = "<userObjectId>"
$scope = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroup"
$description = "Read access if container name equals blobs-example-container"
$condition = "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container'))"
$conditionVersion = "2.0"
```

Use [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) to assign the role with a condition.

```azurepowershell
New-AzRoleAssignment -ObjectId $userObjectId -Scope $scope -RoleDefinitionId $roleDefinitionId -Description $description -Condition $condition -ConditionVersion $conditionVersion
```

Here's an example of the output:

```azurepowershell
RoleAssignmentId   : /subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Authorization/roleAssignments/<roleAssignmentId>
Scope              : /subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>
DisplayName        : User1
SignInName         : user1@contoso.com
RoleDefinitionName : Storage Blob Data Reader
RoleDefinitionId   : 2a2b9908-6ea1-4ae2-8e65-a410df84e7d1
ObjectId           : <userObjectId>
ObjectType         : User
CanDelegate        : False
Description        : Read access if container name equals blobs-example-container
ConditionVersion   : 2.0
Condition          : ((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container'))
```

In PowerShell, if your condition includes a dollar sign ($), you must prefix it with a backtick (\`). For example, the following condition uses dollar signs to delineate the tag key name. For more information about rules for quotation marks in PowerShell, see [About Quoting Rules](/powershell/module/microsoft.powershell.core/about/about_quoting_rules).

```azurepowershell
$condition = "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'} AND NOT SubOperationMatches{'Blob.List'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<`$key_case_sensitive`$>] StringEquals 'Cascade'))"
```

## Edit a condition

To edit an existing role assignment condition, use [Set-AzRoleAssignment](/powershell/module/az.resources/set-azroleassignment). Only the `Condition`, `ConditionVersion`, and `Description` properties can be edited. The `-PassThru` parameter causes [Set-AzRoleAssignment](/powershell/module/az.resources/set-azroleassignment) to return the updated role assignment, which allows visualization or storage in a variable for further use.

There are two ways to edit a condition. You can use the `PSRoleAssignment` object or a JSON file.

### Edit a condition using the PSRoleAssignment object

1. Use [Get-AzRoleAssignment](/powershell/module/az.resources/get-azroleassignment) to get the existing role assignment with a condition as a `PSRoleAssignment` object.

    ```azurepowershell
    $testRa = Get-AzRoleAssignment -Scope $scope -RoleDefinitionName $roleDefinitionName -ObjectId $userObjectId
    ```

1. Edit the condition.

    ```azurepowershell
    $condition = "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container' OR @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container2'))"
    ```

1. Initialize the condition and description.

    ```azurepowershell
    $testRa.Condition = $condition
    $testRa.Description = "Read access if container name equals blobs-example-container or blobs-example-container2"
    ```

1. Use [Set-AzRoleAssignment](/powershell/module/az.resources/set-azroleassignment) to update the condition for the role assignment.

    ```azurepowershell
    Set-AzRoleAssignment -InputObject $testRa -PassThru
    ```

    Here's an example of the output:

    ```azurepowershell
    RoleAssignmentId   : /subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Authorization/roleAssignments/<roleAssignmentId>
    Scope              : /subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>
    DisplayName        : User1
    SignInName         : user1@contoso.com
    RoleDefinitionName : Storage Blob Data Reader
    RoleDefinitionId   : 2a2b9908-6ea1-4ae2-8e65-a410df84e7d1
    ObjectId           : <userObjectId>
    ObjectType         : User
    CanDelegate        : False
    Description        : Read access if container name equals blobs-example-container or blobs-example-container2
    ConditionVersion   : 2.0
    Condition          : ((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container' OR @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container2'))
    ```

### Edit a condition using a JSON file

To edit a condition, you can also provide a JSON file as input. The following shows an example JSON file where `Condition` and `Description` are updated. You must specify all the properties in the JSON file to update a condition.

```json
{
    "RoleDefinitionId": "2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
    "ObjectId": "<userObjectId>",
    "ObjectType": "User",
    "Scope": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>",
    "Condition": "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container' OR @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container2'))",
    "ConditionVersion": "2.0",
    "CanDelegate": false,
    "Description": "Read access if container name equals blobs-example-container or blobs-example-container2",
    "RoleAssignmentId": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Authorization/roleAssignments/<roleAssignmentId>"
}
```

Use [Set-AzRoleAssignment](/powershell/module/az.resources/set-azroleassignment) to update the condition for the role assignment.

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
ObjectId           : <userObjectId>
ObjectType         : User
CanDelegate        : False
Description        : Read access if container name equals blobs-example-container or blobs-example-container2
ConditionVersion   : 2.0
Condition          : ((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container' OR @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container2'))
```

## List a condition

To list a role assignment condition, use [Get-AzRoleAssignment](/powershell/module/az.resources/get-azroleassignment). For more information, see [List Azure role assignments using Azure PowerShell](role-assignments-list-powershell.md).

## Delete a condition

To delete a role assignment condition, edit the role assignment condition and set both the `Condition` and `ConditionVersion` properties to either an empty string (`""`) or `$null`.

Alternatively, if you want to delete both the role assignment and the condition, you can use the [Remove-AzRoleAssignment](/powershell/module/az.resources/remove-azroleassignment) command. For more information, see [Remove Azure role assignments](role-assignments-remove.md).

## Next steps

- [Example Azure role assignment conditions for Blob Storage](../storage/blobs/storage-auth-abac-examples.md)
- [Tutorial: Add a role assignment condition to restrict access to blobs using Azure PowerShell](../storage/blobs/storage-auth-abac-powershell.md)
- [Troubleshoot Azure role assignment conditions](conditions-troubleshoot.md)
