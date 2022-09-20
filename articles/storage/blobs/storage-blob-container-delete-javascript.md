---
title: Delete and restore a blob container with JavaScript - Azure Storage 
description: Learn how to delete and restore a blob container in your Azure Storage account using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 03/28/2022
ms.subservice: blobs
ms.devlang: javascript
ms.custom: devx-track-js
---

# Delete and restore a container in Azure Storage with JavaScript

This article shows how to delete containers with the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob). If you've enabled container soft delete, you can restore deleted containers.

The [sample code snippets](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide) are available in GitHub as runnable Node.js files.

## Delete a container

To delete a container in JavaScript, use one of the following methods:

- BlobServiceClient.[deleteContainer](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-deletecontainer#@azure-storage-blob-blobserviceclient-deletecontainer)
- ContainerClient.[delete](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-deletecontainer)
- ContainerClient.[deleteIfExists](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-containerclient-deleteifexists)

After you delete a container, you can't create a container with the same name for at *least* 30 seconds. Attempting to create a container with the same name will fail with HTTP error code 409 (Conflict). Any other operations on the container or the blobs it contains will fail with HTTP error code 404 (Not Found).

## Delete container with BlobServiceClient

The following example deletes the specified container. Use the **BlobServiceClient** for the container:

```javascript
// delete container immediately on blobServiceClient
async function deleteContainerImmediately(blobServiceClient, containerName) {
  const response = await blobServiceClient.deleteContainer(containerName);

  if (!response.errorCode) {
    console.log(`deleted ${containerItem.name} container`);
  }
}
```

## Delete container with ContainerClient

The following example shows how to delete all of the containers whose name starts with a specified prefix.

```javascript
async function deleteContainersWithPrefix(blobServiceClient, blobNamePrefix){

  const containerOptions = {
    includeDeleted: false,
    includeMetadata: false,
    includeSystem: true,
    prefix: blobNamePrefix
  }

  for await (const containerItem of blobServiceClient.listContainers(containerOptions)) {

    const containerClient = blobServiceClient.getContainerClient(containerItem.name);

    const response = await containerClient.delete();

    if(!response.errorCode){
      console.log(`deleted ${containerItem.name} container`);
    }
  }
}
```

## Restore a deleted container

When container soft delete is enabled for a storage account, a container and its contents may be recovered after it has been deleted, within a retention period that you specify. You can restore a soft deleted container by calling.

- BlobServiceClient.[undeleteContainer](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-deletecontainert#@azure-storage-blob-blobserviceclient-undeletecontainer)

The following example finds a deleted container, gets the version ID of that deleted container, and then passes that ID into the **undeleteContainer** method to restore the container.

```javascript
// Undelete specific container - last version
async function undeleteContainer(blobServiceClient, containerName) {

  // version to undelete
  let containerVersion;

  const containerOptions = {
    includeDeleted: true,
    prefix: containerName
  }

  // container listing returns version (timestamp) in the ContainerItem
  for await (const containerItem of blobServiceClient.listContainers(containerOptions)) {

    // if there are multiple deleted versions of the same container,
    // the versions are in asc time order
    // the last version is the most recent
    if (containerItem.name === containerName) {
      containerVersion = containerItem.version;
    }
  }

  const containerClient = await blobServiceClient.undeleteContainer(
    containerName,
    containerVersion,

    // optional/new container name - if unused, original container name is used
    //newContainerName 
  );

  // undelete was successful
  console.log(`${containerName} is undeleted`);

  // do something with containerClient
  // ...
}
```

## See also

- [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md)
- [Soft delete for containers](soft-delete-container-overview.md)
- [Enable and manage soft delete for containers](soft-delete-container-enable.md)
- [Restore Container](/rest/api/storageservices/restore-container)
