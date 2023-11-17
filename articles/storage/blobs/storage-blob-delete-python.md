---
title: Delete and restore a blob with Python
titleSuffix: Azure Storage
description: Learn how to delete and restore a blob in your Azure Storage account using the Python client library
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 08/02/2023
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Delete and restore a blob with Python

[!INCLUDE [storage-dev-guide-selector-delete-blob](../../../includes/storage-dev-guides/storage-dev-guide-selector-delete-blob.md)]

This article shows how to delete blobs using the [Azure Storage client library for Python](/python/api/overview/azure/storage). If you've enabled [soft delete for blobs](soft-delete-blob-overview.md), you can restore deleted blobs during the retention period.

To learn about deleting a blob using asynchronous APIs, see [Delete blobs asynchronously](#delete-blobs-asynchronously).

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for Python. To learn about setting up your project, including package installation, adding `import` statements, and creating an authorized client object, see [Get started with Azure Blob Storage and Python](storage-blob-python-get-started.md).
- To use asynchronous APIs in your code, see the requirements in the [Asynchronous programming](storage-blob-python-get-started.md#asynchronous-programming) section.
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to delete a blob, or to restore a soft-deleted blob. To learn more, see the authorization guidance for the following REST API operations:
    - [Delete Blob](/rest/api/storageservices/delete-blob#authorization)
    - [Undelete Blob](/rest/api/storageservices/undelete-blob#authorization)

## Delete a blob

To delete a blob, call the following method:

- [BlobClient.delete_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-delete-blob)

The following example deletes a blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-delete-blobs.py" id="Snippet_delete_blob":::

If the blob has any associated snapshots, you must delete all of its snapshots to delete the blob. The following example deletes a blob and its snapshots:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-delete-blobs.py" id="Snippet_delete_blob_snapshots":::

To delete *only* the snapshots and not the blob itself, you can pass the parameter `delete_snapshots="only"`.

## Restore a deleted blob

Blob soft delete protects an individual blob and its versions, snapshots, and metadata from accidental deletes or overwrites by maintaining the deleted data in the system for a specified period of time. During the retention period, you can restore the blob to its state at deletion. After the retention period has expired, the blob is permanently deleted. For more information about blob soft delete, see [Soft delete for blobs](soft-delete-blob-overview.md).

You can use the Azure Storage client libraries to restore a soft-deleted blob or snapshot.

How you restore a soft-deleted blob depends on whether or not your storage account has blob versioning enabled. For more information on blob versioning, see [Blob versioning](../../storage/blobs/versioning-overview.md). See one of the following sections, depending on your scenario:

- [Blob versioning is not enabled](#restore-soft-deleted-objects-when-versioning-is-disabled)
- [Blob versioning is enabled](#restore-soft-deleted-objects-when-versioning-is-enabled)

#### Restore soft-deleted objects when versioning is disabled

To restore deleted blobs when versioning is disabled, call the following method:

- [BlobClient.undelete_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-undelete-blob)

This method restores the content and metadata of a soft-deleted blob and any associated soft-deleted snapshots. Calling this method for a blob that hasn't been deleted has no effect.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-delete-blobs.py" id="Snippet_restore_blob":::

#### Restore soft-deleted objects when versioning is enabled

If a storage account is configured to enable blob versioning, deleting a blob causes the current version of the blob to become the previous version. To restore a soft-deleted blob when versioning is enabled, copy a previous version over the base blob. You can use the following method:

- [start_copy_from_url](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-start-copy-from-url)

The following code example gets the latest version of a deleted blob, and restores the latest version by copying it to the base blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-delete-blobs.py" id="Snippet_restore_blob_version":::

## Delete a blob asynchronously

The Azure Blob Storage client library for Python supports deleting a blob asynchronously. To learn more about project setup requirements, see [Asynchronous programming](storage-blob-python-get-started.md#asynchronous-programming).

Follow these steps to delete a blob using asynchronous APIs:

1. Add the following import statements:

    ```python
    import asyncio

    from azure.identity.aio import DefaultAzureCredential
    from azure.storage.blob.aio import BlobServiceClient
    ```

1. Add code to run the program using `asyncio.run`. This function runs the passed coroutine, `main()` in our example, and manages the `asyncio` event loop. Coroutines are declared with the async/await syntax. In this example, the `main()` coroutine first creates the top level `BlobServiceClient` using `async with`, then calls the method that deletes the blob. Note that only the top level client needs to use `async with`, as other clients created from it share the same connection pool.

    :::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-delete-blobs-async.py" id="Snippet_create_client_async":::

1. Add code to delete the blob. The code is the same as the synchronous example, except that the method is declared with the `async` keyword and the `await` keyword is used when calling the `delete_blob` method.

    :::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-delete-blobs-async.py" id="Snippet_delete_blob":::

With this basic setup in place, you can implement other examples in this article as coroutines using async/await syntax.

## Resources

To learn more about how to delete blobs and restore deleted blobs using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for deleting blobs and restoring deleted blobs use the following REST API operations:

- [Delete Blob](/rest/api/storageservices/delete-blob) (REST API)
- [Undelete Blob](/rest/api/storageservices/undelete-blob) (REST API)

### Code samples

- View [synchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob-devguide-delete-blobs.py) or [asynchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob-devguide-delete-blobs-async.py) code samples from this article (GitHub)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

### See also

- [Soft delete for blobs](soft-delete-blob-overview.md)
- [Blob versioning](versioning-overview.md)