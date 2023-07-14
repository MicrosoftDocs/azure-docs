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

This article describes the least privileged built-in Azure roles or RBAC actions required to read, update, or delete a storage task.

> [!IMPORTANT]
> Storage Tasks is currently in PREVIEW and is available in the following regions: \<List regions here\>.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> To enroll, see \<sign-up form link here\>.

You must assign a role to any security principal in your organization needs access to the storage task. For example, a task can be assigned to a storage account only by the owner of that account. Therefore, to add the assignment, the proper role must be assigned to that security principal. To learn how to assign an Azure role, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

## Azure roles and RBAC actions

To give users or applications access to the storage task, choose an Azure Built-in or custom role that has the permission necessary to edit the read or edit task. If you prefer to use a custom role, make sure that your role contains the RBAC actions necessary to read or edit the task. Use the following table as a guide.

| Permission level | Azure built-in role | RBAC actions for custom roles |
|--|--|--|
| List and read storage tasks | `put role here` | `Microsoft.Storage/storageAccounts/storageTasks/read` |
| Create and update storage tasks | `put role here` | `Microsoft.Storage/storageAccounts/storageTasks/write` |
| Delete storage tasks | `put role here` | `Microsoft.Storage/storageAccounts/storageTasks/delete` |

## See also

- [Create and manage an assignment](storage-task-assignment-create.md)