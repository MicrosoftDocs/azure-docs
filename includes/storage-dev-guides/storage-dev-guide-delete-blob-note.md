---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: azure-blob-storage
ms.topic: include
ms.date: 08/12/2024
ms.author: pauljewell
ms.custom: include file
---

> [!NOTE]
> When blob soft delete is enabled for a storage account, you can't perform a permanent deletion using client library methods. Using the methods in this article, a soft-deleted blob, blob version, or snapshot remains available until the retention period expires, at which time it's permanently deleted. To learn more about the underlying REST API operation, see [Delete Blob (REST API)](/rest/api/storageservices/delete-blob).