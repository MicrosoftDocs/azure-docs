---
title: Azure roles for storage task assignments
titleSuffix: Azure Storage Tasks
description: Learn about the least privileged built-in Azure roles or RBAC actions required by each operation that a storage task can perform.
services: storage
author: normesta

ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: conceptual
ms.date: 05/10/2023
ms.author: normesta
---

# Azure roles for storage task assignments

An _assignment_ identifies a storage account and a subset of objects in that account that the storage task will target. An assignment also defines when the task runs and where execution reports are stored. For step-by-step guidance, see [Create and manage a Storage task assignment](storage-task-assignment-create.md).

As part of creating an assignment, you must choose an Azure Built-in or custom role that has the permission necessary to perform the specified operations on the target storage account. You can choose only roles that are assigned to your user identity. If you prefer to use a custom role, you must make sure that your role contains the RBAC actions necessary to perform the operations. This article describes the built-in Azure roles and RBAC actions required by each operation that a storage task can perform.

> [!IMPORTANT]
> Azure Storage Tasks is currently in PREVIEW and is available these [regions](overview.md#supported-regions).
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Built-in roles and RBAC actions

 The following table shows the least privileged built-in Azure role as well as the RBAC actions required by each operation.

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