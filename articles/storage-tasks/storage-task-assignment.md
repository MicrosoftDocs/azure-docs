---
title: Storage Task assignments
titleSuffix: Azure Storage
description: Description of Azure Storage Task assignment goes here.
services: storage
author: normesta

ms.service: storage-tasks
ms.topic: conceptual
ms.date: 05/10/2023
ms.author: normesta
---

# Storage Task assignments

An _assignment_ identifies a storage account and a subset of objects in that account that the task will target. An assignment also defines when the task runs and where execution reports are stored.

> [!IMPORTANT]
> Storage Tasks is currently in PREVIEW and is available in the following regions: \<List regions here\>.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> To enroll, see \<sign-up form link here\>.

## Create an assignment

Create an assignment by opening the **Add assignment** pane. You can use the fields in that pane to specify the target storage account, apply a filter to target a subset of blobs, configure when the task runs and where execution reports should be stored.

For step-by-step guidance, see [Create and manage a Storage Task assignment](storage-task-assignment-create.md).

## Assignment authorization

When you create a task assignment, choose an Azure Built-in or custom role that has the permission necessary to perform the tasks that you've defined against the target storage account. If you prefer to use a custom role, make sure that your role contains the RBAC actions necessary to perform the tasks. This section describes the least privileged built-in Azure role as well as the RBAC actions required by each operation if you choose to create a custom role.

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

## See also

- [Create and manage an assignment](storage-task-assignment-create.md)