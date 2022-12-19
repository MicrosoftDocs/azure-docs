---
title: Delete and restore a blob container with Python - Azure Storage 
description: Learn how to delete and restore a blob container in your Azure Storage account using the Python client library.
services: storage
author: pauljewellmsft

ms.service: storage
ms.topic: how-to
ms.date: 11/15/2022
ms.author: pauljewell
ms.subservice: blobs
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Delete and restore a container in Azure Storage using the Python client library

This article shows how to delete containers with the [Azure Storage client library for Python](/python/api/overview/azure/storage). If you've enabled container soft delete, you can restore deleted containers.

> [!NOTE]
> The examples in this article assume that you've created a [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) object by using the guidance in the [Get started with Azure Blob Storage and Python](storage-blob-python-get-started.md) article.

## Delete a container

To delete a container in Python, use one of the following methods from the `BlobServiceClient` class:

- [BlobServiceClient.deleteBlobContainer](/java/api/com.azure.storage.blob.blobserviceclient#com-azure-storage-blob-blobserviceclient-deleteblobcontainer(java-lang-string))
- [BlobServiceClient.deleteBlobContainerIfExists](/java/api/com.azure.storage.blob.blobserviceclient#com-azure-storage-blob-blobserviceclient-deleteblobcontainerifexists(java-lang-string))

You can also delete a container using one of the following methods from the `BlobContainerClient` class:

- [BlobContainerClient.delete](/java/api/com.azure.storage.blob.blobcontainerclient.delete#com-azure-storage-blob-blobcontainerclient-delete())
- [BlobContainerClient.deleteIfExists](/java/api/com.azure.storage.blob.blobcontainerclient.delete#com-azure-storage-blob-blobcontainerclient-deleteifexists())

After you delete a container, you can't create a container with the same name for *at least* 30 seconds. Attempting to create a container with the same name will fail with HTTP error code `409 (Conflict)`. Any other operations on the container or the blobs it contains will fail with HTTP error code `404 (Not Found)`.

The following example uses a `BlobServiceClient` object to delete the specified container:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide-containers/container-delete.py" id="Snippet_DeleteContainer":::

The following example shows how to delete all containers that start with a specified prefix:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide-containers/container-delete.py" id="Snippet_DeleteContainersPrefix":::

## Restore a deleted container

When container soft delete is enabled for a storage account, a deleted container and its contents may be recovered within a specified retention period. You can restore a soft deleted container by calling the following method of the `BlobServiceClient` class:

- [BlobServiceClient.undeleteBlobContainer](/java/api/com.azure.storage.blob.blobserviceclient#com-azure-storage-blob-blobserviceclient-undeleteblobcontainer(java-lang-string-java-lang-string))

The following example finds a deleted container, gets the version of that deleted container, and then passes the version into the `undeleteBlobContainer` method to restore the container.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide-containers/container-delete.py" id="Snippet_RestoreContainer":::

## See also

- [View code sample in GitHub](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Python/blob-devguide/blob-devguide-containers/container-delete.py)
- [Quickstart: Azure Blob Storage client library for Python](storage-quickstart-blobs-python.md)
- [Delete Container](/rest/api/storageservices/delete-container) (REST API)
- [Soft delete for containers](soft-delete-container-overview.md)
- [Enable and manage soft delete for containers](soft-delete-container-enable.md)
