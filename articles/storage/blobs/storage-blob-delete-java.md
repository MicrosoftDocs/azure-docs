---
title: Delete and restore a blob with Java
titleSuffix: Azure Storage
description: Learn how to delete and restore a blob in your Azure Storage account using the Java client library
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 08/02/2023
ms.service: azure-storage
ms.topic: how-to
ms.devlang: java
ms.custom: devx-track-java, devguide-java, devx-track-extended-java
---

# Delete and restore a blob with Java

This article shows how to delete blobs with the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme).  If you've enabled [soft delete for blobs](soft-delete-blob-overview.md), you can restore deleted blobs during the retention period.

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for Java. To learn about setting up your project, including package installation, adding `import` directives, and creating an authorized client object, see [Get Started with Azure Storage and Java](storage-blob-java-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to delete a blob, or to restore a soft-deleted blob. To learn more, see the authorization guidance for the following REST API operations:
    - [Delete Blob](/rest/api/storageservices/delete-blob#authorization)
    - [Undelete Blob](/rest/api/storageservices/undelete-blob#authorization)

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

How you restore a soft-deleted blob depends on whether or not your storage account has blob versioning enabled. For more information on blob versioning, see [Blob versioning](../../storage/blobs/versioning-overview.md). See one of the following sections, depending on your scenario:

- [Blob versioning is not enabled](#restore-soft-deleted-objects-when-versioning-is-disabled)
- [Blob versioning is enabled](#restore-soft-deleted-objects-when-versioning-is-enabled)

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

### REST API operations

The Azure SDK for Java contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Java paradigms. The client library methods for deleting blobs and restoring deleted blobs use the following REST API operations:

- [Delete Blob](/rest/api/storageservices/delete-blob) (REST API)
- [Undelete Blob](/rest/api/storageservices/undelete-blob) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDelete.java)

[!INCLUDE [storage-dev-guide-resources-java](../../../includes/storage-dev-guides/storage-dev-guide-resources-java.md)]

### See also

- [Soft delete for blobs](soft-delete-blob-overview.md)
- [Blob versioning](versioning-overview.md)
