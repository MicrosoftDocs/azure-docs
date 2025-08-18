---
title: Upload a blob with Python
titleSuffix: Azure Storage
description: Learn how to upload a blob to your Azure Storage account using the Python client library.
services: storage
author: stevenmatthew

ms.author: shaas
ms.date: 03/25/2025
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: python
ms.custom: devx-track-python, devguide-python
# Customer intent: As a Python developer, I want to upload blobs to my cloud storage using the Python client library, so that I can efficiently manage and store data for my applications.
---

# Upload a block blob with Python

[!INCLUDE [storage-dev-guide-selector-upload](../../../includes/storage-dev-guides/storage-dev-guide-selector-upload.md)]

This article shows how to upload a blob using the [Azure Storage client library for Python](/python/api/overview/azure/storage). You can upload data to a block blob from a file path, a stream, a binary object, or a text string. You can also upload blobs with index tags.

To learn about uploading blobs using asynchronous APIs, see [Upload blobs asynchronously](#upload-blobs-asynchronously).

[!INCLUDE [storage-dev-guide-prereqs-python](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-python.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-python](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-python.md)]

#### Add import statements

Add the following `import` statements:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_upload.py" id="Snippet_imports":::

#### Authorization

The authorization mechanism must have the necessary permissions to upload a blob. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Contributor** or higher. To learn more, see the authorization guidance for [Put Blob (REST API)](/rest/api/storageservices/put-blob#authorization) and [Put Block (REST API)](/rest/api/storageservices/put-block#authorization).

[!INCLUDE [storage-dev-guide-create-client-python](../../../includes/storage-dev-guides/storage-dev-guide-create-client-python.md)]

## Upload data to a block blob

To upload a blob using a stream or a binary object, use the following method:

- [upload_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-upload-blob)

This method creates a new blob from a data source with automatic chunking, meaning that the data source may be split into smaller chunks and uploaded. To perform the upload, the client library may use either [Put Blob](/rest/api/storageservices/put-blob) or a series of [Put Block](/rest/api/storageservices/put-block) calls followed by [Put Block List](/rest/api/storageservices/put-block-list). This behavior depends on the overall size of the object and how the [data transfer options](#specify-data-transfer-options-for-upload) are set.

> [!NOTE]
> The Azure Storage client libraries don't support concurrent writes to the same blob. If your app requires multiple processes writing to the same blob, you should implement a strategy for concurrency control to provide a predictable experience. To learn more about concurrency strategies, see [Manage concurrency in Blob Storage](concurrency-manage.md).

## Upload a block blob from a local file path

The following example uploads a file to a block blob using a `BlobClient` object:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_upload.py" id="Snippet_upload_blob_file":::

## Upload a block blob from a stream

The following example creates random bytes of data and uploads a `BytesIO` object to a block blob using a `BlobClient` object:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_upload.py" id="Snippet_upload_blob_stream":::

## Upload binary data to a block blob

The following example uploads binary data to a block blob using a `BlobClient` object:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_upload.py" id="Snippet_upload_blob_data":::

## Upload a block blob with index tags

The following example uploads a block blob with index tags:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_upload.py" id="Snippet_upload_blob_tags":::

## Upload a block blob with configuration options

You can define client library configuration options when uploading a blob. These options can be tuned to improve performance, enhance reliability, and optimize costs. The following code examples show how to define configuration options for an upload both at the method level, and at the client level when instantiating [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient). These options can also be configured for a [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) instance or a [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) instance.

### Specify data transfer options for upload

You can set configuration options when instantiating a client to optimize performance for data transfer operations. You can pass the following keyword arguments when constructing a client object in Python:

- `max_block_size` - The maximum chunk size for uploading a block blob in chunks. Defaults to 4 MiB.
- `max_single_put_size` - If the blob size is less than or equal to `max_single_put_size`, the blob is uploaded with a single `Put Blob` request. If the blob size is larger than `max_single_put_size` or unknown, the blob is uploaded in chunks using `Put Block` and committed using `Put Block List`. Defaults to 64 MiB.

For more information on transfer size limits for Blob Storage, see [Scale targets for Blob storage](scalability-targets.md#scale-targets-for-blob-storage).

For upload operations, you can also pass the `max_concurrency` argument when calling [upload_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-upload-blob). This argument defines the maximum number of parallel connections to use when the blob size exceeds 64 MiB.

The following code example shows how to specify data transfer options when creating a `BlobClient` object, and how to upload data using that client object. The values provided in this sample aren't intended to be a recommendation. To properly tune these values, you need to consider the specific needs of your app.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_upload.py" id="Snippet_upload_blob_transfer_options":::

To learn more about tuning data transfer options, see [Performance tuning for uploads and downloads with Python](storage-blobs-tune-upload-download-python.md).

### Set a blob's access tier on upload

You can set a blob's access tier on upload by passing the `standard_blob_tier` keyword argument to [upload_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-upload-blob). Azure Storage offers different access tiers so that you can store your blob data in the most cost-effective manner based on how it's being used.

The following code example shows how to set the access tier when uploading a blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_upload.py" id="Snippet_upload_blob_access_tier":::

Setting the access tier is only allowed for block blobs.  You can set the access tier for a block blob to `Hot`, `Cool`, `Cold`, or `Archive`. To set the access tier to `Cold`, you must use a minimum [client library](/python/api/azure-storage-blob) version of 12.15.0.

To learn more about access tiers, see [Access tiers overview](access-tiers-overview.md).

## Upload a block blob by staging blocks and committing

You can have greater control over how to divide uploads into blocks by manually staging individual blocks of data. When all of the blocks that make up a blob are staged, you can commit them to Blob Storage.

Use the following method to create a new block to be committed as part of a blob:

- [stage_block](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-stage-block)

Use the following method to write a blob by specifying the list of block IDs that make up the blob:

- [commit_block_list](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-commit-block-list)

The following example reads data from a file and stages blocks to be committed as part of a blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_upload.py" id="Snippet_upload_blob_blocks":::

## Upload blobs asynchronously

The Azure Blob Storage client library for Python supports uploading blobs asynchronously. To learn more about project setup requirements, see [Asynchronous programming](storage-blob-python-get-started.md#asynchronous-programming).

Follow these steps to upload a blob using asynchronous APIs:

1. Add the following import statements:

    ```python
    import asyncio

    from azure.identity.aio import DefaultAzureCredential
    from azure.storage.blob.aio import BlobServiceClient, BlobClient, ContainerClient
    ```

1. Add code to run the program using `asyncio.run`. This function runs the passed coroutine, `main()` in our example, and manages the `asyncio` event loop. Coroutines are declared with the async/await syntax. In this example, the `main()` coroutine first creates the top level `BlobServiceClient` using `async with`, then calls the method that uploads the blob. Note that only the top level client needs to use `async with`, as other clients created from it share the same connection pool.

    :::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_upload_async.py" id="Snippet_create_client_async":::

1. Add code to upload the blob. The following example uploads a blob from a local file path using a `ContainerClient` object. The code is the same as the synchronous example, except that the method is declared with the `async` keyword and the `await` keyword is used when calling the `upload_blob` method.

    :::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_upload_async.py" id="Snippet_upload_blob_file":::

With this basic setup in place, you can implement other examples in this article as coroutines using async/await syntax.

## Resources

To learn more about uploading blobs using the Azure Blob Storage client library for Python, see the following resources.

### Code samples

- View [synchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob_devguide_upload.py) or [asynchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob_devguide_upload_async.py) code samples from this article (GitHub)

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for uploading blobs use the following REST API operations:

- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Block](/rest/api/storageservices/put-block) (REST API)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

### See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)

[!INCLUDE [storage-dev-guide-next-steps-python](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-python.md)]
