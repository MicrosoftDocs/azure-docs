---
title: Create a blob container with TypeScript
titleSuffix: Azure Storage 
description: Learn how to create a blob container in your Azure Storage account using the JavaScript client library using TypeScript.
author: pauljewellmsft

ms.service: storage
ms.topic: how-to
ms.date: 03/21/2023
ms.author: pauljewell
ms.subservice: blobs
ms.devlang: typescript
ms.custom: devx-track-ts, devguide-ts
---

# Create a blob container with TypeScript

Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. This article shows how to create containers with the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob).

## Name a container

A container name must be a valid DNS name, as it forms part of the unique URI used to address the container or its blobs. Follow these rules when naming a container:

- Container names can be between 3 and 63 characters long.
- Container names must start with a letter or number, and can contain only lowercase letters, numbers, and the dash (-) character.
- Two or more consecutive dash characters aren't permitted in container names.

The URI for a container is in this format:

`https://myaccount.blob.core.windows.net/mycontainer`

## Create a container


To create a container, create a [BlobServiceClient](storage-blob-typescript-get-started.md#create-a-blobserviceclient-object) object or [ContainerClient](storage-blob-typescript-get-started.md#create-a-containerclient-object) object, then use one of the following create methods:

- [BlobServiceClient.createContainer](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-createcontainer)
- [ContainerClient.create](/javascript/api/@azure/storage-blob/containerclient?#@azure-storage-blob-containerclient-create)
- [ContainerClient.createIfNotExists](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-createifnotexists)


Containers are created immediately beneath the storage account. It's not possible to nest one container beneath another. An exception is thrown if a container with the same name already exists. 

The following example creates a container asynchronously from the BlobServiceClient:


:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/container-create.ts" id="snippet_create_container" :::

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

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/container-create.ts)
