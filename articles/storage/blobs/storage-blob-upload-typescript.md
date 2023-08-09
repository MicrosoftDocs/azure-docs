---
title: Upload a blob with TypeScript
titleSuffix: Azure Storage
description: Learn how to upload a blob with TypeScript to your Azure Storage account using the client library for JavaScript and TypeScript.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 06/21/2023
ms.service: azure-storage
ms.topic: how-to
ms.devlang: typescript
ms.custom: devx-track-ts, devguide-ts, devx-track-js
---

# Upload a blob with TypeScript

This article shows how to upload a blob using the [Azure Storage client library for JavaScript](/javascript/api/overview/azure/storage-blob-readme). You can upload data to a block blob from a file path, a stream, a buffer, or a text string. You can also upload blobs with index tags.

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and TypeScript](storage-blob-typescript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to perform an upload operation. To learn more, see the authorization guidance for the following REST API operations:
    - [Put Blob](/rest/api/storageservices/put-blob#authorization)
    - [Put Block](/rest/api/storageservices/put-block#authorization)

## Upload data to a block blob

You can use any of the following methods to upload data to a block blob:

- [upload](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-upload) (non-parallel uploading method)
- [uploadData](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-uploaddata)
- [uploadFile](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-uploadfile) (only available in Node.js runtime)
- [uploadStream](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-uploadstream) (only available in Node.js runtime)

Each of these methods can be called using a [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object.

## Upload a block blob from a file path

The following example uploads a block blob from a local file path:

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-local-file-path.ts" id="Snippet_UploadBlob" :::

## Upload a block blob from a stream

The following example uploads a block blob by creating a readable stream and uploading the stream:

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-stream.ts" id="Snippet_UploadBlob" :::

## Upload a block blob from a buffer

The following example uploads a block blob from a Node.js buffer:

:::code language="typescript" source="~/azure_storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-buffer.ts" id="Snippet_UploadBlob" :::

## Upload a block blob from a string

The following example uploads a block blob from a string:

:::code language="typescript" source="~/azure_storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-string.ts" id="Snippet_UploadBlob" :::

## Upload a block blob with configuration options

You can define client library configuration options when uploading a blob. These options can be tuned to improve performance, enhance reliability, and optimize costs. The code examples in this section show how to set configuration options using the [BlockBlobParallelUploadOptions](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions) interface, and how to pass those options as a parameter to an upload method call. 

### Specify data transfer options on upload

You can configure properties in [BlockBlobParallelUploadOptions](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions) to improve performance for data transfer operations. The following table lists the properties you can configure, along with a description:

| Property | Description |
| --- | --- |
| [`blockSize`](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions#@azure-storage-blob-blockblobparalleluploadoptions-blocksize) | The maximum block size to transfer for each request as part of an upload operation. |
| [`concurrency`](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions#@azure-storage-blob-blockblobparalleluploadoptions-concurrency) | The maximum number of parallel requests that are issued at any given time as a part of a single parallel transfer.
| [`maxSingleShotSize`](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions#@azure-storage-blob-blockblobparalleluploadoptions-maxsingleshotsize) | If the size of the data is less than or equal to this value, it's uploaded in a single put rather than broken up into chunks. If the data is uploaded in a single shot, the block size is ignored. Default value is 256 MiB. |

The following code example shows how to set values for [BlockBlobParallelUploadOptions](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions) and include the options as part of an upload method call. The values provided in the samples aren't intended to be a recommendation. To properly tune these values, you need to consider the specific needs of your app.

:::code language="typescript" source="~/azure_storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-with-transfer-options.ts" id="Snippet_UploadBlobTransferOptions":::

### Upload a block blob with index tags

Blob index tags categorize data in your storage account using key-value tag attributes. These tags are automatically indexed and exposed as a searchable multi-dimensional index to easily find data.

The following example uploads a block blob with index tags set using [BlockBlobParallelUploadOptions](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions):

:::code language="typescript" source="~/azure_storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-with-index-tags.ts" id="Snippet_UploadBlobIndexTags":::

### Set a blob's access tier on upload

You can set a blob's access tier on upload by using the [BlockBlobParallelUploadOptions](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions) interface. The following code example shows how to set the access tier when uploading a blob:

:::code language="typescript" source="~/azure_storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-with-access-tier.ts" id="Snippet_UploadAccessTier":::

Setting the access tier is only allowed for block blobs. You can set the access tier for a block blob to `Hot`, `Cool`, `Cold`, or `Archive`. To set the access tier to `Cold`, you must use a minimum [client library](/javascript/api/preview-docs/@azure/storage-blob/) version of 12.13.0.

To learn more about access tiers, see [Access tiers overview](access-tiers-overview.md).

## Resources

To learn more about uploading blobs using the Azure Blob Storage client library for JavaScript and TypeScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript and TypeScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar language paradigms. The client library methods for uploading blobs use the following REST API operations:

- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Block](/rest/api/storageservices/put-block) (REST API)

### Code samples

View code samples from this article (GitHub):

- [Upload from local file path](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-local-file-path.ts)
- [Upload from buffer](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-buffer.ts)
- [Upload from stream](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-stream.ts)
- [Upload from string](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-string.ts)
- [Upload with transfer options](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-with-transfer-options.ts)
- [Upload with index tags](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-with-index-tags.ts)
- [Upload with access tier](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-with-access-tier.ts)

[!INCLUDE [storage-dev-guide-resources-typescript](../../../includes/storage-dev-guides/storage-dev-guide-resources-typescript.md)]

### See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)
