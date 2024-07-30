---
title: Delete and restore a blob container with Go
titleSuffix: Azure Storage
description: Learn how to delete and restore a blob container in your Azure Storage account using the Go client library.
services: storage
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 05/22/2024
ms.author: pauljewell
ms.devlang: golang
ms.custom: devx-track-go, devguide-go
---

# Delete and restore a blob container with Go

[!INCLUDE [storage-dev-guide-selector-delete-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-delete-container.md)]

This article shows how to delete containers with the [Azure Storage client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme). If you've enabled [container soft delete](soft-delete-container-overview.md), you can restore deleted containers.

[!INCLUDE [storage-dev-guide-prereqs-go](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-go.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-go](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-go.md)]

#### Authorization

The authorization mechanism must have the necessary permissions to delete or restore a container. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Contributor** or higher. To learn more, see the authorization guidance for [Delete Container (REST API)](/rest/api/storageservices/delete-container#authorization) and [Restore Container (REST API)](/rest/api/storageservices/restore-container#authorization).

## Delete a container

To delete a container, call the following method:

- [DeleteContainer](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.DeleteContainer)

After you delete a container, you can't create a container with the same name for *at least* 30 seconds. Attempting to create a container with the same name fails with HTTP error code `409 (Conflict)`. Any other operations on the container or the blobs it contains fail with HTTP error code `404 (Not Found)`.

The following example shows how to delete a specified container:

:::code language="go" source="~/blob-devguide-go/cmd/delete-container/delete_container.go" id="snippet_delete_container":::

## Restore a deleted container

When container soft delete is enabled for a storage account, a deleted container and its contents can be recovered within a specified retention period. To learn more about container soft delete, see [Enable and manage soft delete for containers](soft-delete-container-enable.md). You can restore a soft-deleted container by calling the following method from the embedded [ServiceClient](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.ServiceClient) for the client object:

- [RestoreContainer](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/service#Client.RestoreContainer)

The following example lists containers, including soft-deleted containers, and iterates over the list to restore the specified soft-deleted container:

:::code language="go" source="~/blob-devguide-go/cmd/delete-container/delete_container.go" id="snippet_restore_container":::

[!INCLUDE [storage-dev-guide-code-samples-note-go](../../../includes/storage-dev-guides/storage-dev-guide-code-samples-note-go.md)]

## Resources

To learn more about deleting a container using the Azure Blob Storage client module for Go, see the following resources.

### Code samples

- View [code samples](https://github.com/Azure-Samples/blob-storage-devguide-go/blob/main/cmd/delete-container/delete_container.go) from this article (GitHub)

### REST API operations

The Azure SDK for Go contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Go paradigms. The client library methods for deleting or restoring a container use the following REST API operations:

- [Delete Container](/rest/api/storageservices/delete-container) (REST API)
- [Restore Container](/rest/api/storageservices/restore-container) (REST API)

[!INCLUDE [storage-dev-guide-resources-go](../../../includes/storage-dev-guides/storage-dev-guide-resources-go.md)]

### See also

- [Soft delete for containers](soft-delete-container-overview.md)
- [Enable and manage soft delete for containers](soft-delete-container-enable.md)
