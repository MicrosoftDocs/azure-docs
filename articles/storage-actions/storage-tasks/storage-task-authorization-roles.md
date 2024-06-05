---
title: Azure roles for storage tasks
titleSuffix: Azure Storage Actions Preview
description: Learn about the least privileged built-in Azure roles or RBAC actions required to read, update, delete and assign a storage task.
services: storage
author: normesta

ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: conceptual
ms.date: 01/17/2024
ms.author: normesta

---

# Azure roles for storage tasks

This article describes the least privileged built-in Azure roles or RBAC actions required to read, update, delete and assign a storage task.

> [!IMPORTANT]
> Azure Storage Actions is currently in PREVIEW and is available these [regions](../overview.md#supported-regions).
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Permission to read, edit, or delete a task

You must assign a role to any security principal in your organization that needs access to the storage task. To learn how to assign an Azure role, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.yml).

To give users or applications access to the storage task, choose an Azure Built-in or custom role that has the permission necessary to edit the read or edit task. If you prefer to use a custom role, make sure that your role contains the RBAC actions necessary to read or edit the task. Use the following table as a guide.

| Permission level | Azure built-in role | RBAC actions for custom roles |
|--|--|--|
| List and read storage tasks | `Contributor` | `Microsoft.StorageActions/storageTasks/read` |
| Create and update storage tasks | `Contributor` | `Microsoft.StorageActions/storageTasks/write` |
| Delete storage tasks | `Contributor` | `Microsoft.StorageActions/storageTasks/delete` |

## Permission to assign a task

A task _assignment_ identifies a storage account and a subset of objects in that account that the storage task will target. An assignment also defines when the task runs and where execution reports are stored. For step-by-step guidance, see [Create and manage a Storage task assignment](storage-task-assignment-create.md).

To create an assignment, your identity must be assigned a custom role that contains the following RBAC actions:

- The `Microsot.Authorization.roleAssignments/write` action.

- All of the RBAC actions that are available in the `Microsoft.Storage/StorageAccounts` set of RBAC action.

To learn how to create a custom role, see [Azure custom roles](../../role-based-access-control/custom-roles.md#steps-to-create-a-custom-role).

## Permission for a task to perform operations

As you create an assignment, you must choose an Azure Built-in or custom role that has the permission necessary to perform the specified operations on the target storage account or storage account container. You can choose only roles that are assigned to your user identity. If you prefer to use a custom role, you must make sure that your role contains the RBAC actions necessary to perform the operations.

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