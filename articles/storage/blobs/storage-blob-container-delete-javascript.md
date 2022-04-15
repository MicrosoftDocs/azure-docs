---
title: Delete and restore a blob container with JavaScript - Azure Storage 
description: Learn how to delete and restore a blob container in your Azure Storage account using the JavaScript client library.
services: storage
author: normesta

ms.service: storage
ms.topic: how-to
ms.date: 03/28/2022
ms.author: normesta
ms.subservice: blobs
ms.devlang: javascript
ms.custom: devx-track-js
---

# Delete and restore a container in Azure Storage with JavaScript

This article shows how to delete containers with the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob). If you've enabled container soft delete, you can restore deleted containers.

## Delete a container

To delete a container in JavaScript, use one of the following methods:

- BlobServiceClient.[deleteContainer](/javascript/api/@azure/storage-blob/blobserviceclien#@azure-storage-blob-blobserviceclient-deletecontainer)
- ContainerClient.[delete](/javascript/api/@azure/storage-blob/containerclien#@azure-storage-blob-containerclient-delete)
- ContainerClient.[deleteIfExists](/javascript/api/@azure/storage-blob/containerclien#@azure-storage-blob-containerclient-deleteifexists)

The delete methods returns an object which includes an errorCode. When the errorCode is undefined, the delete operation succeeded. 

After you delete a container, you can't create a container with the same name for at *least* 30 seconds. Attempting to create a container with the same name will fail with HTTP error code 409 (Conflict). Any other operations on the container or the blobs it contains will fail with HTTP error code 404 (Not Found).

The following example deletes the specified container immediately. You must the **BlobServiceClient** for the container:

```javascript
// delete container immediately on blobServiceClient
async function deleteContainerImmediately(blobServiceClient, containerName) {
  const response = await blobServiceClient.deleteContainer(containerName);

  if (!response.errorCode) {
    console.log(`deleted ${containerItem.name} container`);
  }
}
```

The following example marks the container for deletion during garbage collection. You must the **ContainerClient** for the container:

```javascript
// soft delete container on ContainerClient
async function deleteContainerSoft(containerClient) {

  const response = await containerClient.delete();

  if (!response.errorCode) {
    console.log(`deleted ${containerClient.name} container`);
  }
}
```

The following example shows how to delete all of the containers that start with a specified prefix.

```javascript
async function deleteContainersWithPrefix(blobServiceClient, prefix){

  const containerOptions = {
    includeDeleted: false,
    includeMetadata: false,
    includeSystem: true,
    prefix
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

When container soft delete is enabled for a storage account, a container and its contents may be recovered after it has been deleted, within a retention period that you specify. You can restore a soft deleted container by calling either of the following methods of the [BlobServiceClient]() class.

- [UndeleteBlobContainer]()
- [UndeleteBlobContainerAsync]()

The following example finds a deleted container, gets the version ID of that deleted container, and then passes that ID into the [UndeleteBlobContainerAsync]() method to restore the container.

```javascript
```

## See also

- [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md)
- [Soft delete for containers](soft-delete-container-overview.md)
- [Enable and manage soft delete for containers](soft-delete-container-enable.md)
- [Restore Container](/rest/api/storageservices/restore-container)
