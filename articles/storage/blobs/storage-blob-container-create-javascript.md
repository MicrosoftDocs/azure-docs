---
title: Create a blob container with JavaScript
titleSuffix: Azure Storage 
description: Learn how to create a blob container in your Azure Storage account using the JavaScript client library.
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 11/30/2022
ms.author: pauljewell
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js
---

# Create a blob container with JavaScript

[!INCLUDE [storage-dev-guide-selector-create-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-create-container.md)]

Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. This article shows how to create containers with the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob).

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to create a blob container. To learn more, see the authorization guidance for the following REST API operation:
    - [Create Container](/rest/api/storageservices/create-container#authorization)

[!INCLUDE [storage-dev-guide-about-container-naming](../../../includes/storage-dev-guides/storage-dev-guide-about-container-naming.md)]

## Create a container


To create a container, create a [BlobServiceClient](storage-blob-javascript-get-started.md#create-a-blobserviceclient-object) object or [ContainerClient](storage-blob-javascript-get-started.md#create-a-containerclient-object) object, then use one of the following create methods:

- [BlobServiceClient.createContainer](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-createcontainer)
- [ContainerClient.create](/javascript/api/@azure/storage-blob/containerclient?#@azure-storage-blob-containerclient-create)
- [ContainerClient.createIfNotExists](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-createifnotexists)


Containers are created immediately beneath the storage account. It's not possible to nest one container beneath another. An exception is thrown if a container with the same name already exists. 

The following example creates a container asynchronously from the BlobServiceClient:

```javascript
async function createContainer(blobServiceClient, containerName){

  // anonymous access at container level
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

`https://myaccount.blob.core.windows.net/default.html`

The root container must be explicitly created or deleted. It isn't created by default as part of service creation. The same code displayed in the previous section can create the root. The container name is `$root`.

## Resources

To learn more about creating a container using the Azure Blob Storage client library for JavaScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for creating a container use the following REST API operation:

- [Create Container](/rest/api/storageservices/create-container) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/create-container.js)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]
