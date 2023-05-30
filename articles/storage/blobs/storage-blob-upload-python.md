---
title: Upload a blob with Python
titleSuffix: Azure Storage
description: Learn how to upload a blob to your Azure Storage account using the Python client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 05/01/2023
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Upload a block blob with Python

This article shows how to upload a blob using the [Azure Storage client library for Python](/python/api/overview/azure/storage). You can upload data to a block blob from a file path, a stream, a binary object, or a text string. You can also upload blobs with index tags.

## Prerequisites

To work with the code examples in this article, make sure you have:

- An authorized client object to connect to Blob Storage data resources. To learn more, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).
- Permissions to perform an upload operation. To learn more, see the authorization guidance for the following REST API operations:
    - [Put Blob](/rest/api/storageservices/put-blob#authorization)
    - [Put Block](/rest/api/storageservices/put-block#authorization)
- The package **azure-storage-blob** installed to your project directory. To learn more about setting up your project, see [Get Started with Azure Storage and Python](storage-blob-python-get-started.md#set-up-your-project).

## Upload data to a block blob

To upload a blob using a stream or a binary object, use the following method:

- [upload_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-upload-blob)

This method creates a new blob from a data source with automatic chunking. The client library may call either [Put Blob](/rest/api/storageservices/put-blob) or [Put Block](/rest/api/storageservices/put-block), depending on the overall size of the object and how the [data transfer options](#specify-data-transfer-options-for-upload) are set.

## Upload a block blob from a local file path

The following example uploads a file to a block blob using a `BlobClient` object:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-upload.py" id="Snippet_upload_blob_file":::

## Upload a block blob from a stream

The following example creates random bytes of data and uploads a `BytesIO` object to a block blob using a `BlobClient` object:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-upload.py" id="Snippet_upload_blob_stream":::

## Upload binary data to a block blob

The following example uploads binary data to a block blob using a `BlobClient` object:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-upload.py" id="Snippet_upload_blob_data":::

## Upload a block blob with index tags

The following example uploads a block blob with index tags:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-upload.py" id="Snippet_upload_blob_tags":::

## Upload a block blob by staging blocks and committing

You can have greater control over how to divide uploads into blocks by manually staging individual blocks of data. When all of the blocks that make up a blob are staged, you can commit them to Blob Storage.

Use the following method to create a new block to be committed as part of a blob:

- [stage_block](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-stage-block)

Use the following method to write a blob by specifying the list of block IDs that make up the blob:

- [commit_block_list](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-commit-block-list)

The following example reads data from a file and stages blocks to be committed as part of a blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-upload.py" id="Snippet_upload_blob_blocks":::

## Upload a block blob with configuration options

You can define client library configuration options when uploading a blob. These options can be tuned to improve performance, enhance reliability, and optimize costs. The following code examples show how to define configuration options for an upload when instantiating a [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient). These options can also be configured for a [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) instance or a [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) instance.

> [!NOTE]
> Configuration options need to be passed to the constructor for each client instance that the options apply to. The optional configuration arguments are *not* inherited by a client object that is created from a client for a higher level resource. For example, if you specify configuration options for a new `ContainerClient` instance, those options are *not* applied to a `BlobClient` instance created from the container client using `get_blob_client`. You should construct a new `BlobClient` instance with the desired configuration options.

### Specify data transfer options for upload

You can set configuration options when instantiating a client to optimize performance for data transfer operations. You can pass the following keyword arguments when constructing a client object in Python:

- `max_block_size` - The maximum chunk size for uploading a block blob in chunks. Defaults to 4 MiB.
- `max_single_put_size` - If the blob size is less than or equal to `max_single_put_size`, the blob is uploaded with a single `Put Blob` request. If the blob size is larger than `max_single_put_size`, the blob is uploaded in chunks using `Put Block` and committed using `Put Block List`. Defaults to 64 MiB.

For upload operations, you can also pass the `max_concurrency` argument when calling [upload_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-upload-blob). This argument defines the maximum number of parallel connections to use when the blob size exceeds 64 MiB.

The following code example shows how to specify data transfer options when creating a `BlobClient` object, and how to upload data using that client object:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-upload.py" id="Snippet_upload_blob_blocks":::

## Resources

To learn more about uploading blobs using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for uploading blobs use the following REST API operations:

- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Block](/rest/api/storageservices/put-block) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

### See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)