---
title: Delete and restore a blob with Java
titleSuffix: Azure Storage
description: Learn how to delete and restore a blob in your Azure Storage account using the Java client library
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 08/12/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: java
ms.custom: devx-track-java, devguide-java, devx-track-extended-java
---

# Delete and restore a blob with Java

[!INCLUDE [storage-dev-guide-selector-delete-blob](../../../includes/storage-dev-guides/storage-dev-guide-selector-delete-blob.md)]

This article shows how to delete blobs with the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme), and how to restore [soft-deleted](soft-delete-blob-overview.md) blobs during the retention period.

[!INCLUDE [storage-dev-guide-prereqs-java](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-java.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-java](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-java.md)]

#### Add import statements

Add the following `import` statements:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDelete.java" id="Snippet_Imports":::

#### Authorization

The authorization mechanism must have the necessary permissions to delete a blob, or to restore a soft-deleted blob. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Contributor** or higher. To learn more, see the authorization guidance for [Delete Blob (REST API)](/rest/api/storageservices/delete-blob#authorization) and [Undelete Blob (REST API)](/rest/api/storageservices/undelete-blob#authorization).

[!INCLUDE [storage-dev-guide-create-client-java](../../../includes/storage-dev-guides/storage-dev-guide-create-client-java.md)]

## Delete a blob

[!INCLUDE [storage-dev-guide-delete-blob-note](../../../includes/storage-dev-guides/storage-dev-guide-delete-blob-note.md)]

To delete a blob, call either of the following methods:

- [delete](/java/api/com.azure.storage.blob.specialized.blobclientbase#method-summary)
- [deleteIfExists](/java/api/com.azure.storage.blob.specialized.blobclientbase#method-summary)

The following example deletes a blob:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDelete.java" id="Snippet_DeleteBlob":::

If the blob has any associated snapshots, you must delete all of its snapshots to delete the blob. The following example deletes a blob and its snapshots with a response:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDelete.java" id="Snippet_DeleteBlobSnapshots":::

To delete *only* the snapshots and not the blob itself, you can pass the parameter `DeleteSnapshotsOptionType.ONLY`.

## Restore a deleted blob

Blob soft delete protects an individual blob and its versions, snapshots, and metadata from accidental deletes or overwrites by maintaining the deleted data in the system for a specified period of time. During the retention period, you can restore the blob to its state at deletion. After the retention period has expired, the blob is permanently deleted. For more information about blob soft delete, see [Soft delete for blobs](soft-delete-blob-overview.md).

You can use the Azure Storage client libraries to restore a soft-deleted blob or snapshot.

How you restore a soft-deleted blob depends on whether or not your storage account has blob versioning enabled. For more information on blob versioning, see [Blob versioning](../../storage/blobs/versioning-overview.md). See one of the following sections, depending on your scenario:

- [Blob versioning is not enabled](#restore-soft-deleted-objects-when-versioning-is-disabled)
- [Blob versioning is enabled](#restore-soft-deleted-objects-when-versioning-is-enabled)

#### Restore soft-deleted objects when versioning is disabled

To restore deleted blobs, call the following method:

- [undelete](/java/api/com.azure.storage.blob.specialized.blobclientbase#method-summary)

This method restores the content and metadata of a soft-deleted blob and any associated soft-deleted snapshots. Calling this method for a blob that hasn't been deleted has no effect.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDelete.java" id="Snippet_RestoreBlob":::

#### Restore soft-deleted objects when versioning is enabled

If a storage account is configured to enable blob versioning, deleting a blob causes the current version of the blob to become the previous version. To restore a soft-deleted blob when versioning is enabled, copy a previous version over the base blob. You can use the following method:

- [copyFromUrl](/java/api/com.azure.storage.blob.specialized.blobclientbase#method-summary)

This method restores the content and metadata of a soft-deleted blob and any associated soft-deleted snapshots. Calling this method for a blob that hasn't been deleted has no effect.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDelete.java" id="Snippet_RestoreBlobVersion":::

## Restore soft-deleted blobs and directories (hierarchical namespace)

> [!IMPORTANT]
> This section applies only to accounts that have a hierarchical namespace.

1. To get started, open the *pom.xml* file in your text editor. Add the following dependency element to the group of dependencies.

   ```xml
   <dependency>
     <groupId>com.azure</groupId>
     <artifactId>azure-storage-file-datalake</artifactId>
     <version>12.6.0</version>
   </dependency>
   ```

2. Then, add these imports statements to your code file.

   ```java
   Put imports here
   ```

3. The following snippet restores a soft-deleted file named `my-file`.

   This method assumes that you've created a **DataLakeServiceClient** instance. To learn how to create a **DataLakeServiceClient** instance, see [Connect to the account](data-lake-storage-directory-file-acl-java.md#authorize-access-and-connect-to-data-resources).

   ```java

   public void RestoreFile(DataLakeServiceClient serviceClient){

       DataLakeFileSystemClient fileSystemClient =
           serviceClient.getFileSystemClient("my-container");

       DataLakeFileClient fileClient =
           fileSystemClient.getFileClient("my-file");

       String deletionId = null;

       for (PathDeletedItem item : fileSystemClient.listDeletedPaths()) {

           if (item.getName().equals(fileClient.getFilePath())) {
              deletionId = item.getDeletionId();
           }
       }

       fileSystemClient.restorePath(fileClient.getFilePath(), deletionId);
    }

   ```

   If you rename the directory that contains the soft-deleted items, those items become disconnected from the directory. If you want to restore those items, you'll have to revert the name of the directory back to its original name or create a separate directory that uses the original directory name. Otherwise, you'll receive an error when you attempt to restore those soft-deleted items.

## Resources

To learn more about how to delete blobs and restore deleted blobs using the Azure Blob Storage client library for Java, see the following resources.

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDelete.java)

### REST API operations

The Azure SDK for Java contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Java paradigms. The client library methods for deleting blobs and restoring deleted blobs use the following REST API operations:

- [Delete Blob](/rest/api/storageservices/delete-blob) (REST API)
- [Undelete Blob](/rest/api/storageservices/undelete-blob) (REST API)

[!INCLUDE [storage-dev-guide-resources-java](../../../includes/storage-dev-guides/storage-dev-guide-resources-java.md)]

### See also

- [Soft delete for blobs](soft-delete-blob-overview.md)
- [Blob versioning](versioning-overview.md)

[!INCLUDE [storage-dev-guide-next-steps-java](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-java.md)]
