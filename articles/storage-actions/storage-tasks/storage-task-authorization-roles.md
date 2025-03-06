---
title: Azure roles for storage tasks
titleSuffix: Azure Storage Actions
description: Learn about the least privileged built-in Azure roles or RBAC actions required to read, update, delete and assign a storage task.
services: storage
author: normesta

ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: conceptual
ms.date: 01/17/2024
ms.author: normesta

---

# Azure roles for storage tasks

This article describes the least privileged built-in Azure roles or RBAC actions required to read, update, delete a storage task or to view task assignments.

## Permission to manage a storage task

You must assign a role to any security principal in your organization that needs access to the storage task. To learn how to assign an Azure role, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.yml).

To give users or applications access to the storage task, choose an Azure built-in or custom role that has the minimum permission necessary to edit the read or edit task. If you prefer to use a custom role, make sure that your role contains the RBAC actions necessary to read or edit the task. Use the following table as a guide.

| Permission level | Azure built-in role | RBAC actions for custom roles |
|--|--|--|
| List and read storage tasks | `Storage Actions Contributor` | `Microsoft.StorageActions/storageTasks/read` |
| Create and update storage tasks | `Storage Actions Contributor` | `Microsoft.StorageActions/storageTasks/write` |
| Delete storage tasks | `Storage Actions Contributor` | `Microsoft.StorageActions/storageTasks/delete` |
| List storage task assignments | `Storage Actions Contributor` | `Microsoft.StorageActions/storageTasks/storageTaskAssignments/read` |
| List storage task run reports | `Storage Actions Contributor` | `Microsoft.StorageActions/storageTasks/reports/read` |
| Preview storage task conditions | `Storage Actions Contributor` | `Microsoft.StorageActions/locations/previewActions/action` |
| Move a storage task to another resource group | `Storage Actions Contributor` | `Microsoft.Resources/subscriptions/resourceGroups/moveResources/action`<br>`Microsoft.Resources/subscriptions/resourceGroups/write` |

## See also

- [Azure roles required to assign tasks](storage-task-authorization-roles-assign.md)
