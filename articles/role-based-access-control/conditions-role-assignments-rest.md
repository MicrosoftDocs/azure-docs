---
title: Add or edit Azure role assignment conditions using the REST API - Azure ABAC
description: Learn how to add, edit, list, or delete attribute-based access control (ABAC) conditions in Azure role assignments using the REST API and Azure role-based access control (Azure RBAC).
services: active-directory
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.subservice: conditions
ms.topic: how-to
ms.workload: identity
ms.date: 10/24/2022
ms.author: rolyon
---

# Add or edit Azure role assignment conditions using the REST API

An [Azure role assignment condition](conditions-overview.md) is an additional check that you can optionally add to your role assignment to provide more fine-grained access control. For example, you can add a condition that requires an object to have a specific tag to read the object. This article describes how to add, edit, list, or delete conditions for your role assignments using the REST API.

## Prerequisites

You must use the following versions:

- `2020-03-01-preview` or later
- `2020-04-01-preview` or later if you want to utilize the `description` property for role assignments
- `2022-04-01` is the first stable version

For more information about the prerequisites to add or edit role assignment conditions, see [Conditions prerequisites](conditions-prerequisites.md).

## Add a condition

To add a role assignment condition, use the [Role Assignments - Create](/rest/api/authorization/role-assignments/create) REST API. [Role Assignments - Create](/rest/api/authorization/role-assignments/create) includes the following parameters related to conditions.

| Parameter | Type | Description |
| --- | --- | --- |
| `condition` | String | Condition under which the user can be granted permission. |
| `conditionVersion` | String | Version of the condition syntax. If `condition` is specified without `conditionVersion`, the version is set to the default value of 2.0. |

Use the following request and body:

```http
PUT https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentId}?api-version=2022-04-01
```

```json
{
    "properties": {
        "roleDefinitionId": "/{scope}/providers/Microsoft.Authorization/roleDefinitions/{roleDefinitionId}",
        "principalId": "{principalId}",
        "condition": "{condition}",
        "conditionVersion": "2.0",
        "description": "{description}"
    }
}
```

The following example shows how to assign the [Storage Blob Data Reader](built-in-roles.md#storage-blob-data-reader) role with a condition. The condition checks whether container name equals 'blobs-example-container'.

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentId}?api-version=2022-04-01
```

```json
{
    "properties": {
        "roleDefinitionId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/roleDefinitions/2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
        "principalId": "{principalId}",
        "condition": "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container'))",
        "conditionVersion": "2.0",
        "description": "Read access if container name equals blobs-example-container"
    }
}
```

The following shows an example of the output:

```json
{
    "properties": {
        "roleDefinitionId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/roleDefinitions/2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
        "principalId": "{principalId}",
        "principalType": "User",
        "scope": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}",
        "condition": "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container'))",
        "conditionVersion": "2.0",
        "createdOn": "2022-07-20T06:20:44.0205560Z",
        "updatedOn": "2022-07-20T06:20:44.2955371Z",
        "createdBy": null,
        "updatedBy": "{updatedById}",
        "delegatedManagedIdentityResourceId": null,
        "description": "Read access if container name equals blobs-example-container"
    },
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentId}",
    "type": "Microsoft.Authorization/roleAssignments",
    "name": "{roleAssignmentId}"
}
```

## Edit a condition

To edit an existing role assignment condition, use the same [Role Assignments - Create](/rest/api/authorization/role-assignments/create) REST API as you used to add the role assignment condition. The following shows an example JSON where `condition` and `description` are updated. Only the `condition`, `conditionVersion`, and `description` properties can be edited. You must specify the other properties to match the existing role assignment.

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentId}?api-version=2022-04-01
```

```json
{
    "properties": {
        "roleDefinitionId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/roleDefinitions/2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
        "principalId": "{principalId}",
        "condition": "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container' OR @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container2'))",
        "conditionVersion": "2.0",
        "description": "Read access if container name equals blobs-example-container or blobs-example-container2"
    }
}
```

## List a condition

To list a role assignment condition, use the [Role Assignments](/rest/api/authorization/role-assignments) Get or List REST API. For more information, see [List Azure role assignments using the REST API](role-assignments-list-rest.md).

## Delete a condition

To delete a role assignment condition, edit the role assignment condition and set both the condition and condition version to either an empty string or null.

Alternatively, if you want to delete both the role assignment and the condition, you can use the [Role Assignments - Delete](/rest/api/authorization/role-assignments/delete) API. For more information, see [Remove Azure role assignments](role-assignments-remove.md).

## Next steps

- [Example Azure role assignment conditions for Blob Storage](../storage/blobs/storage-auth-abac-examples.md)
- [Tutorial: Add a role assignment condition to restrict access to blobs using the Azure portal](../storage/blobs/storage-auth-abac-portal.md)
- [Troubleshoot Azure role assignment conditions](conditions-troubleshoot.md)
