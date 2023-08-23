---
title: Add or edit Azure role assignment conditions using Azure CLI - Azure ABAC
description: Learn how to add, edit, list, or delete attribute-based access control (ABAC) conditions in Azure role assignments using Azure CLI and Azure role-based access control (Azure RBAC).
services: active-directory
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.subservice: conditions
ms.topic: how-to
ms.workload: identity
ms.custom: devx-track-azurecli
ms.date: 10/24/2022
ms.author: rolyon
---

# Add or edit Azure role assignment conditions using Azure CLI

An [Azure role assignment condition](conditions-overview.md) is an additional check that you can optionally add to your role assignment to provide more fine-grained access control. For example, you can add a condition that requires an object to have a specific tag to read the object. This article describes how to add, edit, list, or delete conditions for your role assignments using Azure CLI.

## Prerequisites

For information about the prerequisites to add or edit role assignment conditions, see [Conditions prerequisites](conditions-prerequisites.md).

## Add a condition

To add a role assignment condition, use [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create). The [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command includes the following parameters related to conditions.

| Parameter | Type | Description |
| --- | --- | --- |
| `condition` | String | Condition under which the user can be granted permission. |
| `condition-version` | String | Version of the condition syntax. If `--condition` is specified without `--condition-version`, the version is set to the default value of 2.0. |

The following example shows how to assign the [Storage Blob Data Reader](built-in-roles.md#storage-blob-data-reader) role with a condition. The condition checks whether container name equals 'blobs-example-container'.

```azurecli
az role assignment create --role "Storage Blob Data Reader" --scope /subscriptions/mySubscriptionID/resourceGroups/myResourceGroupName --assignee "user1@contoso.com" --resource-group {resourceGroup} \
--description "Read access if container name equals blobs-example-container" \
--condition "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container'))" \
--condition-version "2.0"
```

The following shows an example of the output:

```azurecli
{
    "canDelegate": null,
    "condition": "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container'))",
    "conditionVersion": "2.0",
    "description": "Read access if container name equals blobs-example-container",
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentId}",
    "name": "{roleAssignmentId}",
    "principalId": "{userObjectId}",
    "principalType": "User",
    "resourceGroup": "{resourceGroup}",
    "roleDefinitionId": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
    "scope": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}",
    "type": "Microsoft.Authorization/roleAssignments"
}
```

## Edit a condition

To edit an existing role assignment condition, use [az role assignment update](/cli/azure/role/assignment#az-role-assignment-update) and a JSON file as input. The following shows an example JSON file where condition and description are updated. Only the `condition`, `conditionVersion`, and `description` properties can be edited. You must specify all the properties to update the role assignment condition.

```json
{
    "canDelegate": null,
    "condition": "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container' OR @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container2'))",
    "conditionVersion": "2.0",
    "description": "Read access if container name equals blobs-example-container or blobs-example-container2",
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentId}",
    "name": "{roleAssignmentId}",
    "principalId": "{userObjectId}",
    "principalType": "User",
    "resourceGroup": "{resourceGroup}",
    "roleDefinitionId": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
    "scope": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}",
    "type": "Microsoft.Authorization/roleAssignments"
}
```

Use [az role assignment update](/cli/azure/role/assignment#az-role-assignment-update) to update the condition for the role assignment.

```azurecli
az role assignment update --role-assignment "./path/roleassignment.json"
```

The following shows an example of the output:

```azurecli
{
    "canDelegate": null,
    "condition": "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container' OR @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container2'))",
    "conditionVersion": "2.0",
    "description": "Read access if container name equals blobs-example-container or blobs-example-container2",
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentId}",
    "name": "{roleAssignmentId}",
    "principalId": "{userObjectId}",
    "principalType": "User",
    "resourceGroup": "{resourceGroup}",
    "roleDefinitionId": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
    "scope": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}",
    "type": "Microsoft.Authorization/roleAssignments"
}
```

## List a condition

To list a role assignment condition, use [az role assignment list](/cli/azure/role/assignment#az-role-assignment-list). For more information, see [List Azure role assignments using Azure CLI](role-assignments-list-cli.md).

## Delete a condition

To delete a role assignment condition, edit the role assignment condition and set both the `condition` and `condition-version` properties to either an empty string (`""`) or `null`.

Alternatively, if you want to delete both the role assignment and the condition, you can use the [az role assignment delete](/cli/azure/role/assignment#az-role-assignment-delete) command. For more information, see [Remove Azure role assignments](role-assignments-remove.md).

## Next steps

- [Example Azure role assignment conditions for Blob Storage](../storage/blobs/storage-auth-abac-examples.md)
- [Tutorial: Add a role assignment condition to restrict access to blobs using Azure CLI](../storage/blobs/storage-auth-abac-cli.md)
- [Troubleshoot Azure role assignment conditions](conditions-troubleshoot.md)
