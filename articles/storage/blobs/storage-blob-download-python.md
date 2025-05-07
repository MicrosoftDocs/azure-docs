---
title: Download a blob with Python
titleSuffix: Azure Storage
description: Learn how to download a blob in Azure Storage by using the Python client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 08/05/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Download a blob with Python

[!INCLUDE [storage-dev-guide-selector-download](../../../includes/storage-dev-guides/storage-dev-guide-selector-download.md)]

This article shows how to download a blob using the [Azure Storage client library for Python](/python/api/overview/azure/storage). You can download blob data to various destinations, including a local file path, stream, or text string. You can also open a blob stream and read from it.

To learn about downloading blobs using asynchronous APIs, see [Download blobs asynchronously](#download-blobs-asynchronously).

[!INCLUDE [storage-dev-guide-prereqs-python](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-python.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-python](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-python.md)]

#### Add import statements

Add the following `import` statements:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_download.py" id="Snippet_imports":::

#### Authorization

The authorization mechanism must have the necessary permissions to perform a download operation. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Reader** or higher. To learn more, see the authorization guidance for [Get Blob (REST API)](/rest/api/storageservices/get-blob#authorization).

[!INCLUDE [storage-dev-guide-create-client-python](../../../includes/storage-dev-guides/storage-dev-guide-create-client-python.md)]

## Download a blob

You can use the following method to download a blob:

- [BlobClient.download_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-download-blob)

The `download_blob` method returns a [StorageStreamDownloader](/python/api/azure-storage-blob/azure.storage.blob.storagestreamdownloader) object. During a download, the client libraries split the download request into chunks, where each chunk is downloaded with a separate [Get Blob](/rest/api/storageservices/get-blob) range request. This behavior depends on the total size of the blob and how the [data transfer options](#specify-data-transfer-options-on-download) are set.
 
## Download to a file path

The following example downloads a blob to a file path:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_download.py" id="Snippet_download_blob_file":::

## Download to a stream

The following example downloads a blob to a stream. In this example, [StorageStreamDownloader.read_into](/python/api/azure-storage-blob/azure.storage.blob.storagestreamdownloader#azure-storage-blob-storagestreamdownloader-readinto) downloads the blob contents to a stream and returns the number of bytes read:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_download.py" id="Snippet_download_blob_stream":::

## Download a blob in chunks

The following example downloads a blob and iterates over chunks in the download stream. In this example, [StorageStreamDownloader.chunks](/python/api/azure-storage-blob/azure.storage.blob.storagestreamdownloader#azure-storage-blob-storagestreamdownloader-chunks) returns an iterator, which allows you to read the blob content in chunks:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_download.py" id="Snippet_download_blob_chunks":::

## Download to a string

The following example downloads blob contents as text. In this example, the `encoding` parameter is necessary for `readall()` to return a string, otherwise it returns bytes:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_download.py" id="Snippet_download_blob_text":::

## Download a block blob with configuration options

You can define client library configuration options when downloading a blob. These options can be tuned to improve performance and enhance reliability. The following code examples show how to define configuration options for a download both at the method level, and at the client level when instantiating [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient). These options can also be configured for a [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) instance or a [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) instance.

### Specify data transfer options on download

You can set configuration options when instantiating a client to optimize performance for data transfer operations. You can pass the following keyword arguments when constructing a client object in Python:

- `max_chunk_get_size` - The maximum chunk size used for downloading a blob. Defaults to 4 MiB.
- `max_single_get_size` - The maximum size for a blob to be downloaded in a single call. If the total blob size exceeds `max_single_get_size`, the remainder of the blob data is downloaded in chunks. Defaults to 32 MiB.

For download operations, you can also pass the `max_concurrency` argument when calling [download_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-download-blob). This argument defines the maximum number of parallel connections for the download operation.

The following code example shows how to specify data transfer options when creating a `BlobClient` object, and how to download data using that client object. The values provided in this sample aren't intended to be a recommendation. To properly tune these values, you need to consider the specific needs of your app.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_download.py" id="Snippet_download_blob_transfer_options":::

## Download blobs asynchronously

The Azure Blob Storage client library for Python supports downloading blobs asynchronously. To learn more about project setup requirements, see [Asynchronous programming](storage-blob-python-get-started.md#asynchronous-programming).

Follow these steps to download a blob using asynchronous APIs:

1. Add the following import statements:

    ```python
    import asyncio

    from azure.identity.aio import DefaultAzureCredential
    from azure.storage.blob.aio import BlobServiceClient, BlobClient
    ```

1. Add code to run the program using `asyncio.run`. This function runs the passed coroutine, `main()` in our example, and manages the `asyncio` event loop. Coroutines are declared with the async/await syntax. In this example, the `main()` coroutine first creates the top level `BlobServiceClient` using `async with`, then calls the method that downloads the blob. Note that only the top level client needs to use `async with`, as other clients created from it share the same connection pool.

    :::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_download_async.py" id="Snippet_create_client_async":::

1. Add code to download the blob. The following example downloads a blob to a local file path using a `BlobClient` object. The code is the same as the synchronous example, except that the method is declared with the `async` keyword and the `await` keyword is used when calling the `download_blob` method.

    :::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_download_async.py" id="Snippet_download_blob_file":::

With this basic setup in place, you can implement other examples in this article as coroutines using async/await syntax.

## Resources

To learn more about how to download blobs using the Azure Blob Storage client library for Python, see the following resources.

### Code samples

- View [synchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob_devguide_download.py) or [asynchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob_devguide_download_async.py) code samples from this article (GitHub)

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for downloading blobs use the following REST API operation:

- [Get Blob](/rest/api/storageservices/get-blob) (REST API)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

[!INCLUDE [storage-dev-guide-next-steps-python](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-python.md)]