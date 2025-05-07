---
title: Azure roles required to assign storage tasks
titleSuffix: Azure Storage Actions
description: Learn about the roles required to create a storage task assignment and the roles required by the managed identity of a storage task to operate on a storage account.
services: storage
author: normesta
ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: conceptual
ms.date: 05/05/2025
ms.author: normesta

---

# Azure roles required to assign tasks

This article describes the least privileged built-in Azure roles or RBAC actions required to manage a storage task assignment.

## Permission to manage storage task assignments

To create an assignment, your identity must be assigned either the [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role or a custom role that contains the following RBAC actions:

- Microsoft.Authorization/roleAssignments/write
- Microsoft.Authorization/roleAssignments/delete
- Microsoft.Storage/storageAccounts/reports/read
- Microsoft.Storage/storageAccounts/read
- Microsoft.Storage/storageAccounts/blobServices/read
- Microsoft.Storage/storageAccounts/storageTaskAssignments/read
- Microsoft.Storage/storageAccounts/storageTaskAssignments/write
- Microsoft.Storage/storageAccounts/storageTaskAssignments/delete
- Microsoft.Storage/storageAccounts/storageTaskAssignments/reports/read

To learn how to create a custom role, see [Azure custom roles](../../role-based-access-control/custom-roles.md#steps-to-create-a-custom-role).

## Permission for a task to perform operations

As you create an assignment, you must choose an Azure built-in or custom role that has the permission necessary to perform the specified operations on the target storage account or storage account container. That role is assigned to the managed identity of the storage task. You can choose only roles that are assigned to your user identity. 

The [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role provides all of the permissions necessary for a storage task to perform all data operations. If you prefer to use a custom role, you must make sure that your role contains the RBAC actions necessary to perform the operations. The following table shows the RBAC actions required by each operation.

| Permission | RBAC actions for a custom role |
|---|---|---|
| SetBlobTier | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write
| SetBlobExpiry |Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write |
| SetBlobTags |Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write |
| SetBlobImmutabilityPolicy |Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/write |
| SetBlobLegalHold  |Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/write |
| DeleteBlob |Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete |
| UndeleteBlob |Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/write |

## See also

- [Create and manage an assignment](storage-task-assignment-create.md)
