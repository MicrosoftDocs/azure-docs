---
title: Create a blob container with JavaScript or TypeScript
titleSuffix: Azure Storage 
description: Learn how to create a blob container in your Azure Storage account using the JavaScript client library.
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 10/28/2024
ms.author: pauljewell
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js, devx-track-ts, devguide-ts
---

# Create a blob container with JavaScript or TypeScript

[!INCLUDE [storage-dev-guide-selector-create-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-create-container.md)]

Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. This article shows how to create containers with the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob).

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to create a blob container. To learn more, see the authorization guidance for the following REST API operation:
    - [Create Container](/rest/api/storageservices/create-container#authorization)

[!INCLUDE [storage-dev-guide-about-container-naming](../../../includes/storage-dev-guides/storage-dev-guide-about-container-naming.md)]

## Create a container

To create a container, call the following method from the [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) class:

- [BlobServiceClient.createContainer](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-createcontainer)

You can also create a container using either of the following methods from the [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) class:

- [ContainerClient.create](/javascript/api/@azure/storage-blob/containerclient?#@azure-storage-blob-containerclient-create)
- [ContainerClient.createIfNotExists](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-createifnotexists)

Containers are created immediately beneath the storage account. It's not possible to nest one container beneath another. An exception is thrown if a container with the same name already exists. 

The following example creates a container asynchronously from a `BlobServiceClient` object:

### [JavaScript](#tab/javascript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/create-container.js" id="snippet_create_container" :::

### [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/container-create.ts" id="snippet_create_container" :::

---

## Create the root container

A root container serves as a default container for your storage account. Each storage account can have one root container, which must be named *$root*. The root container must be explicitly created or deleted.

You can reference a blob stored in the root container without including the root container name. The root container enables you to reference a blob at the top level of the storage account hierarchy. For example, you can reference a blob in the root container as follows:

`https://accountname.blob.core.windows.net/default.html`

To create the root container, call any create method and specify the container name as *$root*.

## Resources

To learn more about creating a container using the Azure Blob Storage client library for JavaScript, see the following resources.

### Code samples

- View [JavaScript](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/create-container.js) and [TypeScript](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/container-create.ts) code samples from this article (GitHub)

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for creating a container use the following REST API operation:

- [Create Container](/rest/api/storageservices/create-container) (REST API)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]

[!INCLUDE [storage-dev-guide-next-steps-javascript](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-javascript.md)]