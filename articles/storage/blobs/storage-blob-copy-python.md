---
title: Copy a blob with Python
titleSuffix: Azure Storage
description: Learn how to copy a blob in Azure Storage by using the Python client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 01/25/2023
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Copy a blob with Python

This article shows how to copy a blob in a storage account using the [Azure Storage client library for Python](/python/api/overview/azure/storage). It also shows how to abort a pending copy operation.

## About copying blobs

A copy operation can perform any of the following actions:

- Copy a source blob to a destination blob with a different name. The destination blob can be an existing blob of the same blob type (block, append, or page), or can be a new blob created by the copy operation.
- Copy a source blob to a destination blob with the same name, effectively replacing the destination blob. Such a copy operation removes any uncommitted blocks and overwrites the destination blob's metadata.
- Copy a source file in the Azure File service to a destination blob. The destination blob can be an existing block blob, or can be a new block blob created by the copy operation. Copying from files to page blobs or append blobs isn't supported.
- Copy a snapshot over its base blob. By promoting a snapshot to the position of the base blob, you can restore an earlier version of a blob.
- Copy a snapshot to a destination blob with a different name. The resulting destination blob is a writeable blob and not a snapshot.

The source blob for a copy operation may be one of the following types:
- Block blob
- Append blob
- Page blob
- Blob snapshot
- Blob version

If the destination blob already exists, it must be of the same blob type as the source blob. An existing destination blob will be overwritten.

The destination blob can't be modified while a copy operation is in progress. A destination blob can only have one outstanding copy operation. One way to enforce this requirement is to use a blob lease, as shown in the code example. For more information on blob leases, see [Create and manage blob leases with Python](storage-blob-lease-python.md).

The entire source blob or file is always copied. Copying a range of bytes or set of blocks isn't supported. When a blob is copied, its system properties are copied to the destination blob with the same values.

## Copy a blob

To copy a blob, use the following method:

- [BlobClient.start_copy_from_url](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-start-copy-from-url)

This method returns a dictionary containing *copy_status* and *copy_id*, which can be used to check the status of the copy operation. The *copy_status* property will be 'success' if the copy completed synchronously or 'pending' if the copy has been started asynchronously. For asynchronous copies, the status can be checked by polling the [get_blob_properties](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-get-blob-properties) method and checking *copy_status*. To force the copy operation to be synchronous, set *requires_sync* to `True`. To learn more about the underlying operation, see [REST API operations](#rest-api-operations).

The following code example gets a `BlobClient` object representing an existing blob and copies it to a new blob in a different container within the same storage account. This example also gets a lease on the source blob before copying so that no other client can modify the blob until the copy is complete and the lease is broken.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_copy_blob":::

Sample output is similar to:

```console
Source blob lease state: leased
Copy status: success
Copy progress: 5/5
Copy completion time: 2022-11-14T16:53:54Z
Total bytes copied: 5
Source blob lease state: broken
```

## Abort a copy operation

If you have a pending copy operation and need to cancel it, you can abort the operation. Aborting a copy operation results in a destination blob of zero length and full metadata. To learn more about the underlying operation, see [REST API operations](#rest-api-operations).

The metadata for the destination blob will have the new values copied from the source blob or set explicitly during the copy operation. To keep the original metadata from before the copy, make a snapshot of the destination blob before calling one of the copy methods. The final blob will be committed when the copy completes.

To abort a copy operation, use the following method:

- [BlobClient.abort_copy](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-abort-copy)

The following example stops a pending copy and leaves a destination blob with zero length and full metadata:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_abort_copy":::

## Resources

To learn more about copying blobs using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods covered in this article use the following REST API operations:

- [Copy Blob](/rest/api/storageservices/copy-blob) (REST API)
- [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]
