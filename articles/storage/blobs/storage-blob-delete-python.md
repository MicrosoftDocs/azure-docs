---
title: Delete and restore a blob with Python
titleSuffix: Azure Storage
description: Learn how to delete and restore a blob in your Azure Storage account using the Python client library
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 01/19/2023
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Delete and restore a blob with Python

This article shows how to delete blobs with the [Azure Storage client library for Python](/python/api/overview/azure/storage). If you've enabled blob soft delete, you can restore deleted blobs.

## Delete a blob

To delete a blob, call one of these methods:

- [BlobClient.delete](/java/api/com.azure.storage.blob.specialized.blobclient#com-azure-storage-blob-specialized-blobclientbase-delete())
- [BlobClient.deleteWithResponse](/java/api/com.azure.storage.blob.specialized.blobclientbase#com-azure-storage-blob-specialized-blobclientbase-deletewithresponse(com-azure-storage-blob-models-deletesnapshotsoptiontype-com-azure-storage-blob-models-blobrequestconditions-java-time-duration-com-azure-core-util-context))

The following example deletes a blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-delete.py" id="Snippet_DeleteBlob":::

The following example deletes a blob and its snapshots with a response:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-delete.py" id="Snippet_DeleteBlobSnapshots":::

## Restore a deleted blob

Blob soft delete protects an individual blob and its versions, snapshots, and metadata from accidental deletes or overwrites by maintaining the deleted data in the system for a specified period of time. During the retention period, you can restore the blob to its state at deletion. After the retention period has expired, the blob is permanently deleted. For more information about blob soft delete, see [Soft delete for blobs](soft-delete-blob-overview.md).

You can use the Azure Storage client libraries to restore a soft-deleted blob or snapshot. 

#### Restore soft-deleted objects when versioning is disabled

To restore deleted blobs, call the following method:

- [BlobClient.undelete](/java/api/com.azure.storage.blob.specialized.blobclientbase#com-azure-storage-blob-specialized-blobclientbase-undelete())

This method restores the content and metadata of a soft-deleted blob and any associated soft-deleted snapshots. Calling this method for a blob that hasn't been deleted has no effect. 

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-delete.py" id="Snippet_RestoreBlob":::

## Resources

To learn more about how to delete blobs and restore deleted blobs using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for deleting blobs and restoring deleted blobs use the following REST API operations:

- [Delete Blob](/rest/api/storageservices/delete-blob) (REST API)
- [Undelete Blob](/rest/api/storageservices/undelete-blob) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

### See also

- [Soft delete for blobs](soft-delete-blob-overview.md)