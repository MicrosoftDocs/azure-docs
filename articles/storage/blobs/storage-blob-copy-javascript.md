---
title: Copy a blob with JavaScript
titleSuffix: Azure Storage
description: Learn how to copy a blob in Azure Storage by using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 11/30/2022
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js
---

# Copy a blob with JavaScript

This article shows how to copy a blob in a storage account using the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob). It also shows how to abort an asynchronous copy operation.

> [!NOTE]
> The examples in this article assume that you've created a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) object by using the guidance in the [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md) article. Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. To learn how to create a container, see [Create a container in Azure Storage with JavaScript](storage-blob-container-create-javascript.md). 

## About copying blobs

A copy operation can perform any of the following actions:

- Copy a source blob to a destination blob with a different name. The destination blob can be an existing blob of the same blob type (block, append, or page), or can be a new blob created by the copy operation.
- Copy a source blob to a destination blob with the same name, effectively replacing the destination blob. Such a copy operation removes any uncommitted blocks and overwrites the destination blob's metadata.
- Copy a source file in the Azure File service to a destination blob. The destination blob can be an existing block blob, or can be a new block blob created by the copy operation. Copying from files to page blobs or append blobs isn't supported.
- Copy a snapshot over its base blob. By promoting a snapshot to the position of the base blob, you can restore an earlier version of a blob.
- Copy a snapshot to a destination blob with a different name. The resulting destination blob is a writeable blob and not a snapshot.

The source blob for a copy operation may be one of the following types:
- Block blob
- Append blob
- Page blob
- Blob snapshot
- Blob version

If the destination blob already exists, it must be of the same blob type as the source blob. An existing destination blob will be overwritten.

The destination blob can't be modified while a copy operation is in progress. A destination blob can only have one outstanding copy operation. One way to enforce this requirement is to use a blob lease, as shown in the code example.

The entire source blob or file is always copied. Copying a range of bytes or set of blocks isn't supported. When a blob is copied, its system properties are copied to the destination blob with the same values.

## Copy a blob

To copy a blob, create a [BlobClient](storage-blob-javascript-get-started.md#create-a-blobclient-object) then use the [BlobClient.beginCopyFromURL method](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-begincopyfromurl). The following code example gets a [BlobClient](/javascript/api/@azure/storage-blob/blobclient) representing a previously created blob and copies it to a new blob:

```javascript
async function copyBlob(
    blobServiceClient, 
    sourceBlobContainerName, 
    sourceBlobName, 
    destinationBlobContainerName,
    destinationBlobName) {

    // create container clients
    const sourceContainerClient = blobServiceClient.getContainerClient(sourceBlobContainerName); 
    const destinationContainerClient = blobServiceClient.getContainerClient(destinationBlobContainerName);   
    
    // create blob clients
    const sourceBlobClient = await sourceContainerClient.getBlobClient(sourceBlobName);
    const destinationBlobClient = await destinationContainerClient.getBlobClient(destinationBlobName);

    // start copy
    const copyPoller = await destinationBlobClient.beginCopyFromURL(sourceBlobClient.url);
    console.log('start copy from A to B');

    // wait until done
    await copyPoller.pollUntilDone();
}
```

## Cancel a copy operation

When you abort a copy operation, the destination blob's property, [copyStatus](/javascript/api/@azure/storage-blob/blobbegincopyfromurlresponse#properties), is set to [aborted](/javascript/api/@azure/storage-blob/copystatustype).

```javascript
async function copyThenAbortBlob(
    blobServiceClient, 
    sourceBlobContainerName, 
    sourceBlobName, 
    destinationBlobContainerName,
    destinationBlobName) {

    // create container clients
    const sourceContainerClient = blobServiceClient.getContainerClient(sourceBlobContainerName); 
    const destinationContainerClient = blobServiceClient.getContainerClient(destinationBlobContainerName);   
    
    // create blob clients
    const sourceBlobClient = await sourceContainerClient.getBlobClient(sourceBlobName);
    const destinationBlobClient = await destinationContainerClient.getBlobClient(destinationBlobName);

    // start copy
    const copyPoller = await destinationBlobClient.beginCopyFromURL(sourceBlobClient.url);
    console.log('start copy from A to C');

    // cancel operation after starting it -
    // sample file may be too small to be canceled.
    try {
      await copyPoller.cancelOperation();
      console.log('request to cancel copy from A to C');

      // calls to get the result now throw PollerCancelledError
      await copyPoller.getResult();
    } catch (err) {
      if (err.name === 'PollerCancelledError') {
        console.log('The copy was cancelled.');
      }
    }
}
```

## Abort a copy operation

Aborting a copy operation, with [BlobClient.abortCopyFromURL](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-abortcopyfromurl) results in a destination blob of zero length. However, the metadata for the destination blob will have the new values copied from the source blob or set explicitly during the copy operation. To keep the original metadata from before the copy, make a snapshot of the destination blob before calling one of the copy methods. The final blob will be committed when the copy completes.

## Resources

To learn more about copying blobs using the Azure Blob Storage client library for JavaScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for copying blobs use the following REST API operations:

- [Copy Blob](/rest/api/storageservices/copy-blob) (REST API)
- [Copy Blob From URL](/rest/api/storageservices/copy-blob-from-url) (REST API)
- [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/copy-blob.js)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]
