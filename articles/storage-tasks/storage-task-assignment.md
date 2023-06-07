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

To create an assignment, see [Create and manage a Storage Task assignment](storage-task-assignment-create.md).

## Status

Enabled/disabled.

## Execution context

Something here about storage account targets, number of accounts supported and other constraints along with blob prefix and other details.

## Role assignments

When you create a task assignment, choose an Azure Built-in or custom role that has the permission necessary to perform the tasks that you've defined. 

The following table shows the least privileged built-in Azure role required to perform each task. If you prefer to use a custom role, choose a role which gives permission to the Azure RBAC action associated with the task.

| Task | Azure RBAC actions | Least privileged built-in Azure role |
|--|--|
| SetBlobTier | [Microsoft.Storage/storageAccounts/blobServices/write](../role-based-access-control/resource-provider-operations.md) | [Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) |

## Trigger

What sets it off - run now? on a schedule?

## Constraints

Put something here

## Execution reports

Put something here.

## Previewing the effect of conditions

(Use an include file to share this section with the conditions article)

Describe the experience and the benefit. 

It can be used to try things out. Then, you can debug issues. For example, tags value and count apply only to accounts that do not have a hierarchical namespace enabled.

Describe the experience and the benefit. 

It can be used to try things out. Then, you can debug issues. For example, tags value and count apply only to accounts that do not have a hierarchical namespace enabled.

## See also

- [Create and manage an assignment](storage-task-assignment-create.md)

