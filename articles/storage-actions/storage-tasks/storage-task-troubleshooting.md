---
title: Storage task troubleshooting
titleSuffix: Azure Storage Actions
description: Learn about issues that you might encounter when you use storage tasks along with recommended workarounds.
services: storage
author: normesta

ms.service: azure-storage-actions
ms.topic: conceptual
ms.date: 01/31/2025
ms.author: normesta

---

# Storage task troubleshooting

These article describes issues that you might encounter when you use storage tasks.

## Permission-related errors

These errors occur when the necessary permissions are not granted to create the task or task assignment resource, or for the task assignment's managed identity to perform the defined operations. It is essential to review and update the permissions to ensure that the tasks have the required permissions to execute successfully. See [Azure roles for storage task](storage-task-authorization-roles.md) and [Azure roles required to assign tasks](storage-task-authorization-roles-assign.md).

## Scale limits exceeded errors

These errors arise when the task assignments and task execution operations exceed the predefined scale limits. It is important to monitor and adjust the scope of the task assignment accordingly to prevent such errors. See [Scale limits](storage-tasks/storage-task-known-issues.md#scale-limits).

## Internal errors

These are unforeseen errors that occur within the system. Diagnosing internal errors often requires a deeper dive into the system logs and may necessitate contacting support for resolution.

## See also

- [Storage task operations](storage-task-operations.md)
- [Define conditions and operations](storage-task-conditions-operations-edit.md)