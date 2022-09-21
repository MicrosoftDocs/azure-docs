---
title: Upload a blob using JavaScript - Azure Storage
description: Learn how to upload a blob to your Azure Storage account using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 07/18/2022
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: javascript
ms.custom: "devx-track-js"
---

# Upload a blob to Azure Storage by using the JavaScript client library

You can upload a blob, open a blob stream and write to that, or upload large blobs in blocks.

The [sample code snippets](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide) are available in GitHub as runnable Node.js files.

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

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-local-file-path.js" id="Snippet_UploadBlob" highlight="14":::

## <a name="upload-by-using-a-stream"></a>Upload with BlockBlobClient by using a Stream

The following example uploads a readable stream to blob storage with the [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object. Pass in the BlockBlobUploadStream [options](/javascript/api/@azure/storage-blob/blockblobuploadstreamoptions) to affect the upload:

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-stream.js" id="Snippet_UploadBlob" highlight="27":::

Transform the stream during the upload for data clean up.

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-stream.js" id="Snippet_Transform" :::

The following code demonstrates how to use the function.

```javascript
// fully qualified path to file
const localFileWithPath = path.join(__dirname, `my-text-file.txt`);

// encoding: just to see the chunk as it goes by in the transform
const streamOptions = { highWaterMark: 20, encoding: 'utf-8' }

const readableStream = fs.createReadStream(localFileWithPath, streamOptions);

// upload options
const uploadOptions = {

      // not indexed for searching
      metadata: {
        owner: 'PhillyProject'
      },

      // indexed for searching
      tags: {
        createdBy: 'YOUR-NAME',
        createdWith: `StorageSnippetsForDocs-${i}`,
        createdOn: (new Date()).toDateString()
      }
    }

// upload stream
await createBlobFromReadStream(containerClient, `my-text-file.txt`, readableStream, uploadOptions);
```

## <a name="upload-by-using-a-binarydata-object"></a>Upload with BlockBlobClient by using a BinaryData object

The following example uploads a Node.js buffer to blob storage with the [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object. Pass in the BlockBlobParallelUpload [options](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions) to affect the upload:

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-buffer.js" id="Snippet_UploadBlob" highlight="17":::

The following code demonstrates how to use the function.

```javascript
// fully qualified path to file
const localFileWithPath = path.join(__dirname, `daisies.jpg`);

// read file into buffer
const buffer = await fs.readFile(localFileWithPath);

// upload options
const uploadOptions = {

      // not indexed for searching
      metadata: {
        owner: 'PhillyProject'
      },

      // indexed for searching
      tags: {
        createdBy: 'YOUR-NAME',
        createdWith: `StorageSnippetsForDocs-${i}`,
        createdOn: (new Date()).toDateString()
      }
    }

// upload buffer
createBlobFromBuffer(containerClient, `daisies.jpg`, buffer, uploadOptions)
```

## <a name="upload-a-string"></a>Upload a string with BlockBlobClient 

The following example uploads a string to blob storage with the [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object. Pass in the BlockBlobUploadOptions [options](/javascript/api/@azure/storage-blob/blockblobuploadoptions) to affect the upload:

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-string.js" id="Snippet_UploadBlob" highlight="14":::

## See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)
- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) (REST API)
