---
title: Delete and restore a blob container with JavaScript or TypeScript
titleSuffix: Azure Storage 
description: Learn how to delete and restore a blob container in your Azure Storage account using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 10/28/2024
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js, devx-track-ts, devguide-ts
---

# Delete and restore a blob container with JavaScript or TypeScript

[!INCLUDE [storage-dev-guide-selector-delete-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-delete-container.md)]

This article shows how to delete containers with the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob). If you've enabled [container soft delete](soft-delete-container-overview.md), you can restore deleted containers.

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to delete a blob container, or to restore a soft-deleted container. To learn more, see the authorization guidance for the following REST API operations:
    - [Delete Container](/rest/api/storageservices/delete-container#authorization)
    - [Restore Container](/rest/api/storageservices/restore-container#authorization)

## Delete a container

To delete a container, use the following method from the [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) class:

- [BlobServiceClient.deleteContainer](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-deletecontainer#@azure-storage-blob-blobserviceclient-deletecontainer)

You can also delete a container using the following method from the [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) class:

- [ContainerClient.delete](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-deletecontainer)
- [ContainerClient.deleteIfExists](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-containerclient-deleteifexists)

After you delete a container, you can't create a container with the same name for at *least* 30 seconds. Attempting to create a container with the same name fails with HTTP error code `409 (Conflict)`. Any other operations on the container or the blobs it contains fail with HTTP error code `404 (Not Found)`.

The following example uses a `BlobServiceClient` object to delete the specified container:

## [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/delete-containers.js" id="snippet_delete_container_immediately" :::

## [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/containers-delete.ts" id="snippet_delete_container_immediately" :::

---

The following example shows how to delete all containers that start with a specified prefix:

## [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/delete-containers.js" id="snippet_deleteContainersWithPrefix" :::

## [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/containers-delete.ts" id="snippet_deleteContainersWithPrefix" :::

---

## Restore a deleted container

When container soft delete is enabled for a storage account, a container and its contents can be recovered after it has been deleted, within a retention period that you specify. You can restore a soft-deleted container using a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) object:

- [BlobServiceClient.undeleteContainer](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-deletecontainert#@azure-storage-blob-blobserviceclient-undeletecontainer)

The following example finds a deleted container, gets the version ID of that deleted container, and then passes that ID into the `undeleteContainer` method to restore the container.

## [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/delete-containers.js" id="snippet_undeleteContainer" :::

## [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/containers-delete.ts" id="snippet_undeleteContainer" :::

---

## Resources

To learn more about deleting a container using the Azure Blob Storage client library for JavaScript, see the following resources.

### Code samples

- View [JavaScript](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/delete-containers.js) and [TypeScript](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/containers-delete.ts) code samples from this article (GitHub)

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for deleting or restoring a container use the following REST API operations:

- [Delete Container](/rest/api/storageservices/delete-container) (REST API)
- [Restore Container](/rest/api/storageservices/restore-container) (REST API)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]

### See also

- [Soft delete for containers](soft-delete-container-overview.md)
- [Enable and manage soft delete for containers](soft-delete-container-enable.md)

[!INCLUDE [storage-dev-guide-next-steps-javascript](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-javascript.md)]