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

> [!NOTE]
> Keep in mind that RBAC role assignments may take up to five minutes to propagate.
