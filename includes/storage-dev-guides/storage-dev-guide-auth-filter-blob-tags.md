---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: azure-blob-storage
ms.topic: include
ms.date: 02/16/2023
ms.author: pauljewell
ms.custom: include file
---

You can use index tags to find and filter data if your code has authorized access to blob data through one of the following mechanisms:
- Security principal that is assigned an Azure RBAC role with the [Microsoft.Storage/storageAccounts/blobServices/containers/blobs/filter/action](../../articles/role-based-access-control/resource-provider-operations.md#microsoftstorage) action. The [Storage Blob Data Owner](../../articles/role-based-access-control/built-in-roles.md#storage-blob-data-owner) is a built-in role that includes this action.
- Shared Access Signature (SAS) with permission to filter blobs by tags (`f` permission)
- Account key

For more information, see [Finding data using blob index tags](../../articles/storage/blobs/storage-manage-find-blobs.md#finding-data-using-blob-index-tags).