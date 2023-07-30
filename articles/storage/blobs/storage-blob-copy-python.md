---
title: Copy a blob with Python
titleSuffix: Azure Storage
description: Learn how to copy a blob in Azure Storage by using the Python client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 04/28/2023
ms.service: azure-storage
ms.topic: how-to
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Copy a blob with Python

This article provides an overview of copy operations using the [Azure Storage client library for Python](/python/api/overview/azure/storage).

## About copy operations

Copy operations can be used to move data within a storage account, between storage accounts, or into a storage account from a source outside of Azure. When using the Blob Storage client libraries to copy data resources, it's important to understand the REST API operations behind the client library methods. The following table lists REST API operations that can be used to copy data resources to a storage account. The table also includes links to detailed guidance about how to perform these operations using the [Azure Storage client library for Python](/python/api/overview/azure/storage).

| REST API operation | When to use | Client library methods | Guidance |
| --- | --- | --- | --- |
| [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) | This operation is preferred for scenarios where you want to move data into a storage account and have a URL for the source object. This operation completes synchronously. | [upload_blob_from_url](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-upload-blob-from-url) | [Copy a blob from a source object URL with Python](storage-blob-copy-url-python.md) |
| [Put Block From URL](/rest/api/storageservices/put-block-from-url) | For large objects, you can use [Put Block From URL](/rest/api/storageservices/put-block-from-url) to write individual blocks to Blob Storage, and then call [Put Block List](/rest/api/storageservices/put-block-list) to commit those blocks to a block blob. This operation completes synchronously. | [stage_block_from_url](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-stage-block-from-url) | [Copy a blob from a source object URL with Python](storage-blob-copy-url-python.md) |
| [Copy Blob](/rest/api/storageservices/copy-blob) | This operation can be used when you want asynchronous scheduling for a copy operation. | [start_copy_from_url](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-start-copy-from-url) | [Copy a blob with asynchronous scheduling using Python](storage-blob-copy-async-python.md) |

For append blobs, you can use the [Append Block From URL](/rest/api/storageservices/append-block-from-url) operation to commit a new block of data to the end of an existing append blob. The following client library method wraps this operation:

- [append_block_from_url](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-append-block-from-url)

For page blobs, you can use the [Put Page From URL](/rest/api/storageservices/put-page-from-url) operation to write a range of pages to a page blob where the contents are read from a URL. The following client library method wraps this operation:

- [upload_pages_from_url](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-upload-pages-from-url)

## Client library resources

- [Client library reference documentation](/python/api/azure-storage-blob)
- [Client library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-blob)
- [Package (PyPi)](https://pypi.org/project/azure-storage-blob/)
