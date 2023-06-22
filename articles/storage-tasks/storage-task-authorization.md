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

## Managed identities

Something here about associating an identity with the task and what it is for.

## Role assignment

Something here about assigning roles to the identity.

## Role assignments

When you create a task assignment, choose an Azure Built-in or custom role that has the permission necessary to perform the tasks that you've defined. 

The following table shows the least privileged built-in Azure role required to perform each task. If you prefer to use a custom role, choose a role which gives permission to the Azure RBAC action associated with the task.

| Task | Azure RBAC actions | Least privileged built-in Azure role |
|--|--|
| SetBlobTier | [Microsoft.Storage/storageAccounts/blobServices/write](../role-based-access-control/resource-provider-operations.md) | [Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) |

## See also

- [Create and manage an assignment](storage-task-assignment-create.md)