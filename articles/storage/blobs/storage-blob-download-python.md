---
title: Download a blob with Python
titleSuffix: Azure Storage
description: Learn how to download a blob in Azure Storage by using the Python client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 04/21/2023
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Download a blob with Python

This article shows how to download a blob using the [Azure Storage client library for Python](/python/api/overview/azure/storage). You can download blob data to various destinations, including a local file path, stream, or text string. You can also open a blob stream and read from it.

## Prerequisites

To work with the code examples in this article, make sure you have:

- An authorized client object to connect to Blob Storage data resources. To learn more, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).
- Permissions to perform an upload operation. To learn more, see the authorization guidance for the following REST API operation:
    - [Get Blob](/rest/api/storageservices/get-blob#authorization)
- The package **azure-storage-blob** installed to your project directory. To learn more about setting up your project, see [Get Started with Azure Storage and Java](storage-blob-java-get-started.md#set-up-your-project).

## Download a blob

You can use the following method to download a blob:

- [BlobClient.download_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-download-blob)

The `download_blob` method returns a [StorageStreamDownloader](/python/api/azure-storage-blob/azure.storage.blob.storagestreamdownloader) object.
 
## Download to a file path

The following example downloads a blob to a file path:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_download_blob_file":::

## Download to a stream

The following example downloads a blob to a stream. In this example, [StorageStreamDownloader.read_into](/python/api/azure-storage-blob/azure.storage.blob.storagestreamdownloader#azure-storage-blob-storagestreamdownloader-readinto) downloads the blob contents to a stream and returns the number of bytes read:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_download_blob_stream":::

## Download a blob in chunks

The following example downloads a blob and iterates over chunks in the download stream. In this example, [StorageStreamDownloader.chunks](/python/api/azure-storage-blob/azure.storage.blob.storagestreamdownloader#azure-storage-blob-storagestreamdownloader-chunks) returns an iterator, which allows you to read the blob content in chunks:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_download_blob_chunks":::

## Download to a string

The following example downloads blob contents as text. In this example, the `encoding` parameter is necessary for `readall()` to return a string, otherwise it returns bytes:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_download_blob_text":::

## Resources

To learn more about how to download blobs using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for downloading blobs use the following REST API operation:

- [Get Blob](/rest/api/storageservices/get-blob) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]