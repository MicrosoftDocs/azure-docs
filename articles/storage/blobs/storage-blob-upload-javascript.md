---
title: Upload a blob using JavaScript - Azure Storage
description: Learn how to upload a blob to your Azure Storage account using the JavaScript client library.
services: storage
author: normesta

ms.author: normesta
ms.date: 03/28/2022
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: javascript
ms.custom: "devx-track-js"
---

# Upload a blob to Azure Storage by using the JavaScript client library

You can upload a blob, open a blob stream and write to that, or upload large blobs in blocks.

> [!NOTE]
> The examples in this article assume that you've created a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient?view=azure-node-latest) object by using the guidance in the [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md) article. Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. To learn how to create a container, see [Create a container in Azure Storage with JavaScript](storage-blob-container-create.md). 


## Upload by using a file path

The following example uploads a local file to blob storage with the[BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object.The [options](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions?view=azure-node-latest) allow you to pass in your own metadata and [tags](storage-manage-find-blobs.md##blob-index-tags-and-data-management), used for indexing, at upload time:

```javascript
// containerName: string
// blobName: string, includes file extension if provided
// localFileWithPath: fully qualified path and file name
// uploadOptions: {metadata, tags}
async function createBlobFromLocalPath(containerClient, blobName, localFileWithPath, uploadOptions){

  // create blob client from container client
  const blockBlobClient = await containerClient.getBlockBlobClient(blobName);

  // upload file to blob storage
  const uploadBlobResponse = await blockBlobClient.uploadFile(localFileWithPath, uploadOptions);

  // check upload was successful
  if(!uploadBlobResponse.errorCode){
    console.log(`${blobName} succeeded`);
  } 
}
```

## Upload by using a Stream

The following example uploads a blob by creating a JavaScript stream object. 

```javascript
// containerName: string
// blobName: string, includes file extension if provided
// readableStream: Node.js Readable stream
// uploadOptions: {
//    metadata, 
//    tags, 
//    tier: accessTier (hot, cool, archive), 
//    onProgress: fnUpdater
//  }
async function createBlobFromLocalPath(containerClient, blobName, readableStream, uploadOptions){

  // Create blob client from container client
  const blockBlobClient = await containerClient.getBlockBlobClient(blobName);

  // Size of every buffer allocated, also 
  // the block size in the uploaded block blob. 
  // Default value is 8MB
  const bufferSize = 4 * 1024 * 1024;

  // Max concurrency indicates the max number of 
  // buffers that can be allocated, positive correlation 
  // with max uploading concurrency. Default value is 5
  const maxConcurrency = 20;

  // Upload stream
  const uploadBlobResponse = await blockBlobClient.uploadStream(readableStream, bufferSize, maxConcurrency, uploadOptions);
  
  // Check for errors or get tags from Azure
  if(uploadBlobResponse.errorCode) {
    console.log(`${blobName} failed to upload from file: ${errorCode}`);
  } else {
    // do something with blob
    const getTagsResponse = await blockBlobClient.getTags();
    console.log(`tags for ${blobName} = ${JSON.stringify(getTagsResponse.tags)}`);
  }
}
```

## Upload by using a BinaryData object

The following example uploads a [BinaryData]() object.

```javascript

```

## Upload a string

The following example uploads a string:

```javascript

```

## Upload with index tags

Blob index tags categorize data in your storage account using key-value tag attributes. These tags are automatically indexed and exposed as a searchable multi-dimensional index to easily find data. You can perform this task by adding tags to a [BlobUploadOptions]() instance, and then passing that instance into the [Upload]() method.

The following example uploads a blob with three index tags.

```javascript

```

## Upload to a stream in Blob Storage

You can open a stream in Blob Storage and write to that stream. The following example creates a zip file in Blob Storage and writes files to that file. Instead of building a zip file in local memory, only one file at a time is in memory. 

```javascript
```

## Upload by staging blocks and then committing them

You can have greater control over how to divide our uploads into blocks by manually staging individual blocks of data. When all of the blocks that make up a blob are staged, you can commit them to Blob Storage. You can use this approach if you want to enhance performance by uploading blocks in parallel. 

```javascript
```

## See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)
- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) (REST API)
