---
title: Storage task assignment
titleSuffix: Azure Storage Actions
description: Conceptual article about storage task assignment
services: storage
author: normesta

ms.service: azure-storage-actions
ms.topic: conceptual
ms.date: 01/31/2025
ms.author: normesta

---

# Storage task assignment

An _assignment_ identifies a storage account and a subset of objects in that account that the task will target. An assignment also defines when the task runs and where execution reports are stored. 
Why do you create one.

An assignment identifies a storage account and a subset of objects to target in that account. It also specifies when the task runs and where execution reports are stored.

You can assign a storage task to any storage account in which your identity is assigned the [Storage Blob Data Owner](../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role. As you create an assignment, you'll select a storage account, and assign a role to the system-assigned managed identity of the task. That identity is created for you automatically when the task is provisioned. The role that you assign that identity must enable it to perform the operations that are defined in the task.

A storage task can be assigned to a storage account only by an owner of that account. Therefore, if the task that you define is useful to an owner of another storage account, you must grant that user access to the storage task. Then, that user can assign your task to their storage account. You can grant a user access to your storage task by assigning an Azure role to their user identity.


- [Azure roles for storage task assignments](storage-tasks/storage-task-authorization-roles.md)

## Flow of tasks

<Diagram goes here>

- Admin makes sure that they have the roles required to create the assignment
- Admin makes sure that they have the proper perms in the user assigned identity of the task. Not an issue if system identity is used.
- Admin makes sure that they have owner of the target storage accounts
- Admin gives the user assigned or system assigned identity access to the storage account network.
- Admin fills out the fields of the assignment. 
- Admin previews while doing an assignment.
- Admin saves the assignment
- Admin enables the assignment.

## Components of an assignment

Get the REST API names for each of these fields include table with restrictions / notes and descriptions.

- Subscription
- Storage account
- Assignment name (name requirements)
- Role
- Filter by
- Include blob prefixes
- Exclude blob prefixes
- Run frequency
- Start from
- End by
- Repeat every
- Report export container
 
## Identities and roles

You can assign a storage task to any storage account in which your identity is assigned the [Storage Blob Data Owner](../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role. As you create an assignment, you'll select a storage account, and assign a role to the system-assigned managed identity of the task or the user assigned managed identity that was chosen at task creation time. 

System-assigned

That identity is created for you automatically when the task is provisioned. The role that you assign that identity must enable it to perform the operations that are defined in the task.

User assigned

You can assign only one user-assigned managed identity to the task in the current release. 

Given the new MI is created on the fly, the owner of the MI is the user who is authoring the Storage Task. What this means is that the assigner of the Storage Task must have access to the MI to use it against a target Storage Account they own. 

All managed identities

Put this somewhere - after the assignment is created, the managed identity is validated to ensure that it has the correct permissions to perform the tasks defined in the condition.1.	Validations are based on what operations are defined in the Task definition. This is validated both when you assign the role and when the assignment is committed. 

A storage task can be assigned to a storage account only by an owner of that account. Therefore, if the task that you define is useful to an owner of another storage account, you must grant that user access to the storage task. Then, that user can assign your task to their storage account. You can grant a user access to your storage task by assigning an Azure role to their user identity.

See these articles to learn how to assign a storage task:

- [Create and manage a storage task assignment](storage-tasks/storage-task-assignment-create.md)
- [Azure roles for storage task assignments](storage-tasks/storage-task-authorization-roles.md)

### Use recurring schedules for assignments

To continuously manage your data estate effectively, you can schedule recurring executions for task assignments on a daily or weekly cadence. Regular data management using operations such as moving blobs to cooler tiers or deleting obsolete data prevents storage accounts from becoming bloated and maintain costs. For use cases related to data protection, daily or weekly ensure that blobs are applied with necessary immutability or legal holds, preventing accidental tampering and ensuring compliance with immutability requirements.

### Single run usage 

For Storage Actions that need to be executed only once, such as initializing blob index tags or a large-scale blob reorganization, it is important to carefully plan and monitor the execution. Such ‘single run  ’ task assignments are particularly useful if you want to adopt new policies for data management and want to apply this to your existing data estate. For example, when organizing blobs by applying initial blob index tags or blob metadata, a single run task   ensures that all existing data is appropriately tagged. These task assignments can be combined this with other Storage Actions that are designed to maintain the data estate in conformance with the policy. Single run task assignments can also be useful for resetting state, e.g., to undelete soft-deleted objects.
You should always ensure that the task conditions are authored correctly and validated using the preview feature to avoid unintended consequences. Monitoring the task's progress and reviewing reports post-execution can help identify and rectify any issues that arise during the operation.

## Enabling assignments

Something here.

## Cancelling Task Assignment Executions 

If necessary, you can cancel a task assignment execution that is queued or in progress. In scenarios where a task assignment execution needs to be cancelled, it is essential to understand the implications. Cancelling a task run may leave some operations incomplete, which could lead to data inconsistencies. There are several reasons why a task run may need to be cancelled:
•	Misconfiguration: If a task is configured incorrectly, continuing the task may cause unintended changes or errors. Cancelling the task allows for reconfiguration and correction before restarting.
•	Concurrency Limits: Currently, only one task execution is supported on a storage account at a time. If another task with higher priority needs to be executed, the current task may need to be cancelled to make way for the new task.
•	Changed Requirements: The customer may decide that the task run is no longer necessary due to changed requirements or timing. In such cases, cancelling the task prevents the execution of unnecessary operations.
After cancellation, it is advisable to monitor the task progress and only cancel if absolutely necessary. Review the task report to identify any incomplete operations and take corrective actions if needed.

## Assignment scale limits:

-	A maximum of 50 enabled Task assignments per storage account
-	A maximum of 10,000 total Task assignments (including disabled) per subscription
-	A maximum of 5,000 task definitions per subscription
-	A maximum of 5,000 assignments per task definition
-	The capability to process 90 billion FNS blobs and 7 billion HNS blobs within 14 days

## See also

- [Storage task operations](storage-task-operations.md)
- [Define conditions and operations](storage-task-conditions-operations-edit.md)