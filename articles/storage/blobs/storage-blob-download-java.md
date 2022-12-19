---
title: Download a blob with Java
titleSuffix: Azure Storage
description: Learn how to download a blob in Azure Storage by using the Java client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 11/16/2022
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: java
ms.custom: devx-track-java, devguide-java
---

# Download a blob in Azure Storage using the Java client library

This article shows how to download a blob with the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme). You can download a blob by using any of the following methods:

- [downloadContent](/java/api/com.azure.storage.blob.specialized.blobclientbase)
- [downloadStream](/java/api/com.azure.storage.blob.specialized.blobclientbase)
- [downloadToFile](/java/api/com.azure.storage.blob.specialized.blobclientbase)
 
## Download to a file path

The following example downloads a blob by using a file path:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDownload.java" id="Snippet_DownloadBLobFile":::

## Download to a stream

The following example downloads a blob to an `OutputStream`:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDownload.java" id="Snippet_DownloadBLobStream":::

## Download to a string

The following example downloads a blob to a `String` object. This example assumes that the blob is a text file.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDownload.java" id="Snippet_DownloadBLobText":::

## Download from a stream

The following example downloads a blob by opening a `BlobInputStream` and reading from the stream:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDownload.java" id="Snippet_ReadBlobStream":::

## See also

- [View code sample in GitHub](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDownload.java)
- [Quickstart: Azure Blob Storage client library for Java](storage-quickstart-blobs-java.md)
- [Get Blob](/rest/api/storageservices/get-blob) (REST API)