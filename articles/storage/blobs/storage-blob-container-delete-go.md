---
title: Delete and restore a blob container with Go
titleSuffix: Azure Storage
description: Learn how to delete and restore a blob container in your Azure Storage account using the Go client library.
services: storage
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 04/22/2024
ms.author: pauljewell
ms.devlang: golang
ms.custom: devx-track-go, devguide-go
---

# Delete and restore a blob container with Go

[!INCLUDE [storage-dev-guide-selector-delete-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-delete-container.md)]

This article shows how to delete containers with the [Azure Storage client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme). If you've enabled [container soft delete](soft-delete-container-overview.md), you can restore deleted containers.

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client module for Go. To learn about setting up your project, including package installation, adding `import` statements, and creating an authorized client object, see [Get started with Azure Blob Storage and Go](storage-blob-go-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to delete a blob container, or to restore a soft-deleted container. To learn more, see the authorization guidance for the following REST API operations:
    - [Delete Container](/rest/api/storageservices/delete-container#authorization)
    - [Restore Container](/rest/api/storageservices/restore-container#authorization)

## Delete a container

To delete a container, use the following method from the [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) class:

- [BlobServiceClient.delete_container](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient#azure-storage-blob-blobserviceclient-delete-container)

You can also delete a container using the following method from the [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) class:

- [ContainerClient.delete_container](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-delete-container)

After you delete a container, you can't create a container with the same name for *at least* 30 seconds. Attempting to create a container with the same name will fail with HTTP error code `409 (Conflict)`. Any other operations on the container or the blobs it contains will fail with HTTP error code `404 (Not Found)`.

The following example uses a `BlobServiceClient` object to delete the specified container:

:::code language="go" source="~/blob-devguide-go/cmd/delete-container/delete_container.go id="snippet_delete_container":::

The following example shows how to delete all containers that start with a specified prefix:

:::code language="go" source="~/blob-devguide-go/cmd/delete-container/delete_container.go id="snippet_delete_container_prefix":::

## Restore a deleted container

When container soft delete is enabled for a storage account, a deleted container and its contents may be recovered within a specified retention period. To learn more about container soft delete, see [Enable and manage soft delete for containers](soft-delete-container-enable.md). You can restore a soft-deleted container by calling the following method of the `BlobServiceClient` class:

- [BlobServiceClient.undelete_container](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient#azure-storage-blob-blobserviceclient-undelete-container)

The following example finds a deleted container, gets the version of that deleted container, and then passes the version into the `undelete_container` method to restore the container.

:::code language="go" source="~/blob-devguide-go/cmd/delete-container/delete_container.go id="snippet_restore_container":::

## Resources

To learn more about deleting a container using the Azure Blob Storage client module for Go, see the following resources.

### REST API operations

The Azure SDK for Go contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Go paradigms. The client library methods for deleting or restoring a container use the following REST API operations:

- [Delete Container](/rest/api/storageservices/delete-container) (REST API)
- [Restore Container](/rest/api/storageservices/restore-container) (REST API)

### Code samples

- View [code samples](https://github.com/Azure-Samples/blob-storage-devguide-go/cmd/delete-container/delete_container.go) from this article (GitHub)

[!INCLUDE [storage-dev-guide-resources-go](../../../includes/storage-dev-guides/storage-dev-guide-resources-go.md)]

### See also

- [Soft delete for containers](soft-delete-container-overview.md)
- [Enable and manage soft delete for containers](soft-delete-container-enable.md)
