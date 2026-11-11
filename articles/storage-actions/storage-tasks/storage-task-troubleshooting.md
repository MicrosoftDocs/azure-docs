---
title: Storage task troubleshooting
titleSuffix: Azure Storage Actions
description: Learn about issues that you might encounter when you use storage tasks along with recommended workarounds.
services: storage
author: normesta

ms.service: azure-storage-actions
ms.topic: troubleshooting-general
ms.date: 10/30/2026
ms.author: normesta

---

# Storage task troubleshooting

This article describes common issues you might encounter when using Storage Actions.

## Silent failures due to missing role assignments and trusted access

Two common causes of silent failures where a task assignment doesn't appear to run are that the managed identity of the Storage Actions task definition is missing or has insufficient role assignments, or trusted access on the storage account is disabled.

To address these issues:
- Confirm that the Storage Actions task managed identity has one of the following roles assigned to it on the storage account: _Storage Blob Data Operator_, _Storage Blob Data Owner_, or a custom role with similar permissions. See [Permissions for a task to perform operations](storage-task-authorization-roles-assign.md#permissions-for-a-task-to-perform-operations).
- Ensure that trusted Microsoft services have network access to the storage account. See [Grant access to trusted Azure services](../../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services).

## Permission-related errors when managing storage tasks or task assignments

Operations such as creating and editing storage tasks, adding or removing task assignments, and stopping task assignment runs require the _Storage Actions Contributor_ role on the subscription or resource group. If the task assignment is on a storage account that's in a different subscription than the Storage Actions resource, you might need this role assigned for both resources. See [Azure roles for storage task](storage-task-authorization-roles.md) and [Azure roles required to assign tasks](storage-task-authorization-roles-assign.md).

## Resource limit errors

These errors arise when resource limits are exceeded during configuration or task assignment execution. Monitor and adjust the scope of the task assignment accordingly to prevent these errors. See [Resource limits](storage-task-known-issues.md#resource-limits).

## See also

- [Storage task operations](storage-task-operations.md)
- [Define conditions and operations](storage-task-conditions-operations-edit.md)
