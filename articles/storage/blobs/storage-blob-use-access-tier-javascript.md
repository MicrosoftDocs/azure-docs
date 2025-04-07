---
title: Set or change a blob's access tier with JavaScript or TypeScript
titleSuffix: Azure Storage 
description: Learn how to set or change a blob's access tier in your Azure Storage account using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 10/28/2024
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js, devx-track-ts, devguide-ts
---

# Set or change a block blob's access tier with JavaScript or TypeScript

[!INCLUDE [storage-dev-guide-selector-access-tier](../../../includes/storage-dev-guides/storage-dev-guide-selector-access-tier.md)]

This article shows how to set or change a blob's [access tier](access-tiers-overview.md) for block blobs with the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob). 

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to set the blob's access tier. To learn more, see the authorization guidance for the following REST API operation:
    - [Set Blob Tier](/rest/api/storageservices/set-blob-tier#authorization)

[!INCLUDE [storage-dev-guide-about-access-tiers](../../../includes/storage-dev-guides/storage-dev-guide-about-access-tiers.md)]

> [!NOTE]
> To set the access tier to `Cold` using JavaScript, you must use a minimum [client library](/javascript/api/preview-docs/@azure/storage-blob/) version of 12.13.0.

## Set a blob's access tier during upload

To [upload](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-upload) a blob into a specific access tier, use the [BlockBlobUploadOptions](/javascript/api/@azure/storage-blob/blockblobuploadoptions). The `tier` property choices are: `Hot`, `Cool`, `Cold`, or `Archive`.

### [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-string-with-access-tier.js" id="Snippet_UploadAccessTier" highlight="13-15, 26":::

### [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-string-with-access-tier.ts" id="Snippet_UploadAccessTier" :::

---

## Change a blob's access tier after upload

To change the access tier of a blob after it's uploaded to storage, use [setAccessTier](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-setaccesstier). Along with the tier, you can set the [BlobSetTierOptions](/javascript/api/@azure/storage-blob/blobsettieroptions) property [rehydration priority](archive-rehydrate-overview.md) to bring the block blob out of an archived state. Possible values are `High` or `Standard`.

### [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/change-blob-access-tier.js" id="Snippet_BatchChangeAccessTier" highlight="8,11,13-16":::

### [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-change-access-tier.ts" id="Snippet_BlobChangeAccessTier" :::

---

## Copy a blob into a different access tier

Use the BlobClient.[beginCopyFromURL](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-begincopyfromurl) method to copy a blob. To change the access tier during the copy operation, use the [BlobBeginCopyFromURLOptions](/javascript/api/@azure/storage-blob/blobbegincopyfromurloptions) `tier` property and specify a different access [tier](storage-blob-storage-tiers.md) than the source blob.

### [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/copy-blob-to-different-access-tier.js" id="Snippet_CopyWithAccessTier" highlight="8":::

### [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-copy-to-different-access-tier.ts" id="Snippet_CopyWithAccessTier" :::

---

## Use a batch to change access tier for many blobs

The batch represents an aggregated set of operations on blobs, such as [delete](/javascript/api/@azure/storage-blob/blobbatchclient#@azure-storage-blob-blobbatchclient-deleteblobs-1) or [set access tier](/javascript/api/@azure/storage-blob/blobbatchclient#@azure-storage-blob-blobbatchclient-setblobsaccesstier-1). You need to pass in the correct credential to successfully perform each operation. In this example, the same credential is used for a set of blobs in the same container. 

Create a [BlobBatchClient](/javascript/api/@azure/storage-blob/blobbatchclient). Use the client to create a batch with the [createBatch()](/javascript/api/@azure/storage-blob/blobbatchclient#@azure-storage-blob-blobbatchclient-createbatch) method. When the batch is ready, [submit](/javascript/api/@azure/storage-blob/blobbatchclient#@azure-storage-blob-blobbatchclient-submitbatch) the batch for processing. Use the returned structure to validate each blob's operation was successful.

### [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/batch-set-access-tier.js" id="Snippet_BatchChangeAccessTier" highlight="16,20":::

### [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-batch-set-access-tier-for-container.ts" id="Snippet_BatchChangeAccessTier" :::

---
 
## Code samples

- Set blob access tier during upload for [JavaScript](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-string-with-access-tier.js) or [TypeScript](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-string-with-access-tier.ts)
- Change blob access tier after upload for [JavaScript](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/change-blob-access-tier.js) or [TypeScript](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-change-access-tier.ts)
- Copy blob into different access tier for [JavaScript](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/copy-blob-to-different-access-tier.js) or [TypeScript](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-copy-to-different-access-tier.ts)
- Use a batch to change access tier for many blobs for [JavaScript](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/batch-set-access-tier.js) or [TypeScript](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-batch-set-access-tier-for-container.ts)

## Next steps

- [Access tiers best practices](access-tiers-best-practices.md)
- [Blob rehydration from the archive tier](archive-rehydrate-overview.md)
