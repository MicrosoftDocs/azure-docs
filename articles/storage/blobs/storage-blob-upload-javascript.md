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

The [sample code snippets](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide) are available in GitHub as runnable Node.js files.

> [!NOTE]
> The examples in this article assume that you've created a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) object by using the guidance in the [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md) article. Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. To learn how to create a container, see [Create a container in Azure Storage with JavaScript](storage-blob-container-create.md). 


## Upload by using a file path

The following example uploads a local file to blob storage with the [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object. The [options](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions) object allows you to pass in your own metadata and [tags](storage-manage-find-blobs.md#blob-index-tags-and-data-management), used for indexing, at upload time:

```javascript
// uploadOptions: {
//   metadata: { reviewer: 'john', reviewDate: '2022-04-01' }, 
//   tags: {project: 'xyz', owner: 'accounts-payable'}
// }
async function createBlobFromLocalPath(containerClient, blobName, localFileWithPath, uploadOptions){

  // create blob client from container client
  const blockBlobClient = await containerClient.getBlockBlobClient(blobName);

  // upload file to blob storage
  await blockBlobClient.uploadFile(localFileWithPath, uploadOptions);
  console.log(`${blobName} succeeded`);
}
```

## Upload by using a Stream

The following example uploads a readable stream to blob storage with the [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object. Pass in the BlockBlobUploadStream [options](/javascript/api/@azure/storage-blob/blockblobuploadstreamoptions) to affect the upload:

```javascript
// uploadOptions: {
//    metadata: { reviewer: 'john', reviewDate: '2022-04-01' },  
//    tags: {project: 'xyz', owner: 'accounts-payable'}, 
//  }
async function createBlobFromReadStream(containerClient, blobName, readableStream, uploadOptions) {

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

  // use transform per chunk - only to see chunck
  const transformedReadableStream = readableStream.pipe(myTransform);

  // Upload stream
  await blockBlobClient.uploadStream(transformedReadableStream, bufferSize, maxConcurrency, uploadOptions);

  // do something with blob
  const getTagsResponse = await blockBlobClient.getTags();
  console.log(`tags for ${blobName} = ${JSON.stringify(getTagsResponse.tags)}`);
}

// Transform stream
// Reasons to transform:
// 1. Sanitize the data - remove PII
// 2. Compress or uncompress
const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    // see what is in the artificially
    // small chunk
    console.log(chunk);
    callback(null, chunk);
  },
  decodeStrings: false
});

```

## Upload by using a BinaryData object

The following example uploads a Node.js buffer to blob storage with the [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object. Pass in the BlockBlobParallelUpload [options](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions) to affect the upload:

```javascript
// uploadOptions: {
//    blockSize: destination block blob size in bytes,
//    concurrency: concurrency of parallel uploading - must be greater than or equal to 0,
//    maxSingleShotSize: blob size threshold in bytes to start concurrency uploading
//    metadata: { reviewer: 'john', reviewDate: '2022-04-01' },  
//    tags: {project: 'xyz', owner: 'accounts-payable'} 
//  }
async function createBlobFromBuffer(containerClient, blobName, buffer, uploadOptions) {

  // Create blob client from container client
  const blockBlobClient = await containerClient.getBlockBlobClient(blobName);

  // Upload buffer
  await blockBlobClient.uploadData(buffer, uploadOptions);

  // do something with blob
  const getTagsResponse = await blockBlobClient.getTags();
  console.log(`tags for ${blobName} = ${JSON.stringify(getTagsResponse.tags)}`);
}
```

## Upload a string

The following example uploads a string to blob storage with the [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object. Pass in the BlockBlobUploadOptions [options](/javascript/api/@azure/storage-blob/blockblobuploadoptions) to affect the upload:

```javascript
// uploadOptions: {
//    metadata: { reviewer: 'john', reviewDate: '2022-04-01' }, 
//    tags: {project: 'xyz', owner: 'accounts-payable'} 
//  }
async function createBlobFromString(containerClient, blobName, fileContentsAsString, uploadOptions){

  // Create blob client from container client
  const blockBlobClient = await containerClient.getBlockBlobClient(blobName);

  // Upload string
  await blockBlobClient.upload(fileContentsAsString, fileContentsAsString.length, uploadOptions);

  // do something with blob
  const getTagsResponse = await blockBlobClient.getTags();
  console.log(`tags for ${blobName} = ${JSON.stringify(getTagsResponse.tags)}`);
}
```

## See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)
- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) (REST API)
