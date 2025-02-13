---
title: Azure roles required to assign storage tasks
titleSuffix: Azure Storage Actions
description: Learn about the roles required to create a storage task assignment and the roles required by the managed identity of a storage task to operate on a storage account.
services: storage
author: normesta
ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: conceptual
ms.date: 02/05/2025
ms.author: normesta

---

# Azure roles required to assign tasks

This article describes the least privileged built-in Azure roles or RBAC actions required to create a storage task assignment and for the storage task to operate on the target storage account. 

## Permission to assign a task

A task _assignment_ identifies a storage account and a subset of objects in that account that the storage task will target. An assignment also defines when the task runs and where execution reports are stored. For step-by-step guidance, see [Create and manage a Storage task assignment](storage-task-assignment-create.md).

To create an assignment, your identity must be assigned a custom role that contains the following RBAC actions:

- The `Microsoft.Authorization/roleAssignments/write` action.

- All of the RBAC actions that are available in the `Microsoft.Storage/StorageAccounts` set of RBAC action.

To learn how to create a custom role, see [Azure custom roles](../../role-based-access-control/custom-roles.md#steps-to-create-a-custom-role).

## Permission for a task to perform operations

As you create an assignment, you must choose an Azure Built-in or custom role that has the permission necessary to perform the specified operations on the target storage account or storage account container. That role is assigned to the managed identity of the storage task. You can choose only roles that are assigned to your user identity. If you prefer to use a custom role, you must make sure that your role contains the RBAC actions necessary to perform the operations.

The following table shows the least privileged built-in Azure role as well as the RBAC actions required by each operation.

| Permission | Built-in role | RBAC actions for a custom role |
|---|---|---|
| SetBlobTier | [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner)|Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write
| SetBlobExpiry | [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) |Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write |
| SetBlobTags | [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) |Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write |
| SetBlobImmutabilityPolicy | [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) |Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/write |
| SetBlobLegalHold | [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) |Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/write |
| DeleteBlob | [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) |Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete |
| UndeleteBlob | [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) |Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/write |

## See also

- [Create and manage an assignment](storage-task-assignment-create.md)
