---
title: Storage task troubleshooting
titleSuffix: Azure Storage Actions
description: Learn about issues that you might encounter when you use storage tasks along with recommended workarounds.
services: storage
author: normesta

ms.service: azure-storage-actions
ms.topic: conceptual
ms.date: 05/05/2025
ms.author: normesta

---

# Storage task troubleshooting

This article describes issues that you might encounter when you use storage tasks.

## Permission-related errors

Permission-related errors occur when the necessary permissions aren't granted to create the task or task assignment resource, or for the task assignment's managed identity to perform the defined operations. It's essential to review and update the permissions to ensure that the tasks have the required permissions to execute successfully. See [Azure roles for storage task](storage-task-authorization-roles.md) and [Azure roles required to assign tasks](storage-task-authorization-roles-assign.md).

## Scale limits exceeded errors

Scale limits exceeded errors arise when the task assignments and task execution operations exceed the predefined scale limits. It's important to monitor and adjust the scope of the task assignment accordingly to prevent such errors. See [Scale limits](storage-task-known-issues.md#scale-limits).

## Internal errors

These are unforeseen errors that occur within the system. Diagnosing internal errors often requires a deeper dive into the system logs and might necessitate contacting support for resolution.

## See also

- [Storage task operations](storage-task-operations.md)
- [Define conditions and operations](storage-task-conditions-operations-edit.md)