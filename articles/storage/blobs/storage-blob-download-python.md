---
title: Download a blob with Python
titleSuffix: Azure Storage
description: Learn how to download a blob in Azure Storage by using the Python client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 08/02/2023
ms.service: azure-storage
ms.topic: how-to
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Download a blob with Python

This article shows how to download a blob using the [Azure Storage client library for Python](/python/api/overview/azure/storage). You can download blob data to various destinations, including a local file path, stream, or text string. You can also open a blob stream and read from it.

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for Python. To learn about setting up your project, including package installation, adding `import` statements, and creating an authorized client object, see [Get started with Azure Blob Storage and Python](storage-blob-python-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to perform a download operation. To learn more, see the authorization guidance for the following REST API operation:
    - [Get Blob](/rest/api/storageservices/get-blob#authorization)

## Download a blob

You can use the following method to download a blob:

- [BlobClient.download_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-download-blob)

The `download_blob` method returns a [StorageStreamDownloader](/python/api/azure-storage-blob/azure.storage.blob.storagestreamdownloader) object. During a download, the client libraries split the download request into chunks, where each chunk is downloaded with a separate [Get Blob](/rest/api/storageservices/get-blob) range request. This behavior depends on the total size of the blob and how the [data transfer options](#specify-data-transfer-options-on-download) are set.
 
## Download to a file path

The following example downloads a blob to a file path:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-download.py" id="Snippet_download_blob_file":::

## Download to a stream

The following example downloads a blob to a stream. In this example, [StorageStreamDownloader.read_into](/python/api/azure-storage-blob/azure.storage.blob.storagestreamdownloader#azure-storage-blob-storagestreamdownloader-readinto) downloads the blob contents to a stream and returns the number of bytes read:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-download.py" id="Snippet_download_blob_stream":::

## Download a blob in chunks

The following example downloads a blob and iterates over chunks in the download stream. In this example, [StorageStreamDownloader.chunks](/python/api/azure-storage-blob/azure.storage.blob.storagestreamdownloader#azure-storage-blob-storagestreamdownloader-chunks) returns an iterator, which allows you to read the blob content in chunks:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-download.py" id="Snippet_download_blob_chunks":::

## Download to a string

The following example downloads blob contents as text. In this example, the `encoding` parameter is necessary for `readall()` to return a string, otherwise it returns bytes:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-download.py" id="Snippet_download_blob_text":::

## Download a block blob with configuration options

You can define client library configuration options when downloading a blob. These options can be tuned to improve performance and enhance reliability. The following code examples show how to define configuration options for a download both at the method level, and at the client level when instantiating [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient). These options can also be configured for a [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) instance or a [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) instance.

### Specify data transfer options on download

You can set configuration options when instantiating a client to optimize performance for data transfer operations. You can pass the following keyword arguments when constructing a client object in Python:

- `max_chunk_get_size` - The maximum chunk size used for downloading a blob. Defaults to 4 MiB.
- `max_single_get_size` - The maximum size for a blob to be downloaded in a single call. If the total blob size exceeds `max_single_get_size`, the remainder of the blob data is downloaded in chunks. Defaults to 32 MiB.

For download operations, you can also pass the `max_concurrency` argument when calling [download_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-download-blob). This argument defines the maximum number of parallel connections for the download operation.

The following code example shows how to specify data transfer options when creating a `BlobClient` object, and how to download data using that client object. The values provided in this sample aren't intended to be a recommendation. To properly tune these values, you need to consider the specific needs of your app.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-download.py" id="Snippet_download_blob_transfer_options":::

## Resources

To learn more about how to download blobs using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for downloading blobs use the following REST API operation:

- [Get Blob](/rest/api/storageservices/get-blob) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob-devguide-download.py)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]