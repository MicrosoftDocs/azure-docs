---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: storage
ms.topic: include
ms.date: 04/21/2023
ms.author: pauljewell
ms.custom: include file
---

## About uploading blobs

The client library methods covered in this article wrap the [Put Blob](/rest/api/storageservices/put-blob) operation. This operation creates a new block blob, page blob, or append blob, or updates the content of an existing block blob. If you're updating an existing block blob, any existing metadata on the blob is overwritten. To learn more about the `Put Blob` operation, including blob size limitations for write operations, see [Put Blob remarks](/rest/api/storageservices/put-blob#remarks).

Staging individual blocks of data uses the [Put Block](/rest/api/storageservices/put-block) operation. This operation creates a new block, which can be committed as to block blob using [Put Block List](/rest/api/storageservices/put-block-list).