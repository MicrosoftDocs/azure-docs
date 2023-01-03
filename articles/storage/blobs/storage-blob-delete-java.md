---
title: Delete and restore a blob with Java
titleSuffix: Azure Storage
description: Learn how to delete and restore a blob in your Azure Storage account using the Java client library
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 11/16/2022
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: java
ms.custom: devx-track-java, devguide-java
---

# Delete a blob with the Java client library

This article shows how to delete blobs with the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme). If you've enabled blob soft delete, you can restore deleted blobs.

## Delete a blob

To delete a blob, call one of these methods:

- [delete](/java/api/com.azure.storage.blob.specialized.blobclientbase)
- [deleteIfExists](/java/api/com.azure.storage.blob.specialized.blobclientbase)

The following example deletes a blob:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDelete.java" id="Snippet_DeleteBlob":::

The following example deletes a blob and its snapshots with a response:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDelete.java" id="Snippet_DeleteBlobSnapshots":::

## Restore a deleted blob

Blob soft delete protects an individual blob and its versions, snapshots, and metadata from accidental deletes or overwrites by maintaining the deleted data in the system for a specified period of time. During the retention period, you can restore the blob to its state at deletion. After the retention period has expired, the blob is permanently deleted. For more information about blob soft delete, see [Soft delete for blobs](soft-delete-blob-overview.md).

You can use the Azure Storage client libraries to restore a soft-deleted blob or snapshot. 

#### Restore soft-deleted objects when versioning is disabled

To restore deleted blobs, call the following method:

- [undelete](/java/api/com.azure.storage.blob.specialized.blobclientbase)

This method restores the content and metadata of a soft-deleted blob and any associated soft-deleted snapshots. Calling this method for a blob that hasn't been deleted has no effect. 

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDelete.java" id="Snippet_RestoreBlob":::

#### Restore soft-deleted objects when versioning is enabled

To restore a soft-deleted blob when versioning is enabled, copy a previous version over the base blob. You can use the following method:

- [copyFromUrl](/java/api/com.azure.storage.blob.specialized.blobclientbase)

This method restores the content and metadata of a soft-deleted blob and any associated soft-deleted snapshots. Calling this method for a blob that hasn't been deleted has no effect. 

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDelete.java" id="Snippet_RestoreBlobVersion":::

## See also

- [View code sample in GitHub](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDelete.java)
- [Quickstart: Azure Blob Storage client library for Java](storage-quickstart-blobs-java.md)
- [Delete Blob](/rest/api/storageservices/delete-blob) (REST API)
- [Undelete Blob](/rest/api/storageservices/undelete-blob) (REST API)
- [Soft delete for blobs](soft-delete-blob-overview.md)