---
title: Azure roles for storage task assignments
titleSuffix: Azure Storage Actions
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

As part of creating an assignment, you use a custom role that has the permission necessary to perform the specified operations on the target storage account. You can choose only roles that are assigned to your user identity. A custom role is required in the preview release Azure Storage Actions. To learn how to create a custom role, see [Azure custom roles](../../role-based-access-control/custom-roles#steps-to-create-a-custom-role).

Make sure that your role contains the RBAC actions necessary to perform the operations. This article describes the RBAC actions required by each operation that a storage task can perform.

> [!IMPORTANT]
> Azure Storage Actions is currently in PREVIEW and is available these [regions](../overview.md#supported-regions).
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## RBAC actions

Create a custom role that contains the following RBAC actions:

- The `Microsot.Authorization.roleAssignments/write` action.

- All of the RBAC actions that are available in the `Microsoft.Storage/StorageAccounts` set of RBAC actions.

- The RBAC actions required by each operation that your task will perform. 

    The following table shows he RBAC actions required by each operation.

    | Permission | RBAC actions for a custom role |
    |---|---|
    | SetBlobTier | Microsoft.Storage/storageAccounts/blobServices/read<br>Microsoft.Storage/storageAccounts/blobServices/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/delete |
    | SetBlobExpiry | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write |
    | SetBlobTags | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write |
    | SetBlobImmutabilityPolicy | Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/read<br>Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/delete<br>Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/extend/action<br>Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/lock/action |
    | SetBlobLegalHold | Microsoft.Storage/storageAccounts/blobServices/containers/setLegalHold/action<br>Microsoft.Storage/storageAccounts/blobServices/containers/clearLegalHold/action |
    | DeleteBlob | Microsoft.Storage/storageAccounts/blobServices/containers/delete |
    | UndeleteBlob | Microsoft.Storage/storageAccounts/blobServices/containers/write<br>Microsoft.Storage/storageAccounts/blobServices/containers/delete |

## See also

- [Create and manage an assignment](storage-task-assignment-create.md)