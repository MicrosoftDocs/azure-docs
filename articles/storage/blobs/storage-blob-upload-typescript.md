---
title: Upload a blob with TypeScript
titleSuffix: Azure Storage
description: Learn how to upload a blob with TypeScript to your Azure Storage account using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 03/21/2023
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: typescript
ms.custom: devx-track-ts, devguide-ts
---

# Upload a blob with TypeScript

This article shows how to upload a blob using the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob). You can upload a blob, open a blob stream and write to that, or upload large blobs in blocks.

> [!NOTE]
> The examples in this article assume that you've created a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) object by using the guidance in the [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md) article. Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. To learn how to create a container, see [Create a container in Azure Storage with JavaScript](storage-blob-container-create.md). 

## Upload by blob client

Use the following table to find the correct upload method based on the blob client.

|Client|Upload method|
|--|--|
|[BlobClient](/javascript/api/@azure/storage-blob/blobclient)|The SDK needs to know the blob type you want to upload to. Because BlobClient is the base class for the other Blob clients, it does not have upload methods. It is mostly useful for operations that are common to the child blob classes. For uploading, create specific blob clients directly or get specific blob clients from ContainerClient.|
|[BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient)|This is the **most common upload client**:<br>* upload()<br>* stageBlock() and commitBlockList()|
|[AppendBlobClient](/javascript/api/@azure/storage-blob/appendblobclient)|* create()<br>* append()|
|[PageBlobClient](/javascript/api/@azure/storage-blob/pageblobclient)|* create()<br>* appendPages()|

## <a name="upload-by-using-a-file-path"></a>Upload with BlockBlobClient by using a file path

The following example uploads a local file to blob storage with the [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object. The [options](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions) object allows you to pass in your own metadata and [tags](storage-manage-find-blobs.md#blob-index-tags-and-data-management), used for indexing, at upload time:

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-local-file-path.ts" id="Snippet_UploadBlob" :::

## <a name="upload-by-using-a-stream"></a>Upload with BlockBlobClient by using a Stream

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

## <a name="upload-by-using-a-binarydata-object"></a>Upload with BlockBlobClient by using a BinaryData object

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

## <a name="upload-a-string"></a>Upload a string with BlockBlobClient 

The following example uploads a string to blob storage with the [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object. Pass in the BlockBlobUploadOptions [options](/javascript/api/@azure/storage-blob/blockblobuploadoptions) to affect the upload:

:::code language="typescript" source="~/azure_storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-upload-from-string.ts" id="Snippet_UploadBlob" :::

## Resources

To learn more about uploading blobs using the Azure Blob Storage client library for JavaScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for uploading blobs use the following REST API operations:

- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) (REST API)

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
