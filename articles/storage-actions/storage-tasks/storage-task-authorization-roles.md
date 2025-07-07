---
title: Azure roles for storage tasks
titleSuffix: Azure Storage Actions
description: Learn about the least privileged built-in Azure roles or RBAC actions required to read, update, delete, and assign a storage task.
services: storage
author: normesta

ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: conceptual
ms.date: 05/05/2025
ms.author: normesta

---

# Azure roles for storage tasks

This article describes the least privileged built-in Azure roles or RBAC actions required to read, update, or delete a storage task and to view task assignments.

## Permission to manage a storage task

You must assign a role to any security principal in your organization that needs access to the storage task. To learn how to assign an Azure role, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.yml).

While the **Contributor** role provides all of the permissions necessary to manage a storage task, the least privileged built-in role is the **Storage Actions Contributor** role.

 If you prefer to use a custom role, make sure that your role contains all of the necessary RBAC actions. Use the following table as a guide.

| Permission level | RBAC actions for custom roles |
|--|--|--|
| List and read storage tasks | Microsoft.StorageActions/storageTasks/read |
| Create and update storage tasks | Microsoft.StorageActions/storageTasks/write |
| Delete storage tasks | Microsoft.StorageActions/storageTasks/delete |
| List storage task assignments | Microsoft.StorageActions/storageTasks/storageTaskAssignments/read |
| List storage task run reports | Microsoft.StorageActions/storageTasks/reports/read |
| Preview storage task conditions | Microsoft.StorageActions/locations/previewActions/action |
| Move a storage task to another resource group | Microsoft.Resources/subscriptions/resourceGroups/moveResources/action<br>Microsoft.Resources/subscriptions/resourceGroups/write |

## See also

- [Azure roles required to assign tasks](storage-task-authorization-roles-assign.md)
