---
title: Upload a blob using Python
titleSuffix: Azure Storage
description: Learn how to upload a blob to your Azure Storage account using the Python client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 11/16/2022
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Upload a blob to Azure Storage using the Python client library

This article shows how to upload a blob using the [Azure Storage client library for Python](/python/api/overview/azure/storage). You can upload a blob, open a blob stream and write to the stream, or upload blobs with index tags.

> [!NOTE]
> Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. To learn how to create a container, see [Create a container in Azure Storage with Python](storage-blob-container-create-python.md). 

To upload a blob using a stream or a binary object, use the following method:

- [BlobClient.upload_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-upload-blob)

To upload a blob from a given URL, use the following method:

- [BlobClient.upload_blob_from_url](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-upload-blob-from-url)

## Upload data to a blob

The following example uploads `BinaryData` to a blob using a `BlobClient` object:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-upload.py" id="Snippet_UploadBlobData":::

## Upload a block blob from a stream

The following example uploads stream data to a blob using a [BlockBlobClient](/java/api/com.azure.storage.blob.specialized.blockblobclient) object.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-upload.py" id="Snippet_UploadBlobStream":::

## Upload a blob from a local file path

The following example uploads a file to a blob using a `BlobClient` object:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-upload.py" id="Snippet_UploadBlobFile":::

## Upload a block blob with index tags

The following example uploads a block blob with index tags set using `BlobUploadFromFileOptions`:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-upload.py" id="Snippet_UploadBlobTags":::

## See also

- [View code sample in GitHub](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Python/blob-devguide/blob-devguide/blob-upload.py)
- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)
- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) (REST API)