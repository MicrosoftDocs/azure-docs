---
title: Delete and restore a blob container with Java
titleSuffix: Azure Storage
description: Learn how to delete and restore a blob container in your Azure Storage account using the Java client library.
services: storage
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 08/05/2024
ms.author: pauljewell
ms.devlang: java
ms.custom: devx-track-java, devguide-java, devx-track-extended-java
---

# Delete and restore a blob container with Java

[!INCLUDE [storage-dev-guide-selector-delete-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-delete-container.md)]

This article shows how to delete containers with the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme). If you've enabled [container soft delete](soft-delete-container-overview.md), you can restore deleted containers.

[!INCLUDE [storage-dev-guide-prereqs-java](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-java.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-java](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-java.md)]

#### Add import statements

Add the following `import` statements:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerDelete.java" id="Snippet_Imports":::

#### Authorization

The authorization mechanism must have the necessary permissions to delete or restore a container. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Contributor** or higher. To learn more, see the authorization guidance for [Delete Container (REST API)](/rest/api/storageservices/delete-container#authorization) and [Restore Container (REST API)](/rest/api/storageservices/restore-container#authorization).

[!INCLUDE [storage-dev-guide-create-client-java](../../../includes/storage-dev-guides/storage-dev-guide-create-client-java.md)]

## Delete a container

To delete a container in Java, use one of the following methods from the `BlobServiceClient` class:

- [deleteBlobContainer](/java/api/com.azure.storage.blob.blobserviceclient)
- [deleteBlobContainerIfExists](/java/api/com.azure.storage.blob.blobserviceclient)

You can also delete a container using one of the following methods from the `BlobContainerClient` class:

- [delete](/java/api/com.azure.storage.blob.blobcontainerclient)
- [deleteIfExists](/java/api/com.azure.storage.blob.blobcontainerclient)

After you delete a container, you can't create a container with the same name for *at least* 30 seconds. Attempting to create a container with the same name will fail with HTTP error code `409 (Conflict)`. Any other operations on the container or the blobs it contains will fail with HTTP error code `404 (Not Found)`.

The following example uses a `BlobServiceClient` object to delete the specified container:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerDelete.java" id="Snippet_DeleteContainer":::

The following example shows how to delete all containers that start with a specified prefix:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerDelete.java" id="Snippet_DeleteContainersPrefix":::

## Restore a deleted container

When container soft delete is enabled for a storage account, a deleted container and its contents may be recovered within a specified retention period. To learn more about container soft delete, see [Enable and manage soft delete for containers](soft-delete-container-enable.md). You can restore a soft-deleted container by calling the following method of the `BlobServiceClient` class:

- [undeleteBlobContainer](/java/api/com.azure.storage.blob.blobserviceclient)

The following example finds a deleted container, gets the version of that deleted container, and then passes the version into the `undeleteBlobContainer` method to restore the container.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerDelete.java" id="Snippet_RestoreContainer":::

## Resources

To learn more about deleting a container using the Azure Blob Storage client library for Java, see the following resources.

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerDelete.java)

### REST API operations

The Azure SDK for Java contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Java paradigms. The client library methods for deleting or restoring a container use the following REST API operations:

- [Delete Container](/rest/api/storageservices/delete-container) (REST API)
- [Restore Container](/rest/api/storageservices/restore-container) (REST API)

[!INCLUDE [storage-dev-guide-resources-java](../../../includes/storage-dev-guides/storage-dev-guide-resources-java.md)]

### See also

- [Soft delete for containers](soft-delete-container-overview.md)
- [Enable and manage soft delete for containers](soft-delete-container-enable.md)

[!INCLUDE [storage-dev-guide-next-steps-java](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-java.md)]
