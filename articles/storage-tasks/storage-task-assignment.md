---
title: Storage Task assignment
titleSuffix: Azure Storage
description: Description of Azure Storage Task assignment goes here.
services: storage
author: normesta

ms.service: storage-tasks
ms.topic: conceptual
ms.date: 05/10/2023
ms.author: normesta

---

# Storage Task assignment

Put something here.

> [!IMPORTANT]
> Storage Tasks is currently in PREVIEW and is available in the following regions: \<List regions here\>.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> To enroll, see \<sign-up form link here\>.

## Anatomy of a Storage Task assignment

Describe the components - Task, managed identity role assignment, storage account targets, execution context

## Role assignments required to perform each task

When you create a task assignment, choose an Azure Built-in or custom role that has the permission necessary to perform the tasks that you've defined. 

The following table shows the least privileged built-in Azure role required to perform each task. If you prefer to use a custom role, choose a role which gives permission to the Azure RBAC action associated with the task.

| Task | Azure RBAC actions | Least privileged built-in Azure role |
|--|--|
| SetBlobTier | [Microsoft.Storage/storageAccounts/blobServices/write](../role-based-access-control/resource-provider-operations.md) | [Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) |

## See also

- [Quickstart: Create, assign, and run a Storage Task by using the Azure portal](storage-task-quickstart-portal.md)
- [Known issues with Azure Storage Tasks](storage-task-known-issues.md)
