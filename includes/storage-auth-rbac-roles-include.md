---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 03/21/2019
ms.author: tamram
ms.custom: "include file"
---

Azure provides the following built-in RBAC roles for authorizing access to blob and queue data using Azure AD and OAuth:

- [Storage Blob Data Owner](../articles/role-based-access-control/built-in-roles.md#storage-blob-data-owner): Use to set ownership and manage POSIX access control for Azure Data Lake Storage Gen2 (preview). For more information, see [Access control in Azure Data Lake Storage Gen2](../articles/storage/blobs/data-lake-storage-access-control.md).
- [Storage Blob Data Contributor](../articles/role-based-access-control/built-in-roles.md#storage-blob-data-contributor): Use to grant read/write/delete permissions to Blob storage resources.
- [Storage Blob Data Reader](../articles/role-based-access-control/built-in-roles.md#storage-blob-data-reader): Use to grant read-only permissions to Blob storage resources.
- [Storage Queue Data Contributor](../articles/role-based-access-control/built-in-roles.md#storage-queue-data-contributor): Use to grant read/write/delete permissions to Azure queues.
- [Storage Queue Data Reader](../articles/role-based-access-control/built-in-roles.md#storage-queue-data-reader): Use to grant read-only permissions to Azure queues.
- [Storage Queue Data Message Processor](../articles/role-based-access-control/built-in-roles.md#storage-queue-data-message-processor): Use to grant peek, retrieve, and delete permissions to messages in Azure Storage queues.
- [Storage Queue Data Message Sender](../articles/role-based-access-control/built-in-roles.md#storage-queue-data-message-sender): Use to grant add permissions to messages in Azure Storage queues.

If a user has been assigned a role that specifies the RBAC action **Microsoft.Storage/storageAccounts/listkeys/action**, then that user also has permissions to access blob and queue data using the storage account access keys. For example, the **Storage Account Contributor** role does not provide access to blob and queue data via OAuth, but it does grant access to the keys. The keys can be used to access data in the storage account via Shared Key authorization. For more information, see [Use the Azure portal to access blob or queue data](../articles/storage/common/storage-access-blobs-queues-portal.md).

> [!IMPORTANT]
> RBAC role assignments may take up to five minutes to propagate.

For more information about how built-in roles are defined for Azure Storage, see [Understand role definitions](../articles/role-based-access-control/role-definitions.md#management-and-data-operations-preview). For information about creating custom RBAC roles, see [Create custom roles for Azure Role-Based Access Control](../articles/role-based-access-control/custom-roles.md). 
