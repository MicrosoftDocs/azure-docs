---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: azure-blob-storage
ms.topic: include
ms.date: 04/23/2023
ms.author: pauljewell
ms.custom: include file
---

## About copying blobs from a source object URL

The `Put Blob From URL` operation creates a new block blob where the contents of the blob are read from a given URL. The operation completes synchronously.

The source can be any object retrievable via a standard HTTP GET request on the given URL. This includes block blobs, append blobs, page blobs, blob snapshots, blob versions, or any accessible object inside or outside Azure.

When source object is a block blob, all committed blob content is copied. However, the block list isn't preserved, and uncommitted blocks aren't copied. The content of the destination blob is identical to that of the source, but the committed block list isn't preserved.

The destination is always a block blob, either an existing block blob, or a new block blob created by the operation. The contents of an existing blob are overwritten with the contents of the new blob.

The `Put Blob From URL` operation always copies the entire source blob. Copying a range of bytes or set of blocks isn't supported. To perform partial updates to a block blob’s contents by using a source URL, use the [Put Block From URL](/rest/api/storageservices/put-block-from-url) API along with [Put Block List](/rest/api/storageservices/put-block-list).

To learn more about the `Put Blob From URL` operation, including blob size limitations and billing considerations, see [Put Blob From URL remarks](/rest/api/storageservices/put-blob-from-url#remarks).