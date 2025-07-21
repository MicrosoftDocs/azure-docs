---
title: Storage task assignment
titleSuffix: Azure Storage Actions
description: Learn storage task assignments. An assignment applies a storage task to the data in a storage account.
services: storage
author: normesta

ms.service: azure-storage-actions
ms.topic: conceptual
ms.date: 05/05/2025
ms.author: normesta

---

# Storage task assignment

To use a storage task, you must create a _storage task assignment_. The assignment is saved as part of the storage account resource instance, and defines among other settings, a subset of objects to target, when and how often a task runs against those objects, and where the execution reports are stored. 

To create an assignment, your identity must be assigned the appropriate Azure built-in role or a custom role with the appropriate RBAC actions. See [Azure roles required to assign tasks](storage-task-authorization-roles-assign.md). To learn how to create a storage task assignment, see [Create and manage a storage task assignment](storage-task-assignment-create.md). 

## Assignment settings

The following table describes the configuration settings of a storage task assignment. 

> [!NOTE]
> The names that appear in the following table appear in the **Add Assignment** page of the Azure portal. If plan to create an assignment by using REST, an SDK, PowerShell, or Azure CLI, see the appropriate reference content set to obtain the names of specific properties used to configure each setting.

| Setting | Required or optional | Description |
|--|--|--|
| Subscription | Required | The subscription of the storage account that you want to add to this assignment. |
| Storage account name | Required | The storage account that you want to add to this assignment. You must be an owner of the storage account. This field appears only if you create the assignment in the context of a storage task.|
| Storage task name | Required | The storage task to which you would like to assign your storage account. This field appears only if you create the assignment in the context of a storage account.|  
| Storage task assignment name | Required | The name of the assignment. Assignment names must be between 2 and 62 characters in length and might contain only letters and numbers. |
| Filter by | Required | Option to either filter objects by using a prefix or to run the task against the entire storage account. |
| Include blob prefixes | Optional | The string prefix that is used to narrow the scope of blobs that are evaluated by the task. This field is required only if you choose to filter by using a blob prefix. |
| Exclude blob prefixes | Optional | A string prefix that is used to exclude blobs that are evaluated by the task.  |
| Run frequency | Required | Option to either run the task one time or multiple times. | 
| Start from | Required | The date and time to begin running the task. Applicable only when scheduling a task to run multiple times. |
| End by | Required | The date and time stop running the task. Applicable only when scheduling a task to run multiple times. |
| Repeat very (in days) | Required | The interval in days between each run. Applicable only when scheduling a task to run multiple times. |
| Report export container | Required | The container where task execution reports are stored. |

## Storage task authorization

As part of the assignment process, you'll assign a role to the managed identity associated with the storage task. By default, a system-assigned managed identity is created when the storage task is provisioned. However, the user that creates the storage task can optionally associate a user-assigned managed identity with the storage task. The type of managed identity that is associated with the storage task can't be changed after the storage task is provisioned.

When assigning a role, you must choose an Azure built-in or custom role that has the permission necessary to perform the operations defined in a storage task upon the target storage account. See [Permission for a task to perform operations](storage-task-authorization-roles-assign.md#permission-for-a-task-to-perform-operations).

After you save the assignment, the managed identity is validated to ensure that has the correct permissions to perform the tasks defined in the storage task. If you use the Azure portal to create the assignment, this validation step also occurs after you assign the role to the managed identity.

## Network access to storage accounts

You must grant access to trusted Azure services in the network settings of each target storage account. To learn more, see [Grant access to trusted Azure services](../../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services).

## See also

- [Storage task operations](storage-task-operations.md)
- [Define conditions and operations](storage-task-conditions-operations-edit.md)