---
title: Azure roles required to assign storage tasks
titleSuffix: Azure Storage Actions
description: Learn about the roles required to create a storage task assignment and the roles required by the managed identity of a storage task to operate on a storage account.
services: storage
author: normesta
ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: reference
ms.date: 05/05/2025
ms.author: normesta

---

# Azure roles required to assign tasks

This article describes the least privileged built-in Azure roles or RBAC actions required to manage a storage task assignment.

## Permission to manage storage task assignments

To create an assignment, your identity must be assigned either the **Storage Actions Task Assignment Contributor** as built-in role or a custom role that contains the following RBAC actions:

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

The recommended built-in role is **Storage Actions Blob Data Operator**. This is a purpose-built role for the Storage Actions managed identity. It grants exactly the data-plane permissions required to execute all operations supported by Storage Actions today — including tier changes, tags, expiry, delete, undelete, immutability, and legal hold - without granting broader access to your data.

The **Storage Actions Blob Data Operator** role grants the following permissions:

| Permission | Type | RBAC action |
| --- | --- | --- |
| List containers; read and create containers (required for operations such as `SetBlobImmutabilityPolicy` and `SetBlobLegalHold`) | Action | `Microsoft.Storage/storageAccounts/blobServices/containers/read`, `Microsoft.Storage/storageAccounts/blobServices/containers/write` |
| Read blob content and properties | Data action | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` |
| Modify blobs (tier, expiry, properties) | Data action | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` |
| Delete blobs | Data action | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete` |
| Add (create) new blobs | Data action | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action` |
| Read and write blob index tags | Data action | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read`, `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` |
| Perform privileged blob operations (such as undelete) | Data action | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action` |
| Set immutability policies and legal holds | Data action | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/immutableStorage/runAsSuperUser/action` |

> [!TIP]  
> **Storage Actions Blob Data Operator** is the recommended role for the storage task's managed identity. The [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role also covers all operations performed by Storage Actions and remains supported, but it grants broader permissions than Storage Actions requires. Prefer **Storage Actions Blob Data Operator** for new assignments.

If you prefer to use a custom role for the storage task's managed identity, you must make sure that your role contains the RBAC actions necessary to perform the operations defined in the task. The following table maps each Storage Actions operation to the RBAC actions a custom role must include.

> [!NOTE]  
> For most customers, the **Storage Actions Blob Data Operator** built-in role described above is the simplest path and is preferred. The per-operation table below is intended for organizations that need to compose a tighter custom role than the built-in role provides.

| Permission | RBAC actions for a custom role |
| --- | --- |
| SetBlobTier | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/readMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/writeMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/tags/readMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write |
| SetBlobExpiry | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/readMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/writeMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/tags/readMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write |
| SetBlobTags | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/readMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/writeMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/tags/readMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write |
| SetBlobImmutabilityPolicy | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/readMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/writeMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/tags/readMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/tags/writeMicrosoft.Storage/storageAccounts/blobServices/containers/write |
| SetBlobLegalHold | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/readMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/writeMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/tags/readMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/tags/writeMicrosoft.Storage/storageAccounts/blobServices/containers/write |
| DeleteBlob | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/readMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/writeMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/tags/readMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/tags/writeMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/delete |
| UndeleteBlob | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/readMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/writeMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/tags/readMicrosoft.Storage/storageAccounts/blobServices/containers/blobs/tags/writeMicrosoft.Storage/storageAccounts/blobServices/containers/write |


## See also

- [Create and manage an assignment](storage-task-assignment-create.md)
