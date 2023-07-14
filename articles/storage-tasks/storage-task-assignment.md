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

## Creating an assignment

Before you can create an assignment, your identity must be assigned an Azure role that gives you access to the storage task. See [Storage task authorization](storage-task-authorization.md).

After you've been granted permission to storage task, you can create an assignment by opening the **Add assignment** pane of the task. Use the fields in that pane to configure the following settings:

- The target storage account. You must be an owner of that account

- The Azure role that you would like to assign to the system-assigned managed identity of the task

  You can choose only those roles which are assigned to your user identity. You can't give the task access to a resource that you don't already have.

- A filter that targets a subset of the blobs in an account

- When and how often the storage task runs

- The location where the execution reports will be stored

For step-by-step guidance, see [Create and manage a Storage task assignment](storage-task-assignment-create.md).

## Assignment authorization

As part of creating an assignment, you must choose an Azure Built-in or custom role that has the permission necessary to perform the operations specified in the task on the storage account that you specify in the assignment. You can choose only roles that are assigned to your user identity. If you prefer to use a custom role, make sure that your role contains the RBAC actions necessary to perform the operations. The following table shows the least privileged built-in Azure role as well as the RBAC actions required by each operation.

| Permission | Built-in role | RBAC actions for a custom role |
|---|---|---|
| SetBlobTier | [Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor)| Microsoft.Storage/storageAccounts/blobServices/read<br>Microsoft.Storage/storageAccounts/blobServices/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/delete |
| SetBlobTags | [Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write |
| SetBlobImmutabilityPolicy | [Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) | Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/delete<br>Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/extend/action<br>Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/lock/action |
| SetBlobLegalHold | [Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) | Microsoft.Storage/storageAccounts/blobServices/containers/setLegalHold/action<br>Microsoft.Storage/storageAccounts/blobServices/containers/clearLegalHold/action |
| DeleteBlob | [Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) | Microsoft.Storage/storageAccounts/blobServices/containers/delete |
| UndeleteBlob | [Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) | Microsoft.Storage/storageAccounts/blobServices/containers/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/delete |

## See also

- [Create and manage an assignment](storage-task-assignment-create.md)