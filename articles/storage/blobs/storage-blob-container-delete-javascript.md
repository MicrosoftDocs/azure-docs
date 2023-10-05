---
title: Delete and restore a blob container with JavaScript
titleSuffix: Azure Storage 
description: Learn how to delete and restore a blob container in your Azure Storage account using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 11/30/2022
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js
---

# Delete and restore a blob container with JavaScript

[!INCLUDE [storage-dev-guide-selector-delete-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-delete-container.md)]

This article shows how to delete containers with the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob).  If you've enabled [container soft delete](soft-delete-container-overview.md), you can restore deleted containers.

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to delete a blob container, or to restore a soft-deleted container. To learn more, see the authorization guidance for the following REST API operations:
    - [Delete Container](/rest/api/storageservices/delete-container#authorization)
    - [Restore Container](/rest/api/storageservices/restore-container#authorization)

## Delete a container

To delete a container in JavaScript, create a [BlobServiceClient](storage-blob-javascript-get-started.md#create-a-blobserviceclient-object) or [ContainerClient](storage-blob-javascript-get-started.md#create-a-containerclient-object) then use one of the following methods:

- BlobServiceClient.[deleteContainer](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-deletecontainer#@azure-storage-blob-blobserviceclient-deletecontainer)
- ContainerClient.[delete](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-deletecontainer)
- ContainerClient.[deleteIfExists](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-containerclient-deleteifexists)

After you delete a container, you can't create a container with the same name for at *least* 30 seconds. Attempting to create a container with the same name will fail with HTTP error code 409 (Conflict). Any other operations on the container or the blobs it contains will fail with HTTP error code 404 (Not Found).

## Delete container with BlobServiceClient

The following example deletes the specified container. Use the [BlobServiceClient](storage-blob-javascript-get-started.md#create-a-blobserviceclient-object) to delete a container:

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

The following example shows how to delete all of the containers whose name starts with a specified prefix using a [ContainerClient](storage-blob-javascript-get-started.md#create-a-containerclient-object).

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

When container soft delete is enabled for a storage account, a container and its contents may be recovered after it has been deleted, within a retention period that you specify. You can restore a soft-deleted container using a [BlobServiceClient](storage-blob-javascript-get-started.md#create-a-blobserviceclient-object) object:

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

## Resources

To learn more about deleting a container using the Azure Blob Storage client library for JavaScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for deleting or restoring a container use the following REST API operations:

- [Delete Container](/rest/api/storageservices/delete-container) (REST API)
- [Restore Container](/rest/api/storageservices/restore-container) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/delete-containers.js)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]

### See also

- [Soft delete for containers](soft-delete-container-overview.md)
- [Enable and manage soft delete for containers](soft-delete-container-enable.md)
