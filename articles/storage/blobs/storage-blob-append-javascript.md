---
title: Append data to a blob with JavaScript - Azure Storage
description: Learn how to append data to a blob in Azure Storage by using theJavaScript client library. 
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

# Append data to a blob in Azure Storage using the JavaScript client library

You can append data to a blob by creating an append blob. Append blobs are made up of blocks like block blobs, but are optimized for append operations. Append blobs are ideal for scenarios such as logging data from virtual machines.

> [!NOTE]
> The examples in this article assume that you've created a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient?view=azure-node-latest) object by using the guidance in the [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md) article. Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. To learn how to create a container, see [Create a container in Azure Storage with JavaScript](storage-blob-container-create.md). 

## Create an append blob and append data

Create an [AppendBlobClient](/javascript/api/@azure/storage-blob/appendblobclient) from a container with the [getAppendBlobClient](/javascript/api/@azure/storage-blob/containerclient?view=azure-node-latest#@azure-storage-blob-containerclient-getappendblobclient) method. Then create the appendBlob with the [createIfNotExists](/javascript/api/@azure/storage-blob/appendblobclient#@azure-storage-blob-appendblobclient-createifnotexists) method and write to it with the [appendBlock](/javascript/api/@azure/storage-blob/appendblobclient#@azure-storage-blob-appendblobclient-appendblock) method. When you are done writing, seal the blob to right-only with the [seal](/javascript/api/@azure/storage-blob/appendblobclient#@azure-storage-blob-appendblobclient-seal) method.

```JavaScript
async function appendToBlob(containerClient, timestamp) {

    // name of blob
    const blobName = `append-blob-${timestamp}`;

    // add metadata to blob
    const options = {
        metadata: {
            owner: 'YOUR-NAME',
            project: 'append-blob-sample'
        }
    };

    // get appendBlob client
    const appendBlobClient = containerClient.getAppendBlobClient(blobName);

    // create blob to save logs
    await appendBlobClient.createIfNotExists(options);
    console.log(`Created appendBlob ${blobName}`);

    // fetch log as stream
    // get fully qualified path of file
    // Create file `my-local-file.txt` in same directory as this file
    const localFileWithPath = path.join(__dirname, `my-local-file.txt`);

    // read file
    const contents = await fs.readFile(localFileWithPath, 'utf8');

    // send content to appendBlob
    // such as a log file on hourly basis
    await appendBlobClient.appendBlock(contents, contents.length);

    // add more iterations of appendBlob to continue adding
    // to same blob
    // ...await appendBlobClient.appendBlock(contents, contents.length);

    // when done, seal a day's log to read-only
    await appendBlobClient.seal();
    console.log(`Sealed appendBlob ${blobName}`);
}
```

## See also

- [Understanding block blobs, append blobs, and page blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs)
- [OpenWrite](/dotnet/api/azure.storage.blobs.specialized.appendblobclient.openwrite) / [OpenWriteAsync](/dotnet/api/azure.storage.blobs.specialized.appendblobclient.openwriteasync)
- [Append Block](/api/storageservices/append-block) (REST API)
