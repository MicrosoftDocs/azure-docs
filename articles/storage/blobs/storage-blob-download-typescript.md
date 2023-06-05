---
title: Download a blob with TypeScript
titleSuffix: Azure Storage
description: Learn how to download a blob with TypeScript in Azure Storage by using the JavaScript client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 04/21/2023
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: typescript
ms.custom: devx-track-ts, devguide-ts
---

# Download a blob with TypeScript

This article shows how to download a blob using the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob). You can download blob data to various destinations, including a local file path, stream, or text string.

## Prerequisites

To work with the code examples in this article, make sure you have:

- An authorized client object to connect to Blob Storage data resources. To learn more, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).
- Permissions to perform an upload operation. To learn more, see the authorization guidance for the following REST API operation:
    - [Get Blob](/rest/api/storageservices/get-blob#authorization)
- The package **@azure/storage-blob** installed to your project directory. To learn more about setting up your project, see [Get started with Azure Blob Storage and TypeScript](storage-blob-typescript-get-started.md).

## Download a blob

You can use any of the following methods to download a blob:

- [BlobClient.download](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-download)
- [BlobClient.downloadToBuffer](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-downloadtobuffer-1) (only available in Node.js runtime)
- [BlobClient.downloadToFile](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-downloadtofile) (only available in Node.js runtime)
 
## Download to a file path

The following example downloads a blob by using a file path with the [BlobClient.downloadToFile](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-downloadtofile) method. This method is only available in the Node.js runtime:

:::code language="typescript" source="~/azure_storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-download-to-file.ts" id="snippet_downloadBlobToFile":::


## Download as a stream

The following example downloads a blob by creating a Node.js writable stream object and then piping to that stream with the [BlobClient.download](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-download) method.

:::code language="typescript" source="~/azure_storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-download-to-stream.ts" id="snippet_downloadBlobAsStream":::


## Download to a string

The following Node.js example downloads a blob to a string with [BlobClient.download](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-download) method. In Node.js, blob data returns in a `readableStreamBody`.

:::code language="typescript" source="~/azure_storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-download-to-string.ts" id="snippet_downloadBlobToString":::


If you're working with JavaScript in the browser, blob data returns in a promise [blobBody](/javascript/api/@azure/storage-blob/blobdownloadresponseparsed#@azure-storage-blob-blobdownloadresponseparsed-blobbody). To learn more, see the example usage for browsers at [BlobClient.download](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-download).

## Resources

To learn more about how to download blobs using the Azure Blob Storage client library for JavaScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for downloading blobs use the following REST API operation:

- [Get Blob](/rest/api/storageservices/get-blob) (REST API)

### Code samples

View code samples from this article (GitHub):
- [Download to file](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/download-blob-to-file.js)
- [Download to stream](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/download-blob-to-stream.js)
- [Download to string](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/download-blob-to-string.js)

[!INCLUDE [storage-dev-guide-resources-typescript](../../../includes/storage-dev-guides/storage-dev-guide-resources-typescript.md)]
