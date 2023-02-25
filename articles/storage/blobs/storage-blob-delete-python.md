---
title: Delete and restore a blob with Python
titleSuffix: Azure Storage
description: Learn how to delete and restore a blob in your Azure Storage account using the Python client library
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 02/16/2023
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Delete and restore a blob with Python

This article shows how to delete blobs using the [Azure Storage client library for Python](/python/api/overview/azure/storage). If you've enabled [soft delete for blobs](soft-delete-blob-overview.md), you can restore deleted blobs during the retention period.

## Delete a blob

To delete a blob, call the following method:

- [BlobClient.delete_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-delete-blob)

The following example deletes a blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_delete_blob":::

If the blob has any associated snapshots, you must delete all of its snapshots to delete the blob. The following example deletes a blob and its snapshots:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_delete_blob_snapshots":::

To delete *only* the snapshots and not the blob itself, you can pass the parameter `delete_snapshots="only"`.

## Restore a deleted blob

Blob soft delete protects an individual blob and its versions, snapshots, and metadata from accidental deletes or overwrites by maintaining the deleted data in the system for a specified period of time. During the retention period, you can restore the blob to its state at deletion. After the retention period has expired, the blob is permanently deleted. For more information about blob soft delete, see [Soft delete for blobs](soft-delete-blob-overview.md).

You can use the Azure Storage client libraries to restore a soft-deleted blob or snapshot. 

#### Restore soft-deleted objects when versioning is disabled

To restore deleted blobs when versioning is disabled, call the following method:

- [BlobClient.undelete_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-undelete-blob)

This method restores the content and metadata of a soft-deleted blob and any associated soft-deleted snapshots. Calling this method for a blob that hasn't been deleted has no effect. \

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_restore_blob":::

#### Restore soft-deleted objects when versioning is enabled

To restore a soft-deleted blob when versioning is enabled, copy a previous version over the base blob. You can use the following method:

- [start_copy_from_url](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-start-copy-from-url)

The following code example gets the latest version of a deleted blob, and restores the latest version by copying it to the base blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_restore_blob_version":::

## Restore soft-deleted blobs and directories (hierarchical namespace)

> [!IMPORTANT]
> This section applies only to accounts that have a hierarchical namespace.

1. Install version `12.4.0` or greater of the Azure Data Lake Storage client library for Python by using [pip](https://pypi.org/project/pip/). This command installs the latest version of the Azure Data Lake Storage client library for Python.

   ```
   pip install azure-storage-file-datalake
   ```

2. Add these import statements to the top of your code file.

   ```python
   import os, uuid, sys
   from azure.storage.filedatalake import DataLakeServiceClient
   from azure.storage.filedatalake import FileSystemClient
   ```

3. The following code deletes a directory, and then restores a soft-deleted directory.

   The code example below contains an object named `service_client` of type **DataLakeServiceClient**. To see examples of how to create a **DataLakeServiceClient** instance, see [Authorize access and connect to data resources](data-lake-storage-directory-file-acl-python.md#authorize-access-and-connect-to-data-resources).

    ```python
    def restoreDirectory():

        try:
            global file_system_client

            file_system_client = service_client.create_file_system(file_system="my-file-system")

            directory_path = 'my-directory'
            directory_client = file_system_client.create_directory(directory_path)
            resp = directory_client.delete_directory()

            restored_directory_client = file_system_client.undelete_path(directory_client, resp['deletion_id'])
            props = restored_directory_client.get_directory_properties()

            print(props)

        except Exception as e:
            print(e)

    ```

   If you rename the directory that contains the soft-deleted items, those items become disconnected from the directory. If you want to restore those items, you'll have to revert the name of the directory back to its original name or create a separate directory that uses the original directory name. Otherwise, you'll receive an error when you attempt to restore those soft-deleted items.

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
- [Blob versioning](versioning-overview.md)