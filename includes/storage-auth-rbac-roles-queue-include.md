---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 06/07/2021
ms.author: tamram
ms.custom: "include file"
---

Azure RBAC provides a number of built-in roles for authorizing access to queue data using Azure AD and OAuth. Some examples of roles that provide permissions to data resources in Azure Storage include:

- [Storage Queue Data Contributor](../articles/role-based-access-control/built-in-roles.md#storage-queue-data-contributor): Use to grant read/write/delete permissions to Azure queues.
- [Storage Queue Data Reader](../articles/role-based-access-control/built-in-roles.md#storage-queue-data-reader): Use to grant read-only permissions to Azure queues.
- [Storage Queue Data Message Processor](../articles/role-based-access-control/built-in-roles.md#storage-queue-data-message-processor): Use to grant peek, retrieve, and delete permissions to messages in Azure Storage queues.
- [Storage Queue Data Message Sender](../articles/role-based-access-control/built-in-roles.md#storage-queue-data-message-sender): Use to grant add permissions to messages in Azure Storage queues.

To learn how to list Azure RBAC roles and their permissions, see [List Azure role definitions](../articles/role-based-access-control/role-definitions-list.md).

Only roles explicitly defined for data access permit a security principal to access queue data. Built-in roles such as **Owner**, **Contributor**, and **Storage Account Contributor** permit a security principal to manage a storage account, but do not provide access to the queue data within that account via Azure AD. However, if a role includes **Microsoft.Storage/storageAccounts/listKeys/action**, then a user to whom that role is assigned can access data in the storage account via Shared Key authorization with the account access keys. For more information, see [Choose how to authorize access to blob data in the Azure portal](../articles/storage/queues/authorize-data-operations-portal.md).

For detailed information about Azure built-in roles for Azure Storage for both the data services and the management service, see the **Storage** section in [Azure built-in roles for Azure RBAC](../articles/role-based-access-control/built-in-roles.md#storage). Additionally, for information about the different types of roles that provide permissions in Azure, see [Classic subscription administrator roles, Azure roles, and Azure AD roles](../articles/role-based-access-control/rbac-and-directory-admin-roles.md).

> [!IMPORTANT]
> Azure role assignments may take up to 30 minutes to propagate.
