---
title: Download a blob with Python - Azure Storage
description: Learn how to download a blob in Azure Storage by using the Python client library.
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

# Download a blob in Azure Storage using the Python client library

This article shows how to download a blob with the [Azure Storage client library for Python](/python/api/overview/azure/storage). You can download a blob by using any of the following methods:

- [BlobClient.downloadContent](/java/api/com.azure.storage.blob.specialized.blobclientbase#com-azure-storage-blob-specialized-blobclientbase-downloadcontent())
- [BlobClient.downloadStream](/java/api/com.azure.storage.blob.specialized.blobclientbase#com-azure-storage-blob-specialized-blobclientbase-downloadstream(java-io-outputstream))
- [BlobClient.downloadToFile](/java/api/com.azure.storage.blob.specialized.blobclientbase#com-azure-storage-blob-specialized-blobclientbase-downloadtofile(java-lang-string))
 
## Download to a file path

The following example downloads a blob by using a file path:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-download.py" id="Snippet_DownloadBLobFile":::

## Download to a stream

The following example downloads a blob to an `OutputStream`:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-download.py" id="Snippet_DownloadBLobStream":::

## Download to a string

The following example downloads a blob to a `String` object. This example assumes that the blob is a text file.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-download.py" id="Snippet_DownloadBLobText":::

## Download from a stream

The following example downloads a blob by opening a `BlobInputStream` and reading from the stream:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-download.py" id="Snippet_ReadBlobStream":::

## See also

- [View code sample in GitHub](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Python/blob-devguide/blob-devguide/blob-download.py)
- [Quickstart: Azure Blob Storage client library for Python](storage-quickstart-blobs-python.md)
- [Get Blob](/rest/api/storageservices/get-blob) (REST API)