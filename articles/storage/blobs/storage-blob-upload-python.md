---
title: Upload a blob with Python
titleSuffix: Azure Storage
description: Learn how to upload a blob to your Azure Storage account using the Python client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 01/19/2023
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Upload a block blob with Python

This article shows how to upload a blob using the [Azure Storage client library for Python](/python/api/overview/azure/storage). You can upload a blob, open a blob stream and write to the stream, or upload blobs with index tags.

Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. To learn how to create a container, see [Create a container in Azure Storage with Python](storage-blob-container-create-python.md). 

To upload a blob using a stream or a binary object, use the following method:

- [BlobClient.upload_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-upload-blob)

To upload a blob from a given URL, use the following method:

- [BlobClient.upload_blob_from_url](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-upload-blob-from-url)

## Upload data to a block blob

The following example uploads data to a block blob using a `BlobClient` object:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_upload_blob_data":::

## Upload a block blob from a stream

The following example creates random bytes of data and uploads a `BytesIO` object to a block blob using a `BlobClient` object:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_upload_blob_stream":::

## Upload a block blob from a local file path

The following example uploads a file to a block blob using a `BlobClient` object:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_upload_blob_file":::

## Upload a block blob with index tags

The following example uploads a block blob with index tags:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_upload_blob_tags":::

## Resources

To learn more about uploading blobs using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for uploading blobs use the following REST API operations:

- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

### See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)