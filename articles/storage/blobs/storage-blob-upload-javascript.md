---
title: Upload a blob with JavaScript
titleSuffix: Azure Storage
description: Learn how to upload a blob to your Azure Storage account using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 06/20/2023
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js
---

# Upload a blob with JavaScript

[!INCLUDE [storage-dev-guide-selector-upload](../../../includes/storage-dev-guides/storage-dev-guide-selector-upload.md)]

This article shows how to upload a blob using the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob). You can upload data to a block blob from a file path, a stream, a buffer, or a text string. You can also upload blobs with index tags.

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md).
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

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-local-file-path.js" id="Snippet_UploadBlob":::

## Upload a block blob from a stream

The following example uploads a block blob by creating a readable stream and uploading the stream:

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-stream.js" id="Snippet_UploadBlob":::

## Upload a block blob from a buffer

The following example uploads a block blob from a Node.js buffer:

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-buffer.js" id="Snippet_UploadBlob":::

## Upload a block blob from a string

The following example uploads a block blob from a string:

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-string.js" id="Snippet_UploadBlob":::

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

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-with-transfer-options.js" id="Snippet_UploadBlobTransferOptions":::

### Upload a block blob with index tags

Blob index tags categorize data in your storage account using key-value tag attributes. These tags are automatically indexed and exposed as a searchable multi-dimensional index to easily find data.

The following example uploads a block blob with index tags set using [BlockBlobParallelUploadOptions](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions):

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-with-index-tags.js" id="Snippet_UploadBlobIndexTags":::

### Set a blob's access tier on upload

You can set a blob's access tier on upload by using the [BlockBlobParallelUploadOptions](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions) interface. The following code example shows how to set the access tier when uploading a blob:

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-with-access-tier.js" id="Snippet_UploadAccessTier":::

Setting the access tier is only allowed for block blobs. You can set the access tier for a block blob to `Hot`, `Cool`, `Cold`, or `Archive`. To set the access tier to `Cold`, you must use a minimum [client library](/javascript/api/preview-docs/@azure/storage-blob/) version of 12.13.0.

To learn more about access tiers, see [Access tiers overview](access-tiers-overview.md).

## Resources

To learn more about uploading blobs using the Azure Blob Storage client library for JavaScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for uploading blobs use the following REST API operations:

- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Block](/rest/api/storageservices/put-block) (REST API)

### Code samples

View code samples from this article (GitHub):

- [Upload from local file path](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-local-file-path.js)
- [Upload from buffer](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-buffer.js)
- [Upload from stream](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-stream.js)
- [Upload from string](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-string.js)
- [Upload with transfer options](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-with-transfer-options.js)
- [Upload with index tags](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-with-index-tags.js)
- [Upload with access tier](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-with-access-tier.js)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]

### See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)
