---
title: Delete and restore a blob container with TypeScript
titleSuffix: Azure Storage 
description: Learn how to delete and restore a blob container in your Azure Storage account using the JavaScript client library using TypeScript.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-storage
ms.topic: how-to
ms.date: 03/21/2023
ms.devlang: TypeScript
ms.custom: devx-track-ts, devguide-ts, devx-track-js
---

# Delete and restore a blob container with TypeScript

This article shows how to delete containers with the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob).  If you've enabled [container soft delete](soft-delete-container-overview.md), you can restore deleted containers.

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and TypeScript](storage-blob-typescript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to delete a blob container, or to restore a soft-deleted container. To learn more, see the authorization guidance for the following REST API operations:
    - [Delete Container](/rest/api/storageservices/delete-container#authorization)
    - [Restore Container](/rest/api/storageservices/restore-container#authorization)

## Delete a container

To delete a container in TypeScript, create a BlobServiceClient or ContainerClient then use one of the following methods:

- BlobServiceClient.[deleteContainer](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-deletecontainer#@azure-storage-blob-blobserviceclient-deletecontainer)
- ContainerClient.[delete](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-deletecontainer)
- ContainerClient.[deleteIfExists](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-containerclient-deleteifexists)

After you delete a container, you can't create a container with the same name for at *least* 30 seconds. Attempting to create a container with the same name will fail with HTTP error code 409 (Conflict). Any other operations on the container or the blobs it contains will fail with HTTP error code 404 (Not Found).

## Delete container with BlobServiceClient

The following example deletes the specified container. Use the BlobServiceClient to delete a container:

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/containers-delete.ts" id="snippet_delete_container_immediately" :::

## Delete container with ContainerClient

The following example shows how to delete all of the containers whose name starts with a specified prefix using a [ContainerClient](storage-blob-typescript-get-started.md#create-a-containerclient-object).

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/containers-delete.ts" id="snippet_deleteContainersWithPrefix":::

## Restore a deleted container

When container soft delete is enabled for a storage account, a container and its contents may be recovered after it has been deleted, within a retention period that you specify. You can restore a soft-deleted container using a [BlobServiceClient](storage-blob-typescript-get-started.md#create-a-blobserviceclient-object) object:

- BlobServiceClient.[undeleteContainer](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-deletecontainert#@azure-storage-blob-blobserviceclient-undeletecontainer)

The following example finds a deleted container, gets the version ID of that deleted container, and then passes that ID into the **undeleteContainer** method to restore the container.

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/containers-delete.ts" id="snippet_undeleteContainer":::

## Resources

To learn more about deleting a container using the Azure Blob Storage client library for JavaScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for deleting or restoring a container use the following REST API operations:

- [Delete Container](/rest/api/storageservices/delete-container) (REST API)
- [Restore Container](/rest/api/storageservices/restore-container) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/containers-delete.ts)

[!INCLUDE [storage-dev-guide-resources-typescript](../../../includes/storage-dev-guides/storage-dev-guide-resources-typescript.md)]

### See also

- [Soft delete for containers](soft-delete-container-overview.md)
- [Enable and manage soft delete for containers](soft-delete-container-enable.md)
