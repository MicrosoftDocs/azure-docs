---
title: Storage task authorization
titleSuffix: Azure Storage
description: Description of Azure Storage Task authorization goes here.
services: storage
author: normesta

ms.service: storage-tasks
ms.topic: conceptual
ms.date: 05/10/2023
ms.author: normesta

---

# Storage task authorization

Put something here.

> [!IMPORTANT]
> Storage Tasks is currently in PREVIEW and is available in the following regions: \<List regions here\>.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> To enroll, see \<sign-up form link here\>.

You can grant the authorization to read and modify storage tasks. Before you can assign a task to a storage account, you'll need to ensure that the user assigning the task or the system identity of the task is assigned the correct permissions to perform operations on the account.

## Granting a security principal permission to read, edit, or delete a storage task

To give users or applications access to the storage task, choose an Azure Built-in or custom role that has the permission necessary to edit the read or edit task. If you prefer to use a custom role, make sure that your role contains the RBAC actions necessary to read or edit the task. To learn how to assign an Azure role, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

This section describes the least privileged built-in Azure role as well as the RBAC actions required to read, update, or delete a storage task.

### List and read storage tasks

To list or read a storage task, the Azure AD security principal must be assigned the `put role here` Azure Built-in role.

If you prefer to create a custom role, and then assign that role to the security principal, then that role must contain the Microsoft.Storage/storageAccounts/storageTasks/read RBAC action.

### Create and update storage tasks

To list create and update a storage task, the Azure AD security principal must be assigned the `put role here` Azure Built-in role.

If you prefer to create a custom role, and then assign that role to the security principal, then that role must contain the Microsoft.Storage/storageAccounts/storageTasks/write RBAC action.

### Delete storage tasks

To delete a storage task, the Azure AD security principal must be assigned the `put role here` Azure Built-in role.

If you prefer to create a custom role, and then assign that role to the security principal, then that role must contain the Microsoft.Storage/storageAccounts/storageTasks/delete RBAC action.

To assign a role to the storage task, `put guidance here`.

## Granting a storage task permission to execute operations on a storage account

When you create a task assignment, choose an Azure Built-in or custom role that has the permission necessary to perform the tasks that you've defined against the target storage account. If you prefer to use a custom role, make sure that your role contains the RBAC actions necessary to perform the tasks. This section describes the least privileged built-in Azure role as well as the RBAC actions required by each operation if you choose to create a custom role.

To learn how to assign an Azure role during task assignment, see [Create and manage a storage task assignment](storage-task-assignment-create.md).

### SetBlobTier

The SetBlobTier operation requires the [Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) built-in role.

If you prefer to create a custom role, then that role must contain the following RBAC actions:

- Microsoft.Storage/storageAccounts/blobServices/read

- Microsoft.Storage/storageAccounts/blobServices/write

- Microsoft.Storage/storageAccounts/blobServices/containers/write

- Microsoft.Storage/storageAccounts/blobServices/containers/read

- Microsoft.Storage/storageAccounts/blobServices/containers/read

- Microsoft.Storage/storageAccounts/blobServices/containers/write

- Microsoft.Storage/storageAccounts/blobServices/containers/delete

### SetBlobTags

The SetBlobTags operation requires the [Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) built-in role.

If you prefer to create a custom role, then that role must contain the Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write RBAC action.

### SetBlobImmutabilityPolicy

The SetBlobImmutabilityPolicy operation requires the [Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) built-in role.

If you prefer to create a custom role, then that role must contain the following RBAC actions:

- Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/write

- Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/read

- Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/delete

- Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/extend/action

- Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/lock/action

### SetBlobLegalHold

The SetBlobLegalHold operation requires the [Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) built-in role.

If you prefer to create a custom role, then that role must contain the following RBAC actions:

- Microsoft.Storage/storageAccounts/blobServices/containers/setLegalHold/action

- Microsoft.Storage/storageAccounts/blobServices/containers/clearLegalHold/action

### DeleteBlob

The DeleteBlob operation requires the [Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) built-in role.

If you prefer to create a custom role, then that role must contain the Microsoft.Storage/storageAccounts/blobServices/containers/delete RBAC action.

### UndeleteBlob

The UndeleteBlob operation requires the [Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) built-in role.

If you prefer to create a custom role, then that role must contain the following RBAC actions:

- Microsoft.Storage/storageAccounts/blobServices/containers/write

- Microsoft.Storage/storageAccounts/blobServices/containers/delete  

To assign a role to the storage task, `put guidance here`.

## See also

- [Create and manage an assignment](storage-task-assignment-create.md)