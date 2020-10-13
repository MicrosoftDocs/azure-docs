---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 07/06/2020
ms.author: tamram
ms.custom: "include file"
---

Azure provides the following Azure built-in roles for authorizing access to blob and queue data using Azure AD and OAuth:

- [Storage Blob Data Owner](../articles/role-based-access-control/built-in-roles.md#storage-blob-data-owner): Use to set ownership and manage POSIX access control for Azure Data Lake Storage Gen2. For more information, see [Access control in Azure Data Lake Storage Gen2](../articles/storage/blobs/data-lake-storage-access-control.md).
- [Storage Blob Data Contributor](../articles/role-based-access-control/built-in-roles.md#storage-blob-data-contributor): Use to grant read/write/delete permissions to Blob storage resources.
- [Storage Blob Data Reader](../articles/role-based-access-control/built-in-roles.md#storage-blob-data-reader): Use to grant read-only permissions to Blob storage resources.
- [Storage Blob Delegator](../articles/role-based-access-control/built-in-roles.md#storage-blob-delegator): Get a user delegation key to use to create a shared access signature that is signed with Azure AD credentials for a container or blob.
- [Storage Queue Data Contributor](../articles/role-based-access-control/built-in-roles.md#storage-queue-data-contributor): Use to grant read/write/delete permissions to Azure queues.
- [Storage Queue Data Reader](../articles/role-based-access-control/built-in-roles.md#storage-queue-data-reader): Use to grant read-only permissions to Azure queues.
- [Storage Queue Data Message Processor](../articles/role-based-access-control/built-in-roles.md#storage-queue-data-message-processor): Use to grant peek, retrieve, and delete permissions to messages in Azure Storage queues.
- [Storage Queue Data Message Sender](../articles/role-based-access-control/built-in-roles.md#storage-queue-data-message-sender): Use to grant add permissions to messages in Azure Storage queues.

Only roles explicitly defined for data access permit a security principal to access blob or queue data. Built-in roles such as **Owner**, **Contributor**, and **Storage Account Contributor** permit a security principal to manage a storage account, but do not provide access to the blob or queue data within that account via Azure AD. However, if a role includes the **Microsoft.Storage/storageAccounts/listKeys/action**, then a user to whom that role is assigned can access data in the storage account via Shared Key authorization with the account access keys. For more information, see [Use the Azure portal to access blob or queue data](../articles/storage/blobs/authorize-blob-access-portal.md).

For detailed information about Azure built-in roles for Azure Storage for both the data services and the management service, see the **Storage** section in [Azure built-in roles for Azure RBAC](../articles/role-based-access-control/built-in-roles.md#storage). Additionally, for information about the different types of roles that provide permissions in Azure, see [Classic subscription administrator roles, Azure roles, and Azure AD roles](../articles/role-based-access-control/rbac-and-directory-admin-roles.md).

> [!IMPORTANT]
> Azure role assignments may take up to five minutes to propagate.
