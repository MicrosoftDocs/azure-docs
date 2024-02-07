---
title: Copy a blob with TypeScript
titleSuffix: Azure Storage
description: Learn how to copy a blob with TypeScript in Azure Storage by using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 05/08/2023
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: typescript
ms.custom: devx-track-ts, devguide-ts, devx-track-js
---

# Copy a blob with TypeScript

[!INCLUDE [storage-dev-guide-selector-copy](../../../includes/storage-dev-guides/storage-dev-guide-selector-copy.md)]

This article provides an overview of copy operations using the [Azure Storage client library for JavaScript and TypeScript](/javascript/api/overview/azure/storage-blob-readme).

## About copy operations

Copy operations can be used to move data within a storage account, between storage accounts, or into a storage account from a source outside of Azure. When using the Blob Storage client libraries to copy data resources, it's important to understand the REST API operations behind the client library methods. The following table lists REST API operations that can be used to copy data resources to a storage account. The table also includes links to detailed guidance about how to perform these operations using the [Azure Storage client library for JavaScript and TypeScript](/javascript/api/overview/azure/storage-blob-readme).

| REST API operation | When to use | Client library methods | Guidance |
| --- | --- | --- | --- |
| [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) | This operation is preferred for scenarios where you want to move data into a storage account and have a URL for the source object. This operation completes synchronously. | [syncUploadFromURL](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-syncuploadfromurl) | [Copy a blob from a source object URL with TypeScript](storage-blob-copy-url-typescript.md) |
| [Put Block From URL](/rest/api/storageservices/put-block-from-url) | For large objects, you can use [Put Block From URL](/rest/api/storageservices/put-block-from-url) to write individual blocks to Blob Storage, and then call [Put Block List](/rest/api/storageservices/put-block-list) to commit those blocks to a block blob. This operation completes synchronously. | [stageBlockFromURL](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-stageblockfromurl) | [Copy a blob from a source object URL with TypeScript](storage-blob-copy-url-typescript.md) |
| [Copy Blob](/rest/api/storageservices/copy-blob) | This operation can be used when you want asynchronous scheduling for a copy operation. | [beginCopyFromURL](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-begincopyfromurl) | [Copy a blob with asynchronous scheduling using TypeScript](storage-blob-copy-async-typescript.md) |

For append blobs, you can use the [Append Block From URL](/rest/api/storageservices/append-block-from-url) operation to commit a new block of data to the end of an existing append blob. The following client library method wraps this operation:

- [appendBlockFromURL](/javascript/api/@azure/storage-blob/appendblobclient#@azure-storage-blob-appendblobclient-appendblockfromurl)

For page blobs, you can use the [Put Page From URL](/rest/api/storageservices/put-page-from-url) operation to write a range of pages to a page blob where the contents are read from a URL. The following client library method wraps this operation:

- [uploadPagesFromURL](/javascript/api/@azure/storage-blob/pageblobclient#@azure-storage-blob-pageblobclient-uploadpagesfromurl)

## Client library resources

- [Client library reference documentation](/javascript/api/@azure/storage-blob)
- [Client library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-blob)
- [Package (npm)](https://www.npmjs.com/package/@azure/storage-blob)
