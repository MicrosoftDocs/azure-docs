---
title: Create a blob container with JavaScript - Azure Storage 
description: Learn how to create a blob container in your Azure Storage account using the JavaScript client library.
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

# Create a container in Azure Storage with JavaScript

Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. This article shows how to create containers with the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob).

The [sample code snippets](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide) are available in GitHub as runnable Node.js files.

## Name a container

A container name must be a valid DNS name, as it forms part of the unique URI used to address the container or its blobs. Follow these rules when naming a container:

- Container names can be between 3 and 63 characters long.
- Container names must start with a letter or number, and can contain only lowercase letters, numbers, and the dash (-) character.
- Two or more consecutive dash characters aren't permitted in container names.

The URI for a container is in this format:

`https://myaccount.blob.core.windows.net/mycontainer`

## Create a container

To create a container, call the following method from the BlobStorageClient:

- [BlobServiceClient.createContainer](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-createcontainer)

Containers are created immediately beneath the storage account. It's not possible to nest one container beneath another. An exception is thrown if a container with the same name already exists. 

The following example creates a container asynchronously:

```javascript
async function createContainer(blobServiceClient, containerName){

  // public access at container level
  const options = {
    access: 'container'
  };

  // creating client also creates container
  const containerClient = await blobServiceClient.createContainer(containerName, options);
  console.log(`container ${containerName} created`);

  // do something with container
  // ...

  return containerClient;
}
```

## Understand the root container

A root container, with the specific name `$root`, enables you to reference a blob at the top level of the storage account hierarchy. For example, you can reference a blob _without using a container name in the URI_:

`https://myaccount.blob.core.windowsJavaScript/default.html`

The root container must be explicitly created or deleted. It isn't created by default as part of service creation. The same code displayed in the previous section can create the root. The container name is `$root`.

## See also

- [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md)
- [Create Container operation](/rest/api/storageservices/create-container)
- [Delete Container operation](/rest/api/storageservices/delete-container)
