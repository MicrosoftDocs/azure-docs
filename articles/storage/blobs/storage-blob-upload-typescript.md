---
title: Upload a blob with TypeScript
titleSuffix: Azure Storage
description: Learn how to upload a blob with TypeScript to your Azure Storage account using the JavaScript client library.
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

# Upload a blob with TypeScript

This article shows how to upload a blob using the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob). You can upload data to a block blob from a file path, a stream, a buffer, or a text string. You can also upload blobs with index tags.

## Prerequisites

To work with the code examples in this article, make sure you have:

- An authorized client object to connect to Blob Storage data resources. To learn more, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).
- Permissions to perform an upload operation. To learn more, see the authorization guidance for the following REST API operations:
    - [Put Blob](/rest/api/storageservices/put-blob#authorization)
    - [Put Block](/rest/api/storageservices/put-block#authorization)
- The package **@azure/storage-blob** installed to your project directory. To learn more about setting up your project, see [Get Started with Azure Storage and TypeScript](storage-blob-typescript-get-started.md#set-up-your-project).

## Upload data to a block blob

You can use any of the following methods to upload data to a block blob:

- [upload](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-upload) (non-parallel uploading method)
- [uploadData](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-uploaddata)
- [uploadFile](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-uploadfile) (only available in Node.js runtime)
- [uploadStream](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-uploadstream) (only available in Node.js runtime)

Each of these methods can be called using a [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object.

## Upload a block blob from a file path

The following example uploads a local file to blob storage with the [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object. The [options](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions) object allows you to pass in your own metadata and [tags](storage-manage-find-blobs.md#blob-index-tags-and-data-management), used for indexing, at upload time:

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-local-file-path.ts" id="Snippet_UploadBlob" :::

## Upload a block blob from a stream

The following example uploads a readable stream to blob storage with the [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object. Pass in the BlockBlobUploadStream [options](/javascript/api/@azure/storage-blob/blockblobuploadstreamoptions) to affect the upload:

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-stream.ts" id="Snippet_UploadBlob" :::

Transform the stream during the upload for data clean up.

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-stream.ts" id="Snippet_Transform" :::

The following code demonstrates how to use the function.

```javascript
// fully qualified path to file
const localFileWithPath = path.join(__dirname, `my-text-file.txt`);

// encoding: just to see the chunk as it goes by in the transform
const streamOptions = { highWaterMark: 20, encoding: 'utf-8' }

const readableStream = fs.createReadStream(localFileWithPath, streamOptions);

// Tags: Record<string, string>
const tags: Tags = {
  createdBy: 'YOUR-NAME',
  createdWith: `StorageSnippetsForDocs`,
  createdOn: new Date().toDateString()
};

// upload options
const uploadOptions: BlockBlobUploadStreamOptions = {

      // not indexed for searching
      metadata: {
        owner: 'PhillyProject'
      },

      // indexed for searching
      tags
    }

// upload stream
await createBlobFromReadStream(containerClient, `my-text-file.txt`, readableStream, uploadOptions);
```

## Upload a block blob from a buffer

The following example uploads a Node.js buffer to blob storage with the [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object. Pass in the BlockBlobParallelUpload [options](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions) to affect the upload:

:::code language="typescript" source="~/azure_storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-buffer.ts" id="Snippet_UploadBlob" :::

The following code demonstrates how to use the function.

```typescript
// fully qualified path to file
const localFileWithPath = path.join(__dirname, `daisies.jpg`);

// read file into buffer
const buffer: Buffer = await fs.readFile(localFileWithPath);

// Tags: Record<string, string>
const tags: Tags = {
  createdBy: 'YOUR-NAME',
  createdWith: `StorageSnippetsForDocs-${i}`,
  createdOn: new Date().toDateString()
};

// upload options
const uploadOptions: BlockBlobParallelUploadOptions = {

      // not indexed for searching
      metadata: {
        owner: 'PhillyProject'
      },

      // indexed for searching
      tags
    }

// upload buffer
createBlobFromBuffer(containerClient, `daisies.jpg`, buffer, uploadOptions)
```

## Upload a block blob from a string

The following example uploads a string to blob storage with the [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object. Pass in the BlockBlobUploadOptions [options](/javascript/api/@azure/storage-blob/blockblobuploadoptions) to affect the upload:

:::code language="typescript" source="~/azure_storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-string.ts" id="Snippet_UploadBlob" :::

## Resources

To learn more about uploading blobs using the Azure Blob Storage client library for JavaScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for uploading blobs use the following REST API operations:

- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Block](/rest/api/storageservices/put-block) (REST API)

### Code samples

View code samples from this article (GitHub):

- [Upload from local file path](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-local-file-path.ts)
- [Upload from buffer](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-buffer.ts)
- [Upload from stream](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-stream.ts)
- [Upload from string](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-string.ts)

[!INCLUDE [storage-dev-guide-resources-typescript](../../../includes/storage-dev-guides/storage-dev-guide-resources-typescript.md)]

### See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)
